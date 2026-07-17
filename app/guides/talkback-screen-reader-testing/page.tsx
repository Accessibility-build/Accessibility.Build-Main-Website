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
  Smartphone,
  Power,
  Hand,
  Compass,
  SlidersHorizontal,
  Play,
  ListChecks,
  ShieldCheck,
  Bug,
  Ruler,
  Keyboard,
} from "lucide-react"

const pageTitle = "TalkBack Screen Reader Testing: The Complete Guide (2026)"
const pageDescription =
  "Learn to test websites with TalkBack, Android's built-in screen reader: turn it on, master explore by touch, swipe navigation, reading controls, and multi-finger gestures, and run a repeatable mobile testing workflow with a full gesture cheat sheet — mapped to WCAG 2.2 AA including Target Size and Pointer Gestures."

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "talkback",
    "talkback screen reader",
    "talkback testing",
    "how to use talkback",
    "talkback gestures",
    "talkback cheat sheet",
    "talkback reading controls",
    "android screen reader",
    "android accessibility testing",
    "test website with talkback",
    "talkback chrome testing",
    "explore by touch",
    "talkback vs voiceover",
    "mobile accessibility testing",
    "screen reader testing",
  ],
  alternates: {
    canonical: "/guides/talkback-screen-reader-testing",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/talkback-screen-reader-testing",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("TalkBack Screen Reader Testing Guide")}&section=Guide`,
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
        url: `/api/og?title=${encodeURIComponent("TalkBack Screen Reader Testing Guide")}&section=Guide`,
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
    name: "TalkBack Screen Reader Testing Guide",
    url: "https://accessibility.build/guides/talkback-screen-reader-testing",
  },
]

const faqs = [
  {
    question: "Is TalkBack free, and do I need a special device to test with it?",
    answer:
      "TalkBack is free and already on the phone in your pocket, provided it runs Android. It ships as part of the Android Accessibility Suite, which is preinstalled on virtually every Google-certified Android device, so there is nothing to buy and usually nothing to install — you turn it on in Settings and start testing. Any reasonably modern Android phone works. You do not need a flagship, and you do not need a dedicated test device, though a spare handset is convenient because TalkBack changes how the whole phone responds to touch. If you have no Android hardware at all, an Android emulator in Android Studio can run TalkBack, but be aware that gestures performed with a mouse in an emulator are awkward and multi-finger gestures are difficult to reproduce faithfully. Real hardware is strongly preferred.",
  },
  {
    question: "Why test with TalkBack if I already test with VoiceOver on iOS?",
    answer:
      "Because they are different screen readers on a different platform with a different accessibility API, and roughly half the mobile web is not on iOS. TalkBack sits on top of the Android accessibility framework and Chrome's implementation of it, while VoiceOver sits on top of Apple's; the two genuinely differ in how they expose ARIA roles, how they announce live regions, how they handle custom controls, and how they treat focus after navigation. A pattern that reads perfectly in VoiceOver can be silent, mislabeled, or unreachable in TalkBack. Android's global share of mobile web traffic is the majority in most of the world, and in many markets it is overwhelming. If your audience is global — or simply not exclusively American — TalkBack is not the optional second mobile screen reader. It is the one most of your mobile screen reader users are actually running.",
  },
  {
    question: "What are TalkBack reading controls?",
    answer:
      "Reading controls are TalkBack's way of changing what a swipe up or swipe down moves you through — they are the direct equivalent of the VoiceOver Rotor. By default, swiping up or down moves you by the currently selected reading control, and you cycle through the available controls with a three-finger swipe left or right on devices that support multi-finger gestures (on older devices or setups, the gesture is a swipe up-then-down or down-then-up). The available options include Headings, Links, Controls, and text granularities like Characters, Words, and Lines. This is the single most useful feature for testing structure: set the reading control to Headings, then swipe down repeatedly, and you get the page outline read aloud. If nothing is announced, your page has no real headings — which is a WCAG 1.3.1 failure, not a TalkBack quirk.",
  },
  {
    question: "How do I turn TalkBack off if I get stuck?",
    answer:
      "This is the question every first-time tester needs answered before they start, because TalkBack changes what a single tap does and it is genuinely easy to feel trapped. The reliable escape hatch is the volume key shortcut: press and hold both volume keys together for about three seconds and TalkBack toggles off. On most devices this shortcut is enabled by default, and if it is not, you should turn it on in Settings before your first session — it is the difference between a comfortable test and a panicked one. Failing that, remember the core rule: nothing activates on a single tap. Single tap or swipe to move focus, then double-tap anywhere on the screen to activate the focused item. Using that, you can navigate back to Settings and switch TalkBack off the normal way.",
  },
  {
    question: "Which browser should I use for TalkBack testing?",
    answer:
      "Chrome. It is the default browser on Android, it is what the overwhelming majority of TalkBack users are browsing with, and it is the pairing Google tests against, so Chrome plus TalkBack is the combination that matters most for the web. Firefox for Android also supports TalkBack and is worth a look if you have a specific reason, but it should not be your primary target. As with any screen reader report, name the browser and the versions when you file a bug — TalkBack behavior is a product of the screen reader, the Android version, and the browser working together, and a report that omits them is often unreproducible.",
  },
  {
    question: "Do TalkBack gestures change between Android versions?",
    answer:
      "Yes, and this trips people up constantly. TalkBack has changed substantially over its life, and the biggest shift was the arrival of multi-finger gestures, which are supported on newer TalkBack versions running on reasonably recent Android and are unavailable on older or lower-end devices. On a device without multi-finger support, the TalkBack menu is a swipe down-then-right rather than a three-finger tap, and reading controls are cycled with up-then-down or down-then-up swipes instead of three-finger swipes. On top of that, gestures are user-customizable under TalkBack settings, so a colleague's phone may genuinely behave differently from yours. Treat any cheat sheet, including this one, as the common case rather than gospel. The authoritative reference for the device in front of you is TalkBack Settings, where the Customize gestures screen lists exactly what every gesture is currently bound to.",
  },
  {
    question: "Does passing TalkBack testing mean my mobile site is accessible?",
    answer:
      "No. TalkBack testing proves your content works with one screen reader, on one platform, in one browser. It does not cover VoiceOver on iOS, which behaves differently and serves a large share of mobile users, and it says nothing about NVDA or JAWS on the desktop. It also does not, on its own, cover the non-screen-reader needs that matter enormously on mobile: touch target size, reflow at 320 CSS pixels, orientation lock, color contrast in sunlight, and motion sensitivity. What TalkBack is uniquely good for is that it forces you onto a real device with a real touch interface, which is exactly where the mobile-specific WCAG 2.2 criteria — Target Size, Pointer Gestures, Orientation, Reflow — actually get exercised. Treat it as one essential layer of a testing strategy that also includes VoiceOver, a desktop screen reader, keyboard-only testing, and automated scanning.",
  },
]

