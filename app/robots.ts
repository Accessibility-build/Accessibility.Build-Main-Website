import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://accessibility.build"
  
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/", 
          "/_next/",
          "/private/",
          "/*.json$",
          "/*.xml$",
          "/dashboard*",
          "/profile*",
          "/sign-in*",
          "/sign-up*",
          "/*/edit",
          "/*/delete",
          "/*?*utm_*",
          "/*?*ref=*",
          "/*?*fbclid=*",
          "/*?*gclid=*",
          "/search?*",
          "/*preview*",
          "/*draft*"
        ],
        crawlDelay: 1,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/api/", 
          "/admin/",
          "/dashboard*",
          "/profile*",
          "/sign-in*",
          "/sign-up*"
        ],
        crawlDelay: 1,
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: [
          "/api/", 
          "/admin/",
          "/dashboard*",
          "/profile*",
          "/sign-in*",
          "/sign-up*"
        ],
        crawlDelay: 1,
      },
      {
        userAgent: "facebookexternalhit",
        allow: "/",
        disallow: ["/api/", "/admin/", "/dashboard*", "/profile*"],
      },
      {
        userAgent: "Twitterbot",
        allow: "/",
        disallow: ["/api/", "/admin/", "/dashboard*", "/profile*"],
      },
      {
        userAgent: "LinkedInBot",
        allow: "/",
        disallow: ["/api/", "/admin/", "/dashboard*", "/profile*"],
      },
      // Block AI training bots
      {
        userAgent: "ChatGPT-User",
        disallow: "/",
      },
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "OpenAI",
        disallow: "/",
      },
      {
        userAgent: "PerplexityBot",
        disallow: "/",
      },
      {
        userAgent: "ClaudeBot",
        disallow: "/",
      },
      {
        userAgent: "anthropic-ai",
        disallow: "/",
      },
      {
        userAgent: "Claude-Web",
        disallow: "/",
      },
      // Block aggressive scrapers
      {
        userAgent: "AhrefsBot",
        disallow: "/",
      },
      {
        userAgent: "SemrushBot",
        disallow: "/",
      },
      {
        userAgent: "MJ12bot",
        disallow: "/",
      },
    ],
    sitemap: [`${baseUrl}/sitemap.xml`],
    host: baseUrl,
  }
}
