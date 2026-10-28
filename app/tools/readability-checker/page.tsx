import type { Metadata } from "next"
import Link from "next/link"
import ReadabilityChecker from "@/components/tools/readability-checker"
import { BreadcrumbStructuredData, HowToStructuredData, ToolStructuredData } from "@/components/seo/structured-data"
import { FaqSection } from "@/components/seo/faq-section"
import { RelatedContent } from "@/components/seo/related-content"
import { clampDescription } from "@/lib/metadata"
import { THRESHOLDS } from "@/lib/readability/analyse"
import { LOWER_SECONDARY_GRADE } from "@/lib/readability/formulas"

const ROUTE = "/tools/readability-checker"
const pageTitle = "Readability Checker: Reading Level and Plain Language Test"
const pageDescription =
  "Check the reading level of any text or web page with six readability formulas, including Flesch-Kincaid, Gunning Fog and SMOG. Long sentences, passive voice, wordy phrases and unexplained abbreviations are highlighted in place, with WCAG 3.1.5 guidance."

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "readability checker",
    "readability score",
    "reading level checker",
    "Flesch-Kincaid grade level checker",
    "Flesch reading ease calculator",
    "Gunning Fog index calculator",
    "SMOG readability formula",
    "plain language checker",
    "reading age checker",
    "WCAG 3.1.5 reading level",
    "passive voice checker",
    "website readability test",
  ],
  alternates: { canonical: ROUTE },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: ROUTE,
    type: "website",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Readability Checker")}&section=Free tool`,
        width: 1200,
        height: 630,
        alt: "Readability checker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: clampDescription(pageDescription),
    images: [`/api/og?title=${encodeURIComponent("Readability Checker")}&section=Free tool`],
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" },
  { name: "Readability Checker", url: `https://accessibility.build${ROUTE}` },
]

const FAQS = [
  {
    question: "What is a good readability score?",
    answer:
      "For a general audience, aim for an average grade of about 8 or 9 or lower and a Flesch Reading Ease of 60 or more, the range usually described as plain English. Text written for specialists can score higher, but every extra grade narrows who can read it comfortably. WCAG 3.1.5 uses lower secondary education, roughly grade 9, as the point where a simpler version or a summary is needed.",
  },
  {
    question: "Why do the formulas give different grades for the same text?",
    answer:
      "Each one measures something slightly different. Flesch-Kincaid uses syllables per word, Gunning Fog and SMOG count words of three or more syllables, and Coleman-Liau and the Automated Readability Index count letters instead of syllables. A text full of short but unusual words scores easier on all of them than it really is. That is why the tool shows all five grades and their average rather than picking one.",
  },
  {
    question: "Does WCAG require a particular reading level?",
    answer:
      "Only at Level AAA. Success criterion 3.1.5 Reading Level says that when text needs reading ability above lower secondary education, after removing proper names and titles, you provide supplemental content or a version that does not. Most laws and policies cite Level AA, so 3.1.5 is not usually a legal requirement, but plain language helps people with cognitive and learning disabilities most, and also anyone reading on a phone or in a second language.",
  },
  {
    question: "How is the reading age worked out?",
    answer:
      "From the average grade. US school grades start at about age six, so a reader in grade 8 is typically 13 or 14 years old. The tool adds five and six years to the rounded average grade and shows the range. Grade 13 and above is shown as 18 or over, university level. Like the grades themselves, it is an estimate from word and sentence length.",
  },
  {
    question: "Why can't the tool read my web page?",
    answer:
      "The web page mode fetches the page's HTML and reads the text in it. Many sites build their content with JavaScript after the page loads, so the HTML has little or no text, and this tool does not run the page's scripts. When it finds fewer than 50 words it says so. Copy the text from the page in your browser and paste it into the Paste text tab instead.",
  },
  {
    question: "Is my text stored or sent anywhere?",
    answer:
      "Pasted text never leaves your browser: the scores and findings are worked out on your device. When you check a web page, our server fetches that page for you and sends back its HTML, and we record the site's domain, the page path and whether the check worked, so we can see which sites people check. The text itself is not stored.",
  },
]

