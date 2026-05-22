import type { MetadataRoute } from "next"

/**
 * robots.txt
 *
 * Strategy:
 *   - Allow all conventional search crawlers (Google, Bing, DuckDuckGo, …).
 *   - Allow LLM / AI-search crawlers explicitly (GPTBot, ClaudeBot, anthropic-ai,
 *     Claude-Web, ChatGPT-User, OAI-SearchBot, PerplexityBot, Google-Extended,
 *     Applebot-Extended, CCBot, Meta-ExternalAgent, Cohere-AI, You.com, etc.).
 *     We _want_ the studio tools and guides to be available to LLM answer
 *     engines — that's distribution.
 *   - Block aggressive SEO scrapers (Ahrefs, Semrush, MJ12, DotBot, …) — they
 *     don't surface us to users, they just resell our content.
 *   - Block private routes (api, admin, dashboard, auth) for everyone.
 */

const PRIVATE_PATHS = [
  "/api/",
  "/admin/",
  "/_next/",
  "/private/",
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
  "/*draft*",
]

// AI / LLM agents we explicitly want to grant full read access to.
const AI_AGENTS = [
  // OpenAI
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  // Anthropic
  "ClaudeBot",
  "anthropic-ai",
  "Claude-Web",
  "Claude-SearchBot",
  // Google
  "Google-Extended",
  // Apple
  "Applebot",
  "Applebot-Extended",
  // Microsoft / Copilot
  "Bingbot",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Meta
  "Meta-ExternalAgent",
  "FacebookBot",
  // Common Crawl (powers many LLM datasets + search engines)
  "CCBot",
  // Others
  "DuckAssistBot",
  "Cohere-ai",
  "YouBot",
  "DiffBot",
  "Amazonbot",
]

// SEO scrapers we don't want. They republish our content + don't drive users.
const SEO_SCRAPERS = [
  "AhrefsBot",
  "SemrushBot",
  "MJ12bot",
  "DotBot",
  "Mediapartners-Google", // we don't run AdSense ads on these pages
  "BLEXBot",
  "DataForSeoBot",
  "PetalBot",
  "SeznamBot",
]

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://accessibility.build"

  return {
    rules: [
      // Default rule (all conventional crawlers)
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS,
        crawlDelay: 1,
      },
      // Per-engine refinements
      {
        userAgent: "Googlebot",
        allow: ["/", "/tools/", "/guides/", "/blog/"],
        disallow: ["/api/", "/admin/", "/dashboard*", "/profile*", "/sign-in*", "/sign-up*"],
      },
      // Social previews
      ...["facebookexternalhit", "Twitterbot", "LinkedInBot", "Slackbot", "Discordbot"].map(
        (ua) => ({
          userAgent: ua,
          allow: "/",
          disallow: ["/api/", "/admin/", "/dashboard*", "/profile*"],
        })
      ),
      // AI / LLM crawlers — explicit allow with minimal restrictions
      ...AI_AGENTS.map((ua) => ({
        userAgent: ua,
        allow: ["/", "/tools/", "/guides/", "/blog/", "/api/sitemap"],
        disallow: ["/api/", "/admin/", "/dashboard*", "/profile*", "/sign-in*", "/sign-up*"],
      })),
      // Aggressive SEO scrapers — disallow everything
      ...SEO_SCRAPERS.map((ua) => ({
        userAgent: ua,
        disallow: "/",
      })),
    ],
    sitemap: [`${baseUrl}/sitemap.xml`],
    host: baseUrl,
  }
}
