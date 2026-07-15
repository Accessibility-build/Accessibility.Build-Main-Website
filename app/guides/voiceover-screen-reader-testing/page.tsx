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
  Power,
  RotateCw,
  Command,
  Keyboard,
  Play,
  ListChecks,
  ShieldCheck,
  Bug,
  Smartphone,
  Laptop,
  FileText,
} from "lucide-react"

const pageTitle = "VoiceOver Screen Reader Testing: The Complete Guide (macOS & iOS)"
const pageDescription =
  "Learn to test websites with VoiceOver, Apple's built-in screen reader: turn it on, master the VO modifier keys and the Rotor, use gestures on iPhone, and run a repeatable testing workflow with full macOS and iOS command cheat sheets — mapped to WCAG 2.2 AA."

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "voiceover",
    "voiceover screen reader",
    "voiceover testing",
    "how to use voiceover",
    "voiceover mac",
    "voiceover ios",
    "voiceover iphone",
    "voiceover keyboard shortcuts",
    "voiceover commands",
    "voiceover rotor",
    "vo keys",
    "voiceover gestures",
    "test website with voiceover",
    "voiceover safari testing",
    "screen reader testing",
    "voiceover cheat sheet",
  ],
  alternates: {
    canonical: "/guides/voiceover-screen-reader-testing",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/voiceover-screen-reader-testing",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("VoiceOver Screen Reader Testing Guide")}&section=Guide`,
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
        url: `/api/og?title=${encodeURIComponent("VoiceOver Screen Reader Testing Guide")}&section=Guide`,
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
    name: "VoiceOver Screen Reader Testing Guide",
    url: "https://accessibility.build/guides/voiceover-screen-reader-testing",
  },
]

const faqs = [
  {
    question: "Is VoiceOver free, and why test with it?",
    answer:
      "Yes. VoiceOver is Apple's screen reader, built into every Mac, iPhone, and iPad at no extra cost — there is nothing to download. It is the dominant screen reader on Apple platforms and, on mobile, VoiceOver on iOS is one of the two screen readers (with TalkBack on Android) that the majority of screen reader users rely on when browsing on a phone. Testing with VoiceOver reveals problems no automated scanner can catch: controls that speak as unlabeled, headings that fail to convey structure, custom widgets a user cannot operate by swipe, and dynamic updates that are never announced. If your audience includes Mac or iPhone users — and it does — you need to test with VoiceOver.",
  },
  {
    question: "What are the VO keys in VoiceOver?",
    answer:
      "On macOS, most VoiceOver commands start with the VO modifier, which is Control + Option pressed together (written as VO in command lists). So a command written as VO+A means Control+Option+A. You can also turn on the VoiceOver key lock with VO+; to hold the modifier down. Many testers enable \"Allow Caps Lock to be used as the VoiceOver modifier\" in VoiceOver Utility so a single key acts as VO, which is far easier on laptops. On iOS there is no VO key — you drive VoiceOver entirely with touch gestures instead of key combinations.",
  },
  {
    question: "What is the VoiceOver Rotor and how do I use it?",
    answer:
      "The Rotor is VoiceOver's tool for jumping through a page by element type — headings, links, form controls, landmarks, tables, and more. On macOS, press VO+U to open the Rotor, use the Left and Right arrows to choose a category such as Headings or Links, then Up and Down arrows to move between items of that type. On iOS, rotate two fingers on the screen as if turning a dial to pick a category, then swipe up or down with one finger to move through items of that type. The Rotor is exactly how a screen reader user surveys an unfamiliar page, so checking that your headings, links, and landmarks all appear correctly in the Rotor is one of the fastest structural audits you can run.",
  },
  {
    question: "Which browser should I use to test with VoiceOver?",
    answer:
      "Use Safari. VoiceOver and Safari are both made by Apple and are developed and tested together, so they have the most reliable, best-supported pairing on both macOS and iOS. On the iPhone and iPad, Safari is effectively the reference browser for VoiceOver testing. On the Mac you can also spot-check in Chrome, but treat Safari + VoiceOver as the canonical combination — a bug that only appears outside Safari is worth noting, while a failure that reproduces in Safari is almost certainly a real accessibility defect.",
  },
  {
    question: "How do I turn VoiceOver on and off quickly?",
    answer:
      "On macOS, press Command + F5 (or Command + Touch ID triple-press on Macs with Touch ID) to toggle VoiceOver on and off; you can also ask Siri to \"turn on VoiceOver.\" On iPhone and iPad, the fastest method is the Accessibility Shortcut: go to Settings, Accessibility, Accessibility Shortcut and select VoiceOver, after which triple-clicking the side button (or Home button on older devices) toggles it. You can also enable it under Settings, Accessibility, VoiceOver, or ask Siri. Setting up the triple-click shortcut before you start testing is essential, because once VoiceOver is on the whole touch interaction model changes and the shortcut is the reliable way back out.",
  },
  {
    question: "Does passing VoiceOver testing mean my site is accessible?",
    answer:
      "No single screen reader proves full accessibility. VoiceOver testing confirms that content is perceivable and operable with Apple's screen reader on macOS and iOS, which catches a large share of real problems, but it does not cover NVDA or JAWS behavior on Windows, TalkBack on Android, low vision, cognitive, or motor considerations. Screen readers differ in how they interpret ARIA and announce content, so a pattern that works in VoiceOver can still fail in NVDA and vice versa. Treat VoiceOver as one essential layer alongside keyboard-only testing, an automated scan, color contrast checks, and testing with at least one Windows screen reader. Meeting WCAG 2.2 AA is the standard; VoiceOver is one of the tools you use to verify you have met it.",
  },
]

