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
  ToggleRight,
  Keyboard,
  ShieldCheck,
  ListChecks,
  Layers,
  GitBranch,
  AlertTriangle,
  Code2,
  Contrast,
  Sparkles,
  Focus,
} from "lucide-react"

const pageTitle = "Accessible Switch & Toggle Guide (role=switch + aria-checked)"
const pageDescription =
  "A toggle switch is not a checkbox. This guide covers role=\"switch\" and aria-checked, when a switch is the right control and when a checkbox is, the native <input type=checkbox role=switch> path that needs almost no JavaScript, keeping the accessible name constant as the state moves, non-text contrast for the track and thumb, immediate-effect semantics, and React — with copy-ready code mapped to WCAG 2.2."

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "accessible switch",
    "accessible toggle",
    "toggle switch accessibility",
    "role switch",
    "aria-checked",
    "switch vs checkbox",
    "aria switch pattern",
    "toggle button accessibility",
    "on off switch accessibility",
    "wai-aria switch pattern",
    "accessible toggle switch html",
    "switch keyboard accessibility",
    "react accessible switch",
    "switch screen reader",
    "non-text contrast switch",
    "switch aria label",
    "wcag toggle switch",
  ],
  alternates: {
    canonical: "/guides/accessible-switch",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/accessible-switch",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Accessible Switch & Toggle Guide")}&section=Guide`,
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
        url: `/api/og?title=${encodeURIComponent("Accessible Switch & Toggle Guide")}&section=Guide`,
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
    name: "Accessible Switch & Toggle Guide",
    url: "https://accessibility.build/guides/accessible-switch",
  },
]

const faqs = [
  {
    question: "What is the difference between a switch and a checkbox?",
    answer:
      "They answer different questions. A checkbox answers \"is this selected?\" and its natural home is a form the user reviews and then submits — the change is provisional until they press Save. A switch answers \"is this on or off?\" and its change is expected to take effect the moment it is flipped, like a light switch on a wall. So a settings row that turns Wi-Fi on immediately is a switch; a \"remember me\" box or a list of interests you tick before submitting is a checkbox. When either could technically work, ask whether the user expects an instant result: if yes, use a switch (role=\"switch\" with aria-checked); if the choice is only committed on submit, use a checkbox. Do not use a switch merely because it looks more modern — the on/off metaphor is a promise about immediacy.",
  },
  {
    question: "How do I make an accessible toggle switch in HTML?",
    answer:
      "The shortest correct path is a native checkbox with the switch role: <input type=\"checkbox\" role=\"switch\">, wired to a real <label>. You keep everything the browser already gives a checkbox — the label association, keyboard support, focus handling, and form participation — and the single role attribute changes how assistive technology announces it, from \"checkbox, checked\" to \"switch, on\". The checkbox's checked state is mapped to aria-checked for you, so there is no state to synchronise by hand. Style the visual track and thumb with CSS on the label; the input itself can be visually hidden but must stay in the accessibility tree, never display:none. Reach for a <button role=\"switch\"> only when the control is a purely app-like toggle that never participates in a form.",
  },
  {
    question: "Which key toggles a switch?",
    answer:
      "Space. A switch built on a native checkbox toggles with Space and does nothing on Enter, which is exactly the checkbox behaviour and is what screen reader users expect. A switch built from a <button role=\"switch\"> should toggle on both Space and Enter, because that is how buttons behave and you are responsible for the key handling. Either way the control must be reachable with Tab and must show a visible focus indicator. Arrow keys are not part of the switch pattern — a lone switch is a single control, not a composite widget, so there is nothing for arrows to move between.",
  },
  {
    question: "Should the label of a switch change when it is toggled on and off?",
    answer:
      "No. The accessible name must stay constant — it describes what the switch controls, such as \"Dark mode\" or \"Wi-Fi\", and it should read the same whether the switch is on or off. The on/off value is carried separately by aria-checked, which the screen reader announces alongside the name (\"Dark mode, switch, on\"). If you swap the visible or accessible label between \"On\" and \"Off\" as the user toggles, you break that model: the state ends up encoded in the name, screen readers may announce contradictory things, and speech-recognition users can no longer say a stable command like \"click Dark mode\". Keep the name fixed and let aria-checked do the work.",
  },
  {
    question: "Do I need aria-checked if I use a native checkbox?",
    answer:
      "No — and you should not add it yourself. When you put role=\"switch\" on a native <input type=\"checkbox\">, the browser maps the element's checked property to aria-checked automatically, so the state stays correct without any code. Adding an explicit aria-checked attribute on top risks it drifting out of sync with the real checked state. You only manage aria-checked by hand when you build the switch from a non-native element such as <button role=\"switch\">, where there is no checked property for the browser to map and you must set aria-checked=\"true\" or \"false\" every time the state changes.",
  },
  {
    question: "What contrast does a toggle switch need?",
    answer:
      "The visual parts of a switch are user-interface components, so their meaningful boundaries fall under WCAG 1.4.11 Non-text Contrast and must reach a contrast ratio of at least 3:1 against adjacent colours. In practice that means the switch track has a visible edge against the page background, the thumb has a visible edge against the track, and — critically — the on state and the off state are distinguishable from each other by more than colour, since 1.4.1 Use of Color forbids relying on colour alone. The classic failure is a green \"on\" and a grey \"off\" that look identical to a red-green colour-blind user and sit at barely 2:1 against the surrounding card. The fix is to move the thumb position, which everyone can see regardless of colour perception, and to check the real rendered edges with a contrast tool. The label text itself still has to meet 1.4.3 Contrast (Minimum) at 4.5:1.",
  },
  {
    question: "Can toggling a switch reload the page or navigate somewhere?",
    answer:
      "Not without warning the user first. WCAG 3.2.2 On Input says that changing a control's setting must not cause an unexpected change of context — and navigating, submitting a form, or reloading the page all count as changes of context. A switch strongly implies a small, immediate, in-place effect; a user who flips \"Compact view\" does not expect to be thrown to a different URL. If a toggle genuinely must trigger something large, describe it before the control so the outcome is not a surprise, or reconsider whether a switch is the right pattern at all. A switch that quietly submits a form the moment it changes is a common and disorienting 3.2.2 failure.",
  },
  {
    question: "How do I test a toggle switch for accessibility?",
    answer:
      "Five minutes of keyboard and screen reader work catches almost everything. Tab to the switch and confirm it takes focus with a clearly visible indicator. Press Space and confirm the state flips and the effect happens immediately. Listen with a screen reader: you should hear the control's fixed name, that it is a switch, and its current state — \"Dark mode, switch, off\" — and the state must update when you toggle. Turn the display to greyscale and confirm you can still tell on from off, which proves you are not relying on colour. Check the track and thumb edges reach 3:1 with a contrast checker, and confirm the hit area is at least 24 by 24 CSS pixels for 2.5.8. Finish with an automated scan for a missing accessible name or a role that never made it onto the element.",
  },
]

const keyboardRows = [
  {
    key: "Tab / Shift + Tab",
    action:
      "Moves focus to the switch and away from it. A switch is a single stop in the tab order, exactly like a checkbox or a button.",
  },
  {
    key: "Space",
    action:
      "Toggles the switch between on and off. This is the primary and, for a checkbox-based switch, the only activation key.",
  },
  {
    key: "Enter",
    action:
      "Also toggles a switch built from a <button role=\"switch\">, because buttons respond to Enter. A native checkbox does not toggle on Enter, and that is expected.",
  },
  {
    key: "Arrow keys",
    action:
      "Do nothing. A lone switch is not a composite widget; there is no set of options for arrows to move between. Grouped switches are still individually Tab-reachable.",
  },
]

const attributeRows = [
  {
    element: "The switch control",
    role: 'role="switch" (implicit on a native checkbox you add the role to)',
    attrs:
      "aria-checked reflects the state (true = on, false = off). On a native <input type=\"checkbox\">, the browser maps checked to aria-checked for you — do not set it by hand.",
  },
  {
    element: "The accessible name",
    role: "Supplied by <label>, aria-labelledby, or aria-label",
    attrs:
      "Names what the switch controls (\"Dark mode\"), and stays constant as the state changes. A native <label for> is the most robust source.",
  },
  {
    element: "A disabled switch",
    role: "No role change",
    attrs:
      "The disabled attribute on a native checkbox, or aria-disabled=\"true\" plus your own guard on a button switch. A disabled switch stays in the accessibility tree so its state is still discoverable.",
  },
  {
    element: "A read-only switch",
    role: "No role change",
    attrs:
      "aria-readonly=\"true\" when the value is exposed but cannot be changed here. Rare — prefer disabled unless the value must still be submitted with a form.",
  },
  {
    element: "The visual track and thumb",
    role: "Decorative (aria-hidden or CSS-only)",
    attrs:
      "Purely presentational. Build them from CSS on the label, never from separate focusable elements, so there is exactly one thing in the tab order.",
  },
]

const antiPatterns = [
  {
    bad: "A <div> or styled <span> with an onClick that flips a background colour.",
    why: "Assistive technology sees no control at all — no role, no state, no keyboard support. A screen reader user never learns the switch exists (4.1.2, 2.1.1).",
    fix: "Use <input type=\"checkbox\" role=\"switch\"> with a real label, or a <button role=\"switch\"> with aria-checked.",
  },
  {
    bad: "role=\"switch\" on the element but aria-checked is never updated.",
    why: "The switch is announced as permanently \"off\" (or is missing a value entirely, which is a hard failure), so its real state is a lie to every screen reader user (4.1.2).",
    fix: "Update aria-checked on every toggle — or let a native checkbox map checked to aria-checked so it can never drift.",
  },
  {
    bad: "The label reads \"On\" when checked and \"Off\" when unchecked.",
    why: "The state is baked into the name, so screen readers announce contradictions and speech-input users lose a stable command target (1.3.1, 4.1.2).",
    fix: "Keep the name fixed (\"Notifications\") and let aria-checked carry on/off.",
  },
  {
    bad: "On is green, off is grey, and the thumb does not move.",
    why: "A red-green colour-blind user cannot tell the states apart, and the colours often sit below 3:1 against the card (1.4.1, 1.4.11).",
    fix: "Move the thumb so position, not just colour, signals state; verify the track and thumb edges reach 3:1.",
  },
  {
    bad: "The switch is a 16px sliver with no padding around it.",
    why: "The target is too small to hit reliably for people with motor impairments or on touch screens (2.5.8).",
    fix: "Give the switch — or its label hit area — at least 24 by 24 CSS pixels, ideally 44.",
  },
  {
    bad: "Flipping the switch immediately submits the form or navigates away.",
    why: "A switch promises a small in-place effect; a change of context on input is unexpected and disorienting (3.2.2).",
    fix: "Apply the setting in place, or warn the user before the control if a larger action is unavoidable.",
  },
  {
    bad: "The native input is hidden with display:none and the visible switch is a separate div.",
    why: "display:none removes the input from the accessibility tree, so the real control vanishes and the fake one carries no semantics (4.1.2).",
    fix: "Visually hide the input with a clip technique that keeps it in the tree, and style the track on the label.",
  },
]

export default function AccessibleSwitchGuidePage() {
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
                    Accessible Switch
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
                Component Pattern Guide &bull; Updated July 2026
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                Accessible Switch &amp; Toggle Guide
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                A toggle switch is not a checkbox wearing a costume. This guide
                covers <code>role=&quot;switch&quot;</code> and{" "}
                <code>aria-checked</code>, the native{" "}
                <code>&lt;input type=&quot;checkbox&quot; role=&quot;switch&quot;&gt;</code>{" "}
                path that needs almost no JavaScript, why the label must stay put
                while the state moves, the non-text contrast the track and thumb
                owe, and immediate-effect semantics — with copy-ready code mapped
                to WCAG 2.2.
              </p>
            </div>
          </section>

          {/* What & why */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                A Switch Is a Light Switch, Not a Ballot Box
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The toggle switch is one of the most-copied components on the
                  web and one of the most-broken. It usually starts life as a{" "}
                  <code>&lt;div&gt;</code> with a rounded background and a circle
                  that slides left and right, wired to a click handler that
                  flips a class. It looks perfect. It is, to a screen reader,
                  nothing at all — no role, no state, no way to operate it from
                  the keyboard. The user is told the page has a rectangle on it,
                  and never learns there is a control there to turn something on.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The fix is smaller than the bug. A switch has an ARIA pattern
                  of its own —{" "}
                  <a
                    href="https://www.w3.org/WAI/ARIA/apg/patterns/switch/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    the WAI-ARIA Authoring Practices Switch pattern
                  </a>{" "}
                  — built from{" "}
                  <strong className="text-slate-900 dark:text-white">
                    <code>role=&quot;switch&quot;</code>
                  </strong>{" "}
                  and{" "}
                  <strong className="text-slate-900 dark:text-white">
                    <code>aria-checked</code>
                  </strong>
                  , and most of the time you get both for free by adding a
                  single attribute to a control the browser already knows how to
                  make accessible. This guide shows that native-first path, the
                  hand-built alternative for app-like toggles, and the visual and
                  behavioural rules — contrast, target size, immediate effect —
                  that decide whether the switch is usable once the semantics are
                  right.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  But the first decision is not <em>how</em> to build it — it is{" "}
                  <em>whether a switch is the right control at all</em>. A switch
                  and a{" "}
                  <Link href="/guides/accessible-forms" className="text-blue-600 dark:text-blue-400 hover:underline">
                    checkbox
                  </Link>{" "}
                  look interchangeable and are not. Choosing wrong is not a style
                  mistake; it changes what the control promises the user.
                </p>
                <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5 my-6">
                  <p className="text-sm text-slate-800 dark:text-amber-100 leading-relaxed flex gap-3">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>
                      <strong>
                        The one-sentence test: does flipping it take effect right
                        now?
                      </strong>{" "}
                      A switch turns something on the instant it is toggled, like
                      a switch on a wall. A checkbox records a choice you commit
                      later by pressing Save. If the change is provisional until
                      submit, you want a checkbox — no matter how modern a sliding
                      toggle looks.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* WCAG mapping */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                The WCAG 2.2 Criteria a Switch Must Satisfy
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria that a correctly built toggle
                    switch satisfies and what each requires
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
                        What the switch must do
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.3.1 Info &amp; Relationships
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">The on/off state and the control&apos;s purpose are exposed programmatically, not conveyed by the sliding graphic alone.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.1 Keyboard
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">The switch is reachable with Tab and toggled with Space (and Enter, for a button-based switch), with no pointer required.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.1 Use of Color
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">On and off are distinguishable by more than colour — the thumb position or an icon — so a colour-blind user can read the state.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/3-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          3.2.2 On Input
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Toggling the switch does not trigger an unexpected change of context such as navigation, submission, or a reload.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.7 Focus Visible
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">The switch shows a clearly visible focus indicator when tabbed to, distinct from its on/off styling.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.11 Non-text Contrast
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">The track edge, the thumb, and the boundary between them each reach at least 3:1 against adjacent colours.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-5-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.5.8 Target Size (Minimum)
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">The switch, or its label hit area, is at least 24 by 24 CSS pixels so it can be operated by touch and imprecise pointers.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.2 Name, Role, Value
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">The control exposes the switch role, a stable accessible name, and an aria-checked value that tracks the real state.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-6">
                <Link href="/wcag/1-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">
                  1.4.11 Non-text Contrast
                </Link>{" "}
                is the criterion switches fail most often and audits catch least
                often, because a light-grey track on a white card reads as
                &ldquo;subtle&rdquo; to a designer and as &ldquo;invisible&rdquo;
                to a user with low vision. It is a measurement, not an opinion —
                check the rendered edges rather than trusting the mockup.
              </p>
            </div>
          </section>

          {/* Decision */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <GitBranch className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                1. Switch, Checkbox, or Radio? Choose Before You Style
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                These three controls are visually interchangeable and
                semantically distinct. Pick the one whose <em>meaning</em>{" "}
                matches the choice, then style it however your design system
                likes. The wrong pick misleads the user about what the control
                will do the moment they operate it.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Switch</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      An on/off setting that{" "}
                      <strong className="text-slate-900 dark:text-white">
                        takes effect immediately
                      </strong>{" "}
                      — dark mode, Wi-Fi, notifications, &ldquo;show archived
                      items&rdquo;. <code>role=&quot;switch&quot;</code> with{" "}
                      <code>aria-checked</code>. This is what the rest of the
                      guide covers.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Checkbox</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      A selection you{" "}
                      <strong className="text-slate-900 dark:text-white">
                        commit later
                      </strong>{" "}
                      by submitting — &ldquo;I agree&rdquo;, a list of interests,
                      &ldquo;remember me&rdquo;. It can also be{" "}
                      <em>mixed</em>, which a switch cannot. Covered in the{" "}
                      <Link href="/guides/accessible-forms" className="text-blue-600 dark:text-blue-400 hover:underline">
                        forms guide
                      </Link>
                      .
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Radio group</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      One choice from{" "}
                      <strong className="text-slate-900 dark:text-white">
                        three or more
                      </strong>{" "}
                      mutually exclusive options — Light / Dark / System. A
                      switch only has two states, so the moment there is a third
                      option it is the wrong control.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Two edge cases settle most arguments. If the setting must be{" "}
                <strong className="text-slate-900 dark:text-white">
                  submitted with a form
                </strong>{" "}
                before it counts, it is a checkbox even if you draw it as a
                slider — the &ldquo;instant&rdquo; look would be a lie. And if
                the control can be{" "}
                <strong className="text-slate-900 dark:text-white">
                  partially on
                </strong>{" "}
                (a &ldquo;select all&rdquo; that reflects some-but-not-all), it
                is a tri-state checkbox with <code>aria-checked=&quot;mixed&quot;</code>,
                which the switch role does not support.
              </p>
            </div>
          </section>

          {/* Native path */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ToggleRight className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                2. Start With a Native Checkbox and <code>role=&quot;switch&quot;</code>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A switch is, behaviourally, a two-state checkbox: focusable,
                toggled with Space, labelled, and able to travel with a form.
                The ARIA specification lets you keep every one of those native
                behaviours and simply change how the control is announced, by
                adding <code>role=&quot;switch&quot;</code> to a real{" "}
                <code>&lt;input type=&quot;checkbox&quot;&gt;</code>. Assistive
                technology now says &ldquo;switch, on&rdquo; instead of
                &ldquo;checkbox, checked&rdquo;, and the element&apos;s{" "}
                <code>checked</code> property is mapped to{" "}
                <code>aria-checked</code> for you — so there is no state to
                synchronise and nothing to keep from drifting.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`<!-- The whole switch is one real checkbox and one real label. -->
