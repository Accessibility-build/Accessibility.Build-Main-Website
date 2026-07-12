import { wcagCriteria } from "./wcag-data"
import { wcagSlug } from "./wcag-pages"
import { caseStudies } from "./authority-content"

// Single source of truth for the site's public, indexable routes.
// Consumed by app/sitemap.ts (XML sitemap) and app/sitemap-page (HTML sitemap).
//
// lastModified must be a real content date, never "now" — search engines learn
// to ignore a lastmod that is always fresh. Dates were seeded from git history
// (July 2026). When you substantively update a page, update its date here.
//
// Deliberately excluded (noindexed/private): /hell, /welcome, /reports,
// /accessible-table, /dashboard, /admin/*, /billing*, auth pages, /onboarding,
// /desktop/connect, and the off-topic utility tools (json-formatter,
// password-generator, base64-converter, url-encoder-decoder).

export type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never"

export interface SiteRoute {
  route: string
  label: string
  group: string
  lastModified: string // YYYY-MM-DD
  priority: number
  changeFrequency?: ChangeFrequency
}

const core: SiteRoute[] = [
  { route: "", label: "Home", group: "Core", lastModified: "2026-07-09", priority: 1.0, changeFrequency: "weekly" },
  { route: "/pricing", label: "Pricing", group: "Core", lastModified: "2026-03-06", priority: 0.9 },
  { route: "/faq", label: "FAQ", group: "Core", lastModified: "2025-11-25", priority: 0.91, changeFrequency: "weekly" },
  { route: "/about", label: "About Accessibility.build", group: "Core", lastModified: "2026-07-12", priority: 0.88 },
  { route: "/contact", label: "Contact", group: "Core", lastModified: "2026-07-12", priority: 0.82 },
  { route: "/trust", label: "Trust Centre", group: "Core", lastModified: "2026-07-12", priority: 0.78 },
  { route: "/methodology", label: "Audit Methodology", group: "Core", lastModified: "2026-07-12", priority: 0.84 },
  { route: "/authors/khushwant-parihar", label: "Khushwant Parihar", group: "Core", lastModified: "2026-07-12", priority: 0.82 },
  { route: "/case-studies", label: "Accessibility Case Studies", group: "Core", lastModified: "2026-07-12", priority: 0.88 },
  { route: "/sample-audit-report", label: "Sample Accessibility Audit Report", group: "Core", lastModified: "2026-07-12", priority: 0.86 },
  { route: "/procurement", label: "Procurement Centre", group: "Core", lastModified: "2026-07-12", priority: 0.76 },
  { route: "/subprocessors", label: "Subprocessor Register", group: "Core", lastModified: "2026-07-12", priority: 0.55 },
  { route: "/resources", label: "Resources", group: "Core", lastModified: "2026-01-24", priority: 0.85, changeFrequency: "weekly" },
  { route: "/desktop", label: "Desktop App", group: "Core", lastModified: "2026-07-06", priority: 0.7 },
  { route: "/docs", label: "API Documentation", group: "Core", lastModified: "2026-03-05", priority: 0.6 },
  { route: "/help", label: "Help Center", group: "Core", lastModified: "2026-03-05", priority: 0.6 },
  { route: "/sitemap-page", label: "Sitemap", group: "Core", lastModified: "2026-07-09", priority: 0.3 },
]

const reference: SiteRoute[] = [
  { route: "/reference/aria", label: "ARIA Roles & Attributes Reference", group: "Reference", lastModified: "2026-03-30", priority: 0.96 },
  { route: "/glossary", label: "Web Accessibility Glossary", group: "Reference", lastModified: "2026-07-09", priority: 0.88 },
]