const macCommands = [
  { keys: "Cmd+F5", action: "Turn VoiceOver on or off" },
  { keys: "VO+A", action: "Read all — start reading from the current position" },
  { keys: "Control", action: "Stop speech immediately" },
  { keys: "VO+→ / VO+←", action: "Move to the next / previous item" },
  { keys: "VO+Space", action: "Activate the current link, button, or control" },
  { keys: "VO+U", action: "Open the Rotor (headings, links, landmarks, form controls)" },
  { keys: "VO+Cmd+H", action: "Next heading (Shift for previous)" },
  { keys: "VO+Cmd+L", action: "Next link (Shift for previous)" },
  { keys: "VO+Cmd+J", action: "Next form control (Shift for previous)" },
  { keys: "VO+Cmd+X", action: "Next list (Shift for previous)" },
  { keys: "VO+Cmd+T", action: "Next table (Shift for previous)" },
  { keys: "VO+Shift+↓", action: "Interact with (step into) a group, table, or web area" },
  { keys: "VO+Shift+↑", action: "Stop interacting with the current group" },
  { keys: "VO+F", action: "Find text on the page" },
  { keys: "VO+F7", action: "Read the item summary / where you are" },
  { keys: "VO+;", action: "Lock the VO modifier keys on or off" },
]

const iosGestures = [
  { keys: "Single tap", action: "Select and speak the item under your finger" },
  { keys: "Swipe right / left", action: "Move to the next / previous item" },
  { keys: "Double tap", action: "Activate the selected item (link, button, control)" },
  { keys: "Two-finger tap", action: "Pause or resume speech" },
  { keys: "Two-finger swipe up", action: "Read all from the top of the screen" },
  { keys: "Two-finger swipe down", action: "Read all from the current position" },
  { keys: "Rotate two fingers", action: "Turn the Rotor to change navigation type" },
  { keys: "Swipe up / down (after Rotor)", action: "Move by the chosen Rotor type (headings, links, etc.)" },
  { keys: "Three-finger swipe up / down", action: "Scroll the page one screen" },
  { keys: "Three-finger tap", action: "Speak extra info (page position, item count)" },
  { keys: "Two-finger scrub (Z shape)", action: "Escape / go back / dismiss" },
  { keys: "Triple-click side button", action: "Toggle VoiceOver (if shortcut is set)" },
]

const antiPatterns = [
  {
    bad: "A button VoiceOver announces only as \"button\" with no name.",
    why: "No accessible name — the user cannot tell what it does (WCAG 4.1.2).",
    fix: "Give it visible text, aria-label, or aria-labelledby.",
  },
  {
    bad: "An icon-only link that reads its URL or nothing at all.",
    why: "Missing accessible name for the link (WCAG 2.4.4, 4.1.2).",
    fix: "Add visually hidden text or aria-label describing the destination.",
  },
  {
    bad: "A form field that speaks as \"edit text\" with no label.",
    why: "Unlabeled input — the user does not know what to type (WCAG 1.3.1, 4.1.2).",
    fix: "Associate a <label> with for/id, or use aria-label.",
  },
  {
    bad: "A custom control you can select by swipe but not operate.",
    why: "Missing role/state or no gesture support (WCAG 2.1.1, 4.1.2).",
    fix: "Use native elements, or add correct role, state, and key/gesture handling.",
  },
  {
    bad: "An error or cart count updates visually but VoiceOver stays silent.",
    why: "Dynamic change is not announced (WCAG 4.1.3 Status Messages).",
    fix: "Put the update in an aria-live=\"polite\" (or role=\"alert\") region.",
  },
  {
    bad: "A decorative image that reads its file name into the Rotor.",
    why: "Meaningless non-text content adds noise (WCAG 1.1.1).",
    fix: "Use empty alt=\"\" for decoration; concise alt for meaningful images.",
  },
]

