import type { Metadata } from "next"
import Link from "next/link"
import {
  BreadcrumbStructuredData,
  FAQStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShieldCheck, ListChecks } from "lucide-react"

const pageTitle = "Cognitive Accessibility & Plain Language Guide"
const pageDescription =
  "Design for cognitive accessibility: plain language, scannable structure, consistent navigation, reduced memory load, and forgiving forms so people with memory, attention, language, and learning disabilities can use your site. Covers the WCAG 2.2 cognitive criteria (3.2.6 Consistent Help, 3.3.7 Redundant Entry, 3.3.8 Accessible Authentication), the W3C COGA guidance, and how to test what checkers cannot, with copy-ready examples."

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "cognitive accessibility",
    "plain language",
    "cognitive disability accessibility",
    "accessible content",
    "wcag cognitive",
    "coga",
    "making content usable",
    "plain language web",
    "readability accessibility",
    "accessibility for cognitive disabilities",
    "memory load accessibility",
    "accessible authentication",
    "redundant entry",
    "consistent help",
    "neurodiversity web accessibility",
    "easy to read content",
    "low literacy accessibility",
    "dyslexia web content",
    "attention accessibility",
    "plain language guidelines",
  ],
  alternates: {
    canonical: "/guides/cognitive-accessibility",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/cognitive-accessibility",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(pageTitle)}&section=Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(pageTitle)}&section=Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Guides", url: "https://accessibility.build/guides" },
  {
    name: "Cognitive Accessibility & Plain Language",
    url: "https://accessibility.build/guides/cognitive-accessibility",
  },
]

const faqs = [
  {
    question: "What is cognitive accessibility?",
    answer:
      "Cognitive accessibility is the practice of designing content and interfaces so that people with cognitive and learning disabilities can understand, remember, and use them. It covers a wide range of abilities: memory, attention, executive function, language and literacy, reasoning, and processing speed. In practice it comes down to lowering the mental effort your product asks of everyone: use plain language, give content a clear and scannable structure, keep navigation and components consistent, do not rely on people to remember things, give them enough time, and help them avoid and recover from mistakes. It is less about a single ARIA attribute and more about how understandable the whole experience is.",
  },
  {
    question: "Who does cognitive accessibility help?",
    answer:
      "A very large and varied group. It includes people with learning disabilities such as dyslexia and dyscalculia, attention conditions such as ADHD, autism, memory impairments, acquired brain injury, aphasia, and the changes that come with aging. Cognitive and learning disabilities are among the most common disabilities. It also helps far more people than that number suggests, because cognitive capacity is situational: anyone can be tired, stressed, distracted, multitasking, in a hurry, reading in a second language, or new to a task. Clear, low-effort design is the accessibility work that benefits the broadest audience, disabled or not.",
  },
  {
    question: "Why is cognitive accessibility not fully covered by WCAG?",
    answer:
      "WCAG can only require things that are reliably testable, and many cognitive needs (Is this sentence clear? Is this flow simple enough?) resist a pass or fail test. As a result, cognitive support is spread thinly across the guidelines, and several of the most relevant criteria sit at Level AAA, which most organizations do not commit to. WCAG 2.2 added three Level A and AA criteria aimed squarely at cognitive load (3.2.6 Consistent Help, 3.3.7 Redundant Entry, and 3.3.8 Accessible Authentication), which helped, but the fuller picture lives in the W3C guidance document Making Content Usable for People with Cognitive and Learning Disabilities. Treat WCAG conformance as the floor for cognitive accessibility, not the goal.",
  },
  {
    question: "What is plain language, and does it mean dumbing content down?",
    answer:
      "Plain language means writing so your intended reader can find what they need, understand it the first time, and use it. It is defined in the international standard ISO 24495-1. It is not dumbing down: the ideas can be as sophisticated as the subject demands. What changes is the delivery. You lead with the point, use short sentences that carry one idea each, prefer common words, write in the active voice and second person, define any jargon you cannot avoid, and break content into headings and lists so it can be scanned. Experts read plain language faster too, which is why plain language is a usability win across the whole audience, not a concession for a subset of it.",
  },
  {
    question: "What reading level should web content target?",
    answer:
      "For general audiences, aim for a lower secondary reading level, roughly an eighth to ninth grade level, which corresponds to WCAG 3.1.5 Reading Level. A Flesch Reading Ease score of about 60 or higher and a Flesch-Kincaid grade level of 8 or lower are useful automated proxies. These scores only measure sentence length and syllable counts, so they cannot tell you whether the meaning is clear; treat them as a smoke alarm, not a certificate. When a topic genuinely requires advanced reading ability, 3.1.5 asks you to provide a simpler alternative version or supplemental content (a summary, a glossary, or an explainer) rather than lowering the technical accuracy of the original.",
  },
  {
    question: "What are the WCAG 2.2 cognitive accessibility criteria?",
    answer:
      "WCAG 2.2 added three criteria that directly reduce cognitive load. 3.2.6 Consistent Help (Level A) requires that if a help mechanism such as a phone number, contact form, or chat appears across pages, it appears in the same relative place, so people do not have to search for support. 3.3.7 Redundant Entry (Level A) says you must not make people re-enter information they already provided in the same process; auto-populate it or let them select it. 3.3.8 Accessible Authentication (Level AA) prohibits a cognitive function test, such as memorizing a password or transcribing characters, as the only way to log in, which is why you must allow paste and password managers and can support passkeys. A Level AAA version, 3.3.9, removes the object and personal-content exceptions.",
  },
  {
    question: "How do I test cognitive accessibility?",
    answer:
      "Automated tools help at the edges but cannot judge clarity, so a real test combines a few methods. Run a readability score on your actual copy to flag long sentences and dense vocabulary. Do a plain-language editing pass and the explain-it-back test: read a screen, look away, and try to say what it asked you to do; if you cannot, it is too complex. Walk your key flows checking for memory demands, surprise timeouts, re-entered information, inconsistent components, and interrupting motion. Then, most importantly, run moderated usability sessions with people who have cognitive and learning disabilities, because they will surface confusion that no checker and no guideline can. The W3C Making Content Usable document ships a checklist you can work through.",
  },
  {
    question: "Is cognitive accessibility a legal requirement?",
    answer:
      "Yes, to the extent it is expressed in WCAG. Laws such as the Americans with Disabilities Act in the United States, the European Accessibility Act, and Section 508 measure conformance against WCAG Level AA, and that includes the cognitive-focused criteria at A and AA: Labels or Instructions, Consistent Navigation and Identification, Timing Adjustable, Consistent Help, Redundant Entry, and Accessible Authentication. The many cognitive recommendations that live at Level AAA or in the COGA guidance are usually not legally mandated, but they are where much of the real-world benefit is, and courts and regulators increasingly expect content that a broad public can actually understand, not just markup that passes a scanner.",
  },
]

