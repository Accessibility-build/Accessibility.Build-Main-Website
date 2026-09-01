import type { Metadata } from "next"
import Link from "next/link"
import ToolsClientPage from "./ToolsClientPage"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { toolCatalog } from "@/lib/tool-catalog"

// The four generic developer utilities (JSON, Base64, URL, password) are
// noindexed and off-topic for an accessibility hub, so they are neither listed
// nor counted here. They stay reachable from the in-tool suite bar.
const accessibilityTools = toolCatalog.filter((tool) => tool.category !== "Developer utilities")

export const metadata: Metadata = {
  title: "Accessibility Tools | WCAG 2.2 Testing and Guidance",
  description: "Practical accessibility testing, content, design, planning, and developer tools for building more inclusive digital products.",
  keywords: [
    "accessibility tools",
    "wcag tools",
    "accessibility testing",
    "color contrast checker",
    "alt text generator",
    "accessibility audit",
    "wcag compliance",
    "digital accessibility",
    "web accessibility tools"
  ],
  openGraph: {
    title: "Accessibility Tools | WCAG 2.2 Testing and Guidance",
    description: "Practical accessibility testing, content, design, planning, and developer tools for building more inclusive digital products.",
    type: "website",
    url: "https://accessibility.build/tools",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Accessibility.build Tools Suite"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Accessibility Tools | WCAG 2.2 Testing and Guidance",
    description: "Practical accessibility testing, content, design, planning, and developer tools for building more inclusive digital products.",
    images: ["/og-image.png"]
  },
  alternates: {
    canonical: "/tools"
  }
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" }
]

export default function ToolsPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Accessibility Tools Suite",
    "description": "Practical accessibility testing, content, design, planning, and developer tools for building more inclusive digital products.",
    "url": "https://accessibility.build/tools",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": accessibilityTools.length,
      "itemListElement": accessibilityTools.map((tool, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://accessibility.build/tools/${tool.slug}`,
        "name": tool.title
      }))
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema)
        }}
      />
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <ToolsClientPage />

      {/* Server-rendered supporting content. The hub ranks on page 5 for the
          head terms ("accessibility tools", "wcag checker") that WebAIM and
          Deque own, but already reaches positions 3-4 for qualified queries
          like "best accessibility tools for developers". This section speaks to
          those, and gives the directory real prose instead of card labels. */}
      <section className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="container-wide py-14">
          <div className="max-w-3xl space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-950 dark:text-white mb-4">
                Which accessibility tool do you actually need?
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Most accessibility work splits into four jobs, and the tool you
                want depends on which one you are doing. Automated checkers are
                excellent at the mechanical layer and cannot judge meaning, so
                treat any clean report as a starting point rather than proof of
                conformance. The{" "}
                <Link href="/guides/automated-vs-manual-accessibility-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                  automated versus manual testing guide
                </Link>{" "}
                explains where that line falls.
              </p>
              <dl className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                <div>
                  <dt className="font-semibold text-slate-950 dark:text-white">
                    Developers shipping a fix
                  </dt>
                  <dd className="mt-1">
                    Start with the{" "}
                    <Link href="/tools/url-accessibility-auditor" className="text-blue-600 dark:text-blue-400 hover:underline">
                      URL accessibility auditor
                    </Link>{" "}
                    for a page-level scan, the{" "}
                    <Link href="/tools/contrast-checker" className="text-blue-600 dark:text-blue-400 hover:underline">
                      contrast checker
                    </Link>{" "}
                    for WCAG 2.2 and APCA ratios, and the{" "}
                    <Link href="/tools/heading-analyzer" className="text-blue-600 dark:text-blue-400 hover:underline">
                      heading analyzer
                    </Link>{" "}
                    to catch a broken document outline.
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-950 dark:text-white">
                    Designers building a system
                  </dt>
                  <dd className="mt-1">
                    The{" "}
                    <Link href="/tools/color-palette-generator" className="text-blue-600 dark:text-blue-400 hover:underline">
                      accessible colour palette generator
                    </Link>{" "}
                    produces WCAG-aware palettes and previews them in real UI
                    states, so contrast is settled before handoff rather than
                    caught in review.
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-950 dark:text-white">
                    QA and audit teams
                  </dt>
                  <dd className="mt-1">
                    Track findings against every criterion with the{" "}
                    <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                      interactive WCAG 2.2 checklist
                    </Link>
                    , then turn them into a shareable document with the{" "}
                    <Link href="/tools/accessibility-report-generator" className="text-blue-600 dark:text-blue-400 hover:underline">
                      accessibility report generator
                    </Link>
                    .
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-950 dark:text-white">
                    Compliance and procurement
                  </dt>
                  <dd className="mt-1">
                    Publish where you stand with the{" "}
                    <Link href="/tools/accessibility-statement-generator" className="text-blue-600 dark:text-blue-400 hover:underline">
                      accessibility statement generator
                    </Link>
                    , and check a vendor&rsquo;s claims against the{" "}
                    <Link href="/tools/overlay-detector" className="text-blue-600 dark:text-blue-400 hover:underline">
                      overlay detector
                    </Link>{" "}
                    if they rely on an accessibility widget.
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-950 dark:text-white mb-4">
                What these tools cannot tell you
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                No scanner can tell you whether alt text describes the right
                thing, whether focus order preserves meaning, whether an error
                message helps someone recover, or whether a custom widget works
                with a screen reader. Those need a keyboard, a screen reader, and
                a person. Use these tools to clear the mechanical failures fast,
                then spend the time you saved on the{" "}
                <Link href="/guides/screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                  screen reader testing
                </Link>{" "}
                and{" "}
                <Link href="/guides/keyboard-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  keyboard accessibility
                </Link>{" "}
                passes that actually decide whether the product is usable.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
