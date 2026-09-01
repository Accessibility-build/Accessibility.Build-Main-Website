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
        // Only the hosts the site actually loads through next/image. A '**'
        // wildcard turned the optimiser into an open image proxy for any origin.
        remotePatterns: [
            { protocol: 'https', hostname: 'cdn.sanity.io' },
            { protocol: 'https', hostname: 'img.clerk.com' },
            { protocol: 'https', hostname: 'images.clerk.dev' },
        ],
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    serverExternalPackages: ['razorpay', 'puppeteer-core', '@sparticuz/chromium-min', 'puppeteer', 'axe-core', 'pdfjs-dist'],
    compress: true,
    poweredByHeader: false,
    // Required so the PostHog reverse proxy under /ingest/ receives trailing-slash
    // API paths untouched. proxy.ts re-creates the trailing-slash 308 for every
    // other path, so pages are not served at two URLs.
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
            // impressions, because www redirected with a 307 TEMPORARY, which
            // tells Google not to consolidate the two.
            //
            // RESOLVED 2026-08-13: the www.accessibility.build domain redirect
            // was set to 308 Permanent in the Vercel dashboard, and verified
            // live (308, single hop, path and query preserved, apex serves 200
            // with no loop, sitemap and canonicals apex-only).
            //
            // This rule does not normally fire: the redirect is issued by Vercel
            // at the edge (response has `server: Vercel`, `content-type:
            // text/plain`, and no Next.js headers), so the request never reaches
            // the app. Keep it as defence in depth, so that if www is ever
            // re-added as an alias that serves the app rather than as an edge
            // redirect, the app still canonicalises permanently instead of
            // serving duplicate content on both hosts.
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
                    // Disables browser features the site never uses. (The
                    // deprecated X-XSS-Protection header used to sit here; modern
                    // browsers ignore it and it could enable filter-based attacks.)
                    key: 'Permissions-Policy',
                    value: 'camera=(), microphone=(), geolocation=(), usb=(), interest-cohort=()'
                },
                {
                    // Must match the `referrer` value in app/layout.tsx metadata.
                    key: 'Referrer-Policy',
                    value: 'strict-origin-when-cross-origin'
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
