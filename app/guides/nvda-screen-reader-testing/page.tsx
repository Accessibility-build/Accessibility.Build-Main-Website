import type { Metadata } from "next"
import Link from "next/link"
import {
  BreadcrumbStructuredData,
  FAQStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Ear,
  Download,
  ToggleLeft,
  Command,
  Keyboard,
  Play,
  ListChecks,
  ShieldCheck,
  Bug,
  Volume2,
  FileText,
} from "lucide-react"

const pageTitle = "NVDA Screen Reader Testing: The Complete Guide"
const pageDescription =
  "Learn to test websites with NVDA, the free Windows screen reader: install and configure it, master browse vs focus mode, use the NVDA modifier key, and run a repeatable testing workflow with a full keyboard command cheat sheet — mapped to WCAG 2.2 AA."

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "nvda",
    "nvda screen reader",
    "nvda testing",
    "how to use nvda",
    "nvda keyboard shortcuts",
    "nvda cheat sheet",
    "nvda commands",
    "nvda browse mode",
    "nvda focus mode",
    "nvda modifier key",
    "screen reader testing",
    "test website with nvda",
    "nvda vs jaws",
    "nvda accessibility testing",
    "nvda speech viewer",
    "nvda elements list",
  ],
  alternates: {
    canonical: "/guides/nvda-screen-reader-testing",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/nvda-screen-reader-testing",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("NVDA Screen Reader Testing Guide")}&section=Guide`,
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
        url: `/api/og?title=${encodeURIComponent("NVDA Screen Reader Testing Guide")}&section=Guide`,
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
    name: "NVDA Screen Reader Testing Guide",
    url: "https://accessibility.build/guides/nvda-screen-reader-testing",
  },
]

const faqs = [
  {
    question: "Is NVDA free, and why test with it?",
    answer:
      "Yes. NVDA (NonVisual Desktop Access) is a free, open-source screen reader for Windows, developed by NV Access. It is one of the two most widely used desktop screen readers in the world alongside JAWS, and because it costs nothing it is the most accessible way for developers and QA teams to test with a real screen reader. Testing with NVDA reveals problems automated scanners cannot detect — unlabeled controls that speak as blank, headings that do not convey structure, dynamic updates that are never announced, and custom widgets that a keyboard user cannot operate. If you can only install one screen reader for testing on Windows, install NVDA.",
  },
  {
    question: "What is the difference between browse mode and focus mode in NVDA?",
    answer:
      "Browse mode (the default on web pages) lets you read a page like a document: single-key shortcuts such as H for headings, K for links, and the arrow keys move a virtual cursor through the content without activating anything. Focus mode is for interacting with form fields and custom widgets: keystrokes pass straight through to the control so you can type into an input or use arrow keys inside a listbox. NVDA switches between them automatically — it enters focus mode when you Tab to or click an editable field or an application widget, and returns to browse mode when you leave. You can toggle manually with NVDA+Space. Understanding this switch is the single most important skill for testing with NVDA, because many bugs are really a mode problem: a widget that traps you in the wrong mode, or one that never enters focus mode at all.",
  },
  {
    question: "What is the NVDA modifier key?",
    answer:
      "The NVDA modifier (written as NVDA in command lists) is the key you hold with other keys to issue NVDA commands. By default it is Insert, and you can also use the numeric keypad Insert. On laptops without a convenient Insert key, enable Caps Lock as an additional NVDA key during installation or in Settings, Keyboard. So a command written as NVDA+F7 means Insert+F7 (or CapsLock+F7 if you enabled it). Configuring Caps Lock as the modifier is the most common setup for laptop testing.",
  },
  {
    question: "Which browser should I use to test with NVDA?",
    answer:
      "Use Mozilla Firefox or Google Chrome. NV Access develops and tests NVDA primarily against Firefox and Chrome, and they have the most reliable accessibility support with NVDA. Firefox has historically been the reference pairing for NVDA and is a safe default. Test in Chrome as well, since it is the most common browser your users will actually have. Avoid drawing conclusions from a single browser: a bug that only appears in one pairing is worth noting, but real accessibility failures usually reproduce across both.",
  },
  {
    question: "How do I find all the headings, links, or landmarks on a page with NVDA?",
    answer:
      "Press NVDA+F7 to open the Elements List, a dialog that lists every heading, link, form field, button, and landmark on the page with radio buttons to switch between element types. It is the fastest way to audit page structure the way a screen reader user does — pick Headings to confirm the outline is logical and complete, pick Links to check that link text makes sense out of context, and pick Landmarks to verify the page has banner, navigation, main, and contentinfo regions. You can also jump by type directly in browse mode: H for the next heading, 1 through 6 for a heading of that level, K for links, F for form fields, D for landmarks, and B for buttons.",
  },
  {
    question: "Does passing NVDA testing mean my site is accessible?",
    answer:
      "No single tool or screen reader proves full accessibility. NVDA testing confirms that content is perceivable and operable with one common screen reader on Windows, which catches a large share of real problems, but it does not cover VoiceOver on macOS and iOS, TalkBack on Android, JAWS behavior differences, low vision, cognitive, or motor considerations. Treat NVDA as one essential layer in a testing strategy that also includes keyboard-only testing, at least one automated scan, color contrast checks, and testing on mobile screen readers. Meeting WCAG 2.2 AA is the standard; NVDA is one of the tools you use to verify you have met it.",
  },
]

