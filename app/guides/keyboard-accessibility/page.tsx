import type { Metadata } from "next"
import {
  ArticleStructuredData,
  HowToStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import KeyboardGuideClient from "./KeyboardGuideClient"

export const metadata: Metadata = {
  title:
    "Complete Keyboard Accessibility Guide | Interactive Demos & Code Examples",
  description:
    "The definitive guide to keyboard accessibility. Master focus management, skip links, roving tabindex, keyboard traps, and modal focus trapping with interactive demos and copy-ready code examples.",
  keywords: [
    "keyboard accessibility",
    "keyboard navigation",
    "focus management",
    "skip links",
    "roving tabindex",
    "keyboard trap",
    "focus trapping",
    "tab order",
    "keyboard accessible widgets",
    "wcag keyboard",
    "wcag 2.1.1",
    "keyboard testing",
  ],
  alternates: {
    canonical: "https://accessibility.build/guides/keyboard-accessibility",
  },
  openGraph: {
    title:
      "Complete Keyboard Accessibility Guide | Interactive Demos & Code Examples",
    description:
      "The definitive guide to keyboard accessibility. Master focus management, skip links, roving tabindex, keyboard traps, and modal focus trapping with interactive demos and copy-ready code examples.",
    url: "https://accessibility.build/guides/keyboard-accessibility",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "https://accessibility.build/og-image.png",
        width: 1200,
        height: 630,
        alt: "Complete Keyboard Accessibility Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Complete Keyboard Accessibility Guide | Interactive Demos & Code Examples",
    description:
      "The definitive guide to keyboard accessibility. Master focus management, skip links, roving tabindex, keyboard traps, and modal focus trapping with interactive demos and copy-ready code examples.",
  },
}

export default function KeyboardAccessibilityGuidePage() {
  return (
    <>
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Guides", url: "https://accessibility.build/guides" },
          {
            name: "Keyboard Accessibility",
            url: "https://accessibility.build/guides/keyboard-accessibility",
          },
        ]}
      />

      <HowToStructuredData
        name="How to Make a Web Page Keyboard Accessible"
        description="A step-by-step guide to implementing full keyboard accessibility on your web pages, covering skip links, tab order, focus management, and testing."
        totalTime="PT45M"
        tool={["Web browser", "Screen reader (optional)", "Code editor"]}
        steps={[
          {
            name: "Add skip navigation links",
            text: "Add a visually hidden link at the top of each page that becomes visible on focus and allows keyboard users to skip directly to the main content, bypassing repetitive navigation menus.",
          },
          {
            name: "Ensure logical tab order",
            text: "Verify that the DOM order of interactive elements matches the visual reading order. Avoid using positive tabindex values, which override the natural flow and create confusing navigation.",
          },
          {
            name: "Make all interactive elements focusable",
            text: "Use semantic HTML elements like button, a, input, and select for interactive controls. If custom elements are needed, add tabindex='0' and appropriate ARIA roles and keyboard event handlers.",
          },
          {
            name: "Add visible focus indicators",
            text: "Ensure every focusable element has a clearly visible focus indicator using CSS :focus-visible. Never remove the default outline without providing a high-contrast replacement.",
          },
          {
            name: "Implement keyboard event handlers",
            text: "Add onKeyDown handlers for custom widgets that respond to Enter, Space, Arrow keys, Escape, and other expected keys per WAI-ARIA Authoring Practices patterns.",
          },
          {
            name: "Manage focus for dynamic content",
            text: "When content is dynamically added, removed, or changed (such as after loading items, opening menus, or navigating in a single-page app), programmatically move focus to the relevant new content.",
          },
          {
            name: "Prevent keyboard traps",
            text: "Ensure users can always navigate away from every component using Tab, Shift+Tab, or Escape. The only acceptable exception is modal dialogs, which intentionally trap focus for usability, but must allow users to close them with Escape.",
          },
          {
            name: "Test with keyboard only",
            text: "Unplug your mouse and navigate the entire page using only Tab, Shift+Tab, Enter, Space, Arrow keys, and Escape. Verify every interaction is reachable, operable, and has visible focus indicators.",
          },
        ]}
      />

      <ArticleStructuredData
        headline="Complete Keyboard Accessibility Guide: Interactive Demos & Code Examples"
        description="The definitive guide to keyboard accessibility. Master focus management, skip links, roving tabindex, keyboard traps, and modal focus trapping with interactive demos and copy-ready code examples."
        author={{
          name: "Accessibility.build Team",
          url: "https://accessibility.build/about",
        }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2025-01-15"
        dateModified="2025-06-01"
        image="https://accessibility.build/og-image.png"
        url="https://accessibility.build/guides/keyboard-accessibility"
        wordCount={8500}
        keywords={[
          "keyboard accessibility",
          "focus management",
          "skip links",
          "roving tabindex",
          "keyboard trap",
          "focus trapping",
          "WCAG 2.1.1",
          "keyboard testing",
        ]}
      />

      <div className="min-h-screen pt-24 bg-white dark:bg-slate-950">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <a
                    href="/"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li aria-hidden="true" className="text-slate-400">
                  /
                </li>
                <li>
                  <a
                    href="/guides"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Guides
                  </a>
                </li>
                <li aria-hidden="true" className="text-slate-400">
                  /
                </li>
                <li>
                  <span className="text-slate-900 dark:text-white font-medium">
                    Keyboard Accessibility
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Interactive Guide */}
        <KeyboardGuideClient />

        {/* FAQ Section with Microdata */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div
            itemScope
            itemType="https://schema.org/FAQPage"
            className="space-y-6"
          >
            <div
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
              className="border border-slate-200 dark:border-slate-700 rounded-lg p-6"
            >
              <h3
                itemProp="name"
                className="text-lg font-semibold text-slate-900 dark:text-white mb-3"
              >
                Why is keyboard accessibility important?
              </h3>
              <div
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                <div
                  itemProp="text"
                  className="text-slate-600 dark:text-slate-400 leading-relaxed"
                >
                  Keyboard accessibility is essential because millions of users
                  rely on keyboards as their primary or sole means of navigating
                  the web. This includes people with motor disabilities who
                  cannot use a mouse, blind users who navigate with screen
                  readers (which are keyboard-driven), power users who prefer
                  keyboard shortcuts for efficiency, and people with temporary
                  injuries like a broken arm. WCAG Success Criterion 2.1.1
                  (Keyboard) requires that all functionality be operable through
                  a keyboard interface. Without keyboard accessibility, you
                  effectively lock out a significant portion of your users.
                </div>
              </div>
            </div>

            <div
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
              className="border border-slate-200 dark:border-slate-700 rounded-lg p-6"
            >
              <h3
                itemProp="name"
                className="text-lg font-semibold text-slate-900 dark:text-white mb-3"
              >
                What is a keyboard trap?
              </h3>
              <div
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                <div
                  itemProp="text"
                  className="text-slate-600 dark:text-slate-400 leading-relaxed"
                >
                  A keyboard trap occurs when a user navigating with their
                  keyboard becomes stuck inside a component and cannot Tab or
                  Shift+Tab out of it. Common causes include poorly coded custom
                  widgets, embedded iframes, and video or audio players that
                  capture focus. WCAG Success Criterion 2.1.2 (No Keyboard Trap)
                  specifically prohibits this. If keyboard focus can be moved to
                  a component using a keyboard interface, it must be possible to
                  move focus away from that component using only a keyboard. The
                  sole exception is modal dialogs, which intentionally trap focus
                  for usability, but must allow users to close them with Escape.
                </div>
              </div>
            </div>

            <div
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
              className="border border-slate-200 dark:border-slate-700 rounded-lg p-6"
            >
              <h3
                itemProp="name"
                className="text-lg font-semibold text-slate-900 dark:text-white mb-3"
              >
                What is roving tabindex?
              </h3>
              <div
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                <div
                  itemProp="text"
                  className="text-slate-600 dark:text-slate-400 leading-relaxed"
                >
                  Roving tabindex is a keyboard navigation pattern used in
                  composite widgets like toolbars, tab lists, menus, and tree
                  views. Instead of making every item in a group tabbable (which
                  would require many Tab presses to move through), only one item
                  has tabindex=&quot;0&quot; (making it tabbable), while all others have
                  tabindex=&quot;-1&quot; (removing them from the tab sequence). Arrow
                  keys move focus and the tabindex=&quot;0&quot; designation between
                  items within the group. This means a user can Tab into the
                  group, use Arrow keys to navigate within it, and Tab out to
                  the next component, greatly reducing the number of keystrokes
                  needed.
                </div>
              </div>
            </div>

            <div
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
              className="border border-slate-200 dark:border-slate-700 rounded-lg p-6"
            >
              <h3
                itemProp="name"
                className="text-lg font-semibold text-slate-900 dark:text-white mb-3"
              >
                How do I test keyboard accessibility?
              </h3>
              <div
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                <div
                  itemProp="text"
                  className="text-slate-600 dark:text-slate-400 leading-relaxed"
                >
                  To test keyboard accessibility, disconnect or stop using your
                  mouse and navigate your entire page using only the keyboard.
                  Press Tab to move forward through interactive elements and
                  Shift+Tab to move backward. Verify that: (1) you can reach
                  every interactive element, (2) the focus order is logical and
                  matches the visual layout, (3) focus indicators are clearly
                  visible on every element, (4) all buttons and links can be
                  activated with Enter or Space, (5) custom widgets support
                  arrow keys where appropriate, (6) there are no keyboard traps,
                  (7) modals trap and return focus correctly, and (8) skip links
                  work. Additionally, use browser DevTools to inspect tabindex
                  values and automated tools like axe, Lighthouse, or the
                  Accessibility.build audit tool for comprehensive analysis.
                </div>
              </div>
            </div>

            <div
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
              className="border border-slate-200 dark:border-slate-700 rounded-lg p-6"
            >
              <h3
                itemProp="name"
                className="text-lg font-semibold text-slate-900 dark:text-white mb-3"
              >
                What is a skip navigation link?
              </h3>
              <div
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                <div
                  itemProp="text"
                  className="text-slate-600 dark:text-slate-400 leading-relaxed"
                >
                  A skip navigation link (also called a &quot;skip link&quot; or
                  &quot;skip to main content&quot; link) is a hidden anchor link placed
                  at the very beginning of a page that becomes visible when it
                  receives keyboard focus. When activated, it jumps the user
                  past the site header, navigation menus, and other repetitive
                  content directly to the main content area. This is required by
                  WCAG Success Criterion 2.4.1 (Bypass Blocks) and is one of
                  the simplest yet most impactful keyboard accessibility
                  features you can implement. Without it, keyboard users must
                  Tab through every navigation link on every page before
                  reaching the content they want to read.
                </div>
              </div>
            </div>

            <div
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
              className="border border-slate-200 dark:border-slate-700 rounded-lg p-6"
            >
              <h3
                itemProp="name"
                className="text-lg font-semibold text-slate-900 dark:text-white mb-3"
              >
                What WCAG criteria relate to keyboard accessibility?
              </h3>
              <div
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                <div
                  itemProp="text"
                  className="text-slate-600 dark:text-slate-400 leading-relaxed"
                >
                  Several WCAG criteria directly address keyboard accessibility.
                  The most important are: 2.1.1 Keyboard (Level A) -- all
                  functionality must be operable via keyboard; 2.1.2 No Keyboard
                  Trap (Level A) -- users must be able to navigate away from any
                  component; 2.1.4 Character Key Shortcuts (Level A) -- if
                  single-character keyboard shortcuts exist, they must be
                  remappable or disableable; 2.4.1 Bypass Blocks (Level A) -- a
                  mechanism to skip repeated content blocks (skip links); 2.4.3
                  Focus Order (Level A) -- focus order must be logical and
                  meaningful; 2.4.7 Focus Visible (Level AA) -- keyboard focus
                  indicator must be visible; and 2.4.11 Focus Not Obscured
                  (Minimum) (Level AA, new in WCAG 2.2) -- the focused item
                  must not be entirely hidden by other content.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="keyboard accessibility focus management skip links tab order roving tabindex keyboard trap focus trapping WCAG 2.1.1 keyboard navigation screen reader accessible widgets"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