const coreGestures = [
  { keys: "Swipe right", action: "Move to the next element (linear navigation)" },
  { keys: "Swipe left", action: "Move to the previous element" },
  { keys: "Touch and drag a finger", action: "Explore by touch — hear whatever is under your finger" },
  { keys: "Double-tap (anywhere)", action: "Activate the focused element — the equivalent of a click" },
  { keys: "Double-tap and hold", action: "Long press the focused element" },
  { keys: "Swipe up / swipe down", action: "Move by the current reading control (heading, link, word…)" },
  { keys: "Two-finger swipe", action: "Scroll the page in that direction" },
  { keys: "Two-finger tap", action: "Pause or resume speech" },
  { keys: "Three-finger tap", action: "Open the TalkBack menu (multi-finger devices)" },
  { keys: "Three-finger swipe left / right", action: "Cycle through reading controls (multi-finger devices)" },
  { keys: "Swipe down-then-right", action: "Open the TalkBack menu (devices without multi-finger gestures)" },
  { keys: "Swipe up-then-down", action: "Cycle reading controls (devices without multi-finger gestures)" },
  { keys: "Hold both volume keys ~3s", action: "Toggle TalkBack on or off — your escape hatch" },
]

const readingControls = [
  { keys: "Headings", action: "Swipe down to walk the page outline — the fastest structure audit there is" },
  { keys: "Links", action: "Hear every link in order; each should make sense out of context" },
  { keys: "Controls", action: "Jump between interactive elements — buttons, fields, checkboxes" },
  { keys: "Lines / Paragraphs", action: "Read body content at a natural pace" },
  { keys: "Words / Characters", action: "Spot-check exact wording, spelling, and number formatting" },
  { keys: "Default", action: "Move element by element, as swipe right/left already does" },
]