const commands = [
  { keys: "NVDA+N", action: "Open the NVDA menu (settings, tools, help)" },
  { keys: "NVDA+Q", action: "Quit NVDA" },
  { keys: "Ctrl", action: "Stop speech immediately" },
  { keys: "NVDA+↓ (or NVDA+A)", action: "Say all — read continuously from the cursor" },
  { keys: "↑ / ↓", action: "Read previous / next line (browse mode)" },
  { keys: "Tab / Shift+Tab", action: "Move to next / previous focusable control" },
  { keys: "H / Shift+H", action: "Next / previous heading" },
  { keys: "1 – 6", action: "Next heading of level 1 through 6" },
  { keys: "K / Shift+K", action: "Next / previous link" },
  { keys: "F / Shift+F", action: "Next / previous form field" },
  { keys: "B / Shift+B", action: "Next / previous button" },
  { keys: "D / Shift+D", action: "Next / previous landmark region" },
  { keys: "T / Shift+T", action: "Next / previous table" },
  { keys: "L / Shift+L", action: "Next / previous list" },
  { keys: "G / Shift+G", action: "Next / previous graphic (image)" },
  { keys: "NVDA+F7", action: "Elements List — all headings, links, landmarks, form fields" },
  { keys: "NVDA+Space", action: "Toggle browse mode and focus mode manually" },
  { keys: "NVDA+Tab", action: "Announce the currently focused control" },
  { keys: "NVDA+T", action: "Read the title of the current window / page" },
  { keys: "Enter / Space", action: "Activate the current link or control" },
]

const antiPatterns = [
  {
    bad: "A button that NVDA announces only as \"button\" with no name.",
    why: "No accessible name — the user cannot tell what it does (WCAG 4.1.2).",
    fix: "Give it visible text, aria-label, or aria-labelledby.",
  },
  {
    bad: "An image that reads its file name, e.g. \"IMG 4021 dot jpg graphic\".",
    why: "Missing or meaningless alt text conveys nothing (WCAG 1.1.1).",
    fix: "Add concise alt describing purpose; use empty alt=\"\" for decoration.",
  },
  {
    bad: "A form field that speaks as \"edit blank\" with no label.",
    why: "Unlabeled input — the user does not know what to type (WCAG 1.3.1, 4.1.2).",
    fix: "Associate a <label> with for/id, or use aria-label.",
  },
  {
    bad: "A custom dropdown you can Tab to but not open or arrow through.",
    why: "Focus mode never engages or keys are swallowed (WCAG 2.1.1).",
    fix: "Use native <select>, or add correct role, state, and key handlers.",
  },
  {
    bad: "A cart count or error that updates visually but NVDA stays silent.",
    why: "Dynamic change is not announced (WCAG 4.1.3 Status Messages).",
    fix: "Put the update in an aria-live=\"polite\" (or role=\"alert\") region.",
  },
  {
    bad: "Every link on the page reads simply \"click here\" or \"read more\".",
    why: "Link purpose is unclear out of context in the Elements List (WCAG 2.4.4).",
    fix: "Write descriptive link text that makes sense on its own.",
  },
]

