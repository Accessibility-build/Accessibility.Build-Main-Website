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
  Boxes,
  Focus,
  Route,
  AlertCircle,
  KeyRound,
  Ear,
  Radio,
  ListChecks,
  ShieldCheck,
  Bug,
  Component,
  Braces,
  PanelTop,
} from "lucide-react"

const pageTitle = "Vue Accessibility Guide"
const pageDescription =
  "Build accessible Vue 3 apps: semantic templates, reactive ARIA with :aria-* binding, focus management on Vue Router navigation, dialogs with Teleport and focus traps, live regions with v-show, attribute fallthrough with inheritAttrs and $attrs, accessible forms, and testing with eslint-plugin-vuejs-accessibility and vitest-axe — mapped to WCAG 2.2 AA."

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "vue accessibility",
    "accessible vue components",
    "vue a11y",
    "vue 3 accessibility",
    "vue aria",
    "vue aria binding",
    "vue focus management",
    "vue router focus",
    "vue teleport dialog",
    "vue live region",
    "vue attribute fallthrough",
    "inheritattrs vue",
    "vue $attrs accessibility",
    "eslint-plugin-vuejs-accessibility",
    "vue form accessibility",
    "vue screen reader",
    "wcag vue",
    "nuxt accessibility",
  ],
  alternates: {
    canonical: "/guides/vue-accessibility",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/vue-accessibility",
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
    name: "Vue Accessibility Guide",
    url: "https://accessibility.build/guides/vue-accessibility",
  },
]

const faqs = [
  {
    question: "Is Vue accessible by default?",
    answer:
      "Vue is neutral — it renders whatever you write in your template. If you use semantic elements (button, a, nav, label, input, h1–h6), your app inherits the keyboard behavior and screen reader semantics those elements already ship with. Accessibility problems come from Vue patterns, not the framework: div elements with @click handlers, router navigation that never moves focus, reactivity that updates the DOM without announcing it, and custom components that reimplement native controls without keyboard support. Vue can be fully WCAG 2.2 AA accessible — and the official eslint-plugin-vuejs-accessibility catches many issues as you type — but accessibility is something you build in, not something you get for free.",
  },
  {
    question:
      "How do I bind ARIA attributes reactively in Vue?",
    answer:
      "Use v-bind (the : shorthand): :aria-expanded=\"isOpen\" renders aria-expanded=\"true\" or \"false\" because Vue stringifies the boolean for you. The key Vue rule is what happens with empty values: when a bound expression is null or undefined, Vue removes the attribute entirely. That lets you write :aria-describedby=\"hasError ? 'email-error' : null\" so the attribute only appears when there is genuinely an error, instead of shipping aria-describedby pointing at nothing. For token attributes, bind the token, not a boolean — :aria-current=\"isActive ? 'page' : null\", not :aria-current=\"isActive\", which would render the less useful aria-current=\"true\". Static ARIA values that never change can stay as plain attributes.",
  },
  {
    question: "What is attribute fallthrough and why does it break accessibility?",
    answer:
      "When a parent passes aria-label, id, or aria-describedby to your custom component, Vue's fallthrough behavior applies those attributes to the component's single root element by default. If your component wraps an <input> inside a <div>, the aria-label lands on the wrapper div — where it does nothing — instead of on the input, so screen readers announce an unlabeled field. The fix is to set inheritAttrs: false (via defineOptions in <script setup>) and then bind the attributes onto the correct inner element with v-bind=\"$attrs\". This is the single most common Vue-specific accessibility bug in reusable form components.",
  },
  {
    question: "Should I use v-if or v-show for an ARIA live region?",
    answer:
      "Use v-show, or keep the region always mounted. A screen reader only announces changes inside a live region if that region already existed in the accessibility tree before its text changed. v-if adds and removes the element from the DOM, so a live region created by v-if at the moment your message appears announces nothing — the browser sees the region and its content arrive together and treats it as initial content, not an update. v-show keeps the element in the DOM and just toggles display, so live announcements fire. The most reliable pattern is a permanently mounted, visually hidden <div aria-live=\"polite\"> whose text you update reactively. This satisfies WCAG 4.1.3 Status Messages.",
  },
  {
    question: "How do I move focus when the route changes in a Vue app?",
    answer:
      "Vue Router swaps the routed component without a full page load, so the browser never resets focus the way a traditional navigation would. Keyboard and screen reader users are left on the link they activated, now pointing at content that no longer exists. Fix it with router.afterEach(): wait a tick with nextTick() so the new view has rendered, then move focus to the top of the page — typically a <main> element or the new <h1> given tabindex=\"-1\" so it can receive programmatic focus. Pair that with a skip link. This satisfies WCAG 2.4.3 Focus Order.",
  },
  {
    question: "How do I test a Vue app for accessibility?",
    answer:
      "Use three layers. First, lint the templates: eslint-plugin-vuejs-accessibility ships rules such as click-events-have-key-events, form-control-has-label, anchor-has-content, and aria-props that catch many issues as you type. Second, component tests: render components with @testing-library/vue — which encourages accessible queries like getByRole and getByLabelText — and assert with vitest-axe (or jest-axe) using the toHaveNoViolations matcher. Third, end-to-end: run axe-core through @axe-core/playwright against real routes. None of these replace manual keyboard and screen reader testing, which is the only way to confirm the experience actually works.",
  },
]

