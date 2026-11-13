import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { FaqSection } from "@/components/seo/faq-section"
import { RelatedContent } from "@/components/seo/related-content"
import { BuyBox } from "@/components/products/buy-box"
import { InDevelopmentBadge } from "@/components/courses/in-development-badge"
import { AccessNotice } from "@/components/products/access-notice"
import { clampDescription } from "@/lib/metadata"
import { formatUsd, lowestPrice, productJsonLd, products } from "@/lib/products"

const product = products.wasCrashCourse
const ROUTE = product.route

// Counts come from the private build (was/build/assemble.py output). Update them with each edition.
const COUNTS = { questions: 639, mockQuestions: 75, drills: 489, codeQuestions: 142, flashcards: 596, changes: 32 }

const pageTitle = "WAS Online Course and Practice Exams"
const pageDescription = `An independent online course for the IAAP WAS exam: every WCAG 2.2 success criterion, ARIA, testing and remediation, ${COUNTS.questions} original practice questions, two timed mock exams and flashcards. From ${formatUsd(lowestPrice(product))}.`
const ogTitle = encodeURIComponent(product.name)

export const wasSalesMetadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "was exam study guide",
    "was practice exam",
    "was practice questions",
    "web accessibility specialist exam prep",
    "iaap was",
    "was body of knowledge",
    "was mock exam",
    "cpwa",
  ],
  alternates: { canonical: ROUTE },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: ROUTE,
    type: "website",
    images: [{ url: `/api/og?title=${ogTitle}&section=Courses`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [{ url: `/api/og?title=${ogTitle}&section=Courses`, width: 1200, height: 630 }],
  },
}

const files = [
  {
    name: "Chapters",
    body: "Every section of IAAP's WAS Body of Knowledge (version 2.3, October 2024) as a structured course, with correct and broken code examples: every WCAG 2.2 success criterion with its level, techniques and common failures, ARIA roles and keyboard patterns, accessibility support, user strategies, conformance, WCAG-EM and ACT Rules, testing tools, testing with screen readers, remediation and procurement.",
  },
  {
    name: "Mock exams",
    body: `Two timed ${COUNTS.mockQuestions}-question mock exams weighted 40% Domain One, 40% Domain Two and 20% Domain Three. Choose standard time, time and a half, double time or no timer, flag questions, and review every answer at the end.`,
  },
  {
    name: "Topic practice",
    body: `${COUNTS.questions} original questions in all, ${COUNTS.codeQuestions} of them with a code snippet to read, grouped by section, with the answer, a full explanation and the Body of Knowledge page after each one. A missed-questions list keeps everything you got wrong until you get it right.`,
  },
  {
    name: "Flashcards",
    body: `${COUNTS.flashcards} cards for success criteria numbers, names and levels, ARIA role requirements, keyboard patterns and testing facts, with a still-learning pile.`,
  },
  {
    name: "What has changed",
    body: `A chapter listing ${COUNTS.changes} places where the Body of Knowledge is out of date or contains a slip, from EN 301 549 version 4.1.1 to retired testing tools, each checked against the primary source in November 2026.`,
  },
  {
    name: "Your progress, everywhere",
    body: "Progress, scores and flashcard marks are saved to your account, so you can switch between laptop and phone. Built to WCAG 2.2 AA: keyboard and screen reader friendly, light and dark modes.",
  },
]

const sample = {
  stem: "A settings page has a dark mode toggle built with the markup below. Its script swaps a CSS class when the toggle is activated. A screen reader user hears only \"Dark mode, button\" whether the setting is on or off. Which change best fixes this?",
  code: '<div role="button" tabindex="0" class="toggle is-on">Dark mode</div>',
  options: [
    "Add aria-pressed and have the script set it to true or false with each change",
    "Add aria-label=\"Dark mode on\" so the label states the setting",
    "Add a title attribute that the script updates to describe the setting",
    "Rename the class to toggle-on so the setting appears in the markup",
  ],
  answer: 0,
  explanation:
    "Success criterion 4.1.2 Name, Role, Value requires the state of a control to be programmatically determinable. For a toggle button, WAI-ARIA provides aria-pressed, which assistive technologies announce as pressed or not pressed, and the script must keep it in step with the visual state. A fixed aria-label would be wrong half the time and puts state into the name. A title is not reliably announced and is not a state. CSS class names are not exposed to the accessibility API at all.",
}