const antiPatterns = [
  {
    bad: "A <div onclick> that swiping never lands on.",
    why: "No button role and not focusable, so TalkBack cannot reach it at all (WCAG 2.1.1, 4.1.2).",
    fix: "Use a real <button>. If you cannot, add role=\"button\", tabIndex, and key handlers.",
  },
  {
    bad: "TalkBack announces an icon button as just \"button\" — or reads its file name.",
    why: "No accessible name on an icon-only control (WCAG 1.1.1, 4.1.2).",
    fix: "Add aria-label to the button, and alt text or aria-hidden on the icon inside it.",
  },
  {
    bad: "Setting the reading control to Headings finds nothing.",
    why: "Styled <div>s instead of real headings — there is no outline to navigate (WCAG 1.3.1, 2.4.6).",
    fix: "Use <h1>–<h6> in a logical, non-skipping order.",
  },
  {
    bad: "A carousel or map that only responds to a swipe or pinch.",
    why: "TalkBack consumes swipes for navigation, so the gesture never reaches your widget (WCAG 2.5.1).",
    fix: "Provide single-tap alternatives — previous/next buttons, zoom in/out buttons.",
  },
  {
    bad: "Buttons so small or tightly packed that explore by touch keeps hitting the wrong one.",
    why: "Touch targets below the minimum size (WCAG 2.5.8 Target Size (Minimum), AA in WCAG 2.2).",
    fix: "Give targets at least 24×24 CSS pixels, or adequate spacing. Android's own guidance says aim for 48dp.",
  },
  {
    bad: "A form error appears on submit but TalkBack stays silent.",
    why: "The update is not in a live region (WCAG 4.1.3 Status Messages).",
    fix: "Render errors into an aria-live=\"assertive\" or role=\"alert\" container, or move focus to the summary.",
  },
  {
    bad: "Opening a modal leaves TalkBack focus on the page behind it.",
    why: "Focus was never moved into the dialog, so the user has no idea it opened (WCAG 2.4.3, 4.1.2).",
    fix: "Move focus into the dialog, constrain it there, and restore focus to the trigger on close.",
  },
]

