// Paid online courses. Prices and licence names come from lib/products.ts (single source for the
// sales pages); this file adds what the course area and checkout need.
import { products } from "@/lib/products"

export type CourseLicenceType = "individual" | "team"

export interface CourseConfig {
  slug: string
  title: string
  /** Buyers' area (signed in, with a seat). */
  homeRoute: string
  /** Public sales page. */
  salesRoute: string
  licences: Record<CourseLicenceType, { name: string; seats: number; priceUsdCents: number }>
  /** Exam format used by the practice engine (mock size, weights, domain names). */
  exam: CourseExam
  /** Name of the certification body's credential, for the footer disclaimer. */
  certName: string
}

export interface CourseExam {
  name: string
  domains: Record<1 | 2 | 3, string>
  weights: [number, number, number]
  /** Questions per domain in each mock exam. */
  mock: [number, number, number]
  /** Questions per domain in the quick quiz. */
  quick: [number, number, number]
}

const cpacc = products.cpaccCrashCourse
const was = products.wasCrashCourse
const cents = (p: typeof cpacc, id: string) => Math.round((p.licences.find((l) => l.id === id)?.price ?? 0) * 100)

export const COURSES: Record<string, CourseConfig> = {
  "cpacc-crash-course": {
    slug: "cpacc-crash-course",
    title: "CPACC Crash Course",
    homeRoute: "/courses/cpacc-crash-course/learn",
    salesRoute: cpacc.route,
    licences: {
      individual: { name: "Individual", seats: 1, priceUsdCents: cents(cpacc, "individual") },
      team: { name: "Team", seats: 10, priceUsdCents: cents(cpacc, "team") },
    },
    certName: "CPACC",
    exam: {
      name: "CPACC",
      domains: {
        1: "Domain One: Disabilities, Challenges, and Assistive Technologies",
        2: "Domain Two: Accessibility and Universal Design",
        3: "Domain Three: Standards, Laws, and Management Strategies",
      },
      weights: [40, 40, 20],
      mock: [40, 40, 20],
      quick: [8, 8, 4],
    },
  },
  "was-crash-course": {
    slug: "was-crash-course",
    title: "WAS Crash Course",
    homeRoute: "/courses/was-crash-course/learn",
    salesRoute: was.route,
    licences: {
      individual: { name: "Individual", seats: 1, priceUsdCents: cents(was, "individual") },
      team: { name: "Team", seats: 10, priceUsdCents: cents(was, "team") },
    },
    certName: "WAS",
    exam: {
      name: "WAS",
      domains: {
        1: "Domain One: Creating Accessible Web Solutions",
        2: "Domain Two: Identify Accessibility Issues in Web Solutions",
        3: "Domain Three: Remediating Issues in Web Solutions",
      },
      weights: [40, 40, 20],
      mock: [30, 30, 15],
      quick: [8, 8, 4],
    },
  },
}

export function getCourse(slug: string): CourseConfig | null {
  return COURSES[slug] ?? null
}

export function isCourseLicenceType(v: unknown): v is CourseLicenceType {
  return v === "individual" || v === "team"
}

const PREFIX = "course:"

/** Billing catalog key for a course order, stored in billing_orders.catalog_key. */
export function courseCatalogKey(slug: string, licence: CourseLicenceType) {
  return `${PREFIX}${slug}:${licence}`
}

export function parseCourseCatalogKey(key: string | null | undefined): { slug: string; licence: CourseLicenceType } | null {
  if (!key || !key.startsWith(PREFIX)) return null
  const [slug, licence] = key.slice(PREFIX.length).split(":")
  if (!getCourse(slug) || !isCourseLicenceType(licence)) return null
  return { slug, licence }
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