<label class="switch">
  <input type="checkbox" role="switch" checked>
  <!-- The visible track + thumb are decorative, drawn with CSS. -->
  <span class="switch__track" aria-hidden="true"></span>
  <span class="switch__label">Dark mode</span>
</label>`}</code></pre>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100 mt-4"><code>{`.switch {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  /* Give the whole label a comfortable hit area (2.5.8). */
  min-height: 44px;
}

/* Visually hide the input but KEEP it in the accessibility tree.
   Never display:none — that deletes the real control. */
.switch input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.switch__track {
  position: relative;
  inline-size: 2.75rem;
  block-size: 1.5rem;
  border-radius: 999px;
  background: #64748b;          /* off: >= 3:1 vs the card (1.4.11) */
  border: 1px solid #475569;    /* a visible track edge */
  transition: background 150ms;
}
.switch__track::after {         /* the thumb */
  content: "";
  position: absolute;
  inset-block: 2px;
  inset-inline-start: 2px;
  inline-size: 1.25rem;
  border-radius: 50%;
  background: #ffffff;
  border: 1px solid #475569;    /* thumb edge >= 3:1 vs the track */
  transition: inset-inline-start 150ms;
}

/* State is driven by the REAL checkbox, so it can never lie. */
.switch input:checked + .switch__track {
  background: #2563eb;
}
.switch input:checked + .switch__track::after {
  inset-inline-start: calc(100% - 1.25rem - 2px); /* thumb MOVES */
}

