import JsonFormatter from "@/components/tools/json-formatter"
import { ToolStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata = {
  title: "JSON Formatter & Validator | Beautify & Minify",
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
  // Utility tool unrelated to the site's accessibility focus — kept live but
  // deindexed to preserve topical authority.
  robots: { index: false, follow: true },
  alternates: {
    canonical: "/tools/json-formatter"
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
      />
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="container-wide py-10 sm:py-12">
          <header className="mb-8 max-w-3xl">
            <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">Developer utility</p>
            <h1 className="mt-2 text-4xl font-semibold text-slate-950 dark:text-white">
              JSON Formatter & Validator
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
              Format, validate, compare, search, merge, inspect, and export JSON in a multi-file workspace.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
          </header>

          <JsonFormatter />

          {/* SEO Content */}
          <div className="max-w-4xl mx-auto mt-16 prose prose-gray dark:prose-invert">
            <h2>Why Use Our JSON Formatter?</h2>
            <p>
              Our JSON formatter goes beyond basic formatting to provide a complete JSON development experience.
              Whether you're debugging API responses, preparing data for storage, or validating JSON structures,
              the workspace keeps validation, comparison, search, and export in one place.
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
