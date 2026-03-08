#!/usr/bin/env node

import assert from 'node:assert/strict'
import { Webhook } from 'svix'
import {
  appRequest,
  connectDb,
  createTestId,
  deleteDbUser,
  deriveUrl,
  ensureServer,
  getBaseUrl,
  loadEnv,
  requiredEnv,
} from './clerk-test-utils.mjs'

loadEnv()

const baseUrl = deriveUrl(getBaseUrl(), 30)
const missingSecretBaseUrl = deriveUrl(getBaseUrl(), 31)
const webhookSecret = requiredEnv('CLERK_WEBHOOK_SECRET')
const defaultCredits = Number.parseInt(process.env.DEFAULT_CREDITS || '100', 10) || 100
const failures = []

function buildUserPayload(overrides = {}) {
  const now = Date.now()

  return {
    id: createTestId('user'),
    email_addresses: [
      {
        email_address: `${createTestId('clerk_webhook')}@example.com`.toLowerCase(),
      },
    ],
    first_name: 'Clerk',
    last_name: 'Webhook',
    image_url: 'https://example.com/avatar.png',
    created_at: now,
    updated_at: now,
    ...overrides,
  }
}

function buildEvent(type, data) {
  return {
    type,
    data,
  }
}

async function postSignedWebhook(targetBaseUrl, payload, secret = webhookSecret) {
  const rawBody = JSON.stringify(payload)
  const messageId = createTestId('msg')
  const timestamp = Math.floor(Date.now() / 1_000).toString()
  const signature = new Webhook(secret).sign(messageId, timestamp, rawBody)

  return appRequest({
    baseUrl: targetBaseUrl,
    pathname: '/api/webhooks/clerk',
    method: 'POST',
    body: payload,
    headers: {
      'svix-id': messageId,
      'svix-timestamp': timestamp,
      'svix-signature': signature,
    },
  })
}

async function runCase(name, fn) {
  console.log(`\n[clerk:webhooks] ${name}`)

  try {
    await fn()
    console.log(`[clerk:webhooks] PASS ${name}`)
  } catch (error) {
    const wrapped = error instanceof Error ? error : new Error(String(error))
    failures.push({ name, error: wrapped })
    console.error(`[clerk:webhooks] FAIL ${name}: ${wrapped.message}`)
  }
}