const antiPatterns = [
  {
    bad: "<div @click=\"...\"> used as a button.",
    why: "Not focusable, not keyboard-operable, no role announced (WCAG 2.1.1, 4.1.2).",
    fix: "Use a real <button>. vuejs-accessibility/click-events-have-key-events flags this.",
  },
  {
    bad: "aria-label passed to a wrapper component.",
    why: "Fallthrough puts it on the root div, not the inner input — no accessible name (1.3.1, 4.1.2).",
    fix: "Set inheritAttrs: false and v-bind=\"$attrs\" on the <input>.",
  },
  {
    bad: "Live region mounted with v-if when the message appears.",
    why: "The region didn't exist before the change, so nothing is announced (4.1.3).",
    fix: "Use v-show or keep an always-mounted aria-live region and update its text.",
  },
  {
    bad: "Router navigation that never moves focus.",
    why: "Keyboard and screen reader users are stranded on the old view (2.4.3).",
    fix: "Focus <main> or the new <h1> in router.afterEach after nextTick().",
  },
  {
    bad: "Custom overlay without a focus trap.",
    why: "Focus escapes behind the dialog; users get lost (2.1.2, 2.4.3).",
    fix: "Trap focus (focus-trap / Headless UI Vue) and Teleport the dialog to <body>.",
  },
  {
    bad: "Form errors not tied to their input.",
    why: "Screen reader users hear the field but not why it failed (3.3.1).",
    fix: "Bind :aria-invalid and :aria-describedby to the message, null when valid.",
  },
]

