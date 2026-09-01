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
  "/ingest/",
  "/dashboard*",
  "/profile*",
  "/sign-in*",
  "/sign-up*",
  // Tracking-parameter variants (?utm_*, ?ref=, ?fbclid=, ?gclid=) are
  // deliberately NOT disallowed. Every page carries a self-referencing
  // canonical, and a crawler can only read that canonical if it is allowed to
  // fetch the URL; blocking the variants stopped Bing and DuckDuckGo from
  // consolidating them. Googlebot has its own group and was never affected.
  "/search?*",
  "/api/preview",
  "/*?preview=",
  "/*?draft=",
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
      // "/api/og" is the dynamic OG image generator — it must stay fetchable
      // even though the rest of /api/ is disallowed.
      //
      // "/_next/static/" must also stay fetchable. Crawlers render the page to
      // judge it (Google renders mobile-first), and every stylesheet, script
      // chunk and font lives under /_next/static/chunks/ or /_next/static/media/
      // (one tool page references ~325 of them). Blocking those means a crawler
      // sees an unstyled skeleton and can misjudge mobile-friendliness. The
      // broader "/_next/" disallow stays, so build internals are still not
      // crawled as content; Allow is more specific here, so it wins.
      //
      // Googlebot was never affected: its own group below omits "/_next/", and
      // a crawler obeys only its most specific user-agent group. That exemption
      // was incidental rather than deliberate, so this makes the CSS/JS allow
      // explicit for everything that falls through to "*" — Bingbot (which
      // feeds Microsoft Copilot), Applebot, DuckDuckBot, and the rest.
      {
        userAgent: "*",
        allow: ["/", "/api/og", "/_next/static/"],
        disallow: PRIVATE_PATHS,
      },
      // Per-engine refinements
      {
        userAgent: "Googlebot",
        allow: ["/", "/tools/", "/guides/", "/blog/", "/api/og"],
        disallow: ["/api/", "/admin/", "/dashboard*", "/profile*", "/sign-in*", "/sign-up*"],
      },
      // Social previews
      ...["facebookexternalhit", "Twitterbot", "LinkedInBot", "Slackbot", "Discordbot"].map(
        (ua) => ({
          userAgent: ua,
          allow: ["/", "/api/og"],
          disallow: ["/api/", "/admin/", "/dashboard*", "/profile*"],
        })
      ),
      // AI / LLM crawlers — explicit allow with minimal restrictions
      ...AI_AGENTS.map((ua) => ({
        userAgent: ua,
        allow: ["/", "/tools/", "/guides/", "/blog/", "/api/og"],
        disallow: ["/api/", "/admin/", "/dashboard*", "/profile*", "/sign-in*", "/sign-up*"],
      })),
      // Aggressive SEO scrapers — disallow everything
      ...SEO_SCRAPERS.map((ua) => ({
        userAgent: ua,
        disallow: "/",
      })),
    ],
    sitemap: [`${baseUrl}/sitemap.xml`, `${baseUrl}/feed.xml`],
    host: baseUrl,
  }
}