const antiPatterns = [
  {
    bad: "Walls of dense text: long sentences, jargon, passive voice.",
    why: "High reading and processing load shuts out people with low literacy, dyslexia, aphasia, and anyone reading in a second language (3.1.5).",
    fix: "Plain language: lead with the point, short sentences, common words, headings and bullet lists, one idea per paragraph.",
  },
  {
    bad: "Short session timeouts that log people out mid-task.",
    why: "Users who need more time lose their work and their place, and often cannot start over (2.2.1).",
    fix: "Warn before a timeout, let the user extend it, and save progress so nothing is lost.",
  },
  {
    bad: "Login puzzles, memorized codes, or transcription CAPTCHAs.",
    why: "They are a cognitive function test that memory and attention disabilities fail, with no reasonable alternative (3.3.8).",
    fix: "Allow paste and password managers, support passkeys, and drop transcription and puzzle CAPTCHAs.",
  },
  {
    bad: "Asking for the same information twice in one flow.",
    why: "Re-entering data taxes short-term memory and multiplies the chance of an error (3.3.7).",
    fix: "Carry data forward, auto-populate it, or offer a “same as” option to select it.",
  },
  {
    bad: "Icon-only controls that move or get renamed between pages.",
    why: "Users cannot build a stable model of what things are or where to find them (3.2.4, 3.2.6).",
    fix: "Pair icons with text labels, and keep repeated components named and placed consistently.",
  },
  {
    bad: "Auto-playing carousels, motion, and pop-ups that interrupt.",
    why: "They break concentration and are unreadable for people with attention difficulties (2.2.2).",
    fix: "Do not autoplay, honor prefers-reduced-motion, and let users control motion and dismiss interruptions.",
  },
]