const tools: SiteRoute[] = [
  { route: "/tools", label: "Tools Hub", group: "Tools", lastModified: "2026-05-22", priority: 0.98, changeFrequency: "weekly" },
  { route: "/tools/heading-analyzer", label: "Heading Structure Analyzer", group: "Tools", lastModified: "2025-11-25", priority: 0.97 },
  { route: "/tools/contrast-checker", label: "Color Contrast Checker", group: "Tools", lastModified: "2025-12-12", priority: 0.96 },
  { route: "/tools/accessible-palette-studio", label: "Accessible Palette Studio", group: "Tools", lastModified: "2026-05-22", priority: 0.96 },
  { route: "/tools/accessible-typography-studio", label: "Accessible Typography Studio", group: "Tools", lastModified: "2026-05-22", priority: 0.96 },
  { route: "/tools/color-palette-generator", label: "Color Palette Generator", group: "Tools", lastModified: "2026-05-22", priority: 0.95 },
  { route: "/tools/mobile-accessibility-checker", label: "Mobile Accessibility Checker", group: "Tools", lastModified: "2025-11-25", priority: 0.94 },
  { route: "/tools/accessibility-code-generator", label: "AI Accessibility Code Generator", group: "Tools", lastModified: "2025-11-25", priority: 0.93 },
  { route: "/tools/overlay-detector", label: "Accessibility Overlay Detector", group: "Tools", lastModified: "2026-03-30", priority: 0.93 },
  { route: "/tools/alt-text-generator", label: "AI Alt Text Generator", group: "Tools", lastModified: "2025-11-25", priority: 0.92 },
  { route: "/tools/pdf-accessibility-checker", label: "PDF Accessibility Checker", group: "Tools", lastModified: "2026-03-30", priority: 0.92 },
  { route: "/tools/url-accessibility-auditor", label: "URL Accessibility Auditor", group: "Tools", lastModified: "2025-11-25", priority: 0.91 },
  { route: "/tools/accessibility-roi-calculator", label: "Accessibility ROI Calculator", group: "Tools", lastModified: "2026-03-15", priority: 0.91 },
  { route: "/tools/scope-checker", label: "Scope Checker", group: "Tools", lastModified: "2026-03-06", priority: 0.9 },
  { route: "/tools/accessibility-audit-helper", label: "AI Accessibility Audit Helper", group: "Tools", lastModified: "2025-11-25", priority: 0.9 },
  { route: "/tools/accessibility-report-generator", label: "Accessibility Report Generator", group: "Tools", lastModified: "2025-12-05", priority: 0.9 },
  { route: "/tools/accessibility-statement-generator", label: "Accessibility Statement Generator", group: "Tools", lastModified: "2026-02-11", priority: 0.9 },
  { route: "/tools/ada-compliance-risks", label: "ADA Compliance Risk Assessment", group: "Tools", lastModified: "2025-12-05", priority: 0.88 },
  { route: "/tools/image-color-picker", label: "Image Color Picker", group: "Tools", lastModified: "2025-11-25", priority: 0.8 },
]

const research: SiteRoute[] = [
  { route: "/research", label: "Research Hub", group: "Research", lastModified: "2026-07-09", priority: 0.92, changeFrequency: "weekly" },
  { route: "/research/state-of-accessibility", label: "State of Accessibility Report", group: "Research", lastModified: "2026-03-15", priority: 0.95 },
  { route: "/research/accessibility-laws", label: "Accessibility Laws by Jurisdiction", group: "Research", lastModified: "2026-03-30", priority: 0.94 },
  { route: "/research/accessibility-lawsuits", label: "Accessibility Lawsuit Tracker", group: "Research", lastModified: "2026-07-09", priority: 0.93 },
]

const compliance: SiteRoute[] = [
  { route: "/compliance", label: "Compliance & Laws Hub", group: "Compliance", lastModified: "2026-07-09", priority: 0.9 },
  { route: "/compliance/ada", label: "ADA Website Compliance", group: "Compliance", lastModified: "2026-07-09", priority: 0.93 },
  { route: "/compliance/eaa", label: "European Accessibility Act (EAA)", group: "Compliance", lastModified: "2026-07-09", priority: 0.93 },
  { route: "/compliance/section-508", label: "Section 508 Compliance", group: "Compliance", lastModified: "2026-07-09", priority: 0.91 },
  { route: "/compliance/en-301-549", label: "EN 301 549 Standard", group: "Compliance", lastModified: "2026-07-09", priority: 0.9 },
  { route: "/compliance/california", label: "California & the Unruh Act", group: "Compliance", lastModified: "2026-07-09", priority: 0.9 },
  { route: "/compliance/new-york", label: "New York Accessibility Laws", group: "Compliance", lastModified: "2026-07-09", priority: 0.9 },
]

