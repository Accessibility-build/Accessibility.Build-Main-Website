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
const TRAILING_SLASH_EXEMPT = /^\/(ingest|api)\//

export default clerkMiddleware((_auth, request) => {
  const { pathname, search } = request.nextUrl
  if (pathname.length > 1 && pathname.endsWith('/') && !TRAILING_SLASH_EXEMPT.test(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace(/\/+$/, '')
    url.search = search
    return NextResponse.redirect(url, 308)
  }
  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