export default function VueAccessibilityGuidePage() {
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
                    Vue Accessibility
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
                Implementation Guide &bull; Updated July 2026
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                Vue Accessibility: The Complete WCAG 2.2 Guide
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Vue is accessible when you build it that way. This guide covers
                the patterns that actually trip Vue 3 apps up: semantic
                templates, reactive <code>:aria-*</code> binding, focus on Vue
                Router navigation, dialogs with <code>&lt;Teleport&gt;</code>,
                live regions that actually announce, and the Vue-only pitfall of{" "}
                <code>$attrs</code> fallthrough — with copy-ready{" "}
                <code>&lt;script setup&gt;</code> code and a testing workflow
                that keeps it accessible.
              </p>
            </div>
          </section>

          {/* Why Vue is different */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Why Vue Accessibility Is Different
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Vue does not make a page inaccessible on its own — it renders
                  whatever elements you put in the template. Reach for a real{" "}
                  <code>&lt;button&gt;</code>, <code>&lt;a&gt;</code>,{" "}
                  <code>&lt;nav&gt;</code>, and <code>&lt;label&gt;</code> and you
                  inherit the keyboard behavior, focus handling, and screen
                  reader semantics those elements already provide. The trouble is
                  that Vue makes it just as easy to bind a <code>@click</code>{" "}
                  handler to a <code>&lt;div&gt;</code> that looks like a button
                  but is invisible to assistive technology.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Three things about the Vue model create accessibility work you
                  would not have on a static site. First,{" "}
                  <strong className="text-slate-900 dark:text-white">
                    client-side routing
                  </strong>{" "}
                  swaps the routed component without a full page load, so focus
                  and screen reader context are never reset unless you do it.
                  Second,{" "}
                  <strong className="text-slate-900 dark:text-white">
                    reactivity
                  </strong>{" "}
                  updates the DOM constantly — results, toasts, validation — and
                  none of it is announced unless it happens inside a live region.
                  Third,{" "}
                  <strong className="text-slate-900 dark:text-white">
                    single-file components
                  </strong>{" "}
                  hide markup behind reusable pieces, so one wrong choice (a div
                  for a button, a missing label) repeats everywhere it is used.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Vue also has two behaviors that matter more for accessibility
                  than any others:{" "}
                  <strong className="text-slate-900 dark:text-white">
                    attribute fallthrough
                  </strong>{" "}
                  (where an <code>aria-label</code> passed to a component quietly
                  lands on the wrong element) and the difference between{" "}
                  <strong className="text-slate-900 dark:text-white">
                    <code>v-if</code> and <code>v-show</code>
                  </strong>{" "}
                  for live regions. Get those, the routing focus, and reactive
                  ARIA binding right and most of Vue accessibility falls into
                  place. If you also work in React or Angular, the same
                  principles map cleanly onto our{" "}
                  <Link
                    href="/guides/react-accessibility"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    React accessibility guide
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/guides/angular-accessibility"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Angular accessibility guide
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
                The WCAG 2.2 Criteria Vue Apps Break Most
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria most commonly failed by Vue
                    applications and what each requires
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
                        What it requires in Vue
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
                      <td className="px-4 py-3">Use semantic templates; make sure <code>$attrs</code> land on the real control.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.1 Keyboard
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Interactive elements must be real buttons/links, not <code>@click</code> divs.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.2 No Keyboard Trap
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Dialogs trap focus deliberately and release it on close.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.3 Focus Order
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Move focus in <code>router.afterEach</code> and on open/close of overlays.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.7 Focus Visible
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Keep a visible focus outline; never remove it without a replacement.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/3-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          3.3.1 Error Identification
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Tie validation messages to fields with <code>:aria-describedby</code>.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.2 Name, Role, Value
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Custom components expose an accessible name, role, and state.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.3 Status Messages
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Announce async updates in an always-mounted <code>aria-live</code> region.</td>
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

          {/* 1. Semantic templates */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Component className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                1. Write Semantic Templates First
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The single highest-impact rule in Vue accessibility: render the
                element that already does the job. A <code>&lt;button&gt;</code>{" "}
                is focusable, fires on Enter and Space, and announces its role. A{" "}
                <code>&lt;div @click&gt;</code> does none of that until you add a
                role, <code>tabindex</code>, and keyboard handlers by hand — and
                get all three exactly right.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`<!-- Inaccessible: not focusable, no keyboard, no role -->
<div class="btn" @click="save">Save</div>

<!-- Accessible: keyboard + role + focus for free -->
<button type="button" @click="save">Save</button>

<!-- Navigation is a list of links inside <nav> -->
<nav aria-label="Primary">
  <ul>
    <li><RouterLink to="/pricing">Pricing</RouterLink></li>
    <li><RouterLink to="/guides">Guides</RouterLink></li>
  </ul>
</nav>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Use one <code>&lt;h1&gt;</code> per view and keep headings in
                order (<code>h1</code> &rarr; <code>h2</code> &rarr;{" "}
                <code>h3</code>) so screen reader users can navigate by heading.
                Wrap the routed content in <code>&lt;main&gt;</code>, and reach
                for <code>&lt;button&gt;</code> for actions and{" "}
                <code>&lt;RouterLink&gt;</code> (which renders a real{" "}
                <code>&lt;a&gt;</code>) for navigation — the difference matters
                to assistive tech even when they look identical. The{" "}
                <code>vuejs-accessibility/click-events-have-key-events</code>{" "}
                rule catches most of these as you type.
              </p>
            </div>
          </section>

          {/* 2. reactive aria binding */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Braces className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                2. Bind ARIA Reactively with <code>:aria-*</code>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Vue&apos;s <code>v-bind</code> (the <code>:</code> shorthand)
                sets ARIA attributes directly, and it stringifies booleans for
                you — <code>:aria-expanded=&quot;isOpen&quot;</code> renders{" "}
                <code>aria-expanded=&quot;true&quot;</code> or{" "}
                <code>&quot;false&quot;</code>. The rule that trips teams up is
                what Vue does with <em>empty</em> values: when a bound expression
                is <code>null</code> or <code>undefined</code>, Vue removes the
                attribute entirely. That is exactly what you want for conditional
                states.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`<!-- Boolean state: renders aria-expanded="true" / "false" -->
<button :aria-expanded="isOpen" :aria-controls="panelId">Menu</button>

<!-- Conditional attribute: present only when there is an error,
     removed entirely when the expression is null -->
<input :aria-invalid="hasError || null" :aria-describedby="hasError ? 'err' : null" />

<!-- Token attributes: bind the token, not a bare boolean -->
<a :aria-current="isActive ? 'page' : null" :href="href">Home</a>

<!-- Many ARIA attributes at once with the object form of v-bind -->
<div v-bind="{ role, 'aria-expanded': open, 'aria-controls': panelId }" />`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Bind <code>null</code> (not <code>false</code>) when you want an
                attribute to disappear — binding <code>false</code> renders the
                literal string <code>aria-invalid=&quot;false&quot;</code>,
                which is correct for a true/false ARIA state but wrong for
                attributes like <code>aria-describedby</code> that should simply
                be absent. For token attributes such as{" "}
                <code>aria-current</code>, bind the token (<code>&apos;page&apos;</code>)
                rather than a boolean so screen readers announce the right thing.
                Every role and state is documented in our{" "}
                <Link href="/reference/aria" className="text-blue-600 dark:text-blue-400 hover:underline">
                  ARIA roles &amp; attributes reference
                </Link>
                .
              </p>
            </div>
          </section>

          {/* 3. attribute fallthrough — the marquee Vue gotcha */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <PanelTop className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                3. Fix Attribute Fallthrough on Wrapper Components
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                This is the Vue-specific bug that quietly breaks accessible
                names. When a parent passes <code>aria-label</code>,{" "}
                <code>id</code>, or <code>aria-describedby</code> to your custom
                component, Vue applies those attributes to the component&apos;s
                single root element by default. If your component wraps an{" "}
                <code>&lt;input&gt;</code> inside a <code>&lt;div&gt;</code>, the{" "}
                <code>aria-label</code> lands on the wrapper — where it does
                nothing — and the input stays unlabeled.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`<!-- TextField.vue -->
<script setup lang="ts">
// Stop attributes from landing on the root <div>...
defineOptions({ inheritAttrs: false })

defineProps<{ label: string; id: string }>()
const model = defineModel<string>()
</script>

<template>
  <div class="field">
    <label :for="id">{{ label }}</label>
    <!-- ...forward them onto the real control instead -->
    <input :id="id" v-model="model" v-bind="$attrs" />
  </div>
</template>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Setting <code>inheritAttrs: false</code> tells Vue not to apply
                fallthrough attributes to the root element, and{" "}
                <code>v-bind=&quot;$attrs&quot;</code> forwards them onto the{" "}
                <code>&lt;input&gt;</code>, so a parent&apos;s{" "}
                <code>aria-describedby</code>, <code>aria-invalid</code>, or event
                listeners reach the element that actually needs them. Any time a
                reusable component wraps a native control in extra markup, this
                pattern is what keeps its accessible name and state intact
                (WCAG{" "}
                <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  4.1.2 Name, Role, Value
                </Link>
                ).
              </p>
            </div>
          </section>

          {/* 4. Focus on route change */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Route className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                4. Manage Focus on Vue Router Navigation
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When Vue Router changes routes, the browser does not reset focus
                the way a full page load would. Keyboard and screen reader users
                are left on whatever link they activated, now pointing at content
                that no longer exists. Move focus to the top of the new view in{" "}
                <code>router.afterEach()</code> — after a <code>nextTick()</code>{" "}
                so the new component has actually rendered.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`// router/index.ts
import { createRouter, createWebHistory } from "vue-router"
import { nextTick } from "vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [/* ... */],
})

router.afterEach(async () => {
  await nextTick()
  const main = document.querySelector<HTMLElement>("main")
  main?.focus()
})

export default router`}</code></pre>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto mt-3"><code>{`<!-- App.vue -->
<template>
  <a class="skip-link" href="#main">Skip to main content</a>
  <nav aria-label="Primary"><!-- ... --></nav>

  <main id="main" tabindex="-1">
    <RouterView />
  </main>
</template>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                <code>tabindex=&quot;-1&quot;</code> lets{" "}
                <code>&lt;main&gt;</code> receive programmatic focus without
                adding it to the Tab order. Prefer focusing a container or the
                new <code>&lt;h1&gt;</code> over announcing the whole page. This
                satisfies{" "}
                <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                  2.4.3 Focus Order
                </Link>{" "}
                and depends on a working{" "}
                <Link href="/guides/keyboard-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  skip link
                </Link>
                . For the full picture of programmatic focus, traps, and
                restoration, see the{" "}
                <Link href="/guides/focus-management" className="text-blue-600 dark:text-blue-400 hover:underline">
                  focus management guide
                </Link>
                .
              </p>
            </div>
          </section>

          {/* 5. Dialogs / Teleport + focus trap */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Focus className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                5. Accessible Dialogs with <code>&lt;Teleport&gt;</code> &amp; Focus Trapping
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A dialog is the classic Vue focus challenge. When it opens, focus
                must move into it; while open, focus must stay trapped inside; on
                close, focus must return to the control that opened it. Vue&apos;s{" "}
                <code>&lt;Teleport&gt;</code> moves the dialog markup to{" "}
                <code>&lt;body&gt;</code> so it escapes any <code>overflow</code>{" "}
                or stacking context, and a focus-trap library keeps keyboard focus
                inside while it is open.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`<script setup lang="ts">
import { ref, watch, nextTick } from "vue"
import { useFocusTrap } from "@vueuse/integrations/useFocusTrap"

const open = ref(false)
const dialog = ref<HTMLElement | null>(null)
const opener = ref<HTMLElement | null>(null)
const { activate, deactivate } = useFocusTrap(dialog)

watch(open, async (isOpen) => {
  if (isOpen) {
    opener.value = document.activeElement as HTMLElement
    await nextTick()
    activate()               // move + trap focus inside the dialog
  } else {
    deactivate()
    opener.value?.focus()    // restore focus to what opened it
  }
})
</script>

<template>
  <button type="button" @click="open = true">Delete project</button>

  <Teleport to="body">
    <div v-if="open" class="backdrop" @click="open = false" />
    <div
      v-if="open"
      ref="dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      @keydown.esc="open = false"
    >
      <h2 id="dialog-title">Delete this project?</h2>
      <p>This action cannot be undone.</p>
      <button type="button" @click="open = false">Cancel</button>
      <button type="button" @click="confirm">Delete</button>
    </div>
  </Teleport>
</template>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                You add <code>role=&quot;dialog&quot;</code>,{" "}
                <code>aria-modal=&quot;true&quot;</code>, an accessible name via{" "}
                <code>aria-labelledby</code>, and Escape-to-close yourself. For
                production dialogs, headless libraries like{" "}
                <a
                  href="https://headlessui.com/vue/dialog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Headless UI Vue
                </a>{" "}
                and Reka UI ship a <code>Dialog</code> that handles the Teleport,
                focus trap, focus restoration, and <code>aria-modal</code> for
                you — so you rarely need to hand-roll one. See the{" "}
                <Link href="/learn/modals" className="text-blue-600 dark:text-blue-400 hover:underline">
                  accessible modal pattern
                </Link>{" "}
                for the full interaction spec.
              </p>
            </div>
          </section>

          {/* 6. Live regions: v-if vs v-show */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Radio className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                6. Announce Dynamic Content (and the <code>v-if</code> Trap)
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Reactivity updates the DOM silently. When search results load, a
                toast appears, or a form saves, a sighted user sees it instantly —
                a screen reader user hears nothing unless the change happens
                inside an <code>aria-live</code> region. The Vue-specific catch:
                a screen reader only announces a live region that already existed
                in the DOM <em>before</em> its content changed. Mount that region
                with <code>v-if</code> at the moment the message appears and
                nothing is announced.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`<!-- Broken: the region is created at the same moment as its text,
     so the browser treats it as initial content, not an update -->
<p v-if="message" aria-live="polite">{{ message }}</p>

<!-- Correct: the region is always in the DOM; only its text changes -->
<p aria-live="polite" class="sr-only">{{ message }}</p>`}</code></pre>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto mt-3"><code>{`// A reusable announcer composable — one persistent region for the app
// composables/useAnnouncer.ts
import { ref } from "vue"

const message = ref("")
export function useAnnouncer() {
  function announce(text: string) {
    message.value = ""            // reset so identical messages re-announce
    requestAnimationFrame(() => { message.value = text })
  }
  return { message, announce }
}`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Render one always-mounted, visually hidden region near the root
                (<code>&lt;p aria-live=&quot;polite&quot; class=&quot;sr-only&quot;&gt;&#123;&#123; message &#125;&#125;&lt;/p&gt;</code>)
                and drive it from the composable. Use <code>v-show</code> rather
                than <code>v-if</code> if you must toggle visibility, since it
                keeps the element in the DOM. Reserve{" "}
                <code>aria-live=&quot;assertive&quot;</code> for urgent,
                interrupting messages such as a session-timeout warning. This
                satisfies{" "}
                <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                  4.1.3 Status Messages
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Vue a11y toolkit callout */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <Card className="border-blue-200 dark:border-blue-800">
                <CardHeader className="flex flex-row items-start gap-3 pb-3">
                  <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2">
                    <Boxes className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-lg">
                    The Vue accessibility toolkit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Vue does not ship a first-party accessibility package the way
                    Angular&apos;s CDK does, but a small, well-supported ecosystem
                    covers the same ground:
                  </p>
                  <ul className="text-sm text-muted-foreground leading-relaxed list-disc pl-5 space-y-2">
                    <li>
                      <code>eslint-plugin-vuejs-accessibility</code> — lint rules
                      that catch <code>@click</code>-without-keyboard, missing
                      labels, and invalid ARIA in templates.
                    </li>
                    <li>
                      <strong>Headless UI Vue</strong> / <strong>Reka UI</strong>{" "}
                      — unstyled, accessible dialog, menu, combobox, tabs, and
                      listbox components with keyboard and ARIA built in.
                    </li>
                    <li>
                      <code>@vueuse/integrations/useFocusTrap</code> — a focus
                      trap composable (wraps <code>focus-trap</code>) for dialogs
                      and menus.
                    </li>
                    <li>
                      <strong>VueUse</strong> — <code>useActiveElement</code>,{" "}
                      <code>onKeyStroke</code>, and other primitives useful for
                      focus and keyboard handling.
                    </li>
                    <li>
                      <code>vue-axe</code> — surfaces axe-core violations live in
                      the console during development.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* 7. Accessible forms */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <AlertCircle className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                7. Accessible Forms with <code>v-model</code>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <code>v-model</code> handles the data binding, but says nothing
                about accessibility. Associate every input with a{" "}
                <code>&lt;label&gt;</code>, then link the error message with{" "}
                <code>:aria-describedby</code> and mark the field with{" "}
                <code>:aria-invalid</code> — binding <code>null</code> so the
                attributes disappear when the field is valid.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`<script setup lang="ts">
import { ref, computed } from "vue"

const email = ref("")
const touched = ref(false)
const emailInvalid = computed(
  () => touched.value && !/^[^@]+@[^@]+\\.[^@]+$/.test(email.value)
)
</script>

<template>
  <form @submit.prevent="submit">
    <label for="email">Email</label>
    <input
      id="email"
      type="email"
      v-model="email"
      @blur="touched = true"
      :aria-invalid="emailInvalid || null"
      :aria-describedby="emailInvalid ? 'email-error' : null"
    />
    <p v-if="emailInvalid" id="email-error" class="error">
      Enter a valid email address.
    </p>

    <button type="submit">Create account</button>
  </form>
</template>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Never rely on a placeholder as the label — it disappears on input
                and usually fails contrast. Only surface{" "}
                <code>aria-invalid</code> and <code>aria-describedby</code> once
                the user has touched the field (here, on <code>@blur</code>), so
                assistive tech is not told about an error before it is shown. The
                error message text sits inside a <code>v-if</code> — that is fine,
                because <code>aria-describedby</code> resolves the id when it
                exists; it is only <em>live regions</em> that must stay mounted.
                For labels, grouping with <code>&lt;fieldset&gt;</code>,
                validation, and error summaries, see the{" "}
                <Link href="/guides/accessible-forms" className="text-blue-600 dark:text-blue-400 hover:underline">
                  accessible forms guide
                </Link>{" "}
                and{" "}
                <Link href="/wcag/3-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                  3.3.1 Error Identification
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Keyboard & SR cards */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2">
                      <KeyRound className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-lg">Keyboard Rules for Vue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground leading-relaxed list-disc pl-5 space-y-2">
                      <li>Interactive = real <code>&lt;button&gt;</code> or <code>&lt;a&gt;</code>, never a <code>@click</code> div.</li>
                      <li>Move focus on router navigation and on overlay open/close.</li>
                      <li>Trap focus in dialogs (<code>useFocusTrap</code>); restore it on close.</li>
                      <li>Keep a visible focus outline (<Link href="/wcag/2-4-7" className="text-blue-600 dark:text-blue-400 hover:underline">2.4.7</Link>).</li>
                      <li>Roving <code>tabindex</code> for arrow-key widgets (tabs, menus, listboxes).</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-3">
                      See the{" "}
                      <Link href="/guides/keyboard-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                        keyboard accessibility guide
                      </Link>
                      .
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-2">
                      <Ear className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle className="text-lg">Screen Reader Rules</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground leading-relaxed list-disc pl-5 space-y-2">
                      <li>Announce navigation and async updates via an always-mounted live region.</li>
                      <li>Every control has an accessible name (label or <code>:aria-label</code>).</li>
                      <li>Icon-only buttons need a name; decorative icons get <code>aria-hidden=&quot;true&quot;</code>.</li>
                      <li>Wrapper components forward <code>$attrs</code> to the real control.</li>
                      <li>Images use meaningful <code>alt</code>, or <code>alt=&quot;&quot;</code> if decorative.</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-3">
                      Test with real AT — the{" "}
                      <Link href="/guides/screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                        screen reader testing guide
                      </Link>
                      .
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* 8. Testing & tooling */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Bug className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                8. Testing &amp; Tooling
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Automated checks catch a meaningful share of issues and stop
                regressions — but they find roughly a third to a half of WCAG
                problems, so they supplement rather than replace manual testing.
                Layer three tools into your Vue workflow:
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`// 1. Lint templates — eslint-plugin-vuejs-accessibility
//    In eslint.config.js, extend "plugin:vuejs-accessibility/recommended".
//    Key rules:
//    "vuejs-accessibility/click-events-have-key-events"
//    "vuejs-accessibility/form-control-has-label"
//    "vuejs-accessibility/anchor-has-content"
//    "vuejs-accessibility/aria-props"
//    "vuejs-accessibility/alt-text"

// 2. Component tests: @testing-library/vue + vitest-axe
import { render } from "@testing-library/vue"
import { axe } from "vitest-axe"
import TextField from "./TextField.vue"

it("TextField has no axe violations", async () => {
  const { container } = render(TextField, {
    props: { label: "Email", id: "email" },
  })
  expect(await axe(container)).toHaveNoViolations()
})

// 3. End-to-end: axe-core in Playwright against real routes
import AxeBuilder from "@axe-core/playwright"

test("home page is accessible", async ({ page }) => {
  await page.goto("/")
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Vue Testing Library nudges you toward accessible queries —{" "}
                <code>getByRole</code> and <code>getByLabelText</code> only pass
                when the accessibility tree is correct, so writing tests this way
                surfaces missing names and broken <code>$attrs</code> forwarding
                early. Finish every feature with a manual keyboard pass and a
                screen reader pass. Read our comparison of{" "}
                <Link href="/guides/automated-vs-manual-accessibility-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                  automated vs manual testing
                </Link>{" "}
                to see where each fits.
              </p>
            </div>
          </section>

          {/* Anti-patterns */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Common Vue Mistakes &amp; How to Fix Them
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common Vue accessibility anti-patterns, why they fail, and
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
                Vue Accessibility Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Semantic templates.</strong>{" "}
                  Every clickable thing is a <code>&lt;button&gt;</code> or{" "}
                  <code>&lt;a&gt;</code>/<code>&lt;RouterLink&gt;</code>; headings
                  are ordered; one <code>&lt;h1&gt;</code> per view.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Reactive ARIA.</strong>{" "}
                  Dynamic ARIA uses <code>:aria-*</code> and binds{" "}
                  <code>null</code> to remove attributes when off.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Attribute fallthrough.</strong>{" "}
                  Wrapper components set <code>inheritAttrs: false</code> and{" "}
                  <code>v-bind=&quot;$attrs&quot;</code> on the real control.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Focus on navigation.</strong>{" "}
                  <code>router.afterEach</code> moves focus to{" "}
                  <code>&lt;main&gt;</code> or the new heading after{" "}
                  <code>nextTick()</code>.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Overlays.</strong>{" "}
                  Dialogs use <code>&lt;Teleport&gt;</code>, trap focus, close on Escape, and restore focus.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Live regions.</strong>{" "}
                  Async results and errors announce from an always-mounted{" "}
                  <code>aria-live</code> region (not <code>v-if</code>).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Forms.</strong>{" "}
                  Labels associated; errors linked with <code>:aria-describedby</code> and <code>:aria-invalid</code>.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Automated + manual.</strong>{" "}
                  eslint-plugin-vuejs-accessibility + vitest-axe in CI, plus a keyboard and screen reader pass.
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Scan the deployed build with our{" "}
                <Link href="/tools/url-accessibility-auditor" className="text-blue-600 dark:text-blue-400 hover:underline">
                  URL accessibility auditor
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
                  Audit Your Vue App in Seconds
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Run any deployed Vue or Nuxt page through our free
                  axe-core-powered auditor to catch missing names, unlabeled
                  controls, and contrast failures — then work through the manual
                  checks above.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/tools/url-accessibility-auditor">
                      Scan a Page Now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link href="/reference/aria">Open the ARIA Reference</Link>
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
                content="vue accessibility template aria :aria-* reactive binding attribute fallthrough inheritattrs $attrs focus management router navigation teleport dialog live region v-if v-show accessible forms v-model keyboard screen reader wcag 4.1.2 2.4.3 4.1.3 eslint-plugin-vuejs-accessibility vitest-axe react angular accessibility"
                title="Related Guides & Tools"
                maxItems={6}
                showDescriptions={true}
                excludeUrl="/guides/vue-accessibility"
              />
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
