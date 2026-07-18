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
  Wand2,
  ListChecks,
  ShieldCheck,
  Bug,
  Component,
  Braces,
  Radio,
} from "lucide-react"

const pageTitle = "Angular Accessibility Guide"
const pageDescription =
  "Build accessible Angular apps: semantic templates, ARIA attribute binding with [attr.aria-*], focus management on router navigation, dialogs with cdkTrapFocus, LiveAnnouncer for dynamic updates, accessible reactive forms, and testing with @angular-eslint, jasmine-axe, and Playwright — mapped to WCAG 2.2 AA."

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "angular accessibility",
    "accessible angular components",
    "angular a11y",
    "angular aria",
    "angular cdk a11y",
    "angular attr.aria-label",
    "angular focus management",
    "angular router focus",
    "angular liveannouncer",
    "cdktrapfocus",
    "angular reactive forms accessibility",
    "angular screen reader",
    "angular-eslint accessibility",
    "jasmine-axe",
    "angular keyboard accessibility",
    "wcag angular",
    "angular material accessibility",
  ],
  alternates: {
    canonical: "/guides/angular-accessibility",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/angular-accessibility",
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
    name: "Angular Accessibility Guide",
    url: "https://accessibility.build/guides/angular-accessibility",
  },
]

const faqs = [
  {
    question: "Is Angular accessible by default?",
    answer:
      "Angular is neutral — it renders whatever you write in the template. If you use semantic elements (button, a, nav, label, input, h1–h6), your app inherits the keyboard behavior and screen reader semantics those elements already ship with. Accessibility problems come from Angular patterns, not the framework: div-and-span elements with (click) handlers, router navigation that never moves focus, change detection that updates the DOM without announcing it, and custom components that reimplement native controls without keyboard support. Angular can be fully WCAG 2.2 AA accessible, and it even ships a dedicated accessibility toolkit in @angular/cdk/a11y — but accessibility is something you build in, not something you get for free.",
  },
  {
    question:
      "Why do I have to use [attr.aria-*] instead of [aria-*] in Angular?",
    answer:
      "ARIA attributes are not DOM properties, so Angular's property binding syntax can't reach them — writing [aria-label]=\"value\" produces a template error because there is no aria-label property to bind to. The documented, reliable way to set ARIA values dynamically is attribute binding: [attr.aria-label]=\"value\", [attr.aria-expanded]=\"open\", [attr.role]=\"role\". Attribute binding has a bonus that is perfect for accessibility: when the bound expression evaluates to null, Angular removes the attribute entirely. That lets you write [attr.aria-invalid]=\"invalid ? 'true' : null\" so the attribute only appears when there is genuinely an error, instead of shipping aria-invalid=\"false\" everywhere. Static ARIA values that never change can still be written as plain attributes.",
  },
  {
    question: "How do I move focus when the route changes in an Angular app?",
    answer:
      "The Angular Router swaps the routed component without a full page load, so the browser never resets focus the way a traditional navigation would. Keyboard and screen reader users are left on the link they activated, now pointing at content that no longer exists. Fix it by subscribing to the Router's NavigationEnd event (or the router-outlet's (activate) event) and moving focus to the top of the new view — typically a <main> element or the page <h1> given tabindex=\"-1\" so it can receive programmatic focus. Pair that with a skip link to the main region. This satisfies WCAG 2.4.3 Focus Order.",
  },
  {
    question: "What is @angular/cdk/a11y and what does it give me?",
    answer:
      "@angular/cdk/a11y is the Angular Component Dev Kit's accessibility package — a set of framework-level primitives you would otherwise have to build by hand. The most useful pieces are LiveAnnouncer (announce messages to screen readers through a managed aria-live region), the cdkTrapFocus directive (trap keyboard focus inside a region such as a dialog, and optionally restore it on destroy), FocusMonitor (detect whether an element was focused by keyboard, mouse, or touch so you can style keyboard focus distinctly), and cdkAriaLive plus HighContrastModeDetector. You can use these without Angular Material — the CDK is the accessibility layer Material itself is built on.",
  },
  {
    question: "How do I announce dynamic updates to screen readers in Angular?",
    answer:
      "Because change detection updates the DOM silently, a screen reader hears nothing when results load, a toast appears, or a form saves — unless the change happens inside an aria-live region. You have two idiomatic options. Inject LiveAnnouncer from @angular/cdk/a11y and call announce('12 results found', 'polite'); it manages a visually hidden live region for you. Or render your own element with aria-live=\"polite\" that already exists in the DOM before its text changes, and update the bound text. Reserve aria-live=\"assertive\" (or the 'assertive' politeness) for urgent, interrupting messages such as a session-timeout warning. This satisfies WCAG 4.1.3 Status Messages.",
  },
  {
    question: "How do I test an Angular app for accessibility?",
    answer:
      "Use three layers. First, lint the templates: the @angular-eslint template plugin ships accessibility rules such as click-events-have-key-events, label-has-associated-control, valid-aria, and elements-content that catch many issues as you type. Second, component tests: render components with the Angular Testing Library — which encourages accessible queries like getByRole and getByLabelText — and assert with jasmine-axe's toHaveNoViolations matcher. Third, end-to-end: run axe-core through @axe-core/playwright against real routes. None of these replace manual keyboard and screen reader testing, which is the only way to confirm the experience actually works.",
  },
]