const faqs = [
  {
    question: "Is this affiliated with IAAP?",
    answer:
      "No. This is an independent online course from Accessibility.build. It is not affiliated with, approved by or endorsed by the International Association of Accessibility Professionals (IAAP), and we are not an IAAP Approved Certification Preparation Provider. WAS is a certification of IAAP. IAAP's own free Body of Knowledge and Content Outline are the official starting points, and we recommend you download them from IAAP.",
  },
  {
    question: "Are these real exam questions?",
    answer:
      "No. IAAP exam content is confidential, and we have not used or seen it. Every question in this course is original and written from IAAP's public Body of Knowledge and the W3C specifications it points to. None is taken from, or tries to recreate, an actual exam question.",
  },
  {
    question: "Is a course enough on its own?",
    answer:
      "IAAP describes the WAS as a test of hands-on skill, not a knowledge test, and sets an experience requirement of three to five years writing, testing and fixing accessible code. This course gives you the knowledge in an organized form, and its study plan includes labs with a screen reader, browser developer tools and automated checkers. Real practice still matters most.",
  },
  {
    question: "How accurate is it?",
    answer:
      "Each question was answered independently, without the answer key, and checked against its source before release, then checked again after any revision. Facts beyond the Body of Knowledge come from primary sources only: WCAG 2.2 and its Understanding and Techniques documents, WAI-ARIA 1.2, the ARIA Authoring Practices Guide, WCAG-EM, ACT Rules, ETSI EN 301 549, and vendors' own documentation for screen readers and testing tools. Code examples were checked for syntax and behavior. If you find an error, tell us and we will correct it.",
  },
  {
    question: "Which version of the Body of Knowledge does it follow?",
    answer:
      "The WAS Body of Knowledge version 2.3, dated October 2024, which includes WCAG 2.2 and is the English version IAAP publishes as of November 2026. If IAAP releases a newer Body of Knowledge, study its changes as well, because this edition will not cover them.",
  },
  {
    question: "Will it tell me whether I would pass?",
    answer:
      "No, and nothing can. IAAP reports results as pass or fail on a scaled score from 200 to 800, with 600 as the passing mark, and does not publish the percentage of questions you need. The practice app shows your score by domain so you can see where to study. As our own rule of thumb, keep practising any domain where you score under 80% on fresh questions.",
  },
  {
    question: "Does it guarantee a pass?",
    answer:
      "No. No preparation product can, and IAAP says the same of every course.",
  },
  {
    question: "How do I access the course?",
    answer:
      "Everything is on Accessibility.build. Sign in with a free account, buy a licence, and the course opens straight away in your browser on any device. Your progress, mock exam scores and flashcard marks are saved to your account. There is nothing to download or install.",
  },
  {
    question: "How does the Team licence work?",
    answer:
      "The Team licence covers up to 10 people in one organisation, including the buyer. After buying, open the team page in the course and add your colleagues by email. Each of them gets access when they sign in with that email, with their own progress.",
  },
  {
    question: "How long do I have access?",
    answer: "Your access does not expire.",
  },
  {
    question: "What is the refund policy?",
    answer:
      "Because access is given instantly, please read the sample question on this page and the list of what you get before buying. See our refund policy for the full terms.",
  },
]

