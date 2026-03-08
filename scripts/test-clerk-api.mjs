#!/usr/bin/env node

import assert from 'node:assert/strict'
import {
  appRequest,
  connectDb,
  createClerkTestEmail,
  createSessionToken,
  createStrongPassword,
  createTestId,
  deleteBillingEventsByRunIds,
  deleteDbUser,
  deriveUrl,
  ensureServer,
  getBaseUrl,
  getClerkClient,
  getClerkUserByEmail,
  loadEnv,
  requiredEnv,
} from './clerk-test-utils.mjs'

loadEnv()

const defaultCredits = Number.parseInt(process.env.DEFAULT_CREDITS || '100', 10) || 100
const baseUrl = deriveUrl(getBaseUrl(), 20)
const clerkClient = getClerkClient()
const adminEmails = (requiredEnv('ADMIN_EMAIL') || '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean)

const failures = []
const createdSessionIds = []
const billingRunIds = []

function logCaseStart(name) {
  console.log(`\n[clerk:api] ${name}`)
}

function recordFailure(name, error) {
  failures.push({
    name,
    error: error instanceof Error ? error : new Error(String(error)),
  })
  console.error(`[clerk:api] FAIL ${name}: ${failures.at(-1).error.message}`)
}

async function runCase(name, fn) {
  logCaseStart(name)

  try {
    await fn()
    console.log(`[clerk:api] PASS ${name}`)
  } catch (error) {
    recordFailure(name, error)
  }
}

async function requestAsUser({ userId, pathname, method = 'GET', body, responseType }) {
  let session = await createSessionToken(clerkClient, userId)
  createdSessionIds.push(session.sessionId)

  const response = await appRequest({
    baseUrl,
    pathname,
    method,
    body,
    token: session.token,
    responseType,
  })

  if (response.status !== 401) {
    return response
  }

  session = await createSessionToken(clerkClient, userId)
  createdSessionIds.push(session.sessionId)

  return appRequest({
    baseUrl,
    pathname,
    method,
    body,
    token: session.token,
    responseType,
  })
}

async function createRevokedToken(userId) {
  const session = await createSessionToken(clerkClient, userId)
  createdSessionIds.push(session.sessionId)
  await clerkClient.sessions.revokeSession(session.sessionId)
  return session.token
}

function assertUnauthorized(response, expectedSignInPath) {
  assert.equal(response.status, 401, `expected 401, received ${response.status}`)
  assert.equal(response.json?.error, 'Authentication required')

  if (expectedSignInPath) {
    assert.equal(response.json?.signInUrl, expectedSignInPath)
  }
}

async function main() {
  const server = await ensureServer({
    baseUrl,
    label: 'clerk-api-server',
    envOverrides: {
      EMAIL_SERVICE_ENABLED: process.env.EMAIL_SERVICE_ENABLED ?? 'false',
      EMAIL_MARKETING_ENABLED: process.env.EMAIL_MARKETING_ENABLED ?? 'false',
    },
  })
  const db = await connectDb()

  let disposableUser = null

  try {
    const standardUserEmail = requiredEnv('E2E_CLERK_USER_EMAIL').toLowerCase()
    const adminUserEmail = requiredEnv('E2E_CLERK_ADMIN_EMAIL').toLowerCase()
    const standardUser = await getClerkUserByEmail(clerkClient, standardUserEmail)
    const adminUser = await getClerkUserByEmail(clerkClient, adminUserEmail)

    assert(standardUser, `No Clerk user found for ${standardUserEmail}`)
    assert(adminUser, `No Clerk user found for ${adminUserEmail}`)
    assert(
      adminEmails.includes(adminUserEmail),
      `ADMIN_EMAIL must include ${adminUserEmail} for admin route coverage`
    )

    await runCase('GET /api/user/credits rejects anonymous requests', async () => {
      const response = await appRequest({
        baseUrl,
        pathname: '/api/user/credits',
      })

      assertUnauthorized(response)
    })

    await runCase('GET /api/user/credits rejects invalid bearer tokens', async () => {
      const response = await appRequest({
        baseUrl,
        pathname: '/api/user/credits',
        token: 'invalid-session-token',
      })

      assertUnauthorized(response)
    })

    await runCase('GET /api/user/credits rejects revoked bearer tokens', async () => {
      const response = await appRequest({
        baseUrl,
        pathname: '/api/user/credits',
        token: await createRevokedToken(standardUser.id),
      })

      assertUnauthorized(response)
    })

    await runCase('GET /api/user/credits returns stats for a valid Clerk session', async () => {
      const response = await requestAsUser({
        userId: standardUser.id,
        pathname: '/api/user/credits',
      })

      assert.equal(response.status, 200)
      assert.equal(typeof response.json?.currentCredits, 'number')
      assert.equal(typeof response.json?.totalCreditsEarned, 'number')
      assert.equal(typeof response.json?.totalCreditsUsed, 'number')
    })

    await runCase('GET /api/user/credits bootstraps a first-time Clerk user into the database', async () => {
      const email = createClerkTestEmail('api_bootstrap')

      disposableUser = await clerkClient.users.createUser({
        emailAddress: [email],
        password: createStrongPassword(),
        firstName: 'API',
        lastName: 'Bootstrap',
        skipPasswordChecks: true,
      })

      await deleteDbUser({
        db,
        userId: disposableUser.id,
        email,
      })

      const response = await requestAsUser({
        userId: disposableUser.id,
        pathname: '/api/user/credits',
      })

      assert.equal(response.status, 200)

      const userResult = await db.query(
        `select id, email, credits, total_credits_earned, total_credits_used, is_active
         from users
         where id = $1
         limit 1`,
        [disposableUser.id]
      )

      assert.equal(userResult.rowCount, 1)
      assert.equal(userResult.rows[0].email, email.toLowerCase())
      assert.equal(Number(userResult.rows[0].credits), defaultCredits)
      assert.equal(Number(userResult.rows[0].total_credits_earned), defaultCredits)
      assert.equal(Number(userResult.rows[0].total_credits_used), 0)
      assert.equal(userResult.rows[0].is_active, true)

      const txResult = await db.query(
        `select type, amount, description
         from credit_transactions
         where user_id = $1
         order by created_at desc
         limit 1`,
        [disposableUser.id]
      )

      assert.equal(txResult.rowCount, 1)
      assert.equal(txResult.rows[0].type, 'bonus')
      assert.equal(Number(txResult.rows[0].amount), defaultCredits)
      assert.match(txResult.rows[0].description, /welcome bonus/i)
    })

    const protectedRouteChecks = [
      {
        name: 'POST /api/billing/checkout-session',
        pathname: '/api/billing/checkout-session',
        method: 'POST',
        body: {
          catalogKey: 'starter_50',
          currency: 'USD',
          returnPath: '/pricing',
        },
        signInUrl: '/sign-in?redirect_url=%2Fpricing%3FcheckoutCatalogKey%3Dstarter_50%26checkoutCurrency%3DUSD',
      },
      {
        name: 'POST /api/billing/manage-session',
        pathname: '/api/billing/manage-session',
        method: 'POST',
        body: {
          returnPath: '/billing/manage',
        },
        signInUrl: '/sign-in?redirect_url=%2Fbilling%2Fmanage',
      },
      {
        name: 'POST /api/billing/portal-session',
        pathname: '/api/billing/portal-session',
        method: 'POST',
        body: {
          returnPath: '/billing/manage',
        },
        signInUrl: '/sign-in?redirect_url=%2Fbilling%2Fmanage',
      },
      {
        name: 'POST /api/billing/payment-link',
        pathname: '/api/billing/payment-link',
        method: 'POST',
        body: {
          orderId: createTestId('order'),
        },
        signInUrl: '/sign-in?redirect_url=%2Fbilling',
      },
      {
        name: 'GET /api/billing/receipt/[orderId]',
        pathname: `/api/billing/receipt/${createTestId('receipt')}`,
        method: 'GET',
        body: undefined,
        signInUrl: null,
      },
    ]

    for (const route of protectedRouteChecks) {
      await runCase(`${route.name} rejects anonymous requests`, async () => {
        const response = await appRequest({
          baseUrl,
          pathname: route.pathname,
          method: route.method,
          body: route.body,
        })

        assertUnauthorized(response, route.signInUrl)
      })

      await runCase(`${route.name} rejects revoked bearer tokens`, async () => {
        const response = await appRequest({
          baseUrl,
          pathname: route.pathname,
          method: route.method,
          body: route.body,
          token: await createRevokedToken(standardUser.id),
        })

        assertUnauthorized(response, route.signInUrl)
      })

      await runCase(`${route.name} reaches business logic for an authenticated user`, async () => {
        const response = await requestAsUser({
          userId: standardUser.id,
          pathname: route.pathname,
          method: route.method,
          body: route.body,
          responseType: route.pathname.includes('/receipt/') ? 'arrayBuffer' : 'auto',
        })

        assert.notEqual(response.status, 401, 'route unexpectedly returned 401')
        assert.notEqual(response.status, 403, 'route unexpectedly returned 403')
      })
    }

    await runCase('POST /api/billing/events validates payloads before writing telemetry', async () => {
      const response = await appRequest({
        baseUrl,
        pathname: '/api/billing/events',
        method: 'POST',
        body: {
          sourcePath: '/billing',
        },
      })

      assert.equal(response.status, 400)
      assert.equal(response.json?.error, 'Invalid billing event payload')
    })

    await runCase('POST /api/billing/events accepts anonymous telemetry without a Clerk session', async () => {
      const runId = createTestId('billing_event_anon')
      billingRunIds.push(runId)

      const response = await appRequest({
        baseUrl,
        pathname: '/api/billing/events',
        method: 'POST',
        body: {
          eventType: 'checkout_click',
          sourcePath: '/billing',
          paymentProvider: 'razorpay',
          catalogKey: 'starter_50',
          currency: 'USD',
          status: 'started',
          metadata: {
            testRunId: runId,
          },
        },
      })

      assert.equal(response.status, 200)
      assert.equal(response.json?.accepted, true)

      const result = await db.query(
        `select user_id, event_source
         from billing_funnel_events
         where metadata->>'testRunId' = $1
         order by created_at desc
         limit 1`,
        [runId]
      )

      assert.equal(result.rowCount, 1)
      assert.equal(result.rows[0].user_id, null)
      assert.equal(result.rows[0].event_source, 'client:/billing')
    })

    await runCase('POST /api/billing/events attaches Clerk identity when a bearer token is present', async () => {
      const runId = createTestId('billing_event_user')
      billingRunIds.push(runId)

      const response = await requestAsUser({
        userId: standardUser.id,
        pathname: '/api/billing/events',
        method: 'POST',
        body: {
          eventType: 'checkout_click',
          sourcePath: '/billing',
          paymentProvider: 'razorpay',
          catalogKey: 'starter_50',
          currency: 'USD',
          status: 'started',
          metadata: {
            testRunId: runId,
          },
        },
      })

      assert.equal(response.status, 200)
      assert.equal(response.json?.accepted, true)

      const result = await db.query(
        `select user_id, event_source
         from billing_funnel_events
         where metadata->>'testRunId' = $1
         order by created_at desc
         limit 1`,
        [runId]
      )

      assert.equal(result.rowCount, 1)
      assert.equal(result.rows[0].user_id, standardUser.id)
      assert.equal(result.rows[0].event_source, 'client:/billing')
    })

    await runCase('GET /api/admin/dashboard enforces Clerk admin authorization', async () => {
      const anonymous = await appRequest({
        baseUrl,
        pathname: '/api/admin/dashboard',
      })
      assert.equal(anonymous.status, 401)
      assert.equal(anonymous.json?.error, 'Authentication required')

      const standardUserResponse = await requestAsUser({
        userId: standardUser.id,
        pathname: '/api/admin/dashboard',
      })
      assert.equal(standardUserResponse.status, 403)
      assert.equal(standardUserResponse.json?.error, 'Admin access required')

      const adminResponse = await requestAsUser({
        userId: adminUser.id,
        pathname: '/api/admin/dashboard',
      })
      assert.equal(adminResponse.status, 200)
      assert.equal(typeof adminResponse.json?.totalUsers, 'number')
      assert.equal(typeof adminResponse.json?.activeUsers, 'number')
    })
  } finally {
    await deleteBillingEventsByRunIds(db, billingRunIds).catch(() => {})

    if (disposableUser) {
      await deleteDbUser({
        db,
        userId: disposableUser.id,
        email: disposableUser.emailAddresses?.[0]?.emailAddress || null,
      }).catch(() => {})
      await clerkClient.users.deleteUser(disposableUser.id).catch(() => {})
    }

    for (const sessionId of createdSessionIds) {
      await clerkClient.sessions.revokeSession(sessionId).catch(() => {})
    }

    await db.end()
    await server.stop()
  }

  if (failures.length > 0) {
    console.error('\n[clerk:api] Summary')
    for (const failure of failures) {
      console.error(`- ${failure.name}: ${failure.error.message}`)
    }
    process.exit(1)
  }

  console.log('\n[clerk:api] All Clerk API smoke tests passed.')
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