const antiPatterns = [
  {
    bad: "<div (click)=\"...\"> used as a button.",
    why: "Not focusable, not keyboard-operable, no role announced (WCAG 2.1.1, 4.1.2).",
    fix: "Use a real <button>. @angular-eslint's click-events-have-key-events flags this.",
  },
  {
    bad: "[aria-label]=\"label\" property binding.",
    why: "aria-label is not a DOM property, so the binding errors or is ignored.",
    fix: "Use attribute binding: [attr.aria-label]=\"label\".",
  },
  {
    bad: "Router navigation that never moves focus.",
    why: "Keyboard and screen reader users are stranded on the old view (2.4.3).",
    fix: "Focus <main> or the new <h1> on NavigationEnd.",
  },
  {
    bad: "Results/toasts updated by change detection alone.",
    why: "Screen readers never hear the change (4.1.3 Status Messages).",
    fix: "Announce with LiveAnnouncer or an aria-live region.",
  },
  {
    bad: "Custom overlay without a focus trap.",
    why: "Focus escapes behind the dialog; users get lost (2.1.2, 2.4.3).",
    fix: "Add cdkTrapFocus, or use MatDialog / CDK Dialog.",
  },
  {
    bad: "Reactive-form errors not tied to their input.",
    why: "Screen reader users hear the field but not why it failed (3.3.1).",
    fix: "Wire [attr.aria-invalid] and [attr.aria-describedby] to the message.",
  },
]

