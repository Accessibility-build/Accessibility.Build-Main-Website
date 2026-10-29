import { NextRequest, NextResponse } from 'next/server'
import { getPostHogClient } from '@/lib/posthog-server'
import { currentDesktopRelease, desktopDmgUrl } from '@/lib/desktop-release'

// Stable download URL for the macOS app. Redirects to the current DMG on
// GitHub Releases so marketing links and the /desktop page never hardcode a
// version. Until a release exists it sends people back to /desktop rather
// than to a file that is not there (this route used to end in a 404).
export async function GET(req: NextRequest) {
  const release = currentDesktopRelease()
  if (!release) {
    return NextResponse.redirect(new URL('/desktop', req.url), { status: 302 })
  }

  const posthog = getPostHogClient()
  if (posthog) {
    posthog.capture({
      distinctId: 'desktop_download',
      event: 'desktop_app_downloaded',
      properties: {
        version: release.version,
        referrer: req.headers.get('referer') ?? undefined,
      },
    })
    await posthog.flush()
  }

  return NextResponse.redirect(desktopDmgUrl(release), { status: 302 })
}
