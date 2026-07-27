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

// Professional certifications held by the founder. Single source of truth for
// the author profile, the About page, and the Person structured data. Keep
// claims verifiable — do not add a credential here that cannot be evidenced.
export const founderCredentials = [
  {
    name: "Certified Professional in Accessibility Core Competencies",
    abbreviation: "CPACC",
    issuer: "International Association of Accessibility Professionals",
    issuerShort: "IAAP",
    issuerUrl: "https://www.accessibilityassociation.org",
    year: 2026,
    description:
      "IAAP's foundational, cross-disability certification covering disabilities and their impacts, accessibility standards and laws, and universal design.",
  },
] as const

// schema.org EducationalOccupationalCredential objects for the founder's
// certifications, for use in the Person node's hasCredential property.
export const founderCredentialSchema = founderCredentials.map((credential) => ({
  "@type": "EducationalOccupationalCredential",
  name: `${credential.name} (${credential.abbreviation})`,
  credentialCategory: "certification",
  recognizedBy: {
    "@type": "Organization",
    name: credential.issuer,
    alternateName: credential.issuerShort,
    url: credential.issuerUrl,
  },
}))

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
