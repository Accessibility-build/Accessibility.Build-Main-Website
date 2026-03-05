#!/usr/bin/env node

import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import pg from 'pg'

const { Client } = pg

function loadEnv() {
  const cwd = process.cwd()
  for (const filename of ['.env.local', '.env']) {
    const filePath = path.join(cwd, filename)
    if (fs.existsSync(filePath)) {
      dotenv.config({ path: filePath, override: true })
    }
  }
}

function parseArgs() {
  const args = process.argv.slice(2)
  const result = {}

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]
    if (!arg.startsWith('--')) continue
    const key = arg.slice(2)
    const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : 'true'
    result[key] = value
    if (value !== 'true') i += 1
  }

  return result
}

function required(name, value) {
  if (!value) {
    throw new Error(`${name} is required`)
  }
  return value
}

function nowIso() {
  return new Date().toISOString()
}

async function clerkPost(pathname, body, clerkSecretKey) {
  const response = await fetch(`https://api.clerk.com/v1${pathname}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${clerkSecretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(`Clerk API ${pathname} failed (${response.status}): ${JSON.stringify(payload)}`)
  }
  return payload
}

async function createClerkSessionToken(userId, clerkSecretKey) {
  const session = await clerkPost('/sessions', { user_id: userId }, clerkSecretKey)
  const tokenPayload = await clerkPost(
    `/sessions/${session.id}/tokens`,
    { expires_in_seconds: 3600 },
    clerkSecretKey
  )

  const token = tokenPayload.jwt || tokenPayload.token
  if (!token) {
    throw new Error('Clerk did not return a session token')
  }
  return token
}

async function appRequest(baseUrl, pathname, token, body) {
  const method = body ? 'POST' : 'GET'
  const response = await fetch(`${baseUrl}${pathname}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

  const rawText = await response.text()
  let payload
  try {
    payload = JSON.parse(rawText)
  } catch {
    payload = { raw: rawText }
  }

  return {
    ok: response.ok,
    status: response.status,
    payload,
  }
}

function signWebhookPayload(rawBody, webhookSecret) {
  return crypto.createHmac('sha256', webhookSecret).update(rawBody, 'utf8').digest('hex')
}

async function postRazorpayWebhook(baseUrl, webhookSecret, eventId, payload) {
  const rawBody = JSON.stringify(payload)
  const signature = signWebhookPayload(rawBody, webhookSecret)

  const response = await fetch(`${baseUrl}/api/webhooks/razorpay`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-razorpay-signature': signature,
      'x-razorpay-event-id': eventId,
      'x-razorpay-event': payload.event,
    },
    body: rawBody,
  })

  const data = await response.json().catch(() => ({}))
  return {
    ok: response.ok,
    status: response.status,
    payload: data,
  }
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

async function waitForPaidOrder(db, orderId, maxAttempts = 20, delayMs = 1500) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const result = await db.query(
      `select id, status, credits, provider_order_id, provider_payment_id, credit_transaction_id
       from billing_orders
       where id = $1
       limit 1`,
      [orderId]
    )

    const row = result.rows[0]
    if (row && row.status === 'paid' && row.credit_transaction_id) {
      return row
    }

    if (attempt < maxAttempts) {
      await sleep(delayMs)
    }
  }

  return null
}

