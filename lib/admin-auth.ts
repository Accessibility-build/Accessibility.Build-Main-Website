import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export class AdminAccessError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.name = 'AdminAccessError'
    this.statusCode = statusCode
  }
}

/**
 * Check if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  const user = await currentUser()
  
  if (!user) {
    return false
  }

  const adminEmails = process.env.ADMIN_EMAIL?.split(',').map(email => email.trim().toLowerCase()) || []
  const userEmail = user.emailAddresses[0]?.emailAddress?.toLowerCase()
  
  return adminEmails.includes(userEmail || '')
}

/**
 * Get current user if they are an admin, otherwise redirect
 */
export async function requireAdmin() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  const adminEmails = process.env.ADMIN_EMAIL?.split(',').map(email => email.trim().toLowerCase()) || []
  const userEmail = user.emailAddresses[0]?.emailAddress?.toLowerCase()
  
  if (!adminEmails.includes(userEmail || '')) {
    redirect('/')
  }

  return user
}

/**
 * Get current user if they are an admin, otherwise throw a typed API error.
 */
export async function requireAdminApi() {
  const user = await currentUser()

  if (!user) {
    throw new AdminAccessError('Authentication required', 401)
  }

  const adminEmails = process.env.ADMIN_EMAIL?.split(',').map(email => email.trim().toLowerCase()) || []
  const userEmail = user.emailAddresses[0]?.emailAddress?.toLowerCase()

  if (!adminEmails.includes(userEmail || '')) {
    throw new AdminAccessError('Admin access required', 403)
  }

  return user
}

/**
 * Get current admin user info
 */
export async function getCurrentAdmin() {
  const user = await currentUser()
  
  if (!user) {
    return null
  }

  const adminEmails = process.env.ADMIN_EMAIL?.split(',').map(email => email.trim().toLowerCase()) || []
  const userEmail = user.emailAddresses[0]?.emailAddress?.toLowerCase()
  
  if (!adminEmails.includes(userEmail || '')) {
    return null
  }

  return {
    id: user.id,
    email: userEmail,
    name: `${user.firstName} ${user.lastName}`.trim(),
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl
  }
} 
