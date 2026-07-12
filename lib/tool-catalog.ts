export type ToolCategory =
  | "Audit and testing"
  | "Content and documents"
  | "Design systems"
  | "Business planning"
  | "Developer utilities"

export type ToolIconName =
  | "scan"
  | "image"
  | "contrast"
  | "heading"
  | "palette"
  | "sparkles"
  | "type"
  | "mobile"
  | "code"
  | "shield"
  | "globe"
  | "report"
  | "statement"
  | "scale"
  | "trending"
  | "overlay"
  | "pdf"
  | "pipette"
  | "binary"
  | "link"
  | "lock"
  | "braces"

export interface ToolCatalogItem {
  slug: string
  title: string
  shortTitle: string
  description: string
  category: ToolCategory
  icon: ToolIconName
  features: string[]
  keywords: string[]
  credits: number
  popular?: boolean
}

export const toolCategories: ToolCategory[] = [
  "Audit and testing",
  "Content and documents",
  "Design systems",
  "Business planning",
  "Developer utilities",
]

export const toolCatalog: ToolCatalogItem[] = [
  {
    slug: "accessibility-audit-helper",
    title: "Accessibility Audit Helper",
    shortTitle: "Audit Helper",
    description: "Analyze an accessibility issue, code sample, or implementation question with WCAG-oriented guidance.",
    category: "Audit and testing",
    icon: "scan",
    features: ["Issue analysis", "WCAG mapping", "Implementation guidance"],
    keywords: ["audit", "wcag", "code", "issue", "ai"],
    credits: 1,
    popular: true,
  },
  {
    slug: "url-accessibility-auditor",
    title: "URL Accessibility Auditor",
    shortTitle: "URL Auditor",
    description: "Run an axe-core accessibility scan against a public page and organize findings by impact and criterion.",
    category: "Audit and testing",
    icon: "shield",
    features: ["Live URL scan", "Impact filters", "Exportable findings"],
    keywords: ["url", "website", "axe", "scan", "audit"],
    credits: 5,
    popular: true,
  },
  {
    slug: "mobile-accessibility-checker",
    title: "Mobile Accessibility Checker",
    shortTitle: "Mobile Checker",
    description: "Review touch targets, viewport behavior, responsive layout, and mobile-specific accessibility risks.",
    category: "Audit and testing",
    icon: "mobile",
    features: ["Device presets", "Touch targets", "Responsive checks"],
    keywords: ["mobile", "touch", "responsive", "device", "wcag"],
    credits: 2,
  },
  {
    slug: "heading-analyzer",
    title: "Heading Structure Analyzer",
    shortTitle: "Heading Analyzer",
    description: "Inspect heading hierarchy from a URL or markup and identify skipped, missing, or unclear heading levels.",
    category: "Audit and testing",
    icon: "heading",
    features: ["Hierarchy outline", "Skipped-level checks", "Recommendations"],
    keywords: ["heading", "h1", "outline", "seo", "screen reader"],
    credits: 0,
  },
  {
    slug: "contrast-checker",
    title: "Color Contrast Checker",
    shortTitle: "Contrast Checker",
    description: "Compare foreground and background colors against WCAG contrast requirements and APCA guidance.",
    category: "Audit and testing",
    icon: "contrast",
    features: ["WCAG ratios", "APCA context", "Color suggestions"],
    keywords: ["contrast", "color", "wcag", "apca", "foreground"],
    credits: 0,
    popular: true,
  },
  {
    slug: "pdf-accessibility-checker",
    title: "PDF Accessibility Checker",
    shortTitle: "PDF Checker",
    description: "Inspect a PDF for document structure, tagging, language, image, form, and reading-order risks.",
    category: "Audit and testing",
    icon: "pdf",
    features: ["Structure checks", "PDF/UA context", "Fix guidance"],
    keywords: ["pdf", "document", "tags", "pdfua", "forms"],
    credits: 2,
  },
  {
    slug: "overlay-detector",
    title: "Accessibility Overlay Detector",
    shortTitle: "Overlay Detector",
    description: "Check a public website for known accessibility overlay products and compare claims with detected barriers.",
    category: "Audit and testing",
    icon: "overlay",
    features: ["Vendor detection", "Page scan", "Evidence summary"],
    keywords: ["overlay", "widget", "vendor", "website", "scan"],
    credits: 0,
  },
  {
    slug: "scope-checker",
    title: "Website Scope Checker",
    shortTitle: "Scope Checker",
    description: "Discover internal pages and document URLs to build a practical accessibility-audit inventory.",
    category: "Audit and testing",
    icon: "globe",
    features: ["Page discovery", "Document inventory", "Chunked export"],
    keywords: ["scope", "crawl", "sitemap", "inventory", "pages"],
    credits: 0,
  },
  {
    slug: "alt-text-generator",
    title: "Alt Text Generator",
    shortTitle: "Alt Text",
    description: "Generate context-aware image descriptions with controls for purpose, length, language, and tone.",
    category: "Content and documents",
    icon: "image",
    features: ["Image analysis", "Context controls", "Multiple variants"],
    keywords: ["alt text", "image", "description", "content", "ai"],
    credits: 1,
    popular: true,
  },
  {
    slug: "accessibility-code-generator",
    title: "Accessible Code Generator",
    shortTitle: "Code Generator",
    description: "Generate accessible component code with WCAG targets, implementation notes, and test considerations.",
    category: "Content and documents",
    icon: "code",
    features: ["Component generation", "WCAG targets", "Testing notes"],
    keywords: ["code", "component", "html", "react", "aria"],
    credits: 2,
  },
  {
    slug: "accessibility-report-generator",
    title: "Accessibility Report Generator",
    shortTitle: "Report Generator",
    description: "Turn structured findings into a client-ready accessibility report with summaries and export formats.",
    category: "Content and documents",
    icon: "report",
    features: ["Finding import", "Report sections", "HTML export"],
    keywords: ["report", "audit", "findings", "export", "client"],
    credits: 0,
  },
  {
    slug: "accessibility-statement-generator",
    title: "Accessibility Statement Generator",
    shortTitle: "Statement Generator",
    description: "Build an accessibility statement from organizational, conformance, contact, and review information.",
    category: "Content and documents",
    icon: "statement",
    features: ["Guided form", "Statement templates", "Multi-format export"],
    keywords: ["statement", "policy", "conformance", "contact", "template"],
    credits: 0,
  },
  {
    slug: "color-palette-generator",
    title: "Accessible Color Palette Generator",
    shortTitle: "Palette Generator",
    description: "Create color harmonies from a seed color and inspect usable foreground and background combinations.",
    category: "Design systems",
    icon: "palette",
    features: ["Color harmonies", "Contrast checks", "Token export"],
    keywords: ["palette", "color", "harmony", "design", "tokens"],
    credits: 0,
  },
  {
    slug: "accessible-palette-studio",
    title: "Accessible Palette Studio",
    shortTitle: "Palette Studio",
    description: "Build OKLCH color scales with state-aware grading, CVD simulation, previews, and platform exports.",
    category: "Design systems",
    icon: "sparkles",
    features: ["OKLCH scales", "CVD simulation", "Platform exports"],
    keywords: ["oklch", "palette", "design system", "cvd", "tailwind"],
    credits: 0,
    popular: true,
  },
  {
    slug: "accessible-typography-studio",
    title: "Accessible Typography Studio",
    shortTitle: "Typography Studio",
    description: "Create a responsive type system with readability analysis, cognitive presets, and reusable exports.",
    category: "Design systems",
    icon: "type",
    features: ["Type scales", "Readability analysis", "Fluid sizing"],
    keywords: ["typography", "type scale", "readability", "font", "clamp"],
    credits: 0,
  },
  {
    slug: "image-color-picker",
    title: "Image Color Picker",
    shortTitle: "Color Picker",
    description: "Sample colors from an uploaded image, build a palette, and export values for design work.",
    category: "Design systems",
    icon: "pipette",
    features: ["Pixel sampling", "Saved palette", "CSS and JSON export"],
    keywords: ["image", "color picker", "palette", "hex", "rgb"],
    credits: 0,
  },
  {
    slug: "ada-compliance-risks",
    title: "ADA Compliance Risk Assessment",
    shortTitle: "ADA Risk",
    description: "Model accessibility risk factors and produce a prioritized planning summary for internal discussion.",
    category: "Business planning",
    icon: "scale",
    features: ["Risk factors", "Priority score", "Action plan"],
    keywords: ["ada", "risk", "legal", "assessment", "planning"],
    credits: 0,
  },
  {
    slug: "accessibility-roi-calculator",
    title: "Accessibility ROI Calculator",
    shortTitle: "ROI Calculator",
    description: "Estimate the financial case for accessibility work using remediation, risk, reach, and revenue assumptions.",
    category: "Business planning",
    icon: "trending",
    features: ["Editable assumptions", "Scenario comparison", "Shareable report"],
    keywords: ["roi", "business case", "budget", "risk", "revenue"],
    credits: 0,
  },
  {
    slug: "base64-converter",
    title: "Base64 Encoder and Decoder",
    shortTitle: "Base64 Converter",
    description: "Encode Unicode text or files as Base64 and decode Base64 content locally in the browser.",
    category: "Developer utilities",
    icon: "binary",
    features: ["Unicode-safe text", "File support", "Local processing"],
    keywords: ["base64", "encode", "decode", "file", "developer"],
    credits: 0,
  },
  {
    slug: "url-encoder-decoder",
    title: "URL Encoder and Decoder",
    shortTitle: "URL Converter",
    description: "Percent-encode or decode URL components, query values, paths, and international text.",
    category: "Developer utilities",
    icon: "link",
    features: ["Component encoding", "Decode validation", "Examples"],
    keywords: ["url", "percent encode", "decode", "query", "uri"],
    credits: 0,
  },
  {
    slug: "json-formatter",
    title: "JSON Formatter and Validator",
    shortTitle: "JSON Formatter",
    description: "Format, validate, minify, query, compare, and inspect JSON without sending data to a server.",
    category: "Developer utilities",
    icon: "braces",
    features: ["Validation", "Formatting", "Diff and query"],
    keywords: ["json", "format", "validate", "minify", "diff"],
    credits: 0,
    popular: true,
  },
  {
    slug: "password-generator",
    title: "Secure Password Generator",
    shortTitle: "Password Generator",
    description: "Generate cryptographically random passwords locally with configurable length and character rules.",
    category: "Developer utilities",
    icon: "lock",
    features: ["Secure random values", "Rule controls", "Bulk generation"],
    keywords: ["password", "security", "random", "generator", "local"],
    credits: 0,
  },
]

export const getToolBySlug = (slug: string) => toolCatalog.find((tool) => tool.slug === slug)

export const getToolHref = (tool: ToolCatalogItem) => `/tools/${tool.slug}`

