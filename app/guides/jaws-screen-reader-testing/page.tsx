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
  AudioLines,
  Download,
  ToggleLeft,
  Command,
  Keyboard,
  Play,
  ListChecks,
  ShieldCheck,
  Bug,
  Zap,
  FileText,
} from "lucide-react"

const pageTitle = "JAWS Screen Reader Testing: The Complete Guide (2026)"
const pageDescription =
  "Learn to test websites with JAWS, the most widely used Windows screen reader: install it in demo mode, master the JAWS key, the Virtual Cursor and Forms Mode, quick navigation keys, and run a repeatable testing workflow with a full command cheat sheet — mapped to WCAG 2.2 AA."

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "jaws",
    "jaws screen reader",
    "jaws testing",
    "how to use jaws",
    "jaws keyboard shortcuts",
    "jaws commands",
    "jaws cheat sheet",
    "jaws key",
    "jaws virtual cursor",
    "jaws forms mode",
    "jaws quick navigation keys",
    "test website with jaws",
    "jaws chrome testing",
    "freedom scientific jaws",
    "jaws vs nvda",
    "screen reader testing",
  ],
  alternates: {
    canonical: "/guides/jaws-screen-reader-testing",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/jaws-screen-reader-testing",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("JAWS Screen Reader Testing Guide")}&section=Guide`,
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
        url: `/api/og?title=${encodeURIComponent("JAWS Screen Reader Testing Guide")}&section=Guide`,
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
    name: "JAWS Screen Reader Testing Guide",
    url: "https://accessibility.build/guides/jaws-screen-reader-testing",
  },
]

const faqs = [
  {
    question: "Is JAWS free, and how can I test with it without buying a license?",
    answer:
      "JAWS is commercial software from Freedom Scientific and is not free, but you do not need to buy a license to test with it. JAWS runs in a 40-minute demo mode: install it, use it fully for 40 minutes, then restart Windows to get another 40 minutes. That is enough for most testing passes, and it is how many teams do their JAWS verification. Freedom Scientific also offers a Home Annual License for personal, non-commercial use at a much lower cost than a professional license. If you are testing on behalf of an organization, the professional license is the correct route, and many enterprises and government agencies already own one.",
  },
  {
    question: "Why test with JAWS if NVDA is free?",
    answer:
      "Because your users are on JAWS. In WebAIM's screen reader user surveys, JAWS has consistently been among the most used screen readers, and it is dominant in exactly the environments where accessibility is legally required — government agencies, universities, banks, healthcare, and large enterprises where it is the standard-issue assistive technology. More importantly, JAWS and NVDA do not behave identically: they differ in how they interpret certain ARIA patterns, how aggressively they switch into Forms Mode, and how they announce tables, live regions, and custom widgets. A pattern that sounds perfect in NVDA can be silent or confusing in JAWS. If your audience includes enterprise or government users, NVDA testing alone does not cover them.",
  },
  {
    question: "What is the JAWS key?",
    answer:
      "The JAWS key is the modifier that starts most JAWS commands. Which key it is depends on your keyboard layout setting. In the Desktop layout — the default on machines with a full keyboard — the JAWS key is Insert. In the Laptop layout, it is Caps Lock, which matters because most laptops have no Insert key and no numeric keypad. So a command written as JAWS+F6 means Insert+F6 on a desktop and Caps Lock+F6 on a laptop. You can set the layout during installation or afterwards in JAWS Settings Center. If commands in a cheat sheet are not working for you, a mismatched keyboard layout is the most likely cause.",
  },
  {
    question: "What is the difference between the Virtual Cursor and Forms Mode in JAWS?",
    answer:
      "The Virtual Cursor (also called the PC Cursor in virtual documents) is JAWS's reading mode for web pages. It builds a virtual copy of the page you can move through with arrow keys and quick navigation keys — press H for the next heading, B for the next button, and so on. Forms Mode is JAWS's interaction mode: your keystrokes pass straight through to the control so you can actually type in a field. JAWS switches to Forms Mode automatically when focus lands on a text input, and you can force it with Enter. To leave Forms Mode and get back to the Virtual Cursor, press Numpad Plus (Desktop layout) or Escape. This is the single most important JAWS concept for testers, because the classic bug it exposes is a custom widget that JAWS never enters Forms Mode for — meaning quick nav keys steal the keystrokes and the widget cannot be operated at all.",
  },
  {
    question: "Which browser should I use for JAWS testing?",
    answer:
      "Chrome is the best default. Freedom Scientific officially supports Chrome, Edge, and Firefox, and Chrome is both the most-used browser among JAWS users and the pairing that receives the most attention from Freedom Scientific. Edge, being Chromium-based, behaves very similarly and is a reasonable choice in enterprises standardized on it. Whichever you pick, be consistent — reporting a bug as \"fails in JAWS\" without naming the browser makes it hard to reproduce, since screen reader behavior is genuinely a function of the screen reader and browser working together.",
  },
  {
    question: "Does passing JAWS testing mean my site is accessible?",
    answer:
      "No. JAWS testing proves your content works with one screen reader on one platform. It does not cover NVDA on Windows, VoiceOver on macOS and iOS, or TalkBack on Android — all of which interpret ARIA and announce content differently — and it says nothing about low vision, cognitive, or motor needs. JAWS is also, in one specific way, a deceptively forgiving tester: it is aggressive about guessing what an author meant, so it can paper over sloppy markup that other screen readers read literally and get wrong. Treat JAWS as one layer alongside keyboard-only testing, an automated scan, color contrast checks, and at least one other screen reader. Meeting WCAG 2.2 AA is the standard; JAWS is one of the tools you use to verify you have met it.",
  },
]

