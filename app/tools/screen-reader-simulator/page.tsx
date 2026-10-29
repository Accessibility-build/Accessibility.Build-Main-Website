import type { Metadata } from "next"
import Link from "next/link"
import ScreenReaderSimulator from "@/components/tools/screen-reader-simulator"
import { BreadcrumbStructuredData, HowToStructuredData, ToolStructuredData } from "@/components/seo/structured-data"
import { FaqSection } from "@/components/seo/faq-section"
import { RelatedContent } from "@/components/seo/related-content"
import { clampDescription } from "@/lib/metadata"

const ROUTE = "/tools/screen-reader-simulator"
const pageTitle = "Screen Reader Simulator: Preview What a Page Announces"
const pageDescription =
  "Enter a page address and read what a screen reader would come across, line by line, built from Chrome's accessibility tree. Lists the headings, landmarks, links, fields, images and buttons, and flags missing names, vague links and skipped headings."

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "screen reader simulator",
    "screen reader preview",
    "screen reader emulator",
    "what does a screen reader read",
    "test website with screen reader",
    "accessibility tree viewer",
    "headings outline checker",
    "link text checker",
    "landmark checker",
    "WCAG 4.1.2 name role value",
    "WCAG 2.4.4 link purpose",
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
        url: `/api/og?title=${encodeURIComponent("Screen Reader Simulator")}&section=Free tool`,
        width: 1200,
        height: 630,
        alt: "Screen reader simulator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: clampDescription(pageDescription),
    images: [`/api/og?title=${encodeURIComponent("Screen Reader Simulator")}&section=Free tool`],
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" },
  { name: "Screen Reader Simulator", url: `https://accessibility.build${ROUTE}` },
]

const FAQS = [
  {
    question: "Is this the same as using NVDA, JAWS, VoiceOver or TalkBack?",
    answer:
      "No. It is a preview built from Chrome's accessibility tree, the same data screen readers start from, written out in plain wording. NVDA, JAWS, VoiceOver and TalkBack each phrase roles and states their own way, decide for themselves what to read in browse mode, and have their own settings for punctuation, verbosity and tables. VoiceOver usually runs with Safari, whose tree differs from Chrome's in places. Use the preview to find problems quickly, then confirm them with a real screen reader.",
  },
  {
    question: "Where does the transcript come from?",
    answer:
      "We load the page in headless Chrome, scroll it so lazy sections load, and read the full accessibility tree through the Chrome DevTools Protocol. That tree holds each element's role, accessible name and states, which is what Chrome passes to screen readers through the operating system. The tool walks it in reading order and writes one line per stop, for example 'heading level 2, Pricing' or 'button, Menu, collapsed'.",
  },
  {
    question: "Why is something I can see on the page missing from the transcript?",
    answer:
      "Usually because it is hidden from assistive technology, with aria-hidden or a role of presentation, or because it is a CSS background image. Content inside an iframe is not included, and anything that only appears after a click, such as a closed menu or an unopened tab, is read in its closed state. If visible text is missing and it is not in a frame, look for aria-hidden on it or on a parent.",
  },
  {
    question: "Why does every line of a card start with 'link'?",
    answer:
      "When one link wraps a heading, a summary and a date, screen readers read each part as part of that link, so every line of it is marked as link. The heading still appears in the headings list. A link that only wraps text is announced once, with its name, and the text inside it is not read again.",
  },
  {
    question: "Does link text such as 'read more' always fail WCAG?",
    answer:
      "Not always. 2.4.4 Link Purpose (In Context), Level A, allows the purpose to come from the sentence, list item, table cell or heading around the link. It is flagged because screen reader users often move through a list of links, where that context is gone and the list reads 'read more, read more, read more'. 2.4.9 Link Purpose (Link Only), Level AAA, needs the link text to make sense on its own.",
  },
  {
    question: "Will the speech clash with my own screen reader?",
    answer:
      "It should not. Speech uses your browser's built-in voices and only starts when you press Play. The transcript is not a live region, so your screen reader does not also read each line as it is spoken. When you move the virtual cursor with the buttons, the new line is announced once. If you already use a screen reader, the buttons are usually the better way through.",
  },
]