export default function ReadabilityCheckerPage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <ToolStructuredData
        name="Readability Checker"
        description={pageDescription}
        url={`https://accessibility.build${ROUTE}`}
        applicationCategory="AccessibilityApplication"
        operatingSystem="Any"
        featureList={[
          "Flesch Reading Ease, Flesch-Kincaid, Gunning Fog, SMOG, Coleman-Liau and ARI scores",
          "Average grade and estimated reading age",
          "Long and hard sentences, passive voice, wordy phrases and abbreviations highlighted in place",
          "Checks pasted text or the main content of a web page",
        ]}
      />
      <HowToStructuredData
        name="How to check the readability of your text"
        description="Paste text or enter a web page address, read the scores against WCAG 3.1.5, and work through the highlighted findings."
        steps={[
          { name: "Add your text", text: "Paste text into the box, or switch to Check a web page and enter its address." },
          { name: "Read the scores", text: "See six readability scores, the average grade and the reading age, and whether the text is above lower secondary level." },
          { name: "Work through the findings", text: "Open each list of findings and follow the links to the highlighted sentence or phrase in your text." },
          { name: "Rewrite and check again", text: "Shorten long sentences, make passive sentences active, swap wordy phrases and spell out abbreviations, then run the check again." },
        ]}
      />

      <div className="bg-white pb-20 dark:bg-slate-950">
        <header className="border-b border-slate-200 bg-slate-50 pt-12 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="container-wide py-10 lg:py-14">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link href="/" className="hover:text-teal-700 dark:hover:text-teal-300">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/tools" className="hover:text-teal-700 dark:hover:text-teal-300">
                    Tools
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-slate-900 dark:text-white">Readability Checker</li>
              </ol>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
              Free tool &middot; No sign-up
            </p>
            <h1 className="mt-3 max-w-4xl font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              How hard is your text to read?
            </h1>
            <p className="mt-6 max-w-[62ch] text-lg leading-8 text-slate-700 dark:text-slate-300">
              Paste text or check a web page to get six readability scores, an average school grade and a
              reading age. Then see exactly which sentences are long or hard, where the passive voice and
              wordy phrases are, and which abbreviations nobody has explained, highlighted in your text with
              a plainer alternative where there is one.
            </p>
          </div>
        </header>

        <div className="container-wide">
          <div className="mx-auto max-w-6xl py-12">
            <ReadabilityChecker />

            <section aria-labelledby="scores-heading" className="mt-14 max-w-[68ch]">
              <h2 id="scores-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                What the scores measure
              </h2>
              <div className="mt-4 space-y-4 leading-7 text-slate-700 dark:text-slate-300">
                <p>
                  Every readability formula works from the same two signals: how long the sentences are, and
                  how long the words are. Flesch Reading Ease turns them into a score out of 100, where higher
                  is easier. The other five give a US school grade: Flesch-Kincaid and Gunning Fog from
                  syllables, SMOG from words of three or more syllables, and Coleman-Liau and the Automated
                  Readability Index from letters. The average of the five grades is the single number to
                  watch, and the reading age is that grade plus five or six years.
                </p>
                <p>
                  The formulas were calibrated against how well readers understood test passages, so they are a
                  fair guide to how much effort a text asks for. But they cannot see meaning. &ldquo;The cat sat on
                  the mat&rdquo; and a sentence of short, unfamiliar jargon can score the same, and a short
                  sentence can still be confusing. Use the score to find the hard parts, and the findings to
                  fix them.
                </p>
              </div>
            </section>

            <section aria-labelledby="flags-heading" className="mt-12 max-w-[68ch]">
              <h2 id="flags-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                What the checker flags
              </h2>
              <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                <table className="w-full border-collapse text-sm">
                  <caption className="sr-only">Each plain-language finding and when the checker raises it</caption>
                  <thead>
                    <tr>
                      {["Finding", "When we flag it", "What to do"].map((h) => (
                        <th
                          key={h}
                          scope="col"
                          className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-slate-700 dark:text-slate-300">
                    {[
                      ["Very long sentence", `Over ${THRESHOLDS.longSentenceWords} words`, "Split it. One idea per sentence."],
                      ["Hard or very hard sentence", `${THRESHOLDS.minWordsToGrade} words or more scoring grade ${THRESHOLDS.hardSentenceGrade} or more (very hard: ${THRESHOLDS.veryHardSentenceGrade} or more) on its own`, "Shorten it and use shorter words."],
                      ["Possible passive voice", "A form of \"be\" followed by a past participle", "Say who does what: \"we approved\", not \"was approved\"."],
                      ["Wordy word or phrase", "On our list of words with a plainer alternative", "Use the suggestion if it keeps your meaning."],
                      ["Unexplained abbreviation", "Capitals with no expansion in brackets and no abbr title", "Spell it out the first time."],
                      ["Long paragraph", `Over ${THRESHOLDS.longParagraphWords} words`, "Break it up, or use a list."],
                      ["Adverb", "Words ending in -ly (off by default)", "Cut it if the sentence works without it."],
                    ].map(([finding, when, fix]) => (
                      <tr key={finding} className="align-top">
                        <th scope="row" className="border-b border-slate-200 px-4 py-3 text-left font-medium text-slate-900 dark:border-slate-800 dark:text-white">
                          {finding}
                        </th>
                        <td className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">{when}</td>
                        <td className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">{fix}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section aria-labelledby="wcag-heading" className="mt-12 max-w-[68ch]">
              <h2 id="wcag-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                Reading level and WCAG
              </h2>
              <div className="mt-4 space-y-4 leading-7 text-slate-700 dark:text-slate-300">
                <p>
                  <Link href="/wcag/3-1-5" className="font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300">
                    WCAG 3.1.5 Reading Level
                  </Link>{" "}
                  asks that when text needs reading ability above lower secondary education, after removing
                  proper names and titles, you also provide supplemental content or a simpler version. Lower
                  secondary education ends around nine years into school, so this tool treats an average grade
                  above {LOWER_SECONDARY_GRADE} as the point to act. A plain-language summary at the top of the page, a diagram or an
                  easy read version all meet it.
                </p>
                <p>
                  The same chapter of WCAG covers the words themselves.{" "}
                  <Link href="/wcag/3-1-4" className="font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300">
                    3.1.4 Abbreviations
                  </Link>{" "}
                  asks for a way to find the expanded form of each abbreviation, and{" "}
                  <Link href="/wcag/3-1-3" className="font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300">
                    3.1.3 Unusual Words
                  </Link>{" "}
                  asks for definitions of jargon and idioms. All three are Level AAA, so they go beyond what most
                  laws require. They matter most to people with cognitive and learning disabilities; see the{" "}
                  <Link href="/guides/cognitive-accessibility" className="font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300">
                    guide to cognitive accessibility
                  </Link>
                  .
                </p>
              </div>
            </section>

            <section aria-labelledby="limits-heading" className="mt-12 max-w-[68ch]">
              <h2 id="limits-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                What this tool can&apos;t tell you
              </h2>
              <ul className="mt-4 list-disc space-y-3 pl-6 leading-7 text-slate-700 dark:text-slate-300">
                <li>
                  It is for English. The formulas were made for English, and the syllable count, word list and
                  passive voice check only work in English.
                </li>
                <li>
                  Syllables are counted by a rule of thumb, not a dictionary, so a few words are miscounted and
                  the grades can differ a little from other tools, which count syllables their own way.
                </li>
                <li>
                  Passive voice, abbreviations and adverbs are found by pattern, not by understanding the
                  sentence. Expect some false alarms and some misses.
                </li>
                <li>
                  Headings, list items and labels count as sentences. On a page with many of them the average
                  sentence is short and the scores look easier than the body text really is.
                </li>
                <li>
                  The web page mode reads the HTML the server sends. It does not run JavaScript, log in, or get
                  past bot checks, so some pages come back nearly empty.
                </li>
                <li>
                  No formula knows your readers. Testing a page with people from your audience tells you far
                  more than any score.
                </li>
              </ul>
            </section>

            <div className="mt-14 max-w-[68ch]">
              <FaqSection faqs={FAQS} />
            </div>

            <div className="mt-14">
              <RelatedContent
                content="readability plain language reading level WCAG 3.1.5 cognitive accessibility content writing typography"
                title="Related reading"
                maxItems={4}
                showDescriptions
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
