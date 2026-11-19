import { NextRequest, NextResponse } from 'next/server'
import { getPostHogClient } from '@/lib/posthog-server'
import { currentDesktopRelease, desktopAppStore, desktopDmgUrl } from '@/lib/desktop-release'

// Stable download URL for the macOS app, so marketing links never hardcode a
// version or a store. It redirects to the current DMG on GitHub Releases when
// one is published, and otherwise to the Mac App Store listing, which is how
// the app is distributed today. (It once pointed at a DMG that had never been
// uploaded and ended in a 404.)
export async function GET(req: NextRequest) {
  const release = currentDesktopRelease()
  const destination = release ? desktopDmgUrl(release) : desktopAppStore.url

  const posthog = getPostHogClient()
  if (posthog) {
    posthog.capture({
      distinctId: 'desktop_download',
      event: 'desktop_app_downloaded',
      properties: {
        version: release?.version ?? desktopAppStore.version,
        channel: release ? 'direct' : 'app_store',
        referrer: req.headers.get('referer') ?? undefined,
      },
    })
    await posthog.flush()
  }

  return NextResponse.redirect(destination, { status: 302 })
}
