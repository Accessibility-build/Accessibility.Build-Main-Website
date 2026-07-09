import type { Metadata } from "next"
import Link from "next/link"
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 3.1.1 Language of Page — The HTML lang Attribute",
  description:
    "Complete guide to WCAG 3.1.1 Language of Page. Learn why the html lang attribute matters for screen reader pronunciation, which BCP 47 language codes to use, copy-ready HTML examples, common mistakes like lang=\"EN\" or a missing attribute, and exactly how to test it.",
  keywords: [
    "WCAG 3.1.1",
    "Language of Page",
    "html lang attribute",
    "lang attribute accessibility",
    "BCP 47 language tags",
    "default language of page",
    "screen reader pronunciation",
    "3.1.1 test",
    "missing lang attribute",
    "language code accessibility",
    "Level A",
    "WCAG 2.2",
    "readable",
  ],
  alternates: {
    canonical: "https://accessibility.build/wcag/3-1-1",
  },
  openGraph: {
    title:
      "WCAG 3.1.1 Language of Page — Set the HTML lang Attribute Correctly (Level A)",
    description:
      "The definitive guide to WCAG 3.1.1: why the html lang attribute controls screen reader pronunciation, which BCP 47 codes to use, HTML examples, common mistakes, and how to test for 3.1.1 Level A.",
    url: "https://accessibility.build/wcag/3-1-1",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "https://accessibility.build/og-image.png",
        width: 1200,
        height: 630,
        alt: "WCAG 3.1.1 Language of Page guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 3.1.1 Language of Page — The Complete Guide",
    description:
      "The default human language of a page must be programmatically set. Why the lang attribute matters, which codes to use, examples, mistakes, and how to test 3.1.1 Level A.",
  },
}

const faqs = [
  {
    q: "What does WCAG 3.1.1 Language of Page require?",
    a: "It requires that the default human language of each web page can be programmatically determined. In practice this means setting a valid lang attribute on the <html> element, for example <html lang=\"en\"> for English or <html lang=\"fr\"> for French. The value must be a valid language tag from BCP 47 (the IETF standard that RFC 5646 defines). It is a Level A success criterion — the highest-priority conformance level — introduced in WCAG 2.0 and unchanged in WCAG 2.1 and 2.2.",
  },
  {
    q: "Why does the lang attribute matter for accessibility?",
    a: "Screen readers use the page language to load the correct pronunciation rules and voice. Without it, an English screen reader might read French text with English phonetics — rendering it unintelligible. The lang value also lets braille displays choose the right contraction tables, helps browsers offer accurate translation, selects the correct hyphenation and quotation-mark rules, and enables user agents to pick appropriate fonts for the script. A single correct attribute fixes all of these at once.",
  },
  {
    q: "What is the difference between 3.1.1 Language of Page and 3.1.2 Language of Parts?",
    a: "3.1.1 (Level A) is about the one default language for the whole page, declared on the <html> element. 3.1.2 Language of Parts (Level AA) covers passages or phrases inside the page that are in a different language from that default — a French quotation inside an English article, for example, which you mark with a lang attribute on the element wrapping just that phrase. Think of 3.1.1 as the page-wide default and 3.1.2 as the per-passage exceptions to it.",
  },
  {
    q: "Is lang=\"en\" enough, or do I need a region like en-US?",
    a: "A primary language subtag such as lang=\"en\" is sufficient to pass 3.1.1 — you do not need a region. Adding a region (lang=\"en-US\", lang=\"en-GB\", lang=\"pt-BR\") is valid and can help assistive technology pick a regional voice or the right braille table, but it is optional. Do not invent region codes: use only registered BCP 47 subtags. When in doubt, the bare two-letter primary code is safe and conformant.",
  },
  {
    q: "Does the lang attribute value have to match the visible content language?",
    a: "Yes. Declaring lang=\"en\" on a page that is actually written in Spanish still fails 3.1.1 in spirit and, more importantly, breaks pronunciation — the screen reader will apply English rules to Spanish text. The attribute must reflect the language a user actually reads on the page. A very common real-world bug is a template hard-coded to lang=\"en\" that is reused for translated pages without updating the value.",
  },
  {
    q: "How do automated accessibility tools test 3.1.1?",
    a: "Automated checkers like axe, Lighthouse, and WAVE can reliably detect two of the three failure modes: a missing lang attribute, and a lang value that is not a well-formed BCP 47 tag (for example lang=\"english\" or an empty lang=\"\"). What they cannot judge is whether a valid code matches the actual content language — a page of German text with lang=\"en\" passes the automated check but fails the criterion. That final match is a manual verification step.",
  },
]

