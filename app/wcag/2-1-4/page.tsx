import { Metadata } from 'next'
import Link from "next/link"
import { BreadcrumbStructuredData } from '@/components/seo/structured-data'
import WCAGSEOEnhancements from '@/components/wcag/seo-enhancements'
import { CriterionLinks } from "@/components/wcag/criterion-links"
import ShortcutDemo from "./interactive-demo"

export const metadata: Metadata = {
  title: 'WCAG 2.1.4 Character Key Shortcuts - Interactive Demo',
  description: 'Master WCAG 2.1.4 Character Key Shortcuts with interactive demos, shortcut management, and comprehensive implementation examples.',
  keywords: [
    'WCAG 2.1.4',
    'Character Key Shortcuts',
    'Level A',
    'keyboard shortcuts',
    'single key shortcuts',
    'accessibility compliance',
    'web accessibility',
    'WCAG 2.2',
    'key bindings',
    'shortcut management'
  ],
  authors: [{ name: 'Accessibility.build Team' }],
  creator: 'Accessibility.build',
  publisher: 'Accessibility.build',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://accessibility.build/wcag/2-1-4',
  },
  openGraph: {
    title: 'WCAG 2.1.4 Character Key Shortcuts (Level A) - Interactive Demo',
    description: 'Master WCAG 2.1.4 Character Key Shortcuts with interactive demos and implementation guidance.',
    url: '/wcag/2-1-4',
    siteName: 'Accessibility.build',
    locale: 'en_US',
    type: 'article',
    images: [
      {
        url: '/api/og?title=WCAG%202.1.4%20Character%20Key%20Shortcuts&section=WCAG',
        width: 1200,
        height: 630,
        alt: 'WCAG 2.1.4 Character Key Shortcuts (Level A) - Interactive Demo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WCAG 2.1.4 Character Key Shortcuts (Level A) - Interactive Demo',
    description: 'Master WCAG 2.1.4 Character Key Shortcuts with interactive demos and implementation guidance.',
    images: ['/api/og?title=WCAG%202.1.4%20Character%20Key%20Shortcuts&section=WCAG'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const faqs = [
  {
    q: "What does WCAG 2.1.4 Character Key Shortcuts require?",
    a: "If your content implements a keyboard shortcut using only a single character — a letter (upper or lower case), a number, punctuation, or a symbol, with no modifier key — then at least one of three things must be true: there is a mechanism to turn the shortcut off; there is a mechanism to remap it to a combination that uses one or more non-printable keys such as Ctrl or Alt; or the shortcut is only active when the specific component it belongs to has focus. Meeting any one of the three satisfies the criterion. It is a Level A criterion added in WCAG 2.1.",
  },
  {
    q: "Do shortcuts like Ctrl+S or Alt+K need to meet 2.1.4?",
    a: "No. The criterion applies only to shortcuts triggered by a single printable character key on its own. As soon as a shortcut requires a modifier or non-printable key — Ctrl, Alt, Cmd, or a function key — it is out of scope, because speech input and accidental key presses are extremely unlikely to reproduce that combination. So Ctrl+S, Alt+Shift+K, and F6 are all inherently fine and do not need a turn-off, remap, or focus-scoping mechanism.",
  },
  {
    q: "Why are single-character shortcuts a problem for speech-input users?",
    a: "People who control their computer by voice are constantly emitting streams of character strings as they dictate. If a page listens for a bare 's' or '/' anywhere on the document, dictation can silently fire those shortcuts — starring a message, opening search, deleting content — with no way for the user to predict or prevent it. The same accidental activation hits people with tremors or limited dexterity who brush against keys. Turning the shortcut off, requiring a modifier, or scoping it to a focused widget all remove the hazard.",
  },
  {
    q: "Is providing button alternatives enough to pass 2.1.4?",
    a: "No. Offering an on-screen button that performs the same action is good practice, but it does not satisfy 2.1.4 on its own. The criterion is about preventing the single-key shortcut from firing unintentionally, so you must still supply one of the three specific remedies: an off switch, a remap to a modifier combination, or focus-scoping. Documentation and visible hints are helpful but also do not, by themselves, meet the requirement.",
  },
  {
    q: "How is 2.1.4 different from 2.1.1 Keyboard?",
    a: "2.1.1 Keyboard is about making functionality operable — everything you can do with a mouse must also be reachable and usable with a keyboard. 2.1.4 works in the opposite direction: it protects users from a keyboard shortcut firing when they did not intend it. A page can pass 2.1.1 (all features are keyboard-operable) and still fail 2.1.4 (a global single-key shortcut has no off switch and interferes with dictation). Think of 2.1.1 as 'can you operate it' and 2.1.4 as 'can you avoid triggering it by accident'.",
  },
]

export default function WCAG214Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 2.1.4: Character Key Shortcuts"
        description="If a keyboard shortcut is implemented in content using only letter, punctuation, number, or symbol characters, then a mechanism is available to turn the shortcut off, remap it, or make it active only on focus."
        criteria="2.1.4"
        level="A"
        principle="Operable"
        guideline="2.1 Keyboard Accessible"
        url="https://accessibility.build/wcag/2-1-4"
        category="Keyboard Accessible"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: 'Home', url: 'https://accessibility.build' },
          { name: 'WCAG Success Criteria', url: 'https://accessibility.build/wcag' },
          { name: '2.1.4 Character Key Shortcuts', url: 'https://accessibility.build/wcag/2-1-4' },
        ]}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
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
                    href="/wcag"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    WCAG Success Criteria
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">
                  /
                </li>
                <li>
                  <span className="text-slate-900 dark:text-white font-medium">
                    2.1.4 Character Key Shortcuts
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                Level A
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 2: Operable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                Stops accidental single-key triggers
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 2.1.4: Character Key Shortcuts
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              A shortcut that fires on a bare{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-lg">
                s
              </code>{" "}
              or{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-lg">
                /
              </code>{" "}
              is a trap for anyone who types by voice or struggles to hit keys precisely.
              This criterion asks that any single-character keyboard shortcut can be{" "}
              <strong className="text-slate-900 dark:text-white">
                turned off, remapped to use a modifier key, or scoped so it only works
                when the relevant component has focus
              </strong>
              . Provide any one of those three, and the shortcut stops firing by accident.
            </p>
          </header>

          {/* Official text callout */}
          <section
            aria-labelledby="official-text"
            className="mb-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-6"
          >
            <h2
              id="official-text"
              className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3"
            >
              The success criterion, in full
            </h2>
            <blockquote className="text-slate-700 dark:text-slate-300 leading-relaxed border-l-4 border-blue-500 pl-4">
              If a keyboard shortcut is implemented in content using only letter
              (including upper- and lower-case letters), punctuation, number, or symbol
              characters, then at least one of the following is true:{" "}
              <strong>Turn off:</strong> A mechanism is available to turn the keyboard
              shortcut off. <strong>Remap:</strong> A mechanism is available to remap the
              shortcut to use one or more non-printable keyboard keys (e.g., Ctrl, Alt).{" "}
              <strong>Active only on focus:</strong> The keyboard shortcut for a user
              interface component is only active when that component has focus.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              The rule targets a narrow, high-risk pattern: shortcuts bound to a single
              printable character with no modifier. Any one of the three remedies is
              enough. Shortcuts that already require a modifier or non-printable key are
              outside the scope of this criterion and need no additional mechanism.
            </p>
          </section>

          {/* On this page */}
          <nav
            aria-label="On this page"
            className="mb-12 rounded-xl border border-slate-200 dark:border-slate-800 p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
              On this page
            </h2>
            <ul className="grid sm:grid-cols-2 gap-2 text-blue-600 dark:text-blue-400">
              <li>
                <a className="hover:underline" href="#who-it-helps">
                  Who this helps
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#requirement">
                  What the requirement covers
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#pass-fail">
                  Pass and fail examples
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#code">
                  Code examples
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#demo">
                  Interactive demo
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#mistakes">
                  Common failures
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#testing">
                  How to test
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#faq">
                  FAQ
                </a>
              </li>
            </ul>
          </nav>

          {/* Who it helps */}
          <section aria-labelledby="who-it-helps" className="mb-12">
            <h2
              id="who-it-helps"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Who this helps
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Single-key shortcuts are convenient for the people who know them and a
              minefield for the people who do not. Controlling them protects several
              groups at once:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "Speech-input users",
                  d: "Voice-control users dictate continuously, emitting exactly the character strings a global single-key shortcut listens for. Without an off switch or focus-scoping, dictation can fire actions the user never intended.",
                },
                {
                  t: "People with tremor or limited dexterity",
                  d: "An unsteady hand brushes extra keys. When a stray keystroke doubles as an app-wide command, the result is deleted content, lost context, or unexpected navigation.",
                },
                {
                  t: "Keyboard-only users",
                  d: "People who navigate entirely by keyboard are the most likely to land on stray characters between fields, and to be surprised when one of them triggers a hidden global command.",
                },
                {
                  t: "Screen reader users",
                  d: "Screen readers reserve many single keys for their own quick-navigation commands. A page that also claims those keys creates conflicts that make both the reader and the page harder to operate.",
                },
                {
                  t: "Switch and alternative-input users",
                  d: "People using switch access or on-screen keyboards can emit characters in ways the designer never anticipated; predictable, controllable shortcuts keep those inputs from misfiring.",
                },
                {
                  t: "Everyone, occasionally",
                  d: "Anyone can rest a hand on the keyboard or paste text into the wrong place. A remap-to-modifier or focus-scoped design means an accidental keystroke stays harmless.",
                },
              ].map((item) => (
                <div
                  key={item.t}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-5"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                    {item.t}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {item.d}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Requirement */}
          <section aria-labelledby="requirement" className="mb-12">
            <h2
              id="requirement"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              What the requirement covers
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              The trigger for this criterion is specific: a keyboard shortcut bound to a{" "}
              <strong className="text-slate-900 dark:text-white">
                single printable character
              </strong>
              {" "}— a letter such as{" "}
              <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">a</code>{" "}
              or{" "}
              <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">B</code>,
              a number like{" "}
              <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">3</code>,
              or punctuation and symbols like{" "}
              <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">?</code>{" "}
              and{" "}
              <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">/</code>{" "}
              — with no modifier key held. When that pattern exists, you must provide at
              least one of these three mechanisms:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                {
                  t: "Turn off",
                  d: "Give users a mechanism to disable character-key shortcuts entirely — a settings toggle, a preference, or a per-shortcut switch. Once off, no bare keystroke fires a command.",
                },
                {
                  t: "Remap to a non-printable key",
                  d: "Let users reassign the shortcut to a combination that includes at least one non-printable key such as Ctrl or Alt. A modifier-based shortcut is effectively impossible to trigger by dictation or a stray keystroke.",
                },
                {
                  t: "Active only on focus",
                  d: "Scope the shortcut so it fires only when its specific component has focus. A media player that responds to 'k' only while the player is focused cannot interfere with typing elsewhere on the page.",
                },
              ].map((item) => (
                <li
                  key={item.t}
                  className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4"
                >
                  <span aria-hidden="true" className="text-blue-500 font-bold">
                    →
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong className="text-slate-900 dark:text-white">{item.t}.</strong>{" "}
                    {item.d}
                  </span>
                </li>
              ))}
            </ul>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              What is out of scope
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Shortcuts that require a modifier or a non-printable key are inherently fine
              and need no extra mechanism:{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">Ctrl+S</code>,{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">Alt+K</code>,
              and function keys are all outside 2.1.4 because voice input and accidental
              presses will not reproduce them. This is the difference between 2.1.4 and{" "}
              <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                2.1.1 Keyboard
              </Link>
              : 2.1.1 is about making features operable by keyboard at all, while 2.1.4 is
              about preventing a shortcut from being triggered unintentionally.
            </p>
          </section>

          {/* Pass / fail */}
          <section aria-labelledby="pass-fail" className="mb-12">
            <h2
              id="pass-fail"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Pass and fail examples
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-950/20 p-5">
                <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3">
                  ✓ Passes 2.1.4
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    A mail app with single-key shortcuts plus a settings toggle to turn
                    keyboard shortcuts off.
                  </li>
                  <li>
                    A shortcut editor that lets users remap{" "}
                    <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-800 font-mono text-xs">s</code>{" "}
                    to{" "}
                    <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-800 font-mono text-xs">Ctrl+S</code>.
                  </li>
                  <li>
                    A video player where{" "}
                    <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-800 font-mono text-xs">k</code>{" "}
                    pauses playback only while the player has focus.
                  </li>
                  <li>
                    An app whose only shortcuts already require modifiers (Ctrl, Alt) —
                    the criterion does not even apply.
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-3">
                  ✗ Fails 2.1.4
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    A global{" "}
                    <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-800 font-mono text-xs">j</code>/<code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-800 font-mono text-xs">k</code>{" "}
                    navigation that is always on with no way to disable it.
                  </li>
                  <li>
                    Pressing{" "}
                    <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-800 font-mono text-xs">/</code>{" "}
                    anywhere jumps to search, with no off switch, remap, or focus scope.
                  </li>
                  <li>
                    A single-letter &ldquo;star&rdquo; command that fires document-wide
                    and cannot be turned off.
                  </li>
                  <li>
                    Undocumented single-key shortcuts active everywhere, interfering with
                    dictation into form fields.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Code examples */}
          <section aria-labelledby="code" className="mb-12">
            <h2
              id="code"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Code examples
            </h2>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              The failure: an always-on global shortcut
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              A bare key handler on{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">document</code>{" "}
              with no off switch, no remap, and no focus check is the classic 2.1.4
              violation.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`// ✗ Fires on every bare keystroke, everywhere, always
document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 's': starMessage();   break; // dictating "s" stars a message
    case '/': focusSearch();   break; // typing "/" jumps to search
    case 'c': composeNew();    break;
  }
})`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Remedy 1 &amp; 2: an off switch and a modifier requirement
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Guard the handler with a user preference (turn off) and skip anything that
              carries a modifier so a remapped{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">Ctrl+S</code>{" "}
              can pass through untouched. Also ignore keystrokes aimed at text fields.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`// ✓ Respects a "shortcuts off" preference and modifier remaps
let shortcutsEnabled = loadUserPref('charKeyShortcuts', true)

document.addEventListener('keydown', (e) => {
  if (!shortcutsEnabled) return                 // (1) turn off
  if (e.ctrlKey || e.altKey || e.metaKey) return // (2) modifier = out of scope

  // Never hijack keys while the user is typing
  const t = e.target
  if (t.matches('input, textarea, [contenteditable]')) return

  if (e.key === 's') { e.preventDefault(); starMessage() }
})`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Remedy 3: active only on focus
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Bind the shortcut to the component itself rather than the document, so it
              can only fire while that component holds focus.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✓ "k" toggles play only while the player is focused -->
<div class="video-player" tabindex="0">
  <!-- controls … -->
</div>

<script>
  const player = document.querySelector('.video-player')
  // Listener is on the player, not on document
  player.addEventListener('keydown', (e) => {
    if (e.key === 'k') { e.preventDefault(); togglePlay() }
  })
</script>`}</code>
            </pre>
          </section>

          {/* Interactive demo */}
          <section aria-labelledby="demo" className="mb-12">
            <h2
              id="demo"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Interactive demo
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Press{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">s</code>{" "}
              to fire a &ldquo;star&rdquo; shortcut and watch the log. Then toggle the
              shortcut off, switch it to focus-only mode, and try typing in the text field
              to see how each remedy stops the shortcut from firing by accident.
            </p>
            <ShortcutDemo />
          </section>

          {/* Common failures */}
          <section aria-labelledby="mistakes" className="mb-12">
            <h2
              id="mistakes"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Common failures
            </h2>
            <ul className="space-y-3">
              {[
                "App-wide single-key shortcuts (Gmail-style j/k to move, s to star, c to compose) that are always active globally with no off switch.",
                "A single '/' or 'f' bound document-wide to focus search, firing while the user dictates or types outside a field.",
                "Single-letter commands with no remap option, so a user cannot move them to a modifier combination.",
                "Shortcuts that stay active while focus is in a text input, so dictation and typing trigger unintended actions.",
                "Undocumented hidden shortcuts users cannot discover, disable, or predict.",
                "Assuming an on-screen button alternative is enough — it does not remove the accidental-activation hazard the criterion targets.",
                "Treating documentation of the shortcuts as compliance; listing them does not turn them off, remap them, or scope them to focus.",
              ].map((m) => (
                <li
                  key={m}
                  className="flex gap-3 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-4"
                >
                  <span aria-hidden="true" className="text-rose-500 font-bold">
                    ✗
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {m}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Testing */}
          <section aria-labelledby="testing" className="mb-12">
            <h2
              id="testing"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              How to test for 2.1.4
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Enumerate every single-character shortcut",
                  d: "Review the interface and its documentation, then press single keys — letters, numbers, punctuation, symbols — with no modifier held, in different parts of the page. List every bare-character key that triggers an action.",
                },
                {
                  t: "Confirm one of the three remedies for each",
                  d: "For every shortcut you found, verify at least one is true: there is a mechanism to turn it off, a mechanism to remap it to a modifier combination, or it only fires while its component has focus. Any single one passes.",
                },
                {
                  t: "Check the modifier boundary",
                  d: "Shortcuts that already require Ctrl, Alt, Cmd, or a function key are out of scope. Confirm the in-scope set is only the bare single-character shortcuts, so you test the right things.",
                },
                {
                  t: "Run the speech-input scenario",
                  d: "Dictate a sentence into a text field (or type a long string). No global shortcut should fire from the characters. If it does, the shortcut is not focus-scoped or disabled and the page fails.",
                },
                {
                  t: "Exercise the off switch and remap UI",
                  d: "If the page relies on turn-off or remap, actually use those controls: disable shortcuts and confirm the bare keys go silent; remap one to a modifier and confirm the single key no longer triggers it.",
                },
                {
                  t: "Verify focus scoping is real",
                  d: "For focus-only shortcuts, move focus away from the component and confirm the key no longer does anything. A shortcut that still fires from elsewhere is effectively global.",
                },
              ].map((step, i) => (
                <li
                  key={step.t}
                  className="flex gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-5"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      {step.t}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {step.d}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-5">
              For a structured audit, work through the full{" "}
              <Link
                href="/checklists/wcag-2-2"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                WCAG 2.2 checklist
              </Link>
              .
            </p>
          </section>

          {/* Related criteria */}
          <CriterionLinks number="2.1.4" />

          {/* FAQ */}
          <section aria-labelledby="faq" className="mb-4">
            <h2
              id="faq"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-6"
            >
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-xl border border-slate-200 dark:border-slate-800 p-5 [&_summary]:cursor-pointer"
                >
                  <summary className="font-semibold text-slate-900 dark:text-white list-none flex items-center justify-between gap-4">
                    {f.q}
                    <span
                      aria-hidden="true"
                      className="text-slate-400 group-open:rotate-180 transition-transform"
                    >
                      ▾
                    </span>
                  </summary>
                  <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
