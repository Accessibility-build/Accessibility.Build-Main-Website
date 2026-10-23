import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Trailing-slash canonicalisation.
//
// next.config.mjs sets `skipTrailingSlashRedirect: true` because the PostHog
// reverse proxy under /ingest/ needs trailing-slash API paths passed through
// untouched. The side effect was that every page also answered at its
// trailing-slash twin (/guides/ as well as /guides) with a 200, doubling the
// crawlable URL set. Canonical tags pointed at the slash-less form, which
// contained the damage, but a permanent redirect is the correct answer. This
// re-creates Next's default behaviour for everything except the proxy and API
// paths.
//
// The target is a plain URL, not request.nextUrl.clone(). A NextURL records
// that the incoming path ended in a slash and adds it back when formatted, so
// setting its pathname to "/tools" still produced "Location: /tools/": a 308
// to itself, which looped on every trailing-slash URL (live until Oct 2026).
const TRAILING_SLASH_EXEMPT = /^\/(ingest|api)\//

export default clerkMiddleware((_auth, request) => {
  const { pathname } = request.nextUrl
  if (pathname.length > 1 && pathname.endsWith('/') && !TRAILING_SLASH_EXEMPT.test(pathname)) {
    const url = new URL(request.url)
    url.pathname = pathname.replace(/\/+$/, '')
    return NextResponse.redirect(url, 308)
  }
  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params.
    //
    // Also skip the /embed/ widgets. They are iframed into other sites, where
    // Clerk's SameSite=Lax cookies are never sent or set, so its handshake
    // redirect (every first visit on a dev instance, reason dev-browser-missing)
    // loops and the iframe shows a browser error page. The widgets need no auth.
    '/((?!_next|embed/|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
