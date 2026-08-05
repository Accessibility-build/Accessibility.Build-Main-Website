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

const pageTitle = "Mobile Accessibility Guide"
const pageDescription =
  "Build accessible mobile apps and mobile web: touch target sizing, pointer gestures and cancellation, orientation and text scaling, native iOS accessibility (UIKit and SwiftUI), native Android accessibility (View and Jetpack Compose), mobile web, VoiceOver and TalkBack testing — mapped to WCAG 2.2 AA and WCAG2ICT."

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "mobile accessibility",
    "mobile app accessibility",
    "ios accessibility",
    "android accessibility",
    "accessible mobile app",
    "swiftui accessibility",
    "uikit accessibility",
    "jetpack compose accessibility",
    "android view accessibility",
    "touch target size",
    "mobile wcag",
    "wcag2ict",
    "voiceover accessibility",
    "talkback accessibility",
    "dynamic type accessibility",
    "pointer gestures wcag",
    "mobile web accessibility",
    "accessible touch targets",
    "screen reader mobile testing",
    "wcag mobile",
  ],
  alternates: {
    canonical: "/guides/mobile-accessibility",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/mobile-accessibility",
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
    name: "Mobile Accessibility Guide",
    url: "https://accessibility.build/guides/mobile-accessibility",
  },
]

const faqs = [
  {
    question: "What is mobile accessibility?",
    answer:
      "Mobile accessibility is the practice of designing and building mobile experiences — native iOS apps, native Android apps, and websites viewed on phones and tablets — so that people who use screen readers, switch access, magnification, large text, voice control, or one hand can complete every task. It shares the same user needs as desktop web accessibility but exposes them through different technology: on the web the browser gives you accessibility semantics for free from HTML, while in a native app there is no HTML, so every control's name, role, value, and state is something you set explicitly through the platform accessibility API. Mobile also introduces failure modes that barely exist on desktop — targets too small to tap, gestures nobody can perform one-handed, screens locked to one orientation, and text that will not grow when the user turns up the system font size.",
  },
  {
    question: "Does WCAG apply to mobile apps?",
    answer:
      "Yes. The Web Content Accessibility Guidelines were written for web content, but the W3C publishes WCAG2ICT — a Group Note that explains how to apply each WCAG success criterion to non-web software, including native mobile apps. In practice you read a criterion like 4.1.2 Name, Role, Value and substitute \"software\" for \"web page.\" Regulators treat mobile apps this way too: the Americans with Disabilities Act, the European Accessibility Act, and Section 508 all reach mobile apps, and courts and enforcement bodies routinely cite WCAG 2.1 or 2.2 Level AA as the measuring stick. On top of WCAG you follow the platform guidance — Apple's Human Interface Guidelines and Google's Material Design accessibility guidance — which set stricter, mobile-specific defaults such as minimum touch target size.",
  },
  {
    question: "What is the minimum touch target size on mobile?",
    answer:
      "There are two numbers and they answer different questions. WCAG 2.2 Success Criterion 2.5.8 Target Size (Minimum) sets a Level AA floor of 24 by 24 CSS pixels, with exceptions for targets that have enough spacing around them, inline targets in a sentence, and targets whose size is essential. The platform guidelines aim higher and are the size you should actually build to: Apple's Human Interface Guidelines call for a minimum tappable area of 44 by 44 points, and Google's Material Design guidance calls for 48 by 48 density-independent pixels. Treat 24px as the legal minimum you must never drop below and 44pt / 48dp as the ergonomic target for anything a person taps with a finger. You can keep an icon visually small while extending its hit area with padding, a TouchDelegate on Android, or SwiftUI's built-in minimum hit region.",
  },
  {
    question: "How do I make a native iOS app accessible?",
    answer:
      "Turn on VoiceOver (Settings, Accessibility, VoiceOver, or triple-click the side button) and swipe through your screens the way a blind user would. Then fix what you hear. In UIKit, give each meaningful element an accessibilityLabel (the name), the right accessibilityTraits (the role, for example .button or .header), and an accessibilityValue where relevant; mark decorative views isAccessibilityElement = false; and announce asynchronous changes with UIAccessibility.post(notification:). In SwiftUI, standard controls come labeled, so you mostly add .accessibilityLabel, .accessibilityHint, .accessibilityValue, .accessibilityAddTraits, group related views with .accessibilityElement(children:), and hide decoration with .accessibilityHidden(true). Make every text style respect Dynamic Type so labels grow with the user's font-size setting, keep tappable areas at least 44 by 44 points, and support both orientations unless one is genuinely essential.",
  },
  {
    question: "How do I make a native Android app accessible?",
    answer:
      "Turn on TalkBack (Settings, Accessibility, TalkBack, or the volume-key shortcut) and explore by touch. In the View system, give image-only controls a contentDescription, associate visible labels with inputs using android:labelFor, mark decoration importantForAccessibility=\"no\", size touch targets to at least 48dp, use sp units for text so it scales, and announce changes with view.announceForAccessibility(). In Jetpack Compose, set contentDescription on Icon and Image (null marks them decorative), merge related nodes with Modifier.semantics(mergeDescendants = true), expose role and state through the semantics block, and use LiveRegionMode for content that updates. Compose Material components already enforce a 48dp minimum touch target. Verify with the Accessibility Scanner app and an automated Espresso accessibility check, but always finish with a manual TalkBack pass.",
  },
  {
    question: "Which WCAG success criteria are specific to mobile?",
    answer:
      "A cluster of criteria fail almost exclusively on touch and small screens: 2.5.1 Pointer Gestures (do not require multipoint or path-based gestures like pinch or swipe-in-a-shape without a simple alternative), 2.5.2 Pointer Cancellation (act on the up-event, not the down-event, so a user can slide off to abort), 2.5.4 Motion Actuation (anything triggered by shaking or tilting the device needs a UI alternative and a way to turn it off), 2.5.8 Target Size Minimum and 2.5.5 Target Size Enhanced, 1.3.4 Orientation (do not lock to portrait or landscape unless essential), 1.4.10 Reflow (content works at a 320px-wide viewport with no two-dimensional scrolling), and 1.4.4 Resize Text (text scales to 200% without loss). Getting this cluster right is most of what separates a mobile-ready product from a desktop site squeezed onto a phone.",
  },
  {
    question: "Is testing on a real device necessary, or are emulators enough?",
    answer:
      "Emulators and automated scanners are a useful first pass, but they cannot reproduce the real experience. VoiceOver and TalkBack gesture models, focus order under a real screen reader, the feel of a 44pt target under a thumb, and how the layout behaves at the largest Dynamic Type or font-scale setting all need a physical device. The reliable workflow is: run an automated audit (Xcode's Accessibility Inspector, Android's Accessibility Scanner, or axe DevTools and Lighthouse for mobile web) to catch missing names and contrast issues, then do a manual pass on a real phone with the screen reader on, the font size cranked up, and the device rotated. Automated tools find roughly a third of issues; the manual pass finds the rest.",
  },
  {
    question: "How is mobile web accessibility different from native app accessibility?",
    answer:
      "The underlying WCAG requirements are the same, but the mechanics differ. On mobile web you build accessible HTML — real buttons and links, labeled form fields, headings, and ARIA only where HTML falls short — and the browser plus the screen reader (VoiceOver in Safari, TalkBack in Chrome) turn that into the accessibility tree automatically. Your mobile-web-specific work is mostly the viewport: never set user-scalable=no or maximum-scale=1 (it blocks pinch-zoom and fails 1.4.4), make sure layouts reflow at 320px, give touch targets a real CSS hit area, and use :focus-visible so keyboard and switch users see focus without it flashing on every tap. In a native app there is no browser doing that translation, so you build the accessibility tree by hand with UIAccessibility / SwiftUI modifiers on iOS or contentDescription / Compose semantics on Android.",
  },
]

