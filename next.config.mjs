import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    logging: {
        browserToTerminal: true,
    },
    turbopack: {
        root: __dirname,
    },
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: '**',
        }],
        formats: ['image/webp', 'image/avif'],
        dangerouslyAllowSVG: true,
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    serverExternalPackages: ['razorpay', 'puppeteer-core', '@sparticuz/chromium-min', 'puppeteer', 'axe-core', 'pdfjs-dist'],
    compress: true,
    poweredByHeader: false,
    skipTrailingSlashRedirect: true,
    async rewrites() {
        return [
            {
                source: '/ingest/static/:path*',
                destination: 'https://us-assets.i.posthog.com/static/:path*',
            },
            {
                source: '/ingest/array/:path*',
                destination: 'https://us-assets.i.posthog.com/array/:path*',
            },
            {
                source: '/ingest/:path*',
                destination: 'https://us.i.posthog.com/:path*',
            },
        ]
    },
    async redirects() {
        return [{
            // Canonical host is the apex, accessibility.build. Search Console
            // (Aug 2026) showed 12 paths indexed on BOTH hosts, splitting ~32k
            // impressions, because www redirects with a 307 TEMPORARY, which
            // tells Google not to consolidate the two.
            //
            // NOTE: today this rule never fires. The 307 is issued by Vercel at
            // the edge (response has `server: Vercel`, `content-type:
            // text/plain`, and no Next.js headers), so the request never reaches
            // the app. THE REAL FIX IS IN THE VERCEL DASHBOARD: set the
            // www.accessibility.build domain redirect to 308 Permanent.
            // This rule is defence in depth, so that if www is ever re-added as
            // an alias that serves the app rather than as an edge redirect, the
            // app still canonicalises permanently instead of serving duplicates.
            source: '/:path*',
            has: [{ type: 'host', value: 'www.accessibility.build' }],
            destination: 'https://accessibility.build/:path*',
            permanent: true,
        }, {
            source: '/case-studies',
            destination: '/services',
            permanent: true,
        }, {
            source: '/case-studies/:slug*',
            destination: '/services',
            permanent: true,
        }, {
            // Google has been crawling this 404 since at least Jul 2026 and we
            // rank for "contrast checker" queries — send that equity to the
            // real tool instead of dropping it. The page lives at
            // /tools/contrast-checker.
            source: '/tools/color-contrast-checker',
            destination: '/tools/contrast-checker',
            permanent: true,
        }, {
            source: '/resources/tools',
            destination: '/tools',
            permanent: true,
        }, {
            source: '/support',
            destination: '/contact',
            permanent: true,
        }]
        // Deliberately NOT redirected: /old-home, /new-home, /offer, /fr,
        // /bad/keyboard, /issues*, /statements/*, /media/*.vtt. These never had
        // a real equivalent, so 404 is the correct answer — redirecting them to
        // the homepage would just create soft 404s.
    },
    async headers() {
        return [{
            source: '/(.*)',
            headers: [{
                    key: 'X-DNS-Prefetch-Control',
                    value: 'on'
                },
                {
                    key: 'Strict-Transport-Security',
                    value: 'max-age=63072000; includeSubDomains; preload'
                },
                {
                    key: 'X-Content-Type-Options',
                    value: 'nosniff'
                },
                {
                    key: 'X-XSS-Protection',
                    value: '1; mode=block'
                },
                {
                    key: 'Referrer-Policy',
                    value: 'origin-when-cross-origin'
                },
                {
                    key: 'X-Frame-Options',
                    value: 'SAMEORIGIN'
                }
            ]
        }, {
            // The desktop updater must always see the freshest manifest —
            // a cached copy would hide new releases from installed apps.
            source: '/downloads/desktop/latest.json',
            headers: [{
                key: 'Cache-Control',
                value: 'no-cache, no-store, must-revalidate'
            }]
        }]
    },
}

export default nextConfig