export default function NvdaScreenReaderTestingGuidePage() {
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
                    NVDA Screen Reader Testing
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
                Testing Guide &bull; Updated July 2026
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                NVDA Screen Reader Testing: The Complete Guide
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                NVDA is the free Windows screen reader you should test with
                first. This guide takes you from install to a repeatable testing
                workflow — <strong>browse vs focus mode</strong>, the NVDA
                modifier key, the Elements List, and a full keyboard command
                cheat sheet — with every finding mapped to WCAG 2.2 AA.
              </p>
            </div>
          </section>

          {/* What & why */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Ear className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                Why Test with NVDA
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A screen reader turns the visual interface into speech and
                  braille. It reads out headings, links, buttons, form labels,
                  and status messages, and lets the user navigate by those
                  structures instead of by sight. If your markup is wrong — a
                  button with no name, an image with no alt text, an update that
                  never announces — the screen reader has nothing meaningful to
                  say, and the feature is unusable no matter how good it looks.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <strong className="text-slate-900 dark:text-white">
                    NVDA (NonVisual Desktop Access)
                  </strong>{" "}
                  is free, open source, and one of the two most used desktop
                  screen readers in the world. Because it costs nothing to
                  install, it is the most practical way for any developer or QA
                  engineer to hear their site the way a screen reader user does.
                  Automated scanners like{" "}
                  <Link href="/guides/axe-vs-wave" className="text-blue-600 dark:text-blue-400 hover:underline">
                    axe and WAVE
                  </Link>{" "}
                  catch roughly a third of issues; the rest — does this actually
                  make sense when read aloud? — needs a human listening with a
                  real screen reader. This guide is the NVDA-specific companion
                  to our broader{" "}
                  <Link href="/guides/screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    screen reader testing guide
                  </Link>
                  , which also covers JAWS, VoiceOver, and TalkBack.
                </p>
              </div>
            </div>
          </section>

          {/* Install & setup */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Download className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                1. Install &amp; Configure NVDA
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                NVDA runs on Windows only. Download it from the NV Access website
                and install it — the installer is small and the whole process
                takes a couple of minutes. A few settings make testing far
                easier, so configure them before you start.
              </p>
              <ol className="space-y-3 text-muted-foreground leading-relaxed list-decimal pl-6 mb-4">
                <li>
                  <strong className="text-slate-900 dark:text-white">Download and install.</strong>{" "}
                  Get NVDA from{" "}
                  <a
                    href="https://www.nvaccess.org/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    nvaccess.org/download
                  </a>
                  . On the welcome dialog, tick{" "}
                  <em>Use CapsLock as an NVDA modifier key</em> if you are on a
                  laptop without a convenient Insert key.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Enable the Speech Viewer.</strong>{" "}
                  Open the NVDA menu with <code>NVDA+N</code>, go to{" "}
                  <em>Tools &rarr; Speech Viewer</em>. This shows everything NVDA
                  speaks as on-screen text — invaluable for sighted testers who
                  want to read along and copy exact announcements into a bug
                  report.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Pick a test browser.</strong>{" "}
                  Use Firefox or Chrome, the two browsers NV Access supports
                  best. Test in both when you can.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Learn the stop key.</strong>{" "}
                  Press <code>Ctrl</code> at any time to silence speech. You will
                  use it constantly.
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Note: NVDA is a Windows application. To test the same pages with
                a screen reader on macOS or mobile, see VoiceOver and TalkBack in
                the{" "}
                <Link href="/guides/screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                  screen reader testing guide
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Browse vs focus mode */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ToggleLeft className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                2. Browse Mode vs Focus Mode — the One Thing to Understand
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                NVDA reads web pages in one of two modes, and knowing which mode
                you are in explains most of what you hear. Getting this right is
                the single most important skill for testing.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Browse mode (default)</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
                    <p>
                      For reading. A virtual cursor moves through the page and
                      single-key shortcuts navigate by structure.
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><code>H</code> jumps to the next heading</li>
                      <li><code>K</code> to the next link, <code>F</code> to the next field</li>
                      <li>Arrow keys read line by line</li>
                    </ul>
                    <p>NVDA plays a low beep when it switches into browse mode.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Focus mode</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
                    <p>
                      For interacting. Keystrokes pass straight to the control so
                      you can type or use arrow keys inside a widget.
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Typing goes into the text input</li>
                      <li>Arrows move within a listbox or menu</li>
                      <li>Single-key shortcuts are turned off</li>
                    </ul>
                    <p>NVDA plays a higher beep when it switches into focus mode.</p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                NVDA switches automatically: it enters focus mode when you Tab to
                or click an editable field or an application-style widget, and
                drops back to browse mode when you move away. You can also toggle
                manually with <code>NVDA+Space</code>. Listen for the two
                distinct beeps — they tell you which mode you are in.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Many screen reader bugs are really mode bugs. If a custom
                dropdown never enters focus mode, its arrow keys get swallowed by
                browse mode and the user cannot select an option. If a widget
                traps you in focus mode with no way back, you cannot use the
                single-key navigation to escape. When something feels stuck, the
                first question is always: <em>what mode is NVDA in, and is that
                the right one for this control?</em> The cleanest fix is to build
                on{" "}
                <Link href="/guides/keyboard-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  native, keyboard-operable elements
                </Link>{" "}
                so the mode switch just works.
              </p>
            </div>
          </section>

          {/* Command cheat sheet */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Command className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                3. Essential NVDA Keyboard Commands (Cheat Sheet)
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <code>NVDA</code> below means the NVDA modifier key —{" "}
                <code>Insert</code> by default, or <code>CapsLock</code> if you
                enabled it. Single letters like <code>H</code> and{" "}
                <code>K</code> only work in browse mode. These twenty commands
                cover almost everything you need to test a web page.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Essential NVDA keyboard commands and what each one does
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Command</th>
                      <th scope="col" className="px-4 py-3 font-semibold">What it does</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    {commands.map((row, i) => (
                      <tr key={i}>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white whitespace-nowrap align-top">
                          <code>{row.keys}</code>
                        </th>
                        <td className="px-4 py-3 align-top">{row.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4 text-sm">
                The full command set lives in the built-in help — press{" "}
                <code>NVDA+N</code> then choose <em>Help</em>. To learn what any
                key does without triggering it, turn on Input Help with{" "}
                <code>NVDA+1</code> and press keys freely; press{" "}
                <code>NVDA+1</code> again to turn it off.
              </p>
            </div>
          </section>

          {/* Elements List */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <FileText className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                4. Audit Structure with the Elements List
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Press <code>NVDA+F7</code> to open the Elements List. It shows
                every heading, link, form field, button, and landmark on the
                page, with radio buttons to switch between them. This is exactly
                how a screen reader user surveys an unfamiliar page, so it is the
                fastest structural audit you can run.
              </p>
              <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc pl-6 mb-4">
                <li>
                  <strong className="text-slate-900 dark:text-white">Headings.</strong>{" "}
                  Confirm there is exactly one <code>&lt;h1&gt;</code>, that
                  levels do not skip (an <code>&lt;h2&gt;</code> is not followed
                  by an <code>&lt;h4&gt;</code>), and that the outline reads like
                  a table of contents. Maps to{" "}
                  <Link href="/wcag/1-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.3.1 Info and Relationships
                  </Link>
                  .
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Links.</strong>{" "}
                  Every link should make sense on its own — no bare &ldquo;click
                  here&rdquo; or &ldquo;read more&rdquo; repeated a dozen times (
                  <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.4.x
                  </Link>{" "}
                  link purpose).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Landmarks.</strong>{" "}
                  Look for banner, navigation, main, and contentinfo so users can
                  jump between page regions with <code>D</code>.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Form fields.</strong>{" "}
                  Each should announce a clear label, not &ldquo;edit
                  blank.&rdquo; Cross-check with the{" "}
                  <Link href="/guides/accessible-forms" className="text-blue-600 dark:text-blue-400 hover:underline">
                    accessible forms guide
                  </Link>
                  .
                </li>
              </ul>
            </div>
          </section>

          {/* Testing workflow */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Play className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                5. A Repeatable NVDA Testing Workflow
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Run this pass on every key page or flow. Keep the Speech Viewer
                open so you can copy exact wording into your notes.
              </p>
              <ol className="space-y-3 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Read the page title.</strong>{" "}
                  Press <code>NVDA+T</code>. It should be unique and describe the
                  page, not just the site name.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Survey the structure.</strong>{" "}
                  Open the Elements List (<code>NVDA+F7</code>) and review
                  headings, then links, then landmarks.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Read it all.</strong>{" "}
                  Press <code>NVDA+↓</code> to have NVDA read from the top. Note
                  anything that sounds wrong — an image reading its file name, a
                  button that says only &ldquo;button,&rdquo; text in the wrong
                  order.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Tab through interactive controls.</strong>{" "}
                  Every link, button, and field should announce a name and a
                  role. Confirm focus mode engages on inputs and custom widgets.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Operate each widget.</strong>{" "}
                  Open menus, toggle disclosures, use custom selects. Arrow keys
                  should move within them and the state (expanded, selected)
                  should be spoken.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Trigger dynamic changes.</strong>{" "}
                  Submit a form with an error, add to cart, filter a list. NVDA
                  should announce the change without you moving focus — that is{" "}
                  <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                    4.1.3 Status Messages
                  </Link>
                  .
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Check modals and focus.</strong>{" "}
                  When a dialog opens, focus should move into it and be trapped;
                  closing should return focus to the trigger. See the{" "}
                  <Link href="/guides/focus-management" className="text-blue-600 dark:text-blue-400 hover:underline">
                    focus management guide
                  </Link>
                  .
                </li>
              </ol>
            </div>
          </section>

          {/* Common findings / anti-patterns */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Bug className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                Common NVDA Findings &amp; How to Fix Them
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These are the problems NVDA surfaces most often. Each one is a
                real WCAG failure that automated tools frequently miss or can
                only partially detect.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common problems found when testing with NVDA, why they fail,
                    and the fix
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">What you hear</th>
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
              <p className="text-muted-foreground leading-relaxed mt-4 text-sm">
                Fixing most of these comes down to correct roles, names, and
                states — the domain of the{" "}
                <Link href="/reference/aria" className="text-blue-600 dark:text-blue-400 hover:underline">
                  ARIA roles &amp; attributes reference
                </Link>
                . Verify names and roles programmatically under{" "}
                <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  4.1.2 Name, Role, Value
                </Link>
                .
              </p>
            </div>
          </section>

          {/* WCAG mapping */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                What NVDA Testing Verifies in WCAG 2.2
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria you can verify by testing with NVDA
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Criterion</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Level</th>
                      <th scope="col" className="px-4 py-3 font-semibold">What NVDA reveals</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.1.1 Non-text Content
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Images announce meaningful alt text, not file names.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.3.1 Info and Relationships
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Headings, lists, and tables convey real structure.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.1 Keyboard
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Every control is reachable and operable via the keyboard.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.2 Name, Role, Value
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Controls announce an accessible name, role, and current state.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.3 Status Messages
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Dynamic updates are announced without moving focus.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4 text-sm">
                See the full picture in the{" "}
                <Link href="/guides/wcag-2-2-aa-requirements" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG 2.2 Level AA requirements
                </Link>{" "}
                and track your coverage with the{" "}
                <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG 2.2 checklist
                </Link>
                .
              </p>
            </div>
          </section>

          {/* NVDA vs JAWS card */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2">
                      <Volume2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-lg">NVDA vs JAWS in brief</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground leading-relaxed list-disc pl-5 space-y-2">
                      <li>NVDA is free and open source; JAWS is commercial.</li>
                      <li>Both are Windows-only and heavily used in the wild.</li>
                      <li>Commands overlap but differ — do not assume identical behavior.</li>
                      <li>Test with both when you can; start with NVDA.</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-3">
                      Broader comparison in the{" "}
                      <Link href="/guides/screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                        screen reader testing guide
                      </Link>
                      .
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-2">
                      <Keyboard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle className="text-lg">Test the keyboard first</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground leading-relaxed list-disc pl-5 space-y-2">
                      <li>A screen reader relies on the keyboard working.</li>
                      <li>If Tab cannot reach a control, NVDA cannot either.</li>
                      <li>Fix keyboard operability before chasing speech bugs.</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-3">
                      Start with the{" "}
                      <Link href="/guides/keyboard-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                        keyboard accessibility guide
                      </Link>
                      .
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Checklist */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ListChecks className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                NVDA Testing Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Setup.</strong>{" "}
                  NVDA installed, Speech Viewer open, testing in Firefox and
                  Chrome, NVDA modifier key set.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Title &amp; structure.</strong>{" "}
                  Unique page title; one <code>&lt;h1&gt;</code>; heading levels
                  do not skip; landmarks present.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Names &amp; roles.</strong>{" "}
                  Every link, button, and field announces a clear name and its
                  role — no &ldquo;button&rdquo; or &ldquo;edit blank.&rdquo;
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Images.</strong>{" "}
                  Meaningful images have descriptive alt; decorative images are
                  silent (<code>alt=&quot;&quot;</code>).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Mode switching.</strong>{" "}
                  Focus mode engages on inputs and custom widgets; you can always
                  get back to browse mode.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Dynamic updates.</strong>{" "}
                  Errors, cart counts, and filter results are announced via live
                  regions.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Dialogs.</strong>{" "}
                  Focus moves into modals, is trapped, and returns to the trigger
                  on close.
                </li>
              </ol>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Scan Before You Listen
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Automated scanning clears the obvious issues so your NVDA time
                  is spent on the problems only a human can hear. Run a free
                  axe-core scan first, then work through the NVDA pass above.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/tools/url-accessibility-auditor">
                      Scan a Page Now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link href="/guides/screen-reader-testing">
                      Screen Reader Testing Guide
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
                content="nvda screen reader testing browse mode focus mode nvda modifier key elements list keyboard commands cheat sheet accessible name role value status messages aria live region wcag 4.1.2 4.1.3 1.1.1 keyboard accessibility screen reader"
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
