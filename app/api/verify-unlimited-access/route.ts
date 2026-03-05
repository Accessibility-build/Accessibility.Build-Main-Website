import { NextRequest, NextResponse } from 'next/server'
import {
  createUnlimitedAccessToken,
  UNLIMITED_ACCESS_COOKIE_NAME,
  unlimitedAccessCookieOptions,
  validateUnlimitedAccessSecret,
} from '@/lib/unlimited-access-server'
import { AdminAccessError, requireAdminApi } from '@/lib/admin-auth'
import { logAdminAction } from '@/lib/admin-utils'

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdminApi()
    const { secretKey } = await request.json()

    if (!secretKey) {
      return NextResponse.json(
        { valid: false, message: 'Secret key is required' },
        { status: 400 }
      )
    }

    if (!process.env.UNLIMITED_ACCESS_KEY) {
      console.error('UNLIMITED_ACCESS_KEY environment variable is not set')
      return NextResponse.json(
        { valid: false, message: 'Server configuration error' },
        { status: 500 }
      )
    }

    const isValid = validateUnlimitedAccessSecret(secretKey)

    if (isValid) {
      const response = NextResponse.json({
        valid: true,
        message: 'Access granted',
      })

      response.cookies.set(
        UNLIMITED_ACCESS_COOKIE_NAME,
        createUnlimitedAccessToken(),
        unlimitedAccessCookieOptions
      )

      await logAdminAction(admin.id, 'unlimited_access_grant', {
        status: 'granted',
        grantedBy: admin.emailAddresses[0]?.emailAddress,
        timestamp: new Date().toISOString(),
      })

      return response
    }

    await logAdminAction(admin.id, 'unlimited_access_grant', {
      status: 'invalid_secret',
      grantedBy: admin.emailAddresses[0]?.emailAddress,
      timestamp: new Date().toISOString(),
    })

    const response = NextResponse.json(
      { valid: false, message: 'Invalid secret key' },
      { status: 401 }
    )

    response.cookies.set(UNLIMITED_ACCESS_COOKIE_NAME, '', {
      ...unlimitedAccessCookieOptions,
      maxAge: 0,
    })

    return response
  } catch (error) {
    if (error instanceof AdminAccessError) {
      return NextResponse.json(
        { valid: false, message: error.message },
        { status: error.statusCode }
      )
    }

    console.error('Error verifying unlimited access:', error)
    return NextResponse.json(
      { valid: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    const admin = await requireAdminApi()

    const response = NextResponse.json({
      success: true,
      message: 'Unlimited access revoked',
    })

    response.cookies.set(UNLIMITED_ACCESS_COOKIE_NAME, '', {
      ...unlimitedAccessCookieOptions,
      maxAge: 0,
    })

    await logAdminAction(admin.id, 'unlimited_access_revoke', {
      revokedBy: admin.emailAddresses[0]?.emailAddress,
      timestamp: new Date().toISOString(),
    })

    return response
  } catch (error) {
    if (error instanceof AdminAccessError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.statusCode }
      )
    }

    console.error('Error revoking unlimited access:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