/* A visible focus ring, distinct from the on/off colour (2.4.7). */
.switch input:focus-visible + .switch__track {
  outline: 3px solid #1d4ed8;
  outline-offset: 2px;
}`}</code></pre>
              <div className="rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 p-5 my-6">
                <p className="text-sm text-slate-800 dark:text-blue-100 leading-relaxed flex gap-3">
                  <Sparkles className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                  <span>
                    <strong>
                      This version has zero JavaScript for accessibility.
                    </strong>{" "}
                    The label associates the name, the checkbox handles focus and
                    Space, <code>:checked</code> drives the visual state, and the
                    browser maps <code>checked</code> to <code>aria-checked</code>.
                    Your script only has to <em>react</em> to the{" "}
                    <code>change</code> event to apply the setting — it never has
                    to manage the control&apos;s semantics.
                  </span>
                </p>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                The thumb moving from one side to the other is doing real
                accessibility work here, not just decoration: it is what makes
                the state readable without colour, satisfying{" "}
                <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                  1.4.1 Use of Color
                </Link>
                . A switch whose only difference between on and off is the track
                colour fails for a large share of users.
              </p>
            </div>
          </section>

          {/* Anatomy */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Layers className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                3. Anatomy: Roles, States, and Properties
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                A switch needs very little ARIA. The rule of thumb: the element
                supplies the role and — on the native path — the value, and you
                supply the{" "}
                <strong className="text-slate-900 dark:text-white">name</strong>.
                Everything visual is decoration that assistive technology should
                never see as a separate control.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    The elements in an accessible switch and the roles and
                    attributes each needs
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Element</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Role</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Key attributes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    {attributeRows.map((row, i) => (
                      <tr key={i}>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                          {row.element}
                        </th>
                        <td className="px-4 py-3 align-top font-mono text-xs">{row.role}</td>
                        <td className="px-4 py-3 align-top">{row.attrs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Note what is <em>absent</em>: there is no <code>aria-pressed</code>
                , which belongs to toggle buttons rather than switches, and no{" "}
                <code>aria-checked=&quot;mixed&quot;</code>, which the switch role
                does not allow — a switch is strictly on or off. For how each role
                and state is exposed to assistive technology, see the{" "}
                <Link href="/reference/aria" className="text-blue-600 dark:text-blue-400 hover:underline">
                  ARIA roles &amp; attributes reference
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Naming */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Focus className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                4. Naming: The Label Stays Put, the State Moves
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The single most common switch bug that survives a casual review
                is a label that changes with the state — &ldquo;On&rdquo; when
                checked, &ldquo;Off&rdquo; when not. It reads fine on screen and
                breaks the moment a screen reader gets involved, because the
                control now announces its state twice and contradicts itself:{" "}
                &ldquo;Off, switch, on&rdquo;.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The model is a clean split. The{" "}
                <strong className="text-slate-900 dark:text-white">name</strong>{" "}
                says <em>what the switch controls</em> and never changes. The{" "}
                <strong className="text-slate-900 dark:text-white">value</strong>{" "}
                (<code>aria-checked</code>) says <em>on or off</em> and is the
                only part that moves. A screen reader combines them for you:
                &ldquo;Dark mode, switch, on&rdquo;.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <Card className="border-red-200 dark:border-red-900">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-red-700 dark:text-red-400">Don&apos;t</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Toggle the label text between &ldquo;On&rdquo; and
                      &ldquo;Off&rdquo;, or bake the state into{" "}
                      <code>aria-label</code> (&ldquo;Notifications on&rdquo;).
                      The state ends up in the name and speech-input users lose a
                      stable command.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-emerald-200 dark:border-emerald-900">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-emerald-700 dark:text-emerald-400">Do</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Keep the name fixed (&ldquo;Notifications&rdquo;) and let{" "}
                      <code>aria-checked</code> carry on/off. If you show a visual
                      &ldquo;On/Off&rdquo; word, mark it{" "}
                      <code>aria-hidden=&quot;true&quot;</code> so it is not read
                      as part of the name.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                A native <code>&lt;label for&gt;</code> is the most robust source
                of the name because it also enlarges the click target — tapping
                the word toggles the switch. If the switch has only an icon, give
                it an <code>aria-label</code> (or a{" "}
                <Link href="/wcag/1-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                  visually associated
                </Link>{" "}
                text label), never nothing. An unnamed switch is announced as
                bare &ldquo;switch, on&rdquo;, which tells the user a thing is on
                without telling them what.
              </p>
            </div>
          </section>

          {/* Button-based switch */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Code2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                5. Building a Switch From a Button
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Reach for a hand-built switch only when the control is a purely
                app-like toggle that never participates in a form — a live
                &ldquo;mute&rdquo; in a media player, a canvas grid you flip on
                and off. A <code>&lt;button&gt;</code> is the right base because
                it already gives you Enter and Space activation, focus, and
                disabled handling; you add the role and take over the value.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`<!-- The button carries the role; the name is the visible text. -->