export function WasSalesPage() {
  const jsonLd = productJsonLd(product, pageDescription)
  return (
    <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Courses", url: "https://accessibility.build/courses" },
          { name: product.name, url: `https://accessibility.build${ROUTE}` },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Breadcrumb" className="border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <Link href="/" className="hover:text-blue-700 dark:hover:text-blue-400">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/courses" className="hover:text-blue-700 dark:hover:text-blue-400">Courses</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span className="font-medium text-slate-900 dark:text-white" aria-current="page">WAS Crash Course</span>
            </li>
          </ol>
        </div>
      </nav>

      <header className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <div className="max-w-4xl">
            {product.inDevelopment ? <InDevelopmentBadge onDark className="mb-4" /> : null}
            <p className="text-blue-200 font-semibold text-sm tracking-wider uppercase mb-4">Online course &bull; Independent</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">WAS Crash Course</h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-3xl">{product.tagline}</p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#buy"
                className="inline-flex items-center rounded-lg bg-white px-5 py-3 font-semibold text-slate-900 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                From {formatUsd(lowestPrice(product))}
              </a>
              <a href="#sample" className="text-blue-100 underline underline-offset-4 hover:text-white">
                Try a sample question
              </a>
            </div>
            {product.inDevelopment ? (
              <p className="mt-6 text-sm text-slate-200 max-w-3xl">
                This course is still in development. Chapters and practice questions may change before it is released.
              </p>
            ) : null}
            <p className="mt-6 text-sm text-slate-300 max-w-3xl">
              Not affiliated with, approved by or endorsed by IAAP. WAS is a certification of the International Association of Accessibility Professionals.
            </p>
            <p className="mt-2 text-sm text-slate-300">
              Already bought it? <Link href={`${product.route}/learn`} className="font-semibold text-white underline underline-offset-4">Open the course</Link>.
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16">
        <section aria-labelledby="why-heading">
          <h2 id="why-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Built around the Body of Knowledge</h2>
          <ul className="grid gap-4 md:grid-cols-2 text-slate-700 dark:text-slate-300" role="list">
            <li className="rounded-xl border border-slate-200 dark:border-slate-800 p-5"><strong className="text-slate-900 dark:text-white">Follows the official syllabus.</strong> The course follows IAAP's WAS Body of Knowledge section by section, names the pages each chapter covers, and fills in the detail from the W3C specifications it points to.</li>
            <li className="rounded-xl border border-slate-200 dark:border-slate-800 p-5"><strong className="text-slate-900 dark:text-white">Weighted like the exam.</strong> Each mock exam has {COUNTS.mockQuestions} questions: 30 from Domain One, 30 from Domain Two and 15 from Domain Three, in the 40/40/20 weighting IAAP publishes.</li>
            <li className="rounded-xl border border-slate-200 dark:border-slate-800 p-5"><strong className="text-slate-900 dark:text-white">Code you have to read.</strong> About a quarter of the questions show HTML, CSS or JavaScript and ask what it does, which success criterion it fails or how to fix it, and every explanation says why each wrong answer is wrong.</li>
            <li className="rounded-xl border border-slate-200 dark:border-slate-800 p-5"><strong className="text-slate-900 dark:text-white">Honest about the gaps.</strong> The Body of Knowledge dates from 2024. Where a standard, tool or screen reader fact has changed, or the text contains a slip, the course tells you what it says and what is true today.</li>
          </ul>
        </section>

        <section id="inside" aria-labelledby="inside-heading" className="scroll-mt-24">
          <h2 id="inside-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">What you get</h2>
          <dl className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
            {files.map((f) => (
              <div key={f.name} className="grid gap-1 py-4 md:grid-cols-[14rem_1fr] md:gap-6">
                <dt className="font-semibold text-slate-900 dark:text-white">{f.name}</dt>
                <dd className="text-slate-700 dark:text-slate-300">{f.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="sample" aria-labelledby="sample-heading" className="scroll-mt-24">
          <h2 id="sample-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Sample question</h2>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <p className="font-semibold text-slate-900 dark:text-white mb-4">{sample.stem}</p>
            <pre tabIndex={0} role="region" aria-label="Code for the sample question" className="mb-4 overflow-x-auto rounded-lg border border-slate-300 bg-slate-50 p-4 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"><code>{sample.code}</code></pre>
            <ol className="list-[upper-alpha] pl-6 space-y-1 text-slate-700 dark:text-slate-300 mb-4">
              {sample.options.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ol>
            <details className="group">
              <summary className="cursor-pointer font-semibold text-blue-700 dark:text-blue-400 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded">
                Show the answer
              </summary>
              <div className="mt-3 text-slate-700 dark:text-slate-300 space-y-2">
                <p>
                  <strong className="text-slate-900 dark:text-white">Answer: {sample.options[sample.answer]}.</strong>
                </p>
                <p>{sample.explanation}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Body of Knowledge reference: Domain One D (Using ARIA), with detail from WAI-ARIA 1.2.</p>
              </div>
            </details>
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Written for this page. It is not one of the {COUNTS.questions} questions in the course.</p>
        </section>

        <AccessNotice />
        <BuyBox product={product} deliveryNote="Online access on Accessibility.build straight after payment." />

        <FaqSection faqs={faqs} title="Frequently Asked Questions" as="h2" className="scroll-mt-24" />

        <section aria-labelledby="notices-heading">
          <h2 id="notices-heading" className="text-xl font-bold text-slate-900 dark:text-white mb-3">Notices</h2>
          <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <p>
              This is an independent study aid. It is not affiliated with, approved by or endorsed by the International Association of Accessibility Professionals (IAAP), a division of G3ict. WAS and Web Accessibility Specialist are certifications of IAAP. Download the official{" "}
              <a href="https://www.accessibilityassociation.org/was" className="underline underline-offset-2" target="_blank" rel="noopener noreferrer">
                WAS Body of Knowledge and Content Outline from IAAP
              </a>
              .
            </p>
            <p>Every practice question is original. None is taken from, or recreates, an IAAP exam question. Using this product does not guarantee that you will pass the exam.</p>
          </div>
        </section>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20">
        <RelatedContent content="wcag 2.2 success criteria aria authoring practices screen reader testing accessibility audit" title="Related resources" />
      </section>
    </div>
  )
}