const quickNavKeys = [
  { keys: "H / Shift+H", action: "Next / previous heading" },
  { keys: "1 – 6", action: "Next heading at that level (Shift for previous)" },
  { keys: "R / Shift+R", action: "Next / previous region (landmark)" },
  { keys: "K / Shift+K", action: "Next / previous link" },
  { keys: "B / Shift+B", action: "Next / previous button" },
  { keys: "F / Shift+F", action: "Next / previous form field" },
  { keys: "E / Shift+E", action: "Next / previous edit box" },
  { keys: "X / Shift+X", action: "Next / previous checkbox" },
  { keys: "C / Shift+C", action: "Next / previous combo box" },
  { keys: "T / Shift+T", action: "Next / previous table" },
  { keys: "L / Shift+L", action: "Next / previous list" },
  { keys: "G / Shift+G", action: "Next / previous graphic" },
]

const jawsCommands = [
  { keys: "JAWS+Down Arrow", action: "Say All — read continuously from the cursor" },
  { keys: "Ctrl", action: "Stop speech immediately" },
  { keys: "Tab / Shift+Tab", action: "Move to the next / previous focusable control" },
  { keys: "JAWS+Tab", action: "Say the currently focused control (name, role, state)" },
  { keys: "Enter", action: "Activate the control, or enter Forms Mode on a field" },
  { keys: "Numpad Plus", action: "Leave Forms Mode, return to the Virtual Cursor" },
  { keys: "JAWS+Z", action: "Toggle the Virtual Cursor on or off" },
  { keys: "JAWS+F6", action: "Headings List — the page outline" },
  { keys: "JAWS+F7", action: "Links List" },
  { keys: "JAWS+F5", action: "Form Fields List" },
  { keys: "JAWS+F9", action: "Frames List" },
  { keys: "JAWS+F3", action: "Virtual HTML Features — every element list in one dialog" },
  { keys: "JAWS+T", action: "Read the page title" },
  { keys: "JAWS+B", action: "Read the active window or dialog from top to bottom" },
  { keys: "JAWS+F1", action: "Screen-sensitive help for the current control" },
  { keys: "JAWS+Space, then H", action: "Open Speech History — re-read what JAWS just said" },
  { keys: "JAWS+V", action: "Quick Settings for the current application" },
  { keys: "JAWS+F12", action: "Toggle verbosity / speech on many builds — check Quick Settings" },
]

