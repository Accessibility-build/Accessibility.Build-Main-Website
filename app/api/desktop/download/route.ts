import { NextRequest, NextResponse } from 'next/server'

// Stable download URL for the macOS app. Redirects to the current DMG so
// marketing links, the nav and the /desktop page never hardcode a version.
const CURRENT_DMG = '/downloads/desktop/Accessibility%20Build_1.5.0_aarch64.dmg'

export function GET(req: NextRequest) {
  return NextResponse.redirect(new URL(CURRENT_DMG, req.url), { status: 302 })
}
