import { NextRequest, NextResponse } from 'next/server'
import {
  createUnlimitedAccessToken,
  UNLIMITED_ACCESS_COOKIE_NAME,
  unlimitedAccessCookieOptions,
  validateUnlimitedAccessSecret
} from '@/lib/unlimited-access-server'

export async function POST(request: NextRequest) {
  try {
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
        message: 'Access granted'
      })

      response.cookies.set(
        UNLIMITED_ACCESS_COOKIE_NAME,
        createUnlimitedAccessToken(),
        unlimitedAccessCookieOptions
      )

      return response
    } else {
      const response = NextResponse.json(
        { valid: false, message: 'Invalid secret key' },
        { status: 401 }
      )

      response.cookies.set(UNLIMITED_ACCESS_COOKIE_NAME, '', {
        ...unlimitedAccessCookieOptions,
        maxAge: 0
      })

      return response
    }

  } catch (error) {
    console.error('Error verifying unlimited access:', error)
    return NextResponse.json(
      { valid: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Unlimited access revoked'
    })

    response.cookies.set(UNLIMITED_ACCESS_COOKIE_NAME, '', {
      ...unlimitedAccessCookieOptions,
      maxAge: 0
    })

    return response
  } catch (error) {
    console.error('Error revoking unlimited access:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