const antiPatterns = [
  {
    bad: "A <div onclick> that JAWS skips entirely with the B quick nav key.",
    why: "It has no button role and is not focusable, so it is invisible to a screen reader (WCAG 2.1.1, 4.1.2).",
    fix: "Use a real <button>. If you cannot, add role=\"button\", tabIndex, and key handlers.",
  },
  {
    bad: "A custom widget where typing does nothing — letters jump you around the page instead.",
    why: "JAWS never entered Forms Mode, so quick nav keys consumed the keystrokes (WCAG 2.1.1, 4.1.2).",
    fix: "Give the widget a role that triggers Forms Mode (textbox, combobox, listbox) and manage focus into it.",
  },
  {
    bad: "A field JAWS announces as just \"edit\" with no label.",
    why: "Unlabeled input — the user does not know what to type (WCAG 1.3.1, 4.1.2).",
    fix: "Associate a <label> with for/id, or use aria-label / aria-labelledby.",
  },
  {
    bad: "An error appears on submit but JAWS says nothing.",
    why: "The update is not in a live region (WCAG 4.1.3 Status Messages).",
    fix: "Render errors into an aria-live=\"assertive\" or role=\"alert\" container, or move focus to the summary.",
  },
  {
    bad: "A data table where JAWS reads cell values with no column context.",
    why: "Missing header association, so relationships are lost (WCAG 1.3.1).",
    fix: "Use <th scope=\"col\">/<th scope=\"row\">, and a <caption> naming the table.",
  },
  {
    bad: "The Headings List (JAWS+F6) is empty or shows one flat level.",
    why: "Styled <div>s instead of real headings — no structure to navigate (WCAG 1.3.1, 2.4.6).",
    fix: "Use <h1>–<h6> in a logical, non-skipping order.",
  },
]