const industries: SiteRoute[] = [
  { route: "/industries", label: "Accessibility by Industry", group: "Industries", lastModified: "2026-07-09", priority: 0.85 },
  { route: "/industries/ecommerce", label: "E-commerce Accessibility", group: "Industries", lastModified: "2026-07-09", priority: 0.89 },
  { route: "/industries/healthcare", label: "Healthcare Accessibility", group: "Industries", lastModified: "2026-07-09", priority: 0.88 },
  { route: "/industries/education", label: "Education Accessibility", group: "Industries", lastModified: "2026-07-09", priority: 0.88 },
  { route: "/industries/government", label: "Government Accessibility", group: "Industries", lastModified: "2026-07-09", priority: 0.88 },
]

const guides: SiteRoute[] = [
  { route: "/guides", label: "Guides Hub", group: "Guides", lastModified: "2026-07-09", priority: 0.91, changeFrequency: "weekly" },
  { route: "/guides/wcag-2-1-vs-2-2", label: "WCAG 2.1 vs 2.2", group: "Guides", lastModified: "2026-07-09", priority: 0.94 },
  { route: "/guides/wcag-2-2-aa-requirements", label: "WCAG 2.2 AA Requirements", group: "Guides", lastModified: "2026-07-09", priority: 0.94 },
  { route: "/guides/oklch-apca-color-systems", label: "OKLCH & APCA Color Systems", group: "Guides", lastModified: "2026-05-23", priority: 0.95 },
  { route: "/guides/accessible-typography-wcag", label: "Accessible Typography", group: "Guides", lastModified: "2026-05-23", priority: 0.95 },
  { route: "/guides/accessible-forms", label: "Accessible Forms Guide", group: "Guides", lastModified: "2026-07-10", priority: 0.94 },
  { route: "/guides/keyboard-accessibility", label: "Keyboard Accessibility", group: "Guides", lastModified: "2026-03-15", priority: 0.94 },
  { route: "/guides/accessible-color-palettes", label: "Accessible Color Palettes", group: "Guides", lastModified: "2026-04-28", priority: 0.94 },
  { route: "/guides/screen-reader-testing", label: "Screen Reader Testing", group: "Guides", lastModified: "2026-03-15", priority: 0.93 },
  { route: "/guides/ada-website-lawsuit-cost", label: "ADA Website Lawsuit Cost", group: "Guides", lastModified: "2026-07-09", priority: 0.91 },
  { route: "/guides/accessibility-overlays", label: "Accessibility Overlays", group: "Guides", lastModified: "2026-03-30", priority: 0.91 },
  { route: "/guides/accessibility-overlay-alternatives", label: "Overlay Alternatives", group: "Guides", lastModified: "2026-07-09", priority: 0.9 },
  { route: "/guides/automated-vs-manual-accessibility-testing", label: "Automated vs Manual Testing", group: "Guides", lastModified: "2026-07-09", priority: 0.9 },
  { route: "/guides/axe-vs-wave", label: "axe vs WAVE", group: "Guides", lastModified: "2026-07-09", priority: 0.89 },
  { route: "/guides/pdf-accessibility", label: "PDF Accessibility", group: "Guides", lastModified: "2026-03-30", priority: 0.91 },
  { route: "/guides/how-to-audit-website-accessibility", label: "How to Audit Website Accessibility", group: "Guides", lastModified: "2026-05-18", priority: 0.91 },
  { route: "/guides/ai-accessibility-audit", label: "AI Accessibility Audit", group: "Guides", lastModified: "2026-05-18", priority: 0.9 },
  { route: "/guides/ai-accessibility-lawsuits", label: "AI Accessibility Lawsuits", group: "Guides", lastModified: "2026-07-09", priority: 0.9 },
  { route: "/guides/fashion-nova-accessibility-settlement", label: "Fashion Nova Settlement", group: "Guides", lastModified: "2026-07-09", priority: 0.9 },
  { route: "/guides/doj-title-ii-deadline-extension", label: "DOJ Title II Deadline", group: "Guides", lastModified: "2026-05-18", priority: 0.89 },
  { route: "/guides/section-504-web-accessibility-deadline", label: "Section 504 Deadline", group: "Guides", lastModified: "2026-05-18", priority: 0.89 },
]