const antiPatterns = [
  {
    bad: 'user-scalable="no" or maximum-scale=1 in the viewport meta tag.',
    why: "Blocks pinch-zoom, so low-vision users cannot enlarge the page (WCAG 1.4.4).",
    fix: 'Use content="width=device-width, initial-scale=1" and let users zoom.',
  },
  {
    bad: "Icon-only button with no label (no accessibilityLabel / contentDescription / aria-label).",
    why: 'The screen reader announces "button" with no purpose (WCAG 4.1.2, 1.1.1).',
    fix: "Give every icon control a text name; mark purely decorative images as hidden.",
  },
  {
    bad: "Tap targets smaller than 44pt / 48dp packed together with no spacing.",
    why: "Users with tremor or large fingers hit the wrong control (WCAG 2.5.8).",
    fix: "Extend the hit area with padding or a TouchDelegate; keep 24px minimum with spacing.",
  },
  {
    bad: "Swipe, pinch, or drag as the only way to complete an action.",
    why: "Screen reader and motor-impaired users cannot perform path or multipoint gestures (2.5.1).",
    fix: "Add a single-tap button alternative (arrows, a menu, a stepper) beside the gesture.",
  },
  {
    bad: "Firing the action on touch-down, or a shake gesture with no alternative.",
    why: "No way to slide off and abort (2.5.2); motion actuation excludes users who cannot move the device (2.5.4).",
    fix: "Act on the up-event, provide undo, and give motion features a UI control and an off switch.",
  },
  {
    bad: "Locking the app to portrait and hardcoding font sizes in px/pt.",
    why: "Breaks users mounted in landscape (1.3.4) and ignores the OS text-size setting (1.4.4).",
    fix: "Support both orientations; use Dynamic Type / sp units so text scales.",
  },
]