export default function VoiceOverScreenReaderTestingGuidePage() {
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
                    VoiceOver Screen Reader Testing
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
                VoiceOver Screen Reader Testing: The Complete Guide
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                VoiceOver is built into every Mac and iPhone, so it is the screen
                reader your Apple users already have. This guide takes you from
                turning it on to a repeatable testing workflow — the{" "}
                <strong>VO keys</strong>, the <strong>Rotor</strong>, iOS
                gestures, and full command cheat sheets for{" "}
                <strong>macOS and iOS</strong> — with every finding mapped to
                WCAG 2.2 AA.
              </p>
            </div>
          </section>

          {/* What & why */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Ear className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                Why Test with VoiceOver
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
                    VoiceOver
                  </strong>{" "}
                  is Apple&rsquo;s screen reader, built into macOS, iOS, and
                  iPadOS. There is nothing to install, which makes it the most
                  practical way to hear how your site behaves for Mac and iPhone
                  users — and on mobile, VoiceOver on iOS is one of the two
                  screen readers most people use to browse on a phone. Automated
                  scanners like{" "}
                  <Link href="/guides/axe-vs-wave" className="text-blue-600 dark:text-blue-400 hover:underline">
                    axe and WAVE
                  </Link>{" "}
                  catch roughly a third of issues; the rest — does this actually
                  make sense when read aloud, and can I operate it by swipe? —
                  needs a human listening with a real screen reader. This guide
                  is the VoiceOver-specific companion to our{" "}
                  <Link href="/guides/nvda-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    NVDA testing guide
                  </Link>{" "}
                  and our broader{" "}
                  <Link href="/guides/screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    screen reader testing guide
                  </Link>
                  , which also covers JAWS and TalkBack.
                </p>
              </div>
            </div>
          </section>

          {/* Turn on & setup */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Power className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                1. Turn On &amp; Configure VoiceOver
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                VoiceOver is already on your device — you just enable it. Set up
                the toggle shortcut before you start, because the interaction
                model changes the moment VoiceOver turns on and you want a
                reliable way back out.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2">
                      <Laptop className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-lg">On macOS</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        Press <code>Cmd+F5</code> to toggle VoiceOver on and off.
                      </li>
                      <li>
                        Open <em>VoiceOver Utility</em> (<code>VO+F8</code>) and,
                        under General, tick{" "}
                        <em>Allow Caps Lock to be used as the VoiceOver modifier</em>{" "}
                        for easier one-key commands.
                      </li>
                      <li>
                        Test in <strong>Safari</strong>, the best-supported
                        pairing.
                      </li>
                      <li>
                        Press <code>Control</code> anytime to silence speech.
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-2">
                      <Smartphone className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle className="text-lg">On iPhone &amp; iPad</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        Go to <em>Settings &rarr; Accessibility &rarr; Accessibility
                        Shortcut</em> and choose <strong>VoiceOver</strong>.
                      </li>
                      <li>
                        Now <strong>triple-click the side button</strong> (or Home
                        button) to toggle VoiceOver on and off.
                      </li>
                      <li>
                        Test in <strong>Safari</strong>, the reference browser on
                        iOS.
                      </li>
                      <li>
                        Two-finger tap pauses and resumes speech while you think.
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Test on both platforms when you can. The same page can behave
                differently under VoiceOver on macOS versus iOS because touch and
                keyboard interaction differ — a custom widget that works with the
                VO keys may not respond to a double-tap gesture.
              </p>
            </div>
          </section>

          {/* VO keys & Rotor */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <RotateCw className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                2. The VO Keys and the Rotor — the Two Things to Understand
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Two concepts explain most of how VoiceOver works. Get these right
                and the rest of the commands fall into place.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">The VO modifier keys</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
                    <p>
                      On macOS, most commands start with <strong>VO</strong> —{" "}
                      <code>Control+Option</code> held together. So{" "}
                      <code>VO+A</code> is <code>Control+Option+A</code>.
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><code>VO+→</code> moves to the next item</li>
                      <li><code>VO+Space</code> activates the current control</li>
                      <li><code>VO+U</code> opens the Rotor</li>
                    </ul>
                    <p>
                      Enable Caps Lock as the VO key to press a single key
                      instead of two. On iOS there are no VO keys — you use{" "}
                      <strong>gestures</strong> instead.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">The Rotor</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
                    <p>
                      The Rotor jumps through a page by element type — the way a
                      screen reader user surveys a page.
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>macOS:</strong> <code>VO+U</code>, then arrow keys</li>
                      <li><strong>iOS:</strong> rotate two fingers, then swipe up/down</li>
                      <li>Pick Headings, Links, Landmarks, Form Controls&hellip;</li>
                    </ul>
                    <p>
                      Checking that Headings, Links, and Landmarks all appear
                      correctly in the Rotor is the fastest structural audit you
                      can run.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                One more idea worth knowing on macOS:{" "}
                <strong>interacting</strong>. Web content, tables, and groups are
                containers you step <em>into</em> with{" "}
                <code>VO+Shift+&#8595;</code> and step out of with{" "}
                <code>VO+Shift+&#8593;</code>. If VoiceOver seems stuck reading a
                whole region as one lump, or you cannot reach cells inside a
                table, you probably need to interact with it first. The cleanest
                way to avoid confusing behavior is to build on{" "}
                <Link href="/guides/keyboard-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  native, keyboard-operable elements
                </Link>{" "}
                and correct{" "}
                <Link href="/reference/aria" className="text-blue-600 dark:text-blue-400 hover:underline">
                  ARIA roles and states
                </Link>
                .
              </p>
            </div>
          </section>

          {/* macOS command cheat sheet */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Command className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                3. Essential VoiceOver Commands on macOS (Cheat Sheet)
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <code>VO</code> below means the VoiceOver modifier —{" "}
                <code>Control+Option</code>, or <code>CapsLock</code> if you
                enabled it. These commands cover almost everything you need to
                test a web page on the Mac.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Essential VoiceOver keyboard commands on macOS and what each
                    one does
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Command</th>
                      <th scope="col" className="px-4 py-3 font-semibold">What it does</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    {macCommands.map((row, i) => (
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
                To learn what any key does without triggering it, turn on the
                VoiceOver keyboard help with <code>VO+K</code> and press keys
                freely; press <code>Escape</code> to leave help. The full command
                set lives in the built-in VoiceOver Help menu (<code>VO+H</code>).
              </p>
            </div>
          </section>

          {/* iOS gestures cheat sheet */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Smartphone className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                4. Essential VoiceOver Gestures on iPhone &amp; iPad
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                On iOS there are no keyboard commands — you drive VoiceOver with
                touch gestures. These are the ones you need to test a web page in
                Safari on a phone or tablet.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Essential VoiceOver touch gestures on iOS and what each one
                    does
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Gesture</th>
                      <th scope="col" className="px-4 py-3 font-semibold">What it does</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    {iosGestures.map((row, i) => (
                      <tr key={i}>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white whitespace-nowrap align-top">
                          {row.keys}
                        </th>
                        <td className="px-4 py-3 align-top">{row.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4 text-sm">
                The single most useful habit on iOS is to <strong>swipe right
                repeatedly</strong> through the whole page: this follows the exact
                reading order a VoiceOver user experiences, so anything out of
                order, unlabeled, or unreachable by swipe shows up immediately.
                Then use the Rotor (rotate two fingers) to jump by headings and
                links.
              </p>
            </div>
          </section>

          {/* Structure audit with Rotor */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <FileText className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                5. Audit Structure with the Rotor
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Open the Rotor (<code>VO+U</code> on macOS, rotate two fingers on
                iOS) and step through each category. This is exactly how a screen
                reader user surveys an unfamiliar page, so it is the fastest
                structural audit you can run.
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
                  jump between page regions.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Form Controls.</strong>{" "}
                  Each should announce a clear label, not &ldquo;edit text.&rdquo;
                  Cross-check with the{" "}
                  <Link href="/guides/accessible-forms" className="text-blue-600 dark:text-blue-400 hover:underline">
                    accessible forms guide
                  </Link>
                  .
                </li>
              </ul>
            </div>
          </section>

          {/* Testing workflow */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Play className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                6. A Repeatable VoiceOver Testing Workflow
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Run this pass on every key page or flow. On macOS use the VO
                commands; on iOS use the equivalent gestures noted in brackets.
              </p>
              <ol className="space-y-3 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Check the page title.</strong>{" "}
                  It should be unique and describe the page, not just the site
                  name. VoiceOver announces it when the page loads.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Survey the structure.</strong>{" "}
                  Open the Rotor (<code>VO+U</code> / rotate two fingers) and
                  review headings, then links, then landmarks.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Read it all.</strong>{" "}
                  Use <code>VO+A</code> (two-finger swipe up on iOS) to read from
                  the top. Note anything that sounds wrong — an image reading its
                  file name, a button that says only &ldquo;button,&rdquo; text in
                  the wrong order.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Move through every item.</strong>{" "}
                  Use <code>VO+&rarr;</code> (swipe right on iOS) to walk the whole
                  page in reading order. Every link, button, and field should
                  announce a name and a role.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Operate each widget.</strong>{" "}
                  Open menus, toggle disclosures, use custom selects with{" "}
                  <code>VO+Space</code> (double tap on iOS). The state — expanded,
                  selected, checked — should be spoken.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Trigger dynamic changes.</strong>{" "}
                  Submit a form with an error, add to cart, filter a list.
                  VoiceOver should announce the change without you moving focus —
                  that is{" "}
                  <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                    4.1.3 Status Messages
                  </Link>
                  .
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Check modals and focus.</strong>{" "}
                  When a dialog opens, focus should move into it and stay trapped;
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
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Bug className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                Common VoiceOver Findings &amp; How to Fix Them
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These are the problems VoiceOver surfaces most often. Each one is
                a real WCAG failure that automated tools frequently miss or can
                only partially detect.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common problems found when testing with VoiceOver, why they
                    fail, and the fix
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
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                What VoiceOver Testing Verifies in WCAG 2.2
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria you can verify by testing with
                    VoiceOver
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Criterion</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Level</th>
                      <th scope="col" className="px-4 py-3 font-semibold">What VoiceOver reveals</th>
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
                      <td className="px-4 py-3">Headings, lists, and tables convey real structure in the Rotor.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.1 Keyboard
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Every control is reachable and operable by keyboard or swipe.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.3 Focus Order
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Swiping right follows a logical, meaningful reading order.</td>
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

          {/* VoiceOver vs NVDA card */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2">
                      <RotateCw className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-lg">VoiceOver vs NVDA in brief</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground leading-relaxed list-disc pl-5 space-y-2">
                      <li>VoiceOver is Apple-only (macOS/iOS); NVDA is Windows-only.</li>
                      <li>Both are free; VoiceOver is built in, NVDA is a download.</li>
                      <li>They interpret ARIA differently — test with both.</li>
                      <li>VoiceOver pairs best with Safari; NVDA with Firefox/Chrome.</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-3">
                      See the{" "}
                      <Link href="/guides/nvda-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                        NVDA testing guide
                      </Link>{" "}
                      for the Windows side.
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
                      <li>If Tab cannot reach a control, VoiceOver struggles too.</li>
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
                VoiceOver Testing Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Setup.</strong>{" "}
                  VoiceOver toggle set (<code>Cmd+F5</code> / triple-click),
                  testing in Safari, VO modifier configured on Mac.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Title &amp; structure.</strong>{" "}
                  Unique page title; one <code>&lt;h1&gt;</code>; heading levels
                  do not skip; landmarks present in the Rotor.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Names &amp; roles.</strong>{" "}
                  Every link, button, and field announces a clear name and its
                  role — no &ldquo;button&rdquo; or &ldquo;edit text.&rdquo;
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Reading order.</strong>{" "}
                  Swiping right (or <code>VO+&rarr;</code>) follows a logical
                  order that matches the visual layout.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Widgets.</strong>{" "}
                  Custom controls can be operated by swipe/double-tap and speak
                  their state (expanded, selected, checked).
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
                <li>
                  <strong className="text-slate-900 dark:text-white">Both platforms.</strong>{" "}
                  Verified on macOS <em>and</em> at least one iOS device, since
                  behavior can differ.
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
                  Automated scanning clears the obvious issues so your VoiceOver
                  time is spent on the problems only a human can hear. Run a free
                  axe-core scan first, then work through the VoiceOver pass above.
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
                content="voiceover screen reader testing macos ios iphone vo keys control option rotor gestures swipe double tap accessible name role value status messages aria live region wcag 4.1.2 4.1.3 1.1.1 keyboard accessibility screen reader nvda"
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