const checklists: SiteRoute[] = [
  { route: "/checklists", label: "Checklists Hub", group: "Checklists", lastModified: "2026-03-15", priority: 0.87 },
  { route: "/checklists/wcag-2-2", label: "WCAG 2.2 Checklist", group: "Checklists", lastModified: "2026-03-15", priority: 0.96 },
  { route: "/checklists/wcag-2-2/aaa", label: "WCAG 2.2 AAA Checklist", group: "Checklists", lastModified: "2025-12-05", priority: 0.8 },
  { route: "/checklists/wcag-2-2/excel", label: "WCAG 2.2 Excel Checklist", group: "Checklists", lastModified: "2025-12-06", priority: 0.75 },
  { route: "/checklists/interactive", label: "Interactive Checklist", group: "Checklists", lastModified: "2025-11-15", priority: 0.85 },
]

const learn: SiteRoute[] = [
  { route: "/learn", label: "Component Patterns Hub", group: "Learn", lastModified: "2026-02-11", priority: 0.85 },
  { route: "/learn/carousels", label: "Accessible Carousels", group: "Learn", lastModified: "2026-02-11", priority: 0.8 },
  { route: "/learn/modals", label: "Accessible Modals", group: "Learn", lastModified: "2026-02-11", priority: 0.8 },
  { route: "/learn/pagination", label: "Accessible Pagination", group: "Learn", lastModified: "2026-02-11", priority: 0.8 },
  { route: "/learn/search", label: "Accessible Search", group: "Learn", lastModified: "2026-02-11", priority: 0.8 },
  { route: "/learn/table", label: "Accessible Tables", group: "Learn", lastModified: "2026-02-11", priority: 0.8 },
]

const wcag3: SiteRoute[] = [
  { route: "/wcag-3", label: "WCAG 3.0 Guide", group: "WCAG 3.0", lastModified: "2026-03-15", priority: 0.88 },
  { route: "/wcag-3/comparison", label: "WCAG 3.0 vs 2.2", group: "WCAG 3.0", lastModified: "2026-03-15", priority: 0.85 },
  { route: "/wcag-3/concepts", label: "WCAG 3.0 Concepts", group: "WCAG 3.0", lastModified: "2026-03-15", priority: 0.85 },
  { route: "/wcag-3/guidelines", label: "WCAG 3.0 Guidelines", group: "WCAG 3.0", lastModified: "2026-03-15", priority: 0.85 },
  { route: "/wcag-3/preparation", label: "Preparing for WCAG 3.0", group: "WCAG 3.0", lastModified: "2026-03-15", priority: 0.85 },
]

// Only the hub is static. Individual posts now live in Sanity and are appended
// to the XML sitemap (app/sitemap.ts) and HTML sitemap (app/sitemap-page) from
// the CMS at request time, so they are not hardcoded here.
const blog: SiteRoute[] = [
  { route: "/blog", label: "Blog", group: "Blog", lastModified: "2026-07-09", priority: 0.95, changeFrequency: "daily" },
]

const services: SiteRoute[] = [
  { route: "/services", label: "Services Hub", group: "Services", lastModified: "2026-07-12", priority: 0.93 },
  { route: "/services/accessibility-audits", label: "Accessibility Audits", group: "Services", lastModified: "2026-07-12", priority: 0.88 },
  { route: "/services/accessibility-training", label: "Accessibility Training", group: "Services", lastModified: "2026-07-12", priority: 0.86 },
  { route: "/services/compliance-documentation", label: "Compliance Documentation", group: "Services", lastModified: "2026-07-12", priority: 0.84 },
  { route: "/services/remediation-support", label: "Remediation Support", group: "Services", lastModified: "2026-07-12", priority: 0.82 },
  { route: "/services/design-reviews", label: "Design Reviews", group: "Services", lastModified: "2026-07-12", priority: 0.8 },
  { route: "/services/user-testing", label: "User Testing", group: "Services", lastModified: "2026-07-12", priority: 0.78 },
]

const selectedWork: SiteRoute[] = caseStudies.map((study) => ({
  route: `/case-studies/${study.slug}`,
  label: study.title,
  group: "Case Studies",
  lastModified: "2026-07-12",
  priority: 0.78,
  changeFrequency: "yearly",
}))

