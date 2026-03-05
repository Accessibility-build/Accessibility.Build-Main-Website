#!/usr/bin/env node

/**
 * Create a Clerk test session token for API testing.
 *
 * Usage:
 *   node scripts/create-clerk-session-token.mjs --user-id user_123
 *   node scripts/create-clerk-session-token.mjs --user-id user_123 --expires-in 3600
 */

const API_BASE = 'https://api.clerk.com/v1'

function getArg(flag) {
  const index = process.argv.indexOf(flag)
  if (index === -1) {
    return undefined
  }

  return process.argv[index + 1]
}

function usage() {
  console.log('Usage: node scripts/create-clerk-session-token.mjs --user-id <clerk_user_id> [--expires-in <seconds>]')
}

async function request(path, body) {
  const secretKey = process.env.CLERK_SECRET_KEY
  if (!secretKey) {
    throw new Error('CLERK_SECRET_KEY is required')
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message =
      payload?.errors?.[0]?.long_message ||
      payload?.errors?.[0]?.message ||
      payload?.message ||
      `HTTP_${response.status}`
    throw new Error(`Clerk API error (${path}): ${message}`)
  }

  return payload
}

async function main() {
  const userId = getArg('--user-id')
  const expiresInRaw = getArg('--expires-in')
  const expiresInSeconds =
    expiresInRaw && Number.isFinite(Number(expiresInRaw)) ? Math.max(1, Math.floor(Number(expiresInRaw))) : undefined

  if (!userId) {
    usage()
    process.exit(1)
  }

  const session = await request('/sessions', {
    user_id: userId,
  })

  const tokenPayload = await request(`/sessions/${session.id}/tokens`, {
    ...(expiresInSeconds ? { expires_in_seconds: expiresInSeconds } : {}),
  })

  const token = tokenPayload.jwt || tokenPayload.token
  if (!token) {
    throw new Error('Clerk did not return a session token')
  }

  console.log(`SESSION_ID=${session.id}`)
  console.log(`TOKEN_EXPIRES_AT=${tokenPayload?.expires_at || 'n/a'}`)
  console.log('SESSION_TOKEN=')
  console.log(token)
  console.log('AUTH_HEADER=')
  console.log(`Authorization: Bearer ${token}`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
