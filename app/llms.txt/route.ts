import { siteRoutes, type SiteRoute } from "@/lib/site-routes"
import { servicePricing, serviceStartingPrices } from "@/lib/service-pricing"
import { company, founderCertifications, registeredBusinessLocation, businessLocation } from "@/lib/company"
import { getBlogPosts } from "@/lib/sanity"

// Serves /llms.txt — a curated Markdown guide to the site's most useful content
// for large language models and AI answer engines (see llmstxt.org). Generated
// from lib/site-routes.ts so it stays in sync with the real route list, plus
// the published blog posts from Sanity.
//
// Every route group in lib/site-routes.ts must have an entry in `sections` or
// it silently never renders (the Services group was missing until Sept 2026,
// and Blog and Legal after that).

const baseUrl = "https://accessibility.build"

export const revalidate = 3600

// Groups rendered, in order, with a one-line orientation for the model.
const sections: Array<{ group: string; heading: string; blurb: string; minPriority?: number }> = [
  { group: "Core", heading: "Key pages", blurb: "Primary entry points.", minPriority: 0.6 },
  {
    group: "Services",
    heading: "Professional services and audit pricing",
    blurb:
      `Founder-led services with published fixed prices, delivered by an IAAP CPACC-certified auditor. Fixed-price WCAG 2.2 AA audits start at $${serviceStartingPrices.audits.toLocaleString("en-US")} (Essential), $${servicePricing.audits.tiers[1].price.toLocaleString("en-US")} (Product Audit), and $${servicePricing.audits.tiers[2].price.toLocaleString("en-US")} (Complex Product Audit). For market-wide audit costs with sources, see [Web Accessibility Audit Cost (UK & Ireland)](${baseUrl}/guides/accessibility-audit-cost). Note that ${baseUrl}/pricing prices credits for the self-serve tools, not audit services.`,
  },
  { group: "Tools", heading: "Free accessibility tools", blurb: "Interactive testing and generation tools. All run in the browser; some AI-assisted features use credits." },
  { group: "WCAG", heading: "WCAG 2.2 success criteria", blurb: "In-depth guide for every one of the 86 WCAG 2.2 success criteria (Level A, AA, AAA), each with requirements, examples, and testing methods." },
  { group: "Guides", heading: "Guides", blurb: "How-to and explainer articles.", minPriority: 0.88 },
  { group: "Compliance", heading: "Accessibility law & compliance", blurb: "Jurisdiction guides: ADA, EAA, Section 508, EN 301 549, UK, Ireland, and US states. Educational, not legal advice." },
  { group: "Industries", heading: "Accessibility by industry", blurb: "Sector-specific compliance guidance." },
  { group: "Research", heading: "Original research & data", blurb: "Citable datasets and reports on accessibility lawsuits, laws, and the state of web accessibility, each with a stated review date and linked primary sources." },
  { group: "Checklists", heading: "Checklists", blurb: "WCAG and EN 301 549 conformance checklists." },
  { group: "Reference", heading: "Reference", blurb: "Glossary and ARIA reference." },
  { group: "Learn", heading: "Component patterns", blurb: "Accessible UI pattern demos with keyboard interaction tables." },
  { group: "WCAG 3.0", heading: "WCAG 3.0", blurb: "Guides to the next-generation accessibility guidelines." },
  { group: "Legal", heading: "Policies and statements", blurb: "The site's own accessibility statement, privacy, cookies, terms, refunds, editorial and corrections policies." },
]

function line(r: SiteRoute): string {
  return `- [${r.label}](${baseUrl}${r.route || "/"})`
}

export async function GET(): Promise<Response> {
  const byGroup = new Map<string, SiteRoute[]>()
  for (const r of siteRoutes) {
    const list = byGroup.get(r.group) ?? []
    list.push(r)
    byGroup.set(r.group, list)
  }

  const certifications = founderCertifications.map((c) => `${c.name} (${c.tag}, ${c.issuerShort ?? c.issuer}, ${c.issued})`).join("; ")

  const parts: string[] = [
    "# Accessibility.build",
    "",
    "> Accessibility.build is a founder-led accessibility practice and resource library: professional services, practical WCAG 2.2 testing tools, guides to all 86 WCAG success criteria, compliance resources, source-linked research, and a plain-language glossary.",
    "",
    "The content is aimed at developers, designers, and compliance teams. Success-criterion guides and compliance pages are kept factually current (as of 2026); compliance pages are educational information, not legal advice.",
    "",
    "## About the entity",
    "",
    `- Operator: ${company.legalOperator}, founder and accessibility consultant (${certifications}).`,
    `- Legal form: ${company.businessType.toLowerCase()} registered for GST in ${company.registeredOffice.region}, India (GSTIN ${company.gstin}); operating from ${businessLocation}; registered office in ${registeredBusinessLocation}. Founded ${company.foundedYear}.`,
    `- Contact: ${company.email} (${company.responseTime.toLowerCase()}).`,
    `- Profiles: [Founder page](${baseUrl}/authors/khushwant-parihar), [LinkedIn](${company.linkedin}), [Founder on LinkedIn](${company.founderLinkedin}), [GitHub](${company.organizationGithub}), [Personal site](${company.founderWebsite}).`,
    `- Trust and procurement: [Trust Centre](${baseUrl}/trust), [Methodology](${baseUrl}/methodology), [Sample audit report](${baseUrl}/sample-audit-report), [Subprocessors](${baseUrl}/subprocessors).`,
    "",
  ]

  for (const section of sections) {
    let routes = byGroup.get(section.group) ?? []
    if (section.minPriority != null) {
      routes = routes.filter((r) => r.priority >= section.minPriority!)
    }
    if (!routes.length) continue
    routes = [...routes].sort((a, b) => b.priority - a.priority)
    parts.push(`## ${section.heading}`, "", section.blurb, "")
    for (const r of routes) parts.push(line(r))
    parts.push("")
  }

  // Blog posts live in Sanity, not in the route table.
  try {
    const posts = (await getBlogPosts()) as Array<{ title?: string; slug?: { current?: string }; publishedAt?: string }>
    const published = (posts || []).filter((p) => p?.slug?.current && p?.title)
    if (published.length) {
      parts.push("## Blog", "", `News, analysis, and opinion on accessibility law, standards, and practice. [Blog index](${baseUrl}/blog).`, "")
      for (const p of published) {
        const date = p.publishedAt ? ` (${p.publishedAt.slice(0, 10)})` : ""
        parts.push(`- [${p.title}](${baseUrl}/blog/${p.slug!.current})${date}`)
      }
      parts.push("")
    }
  } catch (error) {
    console.error("llms.txt: could not load blog posts", error)
  }

  parts.push(
    "## Full index",
    "",
    `- [Complete sitemap](${baseUrl}/sitemap.xml): every indexable page.`,
    `- [RSS feed](${baseUrl}/feed.xml): latest blog posts and editorial updates.`,
    `- [Atom feed](${baseUrl}/atom.xml): latest blog posts and editorial updates.`,
    ""
  )

  return new Response(parts.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  })
}
