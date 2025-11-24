import JsonFormatter from "@/components/tools/json-formatter"
import { ToolStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata = {
  title: "JSON Formatter & Validator | Beautify, Minify & Validate JSON Online | Free Tool",
  description: "Professional JSON formatter, validator, and beautifier. Format, minify, validate JSON data with syntax highlighting, error detection, and tree view. Free online tool for developers.",
  keywords: [
    "json formatter",
    "json validator",
    "json beautifier",
    "json minifier",
    "format json online",
    "validate json",
    "json syntax checker",
    "json tree view",
    "json lint",
    "pretty print json"
  ],
  openGraph: {
    title: "JSON Formatter & Validator - Free Online Tool",
    description: "Format, validate, and beautify JSON data with syntax highlighting and error detection. Professional tool for developers with tree view and minification.",
    type: "website",
    url: "https://accessibility.build/tools/json-formatter",
    images: [
      {
        url: "https://accessibility.build/images/tools/json-formatter-og.png",
        width: 1200,
        height: 630,
        alt: "JSON Formatter and Validator Tool"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Formatter & Validator - Free Developer Tool",
    description: "Format, validate & beautify JSON online. Syntax highlighting, error detection & tree view.",
    images: ["https://accessibility.build/images/tools/json-formatter-og.png"]
  },
  alternates: {
    canonical: "https://accessibility.build/tools/json-formatter"
  }
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" },
  { name: "JSON Formatter", url: "https://accessibility.build/tools/json-formatter" }
]

export default function JsonFormatterPage() {
  return (
    <>
      <ToolStructuredData
        name="JSON Formatter & Validator"
        description="Professional JSON formatter, validator, and beautifier. Format, minify, validate JSON data with syntax highlighting."
        url="https://accessibility.build/tools/json-formatter"
        applicationCategory="DeveloperApplication"
        operatingSystem="Any"
        offers={{
          price: "0",
          priceCurrency: "USD"
        }}
        aggregateRating={{
          ratingValue: "4.9",
          reviewCount: "1250"
        }}
      />
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-50/30">
        <div className="container-wide py-16">
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              JSON Formatter & Validator
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Professional JSON formatter with syntax highlighting, validation, minification, and tree view.
              Perfect for developers working with APIs and data structures.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Syntax Highlighting</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Error Detection</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Tree View</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Free Tool</span>
              </div>
            </div>
          </div>

          <JsonFormatter />

          {/* SEO Content */}
          <div className="max-w-4xl mx-auto mt-16 prose prose-gray dark:prose-invert">
            <h2>Why Use Our JSON Formatter?</h2>
            <p>
              Our JSON formatter goes beyond basic formatting to provide a complete JSON development experience.
              Whether you're debugging API responses, preparing data for storage, or validating JSON structures,
              our tool offers enterprise-grade features for free.
            </p>

            <h3>Key Features</h3>
            <ul>
              <li><strong>Instant Validation:</strong> Real-time JSON syntax validation with detailed error messages</li>
              <li><strong>Multiple Views:</strong> Raw text, formatted view, and interactive tree explorer</li>
              <li><strong>Syntax Highlighting:</strong> Color-coded JSON for better readability</li>
              <li><strong>Minification:</strong> Compress JSON for production use</li>
              <li><strong>Error Detection:</strong> Precise error location and description</li>
              <li><strong>Export Options:</strong> Download formatted or minified JSON</li>
            </ul>

            <h3>Perfect for Developers</h3>
            <p>
              API development, configuration files, data migration, debugging - our JSON formatter handles it all.
              With support for large files and complex nested structures, it's the tool professional developers rely on.
            </p>
          </div>

          <div className="mt-16">
            <RelatedContent
              content="json formatter validator developer tools api debugging"
              title="Related Tools & Resources"
              maxItems={3}
              showDescriptions={true}
            />
          </div>
        </div>
      </div>
    </>
  )
} 