const linkClass = "font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300"

export default function ScreenReaderSimulatorPage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <ToolStructuredData
        name="Screen Reader Simulator"
        description={pageDescription}
        url={`https://accessibility.build${ROUTE}`}
        applicationCategory="DeveloperApplication"
        operatingSystem="Any"
      />
      <HowToStructuredData
        name="How to preview what a screen reader announces on a page"
        description="Load a public page, read the transcript built from Chrome's accessibility tree, and fix the headings, landmarks, links and controls that are flagged."
        steps={[
          { name: "Enter the page address", text: "Type or paste the address of any public page and select Preview this page. Loading takes 10 to 30 seconds." },
          { name: "Read the transcript", text: "Each line is one stop a screen reader would make in browse mode, in reading order, with the role, name and state of every heading, link and control." },
          { name: "Filter and step through", text: "Show only headings, landmarks, links or form fields, move with the Next and Previous buttons, or press Play to hear the lines read aloud." },
          { name: "Fix what is flagged", text: "The lists under the transcript count the problems in each area. Show in transcript takes you to the line, so you can see it in context." },
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
                <li className="text-slate-900 dark:text-white">Screen Reader Simulator</li>
              </ol>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
              Free tool &middot; No sign-up
            </p>
            <h1 className="mt-3 max-w-4xl font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Screen reader simulator: what does your page announce?
            </h1>
            <p className="mt-6 max-w-[62ch] text-lg leading-8 text-slate-700 dark:text-slate-300">
              Enter a page address and get a transcript of what a screen reader would come across, line by line in
              reading order, plus the lists of headings, landmarks, links and controls that screen reader users jump
              around with. Missing names, vague links and skipped headings are flagged.
            </p>
            <p className="mt-4 max-w-[62ch] leading-7 text-slate-700 dark:text-slate-300">
              It is a preview built from Chrome&apos;s accessibility tree, the same data screen readers start from. It
              is not NVDA, JAWS, VoiceOver or TalkBack, which phrase things differently and have behaviour of their
              own. Use it to find problems fast, then{" "}
              <Link href="/guides/screen-reader-testing" className={linkClass}>
                test with a real screen reader
              </Link>
              .
            </p>
          </div>
        </header>

        <div className="container-wide">
          <div className="mx-auto max-w-6xl py-12">
            <ScreenReaderSimulator />

            <section aria-labelledby="how-heading" className="mt-14 max-w-[68ch]">
              <h2 id="how-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                How the preview is made
              </h2>
              <div className="mt-4 space-y-4 leading-7 text-slate-700 dark:text-slate-300">
                <p>
                  Browsers build an accessibility tree for every page: each element&apos;s role (heading, link,
                  button), its accessible name, and its states, such as expanded, checked or required. Screen readers
                  read that tree through the operating system and then decide for themselves how to present it.
                </p>
                <p>
                  This tool loads your page in headless Chrome, waits for it to settle, scrolls it so lazy sections
                  load, and reads the full tree through the Chrome DevTools Protocol. It then walks the tree in
                  reading order and writes one line per stop in plain wording: &ldquo;heading level 2,
                  Pricing&rdquo;, &ldquo;link, Contact us&rdquo;, &ldquo;edit, Email, required&rdquo;, &ldquo;list, 5
                  items&rdquo;, and the start and end of each landmark. Text that a link or button already uses as its
                  name is not read twice, and a label next to the field it names is not repeated.
                </p>
                <p>
                  Reading order is the order of the tree, which follows the page source. Content that CSS moves
                  around visually still reads in source order here, as it does for screen reader users, which is
                  often where a confusing page comes from.
                </p>
                <p>
                  What it cannot tell you is how a particular product will sound, or whether the page works when you
                  use it. The{" "}
                  <Link href="/guides/screen-reader-testing" className={linkClass}>
                    screen reader testing guide
                  </Link>{" "}
                  covers how to check a page with NVDA, JAWS, VoiceOver and TalkBack.
                </p>
              </div>
            </section>

            <section aria-labelledby="checks-heading" className="mt-12 max-w-[68ch]">
              <h2 id="checks-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                What gets flagged
              </h2>
              <div tabIndex={0} role="region" aria-label="The checks run on each list, and the WCAG criteria they relate to" className="mt-6 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                <table className="w-full border-collapse text-sm">
                  <caption className="sr-only">The checks run on each list, and the WCAG criteria they relate to</caption>
                  <thead>
                    <tr>
                      {["List", "Flagged", "WCAG"].map((h) => (
                        <th key={h} scope="col" className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-slate-700 dark:text-slate-300">
                    {[
                      ["Headings", "No level 1 heading, empty headings, and skipped levels such as h2 to h4. More than one h1 is noted but not counted as a problem.", "1.3.1, 2.4.6"],
                      ["Landmarks", "No main landmark, more than one main, and several navigation landmarks with no names to tell them apart.", "1.3.1"],
                      ["Links", "No accessible name, a web address used as the text, vague text such as \"click here\" or \"read more\", and the same text going to different places.", "2.4.4, 4.1.2"],
                      ["Form fields", "Fields with no accessible name.", "4.1.2"],
                      ["Buttons", "Buttons with no accessible name.", "4.1.2"],
                      ["Images", "Images with no text alternative that are not marked decorative. An unnamed icon inside a named link or button is not flagged.", "1.1.1"],
                    ].map(([area, flagged, wcag]) => (
                      <tr key={area} className="align-top">
                        <th scope="row" className="border-b border-slate-200 px-4 py-3 text-left font-medium text-slate-900 dark:border-slate-800 dark:text-white">
                          {area}
                        </th>
                        <td className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">{flagged}</td>
                        <td className="whitespace-nowrap border-b border-slate-200 px-4 py-3 dark:border-slate-800">{wcag}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
                The criteria are{" "}
                <Link href="/wcag/1-3-1" className={linkClass}>1.3.1 Info and Relationships</Link>,{" "}
                <Link href="/wcag/2-4-4" className={linkClass}>2.4.4 Link Purpose (In Context)</Link>,{" "}
                <Link href="/wcag/2-4-6" className={linkClass}>2.4.6 Headings and Labels</Link> and{" "}
                <Link href="/wcag/4-1-2" className={linkClass}>4.1.2 Name, Role, Value</Link>, with{" "}
                <Link href="/wcag/1-1-1" className={linkClass}>1.1.1 Non-text Content</Link>{" "}for images. A flag is a
                lead to check, not a verdict: whether a heading describes its section, or a link&apos;s context makes
                its purpose clear, still needs a person.
              </p>
            </section>

            <section aria-labelledby="limits-heading" className="mt-12 max-w-[68ch]">
              <h2 id="limits-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                Limits worth knowing
              </h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-slate-700 dark:text-slate-300">
                <li>Content inside iframes is not included. Each frame is listed with its title so you can check it separately.</li>
                <li>Images, video and audio files are not downloaded. Text alternatives still come through; media players show without their own controls.</li>
                <li>The page is read as it loads. Menus, dialogs and tabs that need a click are read in their closed state, and nothing is typed or submitted.</li>
                <li>Live region announcements, focus changes and descriptions linked with aria-describedby are not read out.</li>
                <li>Pages behind a sign-in, and sites that block automated browsers, cannot be checked.</li>
                <li>The transcript stops at about 1,500 lines on very long pages. The lists of headings, landmarks, links and controls still cover the whole page.</li>
              </ul>
            </section>

            <div className="mt-14 max-w-[68ch]">
              <FaqSection faqs={FAQS} />
            </div>

            <div className="mt-14">
              <RelatedContent
                content="screen reader testing accessibility tree headings landmarks link text accessible name NVDA VoiceOver WCAG 1.3.1 2.4.4 2.4.6 4.1.2"
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
