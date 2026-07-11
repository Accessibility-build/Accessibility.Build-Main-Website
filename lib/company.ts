export const company = {
  brandName: "Accessibility.build",
  legalOperator: "Khushwant Parihar",
  businessType: "Founder-owned independent accessibility practice",
  ownershipStatement:
    "Accessibility.build is owned and operated by Khushwant Parihar, a GST-registered independent accessibility professional based in Bengaluru, Karnataka, India.",
  taxStatus:
    "GST-registered in India. The applicable GSTIN and tax particulars are provided on valid tax invoices and procurement documents.",
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
  website: "https://accessibility.build",
  founderWebsite: "https://khushwantparihar.com",
  linkedin: "https://linkedin.com/company/accessibilitybuild",
  founderLinkedin: "https://www.linkedin.com/in/khushwantparihar",
} as const

export const legalLastUpdated = "July 12, 2026"

export const businessLocation = [
  company.location.city,
  company.location.region,
  company.location.country,
].join(", ")
