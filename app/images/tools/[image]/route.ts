import { NextRequest, NextResponse } from "next/server"

const TOOL_TITLES: Record<string, string> = {
  "accessibility-audit-helper": "AI Accessibility Audit Helper",
  "accessibility-report-generator": "Accessibility Report Generator",
  "accessibility-statement-generator": "Accessibility Statement Generator",
  "ada-risk": "ADA Compliance Risk Assessment",
  "alt-text-generator": "AI Alt Text Generator",
  "audit-helper": "AI Accessibility Audit Helper",
  "base64-converter": "Base64 Converter",
  "code-generator": "AI Accessibility Code Generator",
  "color-palette": "Color Palette Generator",
  "contrast-checker": "Color Contrast Checker",
  "heading-analyzer": "Heading Structure Analyzer",
  "image-color-picker": "Image Color Picker",
  "json-formatter": "JSON Formatter",
  "mobile-checker": "Mobile Accessibility Checker",
  "overlay-detector": "Accessibility Overlay Detector",
  "palette-studio": "Accessible Palette Studio",
  "password-generator": "Password Generator",
  "pdf-checker": "PDF Accessibility Checker",
  "report-generator": "Accessibility Report Generator",
  "scope-checker": "Website Scope Checker",
  "statement-generator": "Accessibility Statement Generator",
  "typography-studio": "Accessible Typography Studio",
  "url-auditor": "URL Accessibility Auditor",
  "url-encoder": "URL Encoder and Decoder",
}

function normalizeImageName(image: string): string {
  return image
    .replace(/\.(png|jpg|jpeg|webp|avif)$/i, "")
    .replace(/-(og|twitter|screenshot|guide)$/i, "")
}

function titleCase(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => {
      if (word.toLowerCase() === "ai") return "AI"
      if (word.toLowerCase() === "wcag") return "WCAG"
      if (word.toLowerCase() === "pdf") return "PDF"
      if (word.toLowerCase() === "url") return "URL"
      if (word.toLowerCase() === "json") return "JSON"
      return `${word[0]?.toUpperCase() || ""}${word.slice(1)}`
    })
    .join(" ")
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ image: string }> }
): Promise<Response> {
  const { image } = await params
  const slug = normalizeImageName(image)
  const title = TOOL_TITLES[slug] || titleCase(slug)
  const redirectUrl = new URL("/api/og", request.url)

  redirectUrl.searchParams.set("title", title)
  redirectUrl.searchParams.set("section", "Tools")

  const response = NextResponse.redirect(redirectUrl, 307)
  response.headers.set("Cache-Control", "public, max-age=86400, s-maxage=604800")
  return response
}