<button type="button" role="switch" aria-checked="false" id="grid-switch">
  Snap to grid
</button>`}</code></pre>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100 mt-4"><code>{`const sw = document.getElementById("grid-switch")

sw.addEventListener("click", () => {
  // The button has no "checked" property, so YOU own the value.
  const on = sw.getAttribute("aria-checked") === "true"
  sw.setAttribute("aria-checked", String(!on))

  // Apply the effect in place - a switch promises an immediate result.
  applySnapToGrid(!on)
})

// A native <button> already toggles on Enter and Space via its click
// behaviour, so no extra keydown handler is needed here. If you ever
// build a switch on a non-button element, you must add Space AND Enter
// yourself - and preventDefault on Space so the page does not scroll.`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-6">
                The load-bearing detail is that a real <code>&lt;button&gt;</code>{" "}
                fires a <code>click</code> for both Enter and Space, so basing the
                switch on it removes an entire class of keyboard bugs. The moment
                you drop to a <code>&lt;div role=&quot;switch&quot;&gt;</code> you
                inherit all of them — you must add <code>tabindex=&quot;0&quot;</code>,
                a keydown handler for Space and Enter, and{" "}
                <code>preventDefault</code> on Space to stop the page scrolling.
                That is a lot of code to re-earn what the button gave you for
                free. The{" "}
                <Link href="/guides/keyboard-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  keyboard accessibility guide
                </Link>{" "}
                covers the wider contract every custom control owes.
              </p>
            </div>
          </section>

          {/* Keyboard */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Keyboard className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                6. The Keyboard Model
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                A switch is a single control, so its keyboard contract is the
                shortest of any component in this series. There is one job —
                toggle — and one key that does it everywhere.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Keyboard commands a conformant toggle switch must support
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Key</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Expected behavior</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    {keyboardRows.map((row, i) => (
                      <tr key={i}>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top whitespace-nowrap">
                          {row.key}
                        </th>
                        <td className="px-4 py-3 align-top">{row.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-6">
                The one thing to verify by hand is that Space actually toggles
                and does not scroll the page — the default action of Space on a
                focused element is to page down, and if you built the switch on
                anything other than a native checkbox or button you must call{" "}
                <code>event.preventDefault()</code> to suppress it. On the native
                paths this is handled for you. Whichever base you chose, confirm
                the control is a single Tab stop under{" "}
                <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                  2.1.1 Keyboard
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Non-text contrast */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Contrast className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                7. Making the On/Off State Visible (Not Just Colored)
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Once the semantics are correct, the way a switch fails is
                visual, and it fails for the users least able to absorb it: those
                with low vision or colour-blindness. Three rules keep the state
                readable for everyone.
              </p>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6 mb-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    Signal state with position, not only colour.
                  </strong>{" "}
                  The thumb must sit on opposite sides for on and off. A user who
                  cannot distinguish your green from your grey can still see the
                  circle has moved. This is{" "}
                  <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.1 Use of Color
                  </Link>{" "}
                  and it is non-negotiable.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    Give the track and thumb real edges.
                  </strong>{" "}
                  The track boundary against the page and the thumb against the
                  track each need <strong>3:1</strong> contrast under{" "}
                  <Link href="/wcag/1-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.11 Non-text Contrast
                  </Link>
                  . A white thumb on a pale-blue track, or a faint grey track on
                  white, is the usual miss. Add a 1px border if the fills alone
                  cannot carry it.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    Make the target big enough.
                  </strong>{" "}
                  The switch, or the label wrapping it, must be at least{" "}
                  <strong>24&nbsp;&times;&nbsp;24</strong> CSS pixels for{" "}
                  <Link href="/wcag/2-5-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.5.8 Target Size
                  </Link>{" "}
                  — aim for 44 on touch. Wrapping the control in its{" "}
                  <code>&lt;label&gt;</code> is the easiest way to get there,
                  because the whole label becomes the hit area.
                </li>
              </ol>
              <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5 my-6">
                <p className="text-sm text-slate-800 dark:text-amber-100 leading-relaxed flex gap-3">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>
                    <strong>
                      A quick proof: turn your screen to greyscale.
                    </strong>{" "}
                    If you cannot tell your switch&apos;s on state from its off
                    state with all colour removed, neither can a large group of
                    your users. Every switch should pass this in one glance —
                    because the thumb has moved.
                  </span>
                </p>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Verify the real rendered colours — not the values in the design
                file, which rarely survive anti-aliasing and opacity — with the{" "}
                <Link href="/tools/contrast-checker" className="text-blue-600 dark:text-blue-400 hover:underline">
                  contrast checker
                </Link>
                . And remember the label text is held to the stricter{" "}
                <Link href="/wcag/1-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                  1.4.3 Contrast (Minimum)
                </Link>{" "}
                at 4.5:1, a separate check from the track and thumb.
              </p>
            </div>
          </section>

          {/* On Input */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <AlertTriangle className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                8. Immediate Effect and the On-Input Trap
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The whole reason to choose a switch is that its effect is{" "}
                <em>immediate and in place</em>. That is also where it goes
                wrong. Because a switch takes effect the instant it is toggled,
                developers sometimes hang large actions off that toggle — submit
                the form, reload the results, navigate to a filtered URL. Every
                one of those is a change of context, and{" "}
                <Link href="/wcag/3-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  3.2.2 On Input
                </Link>{" "}
                says changing a setting must not cause one unexpectedly.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <Card className="border-emerald-200 dark:border-emerald-900">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-emerald-700 dark:text-emerald-400">Expected: apply in place</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      &ldquo;Dark mode&rdquo; recolours the page. &ldquo;Show
                      archived&rdquo; reveals rows already on screen.
                      &ldquo;Compact view&rdquo; tightens spacing. The user stays
                      exactly where they were; only the thing the switch names
                      changes.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-red-200 dark:border-red-900">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-red-700 dark:text-red-400">Unexpected: change of context</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Toggling reloads the page, jumps to a new URL, moves focus
                      somewhere far away, or submits a form. Focus is lost, the
                      screen reader restarts, and the user has no idea what
                      happened — a 3.2.2 failure.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                If a toggle genuinely must trigger something big, you have two
                honest options: describe the outcome in text{" "}
                <em>before</em> the control so it is no longer unexpected, or
                announce the result in an{" "}
                <code>aria-live=&quot;polite&quot;</code> region so a screen
                reader user learns what changed —{" "}
                <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                  4.1.3 Status Messages
                </Link>
                . But the better question is usually whether a switch was the
                right control: an action that navigates wants a{" "}
                <Link href="/guides/accessible-menu" className="text-blue-600 dark:text-blue-400 hover:underline">
                  link or a button
                </Link>
                , not a toggle dressed up as one.
              </p>
            </div>
          </section>

          {/* React */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Code2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                9. Switches in React
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                In React the native-checkbox path stays the safest: a controlled{" "}
                <code>&lt;input type=&quot;checkbox&quot; role=&quot;switch&quot;&gt;</code>{" "}
                whose <code>checked</code> comes from state and whose{" "}
                <code>onChange</code> applies the effect. React keeps the real
                DOM <code>checked</code> in sync, so <code>aria-checked</code>{" "}
                stays correct automatically — you never write it.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`import { useId, useState } from "react"

function DarkModeSwitch() {
  const [on, setOn] = useState(false)
  const id = useId()

  return (
    <label htmlFor={id} className="switch">
      <input
        id={id}
        type="checkbox"
        role="switch"
        checked={on}
        // Apply the effect in place - do NOT navigate or submit here.
        onChange={(e) => {
          setOn(e.target.checked)
          document.documentElement.classList.toggle("dark", e.target.checked)
        }}
      />
      <span className="switch__track" aria-hidden="true" />
      {/* The name is fixed; the state lives in aria-checked, set by the browser. */}
      <span className="switch__label">Dark mode</span>
    </label>
  )
}`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-6">
                If you instead build on a <code>&lt;button role=&quot;switch&quot;&gt;</code>
                , you own <code>aria-checked</code> and must render it from state
                (<code>aria-checked=&#123;on&#125;</code>) on every render, or the
                announced value drifts from what the user sees. For production,
                headless libraries implement the pattern and its edge cases —
                Radix UI&apos;s <code>Switch</code>, React Aria&apos;s{" "}
                <code>useSwitch</code>, and Headless UI&apos;s{" "}
                <code>Switch</code> are all sound choices. The same rules travel
                to other frameworks: see the{" "}
                <Link href="/guides/vue-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Vue
                </Link>{" "}
                and{" "}
                <Link href="/guides/angular-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Angular
                </Link>{" "}
                guides, and the{" "}
                <Link href="/guides/react-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  React accessibility guide
                </Link>{" "}
                for the surrounding patterns. Whatever you ship, verify it against
                the testing workflow below rather than trusting the README.
              </p>
            </div>
          </section>

          {/* Testing */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Keyboard className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                How to Test an Accessible Switch
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Automated tools catch a missing accessible name and a role that
                never reached the element. Everything that decides whether the
                switch is actually usable — whether you can read the state,
                operate it by keyboard, and see it without colour — takes about
                five minutes by hand.
              </p>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Tab to it.</strong>{" "}
                  The switch takes focus as a single stop and shows a clearly
                  visible focus ring, distinct from its on/off colour.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Press Space.</strong>{" "}
                  The state flips, the thumb moves, and the effect happens
                  immediately and in place — no navigation, no reload.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Listen with a screen reader.</strong>{" "}
                  You should hear a fixed name, the word &ldquo;switch&rdquo;, and
                  the current state — &ldquo;Dark mode, switch, off&rdquo; — and
                  the state must update as you toggle. The{" "}
                  <Link href="/guides/screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    screen reader testing guide
                  </Link>{" "}
                  has the commands.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Remove colour.</strong>{" "}
                  Switch the display to greyscale and confirm you can still tell
                  on from off. If you cannot, the thumb is not moving enough (
                  <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.1
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Measure the edges.</strong>{" "}
                  Check the track and thumb boundaries reach 3:1 (
                  <Link href="/wcag/1-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.11
                  </Link>
                  ) and that the hit area is at least 24&nbsp;&times;&nbsp;24 CSS
                  pixels (
                  <Link href="/wcag/2-5-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.5.8
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Check the label never lies.</strong>{" "}
                  Toggle several times and confirm the accessible name stays the
                  same while only the state changes.
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Layer automated checks on top with <code>axe-core</code>, and see{" "}
                <Link href="/guides/automated-vs-manual-accessibility-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                  automated vs manual testing
                </Link>{" "}
                for where each fits. Scan the live page with the{" "}
                <Link href="/tools/url-accessibility-auditor" className="text-blue-600 dark:text-blue-400 hover:underline">
                  URL accessibility auditor
                </Link>{" "}
                to catch a missing name or role before it ships.
              </p>
            </div>
          </section>

          {/* Anti-patterns */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Common Switch Mistakes &amp; How to Fix Them
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common accessible-switch anti-patterns, why they fail, and
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
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ListChecks className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                Accessible Switch Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Right control.</strong>{" "}
                  It takes effect immediately. If the choice is committed on
                  submit, it is a checkbox; if there are three options, a radio
                  group.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Real semantics.</strong>{" "}
                  <code>&lt;input type=&quot;checkbox&quot; role=&quot;switch&quot;&gt;</code>{" "}
                  or <code>&lt;button role=&quot;switch&quot;&gt;</code> — never a
                  bare <code>&lt;div&gt;</code>.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">State is honest.</strong>{" "}
                  <code>aria-checked</code> tracks the real state — mapped for you
                  on a checkbox, set by you on a button.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Name stays fixed.</strong>{" "}
                  The accessible name describes what the switch controls and does
                  not change with on/off.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Keyboard works.</strong>{" "}
                  One Tab stop, Space toggles, and the page never scrolls when it
                  does (
                  <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.1.1
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">State reads without colour.</strong>{" "}
                  The thumb moves, so on and off survive greyscale (
                  <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.1
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Edges and target hold up.</strong>{" "}
                  Track and thumb reach 3:1 (
                  <Link href="/wcag/1-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.11
                  </Link>
                  ); the hit area is at least 24&nbsp;&times;&nbsp;24 px (
                  <Link href="/wcag/2-5-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.5.8
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Effect stays in place.</strong>{" "}
                  Toggling does not navigate, submit, or reload without warning (
                  <Link href="/wcag/3-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                    3.2.2
                  </Link>
                  ).
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Work through the full{" "}
                <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG 2.2 checklist
                </Link>{" "}
                to see the switch in the context of every other requirement.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Check Your Switches on a Live Page
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Scan any page with our free axe-core-powered auditor to catch a
                  switch with no accessible name, a missing role, or an{" "}
                  <code>aria-checked</code> that never updates — then run the
                  six-step keyboard and greyscale pass above for the failures no
                  scanner can see.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/tools/url-accessibility-auditor">
                      Scan a Page Now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link href="/tools/contrast-checker">
                      Check Track Contrast
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
                content="accessible switch accessible toggle role switch aria-checked switch vs checkbox toggle switch on off setting native checkbox role switch non-text contrast use of color target size 3.2.2 on input keyboard accessibility focus visible screen reader react accessible switch aria pattern menu dialog combobox forms wcag 1.4.1 1.4.11 2.5.8 4.1.2"
                title="Related Guides & Tools"
                maxItems={6}
                showDescriptions={true}
                excludeUrl="/guides/accessible-switch"
              />
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