export default function CognitiveAccessibilityGuidePage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <FAQStructuredData faqs={faqs} />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
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
                    href="/guides"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Guides
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">
                  /
                </li>
                <li>
                  <span className="text-slate-900 dark:text-white font-medium">
                    Cognitive Accessibility
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <article>
          {/* Hero */}
          <section className="pt-12 pb-8 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl text-center">
              <Badge variant="secondary" className="mb-4 text-sm px-3 py-1">
                Implementation Guide &bull; Updated August 2026
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                Cognitive Accessibility &amp; Plain Language
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Cognitive accessibility serves the largest and most varied group
                of disabled users, and the one automated checkers help least. It
                is not a set of attributes you can bolt on; it is a decision to
                lower the mental effort your product asks of everyone. This guide
                turns that idea into concrete moves: plain language, scannable
                structure, consistent navigation, less reliance on memory, and
                forgiving forms. Everything is mapped to WCAG 2.2 and the W3C
                cognitive guidance, with copy-ready examples.
              </p>
            </div>
          </section>

          {/* Why cognitive is different */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Why Cognitive Accessibility Is Different
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Most accessibility work has a clear pass or fail. A control
                  either has an accessible name or it does not; contrast either
                  meets 4.5:1 or it does not. Cognitive accessibility is harder,
                  because the questions are ones a machine cannot answer:{" "}
                  <em>is this sentence clear?</em> <em>is this flow simple
                  enough?</em> <em>will someone remember this on the next
                  screen?</em> That is why an automated scan can report zero
                  issues on a page that is still, in practice, unusable for a
                  large share of your audience.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The group it affects is broad. It includes people with learning
                  disabilities such as dyslexia and dyscalculia, attention
                  conditions such as ADHD, autism, memory impairments, aphasia and
                  other language processing differences, acquired brain injury, and
                  the cognitive changes of aging. Cognitive and learning
                  disabilities are among the most common disabilities of all. And
                  cognitive capacity is{" "}
                  <strong className="text-slate-900 dark:text-white">
                    situational
                  </strong>
                  : the tired parent, the stressed traveler, the person reading in
                  a second language, and the developer skimming your docs at
                  midnight are all, in that moment, working with reduced attention
                  and memory. Design that lowers cognitive load is the
                  accessibility work with the widest reach.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  There is also a reason it gets neglected:{" "}
                  <strong className="text-slate-900 dark:text-white">
                    these users rarely complain
                  </strong>
                  . A blind user who hits an unlabeled button can name the problem.
                  Someone who is confused by your checkout usually just assumes the
                  fault is theirs, gives up, and leaves quietly. The failure looks
                  like a bounce, not a bug report. So the work has to be proactive.
                </p>
                <div className="not-prose rounded-lg border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/20 p-5 my-6">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
                    The eight COGA objectives
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    The W3C document{" "}
                    <em>
                      Making Content Usable for People with Cognitive and Learning
                      Disabilities
                    </em>{" "}
                    (from the COGA Task Force) is the deepest source here. Its eight
                    objectives are the backbone of this guide:
                  </p>
                  <ol className="text-sm text-muted-foreground leading-relaxed list-decimal pl-5 space-y-1">
                    <li>Help users understand what things are and how to use them.</li>
                    <li>Help users find what they need.</li>
                    <li>Use clear and understandable content.</li>
                    <li>Help users avoid mistakes and know how to correct them.</li>
                    <li>Help users focus.</li>
                    <li>Ensure processes do not rely on memory.</li>
                    <li>Provide help and support.</li>
                    <li>Support adaptation and personalization.</li>
                  </ol>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  One assumption to drop: that because much of this is not testable,
                  it is not required. The laws that govern the rest of your product
                  reach it too, measured against WCAG Level AA, which now includes
                  cognitive criteria. This guide is the build layer; for the letter
                  of the standard, see the{" "}
                  <Link
                    href="/guides/wcag-2-2-aa-requirements"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    WCAG 2.2 Level AA requirements
                  </Link>
                  .
                </p>
              </div>
            </div>
          </section>

          {/* WCAG mapping */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                The WCAG Criteria That Support Cognition
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Cognitive support is spread across WCAG, and much of it lives at
                Level AAA, which is itself a sign of how hard this area is to make
                testable. The three rows highlighted below are the criteria WCAG
                2.2 added specifically to reduce cognitive load, and they are the
                most commonly overlooked.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria that support cognitive
                    accessibility, their conformance level, and what each requires
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Criterion
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Level
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        What it asks of you
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr className="bg-blue-50/60 dark:bg-blue-950/20">
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/3-2-6" className="text-blue-600 dark:text-blue-400 hover:underline">
                          3.2.6 Consistent Help
                        </Link>
                      </th>
                      <td className="px-4 py-3">A (new in 2.2)</td>
                      <td className="px-4 py-3">Help such as contact details, a form, or chat appears in the same relative place on every page so no one has to hunt for support.</td>
                    </tr>
                    <tr className="bg-blue-50/60 dark:bg-blue-950/20">
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/3-3-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                          3.3.7 Redundant Entry
                        </Link>
                      </th>
                      <td className="px-4 py-3">A (new in 2.2)</td>
                      <td className="px-4 py-3">Do not make people re-enter information they already gave in the same process; auto-populate it or let them select it.</td>
                    </tr>
                    <tr className="bg-blue-50/60 dark:bg-blue-950/20">
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/3-3-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                          3.3.8 Accessible Authentication
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA (new in 2.2)</td>
                      <td className="px-4 py-3">No memory or puzzle test as the only way to log in; allow paste and password managers, and you can support passkeys.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/3-3-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          3.3.2 Labels or Instructions
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Every input has a clear label and any instructions it needs, provided up front.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-6" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.6 Headings and Labels
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Headings and labels describe the topic or purpose, so content can be scanned and predicted.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/3-2-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          3.2.3 Consistent Navigation
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Repeated navigation stays in the same relative order across the site.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/3-2-4" className="text-blue-600 dark:text-blue-400 hover:underline">
                          3.2.4 Consistent Identification
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">The same component is named and marked up the same way everywhere it appears.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-2-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.2.1 Timing Adjustable
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Time limits can be turned off, adjusted, or extended, so no one is rushed out of a task.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/3-1-5" className="text-blue-600 dark:text-blue-400 hover:underline">
                          3.1.5 Reading Level
                        </Link>
                      </th>
                      <td className="px-4 py-3">AAA</td>
                      <td className="px-4 py-3">Where text needs reading ability beyond lower secondary level, offer a simpler alternative or supplement.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.8 Visual Presentation
                        </Link>
                      </th>
                      <td className="px-4 py-3">AAA</td>
                      <td className="px-4 py-3">User-controllable color, line length under 80 characters, no justified text, and generous line spacing.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/3-3-5" className="text-blue-600 dark:text-blue-400 hover:underline">
                          3.3.5 Help
                        </Link>
                      </th>
                      <td className="px-4 py-3">AAA</td>
                      <td className="px-4 py-3">Context-sensitive help is available where people fill things in or make decisions.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/3-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          3.1.3 / 3.1.4 Unusual Words &amp; Abbreviations
                        </Link>
                      </th>
                      <td className="px-4 py-3">AAA</td>
                      <td className="px-4 py-3">Define jargon and idioms, and expand or explain abbreviations on first use.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4 text-sm">
                For the wording of every criterion, browse the{" "}
                <Link
                  href="/wcag"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  WCAG 2.2 reference
                </Link>{" "}
                and the interactive{" "}
                <Link
                  href="/checklists/wcag-2-2"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  WCAG 2.2 checklist
                </Link>
                .
              </p>
            </div>
          </section>

          {/* 1. Plain language */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                1. Plain Language: The Highest-Leverage Skill
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you do only one thing for cognitive accessibility, write
                  plainly. Plain language, now formalized in the international
                  standard{" "}
                  <strong className="text-slate-900 dark:text-white">
                    ISO 24495-1
                  </strong>
                  , means your intended reader can find what they need, understand
                  it the first time, and act on it. It is not about lowering the
                  intelligence of the content. The ideas stay as sophisticated as
                  the subject requires; what changes is how you deliver them.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-2 mb-3">
                  The core moves
                </h3>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-1">
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Lead with the point.
                    </strong>{" "}
                    Put the answer or the action first, then the detail. Do not
                    make people read three paragraphs of background to reach what
                    they came for.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      One idea per sentence.
                    </strong>{" "}
                    Long, multi-clause sentences are the single biggest driver of
                    unreadable copy. Aim for around 15 to 20 words.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Common words, active voice, second person.
                    </strong>{" "}
                    Say &ldquo;you can cancel any time&rdquo; rather than
                    &ldquo;cancellation may be effected by the subscriber at their
                    discretion.&rdquo;
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Define jargon, expand abbreviations, avoid idioms.
                    </strong>{" "}
                    Figurative language (&ldquo;ballpark figure,&rdquo; &ldquo;low-hanging
                    fruit&rdquo;) is a barrier for many autistic readers and for
                    anyone reading in a second language.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Chunk it.
                    </strong>{" "}
                    Break content with meaningful headings, short paragraphs, and
                    bullet lists so it can be scanned rather than read wall to wall.
                  </li>
                </ul>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Before and after
                </h3>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<!-- Before: 41 words, one sentence, passive, bureaucratic -->
<p>In the event that the aforementioned documentation is not
   submitted prior to the stipulated deadline, the processing
   of your application may be subject to delay or, in certain
   circumstances, cancellation without further notification.</p>

<!-- After: three short sentences, active, leads with the action -->
<p>Send us your documents before the deadline. If they arrive
   late, we may delay your application. If we cannot reach you,
   we may cancel it.</p>`}</code></pre>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Reading level, and what the score does not tell you
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  For a general audience, target a{" "}
                  <strong className="text-slate-900 dark:text-white">
                    lower secondary reading level
                  </strong>{" "}
                  (roughly eighth to ninth grade), which is what{" "}
                  <Link href="/wcag/3-1-5" className="text-blue-600 dark:text-blue-400 hover:underline">
                    3.1.5 Reading Level
                  </Link>{" "}
                  points at. A Flesch Reading Ease score around 60 or higher is a
                  handy proxy. But readability formulas only count sentence length
                  and syllables; they cannot tell whether the meaning is clear, and
                  you can hit a great score while saying nothing understandable.
                  Use the score to catch long sentences and dense vocabulary, then
                  rely on human review and testing for actual clarity. When a topic
                  truly needs advanced reading ability, 3.1.5 asks for a simpler
                  alternative (a summary, a glossary, an explainer), not a dumbed-down
                  original. The{" "}
                  <Link href="/guides/accessible-typography-wcag" className="text-blue-600 dark:text-blue-400 hover:underline">
                    accessible typography guide
                  </Link>{" "}
                  covers Flesch-Kincaid scoring and dyslexia-friendly type in depth.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Structure and navigation */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                2. Clear Structure &amp; Consistent Navigation
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  People with cognitive disabilities rely on a{" "}
                  <strong className="text-slate-900 dark:text-white">
                    predictable structure
                  </strong>{" "}
                  to orient themselves. Every time your interface changes shape,
                  renames a control, or hides where things live, you spend some of
                  the user&rsquo;s limited attention on relearning instead of on the
                  task.
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-1">
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Meaningful headings in order.
                    </strong>{" "}
                    Headings are the table of contents everyone uses to scan.
                    Describe the section (
                    <Link href="/wcag/2-4-6" className="text-blue-600 dark:text-blue-400 hover:underline">
                      2.4.6
                    </Link>
                    ), keep them in a logical nesting (
                    <Link href="/wcag/1-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                      1.3.1
                    </Link>
                    ), and check the outline with the{" "}
                    <Link href="/tools/heading-analyzer" className="text-blue-600 dark:text-blue-400 hover:underline">
                      heading analyzer
                    </Link>
                    .
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Consistent navigation and identification.
                    </strong>{" "}
                    Keep the primary navigation in the same order on every page (
                    <Link href="/wcag/3-2-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                      3.2.3
                    </Link>
                    ), and give a component that does the same job the same name
                    and icon everywhere (
                    <Link href="/wcag/3-2-4" className="text-blue-600 dark:text-blue-400 hover:underline">
                      3.2.4
                    </Link>
                    ). A &ldquo;Search&rdquo; that becomes &ldquo;Find&rdquo; on the
                    next page reads as two different features.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Meaningful link and button text.
                    </strong>{" "}
                    &ldquo;Click here&rdquo; and &ldquo;Read more&rdquo; force people
                    to reconstruct meaning from context. The text itself should say
                    where it goes or what it does.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      More than one way to find things.
                    </strong>{" "}
                    Offer navigation, search, and a site map or index (
                    <Link href="/wcag/2-4-5" className="text-blue-600 dark:text-blue-400 hover:underline">
                      2.4.5 Multiple Ways
                    </Link>
                    ) so people are not forced through a single mental model of your
                    hierarchy.
                  </li>
                </ul>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Consistent Help (3.2.6), the new 2.2 requirement
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When someone gets stuck, they should not also have to hunt for
                  help.{" "}
                  <Link href="/wcag/3-2-6" className="text-blue-600 dark:text-blue-400 hover:underline">
                    3.2.6 Consistent Help
                  </Link>{" "}
                  says that if a help mechanism (a phone number, a contact link, a
                  chat widget, a help page) appears on multiple pages, it must
                  appear in the{" "}
                  <strong className="text-slate-900 dark:text-white">
                    same relative order
                  </strong>{" "}
                  each time. Put it in a stable place, such as the end of the header
                  or the start of the footer, and keep it there.
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<!-- Same header help link, same relative position, on every page -->
<header>
  <a class="logo" href="/">Acme</a>
  <nav aria-label="Primary"> ... </nav>
  <!-- Help stays last in the header, site-wide -->
  <a class="help-link" href="/help">Help &amp; contact</a>
</header>`}</code></pre>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Reducing memory load */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                3. Do Not Rely on Memory
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  COGA objective six is blunt:{" "}
                  <strong className="text-slate-900 dark:text-white">
                    processes should not rely on memory
                  </strong>
                  . Short-term and working memory are exactly what many cognitive
                  disabilities affect, so every time your interface asks someone to
                  remember a code, a value, or a step, you add a point of failure.
                  WCAG 2.2 turned two pieces of this into requirements.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-2 mb-3">
                  Redundant Entry (3.3.7): stop asking twice
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <Link href="/wcag/3-3-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                    3.3.7 Redundant Entry
                  </Link>{" "}
                  requires that information the user already entered in the same
                  process is either auto-populated or available to select, unless
                  re-entering is essential (a password confirmation), the data is
                  security-sensitive, or the earlier value is no longer valid. The
                  classic case is a shipping and billing address:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<!-- Let people reuse what they already typed -->
<label>
  <input type="checkbox" name="same-as-shipping" checked>
  Billing address is the same as shipping
</label>

<!-- And help the browser fill known fields, cutting entry entirely -->
<input name="email" type="email" autocomplete="email">
<input name="address" autocomplete="street-address">`}</code></pre>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Accessible Authentication (3.3.8): logging in without a memory test
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <Link href="/wcag/3-3-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                    3.3.8 Accessible Authentication
                  </Link>{" "}
                  prohibits a{" "}
                  <strong className="text-slate-900 dark:text-white">
                    cognitive function test
                  </strong>{" "}
                  (remembering a password, transcribing characters, solving a
                  puzzle) as the only way to authenticate, unless you provide an
                  alternative or a mechanism to help. In practice that means: allow
                  paste and do not block password managers, keep{" "}
                  <code>autocomplete</code> on so credentials can be filled, and
                  prefer methods that lean on recognition or the device rather than
                  recall, such as passkeys, an email link, or an OTP the user can
                  paste.
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<!-- Password managers can fill it; nothing blocks paste -->
<input type="password" name="password" autocomplete="current-password">

<!-- One-time code the user can paste, and the OS can offer to fill -->
<input type="text" inputmode="numeric" autocomplete="one-time-code"
       name="otp" aria-label="One-time code">

<!-- Do NOT do this: onpaste return false blocks the very users 3.3.8 protects -->`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Puzzle and transcription CAPTCHAs are a direct violation when they
                  are the only path through. The{" "}
                  <Link href="/guides/accessible-form-validation" className="text-blue-600 dark:text-blue-400 hover:underline">
                    accessible form validation guide
                  </Link>{" "}
                  works through 3.3.7 and 3.3.8 alongside the rest of the WCAG 3.3
                  input-assistance cluster.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Show, do not make them recall
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Beyond the two requirements, the general principle is to keep the
                  information people need{" "}
                  <strong className="text-slate-900 dark:text-white">visible</strong>
                  , not in their heads. Show a running summary in a multi-step
                  checkout, keep the instructions on screen while the person acts on
                  them rather than in a dismissed dialog, show a clear{" "}
                  <em>step 2 of 4</em> progress indicator, and confirm choices back
                  to the user before they commit.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Forms and error prevention */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                4. Forms, Errors &amp; Enough Time
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Forms are where cognitive load spikes and where users with these
                  disabilities most often abandon a task. The goal is to prevent
                  mistakes, and to make the ones that happen easy to understand and
                  fix (COGA objective four).
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-1">
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Labels and instructions up front.
                    </strong>{" "}
                    Tell people what a field needs{" "}
                    <em>before</em> they fill it, including format, with a real
                    label, not a placeholder that vanishes on focus (
                    <Link href="/wcag/3-3-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                      3.3.2
                    </Link>
                    ).
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Be forgiving about format.
                    </strong>{" "}
                    Accept the phone number or date however the person types it and
                    normalize it yourself, rather than rejecting it for a stray
                    space or dash.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Explain errors in plain words.
                    </strong>{" "}
                    &ldquo;Enter a date like 15/03/2026&rdquo; helps; &ldquo;Invalid
                    input, error 422&rdquo; does not. Say what is wrong and how to
                    fix it, next to the field.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Confirm consequential actions.
                    </strong>{" "}
                    For anything hard to undo (deleting, paying, submitting), give a
                    review-and-confirm step so a slip does not become a disaster (
                    <Link href="/wcag/3-3-4" className="text-blue-600 dark:text-blue-400 hover:underline">
                      3.3.4 Error Prevention
                    </Link>
                    ).
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      One thing at a time.
                    </strong>{" "}
                    Breaking a long form into focused steps with clear progress is
                    usually kinder to working memory than one intimidating page,
                    as long as you do not re-ask for earlier answers (3.3.7).
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <strong className="text-slate-900 dark:text-white">
                    Give people time.
                  </strong>{" "}
                  Reading, deciding, and typing all take longer for many users, so a
                  silent session timeout is a cognitive barrier as much as a
                  security setting.{" "}
                  <Link href="/wcag/2-2-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.2.1 Timing Adjustable
                  </Link>{" "}
                  requires that time limits can be turned off, adjusted, or extended.
                  Warn before a timeout, offer a one-click extension, and preserve
                  what the person entered so a re-login never means starting over.
                  The full timing-first approach to validation lives in the{" "}
                  <Link href="/guides/accessible-form-validation" className="text-blue-600 dark:text-blue-400 hover:underline">
                    form validation guide
                  </Link>
                  , and the fundamentals in the{" "}
                  <Link href="/guides/accessible-forms" className="text-blue-600 dark:text-blue-400 hover:underline">
                    accessible forms guide
                  </Link>
                  .
                </p>
              </div>
            </div>
          </section>

          {/* 5. Attention and focus */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                5. Help Users Focus
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Attention is a finite resource, and for people with ADHD, autism,
                  anxiety, or memory conditions it can be especially hard to protect.
                  Interfaces that grab, move, and interrupt spend that resource for
                  the user. The fix is restraint.
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-1">
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      No moving, blinking, or auto-advancing content.
                    </strong>{" "}
                    Carousels that rotate on their own, animated ads, and marquee
                    text pull focus away from the task and can be impossible to read
                    (
                    <Link href="/wcag/2-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                      2.2.2 Pause, Stop, Hide
                    </Link>
                    ). If content moves, give a control to stop it, and honor{" "}
                    <code>prefers-reduced-motion</code>.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Do not interrupt.
                    </strong>{" "}
                    Pop-ups, surprise dialogs, and toasts that steal focus or cover
                    the content derail whatever the person was doing. Let people
                    finish, and let them dismiss anything that appears.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      One primary action per screen.
                    </strong>{" "}
                    Reduce the number of choices in view. A page that presents a
                    dozen equally weighted buttons forces a decision cost on every
                    one. Make the main path obvious and demote the rest.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Be predictable.
                    </strong>{" "}
                    Nothing should change context just because a control received
                    focus or a field changed value; a menu that navigates on focus,
                    or a select that submits the page on change, is disorienting (
                    <Link href="/wcag/3-2-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                      3.2.1
                    </Link>
                    ,{" "}
                    <Link href="/wcag/3-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                      3.2.2
                    </Link>
                    ).
                  </li>
                </ul>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`/* Respect the OS "reduce motion" setting for anything that animates */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}`}</code></pre>
                </div>
              </div>
            </div>
          </section>

          {/* 6. Reading and processing */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                6. Presentation That Supports Reading
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  How text sits on the page changes how much effort it takes to
                  read. These are visual choices with a cognitive payoff, and
                  several are encoded in{" "}
                  <Link href="/wcag/1-4-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.8 Visual Presentation
                  </Link>{" "}
                  and{" "}
                  <Link href="/wcag/1-4-12" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.12 Text Spacing
                  </Link>
                  .
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-1">
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Generous spacing.
                    </strong>{" "}
                    Line-height of at least 1.5, clear space between paragraphs, and
                    a little extra letter and word spacing all reduce visual crowding
                    for dyslexic readers.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Short line length.
                    </strong>{" "}
                    Keep measure to roughly 70 to 80 characters. Very long lines make
                    it easy to lose your place returning to the next line.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Left-aligned, not justified.
                    </strong>{" "}
                    Justified text creates uneven &ldquo;rivers&rdquo; of white space
                    that disrupt reading. Avoid it, and avoid long passages of
                    italics or all caps.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Icons with text, not icons alone.
                    </strong>{" "}
                    A lone icon asks the user to remember what it means. Pair it with
                    a visible label, and use imagery, diagrams, or examples to
                    reinforce important text (dual coding helps comprehension).
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Do not carry meaning by color alone,
                    </strong>{" "}
                    and keep body text at comfortable contrast so reading is not
                    effortful in the first place.
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A fast, revealing check is the{" "}
                  <strong className="text-slate-900 dark:text-white">
                    text-spacing test
                  </strong>{" "}
                  for 1.4.12: apply the override below and confirm nothing clips,
                  overlaps, or gets cut off. Layouts that only work at their
                  designed spacing break the moment a reader applies their own.
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`/* WCAG 1.4.12 text-spacing test: paste as a user style, expect no clipping */
* {
  line-height: 1.5 !important;
  letter-spacing: 0.12em !important;
  word-spacing: 0.16em !important;
}
p { margin-bottom: 2em !important; }`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  For type scales, dyslexia-friendly fonts, and the research behind
                  these numbers, see the{" "}
                  <Link href="/guides/accessible-typography-wcag" className="text-blue-600 dark:text-blue-400 hover:underline">
                    accessible typography guide
                  </Link>
                  .
                </p>
              </div>
            </div>
          </section>

          {/* 7. Testing */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                7. Testing Cognitive Accessibility
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This is the area where{" "}
                  <strong className="text-slate-900 dark:text-white">
                    a green automated report means the least
                  </strong>
                  . A scanner cannot tell you whether your copy is clear or your flow
                  is simple. Use a layered approach instead:
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-1">
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Readability pass.
                    </strong>{" "}
                    Run your real copy through a Flesch-Kincaid or similar score to
                    flag long sentences and dense vocabulary. Treat it as a smoke
                    alarm, not proof of clarity.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Plain-language edit and the explain-it-back test.
                    </strong>{" "}
                    Read a screen, look away, and try to say what it asked you to do.
                    If you cannot, or you had to re-read, it is too complex.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      A cognitive walkthrough of key flows.
                    </strong>{" "}
                    Step through signup, checkout, and support looking specifically
                    for memory demands, re-entered information, surprise timeouts,
                    inconsistent components, jargon, and interrupting motion.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Usability testing with real users.
                    </strong>{" "}
                    The single most valuable step is moderated sessions with people
                    who have cognitive and learning disabilities. They surface
                    confusion no guideline predicts, and it is where you learn what
                    your product actually feels like to use.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      The COGA checklist.
                    </strong>{" "}
                    Work through the checklist that ships with the W3C{" "}
                    <em>Making Content Usable</em> document, objective by objective.
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Cognitive accessibility sits alongside the rest of your testing,
                  not instead of it. Combine it with a{" "}
                  <Link href="/guides/screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    screen reader pass
                  </Link>{" "}
                  and{" "}
                  <Link href="/guides/keyboard-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                    keyboard testing
                  </Link>
                  , and fold it into your overall{" "}
                  <Link href="/guides/how-to-audit-website-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                    accessibility audit
                  </Link>
                  .
                </p>
              </div>
            </div>
          </section>

          {/* Anti-patterns */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Common Cognitive Accessibility Mistakes &amp; How to Fix Them
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common cognitive accessibility anti-patterns, why they fail, and
                    the fix
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Anti-pattern</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Why it fails</th>
                      <th scope="col" className="px-4 py-3 font-semibold">The fix</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    {antiPatterns.map((row, i) => (
                      <tr key={i}>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                          {row.bad}
                        </th>
                        <td className="px-4 py-3 align-top">{row.why}</td>
                        <td className="px-4 py-3 align-top">{row.fix}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Checklist */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ListChecks className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                Cognitive Accessibility Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Plain language.</strong>{" "}
                  Short sentences, common words, active voice, one idea per
                  paragraph, and jargon defined; general copy targets a lower
                  secondary reading level.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Scannable structure.</strong>{" "}
                  Meaningful headings in a logical order, bullet lists, short
                  paragraphs, and the key point front-loaded.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Consistent everything.</strong>{" "}
                  Navigation, repeated components, and help appear in the same place
                  and are named the same way site-wide (3.2.3, 3.2.4, 3.2.6).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Meaningful link text.</strong>{" "}
                  No &ldquo;click here&rdquo;; the text says where it goes or what it
                  does.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Forgiving forms.</strong>{" "}
                  Clear labels and instructions up front, accepted formats shown,
                  inline help, and plain-word errors that say how to fix them.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">No memory tests.</strong>{" "}
                  Do not re-ask for information (3.3.7); allow paste and password
                  managers at login and support passkeys (3.3.8).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Enough time.</strong>{" "}
                  No surprise timeouts; warn, offer an extension, and save progress
                  (2.2.1).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Prevent and confirm.</strong>{" "}
                  Consequential actions get a review-and-confirm step, and important
                  information stays visible rather than relying on recall.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Protect attention.</strong>{" "}
                  No autoplaying motion or interrupting pop-ups; honor
                  prefers-reduced-motion; one clear primary action per screen.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Readable presentation.</strong>{" "}
                  Generous spacing, short line length, left-aligned text, icons with
                  labels, and content that survives the 1.4.12 text-spacing test.
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Then verify against the{" "}
                <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG 2.2 checklist
                </Link>{" "}
                and, above all, watch real people with cognitive disabilities use
                it.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Make Your Content Easier for Everyone
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Start with the WCAG 2.2 criteria that reduce cognitive load, then
                  run your real copy through a readability and structure check.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/wcag/3-3-8">
                      Accessible Authentication (3.3.8)
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link href="/guides/accessible-typography-wcag">
                      Typography &amp; Readability
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((item, i) => (
                  <details key={i} className="group border rounded-lg p-4 bg-card">
                    <summary className="cursor-pointer font-medium list-none flex items-center justify-between">
                      {item.question}
                      <span className="ml-2 text-muted-foreground group-open:rotate-180 transition-transform">
                        &#9662;
                      </span>
                    </summary>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* Related Content */}
          <section className="pb-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <RelatedContent
                content="cognitive accessibility plain language cognitive disability learning disability dyslexia adhd autism memory attention low literacy readability reading level flesch kincaid coga making content usable consistent help 3.2.6 redundant entry 3.3.7 accessible authentication 3.3.8 labels or instructions timing adjustable consistent navigation identification visual presentation text spacing error prevention forms typography wcag 2.2"
                title="Related Guides & Tools"
                maxItems={6}
                showDescriptions={true}
              />
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