export default function JawsScreenReaderTestingGuidePage() {
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
                    JAWS Screen Reader Testing
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
                JAWS Screen Reader Testing: The Complete Guide
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                JAWS is the screen reader your enterprise and government users
                are most likely running — and you can test with it today without
                buying a license. This guide covers the{" "}
                <strong>JAWS key</strong>, the{" "}
                <strong>Virtual Cursor and Forms Mode</strong>, quick navigation
                keys, and a repeatable testing workflow, with full command cheat
                sheets mapped to WCAG 2.2 AA.
              </p>
            </div>
          </section>

          {/* What & why */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <AudioLines className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                Why Test with JAWS
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A screen reader turns the visual interface into speech and
                  braille. It reads out headings, links, buttons, form labels,
                  and status messages, and lets the user navigate by those
                  structures instead of by sight. If your markup is wrong — a
                  button with no name, a table with no headers, an update that
                  never announces — the screen reader has nothing meaningful to
                  say, and the feature is unusable no matter how good it looks.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <strong className="text-slate-900 dark:text-white">JAWS</strong>{" "}
                  (Job Access With Speech), from Freedom Scientific, is the
                  longest-established Windows screen reader and has consistently
                  been among the most used in WebAIM&rsquo;s screen reader user
                  surveys. It is especially entrenched in the environments where
                  accessibility is legally required — government, higher
                  education, banking, healthcare, and large enterprises, where it
                  is often the standard-issue assistive technology. If your
                  audience includes those users, testing with{" "}
                  <Link href="/guides/nvda-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    NVDA
                  </Link>{" "}
                  alone does not cover them.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  JAWS also has a testing personality worth knowing about: it is{" "}
                  <em>aggressive about inference</em>. It works hard to guess what
                  an author meant, which is wonderful for its users and slightly
                  dangerous for you — JAWS can quietly paper over sloppy markup
                  that NVDA or VoiceOver read literally and get wrong. That cuts
                  both ways. Something that fails in JAWS is almost certainly
                  broken; something that passes in JAWS is not automatically fine
                  elsewhere. Automated scanners like{" "}
                  <Link href="/guides/axe-vs-wave" className="text-blue-600 dark:text-blue-400 hover:underline">
                    axe and WAVE
                  </Link>{" "}
                  catch roughly a third of issues; the rest needs a human
                  listening. This guide is the JAWS-specific companion to our{" "}
                  <Link href="/guides/voiceover-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    VoiceOver testing guide
                  </Link>{" "}
                  and our broader{" "}
                  <Link href="/guides/screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    screen reader testing guide
                  </Link>
                  .
                </p>
              </div>
            </div>
          </section>

          {/* Install & setup */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Download className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                1. Install JAWS &amp; Configure It for Testing
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                JAWS is commercial software, but you do not need a license to test
                with it — and that surprises a lot of teams into skipping JAWS
                entirely.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2">
                      <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-lg">Getting a copy</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground leading-relaxed">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        Download JAWS from Freedom Scientific. It is{" "}
                        <strong>Windows only</strong>.
                      </li>
                      <li>
                        Unlicensed, it runs in{" "}
                        <strong>40-minute demo mode</strong> — fully functional,
                        then restart Windows for another 40 minutes. That is
                        enough for a testing pass.
                      </li>
                      <li>
                        A <em>Home Annual License</em> covers personal,
                        non-commercial use cheaply; organizations need a
                        professional license.
                      </li>
                      <li>
                        No Windows machine? Use a VM or a cloud Windows desktop.
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-2">
                      <Keyboard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle className="text-lg">Configure before you test</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground leading-relaxed">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        Pick your <strong>keyboard layout</strong>: Desktop
                        (JAWS key = <code>Insert</code>) or Laptop (JAWS key ={" "}
                        <code>CapsLock</code>). Laptops have no Insert key or
                        numpad — choose Laptop.
                      </li>
                      <li>
                        Test in <strong>Chrome</strong>, the most common JAWS
                        pairing. Edge behaves nearly identically.
                      </li>
                      <li>
                        Slow the speech rate down at first (<code>JAWS+V</code>{" "}
                        Quick Settings) — default JAWS speech is fast.
                      </li>
                      <li>
                        Press <code>Ctrl</code> anytime to silence speech.
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm">
                One practical tip: turn on <strong>Speech History</strong>{" "}
                (<code>JAWS+Space</code>, then <code>H</code>) early. It shows you
                a transcript of what JAWS just spoke, which is invaluable when a
                live region fires once and you are not sure whether you actually
                heard it.
              </p>
            </div>
          </section>

          {/* Virtual Cursor vs Forms Mode */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ToggleLeft className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                2. The JAWS Key, the Virtual Cursor, and Forms Mode
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Two concepts explain most of how JAWS works. Get these right and
                the rest of the commands fall into place — and one of them is the
                source of the most common JAWS-only bug you will find.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">The JAWS key</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
                    <p>
                      Most commands start with the <strong>JAWS key</strong>,
                      which depends on your layout setting:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Desktop layout:</strong> <code>Insert</code></li>
                      <li><strong>Laptop layout:</strong> <code>CapsLock</code></li>
                    </ul>
                    <p>
                      So <code>JAWS+F6</code> means <code>Insert+F6</code> or{" "}
                      <code>CapsLock+F6</code>. If cheat sheet commands are not
                      working, a mismatched layout is almost always why.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      Virtual Cursor vs Forms Mode
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        <strong>Virtual Cursor</strong> — reading mode. Arrow keys
                        and single-letter quick nav keys (<code>H</code>,{" "}
                        <code>B</code>, <code>F</code>) move you through a virtual
                        copy of the page.
                      </li>
                      <li>
                        <strong>Forms Mode</strong> — interaction mode. Keystrokes
                        pass through to the control so you can type.
                      </li>
                    </ul>
                    <p>
                      JAWS enters Forms Mode automatically on a text field, or on{" "}
                      <code>Enter</code>. Leave it with{" "}
                      <code>Numpad Plus</code> or <code>Escape</code>.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Here is why this matters more than any other JAWS concept. In the
                Virtual Cursor, pressing <code>B</code> jumps to the next button —
                it does not type the letter B. So if you build a custom text input
                or combo box that JAWS does not recognize as a form control, JAWS
                never switches to Forms Mode, and every letter the user types
                teleports them somewhere else on the page instead of entering
                text. The widget looks fine, passes an automated scan, works with
                a mouse — and is completely unusable. That failure mode is the
                single best reason to test with JAWS specifically, and it comes
                down to giving controls a role JAWS understands. See the{" "}
                <Link href="/reference/aria" className="text-blue-600 dark:text-blue-400 hover:underline">
                  ARIA roles &amp; attributes reference
                </Link>{" "}
                and the{" "}
                <Link href="/guides/focus-management" className="text-blue-600 dark:text-blue-400 hover:underline">
                  focus management guide
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Quick nav keys */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Zap className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                3. Quick Navigation Keys (Cheat Sheet)
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Single letters that jump between element types. These work when
                the <strong>Virtual Cursor</strong> is active — not in Forms Mode.
                Add <code>Shift</code> to go backwards. This is how a JAWS user
                actually moves around a page, so it is also the fastest way to
                audit whether your structure exists at all.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    JAWS quick navigation keys for moving between element types on
                    a web page
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Key</th>
                      <th scope="col" className="px-4 py-3 font-semibold">What it does</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    {quickNavKeys.map((row, i) => (
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
                If <code>H</code> finds no headings, <code>R</code> finds no
                regions, or <code>B</code> skips a control that looks like a
                button, you have found a real structural defect — not a JAWS
                quirk.
              </p>
            </div>
          </section>

          {/* Command cheat sheet */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Command className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                4. Essential JAWS Commands (Cheat Sheet)
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <code>JAWS</code> below means the JAWS key —{" "}
                <code>Insert</code> in the Desktop layout, <code>CapsLock</code>{" "}
                in the Laptop layout. These commands cover almost everything you
                need to test a web page.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Essential JAWS keyboard commands and what each one does
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Command</th>
                      <th scope="col" className="px-4 py-3 font-semibold">What it does</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    {jawsCommands.map((row, i) => (
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
                To learn what any key does without triggering it, turn on keyboard
                help with <code>JAWS+1</code> and press keys freely; press{" "}
                <code>JAWS+1</code> again to leave. Command sets do shift slightly
                between JAWS releases — the authoritative list is always in the
                JAWS Help menu on the version you have installed.
              </p>
            </div>
          </section>

          {/* Structure audit with lists */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <FileText className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                5. Audit Structure with the JAWS Lists
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                JAWS can dump every element of a given type into a dialog. Open
                each list and read it as if it were the page&rsquo;s table of
                contents — this is exactly how a JAWS user surveys an unfamiliar
                page, and it takes about ninety seconds.
              </p>
              <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc pl-6 mb-4">
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    Headings List (<code>JAWS+F6</code>).
                  </strong>{" "}
                  Confirm there is exactly one <code>&lt;h1&gt;</code>, that levels
                  do not skip, and that the outline alone tells you what the page
                  is about. Maps to{" "}
                  <Link href="/wcag/1-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.3.1 Info and Relationships
                  </Link>
                  .
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    Links List (<code>JAWS+F7</code>).
                  </strong>{" "}
                  Read out of context, every link should still make sense — no
                  wall of &ldquo;click here&rdquo; or &ldquo;read more&rdquo; (
                  <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.4.x
                  </Link>{" "}
                  link purpose). This list is the single most damning view of lazy
                  link text.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    Form Fields List (<code>JAWS+F5</code>).
                  </strong>{" "}
                  Every field should show a real label, not &ldquo;edit.&rdquo;
                  Cross-check with the{" "}
                  <Link href="/guides/accessible-forms" className="text-blue-600 dark:text-blue-400 hover:underline">
                    accessible forms guide
                  </Link>
                  .
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    Virtual HTML Features (<code>JAWS+F3</code>).
                  </strong>{" "}
                  One dialog with every element type — regions, lists, tables,
                  buttons, graphics. Check that banner, navigation, main, and
                  contentinfo regions all exist.
                </li>
              </ul>
            </div>
          </section>

          {/* Testing workflow */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Play className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                6. A Repeatable JAWS Testing Workflow
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Run this pass on every key page or flow. It fits comfortably
                inside one 40-minute demo session.
              </p>
              <ol className="space-y-3 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Check the page title.</strong>{" "}
                  Press <code>JAWS+T</code>. It should be unique and describe the
                  page, not just the site name.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Survey the structure.</strong>{" "}
                  Open the Headings List (<code>JAWS+F6</code>), then Links (
                  <code>JAWS+F7</code>), then regions via{" "}
                  <code>JAWS+F3</code>.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Read it all.</strong>{" "}
                  Press <code>JAWS+Down Arrow</code> to Say All from the top. Note
                  anything that sounds wrong — an image reading its file name, a
                  button that says only &ldquo;button,&rdquo; content in the wrong
                  order.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Walk it with quick nav keys.</strong>{" "}
                  Press <code>H</code> repeatedly, then <code>B</code>, then{" "}
                  <code>F</code>. Every heading, button, and field should announce
                  a name and a role.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Tab through it.</strong>{" "}
                  Now use <code>Tab</code> only. The order should be logical, and{" "}
                  <code>JAWS+Tab</code> should announce a sensible name, role, and
                  state for each stop.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Operate each widget — and watch Forms Mode.</strong>{" "}
                  Open menus, toggle disclosures, type into custom inputs. If
                  typing jumps you around the page, JAWS never entered Forms Mode
                  and the widget is broken.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Trigger dynamic changes.</strong>{" "}
                  Submit a form with an error, add to cart, filter a list. JAWS
                  should announce the change without you moving focus — that is{" "}
                  <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                    4.1.3 Status Messages
                  </Link>
                  . Verify in Speech History if unsure.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Check modals and focus.</strong>{" "}
                  When a dialog opens, <code>JAWS+B</code> should read it; focus
                  should move into it, stay trapped, and return to the trigger on
                  close.
                </li>
              </ol>
            </div>
          </section>

          {/* Common findings */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Bug className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                Common JAWS Findings &amp; How to Fix Them
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These are the problems JAWS surfaces most often. Each one is a real
                WCAG failure that automated tools frequently miss or can only
                partially detect.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common problems found when testing with JAWS, why they fail,
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
                states — verify them programmatically under{" "}
                <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  4.1.2 Name, Role, Value
                </Link>
                . When you report a JAWS bug, always name the{" "}
                <strong>JAWS version and the browser</strong>: behavior is a
                product of both working together, and a report without them is
                often unreproducible.
              </p>
            </div>
          </section>

          {/* WCAG mapping */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                What JAWS Testing Verifies in WCAG 2.2
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria you can verify by testing with JAWS
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Criterion</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Level</th>
                      <th scope="col" className="px-4 py-3 font-semibold">What JAWS reveals</th>
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
                      <td className="px-4 py-3">Graphics announce meaningful alt text, not file names.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.3.1 Info and Relationships
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Headings, lists, and table headers appear in the JAWS lists.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.1 Keyboard
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Every control is reachable and operable — including in Forms Mode.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.3 Focus Order
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Tabbing follows a logical, meaningful order.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.2 Name, Role, Value
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Controls announce a name, role, and current state via JAWS+Tab.</td>
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

          {/* JAWS vs NVDA */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2">
                      <AudioLines className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-lg">JAWS vs NVDA in brief</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground leading-relaxed list-disc pl-5 space-y-2">
                      <li>Both are Windows-only. JAWS is paid (40-min demo); NVDA is free.</li>
                      <li>JAWS key is Insert/CapsLock; NVDA key is Insert/CapsLock too — but commands differ.</li>
                      <li>JAWS &ldquo;Virtual Cursor / Forms Mode&rdquo; ≈ NVDA &ldquo;browse / focus mode.&rdquo;</li>
                      <li>JAWS infers more from imperfect markup; NVDA is more literal. Test both.</li>
                      <li>JAWS dominates enterprise and government; NVDA is common everywhere else.</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-3">
                      See the{" "}
                      <Link href="/guides/nvda-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                        NVDA testing guide
                      </Link>{" "}
                      for the free alternative.
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
                      <li>If Tab cannot reach a control, JAWS will struggle too.</li>
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
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ListChecks className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                JAWS Testing Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Setup.</strong>{" "}
                  JAWS installed (demo mode is fine), keyboard layout matches your
                  hardware, testing in Chrome, Speech History available.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Title &amp; structure.</strong>{" "}
                  Unique page title; one <code>&lt;h1&gt;</code>; heading levels do
                  not skip; regions present in <code>JAWS+F3</code>.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Names &amp; roles.</strong>{" "}
                  Every link, button, and field announces a clear name and role —
                  no bare &ldquo;button&rdquo; or &ldquo;edit.&rdquo;
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Quick nav.</strong>{" "}
                  <code>H</code>, <code>B</code>, <code>F</code>, and{" "}
                  <code>R</code> all find what they should — nothing structural is
                  missing.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Forms Mode.</strong>{" "}
                  Every text input and custom widget lets you actually type; no
                  keystroke ever teleports you across the page.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Tables.</strong>{" "}
                  Data tables announce column and row headers with each cell.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Dynamic updates.</strong>{" "}
                  Errors, cart counts, and filter results are announced — confirmed
                  in Speech History.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Dialogs.</strong>{" "}
                  Focus moves into modals, is trapped, and returns to the trigger
                  on close.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Cross-check.</strong>{" "}
                  Anything that passes only in JAWS re-verified in NVDA or
                  VoiceOver, since JAWS is the most forgiving of the three.
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
                  Automated scanning clears the obvious issues so your 40-minute
                  JAWS session is spent on the problems only a human can hear. Run
                  a free axe-core scan first, then work through the JAWS pass
                  above.
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
                content="jaws screen reader testing windows freedom scientific jaws key insert capslock virtual cursor forms mode quick navigation keys headings list links list speech history accessible name role value status messages aria live region wcag 4.1.2 4.1.3 1.3.1 keyboard accessibility screen reader nvda voiceover"
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
