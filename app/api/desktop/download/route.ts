import { NextRequest, NextResponse } from 'next/server'
import { getPostHogClient } from '@/lib/posthog-server'

// Stable download URL for the macOS app. Redirects to the current DMG so
// marketing links, the nav and the /desktop page never hardcode a version.
const CURRENT_DMG = '/downloads/desktop/Accessibility%20Build_1.7.2_aarch64.dmg'

export async function GET(req: NextRequest) {
  const posthog = getPostHogClient()
  if (posthog) {
    posthog.capture({
      distinctId: 'desktop_download',
      event: 'desktop_app_downloaded',
      properties: {
        referrer: req.headers.get('referer') ?? undefined,
      },
    })
    await posthog.flush()
  }

  return NextResponse.redirect(new URL(CURRENT_DMG, req.url), { status: 302 })
}