export default function MobileAccessibilityGuidePage() {
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
                    Mobile Accessibility
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
                Mobile Accessibility: iOS, Android &amp; Mobile Web
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Mobile accessibility is not desktop accessibility on a small
                screen, and it is not just &ldquo;turn on a screen
                reader.&rdquo; It is three surfaces &mdash; native iOS, native
                Android, and mobile web &mdash; that share one set of user needs
                through three different APIs, plus a cluster of WCAG criteria
                that only break on touch and small screens. This guide covers
                touch targets, gestures, orientation and text scaling, native
                iOS and Android code, mobile web, and a real-device testing
                workflow &mdash; mapped to WCAG 2.2 AA.
              </p>
            </div>
          </section>

          {/* Why mobile is different */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Why Mobile Accessibility Is Different
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The user needs are identical everywhere: a blind person using a
                  screen reader, someone who enlarges text, a person who taps
                  with a knuckle or a switch, a user with a tremor. What changes
                  on mobile is <strong className="text-slate-900 dark:text-white">how</strong>{" "}
                  you satisfy those needs. On the web, the browser turns your
                  HTML into an accessibility tree automatically &mdash; a real{" "}
                  <code>&lt;button&gt;</code> is announced as a button because
                  the platform already knows what a button is. In a native app{" "}
                  <strong className="text-slate-900 dark:text-white">
                    there is no HTML and no browser doing that translation
                  </strong>
                  : the accessibility tree is built by hand, and every control&apos;s
                  name, role, value, and state is something you set through the
                  platform accessibility API. Miss it, and VoiceOver or TalkBack
                  reads nothing.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Mobile also adds a whole cluster of failure modes that barely
                  exist on desktop, because the input is a finger on a small
                  screen you can rotate and that has a system-wide text-size
                  setting:
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-1">
                  <li>
                    <strong className="text-slate-900 dark:text-white">Touch targets</strong>{" "}
                    too small to hit reliably (
                    <Link href="/wcag/2-5-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                      2.5.8
                    </Link>
                    ).
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">Gestures</strong>{" "}
                    &mdash; swipe, pinch, drag &mdash; that a screen reader user
                    or a one-handed user cannot perform (
                    <Link href="/wcag/2-5-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                      2.5.1
                    </Link>
                    ,{" "}
                    <Link href="/wcag/2-5-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                      2.5.2
                    </Link>
                    ).
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">Orientation</strong>{" "}
                    locked to portrait, breaking anyone whose phone is mounted in
                    landscape (
                    <Link href="/wcag/1-3-4" className="text-blue-600 dark:text-blue-400 hover:underline">
                      1.3.4
                    </Link>
                    ).
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">Text scaling</strong>{" "}
                    that ignores Dynamic Type or the Android font-size setting (
                    <Link href="/wcag/1-4-4" className="text-blue-600 dark:text-blue-400 hover:underline">
                      1.4.4
                    </Link>
                    ), and layouts that will not reflow (
                    <Link href="/wcag/1-4-10" className="text-blue-600 dark:text-blue-400 hover:underline">
                      1.4.10
                    </Link>
                    ).
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  One more thing that trips teams up: WCAG was written for web
                  content, so people assume it does not cover their native app.
                  It does. The W3C publishes{" "}
                  <strong className="text-slate-900 dark:text-white">WCAG2ICT</strong>
                  , a Group Note that explains how to read each success criterion
                  for non-web software &mdash; you substitute &ldquo;software&rdquo;
                  for &ldquo;web page&rdquo; and the criteria still apply. The ADA,
                  the{" "}
                  <Link href="/compliance/eaa" className="text-blue-600 dark:text-blue-400 hover:underline">
                    European Accessibility Act
                  </Link>
                  , and{" "}
                  <Link href="/compliance/section-508" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Section 508
                  </Link>{" "}
                  all reach mobile apps, and WCAG 2.2 AA is the standard they are
                  measured against. This guide is the build layer; for how to
                  scope an audit of a native app, see our companion coverage of
                  WCAG-EM and WCAG2ICT.
                </p>
              </div>
            </div>
          </section>

          {/* WCAG mapping */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                The WCAG 2.2 Criteria Mobile Breaks Most
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria most commonly failed on mobile
                    apps and mobile web, their conformance level, and what each
                    requires on mobile
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
                        What it requires on mobile
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-5-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.5.1 Pointer Gestures
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Never require multipoint or path-based gestures; give a single-tap alternative.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-5-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.5.2 Pointer Cancellation
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Trigger on the up-event, not touch-down, so a user can slide off to abort.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-5-4" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.5.4 Motion Actuation
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Shake/tilt features need a UI control and a way to disable motion.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-3-4" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.3.4 Orientation
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Support portrait and landscape unless one is essential.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-4" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.4 Resize Text
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Text scales to 200% (Dynamic Type / sp units) with no loss of content.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-10" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.10 Reflow
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Content works at a 320px-wide viewport with no two-dimensional scrolling.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-5-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.5.8 Target Size (Minimum)
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Targets at least 24&times;24 CSS px (aim for 44pt / 48dp); or enough spacing.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-12" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.12 Text Spacing
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">No clipping when line height and letter/word spacing increase.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.7 Focus Visible
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Keyboard and switch users see a clear focus indicator on every control.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.2 Name, Role, Value
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Every control exposes a name, role, and state via the platform API.</td>
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

          {/* 1. Touch targets */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                1. Touch Target Size &amp; Spacing
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The single most common mobile accessibility failure is a target
                  too small to hit. Two standards apply, and they answer
                  different questions:
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-1">
                  <li>
                    <strong className="text-slate-900 dark:text-white">WCAG 2.5.8 Target Size (Minimum), AA</strong>{" "}
                    &mdash; the legal floor: 24&times;24 CSS pixels, with
                    exceptions for targets that have{" "}
                    <strong className="text-slate-900 dark:text-white">enough spacing</strong>{" "}
                    around them, inline links inside a sentence, and cases where
                    the size is essential.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">Platform guidance</strong>{" "}
                    &mdash; the size to actually build to:{" "}
                    <strong className="text-slate-900 dark:text-white">44&times;44 pt</strong>{" "}
                    (Apple Human Interface Guidelines) and{" "}
                    <strong className="text-slate-900 dark:text-white">48&times;48 dp</strong>{" "}
                    (Google Material Design).
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Treat 24px as the number you must never drop below and 44pt /
                  48dp as your ergonomic target. Crucially, the{" "}
                  <em>tappable area</em> is what counts, not the visible glyph:
                  you can keep a 16px icon and still meet the target by extending
                  the hit region with padding.
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`/* Mobile web: small icon, real hit area */
.icon-button {
  min-width: 44px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  On Android, wrap a small control in a{" "}
                  <code>TouchDelegate</code> or set{" "}
                  <code>android:minWidth</code>/<code>minHeight</code> to{" "}
                  <code>48dp</code>. In SwiftUI, standard controls already claim
                  a minimum hit region; for custom shapes add{" "}
                  <code>.contentShape(Rectangle())</code> and adequate padding.
                  When two targets sit close together, the spacing exception in
                  2.5.8 only helps if the gap keeps their 24px hit circles from
                  overlapping &mdash; crowded toolbars are the usual offender.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Gestures */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                2. Gestures, Pointer Cancellation &amp; Motion
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Gestures are where mobile UX and accessibility collide. A blind
                  user&apos;s swipes belong to VoiceOver or TalkBack, not to your
                  view; a user with a tremor or one working hand cannot trace a
                  shape or pinch. Three criteria govern this:
                </p>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  <strong className="text-slate-900 dark:text-white">
                    2.5.1 Pointer Gestures (A)
                  </strong>{" "}
                  &mdash; if something needs a{" "}
                  <strong className="text-slate-900 dark:text-white">
                    path-based
                  </strong>{" "}
                  gesture (swipe to delete, drag to reorder, swipe a carousel) or
                  a{" "}
                  <strong className="text-slate-900 dark:text-white">
                    multipoint
                  </strong>{" "}
                  gesture (two-finger pinch to zoom), you must provide a single
                  pointer alternative. Put a delete button behind the swipe, arrow
                  controls on the carousel, and zoom buttons beside the pinch. The
                  gesture is a shortcut, never the only door.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  <strong className="text-slate-900 dark:text-white">
                    2.5.2 Pointer Cancellation (A)
                  </strong>{" "}
                  &mdash; do not complete an action on the{" "}
                  <strong className="text-slate-900 dark:text-white">down-event</strong>.
                  Fire on the up-event so a user who presses the wrong control can
                  slide a finger away and release harmlessly, and provide an undo
                  where you can. A button that acts the instant a finger lands
                  gives no way to bail out. Native buttons and HTML{" "}
                  <code>click</code> already do the right thing; custom{" "}
                  <code>touchstart</code>/<code>onPress</code> handlers are where
                  this breaks.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <strong className="text-slate-900 dark:text-white">
                    2.5.4 Motion Actuation (A)
                  </strong>{" "}
                  &mdash; if shaking to undo or tilting to scroll drives a
                  feature, offer a normal on-screen control that does the same
                  thing, and let users turn the motion trigger off. Someone whose
                  phone is mounted to a wheelchair cannot shake it, and involuntary
                  movement can fire it by accident. See{" "}
                  <Link href="/wcag/2-5-4" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.5.4 Motion Actuation
                  </Link>{" "}
                  for the full requirement.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  For drag operations specifically, WCAG 2.2 added{" "}
                  <Link href="/wcag/2-5-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.5.7 Dragging Movements
                  </Link>{" "}
                  (AA): anything you accomplish by dragging must also be doable
                  with single taps. Our{" "}
                  <Link href="/guides/accessible-slider" className="text-blue-600 dark:text-blue-400 hover:underline">
                    accessible slider guide
                  </Link>{" "}
                  works through a canonical drag control end to end.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Orientation, reflow, text scaling */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                3. Orientation, Reflow &amp; Text Scaling
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <strong className="text-slate-900 dark:text-white">
                    Orientation (1.3.4, AA).
                  </strong>{" "}
                  Do not lock the screen to portrait or landscape. Many users
                  mount their phone in a fixed orientation on a wheelchair or a
                  stand, or simply prefer one way; locking excludes them unless a
                  specific orientation is truly essential (a piano app, a
                  cheque-scanning camera). On iOS this means not restricting{" "}
                  <code>supportedInterfaceOrientations</code> without cause; on
                  Android, avoid a hardcoded{" "}
                  <code>android:screenOrientation</code>.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <strong className="text-slate-900 dark:text-white">
                    Reflow (1.4.10, AA).
                  </strong>{" "}
                  Content must work at a viewport 320 CSS pixels wide (equivalent
                  to a 1280px page zoomed to 400%) without the user having to
                  scroll in two directions to read a line. On mobile web that
                  means responsive layout and no fixed-width containers; in native
                  apps it means letting content wrap and grow when text gets
                  bigger, using Auto Layout / constraints rather than fixed
                  frames.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <strong className="text-slate-900 dark:text-white">
                    Text scaling (1.4.4, AA).
                  </strong>{" "}
                  This is the criterion mobile teams miss most, because on the web
                  &ldquo;resize text&rdquo; means browser zoom, but on a phone it
                  means the{" "}
                  <strong className="text-slate-900 dark:text-white">
                    system-wide font-size setting
                  </strong>{" "}
                  &mdash; iOS Dynamic Type and Android font scale, which users can
                  push well past 200%. Hardcoded point or pixel sizes ignore it
                  entirely. Use the platform text styles so type grows with the
                  setting, and test your layouts at the largest size &mdash; that
                  is where reflow, clipping, and truncation problems surface. On
                  mobile web, honoring this means{" "}
                  <strong className="text-slate-900 dark:text-white">
                    never
                  </strong>{" "}
                  setting <code>user-scalable=no</code> or{" "}
                  <code>maximum-scale=1</code> in the viewport tag (covered in
                  section 6).
                </p>
              </div>
            </div>
          </section>

          {/* 4. Native iOS */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                4. Native iOS Accessibility (UIKit &amp; SwiftUI)
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  iOS exposes your UI to VoiceOver, Voice Control, and Switch
                  Control through the <code>UIAccessibility</code> API. The four
                  properties that map onto WCAG&apos;s Name, Role, Value are{" "}
                  <code>accessibilityLabel</code> (name),{" "}
                  <code>accessibilityTraits</code> (role),{" "}
                  <code>accessibilityValue</code> (value), and the state carried
                  in the traits. Standard controls come wired up; custom views and
                  icon-only buttons are where you do the work.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  UIKit
                </h3>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`// An icon-only button with no visible text
let favoriteButton = UIButton(type: .system)
favoriteButton.setImage(UIImage(named: "heart"), for: .normal)

// VoiceOver needs a name, a role, and (optionally) a hint:
favoriteButton.isAccessibilityElement = true
favoriteButton.accessibilityLabel = "Favorite"                 // name
favoriteButton.accessibilityTraits = .button                   // role
favoriteButton.accessibilityHint  = "Adds this article to your favorites"

// Announce an async change VoiceOver would otherwise miss:
UIAccessibility.post(notification: .announcement,
                     argument: "Added to favorites")

// Decorative image: take it out of the accessibility tree
decorImageView.isAccessibilityElement = false

// Text must respect the user's Dynamic Type setting:
titleLabel.font = UIFont.preferredFont(forTextStyle: .headline)
titleLabel.adjustsFontForContentSizeCategory = true`}</code></pre>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  SwiftUI
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  SwiftUI generates accessibility from your view tree, so most
                  controls are labeled for free. You add modifiers to name
                  icon-only controls, group related views into a single swipe
                  stop, and hide decoration. System text styles scale with Dynamic
                  Type automatically.
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`Button(action: toggleFavorite) {
    Image(systemName: "heart")            // decorative glyph inside the button
}
.accessibilityLabel("Favorite")          // name; the .isButton trait is automatic
.accessibilityHint("Adds this article to your favorites")

// Collapse a rating row into ONE element with a combined label:
HStack {
    Image(systemName: "star.fill")
    Text("4.8")
    Text("(120 reviews)")
}
.accessibilityElement(children: .combine)   // reads "star, 4.8, 120 reviews" as one stop

// Hide a purely decorative image:
Image("hero-pattern").accessibilityHidden(true)

// System text styles scale with Dynamic Type automatically:
Text("Order summary").font(.headline)`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Add a role trait when a custom view acts like a control:{" "}
                  <code>.accessibilityAddTraits(.isButton)</code>,{" "}
                  <code>.isHeader</code>, or <code>.isSelected</code>. For values
                  that change, keep <code>accessibilityValue</code> in sync so a
                  slider announces &ldquo;50 percent,&rdquo; not just its label.
                  When you scale custom dimensions with the font size, use{" "}
                  <code>@ScaledMetric</code> so padding and icons grow alongside
                  the text.
                </p>
              </div>
            </div>
          </section>

          {/* 5. Native Android */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                5. Native Android Accessibility (View &amp; Jetpack Compose)
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Android surfaces your UI to TalkBack, Switch Access, and Voice
                  Access through the accessibility node tree. In the classic View
                  system you annotate views with XML attributes and delegates; in
                  Jetpack Compose you describe semantics declaratively.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  View system
                </h3>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<!-- Icon-only control: give it a name and a 48dp target -->
<ImageButton
    android:id="@+id/favorite"
    android:src="@drawable/ic_heart"
    android:contentDescription="@string/favorite"
    android:minWidth="48dp"
    android:minHeight="48dp" />

<!-- Associate a visible label with its input -->
<TextView
    android:id="@+id/emailLabel"
    android:text="@string/email"
    android:labelFor="@+id/email" />
<EditText
    android:id="@+id/email"
    android:textSize="16sp" />   <!-- sp, not dp, so text scales -->

<!-- Decorative image: keep it out of the tree -->
<ImageView
    android:src="@drawable/pattern"
    android:importantForAccessibility="no" />`}</code></pre>
                </div>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`// Announce an async change to TalkBack
favoriteButton.announceForAccessibility(
    getString(R.string.added_to_favorites)
)`}</code></pre>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Jetpack Compose
                </h3>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`// Icon-only button: label it; Material enforces a 48dp touch target
IconButton(onClick = ::toggleFavorite) {
    Icon(
        imageVector = Icons.Default.Favorite,
        contentDescription = "Favorite"   // null would mark it decorative
    )
}

// Merge a rating row into one node with a combined description:
Row(
    modifier = Modifier.semantics(mergeDescendants = true) {}
) {
    Icon(Icons.Default.Star, contentDescription = null)
    Text("4.8")
    Text("(120 reviews)")
}

// A live region announces its own updates, no manual event needed:
Text(
    text = statusMessage,
    modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite }
)

// Text in sp scales with the OS font-size setting:
Text("Order summary", fontSize = 16.sp)`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Expose role and state through the semantics block &mdash;{" "}
                  <code>role = Role.Button</code>,{" "}
                  <code>stateDescription</code>, <code>selected</code>,{" "}
                  <code>toggleableState</code> &mdash; and use{" "}
                  <code>Modifier.clearAndSetSemantics</code> when you need to
                  replace a subtree&apos;s auto-generated description with a single
                  clean one. TalkBack, like VoiceOver, moves focus by swipe, so
                  reading order follows the semantics tree; check it matches the
                  visual order.
                </p>
              </div>
            </div>
          </section>

          {/* 6. Mobile web */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                6. Mobile Web Accessibility
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  On mobile web the accessibility tree is built for you: write
                  semantic HTML &mdash; real <code>&lt;button&gt;</code> and{" "}
                  <code>&lt;a href&gt;</code>, labeled inputs, headings, and{" "}
                  <Link href="/reference/aria" className="text-blue-600 dark:text-blue-400 hover:underline">
                    ARIA
                  </Link>{" "}
                  only where HTML falls short &mdash; and Safari with VoiceOver or
                  Chrome with TalkBack turns it into something a screen reader can
                  navigate. Everything in our{" "}
                  <Link href="/guides/keyboard-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                    keyboard accessibility
                  </Link>{" "}
                  and{" "}
                  <Link href="/guides/accessible-forms" className="text-blue-600 dark:text-blue-400 hover:underline">
                    accessible forms
                  </Link>{" "}
                  guides applies. The mobile-web-specific work is smaller and
                  concentrated:
                </p>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  <strong className="text-slate-900 dark:text-white">
                    The viewport tag is the number-one mobile-web bug.
                  </strong>{" "}
                  Disabling zoom to stop your layout from &ldquo;breaking&rdquo;
                  is an accessibility failure &mdash; low-vision users rely on
                  pinch-zoom.
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<!-- Correct: users can pinch-zoom -->
<meta name="viewport" content="width=device-width, initial-scale=1" />

<!-- Wrong: blocks zoom, fails WCAG 1.4.4 -->
<meta name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Beyond the viewport: give touch targets a real CSS hit area
                  (section 1); make layouts reflow at 320px so nothing needs
                  horizontal scrolling; and show focus with{" "}
                  <code>:focus-visible</code> so keyboard and switch users get a
                  clear indicator without it flashing on every tap.
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`.icon-button:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Finally, watch <strong className="text-slate-900 dark:text-white">hover-only content</strong>{" "}
                  &mdash; there is no hover on touch, so tooltips and menus that
                  only appear on <code>:hover</code> are unreachable. Make them
                  open on tap/focus and stay dismissible, per{" "}
                  <Link href="/wcag/1-4-13" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.13 Content on Hover or Focus
                  </Link>
                  . React Native and Flutter each have their own accessibility
                  APIs that mirror the native ones above (
                  <code>accessibilityLabel</code>/<code>accessibilityRole</code>{" "}
                  in React Native, <code>Semantics</code> widgets in Flutter);
                  the same Name/Role/Value discipline carries over.
                </p>
              </div>
            </div>
          </section>

          {/* 7. Screen readers on mobile */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                7. Screen Readers on Mobile: VoiceOver &amp; TalkBack
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Mobile screen readers work differently from desktop ones. There
                  is no mouse and no separate keyboard focus &mdash; the user{" "}
                  <strong className="text-slate-900 dark:text-white">
                    explores by touch
                  </strong>{" "}
                  (drag a finger to hear whatever is under it) or{" "}
                  <strong className="text-slate-900 dark:text-white">
                    swipes linearly
                  </strong>{" "}
                  (flick right to the next element, left to the previous), and{" "}
                  <strong className="text-slate-900 dark:text-white">
                    double-taps anywhere
                  </strong>{" "}
                  to activate whatever is focused. Because the screen reader owns
                  single-finger swipes, any swipe gesture your UI needs must have
                  a button alternative &mdash; this is the concrete reason 2.5.1
                  exists.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Both screen readers offer a rotor-style control for jumping by
                  headings, links, or form controls, which is exactly why
                  semantic structure matters: without real headings and labels
                  there is nothing to jump between. Test on both platforms, since
                  they expose different bugs.
                </p>
                <div className="grid gap-4 sm:grid-cols-2 not-prose my-4">
                  <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-950">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                      VoiceOver (iOS)
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Enable with Settings &rarr; Accessibility &rarr; VoiceOver,
                      or triple-click the side button. Swipe to move, double-tap
                      to activate, use the Rotor (two-finger rotate) to change
                      navigation mode. Our{" "}
                      <Link href="/guides/voiceover-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                        VoiceOver testing guide
                      </Link>{" "}
                      has the full gesture set for iOS and macOS.
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-950">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                      TalkBack (Android)
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Enable with Settings &rarr; Accessibility &rarr; TalkBack,
                      or hold both volume keys. Swipe to move, double-tap to
                      activate, swipe up-then-down (or a three-finger swipe) to
                      change reading controls. Our{" "}
                      <Link href="/guides/talkback-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                        TalkBack testing guide
                      </Link>{" "}
                      covers the gestures and the mobile-only criteria it exposes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 8. Testing */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                8. Testing Mobile Accessibility
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Use a two-layer workflow: automated tools to catch the
                  mechanical failures fast, then a manual pass on a real device
                  for everything a tool cannot judge. Automated checks find
                  roughly a third of issues; the manual pass finds the rest.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Automated
                </h3>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-1">
                  <li>
                    <strong className="text-slate-900 dark:text-white">iOS:</strong>{" "}
                    Xcode&apos;s <strong className="text-slate-900 dark:text-white">Accessibility Inspector</strong>{" "}
                    (audit a running app for missing labels, small targets, and
                    contrast) and <code>XCTest</code> accessibility audits.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">Android:</strong>{" "}
                    the <strong className="text-slate-900 dark:text-white">Accessibility Scanner</strong>{" "}
                    app and the Espresso <code>AccessibilityChecks</code>
                    integration in instrumented tests.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">Mobile web:</strong>{" "}
                    axe DevTools and Lighthouse against a mobile viewport &mdash;
                    or scan a live URL with our{" "}
                    <Link href="/tools/mobile-accessibility-checker" className="text-blue-600 dark:text-blue-400 hover:underline">
                      mobile accessibility checker
                    </Link>
                    .
                  </li>
                </ul>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Manual, on a real phone
                </h3>
                <ol className="text-muted-foreground leading-relaxed mb-4 list-decimal pl-6 space-y-1">
                  <li>
                    Turn on the screen reader (VoiceOver / TalkBack) and complete
                    each key task by swiping only &mdash; every control should
                    announce a clear name and role.
                  </li>
                  <li>
                    Crank the system font size to its maximum and confirm nothing
                    clips, truncates, or overlaps; scroll still reaches
                    everything.
                  </li>
                  <li>
                    Rotate the device &mdash; the layout should adapt, not lock or
                    break.
                  </li>
                  <li>
                    Try every gesture-driven action with a single tap; check for a
                    button alternative.
                  </li>
                  <li>
                    Tap near the edges of small controls to feel whether the hit
                    area is really 44pt / 48dp.
                  </li>
                </ol>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Emulators help for a first look, but the gesture feel, real
                  screen-reader focus order, and target ergonomics only show up on
                  hardware.
                </p>
              </div>
            </div>
          </section>

          {/* Anti-patterns */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Common Mobile Mistakes &amp; How to Fix Them
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common mobile accessibility anti-patterns, why they fail, and
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
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ListChecks className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                Mobile Accessibility Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Names on everything.</strong>{" "}
                  Every control has a name via{" "}
                  <code>accessibilityLabel</code> /{" "}
                  <code>contentDescription</code> / <code>aria-label</code> or a
                  visible label; decorative images are hidden.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Roles &amp; state.</strong>{" "}
                  Buttons, headers, and selected/checked states are exposed
                  through traits, semantics, or ARIA &mdash; not conveyed by
                  visuals alone.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Touch targets.</strong>{" "}
                  At least 24&times;24 CSS px (WCAG floor); build to 44pt (iOS) /
                  48dp (Android) with real spacing.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Gestures.</strong>{" "}
                  No path-based or multipoint gesture is the only way to do
                  something; each has a single-tap alternative.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Cancellation &amp; motion.</strong>{" "}
                  Actions fire on the up-event with undo; shake/tilt features have
                  a UI control and an off switch.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Orientation &amp; reflow.</strong>{" "}
                  Both orientations supported; content reflows at 320px with no
                  two-dimensional scrolling.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Text scaling.</strong>{" "}
                  Type uses Dynamic Type / sp units; on web the viewport allows
                  zoom (no <code>user-scalable=no</code>). Tested at the largest
                  size.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Focus &amp; reading order.</strong>{" "}
                  Screen-reader order matches visual order; keyboard/switch focus
                  is visible.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Announcements.</strong>{" "}
                  Async changes announce via{" "}
                  <code>UIAccessibility.post</code> /{" "}
                  <code>announceForAccessibility</code> / live region /{" "}
                  <code>aria-live</code>.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Real-device pass.</strong>{" "}
                  Verified with VoiceOver <em>and</em> TalkBack plus the
                  Accessibility Inspector / Scanner, not just an emulator.
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Scan a live mobile page with our{" "}
                <Link href="/tools/mobile-accessibility-checker" className="text-blue-600 dark:text-blue-400 hover:underline">
                  mobile accessibility checker
                </Link>{" "}
                and work through the full{" "}
                <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG 2.2 checklist
                </Link>
                .
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Check Your Mobile Experience in Seconds
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Run any live page through our free mobile accessibility checker
                  to flag touch-target, viewport, and responsive-layout problems
                  &mdash; then work through the native and manual checks above.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/tools/mobile-accessibility-checker">
                      Check a Page Now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link href="/guides/wcag-2-2-aa-requirements">
                      WCAG 2.2 AA Requirements
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
                content="mobile accessibility ios android mobile web native app touch target size 44pt 48dp pointer gestures 2.5.1 pointer cancellation 2.5.2 motion actuation 2.5.4 orientation 1.3.4 reflow 1.4.10 resize text 1.4.4 dynamic type font scale voiceover talkback swiftui uikit accessibilitylabel jetpack compose semantics contentdescription wcag2ict screen reader keyboard focus name role value 4.1.2 wcag 2.2 aa"
                title="Related Guides & Tools"
                maxItems={6}
                showDescriptions={true}
                excludeUrl="/guides/mobile-accessibility"
              />
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