const legal: SiteRoute[] = [
  { route: "/accessibility", label: "Accessibility Statement", group: "Legal", lastModified: "2026-07-12", priority: 0.7, changeFrequency: "yearly" },
  { route: "/privacy", label: "Privacy Policy", group: "Legal", lastModified: "2026-07-12", priority: 0.4, changeFrequency: "yearly" },
  { route: "/terms", label: "Terms of Service", group: "Legal", lastModified: "2026-07-12", priority: 0.4, changeFrequency: "yearly" },
  { route: "/cookies", label: "Cookie Policy", group: "Legal", lastModified: "2026-07-12", priority: 0.4, changeFrequency: "yearly" },
  { route: "/refund", label: "Refund Policy", group: "Legal", lastModified: "2026-07-12", priority: 0.4, changeFrequency: "yearly" },
  { route: "/editorial-policy", label: "Editorial Policy", group: "Legal", lastModified: "2026-07-12", priority: 0.5, changeFrequency: "yearly" },
  { route: "/corrections-policy", label: "Corrections Policy", group: "Legal", lastModified: "2026-07-12", priority: 0.45, changeFrequency: "yearly" },
]

// WCAG criterion pages: dates for the original 38 come from git history; pages
// added in the July 2026 buildout share that date. High-value criteria
// (new-in-2.2 / most-failed) get a small priority boost.
const wcagPageDates: Record<string, string> = {
  "1-1-1": "2025-11-15",
  "1-2-1": "2026-01-24",
  "1-2-2": "2026-01-24",
  "1-2-3": "2026-01-24",
  "1-3-1": "2026-01-24",
  "1-3-2": "2026-01-24",
  "1-3-3": "2026-01-24",
  "1-4-1": "2025-12-12",
  "1-4-2": "2026-01-29",
  "1-4-3": "2026-01-29",
  "1-4-10": "2026-07-05",
  "1-4-11": "2026-06-28",
  "1-4-12": "2026-07-07",
  "1-4-13": "2026-07-06",
  "2-1-1": "2026-01-29",
  "2-1-2": "2026-01-29",
  "2-1-4": "2026-01-29",
  "2-2-1": "2026-01-29",
  "2-2-2": "2026-01-29",
  "2-3-1": "2026-01-29",
  "2-4-1": "2026-01-29",
  "2-4-2": "2026-01-29",
  "2-4-3": "2026-01-29",
  "2-4-4": "2026-06-28",
  "2-4-6": "2026-07-08",
  "2-4-7": "2026-06-26",
  "2-4-11": "2026-06-29",
  "2-5-7": "2026-07-02",
  "2-5-8": "2026-06-25",
  "3-1-1": "2026-07-09",
  "3-2-6": "2026-07-04",
  "3-3-1": "2026-06-30",
  "3-3-2": "2026-06-26",
  "3-3-3": "2026-06-30",
  "3-3-7": "2026-07-03",
  "3-3-8": "2026-07-01",
  "4-1-2": "2026-06-25",
  "4-1-3": "2026-06-29",
}
const WCAG_BUILDOUT_DATE = "2026-07-09"
const highValueWcag = new Set([
  "1-4-10", "1-4-11", "1-4-12", "1-4-13", "2-4-6", "2-4-7", "2-4-11",
  "2-5-7", "2-5-8", "3-1-1", "3-2-6", "3-3-1", "3-3-2", "3-3-3", "3-3-7",
  "3-3-8", "4-1-2", "4-1-3", "1-4-4", "1-4-5",
])

const wcagPages: SiteRoute[] = [
  { route: "/wcag", label: "WCAG Success Criteria Hub", group: "WCAG", lastModified: "2026-07-09", priority: 0.94, changeFrequency: "weekly" },
  ...wcagCriteria.map((c) => {
    const slug = wcagSlug(c.number)
    return {
      route: `/wcag/${slug}`,
      label: `${c.number} ${c.title}`,
      group: "WCAG",
      lastModified: wcagPageDates[slug] ?? WCAG_BUILDOUT_DATE,
      priority: highValueWcag.has(slug) ? 0.9 : c.level === "AAA" ? 0.82 : 0.88,
    }
  }),
]

export const siteRoutes: SiteRoute[] = [
  ...core,
  ...reference,
  ...tools,
  ...research,
  ...compliance,
  ...industries,
  ...guides,
  ...checklists,
  ...learn,
  ...wcag3,
  ...wcagPages,
  ...blog,
  ...services,
  ...selectedWork,
  ...legal,
]
