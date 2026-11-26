// Paid downloadable templates. Single source for names, prices, licences and checkout links,
// read by /templates, both product pages, their Product JSON-LD and llms.txt.
//
// The product files themselves are NOT in this public repo (anyone could download them free);
// their sources and build scripts live in the owner's private ~/accessibility-build-products.
//
// Checkout: Dodo Payments (merchant of record) through /api/checkout. Each licence maps to a sellable
// key (lib/billing/sellables.ts). When Dodo is not configured the buy button falls back to buying by
// invoice through /contact, so the pages never show a dead button.

export interface ProductLicence {
  id: string
  name: string
  price: number
  who: string
}

export interface Product {
  slug: string
  route: string
  name: string
  tagline: string
  format: string
  version: string
  updated: string
  updatedIso: string
  licences: ProductLicence[]
  /** Shown as an "In development" tag until the product is released. */
  inDevelopment?: boolean
  /** One line on who the product is for, shown on the courses hub. */
  audience?: string
}

export const products = {
  wcagWorkbook: {
    slug: "wcag-audit-workbook",
    route: "/templates/wcag-audit-workbook",
    name: "WCAG Audit Workbook",
    tagline:
      "An Excel and Google Sheets workbook for WCAG 2.2 and 2.1 audits: test steps for every criterion, a results grid, an issue log, a suggested conformance level per criterion, and draft ACR remarks.",
    format: "Excel (.xlsx), also works in Google Sheets and LibreOffice",
    version: "1.0",
    updated: "11 November 2026",
    updatedIso: "2026-11-11",
    licences: [
      {
        id: "individual",
        name: "Individual",
        price: 59,
        who: "One person, unlimited audits, including paid client work.",
      },
      {
        id: "team",
        name: "Team",
        price: 149,
        who: "Everyone in one organisation, unlimited audits.",
      },
    ],
  },
  titleIiKit: {
    slug: "title-ii-compliance-kit",
    route: "/templates/title-ii-compliance-kit",
    name: "ADA Title II Web Accessibility Compliance Kit",
    tagline:
      "12 Word templates and a planning workbook for state and local governments facing the DOJ web and mobile app rule: policy, accessibility statement, notice, grievance procedure, procurement clauses, vendor letters, request letters and the 35.204 statement.",
    format: "Word (.docx) and Excel (.xlsx)",
    version: "1.0",
    updated: "11 November 2026",
    updatedIso: "2026-11-11",
    licences: [
      {
        id: "entity",
        name: "Single government",
        price: 199,
        who: "One state or local government entity and its departments.",
      },
      {
        id: "consultant",
        name: "Consultant",
        price: 499,
        who: "Consultants and attorneys using the templates with any number of client governments.",
      },
    ],
  },
  cpaccCrashCourse: {
    slug: "cpacc-crash-course",
    route: "/courses/cpacc-crash-course",
    name: "CPACC Crash Course",
    inDevelopment: true,
    audience: "For people preparing for the IAAP CPACC exam",
    tagline:
      "An independent online course for the IAAP CPACC exam: chapters mapped to every section of the Body of Knowledge, two timed 100-question mock exams, topic practice, flashcards, and what has changed since the Body of Knowledge was written. Use it on Accessibility.build, on any device.",
    format: "Online course on Accessibility.build",
    version: "1.1",
    updated: "17 November 2026",
    updatedIso: "2026-11-17",
    licences: [
      {
        id: "individual",
        name: "Individual",
        price: 49,
        who: "One person preparing for the exam.",
      },
      {
        id: "team",
        name: "Team",
        price: 249,
        who: "Up to 10 people in one organisation, for example a study group or an accessibility team.",
      },
    ],
  },
  wasCrashCourse: {
    slug: "was-crash-course",
    route: "/courses/was-crash-course",
    name: "WAS Crash Course",
    inDevelopment: true,
    audience: "For people preparing for the IAAP WAS exam",
    tagline:
      "An independent online course for the IAAP WAS exam: chapters mapped to every section of the Body of Knowledge with code examples, every WCAG 2.2 success criterion, ARIA patterns, testing with assistive technologies, two timed 75-question mock exams, topic practice and flashcards. Use it on Accessibility.build, on any device.",
    format: "Online course on Accessibility.build",
    version: "1.1",
    updated: "17 November 2026",
    updatedIso: "2026-11-17",
    licences: [
      {
        id: "individual",
        name: "Individual",
        price: 99,
        who: "One person preparing for the exam.",
      },
      {
        id: "team",
        name: "Team",
        price: 499,
        who: "Up to 10 people in one organisation, for example a study group or an accessibility team.",
      },
    ],
  },
  accessibleDesignCourse: {
    slug: "accessible-design",
    route: "/courses/accessible-design",
    name: "Accessible Design for Designers",
    inDevelopment: true,
    audience: "For UI, UX, product and visual designers",
    tagline:
      "A practical online course for designers: color and contrast, typography, layout and reflow, focus states, target size, keyboard and navigation, motion, components, forms, mobile apps, cognitive accessibility, media, data visualization and annotating designs for developers. Illustrated do and don't examples, interactive tools to try each rule, videos of assistive technology in use, a design activity in every lesson, a capstone project, a final exam and a certificate of completion, all mapped to WCAG 2.2 Level AA.",
    format: "Online course on Accessibility.build",
    version: "1.1",
    updated: "25 November 2026",
    updatedIso: "2026-11-25",
    licences: [
      {
        id: "individual",
        name: "Individual",
        price: 79,
        who: "One designer.",
      },
      {
        id: "team",
        name: "Team",
        price: 399,
        who: "Up to 10 people in one organisation, for example a design team or a design system team.",
      },
    ],
  },
} satisfies Record<string, Product>

export const productList: Product[] = [products.wcagWorkbook, products.titleIiKit]
export const courseProductList: Product[] = [products.cpaccCrashCourse, products.wasCrashCourse, products.accessibleDesignCourse]

/** Sellable key used by checkout and the payment webhook for a licence of this product. */
export function sellableKeyFor(p: Product, licenceId: string) {
  return p.route.startsWith("/courses/") ? `course:${p.slug}:${licenceId}` : `template:${p.slug}:${licenceId}`
}

export function formatUsd(n: number): string {
  return `$${n.toLocaleString("en-US")}`
}

export function lowestPrice(p: Product): number {
  return Math.min(...p.licences.map((l) => l.price))
}

/** Product JSON-LD with one Offer per licence. No ratings or review counts: there are none yet. */
export function productJsonLd(p: Product, description: string) {
  const site = "https://accessibility.build"
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description,
    url: `${site}${p.route}`,
    image: `${site}/api/og?title=${encodeURIComponent(p.name)}&section=${p.route.startsWith("/courses") ? "Courses" : "Templates"}`,
    brand: { "@type": "Brand", name: "Accessibility.build" },
    offers: p.licences.map((l) => ({
      "@type": "Offer",
      name: `${l.name} licence`,
      price: l.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${site}${p.route}#buy`,
    })),
  }
}
