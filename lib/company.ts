export const company = {
  brandName: "Accessibility.build",
  legalOperator: "Khushwant Parihar",
  legalName: "KHUSHWANT PARIHAR",
  businessType: "Sole proprietorship",
  businessDescription: "Founder-owned independent accessibility practice",
  ownershipStatement:
    "Accessibility.build is owned and operated by Khushwant Parihar as an Indian sole proprietorship registered for GST in Rajasthan.",
  taxStatus:
    "Regular GST registration 08FGIPP1206G1ZH, effective 10 April 2026. Applicable tax details are included on valid invoices.",
  gstin: "08FGIPP1206G1ZH",
  gstRegistrationType: "Regular",
  gstRegistrationDate: "10 April 2026",
  foundedYear: 2023,
  email: "contact@accessibility.build",
  accessibilityEmail: "contact@accessibility.build",
  privacyEmail: "contact@accessibility.build",
  billingEmail: "contact@accessibility.build",
  responseTime: "Within two business days",
  location: {
    city: "Bengaluru",
    region: "Karnataka",
    country: "India",
    countryCode: "IN",
  },
  registeredOffice: {
    addressLine1: "318, School Ke Paas",
    addressLine2: "Chavandia Road",
    locality: "Chanwadiya Kalan",
    district: "Beawar",
    region: "Rajasthan",
    postalCode: "306305",
    country: "India",
    countryCode: "IN",
  },
  website: "https://accessibility.build",
  founderWebsite: "https://khushwantparihar.com",
  linkedin: "https://linkedin.com/company/accessibilitybuild",
  founderLinkedin: "https://www.linkedin.com/in/khushwantparihar",
} as const

export const legalLastUpdated = "July 12, 2026"

// Founder credentials. Single source of truth for the author profile, the
// About page, and the Person structured data. Keep every claim verifiable —
// do not add a credential here that cannot be evidenced.
export type FounderCredential = {
  name: string
  tag?: string // short badge, e.g. "CPACC" or "Section 508"
  issuer: string
  issuerShort?: string
  issuerUrl?: string // only when the URL is confirmed to resolve
  credentialId?: string
  verifyUrl?: string // a public per-credential verification page
  platform?: string // delivery platform when different from the issuer
  issued: string
  description?: string
}

// Professional certifications — government- or association-issued, kept
// distinct from continuing-education courses so neither tier is overstated.
export const founderCertifications: FounderCredential[] = [
  {
    name: "Certified Professional in Accessibility Core Competencies",
    tag: "CPACC",
    issuer: "International Association of Accessibility Professionals",
    issuerShort: "IAAP",
    issuerUrl: "https://www.accessibilityassociation.org",
    issued: "2026",
    description:
      "IAAP's foundational, cross-disability certification covering disabilities and their impacts, accessibility standards and laws, and universal design.",
  },
  {
    name: "DHS Trusted Tester Certification",
    tag: "Section 508",
    issuer: "U.S. Department of Homeland Security",
    issuerShort: "DHS",
    credentialId: "TT-2312-03756",
    issued: "December 2022",
    description:
      "The U.S. federal certification in the DHS Trusted Tester Process — a standardized, reproducible manual methodology for evaluating software and web content for Section 508 conformance.",
  },
]

// Continuing education — verifiable course completions relevant to the practice.
export const founderCourses: FounderCredential[] = [
  {
    name: "Advanced Usability and Accessibility Practices",
    issuer: "Board Infinity",
    platform: "Coursera",
    issued: "January 2025",
    credentialId: "1VORN10NZRP2",
    verifyUrl: "https://www.coursera.org/account/accomplishments/verify/1VORN10NZRP2",
  },
  {
    name: "Learn Accessible Web Design",
    issuer: "Scrimba",
    platform: "Coursera",
    issued: "January 2025",
    credentialId: "M2TMZMYHVW82",
    verifyUrl: "https://www.coursera.org/account/accomplishments/verify/M2TMZMYHVW82",
  },
  {
    name: "Foundations of User Experience (UX) Design",
    issuer: "Google",
    platform: "Coursera",
    issued: "April 2021",
    credentialId: "7MM6UA3QXSCR",
    verifyUrl: "https://www.coursera.org/account/accomplishments/verify/7MM6UA3QXSCR",
  },
]

// schema.org EducationalOccupationalCredential nodes for the Person node's
// hasCredential property. Built from both tiers; url/identifier included only
// where present.
function credentialNode(credential: FounderCredential, category: string) {
  const recognizedBy: Record<string, unknown> = {
    "@type": "Organization",
    name: credential.issuer,
  }
  if (credential.issuerShort) recognizedBy.alternateName = credential.issuerShort
  if (credential.issuerUrl) recognizedBy.url = credential.issuerUrl

  const node: Record<string, unknown> = {
    "@type": "EducationalOccupationalCredential",
    name:
      credential.tag && credential.tag !== credential.name
        ? `${credential.name} (${credential.tag})`
        : credential.name,
    credentialCategory: category,
    recognizedBy,
  }
  if (credential.credentialId) node.identifier = credential.credentialId
  if (credential.verifyUrl) node.url = credential.verifyUrl
  return node
}

export const founderCredentialSchema = [
  ...founderCertifications.map((c) => credentialNode(c, "certification")),
  ...founderCourses.map((c) => credentialNode(c, "certificate")),
]

export const businessLocation = [
  company.location.city,
  company.location.region,
  company.location.country,
].join(", ")

export const registeredBusinessLocation = [
  company.registeredOffice.district,
  company.registeredOffice.region,
  company.registeredOffice.country,
].join(", ")

export const registeredBusinessAddress = [
  company.registeredOffice.addressLine1,
  company.registeredOffice.addressLine2,
  company.registeredOffice.locality,
  company.registeredOffice.district,
  company.registeredOffice.region,
  company.registeredOffice.postalCode,
  company.registeredOffice.country,
].join(", ")