export default function WCAG311Page() {
  return (
    <>
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          {
            name: "3.1.1 Language of Page",
            url: "https://accessibility.build/wcag/3-1-1",
          },
        ]}
      />

      <ArticleStructuredData
        headline="WCAG 3.1.1 Language of Page: The Complete Guide to the HTML lang Attribute"
        description="The definitive guide to WCAG 3.1.1 Language of Page: why the html lang attribute controls screen reader pronunciation, which BCP 47 codes to use, HTML examples, common mistakes, and testing methods."
        author={{
          name: "Accessibility.build Team",
          url: "https://accessibility.build/about",
        }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-07-09"
        dateModified="2026-07-09"
        image="https://accessibility.build/og-image.png"
        url="https://accessibility.build/wcag/3-1-1"
        wordCount={2900}
        keywords={[
          "WCAG 3.1.1",
          "Language of Page",
          "html lang attribute",
          "BCP 47 language tags",
          "screen reader pronunciation",
          "default language of page",
          "Level A",
        ]}
      />

      {/* FAQ structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link
                    href="/"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">
                  /
                </li>
                <li>
                  <Link
                    href="/wcag"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    WCAG Success Criteria
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">
                  /
                </li>
                <li>
                  <span className="text-slate-900 dark:text-white font-medium">
                    3.1.1 Language of Page
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                Level A
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 3: Understandable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                One-line fix, huge impact
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 3.1.1: Language of Page
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              A screen reader cannot pronounce words correctly unless it knows
              what language they are in. This criterion asks one simple thing:{" "}
              <strong className="text-slate-900 dark:text-white">
                declare the default language of the page in code
              </strong>
              . It is usually a single attribute —{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-base">
                &lt;html lang=&quot;en&quot;&gt;
              </code>{" "}
              — yet it is one of the most commonly missed Level A requirements on
              the web.
            </p>
          </header>

          {/* Official text callout */}
          <section
            aria-labelledby="official-text"
            className="mb-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-6"
          >
            <h2
              id="official-text"
              className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3"
            >
              The success criterion, in full
            </h2>
            <blockquote className="text-slate-700 dark:text-slate-300 leading-relaxed border-l-4 border-emerald-500 pl-4">
              The default human language of each Web page can be programmatically
              determined.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              &ldquo;Programmatically determined&rdquo; means available to
              assistive technology in code, not just visible to a sighted reader.
              For HTML, that is the <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">lang</code>{" "}
              attribute on the root <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">&lt;html&gt;</code>{" "}
              element. &ldquo;Human language&rdquo; means a spoken/written language
              like English or Japanese — not a programming language.
            </p>
          </section>

          {/* On this page */}
          <nav
            aria-label="On this page"
            className="mb-12 rounded-xl border border-slate-200 dark:border-slate-800 p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
              On this page
            </h2>
            <ul className="grid sm:grid-cols-2 gap-2 text-blue-600 dark:text-blue-400">
              <li>
                <a className="hover:underline" href="#why">
                  Why the page language matters
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#codes">
                  Choosing the right language code
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#code">
                  Code examples
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#frameworks">
                  Frameworks &amp; CMS
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#mistakes">
                  Common mistakes
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#testing">
                  How to test
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#related-criteria">
                  Related success criteria
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#faq">
                  FAQ
                </a>
              </li>
            </ul>
          </nav>

          {/* Why */}
          <section aria-labelledby="why" className="mb-12">
            <h2
              id="why"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Why the page language matters
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              When a screen reader opens a page, one of the first things it looks
              for is the language. That value tells it which pronunciation engine
              and voice to load. Give it{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                lang=&quot;fr&quot;
              </code>{" "}
              and it reads &ldquo;bonjour&rdquo; the way a French speaker would;
              leave the attribute off and an English-configured screen reader may
              read the same word with English phonetics — &ldquo;bon-jower&rdquo;
              — which a listener cannot understand.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              This one attribute drives far more than a screen reader voice.
              Setting it correctly enables all of the following at once:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {[
                {
                  t: "Screen reader pronunciation",
                  d: "Loads the correct phonetic rules and voice so text is read intelligibly instead of mangled.",
                },
                {
                  t: "Braille contraction tables",
                  d: "Refreshable braille displays pick the correct contraction rules, which differ by language.",
                },
                {
                  t: "Accurate machine translation",
                  d: "Browser translate features and tools detect the source language reliably instead of guessing.",
                },
                {
                  t: "Hyphenation & typography",
                  d: "Correct hyphenation, quotation marks, and script-appropriate fonts are selected by the browser.",
                },
              ].map((item) => (
                <div
                  key={item.t}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-5"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                    {item.t}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {item.d}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              The cost-to-benefit ratio here is extraordinary. Almost no other
              WCAG criterion is fixed by a single attribute that improves the
              experience for screen reader users, braille users, translation
              tools, and search engines all at the same time. It is the first
              thing to check on any audit.
            </p>
          </section>

          {/* Choosing codes */}
          <section aria-labelledby="codes" className="mb-12">
            <h2
              id="codes"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Choosing the right language code
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              The value of the <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">lang</code>{" "}
              attribute must be a valid language tag from{" "}
              <strong className="text-slate-900 dark:text-white">BCP 47</strong>{" "}
              (defined by RFC 5646). In everyday use that means a two- or
              three-letter primary language subtag, optionally followed by a
              region or script subtag. You do not need to memorise the registry —
              a handful of patterns cover almost every page.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-left border-collapse">
                <caption className="sr-only">
                  Common BCP 47 language tags and when to use them
                </caption>
                <thead>
                  <tr className="border-b-2 border-slate-300 dark:border-slate-700">
                    <th scope="col" className="py-2 pr-4 font-semibold text-slate-900 dark:text-white">
                      Tag
                    </th>
                    <th scope="col" className="py-2 pr-4 font-semibold text-slate-900 dark:text-white">
                      Language
                    </th>
                    <th scope="col" className="py-2 font-semibold text-slate-900 dark:text-white">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 dark:text-slate-300">
                  {[
                    ["en", "English", "Primary subtag alone is valid and sufficient."],
                    ["en-US", "English (United States)", "Region subtag is optional; helps pick a regional voice."],
                    ["en-GB", "English (United Kingdom)", "Use only if the page truly targets that region."],
                    ["es", "Spanish", "Bare primary subtag is fine for most Spanish content."],
                    ["fr", "French", "Applies French pronunciation across the page."],
                    ["pt-BR", "Portuguese (Brazil)", "Distinguishes Brazilian from European Portuguese."],
                    ["zh-Hans", "Chinese (Simplified script)", "Script subtag matters for Chinese."],
                    ["ar", "Arabic", "Pair with dir=\"rtl\" for right-to-left layout."],
                  ].map((row) => (
                    <tr
                      key={row[0]}
                      className="border-b border-slate-200 dark:border-slate-800"
                    >
                      <td className="py-2 pr-4">
                        <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                          {row[0]}
                        </code>
                      </td>
                      <td className="py-2 pr-4">{row[1]}</td>
                      <td className="py-2 text-sm">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Two rules keep you safe: use{" "}
              <strong className="text-slate-900 dark:text-white">lowercase</strong>{" "}
              for the primary language subtag, and{" "}
              <strong className="text-slate-900 dark:text-white">
                never invent codes
              </strong>
              . <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">lang=&quot;english&quot;</code>,{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">lang=&quot;us&quot;</code>, and{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">lang=&quot;gb&quot;</code>{" "}
              are all invalid. When unsure, the bare two-letter primary subtag —{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">en</code>,{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">es</code>,{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">de</code>{" "}
              — is always conformant.
            </p>
          </section>

          {/* Code examples */}
          <section aria-labelledby="code" className="mb-12">
            <h2
              id="code"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Code examples
            </h2>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              The basic, correct pattern
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Put the <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">lang</code>{" "}
              attribute on the root <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">&lt;html&gt;</code>{" "}
              element. That single declaration covers the whole document.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ No language declared — screen reader guesses -->
<html>
  <head> ... </head>
  <body> ... </body>
</html>

<!-- ✓ Default language set on the root element -->
<html lang="en">
  <head> ... </head>
  <body> ... </body>
</html>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Match the code to the real content
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              A valid tag that describes the wrong language is still a failure.
              The most common version of this bug is a template hard-coded to{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">en</code>{" "}
              and reused for translated pages.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Page content is German, but lang says English -->
<html lang="en">
  <body>
    <h1>Willkommen auf unserer Website</h1>
  </body>
</html>

<!-- ✓ lang matches the language the user actually reads -->
<html lang="de">
  <body>
    <h1>Willkommen auf unserer Website</h1>
  </body>
</html>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Right-to-left languages
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              For scripts that read right to left (Arabic, Hebrew, Persian), pair{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">lang</code>{" "}
              with the <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">dir</code>{" "}
              attribute so the layout direction is correct too.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✓ Language and direction both declared -->
<html lang="ar" dir="rtl">
  <body> ... </body>
</html>`}</code>
            </pre>
          </section>

          {/* Frameworks & CMS */}
          <section aria-labelledby="frameworks" className="mb-12">
            <h2
              id="frameworks"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Setting it in frameworks and CMS platforms
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              The <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">&lt;html&gt;</code>{" "}
              tag is usually generated by a framework or template, so the fix
              often lives in one shared file rather than every page. A few common
              patterns:
            </p>
            <pre className="mb-4 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`// Next.js — app/layout.tsx (App Router)
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

// React (Vite/CRA) — set it in public/index.html
// <html lang="en"> ... </html>

// Angular — src/index.html
// <html lang="en"> ... </html>

// WordPress — theme header.php uses language_attributes()
// <html <?php language_attributes(); ?>>
// (fills lang from the Site Language setting in wp-admin)`}</code>
            </pre>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              For multilingual sites, set the value{" "}
              <strong className="text-slate-900 dark:text-white">dynamically</strong>{" "}
              from the active locale — for example{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                &lt;html lang={"{"}locale{"}"}&gt;
              </code>{" "}
              in Next.js internationalized routing — so a page served in French
              actually declares <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">lang=&quot;fr&quot;</code>{" "}
              rather than inheriting a hard-coded default.
            </p>
          </section>

          {/* Common mistakes */}
          <section aria-labelledby="mistakes" className="mb-12">
            <h2
              id="mistakes"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Common mistakes
            </h2>
            <ul className="space-y-3">
              {[
                "No lang attribute at all — the single most common failure, leaving the screen reader to guess from its own default settings.",
                "An invalid value such as lang=\"english\", lang=\"us\", or lang=\"en_US\" (BCP 47 uses a hyphen, not an underscore).",
                "An empty attribute, lang=\"\", which is treated as no valid language and fails the same way a missing one does.",
                "A hard-coded lang=\"en\" reused on translated pages, so German or Spanish content is announced with English pronunciation.",
                "Putting lang only on the <body> or a wrapper <div> instead of the root <html> element, where user agents expect the page default.",
                "Confusing lang with the hreflang link attribute or an Open Graph locale — those are SEO/link hints and do not satisfy 3.1.1.",
                "Setting a region-only code like lang=\"US\" with no primary language subtag, which is not a valid standalone tag.",
                "Assuming a <meta http-equiv=\"content-language\"> tag counts — it does not satisfy 3.1.1; the lang attribute on <html> is required.",
              ].map((m) => (
                <li
                  key={m}
                  className="flex gap-3 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-4"
                >
                  <span aria-hidden="true" className="text-rose-500 font-bold">
                    ✗
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {m}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Testing */}
          <section aria-labelledby="testing" className="mb-12">
            <h2
              id="testing"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              How to test for 3.1.1
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Inspect the <html> element",
                  d: "Open DevTools, look at the root <html> tag, and confirm a lang attribute is present with a value. This is the fastest manual check and catches the most common failure — a completely missing attribute.",
                },
                {
                  t: "Validate the code against BCP 47",
                  d: "Confirm the value is a real language tag: lowercase primary subtag, hyphens (not underscores) between subtags, and no invented codes like 'english'. Run axe DevTools, Lighthouse, or WAVE — they flag both missing and malformed lang values automatically.",
                },
                {
                  t: "Confirm the code matches the content",
                  d: "This is the manual step tools cannot do. Read the page and verify the declared language is the language you actually see. A German page with lang=\"en\" passes automated checks but fails the criterion.",
                },
                {
                  t: "Listen with a screen reader",
                  d: "Open the page in VoiceOver, NVDA, or JAWS and listen to the first few sentences. If the pronunciation sounds wrong for the visible language, the lang value is missing or incorrect. This is the most direct real-world confirmation.",
                },
                {
                  t: "Check every template and locale",
                  d: "On multilingual sites, test one page per language, not just the English home page. Translated pages served from a shared template are where hard-coded lang values most often slip through.",
                },
              ].map((step, i) => (
                <li
                  key={step.t}
                  className="flex gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-5"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      {step.t}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {step.d}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-5">
              Because a missing or malformed <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">lang</code>{" "}
              attribute is machine-detectable, it belongs in every automated
              scan. Pair that with a quick manual language-match check, then work
              through the full{" "}
              <Link
                href="/checklists/wcag-2-2"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                WCAG 2.2 checklist
              </Link>
              .
            </p>
          </section>

          {/* Related criteria */}
          <div id="related-criteria">
            <CriterionLinks number="3.1.1" />
          </div>

          {/* FAQ */}
          <section aria-labelledby="faq" className="mb-4">
            <h2
              id="faq"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-6"
            >
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-xl border border-slate-200 dark:border-slate-800 p-5 [&_summary]:cursor-pointer"
                >
                  <summary className="font-semibold text-slate-900 dark:text-white list-none flex items-center justify-between gap-4">
                    {f.q}
                    <span
                      aria-hidden="true"
                      className="text-slate-400 group-open:rotate-180 transition-transform"
                    >
                      ▾
                    </span>
                  </summary>
                  <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </article>

        {/* Related content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="language of page html lang attribute default language BCP 47 language tags screen reader pronunciation braille contraction language of parts info and relationships page titled name role value readable understandable WCAG 3.1.1 Level A"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