async function main() {
  loadEnv()
  const args = parseArgs()

  const appUrl = (args['app-url'] || process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/$/, '')
  const userId = required('user-id', args['user-id'] || process.env.TEST_CLERK_USER_ID)
  const catalogKey = args['catalog-key'] || 'starter_50'
  const currency = args.currency === 'INR' ? 'INR' : 'USD'
  const webhookSecret = required(
    'webhook secret',
    args['webhook-secret'] || process.env.RAZORPAY_WEBHOOK_SECRET
  )
  const clerkSecretKey = required('CLERK_SECRET_KEY', process.env.CLERK_SECRET_KEY)
  const databaseUrl = required('DATABASE_URL', process.env.DATABASE_URL)

  if (!appUrl) {
    throw new Error('app-url is required (or set NEXT_PUBLIC_APP_URL)')
  }

  const db = new Client({ connectionString: databaseUrl })
  await db.connect()

  const runId = Date.now().toString(36)
  const eventId = `evt_auto_${runId}`
  const paymentId = `pay_auto_${runId}`

  try {
    const sessionToken = await createClerkSessionToken(userId, clerkSecretKey)

    const userBefore = await db.query(
      `select id, credits, total_credits_earned, total_credits_used, is_active
       from users
       where id = $1
       limit 1`,
      [userId]
    )
    if (!userBefore.rowCount) {
      throw new Error(`User not found: ${userId}`)
    }

    const apiCreditsBefore = await appRequest(appUrl, '/api/user/credits', sessionToken)
    if (!apiCreditsBefore.ok) {
      throw new Error(`GET /api/user/credits failed: ${apiCreditsBefore.status}`)
    }

    const checkout = await appRequest(appUrl, '/api/billing/checkout-session', sessionToken, {
      catalogKey,
      currency,
      returnPath: '/billing',
    })
    if (!checkout.ok) {
      throw new Error(
        `POST /api/billing/checkout-session failed (${checkout.status}): ${JSON.stringify(
          checkout.payload
        )}`
      )
    }
    if (checkout.payload.mode !== 'razorpay_order') {
      throw new Error(`Unexpected checkout mode: ${checkout.payload.mode}`)
    }

    const orderId = checkout.payload.orderId
    const providerOrderId = checkout.payload.razorpayOrderId
    if (!orderId || !providerOrderId) {
      throw new Error(`Checkout response missing order IDs: ${JSON.stringify(checkout.payload)}`)
    }

    const orderBeforeWebhook = await db.query(
      `select id, credits, amount_total, status, payment_provider
       from billing_orders
       where id = $1
       limit 1`,
      [orderId]
    )
    if (!orderBeforeWebhook.rowCount) {
      throw new Error(`Order not found after checkout: ${orderId}`)
    }

    const orderRow = orderBeforeWebhook.rows[0]
    const orderCredits = Number(orderRow.credits || 0)
    const amountMinor = Number(orderRow.amount_total || checkout.payload.amountMinor || 0)
    if (orderCredits <= 0) {
      throw new Error(`Order credits invalid: ${orderCredits}`)
    }
    if (orderRow.payment_provider !== 'razorpay') {
      throw new Error(`Unexpected provider for order ${orderId}: ${orderRow.payment_provider}`)
    }

    const webhookPayload = {
      entity: 'event',
      account_id: 'acc_test',
      event: 'payment.captured',
      contains: ['payment'],
      payload: {
        payment: {
          entity: {
            id: paymentId,
            entity: 'payment',
            amount: amountMinor,
            currency,
            status: 'captured',
            order_id: providerOrderId,
            captured: true,
            notes: {
              appOrderId: orderId,
              userId,
              catalogKey,
              credits: String(orderCredits),
            },
          },
        },
      },
      created_at: Math.floor(Date.now() / 1000),
    }

    const webhookResult = await postRazorpayWebhook(appUrl, webhookSecret, eventId, webhookPayload)
    if (!webhookResult.ok) {
      throw new Error(
        `Webhook failed (${webhookResult.status}): ${JSON.stringify(webhookResult.payload)}`
      )
    }

    const paidOrder = await waitForPaidOrder(db, orderId)
    if (!paidOrder) {
      throw new Error(`Order did not reach paid state in time: ${orderId}`)
    }

    const userAfterPurchase = await db.query(
      `select credits, total_credits_earned, total_credits_used
       from users
       where id = $1
       limit 1`,
      [userId]
    )
    const creditsBefore = Number(userBefore.rows[0].credits || 0)
    const creditsAfterPurchase = Number(userAfterPurchase.rows[0].credits || 0)
    const purchaseDelta = creditsAfterPurchase - creditsBefore
    if (purchaseDelta !== orderCredits) {
      throw new Error(
        `Credit grant mismatch. Expected +${orderCredits}, got ${purchaseDelta} (before=${creditsBefore}, after=${creditsAfterPurchase})`
      )
    }

    const usageCountBefore = await db.query(
      `select count(*)::int as total
       from credit_transactions
       where user_id = $1
         and type = 'usage'`,
      [userId]
    )

    const toolCall = await appRequest(appUrl, '/api/analyze-accessibility-issue', sessionToken, {
      issueDescription: 'Button has no accessible name for screen readers.',
      techStack: 'nextjs',
      componentType: 'button',
    })
    if (!toolCall.ok) {
      throw new Error(
        `POST /api/analyze-accessibility-issue failed (${toolCall.status}): ${JSON.stringify(
          toolCall.payload
        )}`
      )
    }

    const apiCreditsAfterTool = await appRequest(appUrl, '/api/user/credits', sessionToken)
    if (!apiCreditsAfterTool.ok) {
      throw new Error(`GET /api/user/credits after tool failed: ${apiCreditsAfterTool.status}`)
    }

    const userAfterTool = await db.query(
      `select credits, total_credits_earned, total_credits_used
       from users
       where id = $1
       limit 1`,
      [userId]
    )
    const creditsAfterTool = Number(userAfterTool.rows[0].credits || 0)
    const toolDelta = creditsAfterTool - creditsAfterPurchase

    const usageCountAfter = await db.query(
      `select count(*)::int as total
       from credit_transactions
       where user_id = $1
         and type = 'usage'`,
      [userId]
    )

    const latestUsageTx = await db.query(
      `select id, type, amount, tool_used, description, created_at
       from credit_transactions
       where user_id = $1
         and type = 'usage'
       order by created_at desc
       limit 1`,
      [userId]
    )

    const usageBefore = Number(usageCountBefore.rows[0]?.total || 0)
    const usageAfter = Number(usageCountAfter.rows[0]?.total || 0)
    const creditsUsedFromResponse =
      typeof toolCall.payload?.creditsUsed === 'number' ? Number(toolCall.payload.creditsUsed) : null

    const usageRecorded = usageAfter > usageBefore
    const creditsDecremented = creditsAfterTool < creditsAfterPurchase

    if (!usageRecorded || !creditsDecremented) {
      throw new Error(
        `Tool usage was not charged correctly. usageRecorded=${usageRecorded}, creditsDecremented=${creditsDecremented}, toolResponse=${JSON.stringify(
          {
            creditsUsed: toolCall.payload?.creditsUsed,
            remainingCredits: toolCall.payload?.remainingCredits,
            trialStatus: toolCall.payload?.trialStatus,
            unlimitedAccess: toolCall.payload?.unlimitedAccess,
          }
        )}`
      )
    }

    const summary = {
      timestamp: nowIso(),
      appUrl,
      userId,
      orderId,
      providerOrderId,
      providerPaymentId: paidOrder.provider_payment_id,
      webhookEventId: eventId,
      webhookAccepted: webhookResult.payload,
      credits: {
        beforePurchase: creditsBefore,
        afterPurchase: creditsAfterPurchase,
        afterTool: creditsAfterTool,
        purchaseDelta,
        toolDelta,
      },
      apiCredits: {
        before: apiCreditsBefore.payload,
        afterTool: apiCreditsAfterTool.payload,
      },
      toolCall: {
        status: toolCall.status,
        responseSample:
          typeof toolCall.payload === 'object' && toolCall.payload
            ? {
                creditsUsed: toolCall.payload.creditsUsed,
                remainingCredits: toolCall.payload.remainingCredits,
                unlimitedAccess: toolCall.payload.unlimitedAccess,
              }
            : toolCall.payload,
      },
      toolUsageValidation: {
        usageCountBefore: usageBefore,
        usageCountAfter: usageAfter,
        usageRecorded,
        creditsDecremented,
        creditsUsedFromResponse,
      },
      usageTransaction: latestUsageTx.rows[0],
    }

    console.log(JSON.stringify(summary, null, 2))
  } finally {
    await db.end()
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