async function main() {
  const primaryServer = await ensureServer({
    baseUrl,
    label: 'clerk-webhook-server',
    envOverrides: {
      CLERK_WEBHOOK_SECRET: webhookSecret,
      EMAIL_SERVICE_ENABLED: 'false',
      EMAIL_MARKETING_ENABLED: 'false',
    },
  })
  const missingSecretServer = await ensureServer({
    baseUrl: missingSecretBaseUrl,
    label: 'clerk-webhook-missing-secret-server',
    envOverrides: {
      CLERK_WEBHOOK_SECRET: '',
      EMAIL_SERVICE_ENABLED: 'false',
      EMAIL_MARKETING_ENABLED: 'false',
    },
  })
  const db = await connectDb()

  const createdUserId = createTestId('wh_created')
  const updatedMissingUserId = createTestId('wh_updated_missing')
  const updatedConflictOwnerId = createTestId('wh_conflict_owner')
  const updatedConflictTargetId = createTestId('wh_conflict_target')
  const deletedUserId = createTestId('wh_deleted')
  const unhandledUserId = createTestId('wh_unhandled')

  try {
    await runCase('Missing CLERK_WEBHOOK_SECRET returns 500', async () => {
      const response = await postSignedWebhook(
        missingSecretBaseUrl,
        buildEvent('user.created', buildUserPayload())
      )

      assert.equal(response.status, 500)
      assert.equal(response.json?.error, 'Webhook secret not configured')
    })

    await runCase('Missing Svix headers returns 400', async () => {
      const response = await appRequest({
        baseUrl,
        pathname: '/api/webhooks/clerk',
        method: 'POST',
        body: buildEvent('user.created', buildUserPayload()),
      })

      assert.equal(response.status, 400)
      assert.equal(response.json?.error, 'Missing svix headers')
    })

    await runCase('Invalid Svix signature returns 400', async () => {
      const response = await appRequest({
        baseUrl,
        pathname: '/api/webhooks/clerk',
        method: 'POST',
        body: buildEvent('user.created', buildUserPayload()),
        headers: {
          'svix-id': createTestId('invalid_sig'),
          'svix-timestamp': Math.floor(Date.now() / 1_000).toString(),
          'svix-signature': 'v1,invalid',
        },
      })

      assert.equal(response.status, 400)
      assert.equal(response.json?.error, 'Invalid webhook signature')
    })

    await runCase('user.created inserts an active user, credits, and a welcome bonus transaction', async () => {
      const payload = buildUserPayload({
        id: createdUserId,
        email_addresses: [{ email_address: `${createdUserId}@example.com` }],
        first_name: 'Created',
        last_name: 'User',
      })

      await deleteDbUser({
        db,
        userId: createdUserId,
        email: `${createdUserId}@example.com`,
      })

      const response = await postSignedWebhook(baseUrl, buildEvent('user.created', payload))
      assert.equal(response.status, 200)
      assert.equal(response.json?.received, true)
      assert.equal(response.json?.eventType, 'user.created')

      const userResult = await db.query(
        `select email, first_name, last_name, credits, total_credits_earned, total_credits_used, is_active
         from users
         where id = $1
         limit 1`,
        [createdUserId]
      )

      assert.equal(userResult.rowCount, 1)
      assert.equal(userResult.rows[0].email, `${createdUserId}@example.com`)
      assert.equal(userResult.rows[0].first_name, 'Created')
      assert.equal(userResult.rows[0].last_name, 'User')
      assert.equal(Number(userResult.rows[0].credits), defaultCredits)
      assert.equal(Number(userResult.rows[0].total_credits_earned), defaultCredits)
      assert.equal(Number(userResult.rows[0].total_credits_used), 0)
      assert.equal(userResult.rows[0].is_active, true)

      const txResult = await db.query(
        `select type, amount, balance_before, balance_after, description
         from credit_transactions
         where user_id = $1
         order by created_at desc
         limit 1`,
        [createdUserId]
      )

      assert.equal(txResult.rowCount, 1)
      assert.equal(txResult.rows[0].type, 'bonus')
      assert.equal(Number(txResult.rows[0].amount), defaultCredits)
      assert.equal(Number(txResult.rows[0].balance_before), 0)
      assert.equal(Number(txResult.rows[0].balance_after), defaultCredits)
      assert.match(txResult.rows[0].description, /welcome bonus/i)
    })

    await runCase('Duplicate user.created is idempotent', async () => {
      const before = await db.query(
        'select count(*)::int as count from credit_transactions where user_id = $1',
        [createdUserId]
      )

      const response = await postSignedWebhook(
        baseUrl,
        buildEvent(
          'user.created',
          buildUserPayload({
            id: createdUserId,
            email_addresses: [{ email_address: `${createdUserId}@example.com` }],
            first_name: 'Created',
            last_name: 'User',
          })
        )
      )

      assert.equal(response.status, 200)

      const after = await db.query(
        'select count(*)::int as count from credit_transactions where user_id = $1',
        [createdUserId]
      )

      assert.equal(after.rows[0].count, before.rows[0].count)
    })

    await runCase('user.updated creates a missing user record when needed', async () => {
      const email = `${updatedMissingUserId}@example.com`

      await deleteDbUser({
        db,
        userId: updatedMissingUserId,
        email,
      })

      const response = await postSignedWebhook(
        baseUrl,
        buildEvent(
          'user.updated',
          buildUserPayload({
            id: updatedMissingUserId,
            email_addresses: [{ email_address: email }],
            first_name: 'Updated',
            last_name: 'Missing',
          })
        )
      )

      assert.equal(response.status, 200)

      const userResult = await db.query(
        `select email, first_name, last_name, credits, is_active
         from users
         where id = $1
         limit 1`,
        [updatedMissingUserId]
      )

      assert.equal(userResult.rowCount, 1)
      assert.equal(userResult.rows[0].email, email)
      assert.equal(userResult.rows[0].first_name, 'Updated')
      assert.equal(userResult.rows[0].last_name, 'Missing')
      assert.equal(Number(userResult.rows[0].credits), defaultCredits)
      assert.equal(userResult.rows[0].is_active, true)
    })

    await runCase('user.updated preserves email-conflict behavior while syncing profile fields', async () => {
      const conflictEmail = `${createTestId('conflict')}@example.com`

      await deleteDbUser({
        db,
        userId: updatedConflictOwnerId,
        email: conflictEmail,
      })
      await deleteDbUser({
        db,
        userId: updatedConflictTargetId,
        email: `${updatedConflictTargetId}@example.com`,
      })

      await db.query(
        `insert into users (
          id, email, first_name, last_name, credits, total_credits_earned, total_credits_used, is_active
        ) values ($1, $2, 'Owner', 'User', $3, $3, 0, true)`,
        [updatedConflictOwnerId, conflictEmail, defaultCredits]
      )

      await db.query(
        `insert into users (
          id, email, first_name, last_name, credits, total_credits_earned, total_credits_used, is_active
        ) values ($1, $2, 'Before', 'Conflict', $3, $3, 0, true)`,
        [updatedConflictTargetId, `${updatedConflictTargetId}@example.com`, defaultCredits]
      )

      const response = await postSignedWebhook(
        baseUrl,
        buildEvent(
          'user.updated',
          buildUserPayload({
            id: updatedConflictTargetId,
            email_addresses: [{ email_address: conflictEmail }],
            first_name: 'After',
            last_name: 'Conflict',
            image_url: 'https://example.com/conflict.png',
          })
        )
      )

      assert.equal(response.status, 200)

      const userResult = await db.query(
        `select email, first_name, last_name, profile_image_url
         from users
         where id = $1
         limit 1`,
        [updatedConflictTargetId]
      )

      assert.equal(userResult.rowCount, 1)
      assert.equal(userResult.rows[0].email, `${updatedConflictTargetId}@example.com`)
      assert.equal(userResult.rows[0].first_name, 'After')
      assert.equal(userResult.rows[0].last_name, 'Conflict')
      assert.equal(userResult.rows[0].profile_image_url, 'https://example.com/conflict.png')
    })

    await runCase('user.deleted soft-deactivates the existing user record', async () => {
      const email = `${deletedUserId}@example.com`

      await deleteDbUser({
        db,
        userId: deletedUserId,
        email,
      })

      await db.query(
        `insert into users (
          id, email, first_name, last_name, credits, total_credits_earned, total_credits_used, is_active
        ) values ($1, $2, 'Delete', 'Me', $3, $3, 0, true)`,
        [deletedUserId, email, defaultCredits]
      )

      const response = await postSignedWebhook(
        baseUrl,
        buildEvent('user.deleted', { id: deletedUserId })
      )

      assert.equal(response.status, 200)

      const result = await db.query(
        'select is_active from users where id = $1 limit 1',
        [deletedUserId]
      )

      assert.equal(result.rowCount, 1)
      assert.equal(result.rows[0].is_active, false)
    })

    await runCase('Unhandled event types return 200 without mutating user data', async () => {
      const response = await postSignedWebhook(
        baseUrl,
        buildEvent('session.created', { id: unhandledUserId })
      )

      assert.equal(response.status, 200)
      assert.equal(response.json?.received, true)
      assert.equal(response.json?.eventType, 'session.created')

      const result = await db.query(
        'select id from users where id = $1 limit 1',
        [unhandledUserId]
      )

      assert.equal(result.rowCount, 0)
    })
  } finally {
    await Promise.all([
      deleteDbUser({ db, userId: createdUserId, email: `${createdUserId}@example.com` }).catch(() => {}),
      deleteDbUser({
        db,
        userId: updatedMissingUserId,
        email: `${updatedMissingUserId}@example.com`,
      }).catch(() => {}),
      deleteDbUser({
        db,
        userId: updatedConflictOwnerId,
        email: null,
      }).catch(() => {}),
      deleteDbUser({
        db,
        userId: updatedConflictTargetId,
        email: null,
      }).catch(() => {}),
      deleteDbUser({ db, userId: deletedUserId, email: `${deletedUserId}@example.com` }).catch(() => {}),
      deleteDbUser({ db, userId: unhandledUserId, email: null }).catch(() => {}),
    ])

    await db.end()
    await missingSecretServer.stop()
    await primaryServer.stop()
  }

  if (failures.length > 0) {
    console.error('\n[clerk:webhooks] Summary')
    for (const failure of failures) {
      console.error(`- ${failure.name}: ${failure.error.message}`)
    }
    process.exit(1)
  }

  console.log('\n[clerk:webhooks] All Clerk webhook integration checks passed.')
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
