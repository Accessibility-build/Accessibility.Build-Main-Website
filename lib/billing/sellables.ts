// Everything the site sells, behind one key format. The key is stored in billing_orders.catalog_key,
// used as the Dodo product's metadata.sku, and decides how the payment webhook fulfils the order.
//   credit packs:  starter_50, pro_200, ...            -> add credits
//   courses:       course:<slug>:<individual|team>     -> course licence (online access)
//   templates:     template:<slug>:<licence id>        -> download entitlement
import { getCatalogPack, isCheckoutCatalogKey } from "./catalog"
import { COURSES, courseCatalogKey, getCourse, parseCourseCatalogKey, type CourseLicenceType } from "@/lib/courses/config"
import { products } from "@/lib/products"

export type SellableKind = "credits" | "course" | "template"
export type DodoTaxCategory = "digital_products" | "saas" | "e_book" | "edtech"

export interface Sellable {
  key: string
  kind: SellableKind
  name: string
  description: string
  priceUsdCents: number
  credits: number
  taxCategory: DodoTaxCategory
  /** Where the buyer lands after paying (the return page polls, then sends them here). */
  successPath: string
  cancelPath: string
  course?: { slug: string; licence: CourseLicenceType }
  template?: { slug: string; licence: string }
}

const TEMPLATE_PREFIX = "template:"
const TEMPLATES = { "wcag-audit-workbook": products.wcagWorkbook, "title-ii-compliance-kit": products.titleIiKit } as const
export type TemplateSlug = keyof typeof TEMPLATES

export function templateKey(slug: string, licence: string) {
  return `${TEMPLATE_PREFIX}${slug}:${licence}`
}

export function parseTemplateKey(key: string | null | undefined): { slug: TemplateSlug; licence: string } | null {
  if (!key || !key.startsWith(TEMPLATE_PREFIX)) return null
  const [slug, licence] = key.slice(TEMPLATE_PREFIX.length).split(":")
  const p = TEMPLATES[slug as TemplateSlug]
  if (!p || !p.licences.some((l) => l.id === licence)) return null
  return { slug: slug as TemplateSlug, licence }
}

export function getTemplateProduct(slug: string) {
  return TEMPLATES[slug as TemplateSlug] ?? null
}

export function getSellable(key: string): Sellable | null {
  if (isCheckoutCatalogKey(key)) {
    const pack = getCatalogPack(key)
    if (!pack.checkoutEnabled) return null
    return {
      key,
      kind: "credits",
      name: `Accessibility.build ${pack.name} (${pack.credits.toLocaleString("en-US")} credits)`,
      description: pack.description,
      priceUsdCents: pack.amountCents,
      credits: pack.credits,
      taxCategory: "saas",
      successPath: "/billing?checkout=success",
      cancelPath: "/pricing",
    }
  }
  const c = parseCourseCatalogKey(key)
  if (c) {
    const course = getCourse(c.slug)!
    const lic = course.licences[c.licence]
    return {
      key,
      kind: "course",
      name: `${course.title}: ${lic.name} licence`,
      description: lic.seats > 1 ? `Online course access for up to ${lic.seats} people` : "Online course access for one person",
      priceUsdCents: lic.priceUsdCents,
      credits: 0,
      taxCategory: "edtech",
      successPath: course.homeRoute,
      cancelPath: `${course.salesRoute}#buy`,
      course: c,
    }
  }
  const t = parseTemplateKey(key)
  if (t) {
    const p = TEMPLATES[t.slug]
    const lic = p.licences.find((l) => l.id === t.licence)!
    return {
      key,
      kind: "template",
      name: `${p.name}: ${lic.name} licence`,
      description: lic.who,
      priceUsdCents: Math.round(lic.price * 100),
      credits: 0,
      taxCategory: "digital_products",
      successPath: "/account/downloads",
      cancelPath: `${p.route}#buy`,
      template: t,
    }
  }
  return null
}

/** All sellables, for the product sync script and admin views. */
export function listSellableKeys(): string[] {
  const credit = ["starter_50", "pro_200", "business_500", "growth_2500", "team_5000", "team_15000"].filter(isCheckoutCatalogKey)
  const course = Object.keys(COURSES).flatMap((slug) => (["individual", "team"] as CourseLicenceType[]).map((l) => courseCatalogKey(slug, l)))
  const tmpl = Object.entries(TEMPLATES).flatMap(([slug, p]) => p.licences.map((l) => templateKey(slug, l.id)))
  return [...credit, ...course, ...tmpl]
}
