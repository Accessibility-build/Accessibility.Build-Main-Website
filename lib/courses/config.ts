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
  /** Name of the certification body's credential, for the footer disclaimer. Empty for skills courses. */
  certName: string
  /** "exam-prep" courses prepare for a certification; "skills" courses teach a practice and end in a final assessment. */
  kind: "exam-prep" | "skills"
  /** Skills courses only: what the completion certificate says. */
  certificate?: { summary: string; skills: string[]; validityMonths: number; renewal: CourseRenewal }
  /** Skills courses only: the final exam that must be passed before the certificate. */
  finalExam?: CourseFinalExam
  /** Skills courses only: the lesson whose audit screens become the capstone design file, and the activity that unlocks the marked solution. */
  capstone?: { chapterKey: string; activityId: string }
}

/** Paid renewal exam that extends a certificate's validity. */
export interface CourseRenewal {
  priceUsd: number
  questions: number
  passPercent: number
  minutes: number
  /** Attempts included in one renewal purchase. */
  attemptsPerPurchase: number
  /** Renewal opens this many days before expiry... */
  opensDaysBefore: number
  /** ...and stays open this many months after it. After that, the full course and final exam are needed again. */
  closesMonthsAfter: number
}

export interface CourseFinalExam {
  /** Questions on each paper, shared evenly across the course's sections so every topic is covered. */
  questions: number
  passPercent: number
  /** Standard time; 1.5x, 2x and untimed are always offered as accommodations. */
  minutes: number
  attemptsPerRound: number
  /** Wait after the last failed attempt of a round; completion is also reset. */
  cooldownDays: number
}

export interface CourseExam {
  name: string
  /** What a full timed set is called: "Mock Exam" for exam prep, "Final Assessment" for skills courses. */
  mockLabel?: string
  /** One-line description of the timed set, shown before it starts. Defaults to the exam-prep wording. */
  mockIntro?: string
  /** Minutes allowed for a full set; defaults to 120. */
  mockMinutes?: number
  /** Label for a question's reference line; defaults to "Body of Knowledge". */
  refLabel?: string
  domains: Record<1 | 2 | 3, string>
  weights: [number, number, number]
  /** Questions per domain in each mock exam. */
  mock: [number, number, number]
  /** Questions per domain in the quick quiz. */
  quick: [number, number, number]
}

const cpacc = products.cpaccCrashCourse
const was = products.wasCrashCourse
const design = products.accessibleDesignCourse
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
    kind: "exam-prep",
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
    kind: "exam-prep",
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
  "accessible-design": {
    slug: "accessible-design",
    title: "Accessible Design for Designers",
    homeRoute: "/courses/accessible-design/learn",
    salesRoute: design.route,
    licences: {
      individual: { name: "Individual", seats: 1, priceUsdCents: cents(design, "individual") },
      team: { name: "Team", seats: 10, priceUsdCents: cents(design, "team") },
    },
    certName: "",
    kind: "skills",
    certificate: {
      summary: "Completed every lesson and design activity and passed the final exam on designing accessible interfaces: visual design, interaction design, content and design handoff, mapped to WCAG 2.2 Level AA.",
      skills: ["Color and contrast", "Typography and reflow", "Focus and keyboard design", "Target size and pointer input", "Motion and animation", "Accessible forms", "Content and data visualization", "Annotation and handoff"],
      validityMonths: 24,
      renewal: { priceUsd: 29, questions: 24, passPercent: 80, minutes: 45, attemptsPerPurchase: 3, opensDaysBefore: 60, closesMonthsAfter: 12 },
    },
    finalExam: { questions: 48, passPercent: 80, minutes: 90, attemptsPerRound: 3, cooldownDays: 30 },
    capstone: { chapterKey: "capstone-project", activityId: "design-capstone-fernhill" },
    exam: {
      name: "Accessible Design",
      mockLabel: "Final Assessment",
      mockIntro: "A course assessment written for this course, not a certification exam. Questions are scenario based, with one best answer each.",
      mockMinutes: 60,
      refLabel: "Course reference",
      domains: {
        1: "Part One: Visual design",
        2: "Part Two: Interaction design",
        3: "Part Three: Content and delivery",
      },
      weights: [40, 40, 20],
      mock: [20, 20, 10],
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
