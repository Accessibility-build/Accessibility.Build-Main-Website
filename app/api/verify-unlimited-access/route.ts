import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { secretKey } = await request.json()

    if (!secretKey) {
      return NextResponse.json(
        { valid: false, message: 'Secret key is required' },
        { status: 400 }
      )
    }

    const envSecretKey = process.env.UNLIMITED_ACCESS_KEY

    if (!envSecretKey) {
      console.error('UNLIMITED_ACCESS_KEY environment variable is not set')
      return NextResponse.json(
        { valid: false, message: 'Server configuration error' },
        { status: 500 }
      )
    }

    const isValid = secretKey === envSecretKey

    if (isValid) {
      return NextResponse.json({
        valid: true,
        message: 'Access granted'
      })
    } else {
      return NextResponse.json(
        { valid: false, message: 'Invalid secret key' },
        { status: 401 }
      )
    }

  } catch (error) {
    console.error('Error verifying unlimited access:', error)
    return NextResponse.json(
      { valid: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
} 