export default function AngularAccessibilityGuidePage() {
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
                    Angular Accessibility
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
                Angular Accessibility: The Complete WCAG 2.2 Guide
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Angular is accessible when you build it that way — and it ships a
                dedicated toolkit to help. This guide covers the patterns that
                actually trip Angular apps up: semantic templates, ARIA{" "}
                <code>[attr.aria-*]</code> binding, focus on router navigation,
                dialogs with <code>cdkTrapFocus</code>, live announcements, and
                accessible reactive forms — with copy-ready code and a testing
                workflow that keeps them accessible.
              </p>
            </div>
          </section>

          {/* Why Angular is different */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Why Angular Accessibility Is Different
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Angular does not make a page inaccessible on its own — it
                  renders whatever elements you put in the template. Reach for a
                  real <code>&lt;button&gt;</code>, <code>&lt;a&gt;</code>,{" "}
                  <code>&lt;nav&gt;</code>, and <code>&lt;label&gt;</code> and you
                  inherit the keyboard behavior, focus handling, and screen
                  reader semantics those elements already provide. The trouble is
                  that Angular makes it just as easy to bind a{" "}
                  <code>(click)</code> handler to a <code>&lt;div&gt;</code> that
                  looks like a button but is invisible to assistive technology.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Three things about the Angular model create accessibility work
                  you would not have on a static site. First,{" "}
                  <strong className="text-slate-900 dark:text-white">
                    client-side routing
                  </strong>{" "}
                  swaps the routed component without a full page load, so focus
                  and screen reader context are never reset unless you do it.
                  Second,{" "}
                  <strong className="text-slate-900 dark:text-white">
                    change detection
                  </strong>{" "}
                  updates the DOM constantly — results, toasts, validation — and
                  none of it is announced unless you use a live region. Third,{" "}
                  <strong className="text-slate-900 dark:text-white">
                    component encapsulation
                  </strong>{" "}
                  hides markup behind reusable components, so one wrong choice (a
                  div for a button, a missing label) repeats everywhere it is
                  used.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Angular also has one syntax quirk that matters more for
                  accessibility than any other: because ARIA attributes are not
                  DOM properties, you bind them with{" "}
                  <strong className="text-slate-900 dark:text-white">
                    attribute binding
                  </strong>{" "}
                  (<code>[attr.aria-*]</code>), not property binding. Get that,
                  the routing focus, and the live regions right and most of
                  Angular accessibility falls into place. If you also work in
                  React, the same principles map cleanly onto our{" "}
                  <Link
                    href="/guides/react-accessibility"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    React accessibility guide
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
                The WCAG 2.2 Criteria Angular Apps Break Most
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria most commonly failed by Angular
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
                        What it requires in Angular
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
                      <td className="px-4 py-3">Use semantic templates; associate labels and errors in reactive forms.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.1 Keyboard
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Interactive elements must be real buttons/links, not <code>(click)</code> divs.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.2 No Keyboard Trap
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Dialogs trap focus deliberately with <code>cdkTrapFocus</code> and release it on close.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.3 Focus Order
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Move focus on <code>NavigationEnd</code> and on open/close of overlays.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.7 Focus Visible
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Keep a visible focus outline; <code>FocusMonitor</code> can style keyboard focus distinctly.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/3-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          3.3.1 Error Identification
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Tie validation messages to fields with <code>[attr.aria-describedby]</code>.</td>
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
                      <td className="px-4 py-3">Announce async updates through <code>LiveAnnouncer</code> or an aria-live region.</td>
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
                The single highest-impact rule in Angular accessibility: render
                the element that already does the job. A{" "}
                <code>&lt;button&gt;</code> is focusable, fires on Enter and
                Space, and announces its role. A <code>&lt;div (click)&gt;</code>{" "}
                does none of that until you add a role, <code>tabindex</code>, and
                keyboard handlers by hand — and get all three exactly right.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`<!-- Inaccessible: not focusable, no keyboard, no role -->
<div class="btn" (click)="save()">Save</div>

<!-- Accessible: keyboard + role + focus for free -->
<button type="button" (click)="save()">Save</button>

<!-- Navigation is a list of links inside <nav> -->
<nav aria-label="Primary">
  <ul>
    <li><a routerLink="/pricing">Pricing</a></li>
    <li><a routerLink="/guides">Guides</a></li>
  </ul>
</nav>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Use one <code>&lt;h1&gt;</code> per view and keep headings in
                order (<code>h1</code> &rarr; <code>h2</code> &rarr;{" "}
                <code>h3</code>) so screen reader users can navigate by heading.
                Wrap the routed content in <code>&lt;main&gt;</code>, and reach
                for <code>&lt;button&gt;</code> for actions and{" "}
                <code>&lt;a routerLink&gt;</code> for navigation — the difference
                matters to assistive tech even when they look identical. The{" "}
                <code>@angular-eslint/template/click-events-have-key-events</code>{" "}
                rule catches most of these as you type.
              </p>
            </div>
          </section>

          {/* 2. attr.aria binding */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Braces className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                2. Bind ARIA with <code>[attr.aria-*]</code>, Not Property Binding
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                This is the Angular-specific gotcha that catches every team. ARIA
                attributes have no matching DOM property, so Angular&apos;s{" "}
                <code>[aria-label]</code> property-binding syntax cannot reach
                them — it throws a template error. Bind ARIA through{" "}
                <strong className="text-slate-900 dark:text-white">
                  attribute binding
                </strong>{" "}
                instead. As a bonus, when the expression is <code>null</code>{" "}
                Angular removes the attribute entirely, which is exactly what you
                want for conditional states.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`<!-- Wrong: aria-label is not a DOM property -> template error -->
<button [aria-label]="label">…</button>

<!-- Right: attribute binding -->
<button [attr.aria-label]="label">…</button>

<!-- Conditional: 'true' when invalid, attribute removed otherwise -->
<input [attr.aria-invalid]="invalid ? 'true' : null" />

<!-- Dynamic role and state on a custom element -->
<div [attr.role]="role" [attr.aria-expanded]="open">…</div>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Static ARIA values that never change can stay as plain attributes
                (<code>aria-label="Close"</code>); only reach for{" "}
                <code>[attr.aria-*]</code> when the value is dynamic. Returning{" "}
                <code>null</code> rather than <code>'false'</code> for the
                &ldquo;off&rdquo; case avoids shipping{" "}
                <code>aria-invalid="false"</code> or{" "}
                <code>aria-hidden="false"</code> across your app, which can
                confuse assistive tech. Every role and state is documented in our{" "}
                <Link href="/reference/aria" className="text-blue-600 dark:text-blue-400 hover:underline">
                  ARIA roles &amp; attributes reference
                </Link>
                .
              </p>
            </div>
          </section>

          {/* 3. Focus on route change */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Route className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                3. Manage Focus on Router Navigation
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When the Angular Router changes routes, the browser does not reset
                focus the way a full page load would. Keyboard and screen reader
                users are left on whatever link they activated, now pointing at
                content that no longer exists. Subscribe to the Router&apos;s{" "}
                <code>NavigationEnd</code> event and move focus to the top of the
                new view.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`import { Component, ElementRef, ViewChild, inject } from "@angular/core";
import { Router, NavigationEnd, RouterOutlet, RouterLink } from "@angular/router";
import { filter } from "rxjs";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: \`
    <a class="skip-link" href="#main">Skip to main content</a>
    <nav aria-label="Primary"><!-- … --></nav>

    <main id="main" #main tabindex="-1">
      <router-outlet />
    </main>
  \`,
})
export class AppComponent {
  @ViewChild("main") main!: ElementRef<HTMLElement>;
  private router = inject(Router);

  constructor() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.main.nativeElement.focus());
  }
}`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                <code>tabindex="-1"</code> lets <code>&lt;main&gt;</code> receive
                programmatic focus without adding it to the Tab order. Prefer
                focusing a container or the new <code>&lt;h1&gt;</code> over
                announcing the whole page. This satisfies{" "}
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

          {/* 4. Dialogs / focus trap */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Focus className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                4. Accessible Dialogs &amp; Focus Trapping
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A dialog is the classic Angular focus challenge. When it opens,
                focus must move into it; while open, focus must stay trapped
                inside; on close, focus must return to the control that opened it.
                The CDK&apos;s <code>cdkTrapFocus</code> directive handles the
                trap, and <code>cdkTrapFocusAutoCapture</code> moves focus in on
                init and restores it to the previously focused element when the
                trap is destroyed.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`import { Component } from "@angular/core";
import { A11yModule } from "@angular/cdk/a11y";

@Component({
  selector: "app-confirm-dialog",
  standalone: true,
  imports: [A11yModule],
  template: \`
    @if (open) {
      <div class="backdrop" (click)="close()"></div>
      <div
        class="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        cdkTrapFocus
        [cdkTrapFocusAutoCapture]="true"
      >
        <h2 id="dialog-title">Delete this project?</h2>
        <p>This action cannot be undone.</p>
        <button type="button" (click)="close()">Cancel</button>
        <button type="button" (click)="confirm()">Delete</button>
      </div>
    }
  \`,
})
export class ConfirmDialogComponent {
  open = false;
  close() { this.open = false; }
  confirm() { /* … */ this.close(); }
}`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                You still add <code>role="dialog"</code>,{" "}
                <code>aria-modal="true"</code>, an accessible name via{" "}
                <code>aria-labelledby</code>, and Escape-to-close yourself. For
                production dialogs, <code>MatDialog</code> (Angular Material) and
                the headless CDK <code>Dialog</code> do all of this for you —
                backdrop, focus trap, focus restoration, and{" "}
                <code>aria-modal</code> — so you rarely need to hand-roll one. See
                the{" "}
                <Link href="/learn/modals" className="text-blue-600 dark:text-blue-400 hover:underline">
                  accessible modal pattern
                </Link>{" "}
                for the full interaction spec.
              </p>
            </div>
          </section>

          {/* 5. LiveAnnouncer */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Radio className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                5. Announce Dynamic Content with LiveAnnouncer
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Change detection updates the DOM silently. When search results
                load, a toast appears, or a form saves, a sighted user sees it
                instantly — a screen reader user hears nothing unless the change
                happens inside an <code>aria-live</code> region. The CDK&apos;s{" "}
                <code>LiveAnnouncer</code> manages that region for you: inject it
                and call <code>announce()</code>.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`import { Component, inject } from "@angular/core";
import { LiveAnnouncer } from "@angular/cdk/a11y";

@Component({ /* … */ })
export class SearchComponent {
  private announcer = inject(LiveAnnouncer);

  onResults(results: Result[]) {
    // Polite: announced when the user is idle, never interrupts
    this.announcer.announce(results.length + " results found", "polite");
  }

  onSessionExpiring() {
    // Assertive: interrupts for genuinely urgent messages only
    this.announcer.announce("Your session expires in 1 minute", "assertive");
  }
}`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Prefer <code>"polite"</code> for status updates and reserve{" "}
                <code>"assertive"</code> for urgent, interrupting messages. If you
                render your own live region instead, it must exist in the DOM{" "}
                <em>before</em> its text changes — declare an empty{" "}
                <code>&lt;p aria-live="polite"&gt;</code> and bind its text rather
                than mounting it on demand with <code>@if</code>. This satisfies{" "}
                <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                  4.1.3 Status Messages
                </Link>
                .
              </p>
            </div>
          </section>

          {/* CDK a11y callout */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <Card className="border-blue-200 dark:border-blue-800">
                <CardHeader className="flex flex-row items-start gap-3 pb-3">
                  <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2">
                    <Boxes className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-lg">
                    The <code>@angular/cdk/a11y</code> toolkit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Angular ships accessibility primitives most frameworks make
                    you build by hand. You can use these without Angular Material
                    — the CDK is the layer Material itself is built on.
                  </p>
                  <ul className="text-sm text-muted-foreground leading-relaxed list-disc pl-5 space-y-2">
                    <li>
                      <code>LiveAnnouncer</code> — announce messages through a
                      managed aria-live region.
                    </li>
                    <li>
                      <code>cdkTrapFocus</code> — trap focus in a region and
                      optionally restore it on destroy.
                    </li>
                    <li>
                      <code>FocusMonitor</code> — detect keyboard vs mouse vs
                      touch focus to style keyboard focus distinctly (2.4.7).
                    </li>
                    <li>
                      <code>cdkAriaLive</code> — turn any element into a live
                      region declaratively.
                    </li>
                    <li>
                      <code>HighContrastModeDetector</code> — respond to Windows
                      High Contrast / forced-colors mode.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* 6. Reactive forms */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <AlertCircle className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                6. Accessible Reactive Forms
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Angular&apos;s reactive forms give you validation state for free,
                but they say nothing about accessibility. Associate every input
                with a <code>&lt;label&gt;</code>, then link the error message
                with <code>[attr.aria-describedby]</code> and mark the field with{" "}
                <code>[attr.aria-invalid]</code> — using <code>null</code> so the
                attributes disappear when the field is valid.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`<form [formGroup]="form" (ngSubmit)="submit()">
  <label for="email">Email</label>
  <input
    id="email"
    type="email"
    formControlName="email"
    [attr.aria-invalid]="emailInvalid ? 'true' : null"
    [attr.aria-describedby]="emailInvalid ? 'email-error' : null"
  />
  @if (emailInvalid) {
    <p id="email-error" class="error">Enter a valid email address.</p>
  }

  <button type="submit">Create account</button>
</form>`}</code></pre>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto mt-3"><code>{`get emailInvalid(): boolean {
  const c = this.form.controls.email;
  // Only surface the error after the user has interacted with the field
  return c.invalid && (c.touched || c.dirty);
}`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Never rely on a placeholder as the label — it disappears on input
                and fails contrast. Only set <code>aria-invalid</code> and{" "}
                <code>aria-describedby</code> once the user has touched the field,
                so assistive tech is not told about an error before it is shown.
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

          {/* 7. Custom components + HostBinding */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Wand2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                7. Custom Components &amp; Host Bindings
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When you genuinely need a custom widget — a disclosure, a tab set,
                a combobox — build it on real semantics and describe its state
                with ARIA. Because the toggle below is a real{" "}
                <code>&lt;button&gt;</code>, keyboard support and focus come free;
                you only add <code>aria-expanded</code> and{" "}
                <code>aria-controls</code>. Follow the{" "}
                <a
                  href="https://www.w3.org/WAI/ARIA/apg/patterns/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  ARIA Authoring Practices patterns
                </a>{" "}
                exactly and mirror the ARIA state in your component state.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`import { Component, Input } from "@angular/core";

@Component({
  selector: "app-disclosure",
  standalone: true,
  template: \`
    <button
      type="button"
      [attr.aria-expanded]="open"
      [attr.aria-controls]="panelId"
      (click)="open = !open"
    >
      {{ label }}
    </button>
    <div [id]="panelId" [hidden]="!open">
      <ng-content />
    </div>
  \`,
})
export class DisclosureComponent {
  @Input() label = "";
  @Input() panelId = "";
  open = false;
}`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                When the component&apos;s own host element must carry a role or
                state (for example a custom listbox option), set it with the{" "}
                <code>host</code> metadata or <code>@HostBinding</code> —{" "}
                <code>host: &#123; role: 'option', '[attr.aria-selected]':
                'selected' &#125;</code>. For widgets that need arrow-key
                navigation (tabs, menus, listboxes), implement a roving{" "}
                <code>tabindex</code> — the CDK&apos;s <code>FocusKeyManager</code>{" "}
                does the key handling for you. Our{" "}
                <Link href="/reference/aria" className="text-blue-600 dark:text-blue-400 hover:underline">
                  ARIA reference
                </Link>{" "}
                lists the exact roles and states for each pattern, and{" "}
                <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  4.1.2 Name, Role, Value
                </Link>{" "}
                explains why each is required.
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
                    <CardTitle className="text-lg">Keyboard Rules for Angular</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground leading-relaxed list-disc pl-5 space-y-2">
                      <li>Interactive = real <code>&lt;button&gt;</code> or <code>&lt;a&gt;</code>, never a <code>(click)</code> div.</li>
                      <li>Move focus on router navigation and on overlay open/close.</li>
                      <li>Trap focus in dialogs with <code>cdkTrapFocus</code>; restore it on close.</li>
                      <li>Keep a visible focus outline (<Link href="/wcag/2-4-7" className="text-blue-600 dark:text-blue-400 hover:underline">2.4.7</Link>).</li>
                      <li>Roving <code>tabindex</code> via <code>FocusKeyManager</code> for arrow-key widgets.</li>
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
                      <li>Announce navigation and async updates via <code>LiveAnnouncer</code> or live regions.</li>
                      <li>Every control has an accessible name (label or <code>[attr.aria-label]</code>).</li>
                      <li>Icon-only buttons need a name; decorative icons get <code>aria-hidden="true"</code>.</li>
                      <li>Custom widgets expose role, name, and current value.</li>
                      <li>Images use meaningful <code>alt</code>, or <code>alt=""</code> if decorative.</li>
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
                Layer three tools into your Angular workflow:
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`// 1. Lint templates — @angular-eslint accessibility rules
//    Enable in your ESLint config for *.html templates:
//    "@angular-eslint/template/click-events-have-key-events"
//    "@angular-eslint/template/label-has-associated-control"
//    "@angular-eslint/template/valid-aria"
//    "@angular-eslint/template/elements-content"
//    "@angular-eslint/template/alt-text"

// 2. Component tests: Angular Testing Library + jasmine-axe
import { render } from "@testing-library/angular";
import { axe, toHaveNoViolations } from "jasmine-axe";

it("TextField has no axe violations", async () => {
  const { container } = await render(TextFieldComponent, {
    inputs: { label: "Email", error: "Enter a valid email" },
  });
  expect(await axe(container)).toHaveNoViolations();
});

// 3. End-to-end: axe-core in Playwright against real routes
import AxeBuilder from "@axe-core/playwright";

test("home page is accessible", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                The Angular Testing Library nudges you toward accessible queries —{" "}
                <code>getByRole</code> and <code>getByLabelText</code> only pass
                when the accessibility tree is correct, so writing tests this way
                surfaces missing names early. Finish every feature with a manual
                keyboard pass and a screen reader pass. Read our comparison of{" "}
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
                Common Angular Mistakes &amp; How to Fix Them
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common Angular accessibility anti-patterns, why they fail, and
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
                Angular Accessibility Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Semantic templates.</strong>{" "}
                  Every clickable thing is a <code>&lt;button&gt;</code> or{" "}
                  <code>&lt;a&gt;</code>; headings are ordered; one{" "}
                  <code>&lt;h1&gt;</code> per view.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">ARIA binding.</strong>{" "}
                  Dynamic ARIA uses <code>[attr.aria-*]</code> and returns{" "}
                  <code>null</code> to remove attributes when off.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Focus on navigation.</strong>{" "}
                  <code>NavigationEnd</code> moves focus to <code>&lt;main&gt;</code> or the new heading.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Overlays.</strong>{" "}
                  Dialogs trap focus (<code>cdkTrapFocus</code> / MatDialog), close on Escape, and restore focus.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Live regions.</strong>{" "}
                  Async results, toasts, and errors are announced via <code>LiveAnnouncer</code>.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Forms.</strong>{" "}
                  Labels associated; errors linked with <code>[attr.aria-describedby]</code> and <code>[attr.aria-invalid]</code>.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Names.</strong>{" "}
                  Icon-only buttons have a name; decorative images use <code>alt=""</code>.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Automated + manual.</strong>{" "}
                  @angular-eslint + jasmine-axe in CI, plus a keyboard and screen reader pass.
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
                  Audit Your Angular App in Seconds
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Run any deployed Angular page through our free axe-core-powered
                  auditor to catch missing names, unlabeled controls, and contrast
                  failures — then work through the manual checks above.
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
                content="angular accessibility template aria attr.aria-label focus management router navigation dialog cdktrapfocus liveannouncer reactive forms keyboard screen reader wcag 4.1.2 2.4.3 angular-eslint jasmine-axe react accessibility"
                title="Related Guides & Tools"
                maxItems={6}
                showDescriptions={true}
                excludeUrl="/guides/angular-accessibility"
              />
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
