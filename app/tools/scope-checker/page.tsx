import type { Metadata } from "next"
import Link from "next/link"
import ScopeChecker from "@/components/tools/scope-checker"
import { BreadcrumbStructuredData, ToolStructuredData } from "@/components/seo/structured-data"
import { FaqSection, type FaqItem } from "@/components/seo/faq-section"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "Scope Checker for Accessibility | URL Crawler",
  description:
    "Crawl a site for up to two minutes to inventory internal pages, PDF and Office documents, page titles, and external links before scoping an audit.",
  keywords: [
    "scope checker for accessibility",
    "scope checker",
    "website url crawler",
    "document url finder",
    "website page titles",
    "sitemap and crawler tool",
    "internal link discovery",
    "technical seo crawler",
    "accessibility site inventory",
  ],
  openGraph: {
    title: "Scope Checker for Accessibility | URL + Document Discovery",
    description:
      "Find scoped URLs, documents, and external extras with our scope checker for accessibility, including accurate page title extraction.",
    type: "website",
    url: "https://accessibility.build/tools/scope-checker",
    images: [
      {
        url: "https://accessibility.build/og-image.png",
        width: 1200,
        height: 630,
        alt: "Scope Checker for Accessibility",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Scope Checker for Accessibility | URL + Document Discovery",
    description:
      "Scope checker for accessibility with chunked crawl output, document discovery, and page title capture in 2 minutes.",
    images: ["https://accessibility.build/og-image.png"],
  },
  alternates: {
    canonical: "/tools/scope-checker",
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" },
  { name: "Scope Checker", url: "https://accessibility.build/tools/scope-checker" },
]

// Rendered on the page AND emitted as FAQPage schema by <FaqSection>, from this
// one array, so the two can never drift apart.
const faqs: FaqItem[] = [
  {
    question: "Why did the crawl stop before finding every page?",
    answer:
      "Three limits can end a run: the page cap you set (10 to 1,000), the depth cap (1 to 6 link hops from the start URL), and the two-minute time budget, which is enforced on the server and shown as a Timed out badge in the results. Each page fetch also has a 12-second timeout and only the first 1.5 MB of HTML is read. Slow servers, deep site structures, and very large sites will hit one of these. Raise the page cap, add the sitemap URL as your start point, or run the tool once per section of a large site.",
  },
  {
    question: "Does the scope checker execute JavaScript?",
    answer:
      "No. It fetches the raw HTML of each page and extracts anchor href attributes with a parser, without running scripts. Links that are injected by client-side JavaScript, loaded through infinite scroll, or hidden behind a menu that only renders on interaction will not be found unless they also appear in a sitemap. If your site is a single-page application, the sitemap is usually the more complete source.",
  },
  {
    question: "What counts as a document?",
    answer:
      "A URL is filed as a document when its file extension is one of pdf, doc, docx, xls, xlsx, ppt, pptx, csv, txt, rtf, odt, ods, odp, epub, zip, rar, 7z, gz, tar, xml, or json, or when the server answers with a document content type such as application/pdf. Documents are listed but not opened or tested; use the PDF Accessibility Checker for the PDFs it finds.",
  },
  {
    question: "Why do URLs with query strings or fragments disappear?",
    answer:
      "Every URL is canonicalised before it is queued: the fragment, query string, credentials, default port, and trailing slash are removed and the host is lowercased. That keeps the inventory to one entry per page instead of one per filter combination, but it means a page whose content genuinely depends on a query parameter appears once, under its bare path. Add those variants to your audit sample by hand.",
  },
  {
    question: "Does it respect robots.txt, and does it crawl behind a login?",
    answer:
      "It reads robots.txt only to discover Sitemap declarations; it does not act on Disallow rules, so only point it at sites you are authorised to crawl. It sends no cookies or credentials, so anything behind authentication returns the login page or an error and is recorded under Issues. Local, private, and loopback hosts are refused.",
  },
  {
    question: "Is the scope checker free?",
    answer:
      "Yes. It needs no account and uses no credits. The two-minute cap per run is the only limit.",
  },
]

export default function ScopeCheckerPage() {
  return (
    <>
      <ToolStructuredData
        name="Scope Checker for Accessibility"
        description="Scope checker for accessibility that crawls internal URLs, document links, extra links, and page titles."
        url="https://accessibility.build/tools/scope-checker"
        applicationCategory="DeveloperApplication"
        operatingSystem="Web Browser"
        offers={{
          price: "0",
          priceCurrency: "USD",
        }}
      />
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="container-wide py-10 sm:py-12">
          <header className="mb-8 max-w-3xl">
            <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">Audit inventory</p>
            <h1 className="mt-2 text-4xl font-semibold text-slate-950 dark:text-white">Website scope checker</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
              Discover internal pages, documents, and external references before estimating an accessibility audit.
            </p>
          </header>
          <ScopeChecker />

          {/* Supporting guidance */}
          <div className="mt-16 max-w-3xl mx-auto space-y-10">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                What the Scope Checker Does
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Before you can audit a website you need to know what is in it.
                The scope checker builds that inventory. Give it a start URL and
                it looks for sitemaps, follows internal links breadth-first, and
                returns every page it reached with the page&apos;s title, HTTP
                status, and the depth at which it was found. Along the way it
                separates out downloadable documents and links that leave the
                site, so you can see the PDFs and the third-party services an
                audit would have to account for.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Each run has a hard two-minute budget on the server. Within that
                window the crawler fetches up to the page cap you set, reads at
                most 600 links from any one page, and stops following links once
                the depth cap is reached. The result is a bounded, repeatable
                snapshot rather than an exhaustive crawl, which is normally what
                a scoping conversation needs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                How to Use It
              </h2>
              <ol className="text-muted-foreground leading-relaxed list-decimal pl-6 space-y-2">
                <li>
                  <strong className="text-slate-900 dark:text-white">Enter the site&apos;s public URL.</strong>{" "}
                  A bare domain is fine; https is assumed when you leave the
                  scheme off. Start from the homepage for a broad inventory, or
                  from a section landing page to scope one part of a large site.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Set the limits.</strong>{" "}
                  Max Pages (default 200) caps how many HTML pages are recorded.
                  Max Depth (default 3) caps how many link hops from the start
                  URL the crawler will follow. Turn on Include Subdomains if
                  content lives on hosts like docs.example.com that should be in
                  scope.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Run the check and wait.</strong>{" "}
                  Most small sites finish in well under a minute. The run ends
                  when the queue is empty, the page cap is hit, or the two
                  minutes expire, whichever comes first.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Review the tabs and export.</strong>{" "}
                  Use Pages to check titles, Documents for PDFs and Office files,
                  Extras for external services, and Issues for anything that
                  could not be fetched. Export CSV gives you a spreadsheet to
                  annotate; Copy JSON gives you the full result for other tools.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                What It Collects, and What It Does Not
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Discovery uses two sources. First it reads robots.txt for
                Sitemap lines and fetches sitemap.xml and sitemap_index.xml,
                following nested sitemap indexes up to 25 files. Then it crawls:
                every HTML page fetched has its anchor links extracted, resolved
                to absolute URLs, and sorted into same-site pages (queued for
                crawling), same-site documents (recorded but not fetched), and
                external links (recorded with the page they were found on).
                Page titles come from the <code>&lt;title&gt;</code> element,
                falling back to an og:title or twitter:title meta tag, then the
                first <code>&lt;h1&gt;</code>, and finally the URL itself.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The tool does not test accessibility. It never opens the
                documents it lists, does not execute JavaScript, sends no
                cookies, and cannot see pages that require a login or that are
                only linked from script-rendered navigation. It also drops query
                strings and fragments when it deduplicates URLs, so a search
                results page with filters appears once. Treat the inventory as a
                starting list to be checked against your own knowledge of the
                site, not as proof that nothing else exists.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                Where It Fits in a WCAG Audit
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                WCAG-EM, the W3C&apos;s evaluation methodology, starts with two
                steps this tool supports directly: defining the scope of the
                evaluation and selecting a representative sample of pages. The
                page list, grouped into chunks of 50, is the raw material for
                that sample. Documents matter because WCAG applies to PDFs and
                Office files served from a site just as it does to HTML, and
                they are the part of an estimate most often forgotten.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The output also gives you an early signal on a few success
                criteria, though every one of them still needs a manual check:
              </p>
              <ul className="text-muted-foreground leading-relaxed list-disc pl-6 space-y-2">
                <li>
                  <Link href="/wcag/2-4-2" className="text-blue-600 dark:text-blue-400 hover:underline">2.4.2 Page Titled</Link>{" "}
                  (Level A): if a page&apos;s title in the results is its own
                  URL, the page has no <code>&lt;title&gt;</code>, no social
                  title, and no <code>&lt;h1&gt;</code>. Identical titles across
                  many pages are also worth flagging, because the criterion asks
                  for titles that describe the page.
                </li>
                <li>
                  <Link href="/wcag/3-2-3" className="text-blue-600 dark:text-blue-400 hover:underline">3.2.3 Consistent Navigation</Link>{" "}
                  and{" "}
                  <Link href="/wcag/3-2-4" className="text-blue-600 dark:text-blue-400 hover:underline">3.2.4 Consistent Identification</Link>{" "}
                  (Level AA) can only be judged across a set of pages, so your
                  sample needs pages from different templates and depths.
                </li>
                <li>
                  <Link href="/wcag/2-4-5" className="text-blue-600 dark:text-blue-400 hover:underline">2.4.5 Multiple Ways</Link>{" "}
                  (Level AA): whether a sitemap was found, and how much of the
                  crawl came from it versus from links, tells you something about
                  the routes users have to reach content.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                Reading the Output
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The four summary cards count discovered URLs (pages plus
                documents plus external links), pages, documents, and external
                extras. Below them, Scanned reports how many URLs were actually
                fetched, which can exceed the page count because redirects to
                other hosts, failed fetches, and document responses are scanned
                but not filed as pages. The Timed out badge tells you the two
                minutes ran out; if it appears, the inventory is a lower bound.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                In the Pages tab, Status is the HTTP status after redirects and
                Depth is the number of hops from the start URL, with sitemap
                entries assigned depth 1. The From line under documents and
                extras names the page where the link was found, which is the
                page to look at when a document needs replacing. The CSV export
                has five columns: type, url, title, detail, and discoveredFrom.
              </p>
            </section>

            <FaqSection faqs={faqs} />
          </div>

          <div className="mt-16">
            <RelatedContent
              content="website crawling sitemap internal links technical seo scope discovery accessibility auditing WCAG-EM sample PDF documents"
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
