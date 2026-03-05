import { auth } from '@clerk/nextjs/server'

type SessionClaimRecord = Record<string, unknown>

export type ClerkApiIdentity = {
  userId: string
  email?: string
  firstName?: string
  lastName?: string
  profileImageUrl?: string
}

function getString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined
}

function getClaimsRecord(value: unknown): SessionClaimRecord {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as SessionClaimRecord
  }

  return {}
}

export async function getClerkApiIdentity(): Promise<ClerkApiIdentity | null> {
  const { userId, sessionClaims } = await auth()
  if (!userId) {
    return null
  }

  const claims = getClaimsRecord(sessionClaims)
  const email =
    getString(claims.email) ||
    getString(claims.email_address) ||
    getString(claims.primary_email_address)

  const firstName = getString(claims.first_name) || getString(claims.given_name)
  const lastName = getString(claims.last_name) || getString(claims.family_name)
  const profileImageUrl = getString(claims.image_url) || getString(claims.picture)

  return {
    userId,
    email,
    firstName,
    lastName,
    profileImageUrl,
  }
}
