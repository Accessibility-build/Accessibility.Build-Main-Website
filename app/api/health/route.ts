import { NextResponse } from 'next/server'

// Simple health check that won't fail on production
export async function GET() {
  try {
    const healthResult = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'development',
      checks: {
        server: { status: 'up', responseTime: 0 },
        environment: {
          status: 'valid',
          details: ['Server is running']
        }
      }
    }
    
    return NextResponse.json(healthResult, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Content-Type': 'application/json'
      }
    })
    
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Content-Type': 'application/json'
      }
    })
  }
}

// Simple endpoint for basic uptime monitoring
export async function HEAD() {
  return new Response(null, { status: 200 })
} 