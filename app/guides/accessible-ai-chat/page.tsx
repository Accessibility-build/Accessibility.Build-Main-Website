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
import { PageByline } from "@/components/seo/page-byline"
import { GuideArticleSchema } from "@/components/seo/guide-article-schema"
import { clampDescription } from "@/lib/metadata"

const pageTitle = "Accessible AI Chat Interfaces & Conversational UI"
const pageDescription =
  "Build accessible AI chat and chatbot interfaces: announce streaming responses without flooding the screen reader, structure the message log, keep focus in the composer, make Send, Stop, and per-message actions keyboard-operable, and render AI output as semantic HTML. Mapped to WCAG 2.2 (4.1.3, 2.1.1, 1.3.1) with copy-ready React."

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "accessible ai chat",
    "accessible chatbot",
    "conversational ui accessibility",
    "ai chat accessibility",
    "chatbot accessibility",
    "streaming response accessibility",
    "aria-live chat",
    "role log chat",
    "accessible chat interface",
    "screen reader chatbot",
    "accessible ai assistant",
    "ai chat wcag",
    "live region streaming",
    "accessible llm interface",
    "chatbot screen reader",
    "accessible conversational ai",
    "ai ui accessibility",
    "chat focus management",
  ],
  alternates: {
    canonical: "/guides/accessible-ai-chat",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/accessible-ai-chat",
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
    name: "Accessible AI Chat Interfaces",
    url: "https://accessibility.build/guides/accessible-ai-chat",
  },
]

const faqs = [
  {
    question: "What makes an AI chat interface hard to make accessible?",
    answer:
      "A normal form is static: the screen reader reads it once and the user works through it. An AI chat interface narrates itself over time. Text streams in one token at a time, the assistant shows a thinking or typing state, responses arrive asynchronously, and the whole transcript is a live, growing log. Each of those behaviors has an accessibility failure mode. The most common mistake is wrapping the streaming output in an aria-live region, which makes the screen reader stutter through every partial word. The reliable approach is to treat the interface as three separate parts, each with its own contract: the message log the user reads and navigates, a small status region that announces state changes politely, and the composer where the user types. Get those three boundaries right and most of the difficulty disappears.",
  },
  {
    question: "How do I announce a streaming AI response to a screen reader?",
    answer:
      "Do not announce every chunk. If you point aria-live at the node that receives streaming tokens, the screen reader tries to speak each update and produces a garbled stream of half-words. Instead, update the visible message node silently while it streams, then announce the finished response once. For a short reply you can place the completed text into a dedicated visually hidden polite live region so it is read in full. For a long reply, announce something concise such as \"Response complete\" and let the user move to the message with their screen reader to read it at their own pace. Reserve assertive announcements for errors. Also give the transcript a stable structure (a log or a navigable list) so the user can always go back and read what was said.",
  },
  {
    question: "Should the chat use aria-live=\"polite\" or aria-live=\"assertive\"?",
    answer:
      "Polite for almost everything. A polite live region waits until the screen reader is idle before speaking, so it will not cut the user off mid-sentence while they read or type. Use it for the assistant’s responses, the “responding” and “complete” status, and non-urgent notices. Reserve assertive, which interrupts immediately, for genuinely urgent messages such as an error that stops the user from continuing. Overusing assertive is a common accessibility failure because it makes the interface feel like it is shouting and it clobbers whatever the user was listening to.",
  },
  {
    question: "What ARIA role should the chat transcript use?",
    answer:
      "role=\"log\" is the closest fit. It marks a region where new content is added over time and reading order is meaningful, and it carries an implicit aria-live of polite with aria-relevant set to additions, so screen readers announce new entries but not changes to old ones. It works best when you append each complete message as a new element rather than mutating an existing one, which is why it pairs well with the announce-on-complete pattern. If you would rather control announcements yourself, use a plain semantic structure (an ordered list of messages) that the user can navigate, and drive announcements from a separate visually hidden polite region. role=\"feed\" is a different pattern meant for an infinitely scrolling stream of articles, not for a turn-by-turn conversation.",
  },
  {
    question: "Where should keyboard focus go after I send a message?",
    answer:
      "Keep it in the composer. A frequent bug is moving focus to the streaming response, which yanks a keyboard or screen reader user out of the input and drops them into text that is still changing. Leave focus in the textarea so the user can immediately type again, and let the status region announce that a response is arriving. Provide an explicit way to jump to the latest response for users who do want to read it right away, such as a “Go to latest response” control or letting them navigate the log with their screen reader. The rule is that focus moves only when the user asks it to, never because content updated on its own.",
  },
  {
    question: "Does WCAG apply to chatbots and AI assistants?",
    answer:
      "Yes. A chat interface on a website is web content, so all of WCAG applies directly, and a chat feature inside a native app is covered through WCAG2ICT, the W3C note that maps the guidelines onto non-web software. The criteria that bite hardest are 4.1.3 Status Messages (announcing streaming and state without moving focus), 2.1.1 Keyboard (send, stop, regenerate, and copy all operable without a mouse), 1.3.1 Info and Relationships (who said what, and the structure of rendered output), and 2.4.3 Focus Order. Beyond WCAG, the same laws that govern the rest of a product reach its AI features: the ADA in the United States, the European Accessibility Act, and Section 508 for federal contexts all measure against WCAG Level AA.",
  },
  {
    question: "How do I make AI-generated markdown output accessible?",
    answer:
      "Render it, do not dump it. Convert the model’s markdown into real semantic HTML so headings become heading elements, lists become list elements, code becomes pre and code with a language label and a keyboard-reachable copy button, and tables get proper header cells. Sanitize the HTML before inserting it to avoid injection. The subtler problem is that the model can produce content that is inaccessible even when your rendering is perfect: images described only as “image,” tables with no headers, or links that say “click here.” Treat AI-written alt text and structure as a draft to review, not as finished output, and prefer prompting the model to produce descriptive link text and meaningful alt text in the first place.",
  },
  {
    question: "Can I use a chat UI library and still be accessible?",
    answer:
      "A library can do a lot of the heavy lifting for streaming and markdown rendering, but it does not make your interface accessible on its own. Whatever you use, you still own the accessibility contract: a labeled composer and Send button, a keyboard-reachable Stop control while a response streams, focus that stays in the composer, a message log that identifies each speaker, and a status region that announces state without stealing focus. Audit any component or SDK the way you would audit your own code: turn on a screen reader, send a message, and listen to what happens while the response streams and after it finishes. If it announces every token, or if focus jumps to the output, you have work to do regardless of the library’s marketing.",
  },
]

