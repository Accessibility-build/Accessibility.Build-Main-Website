import { siteRoutes, type SiteRoute } from "@/lib/site-routes"
import { servicePricing, serviceStartingPrices } from "@/lib/service-pricing"
import { company, founderCertifications, registeredBusinessLocation, businessLocation } from "@/lib/company"
import { getBlogPosts } from "@/lib/sanity"
import { linkDescriptionFor } from "@/lib/internal-linking"

// Builds /llms.txt, a curated Markdown guide, and /llms-full.txt, the complete list, for large language models and AI answer engines (see llmstxt.org). Generated
// from lib/site-routes.ts so it stays in sync with the real route list, plus
// the published blog posts from Sanity.
//
// Every route group in lib/site-routes.ts must have an entry in `sections` or
// it silently never renders (the Services group was missing until Sept 2026,
// and Blog and Legal after that).

const baseUrl = "https://accessibility.build"

const RESEARCH_DATASETS: Array<{ slug: string; name: string }> = [
  { slug: "lawsuits", name: "US website accessibility lawsuits" },
  { slug: "laws", name: "Accessibility laws by jurisdiction" },
  { slug: "state-of-accessibility", name: "State of web accessibility (WebAIM Million synthesis)" },
  { slug: "disability-statistics", name: "US disability prevalence (CDC BRFSS)" },
  { slug: "european-accessibility-act", name: "European Accessibility Act tracker" },
  { slug: "section-508", name: "Section 508 federal agency assessment" },
  { slug: "salary", name: "Digital accessibility salary survey" },
  { slug: "by-industry", name: "Accessibility errors by industry (WebAIM Million)" },
  { slug: "by-technology", name: "Accessibility errors by technology stack (WebAIM Million)" },
  { slug: "agent-readiness", name: "AI agent readiness of UK home pages, 2026" },
  { slug: "screen-reader-survey", name: "WebAIM Screen Reader User Survey #11 (2026) compared with #10 (2024)" },
  { slug: "accessibility-statements", name: "Accessibility statements of UK councils and the FTSE 100, 2026" },
]

// Groups rendered, in order, with a one-line orientation for the model.
const sections: Array<{ group: string; heading: string; blurb: string; minPriority?: number; curatedLimit?: number }> = [
  { group: "Core", heading: "Key pages", blurb: "Primary entry points.", minPriority: 0.6 },
  {
    group: "Services",
    heading: "Professional services and audit pricing",
    blurb:
      `Founder-led services with published fixed prices, delivered by an IAAP CPACC-certified auditor. Fixed-price WCAG 2.2 AA audits start at $${serviceStartingPrices.audits.toLocaleString("en-US")} (Essential), $${servicePricing.audits.tiers[1].price.toLocaleString("en-US")} (Product Audit), and $${servicePricing.audits.tiers[2].price.toLocaleString("en-US")} (Complex Product Audit). For market-wide audit costs with sources, see [Web Accessibility Audit Cost (UK & Ireland)](${baseUrl}/guides/accessibility-audit-cost). Note that ${baseUrl}/pricing prices credits for the self-serve tools, not audit services.`,
  },
  { group: "Tools", heading: "Free accessibility tools", blurb: "Interactive testing and generation tools. Some run entirely in the browser, so files and text never leave the device; the URL tools load the page in a headless browser on our server. Some AI-assisted features use credits." },
  { group: "WCAG", heading: "WCAG 2.2 success criteria", blurb: "In-depth guide for every one of the 86 WCAG 2.2 success criteria (Level A, AA, AAA), each with requirements, examples, and testing methods.", curatedLimit: 12 },
  { group: "Guides", heading: "Guides", blurb: "How-to and explainer articles.", minPriority: 0.88, curatedLimit: 20 },
  { group: "Compliance", heading: "Accessibility law & compliance", blurb: "Jurisdiction guides: ADA, EAA, Section 508, EN 301 549, UK, Ireland, and US states. Educational, not legal advice." },
  { group: "Industries", heading: "Accessibility by industry", blurb: "Sector-specific compliance guidance." },
  { group: "Cases", heading: "Accessibility case studies", blurb: "Long-form studies of the litigation that shaped web accessibility law, built from the filings and judgments, with a section in each correcting claims that are commonly repeated but unsupported by the record." },
  { group: "Research", heading: "Original research & data", blurb: "Citable datasets and reports on accessibility lawsuits, laws, and the state of web accessibility, each with a stated review date and linked primary sources." },
  { group: "Checklists", heading: "Checklists", blurb: "WCAG and EN 301 549 conformance checklists." },
  { group: "Reference", heading: "Reference", blurb: "Glossary and ARIA reference." },
  { group: "Learn", heading: "Component patterns", blurb: "Accessible UI pattern demos with keyboard interaction tables." },
  { group: "Recipes", heading: "Accessibility recipes", blurb: "Small, tested techniques, each with a live demo, copy-ready code, the WCAG criteria it serves, and the cases it does not cover." },
  { group: "WCAG 3.0", heading: "WCAG 3.0", blurb: "Guides to the next-generation accessibility guidelines." },
  { group: "Legal", heading: "Policies and statements", blurb: "The site's own accessibility statement, privacy, cookies, terms, refunds, editorial and corrections policies." },
]

// "- [title](url): description", the llms.txt convention, so a model can tell what a page answers
// before fetching it. Descriptions come from lib/internal-linking.ts, the same text RelatedContent
// shows; routes without one are listed by title alone.
function line(r: SiteRoute): string {
  const description = linkDescriptionFor(r.route || "/")
  return `- [${r.label}](${baseUrl}${r.route || "/"})${description ? `: ${description.replace(/\s+/g, " ").trim()}` : ""}`
}

function criterionSort(a: SiteRoute, b: SiteRoute): number {
  const version = (r: SiteRoute) => r.route.match(/\/wcag\/(\d+)-(\d+)-(\d+)$/)?.slice(1).map(Number)
  const left = version(a)
  const right = version(b)
  if (!left) return right ? -1 : 0
  if (!right) return 1
  return left[0] - right[0] || left[1] - right[1] || left[2] - right[2]
}

// full=false serves /llms.txt, the curated guide. full=true serves /llms-full.txt,
// which lists every section entry and every blog post.
export async function buildLlmsResponse({ full }: { full: boolean }): Promise<Response> {
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
    if (!full && section.curatedLimit) routes = routes.slice(0, section.curatedLimit)
    if (section.group === "WCAG") routes.sort(criterionSort)
    parts.push(`## ${section.heading}`, "", section.blurb, "")
    for (const r of routes) parts.push(line(r))
    parts.push("")
  }

  parts.push(
    "## Open datasets",
    "",
    `Machine-readable research data as JSON, with CSV for each table (\`?table=<name>&format=csv\`). Each response states its licence, attribution and last-updated date. WebAIM-derived data stays under WebAIM's terms.`,
    "",
    ...RESEARCH_DATASETS.map((d) => `- [${d.name}](${baseUrl}/api/research/${d.slug})`),
    ""
  )

  // Blog posts live in Sanity, not in the route table.
  try {
    const posts = (await getBlogPosts()) as Array<{ title?: string; slug?: { current?: string }; publishedAt?: string }>
    const published = (posts || []).filter((p) => p?.slug?.current && p?.title)
    if (published.length) {
      parts.push("## Blog", "", `News, analysis, and opinion on accessibility law, standards, and practice. [Blog index](${baseUrl}/blog).`, "")
      for (const p of full ? published : published.slice(0, 10)) {
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
    `- [Full llms file](${baseUrl}/llms-full.txt): every section entry and blog post listed here in full.`,
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