export default function TalkBackScreenReaderTestingGuidePage() {
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
                    TalkBack Screen Reader Testing
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
                TalkBack Screen Reader Testing: The Complete Guide
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                TalkBack is Android&rsquo;s built-in screen reader — free, already
                on your phone, and the one most of the world&rsquo;s mobile screen
                reader users are running. This guide covers{" "}
                <strong>explore by touch</strong>, swipe navigation,{" "}
                <strong>reading controls</strong>, and multi-finger gestures, with
                a full cheat sheet and a repeatable workflow mapped to WCAG 2.2 AA
                — including the mobile-only criteria the desktop never tests.
              </p>
            </div>
          </section>

          {/* What & why */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Smartphone className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                Why Test with TalkBack
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A screen reader turns the visual interface into speech. On a
                  desktop it is driven by the keyboard; on a phone there is no
                  keyboard, so it is driven by touch — and that difference changes
                  everything about how the software behaves and what testing with
                  it reveals. If your markup is wrong — a button with no name, a
                  heading that is really a styled <code>&lt;div&gt;</code>, an error
                  that never announces — TalkBack has nothing meaningful to say, and
                  the feature is unusable no matter how good it looks.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <strong className="text-slate-900 dark:text-white">TalkBack</strong>{" "}
                  is Google&rsquo;s screen reader for Android. It ships as part of
                  the Android Accessibility Suite and is preinstalled on
                  essentially every Google-certified Android device, which makes it
                  the lowest-friction screen reader in existence: there is nothing
                  to buy, nothing to download, and no second machine to
                  provision. You can be testing within about sixty seconds of
                  finishing this paragraph.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  It is also the mobile screen reader most teams skip, usually
                  because they tested with{" "}
                  <Link href="/guides/voiceover-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    VoiceOver on an iPhone
                  </Link>{" "}
                  and considered mobile handled. That is a real gap. Android holds
                  the majority of mobile web traffic globally, and TalkBack sits on
                  a completely different accessibility API from VoiceOver&rsquo;s —
                  the two differ in how they expose ARIA, announce live regions,
                  and handle custom widgets. A component that reads beautifully in
                  VoiceOver can be silent in TalkBack.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  There is one more reason to care, and it is the one this guide
                  leans on hardest. TalkBack forces you onto a real device with a
                  real touch interface, which is precisely where the{" "}
                  <em>mobile-specific</em> WCAG 2.2 criteria actually get
                  exercised: <strong>2.5.8 Target Size</strong>,{" "}
                  <strong>2.5.1 Pointer Gestures</strong>,{" "}
                  <strong>1.3.4 Orientation</strong>, and{" "}
                  <strong>1.4.10 Reflow</strong>. No amount of{" "}
                  <Link href="/guides/nvda-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    NVDA
                  </Link>{" "}
                  or{" "}
                  <Link href="/guides/jaws-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    JAWS
                  </Link>{" "}
                  testing on a desktop will surface a tap target that is too small
                  to hit. This guide is the Android companion to those, and to our
                  broader{" "}
                  <Link href="/guides/screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    screen reader testing guide
                  </Link>
                  .
                </p>
              </div>
            </div>
          </section>

          {/* Turn it on */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Power className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                1. Turn TalkBack On (and Know How to Turn It Off)
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Read the second card before you touch the first one. TalkBack
                changes what every tap on your phone does, and the most common
                first-time experience is switching it on and immediately feeling
                trapped.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2">
                      <Power className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-lg">Switching it on</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground leading-relaxed">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        Go to <strong>Settings &rarr; Accessibility &rarr;
                        TalkBack</strong> and turn it on. Exact wording varies by
                        manufacturer; some nest it under an
                        &ldquo;Installed apps&rdquo; or &ldquo;Vision&rdquo;
                        submenu.
                      </li>
                      <li>
                        Turn on the <strong>volume key shortcut</strong> while you
                        are there, if it is not already on.
                      </li>
                      <li>
                        Test in <strong>Chrome</strong> — the default Android
                        browser and what nearly all TalkBack users browse with.
                      </li>
                      <li>
                        Slow the speech rate down at first under TalkBack settings.
                        Default speech is fast.
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-2">
                      <Hand className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle className="text-lg">Your escape hatch</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground leading-relaxed">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>
                          Hold both volume keys for about three seconds
                        </strong>{" "}
                        to toggle TalkBack off. Learn this first.
                      </li>
                      <li>
                        The core rule that unsticks everything:{" "}
                        <strong>nothing activates on a single tap</strong>. Tap or
                        swipe to move focus, then{" "}
                        <strong>double-tap anywhere</strong> to activate.
                      </li>
                      <li>
                        TalkBack ships a <strong>tutorial</strong> in its settings.
                        Fifteen minutes there will save you an hour of confusion.
                      </li>
                      <li>
                        Consider a <strong>spare handset</strong> — TalkBack
                        affects the entire device, not just the browser.
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm">
                One thing to check early: <strong>Settings &rarr; TalkBack &rarr;
                Customize gestures</strong>. Gestures are user-configurable and
                differ across TalkBack versions, so that screen — not any cheat
                sheet on the internet, including this one — is the authoritative
                list of what your device does right now.
              </p>
            </div>
          </section>

          {/* Core concepts */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Compass className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                2. Explore by Touch vs Linear Navigation
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Two ways of moving explain almost everything about how TalkBack
                works. Real users switch between them constantly, and you should
                test both — each surfaces bugs the other hides.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Explore by touch</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
                    <p>
                      Drag a finger around the screen and TalkBack announces
                      whatever is underneath it. Focus follows your finger, so this
                      is spatial — it mirrors the visual layout.
                    </p>
                    <p>
                      This is how you find <strong>target size</strong> problems.
                      If you keep landing on the wrong control, or a button is so
                      small your fingertip cannot reliably find it, you have a real{" "}
                      <Link href="/wcag/2-5-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                        2.5.8 Target Size
                      </Link>{" "}
                      finding.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Linear navigation</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
                    <p>
                      Swipe right for the next element, left for the previous one.
                      TalkBack walks the accessibility tree in order, independent
                      of where anything sits on screen.
                    </p>
                    <p>
                      This is the mobile equivalent of tabbing through a desktop
                      page, and it is where{" "}
                      <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                        2.4.3 Focus Order
                      </Link>{" "}
                      problems appear: content that reads in a different order than
                      it appears, or elements that swiping never reaches at all.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                The one rule that makes touch work at all:{" "}
                <strong>focus and activation are separate</strong>. A single tap
                moves focus and announces the element — it does not press it. To
                press it, <strong>double-tap anywhere on the screen</strong>, not
                necessarily on the element itself. That split is what lets a blind
                user hear what something is before committing to it, and it is why
                a &ldquo;works fine with a mouse&rdquo; widget can be completely
                inoperable here. If your control only responds to a raw{" "}
                <code>touchstart</code> or a custom swipe handler, TalkBack has
                already consumed that gesture for its own navigation and your
                handler never fires. See the{" "}
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

          {/* Gesture cheat sheet */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Hand className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                3. Essential TalkBack Gestures (Cheat Sheet)
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These are the gestures you need to test a web page. Multi-finger
                gestures require a recent TalkBack on a supported device — where
                they are unavailable, the older two-part swipes listed at the
                bottom do the same jobs.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Essential TalkBack gestures for testing a web page on Android
                    and what each one does
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Gesture</th>
                      <th scope="col" className="px-4 py-3 font-semibold">What it does</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    {coreGestures.map((row, i) => (
                      <tr key={i}>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                          <code>{row.keys}</code>
                        </th>
                        <td className="px-4 py-3 align-top">{row.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4 text-sm">
                Gestures are customizable and have shifted between TalkBack
                releases, so treat this as the common case. The authoritative list
                for the device in your hand is always{" "}
                <strong>Settings &rarr; TalkBack &rarr; Customize gestures</strong>.
              </p>
            </div>
          </section>

          {/* Reading controls */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <SlidersHorizontal className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                4. Audit Structure with Reading Controls
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Reading controls are TalkBack&rsquo;s equivalent of the VoiceOver
                Rotor, and they are the most valuable testing feature it has. They
                change what a swipe up or swipe down moves you by. Cycle through
                them with a <strong>three-finger swipe left or right</strong> (or{" "}
                <strong>swipe up-then-down</strong> on devices without multi-finger
                gestures), then swipe up or down to move by that unit.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mb-4">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    TalkBack reading control options and what each is useful for
                    when testing
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Reading control</th>
                      <th scope="col" className="px-4 py-3 font-semibold">What it is good for</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    {readingControls.map((row, i) => (
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
              <p className="text-muted-foreground leading-relaxed">
                The ninety-second structure audit: set the reading control to{" "}
                <strong>Headings</strong> and swipe down repeatedly. You should
                hear the page outline, in order, and it alone should tell you what
                the page is about — one <code>&lt;h1&gt;</code>, no skipped levels.
                If you hear nothing, your page has no real headings, which is a{" "}
                <Link href="/wcag/1-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                  1.3.1 Info and Relationships
                </Link>{" "}
                failure. Then switch to <strong>Links</strong> and do the same:
                every link, heard out of context, should still make sense — a
                stream of &ldquo;read more&rdquo; is the most damning thing a links
                pass can produce.
              </p>
            </div>
          </section>

          {/* Mobile-specific WCAG */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Ruler className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                5. The Checks Only a Real Phone Can Do
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                While you have the device in your hand, do these. They are not
                screen reader checks, but they are the reason mobile testing exists
                and no desktop pass will ever catch them.
              </p>
              <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc pl-6 mb-4">
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    Target size (
                    <Link href="/wcag/2-5-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                      2.5.8
                    </Link>
                    , AA).
                  </strong>{" "}
                  Can you reliably hit every control with a fingertip, not a
                  fingernail? WCAG 2.2 sets the floor at 24&times;24 CSS pixels,
                  with exceptions for spacing and inline links. Android&rsquo;s own
                  design guidance asks for 48dp, which is the better target to aim
                  for.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    Pointer gestures (
                    <Link href="/wcag/2-5-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                      2.5.1
                    </Link>
                    , A).
                  </strong>{" "}
                  Anything driven by a swipe, pinch, or multi-point gesture needs a
                  single-tap alternative. This is not optional politeness: with
                  TalkBack running, your swipe handler never fires, because
                  TalkBack took the swipe. Carousels and maps fail this constantly.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    Orientation (
                    <Link href="/wcag/1-3-4" className="text-blue-600 dark:text-blue-400 hover:underline">
                      1.3.4
                    </Link>
                    , AA).
                  </strong>{" "}
                  Rotate the phone. Content must work in both portrait and
                  landscape unless a specific orientation is essential — and a user
                  with a mounted wheelchair device may not be able to rotate at all.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    Reflow (
                    <Link href="/wcag/1-4-10" className="text-blue-600 dark:text-blue-400 hover:underline">
                      1.4.10
                    </Link>
                    , AA).
                  </strong>{" "}
                  No two-dimensional scrolling. If the user has to scroll sideways
                  to read a sentence, it fails.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    Text scaling.
                  </strong>{" "}
                  Turn font size up in Android display settings and reload. Text
                  should grow and layouts should cope — no clipping, no overlap, no
                  text trapped in a fixed-height box.
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Two practical tips. Chrome on Android can be inspected from your
                desktop DevTools over USB via <code>chrome://inspect</code>, which
                is far easier than debugging on a phone screen — you keep the real
                device and the real TalkBack, and get a real console. And the{" "}
                <Link href="/tools/mobile-accessibility-checker" className="text-blue-600 dark:text-blue-400 hover:underline">
                  mobile accessibility checker
                </Link>{" "}
                will flag target-size and viewport issues before you pick the phone
                up at all.
              </p>
            </div>
          </section>

          {/* Testing workflow */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Play className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                6. A Repeatable TalkBack Testing Workflow
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Run this pass on every key page or flow. It takes about twenty
                minutes once the gestures are in your fingers.
              </p>
              <ol className="space-y-3 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Open the page in Chrome.</strong>{" "}
                  TalkBack should announce the page title when it loads. It should
                  be unique and describe the page, not just the site name.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Survey the structure.</strong>{" "}
                  Set the reading control to <strong>Headings</strong> and swipe
                  down through the outline. Then switch to <strong>Links</strong>{" "}
                  and listen for link text that means nothing on its own.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Walk it linearly.</strong>{" "}
                  Swipe right from the top through the whole page. Every element
                  should announce a name and a role, in an order that matches how
                  the page reads. Note anything silent, anything that reads a file
                  name, anything announced as bare &ldquo;button.&rdquo;
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Explore by touch.</strong>{" "}
                  Now drag a finger around. Does the spatial layout match what you
                  just heard linearly? Can you reliably land on every control?
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Operate every widget.</strong>{" "}
                  Double-tap to activate menus, disclosures, tabs, and custom
                  controls. Anything that needs a swipe or a pinch must have a
                  single-tap alternative — TalkBack owns those gestures.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Fill in a form.</strong>{" "}
                  Every field should announce a real label, not just
                  &ldquo;edit box.&rdquo; Double-tap a field to bring up the
                  keyboard and type. Check that required state and any hint text
                  are announced too.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Trigger dynamic changes.</strong>{" "}
                  Submit the form with an error, add to cart, filter a list.
                  TalkBack should announce the change without you moving focus —
                  that is{" "}
                  <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                    4.1.3 Status Messages
                  </Link>
                  .
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Check modals and focus.</strong>{" "}
                  When a dialog opens, focus should move into it, stay there, and
                  return to the trigger on close. Swiping must not wander off into
                  the page behind the overlay.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Do the device-only checks.</strong>{" "}
                  Rotate the phone, raise the system font size, and confirm every
                  target is comfortably tappable.
                </li>
              </ol>
            </div>
          </section>

          {/* Common findings */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Bug className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                Common TalkBack Findings &amp; How to Fix Them
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These are the problems TalkBack surfaces most often. Each is a real
                WCAG failure that automated tools frequently miss or can only
                partially detect.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common problems found when testing with TalkBack, why they
                    fail, and the fix
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">What you hit</th>
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
                Most of these come down to correct roles, names, and states —
                verify them programmatically under{" "}
                <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  4.1.2 Name, Role, Value
                </Link>
                . When you report a TalkBack bug, always name the{" "}
                <strong>TalkBack version, the Android version, and the Chrome
                version</strong>: behavior is a product of all three, and a report
                without them is often unreproducible.
              </p>
            </div>
          </section>

          {/* WCAG mapping */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                What TalkBack Testing Verifies in WCAG 2.2
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria you can verify by testing with
                    TalkBack on a real Android device
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Criterion</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Level</th>
                      <th scope="col" className="px-4 py-3 font-semibold">What TalkBack reveals</th>
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
                      <td className="px-4 py-3">Headings and links appear under the matching reading control.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-3-4" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.3.4 Orientation
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Content works in both portrait and landscape.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-10" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.10 Reflow
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">No horizontal scrolling to read content at phone width.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.3 Focus Order
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Swiping right moves through content in a logical order.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-5-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.5.1 Pointer Gestures
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Swipe- and pinch-driven widgets have single-tap alternatives.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-5-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.5.8 Target Size (Minimum)
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Controls are large enough to hit reliably by touch.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.2 Name, Role, Value
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Every control announces a name, role, and current state.</td>
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
                Notice how many of these are unavailable to a desktop screen reader
                pass. See the full picture in the{" "}
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

          {/* TalkBack vs VoiceOver */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2">
                      <Smartphone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-lg">
                      TalkBack vs VoiceOver in brief
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground leading-relaxed list-disc pl-5 space-y-2">
                      <li>Both are free and built in — TalkBack on Android, VoiceOver on iOS.</li>
                      <li>Core gestures match: swipe to move, double-tap to activate.</li>
                      <li>TalkBack &ldquo;reading controls&rdquo; ≈ the VoiceOver &ldquo;Rotor.&rdquo;</li>
                      <li>Different accessibility APIs, so ARIA and live regions genuinely differ. Test both.</li>
                      <li>VoiceOver has no &ldquo;interacting&rdquo; concept on iOS; TalkBack has no direct equivalent either — but focus handling still diverges.</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-3">
                      See the{" "}
                      <Link href="/guides/voiceover-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                        VoiceOver testing guide
                      </Link>{" "}
                      for the iOS half of mobile.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-2">
                      <Keyboard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle className="text-lg">Fix the fundamentals first</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground leading-relaxed list-disc pl-5 space-y-2">
                      <li>TalkBack relies on the same semantics the keyboard does.</li>
                      <li>If Tab cannot reach a control on desktop, swiping will not reach it on Android.</li>
                      <li>Fix roles, names, and focus order before chasing gesture bugs.</li>
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
                TalkBack Testing Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Setup.</strong>{" "}
                  TalkBack on, volume key shortcut enabled, testing in Chrome,
                  speech rate comfortable.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Title &amp; structure.</strong>{" "}
                  Unique page title announced on load; the Headings reading control
                  walks a complete, non-skipping outline with one{" "}
                  <code>&lt;h1&gt;</code>.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Names &amp; roles.</strong>{" "}
                  Every link, button, and field announces a clear name and role — no
                  bare &ldquo;button&rdquo; or &ldquo;edit box.&rdquo;
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Linear order.</strong>{" "}
                  Swiping right reaches everything, in an order that matches the
                  visual reading order.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Explore by touch.</strong>{" "}
                  Every control is findable and reliably hittable with a fingertip.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Gestures.</strong>{" "}
                  Nothing requires a swipe or pinch without a single-tap
                  alternative.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Dynamic updates.</strong>{" "}
                  Errors, cart counts, and filter results are announced without
                  moving focus.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Dialogs.</strong>{" "}
                  Focus moves into modals, stays there, and returns to the trigger
                  on close.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Device checks.</strong>{" "}
                  Rotation works, large system font sizes do not break layouts, no
                  horizontal scrolling.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Cross-check.</strong>{" "}
                  Re-verify anything notable in VoiceOver on iOS — the two mobile
                  screen readers do not agree as often as you would hope.
                </li>
              </ol>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Scan Before You Pick Up the Phone
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Automated scanning clears the obvious issues so your TalkBack
                  session is spent on the problems only a human with a real device
                  can find. Run a free axe-core scan first, then work through the
                  pass above.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/tools/url-accessibility-auditor">
                      Scan a Page Now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link href="/tools/mobile-accessibility-checker">
                      Mobile Accessibility Checker
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
                content="talkback screen reader testing android google android accessibility suite explore by touch swipe navigation double tap reading controls multi-finger gestures chrome android mobile accessibility target size pointer gestures orientation reflow accessible name role value status messages aria live region wcag 2.5.8 2.5.1 4.1.2 4.1.3 1.3.1 screen reader voiceover nvda jaws"
                title="Related Guides & Tools"
                maxItems={6}
                showDescriptions={true}
                excludeUrl="/guides/talkback-screen-reader-testing"
              />
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