const antiPatterns = [
  {
    bad: 'aria-live on the node that receives streaming tokens.',
    why: "The screen reader tries to speak every partial update and produces a stutter of half-words (WCAG 4.1.3).",
    fix: "Update the visible node silently; announce the finished message once through a dedicated polite region.",
  },
  {
    bad: "Moving focus to the response when it starts or finishes.",
    why: "Keyboard and screen reader users are yanked out of the composer into text that is still changing (2.4.3).",
    fix: 'Keep focus in the composer; add a "Go to latest response" control for users who want it.',
  },
  {
    bad: "Icon-only Send, Stop, copy, and regenerate buttons with no name.",
    why: 'The screen reader announces "button" with no purpose (4.1.2, 1.1.1).',
    fix: "Give every control a text name (aria-label or visible label) and expose its state.",
  },
  {
    bad: "Per-message copy or regenerate toolbar that appears only on :hover.",
    why: "There is no hover for keyboard or touch users, so the actions are unreachable and cannot be dismissed (1.4.13, 2.1.1).",
    fix: "Reveal the toolbar on focus as well, keep it in the tab order, and let Escape dismiss it.",
  },
  {
    bad: "Hiding Stop generating behind hover, or removing it from the tab order while streaming.",
    why: "A keyboard user cannot interrupt a long or wrong response, which can also become a timing barrier (2.1.1, 2.2.1).",
    fix: "Keep Stop focusable and announced the entire time a response is streaming.",
  },
  {
    bad: "Rendering the model’s markdown as one plain text blob or raw string.",
    why: "Headings, lists, code, and tables lose their semantics, and AI-written alt text is trusted blindly (1.3.1, 1.1.1).",
    fix: "Render to sanitized semantic HTML; review AI-generated alt text and structure before shipping.",
  },
]

