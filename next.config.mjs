/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: false,
    },
    typescript: {
        ignoreBuildErrors: true,
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
    serverExternalPackages: ['razorpay', 'puppeteer', 'axe-core'],
    compress: true,
    poweredByHeader: false,
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
        }]
    },
}

export default nextConfig