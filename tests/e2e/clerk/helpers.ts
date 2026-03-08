import { randomBytes } from 'node:crypto'
import { createClerkClient } from '@clerk/backend'
import pg from 'pg'

const { Client } = pg

export const userStatePath = 'playwright/.auth/user.json'
export const adminStatePath = 'playwright/.auth/admin.json'

export function requiredEnv(name: string): string {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(`${name} is required`)
  }

  return value
}

export function createDisposableEmail(label = 'signup') {
  return `accessibility.build+clerk_test_${label}_${Date.now().toString(36)}_${randomBytes(3).toString('hex')}@example.com`
}

export function createDisposablePassword() {
  return `A11yTest!${randomBytes(6).toString('hex')}Aa1`
}

export function getClerkClient() {
  return createClerkClient({
    secretKey: requiredEnv('CLERK_SECRET_KEY'),
  })
}

export async function findClerkUserByEmail(email: string) {
  const client = getClerkClient()
  const result = await client.users.getUserList({
    emailAddress: [email],
    limit: 1,
  })

  return result.data[0] || null
}

export async function deleteClerkUserByEmail(email: string) {
  const user = await findClerkUserByEmail(email)

  if (!user) {
    return
  }

  await getClerkClient().users.deleteUser(user.id)
}

export async function deleteDbUserByEmail(email: string) {
  const databaseUrl = process.env.DATABASE_URL?.trim()

  if (!databaseUrl) {
    return
  }

  const db = new Client({
    connectionString: databaseUrl,
  })

  await db.connect()

  try {
    await db.query('delete from users where email = $1', [email.toLowerCase()])
  } finally {
    await db.end()
  }
}