export default function AccessibleAiChatGuidePage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <GuideArticleSchema route="/guides/accessible-ai-chat" title={pageTitle} description={pageDescription} datePublished="2026-08-06" />
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
                    Accessible AI Chat
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
                Implementation Guide
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                Accessible AI Chat Interfaces &amp; Conversational UI
              </h1>
              <PageByline route="/guides/accessible-ai-chat" className="mb-5" />
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                An AI chat interface breaks accessibility in ways an ordinary
                form never does, because it narrates itself over time: text
                streams in token by token, the assistant &ldquo;thinks,&rdquo;
                responses arrive on their own schedule, and the transcript is a
                live, growing log. This guide shows how to announce streaming
                responses without flooding the screen reader, structure the
                message log, keep focus where it belongs, and render AI output as
                real semantic HTML. Everything is mapped to WCAG 2.2, with
                copy-ready React.
              </p>
            </div>
          </section>

          {/* Why AI chat is different */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Why AI Chat Breaks Accessibility Differently
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The user needs are the same ones you already know: a blind
                  person using a screen reader, someone navigating by keyboard, a
                  user who enlarges text or reduces motion. What makes a chat
                  interface hard is that it is not a document the screen reader
                  reads once. It is a stream of events. Understanding the interface
                  as{" "}
                  <strong className="text-slate-900 dark:text-white">
                    three moving parts, each with its own job
                  </strong>
                  , is what turns an intimidating problem into a set of small,
                  solvable ones:
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-1">
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      The message log
                    </strong>{" "}
                    is the transcript the user reads and navigates. It needs a
                    clear structure and a way to tell who said what.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      The status region
                    </strong>{" "}
                    is a small, usually invisible area that announces state
                    changes (responding, complete, error) politely, without ever
                    moving focus.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      The composer
                    </strong>{" "}
                    is where the user types and sends, and where Stop, regenerate,
                    and copy controls live. It must be fully keyboard operable and
                    keep focus after a send.
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The single biggest mistake teams make is treating the streaming
                  response as something to shout at the screen reader. Point{" "}
                  <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                    aria-live
                  </Link>{" "}
                  at the element that receives tokens and the screen reader will
                  try to speak every partial update, producing a stutter of
                  half-words that is worse than silence. The reliable pattern,
                  covered in detail below, is to let the text appear silently while
                  it streams and to announce the finished message once. Get the
                  boundary between &ldquo;show&rdquo; and &ldquo;announce&rdquo;
                  right and the rest is ordinary component accessibility.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  One assumption to drop early: that WCAG does not apply because
                  &ldquo;it is AI.&rdquo; A chat feature on a website is web
                  content, and a chat feature in a native app is covered by{" "}
                  <strong className="text-slate-900 dark:text-white">
                    WCAG2ICT
                  </strong>
                  . The{" "}
                  <Link href="/compliance/eaa" className="text-blue-600 dark:text-blue-400 hover:underline">
                    European Accessibility Act
                  </Link>
                  , the ADA, and{" "}
                  <Link href="/compliance/section-508" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Section 508
                  </Link>{" "}
                  all reach the AI features in your product, measured against WCAG
                  2.2 Level AA. This guide is the build layer; for the wider
                  picture of how AI is changing accessibility work, see the{" "}
                  <Link href="/guides/ai-accessibility-audit" className="text-blue-600 dark:text-blue-400 hover:underline">
                    AI accessibility audit guide
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
                The WCAG 2.2 Criteria AI Chat Breaks Most
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria most commonly failed by AI chat and
                    chatbot interfaces, their conformance level, and what each
                    requires in a conversational UI
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
                        What it requires in a chat UI
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.3 Status Messages
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Announce responding, complete, and error states through a live region without moving focus. The one that defines chat accessibility.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.1 Keyboard
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Send, Stop generating, regenerate, copy, and scrolling the transcript all work without a mouse.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.2 Name, Role, Value
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Every control has a name and exposes its state; each message identifies its sender.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.3.1 Info and Relationships
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Who said what, and the structure of rendered output (headings, lists, code), live in the markup, not just the visuals.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.3 Focus Order
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Focus stays in the composer and is never yanked to streaming output.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-2-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.2.1 Timing Adjustable
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Session and response timeouts do not cut users off; long generations can be stopped.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-13" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.13 Content on Hover or Focus
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Per-message action toolbars that appear on hover are also keyboard reachable and dismissible.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.3 Contrast (Minimum)
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Chat bubbles, placeholder and typing text, and disabled Send states meet 4.5:1.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4 text-sm">
                For the full list, see the{" "}
                <Link
                  href="/guides/wcag-2-2-aa-requirements"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  WCAG 2.2 Level AA requirements
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

          {/* 1. Three moving parts */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                1. The Three Moving Parts of an Accessible Chat
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Before any code, fix the mental model. A chat interface is not
                  one widget; it is three regions that behave differently and must
                  not be confused with each other. Most chat accessibility bugs
                  come from letting one region do another&rsquo;s job, most often
                  making the message log try to announce itself while it changes.
                </p>
                <div className="grid gap-4 sm:grid-cols-3 not-prose my-4">
                  <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-950">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                      Message log
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      The transcript. A structured, navigable list of turns where
                      each message says who sent it. The user reads and re-reads it
                      at their own pace; it does not chase them with speech.
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-950">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                      Status region
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      A small, usually visually hidden{" "}
                      <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                        live region
                      </Link>{" "}
                      that speaks state: &ldquo;Assistant is responding,&rdquo;
                      &ldquo;Response complete,&rdquo; &ldquo;Something went
                      wrong.&rdquo; Polite, and it never moves focus.
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-950">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                      Composer
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      The labeled input, the Send button, and the Stop, regenerate,
                      and copy controls. Fully keyboard operable, and it keeps
                      focus after the user sends.
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The rest of this guide works through each part in turn, starting
                  with the one that trips up almost everyone.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Streaming */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                2. Streaming Responses Without Flooding the Screen Reader
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-2 mb-3">
                  The token-flood anti-pattern
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The instinct is to make the streaming reply &ldquo;live&rdquo; so
                  a screen reader user hears it. So the streaming text node gets an{" "}
                  <code>aria-live=&quot;polite&quot;</code> (or worse,{" "}
                  <code>assertive</code>) and every token that arrives mutates it.
                  The result is not helpful narration; it is a stream of partial,
                  overlapping fragments as the region changes dozens of times a
                  second. Screen readers were built to announce a change once it
                  settles, not to keep pace with a typewriter.
                </p>
                <div className="not-prose rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-4 my-4">
                  <p className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2">
                    Do not do this
                  </p>
                  <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto">
                    <pre className="p-4 text-sm text-slate-100"><code>{`<!-- Every token mutates a live region: the screen reader stutters -->
<div aria-live="assertive">
  The quick bro
</div>
<!-- ...next tick: "The quick brown fo" ...next tick: "The quick brown fox" -->`}</code></pre>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Announce the finished message, not every chunk
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Separate the two things you are actually trying to do. Sighted
                  users benefit from seeing text appear as it streams, so keep that{" "}
                  <strong className="text-slate-900 dark:text-white">visible</strong>{" "}
                  update. Screen reader users benefit from hearing the response
                  once it is coherent, so make the{" "}
                  <strong className="text-slate-900 dark:text-white">announcement</strong>{" "}
                  happen a single time, when the response completes. Concretely:
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-1">
                  <li>
                    Stream tokens into the visible message node, which is{" "}
                    <strong className="text-slate-900 dark:text-white">not</strong>{" "}
                    a live region, so nothing is announced while it changes.
                  </li>
                  <li>
                    Keep a separate, visually hidden{" "}
                    <code>aria-live=&quot;polite&quot;</code> status region that is
                    always in the DOM.
                  </li>
                  <li>
                    When the stream finishes, write to that region once. For a
                    short reply, write the full text so it is read aloud. For a long
                    reply, write a concise cue such as &ldquo;Response
                    complete&rdquo; and let the user navigate the log to read it.
                  </li>
                </ul>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<!-- Visible transcript: updates silently as tokens stream in -->
<div class="assistant-message">The quick brown fox...</div>

<!-- Dedicated status region: written to ONCE, when done -->
<div aria-live="polite" class="sr-only" id="chat-status"></div>
<!-- on completion, JS sets: chatStatus.textContent = "Response complete" -->`}</code></pre>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Polite by default, assertive only for errors
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A{" "}
                  <strong className="text-slate-900 dark:text-white">polite</strong>{" "}
                  region waits for the screen reader to be idle before speaking, so
                  it will not interrupt the user while they read or type. Use it for
                  responses and normal status. Reserve{" "}
                  <strong className="text-slate-900 dark:text-white">assertive</strong>
                  , which barges in immediately, for messages the user must hear
                  right now, such as an error that halts the conversation.
                  Overusing assertive is itself an accessibility failure: it makes
                  the interface feel like it is shouting and it clobbers whatever
                  the user was listening to. The full behavior of both is covered in{" "}
                  <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                    4.1.3 Status Messages
                  </Link>
                  .
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  One more detail that catches people out: to re-announce a message
                  with the same text (for example, a repeated &ldquo;Response
                  complete&rdquo;), you often have to clear the region first and set
                  the text on the next tick, because a live region only announces a{" "}
                  <em>change</em>. The same trick appears in the{" "}
                  <Link href="/guides/accessible-form-validation" className="text-blue-600 dark:text-blue-400 hover:underline">
                    accessible form validation guide
                  </Link>{" "}
                  for repeated error messages.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Message log */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                3. Structuring the Message Log
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-2 mb-3">
                  role=&quot;log&quot; vs a plain list vs role=&quot;feed&quot;
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  There are two solid ways to build the transcript, and one common
                  wrong turn.
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-1">
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      role=&quot;log&quot;
                    </strong>{" "}
                    marks a region where entries are added over time and order
                    matters. It carries an implicit polite live setting with{" "}
                    <code>aria-relevant=&quot;additions&quot;</code>, so screen
                    readers announce new entries but not edits to old ones. It works
                    best when you append each{" "}
                    <strong className="text-slate-900 dark:text-white">complete</strong>{" "}
                    message as a new element, which pairs naturally with the
                    announce-on-complete approach from section 2.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      A plain semantic list
                    </strong>{" "}
                    (an ordered list of messages) that is{" "}
                    <strong className="text-slate-900 dark:text-white">not</strong>{" "}
                    a live region, paired with your own status region, gives you the
                    most control: nothing is announced automatically, and you decide
                    exactly what the status region says and when.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      role=&quot;feed&quot;
                    </strong>{" "}
                    is the wrong turn here. It is designed for an infinitely
                    scrolling stream of articles with its own Page Up and Page Down
                    model, not for a turn-by-turn conversation. Reach for it only if
                    you are building an actual article feed.
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you use <code>role=&quot;log&quot;</code> and also stream tokens
                  into the last entry, you reintroduce the token flood, because the
                  log will announce that entry changing. Either append whole messages
                  to the log, or keep the log non-live and drive announcements from
                  the status region. Do not do both.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Marking who said what
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Color and alignment tell a sighted user which side sent a message.
                  A screen reader user gets none of that, so the sender has to be in
                  the markup (
                  <Link href="/wcag/1-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.3.1
                  </Link>
                  ). The lightest reliable technique is a visually hidden label at
                  the start of each message. Avoid turning every message into a
                  heading, which would bloat the page&rsquo;s heading outline and
                  make heading navigation useless.
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<ol class="transcript" aria-label="Conversation">
  <li>
    <span class="sr-only">You said:</span>
    <div class="bubble user">How do I center a div?</div>
  </li>
  <li>
    <span class="sr-only">Assistant said:</span>
    <div class="bubble assistant">Use display: grid; place-items: center;</div>
  </li>
</ol>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The <code>sr-only</code> label reads &ldquo;You said&rdquo; or
                  &ldquo;Assistant said&rdquo; before each turn so the conversation
                  makes sense linearly. If you make each message an{" "}
                  <code>&lt;article&gt;</code> with an accessible name instead, the
                  screen reader can also jump between turns; either approach is fine
                  as long as the sender is programmatically present.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Focus management */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                4. Focus Management in a Chat
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The governing rule is simple:{" "}
                  <strong className="text-slate-900 dark:text-white">
                    focus moves only when the user asks it to
                  </strong>
                  , never because content updated on its own (
                  <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.4.3
                  </Link>
                  ). In a chat that means:
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-1">
                  <li>
                    After the user sends, leave focus in the composer so they can
                    keep typing. Do not move it to the response.
                  </li>
                  <li>
                    Do not steal focus when the response starts or finishes. The
                    status region tells the user it arrived; that is enough.
                  </li>
                  <li>
                    Give users who <em>do</em> want to read the reply immediately an
                    explicit way to get there, such as a &ldquo;Go to latest
                    response&rdquo; button that moves focus to the newest message,
                    or a skip link into the transcript. Because they triggered it,
                    moving focus is now correct.
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Auto-scrolling deserves the same discipline. Pinning the
                  transcript to the bottom as new tokens arrive is fine while the
                  user is already at the bottom, but if they have scrolled up to
                  re-read something, do not drag them back down; that is
                  disorienting and can make content impossible to read. Detect
                  whether the user is at the bottom and only auto-scroll then. For
                  the underlying focus techniques (roving tabindex, restoration,{" "}
                  <code>tabindex=&#123;-1&#125;</code> targets), see the{" "}
                  <Link href="/guides/focus-management" className="text-blue-600 dark:text-blue-400 hover:underline">
                    focus management guide
                  </Link>
                  .
                </p>
              </div>
            </div>
          </section>

          {/* 5. Composer */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                5. The Composer: Input, Send, Stop &amp; Per-Message Actions
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The composer is an ordinary form, and it should be built like one.
                  The message box needs a real label (a visible one is best; a{" "}
                  visually hidden <code>&lt;label&gt;</code> is the minimum), and
                  Send must be a real <code>&lt;button&gt;</code> with a text name,
                  not a bare icon <code>&lt;div&gt;</code>. Everything in the{" "}
                  <Link href="/guides/accessible-forms" className="text-blue-600 dark:text-blue-400 hover:underline">
                    accessible forms guide
                  </Link>{" "}
                  applies.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Enter to send, Shift+Enter for a new line
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The common convention is that{" "}
                  <strong className="text-slate-900 dark:text-white">Enter</strong>{" "}
                  sends and{" "}
                  <strong className="text-slate-900 dark:text-white">
                    Shift+Enter
                  </strong>{" "}
                  inserts a new line. That is a reasonable default, but it is a
                  convention, not something users can see, so a{" "}
                  <strong className="text-slate-900 dark:text-white">
                    visible Send button is required
                  </strong>
                  : keyboard-only and screen reader users, and anyone on a phone,
                  need a control they can find and activate. Do not make a hidden
                  Enter handler the only way to send.
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<form>
  <label for="composer" class="sr-only">Message the assistant</label>
  <textarea id="composer" rows="1"
            placeholder="Ask anything..."></textarea>

  <!-- A real button with a real name, not an icon-only div -->
  <button type="submit">Send</button>
</form>`}</code></pre>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Stop, regenerate, and copy
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  While a response streams, a{" "}
                  <strong className="text-slate-900 dark:text-white">
                    Stop generating
                  </strong>{" "}
                  control must be present, focusable, and named, so a keyboard user
                  can interrupt a long or wrong answer. Hiding it behind hover or
                  removing it from the tab order fails both{" "}
                  <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.1.1 Keyboard
                  </Link>{" "}
                  and, for very long generations,{" "}
                  <Link href="/wcag/2-2-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.2.1 Timing Adjustable
                  </Link>
                  . Per-message actions (copy, regenerate, thumbs up or down) are
                  frequently revealed only on hover; that leaves out keyboard and
                  touch users. Reveal them on focus as well, keep them in the tab
                  order, and let Escape dismiss any transient popover, per{" "}
                  <Link href="/wcag/1-4-13" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.13 Content on Hover or Focus
                  </Link>
                  . Give each icon control a name:{" "}
                  <code>aria-label=&quot;Copy response&quot;</code>,{" "}
                  <code>aria-label=&quot;Regenerate response&quot;</code>.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When Copy succeeds, confirm it in the status region
                  (&ldquo;Copied to clipboard&rdquo;) rather than only swapping the
                  icon, so the confirmation is not conveyed by a visual change
                  alone.
                </p>
              </div>
            </div>
          </section>

          {/* 6. Status and thinking */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                6. Status, &ldquo;Thinking&rdquo; &amp; Loading States
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The animated three-dot &ldquo;typing&rdquo; indicator is a purely
                  visual signal. On its own it tells a screen reader user nothing,
                  and a bare <code>aria-busy=&quot;true&quot;</code> spinner usually
                  announces nothing useful either. Drive the state through the same
                  polite status region you use for completion, and keep the wording
                  terse so you are not narrating a play-by-play:
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-1">
                  <li>
                    On send: &ldquo;Assistant is responding&rdquo; (once, not
                    repeatedly).
                  </li>
                  <li>On completion: &ldquo;Response complete.&rdquo;</li>
                  <li>On failure: an error, which may warrant assertive.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you show an animated indicator, respect{" "}
                  <code>prefers-reduced-motion</code> and provide a non-animated
                  fallback, and make sure the indicator&rsquo;s text (if any) meets{" "}
                  <Link href="/wcag/1-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                    contrast
                  </Link>{" "}
                  requirements; faint gray dots on white frequently do not. The
                  point is that state changes are perceivable in more than one way:
                  something visible <em>and</em> something announced.
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`/* Honor reduced-motion for the typing indicator */
@media (prefers-reduced-motion: reduce) {
  .typing-indicator .dot {
    animation: none;
  }
}`}</code></pre>
                </div>
              </div>
            </div>
          </section>

          {/* 7. Rendering AI output */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                7. Rendering AI Output as Accessible HTML
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Models return Markdown. If you drop that Markdown into the page as
                  a single block of text, you throw away all of its structure: a{" "}
                  screen reader user cannot jump by heading, list items are not a
                  list, and code is indistinguishable from prose. Render the
                  Markdown to{" "}
                  <strong className="text-slate-900 dark:text-white">
                    real semantic HTML
                  </strong>{" "}
                  so the structure survives (
                  <Link href="/wcag/1-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.3.1
                  </Link>
                  ):
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-1">
                  <li>
                    Headings become{" "}
                    <code>&lt;h3&gt;</code>/<code>&lt;h4&gt;</code> at a level that
                    fits the surrounding page outline, not an <code>&lt;h1&gt;</code>{" "}
                    inside a message.
                  </li>
                  <li>
                    Lists become <code>&lt;ul&gt;</code>/<code>&lt;ol&gt;</code>,
                    tables get real <code>&lt;th scope&gt;</code> header cells.
                  </li>
                  <li>
                    Code becomes <code>&lt;pre&gt;&lt;code&gt;</code> with a
                    language label and a keyboard-reachable, named copy button.
                  </li>
                  <li>
                    Links use their real text; never render &ldquo;click
                    here&rdquo; when the Markdown gave you a real label.
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Because you are injecting model-generated HTML,{" "}
                  <strong className="text-slate-900 dark:text-white">
                    sanitize it
                  </strong>{" "}
                  before it reaches the DOM to prevent script injection.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The subtler problem is that the model can generate content that is
                  inaccessible even when your rendering is flawless. It may describe
                  an image only as &ldquo;image,&rdquo; emit a table with no header
                  row, or write a link labeled &ldquo;here.&rdquo; A checker will
                  pass the markup while the meaning is missing, which is the
                  semantic gap that automated tools cannot catch. Treat AI-written{" "}
                  <strong className="text-slate-900 dark:text-white">alt text and structure as a draft</strong>
                  : review it, and prompt the model to produce descriptive link text
                  and meaningful alternatives in the first place. The{" "}
                  <Link href="/guides/ai-accessibility-audit" className="text-blue-600 dark:text-blue-400 hover:underline">
                    AI accessibility audit guide
                  </Link>{" "}
                  goes deeper on where AI helps and where it quietly does not.
                </p>
              </div>
            </div>
          </section>

          {/* 8. Timeouts and errors */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                8. Timeouts, Errors &amp; Long Generations
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  AI responses can take a long time, and things go wrong on the
                  network. Both are accessibility concerns, not just UX polish.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <strong className="text-slate-900 dark:text-white">
                    Timing (2.2.1).
                  </strong>{" "}
                  If a chat session or an authentication token expires, do not
                  silently drop the user or discard their unsent message. Warn
                  before a timeout and let them extend it, and preserve the draft in
                  the composer so a re-login does not erase what they typed. A long
                  generation should always be interruptible with the Stop control
                  from section 5, so no one is forced to wait out a response they do
                  not want. See{" "}
                  <Link href="/wcag/2-2-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.2.1 Timing Adjustable
                  </Link>
                  .
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <strong className="text-slate-900 dark:text-white">
                    Errors (4.1.3).
                  </strong>{" "}
                  When a request fails, announce it through a live region rather than
                  only flashing a red banner, and describe the recovery: &ldquo;The
                  response failed to send. Try again.&rdquo; A network error that
                  blocks the user is a reasonable case for an assertive
                  announcement. Make the Retry action a real, named, keyboard
                  reachable button, and keep the user&rsquo;s message so retrying
                  does not mean retyping.
                </p>
              </div>
            </div>
          </section>

          {/* 9. React */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                9. React: A Minimal Accessible Chat
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This sketch wires up the three parts. The transcript is a plain
                  list (not a live region), a dedicated <code>status</code> string
                  feeds a visually hidden polite region, tokens stream into the
                  visible message silently, and focus returns to the composer when
                  the response completes. It uses the announce-on-complete pattern
                  so the screen reader never hears a token flood.
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`function Chat() {
  const [messages, setMessages] = useState([])
  const [status, setStatus] = useState("")   // drives the polite region
  const [streaming, setStreaming] = useState(false)
  const inputRef = useRef(null)

  async function send(text) {
    setMessages((m) => [...m, { role: "user", text }])
    setMessages((m) => [...m, { role: "assistant", text: "" }])
    setStreaming(true)
    setStatus("Assistant is responding")

    let full = ""
    for await (const chunk of streamReply(text)) {
      full += chunk
      // Update the VISIBLE assistant message only. No announcement.
      setMessages((m) => replaceLast(m, { role: "assistant", text: full }))
    }

    setStreaming(false)
    setStatus("Response complete")   // announced ONCE, politely
    inputRef.current?.focus()        // focus returns to the composer
  }

  function handleSubmit(e) {
    e.preventDefault()
    const text = inputRef.current.value.trim()
    if (text) { inputRef.current.value = ""; send(text) }
  }

  return (
    <section aria-label="Chat with the assistant">
      {/* Transcript: navigable, NOT a live region */}
      <ol className="transcript" aria-label="Conversation">
        {messages.map((m, i) => (
          <li key={i}>
            <span className="sr-only">
              {m.role === "user" ? "You said:" : "Assistant said:"}
            </span>
            <MessageBody text={m.text} />
          </li>
        ))}
      </ol>

      {/* Dedicated status region: state only, never steals focus */}
      <div aria-live="polite" className="sr-only">{status}</div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="composer" className="sr-only">
          Message the assistant
        </label>
        <textarea id="composer" ref={inputRef} rows={1} />
        <button type="submit">Send</button>
        {streaming && (
          <button type="button" onClick={stopGenerating}>
            Stop generating
          </button>
        )}
      </form>
    </section>
  )
}`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <code>MessageBody</code> is where you render sanitized Markdown to
                  semantic HTML (section 7). A production build would add per-message
                  copy and regenerate controls, error handling, and reduced-motion
                  support, but the accessibility spine is here: a labeled composer, a
                  keyboard reachable Stop, a non-live transcript that names each
                  speaker, and a single polite announcement on completion.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Libraries such as streaming AI SDKs and prebuilt chat components
                  can save you the plumbing, but they do not remove this
                  contract. Whatever you adopt, audit it the same way: turn on a
                  screen reader, send a message, and listen while the response
                  streams and after it finishes. If you hear every token, or focus
                  jumps to the output, fix it. For the framework specifics of live
                  regions and focus in React, see the{" "}
                  <Link href="/guides/react-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                    React accessibility guide
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
                Common AI Chat Mistakes &amp; How to Fix Them
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common AI chat and chatbot accessibility anti-patterns, why they
                    fail, and the fix
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
                          <code>{row.bad}</code>
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
                Accessible AI Chat Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Streaming announced once.</strong>{" "}
                  Tokens update the visible node silently; a dedicated polite region
                  announces the finished response, never every chunk.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Focus stays put.</strong>{" "}
                  Focus remains in the composer after send and never jumps to the
                  response; a &ldquo;Go to latest response&rdquo; control exists.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Log is structured.</strong>{" "}
                  Each message names its sender in the markup; the transcript is a{" "}
                  <code>role=&quot;log&quot;</code> or a navigable list, not a heading dump.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Composer is labeled.</strong>{" "}
                  The message box has a label and Send is a real, named button;
                  Enter and Shift+Enter behavior is not the only way to send.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Stop is reachable.</strong>{" "}
                  Stop generating is focusable and named the entire time a response
                  streams.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Status is spoken.</strong>{" "}
                  Responding, complete, copied, and error states go through a live
                  region; assertive is reserved for genuine errors.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Actions work on focus.</strong>{" "}
                  Copy, regenerate, and feedback controls appear on focus as well as
                  hover, stay in the tab order, and are dismissible (1.4.13).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Output is semantic.</strong>{" "}
                  Markdown renders to headings, lists, code, and tables; HTML is
                  sanitized; AI-written alt text and structure are reviewed.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Timing is forgiving.</strong>{" "}
                  Session timeouts warn and extend; long generations can be stopped;
                  the draft survives a re-login.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Contrast &amp; motion.</strong>{" "}
                  Bubbles, typing text, and disabled states meet 4.5:1; the typing
                  animation respects <code>prefers-reduced-motion</code>.
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Then run the whole thing past the{" "}
                <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG 2.2 checklist
                </Link>{" "}
                and a real{" "}
                <Link href="/guides/screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                  screen reader testing
                </Link>{" "}
                pass.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Ship an AI Feature Everyone Can Use
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Test your chat with a screen reader on, send a message, and listen
                  while it streams. Then work through the status-message and
                  keyboard requirements below to close the gaps.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/wcag/4-1-3">
                      Status Messages (4.1.3)
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link href="/guides/ai-accessibility-audit">
                      AI Accessibility Audit
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
                content="accessible ai chat chatbot conversational ui streaming response aria-live polite assertive role log status messages 4.1.3 keyboard 2.1.1 name role value 4.1.2 info and relationships 1.3.1 focus order 2.4.3 timing 2.2.1 content on hover or focus 1.4.13 live region screen reader message log composer stop generating markdown rendering react accessibility ai audit"
                title="Related Guides & Tools"
                maxItems={6}
                showDescriptions={true}
                excludeUrl="/guides/accessible-ai-chat"
              />
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
