import type { Metadata } from "next"
import {
  ArticleStructuredData,
  HowToStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import ScreenReaderGuideClient from "./ScreenReaderGuideClient"

export const metadata: Metadata = {
  title:
    "Screen Reader Testing Guide | NVDA, JAWS, VoiceOver & TalkBack",
  description:
    "The complete guide to testing websites with screen readers. Setup guides, command references, and testing procedures for NVDA, JAWS, VoiceOver (macOS/iOS), and TalkBack. Downloadable checklists included.",
  keywords: [
    "screen reader testing guide",
    "nvda testing guide",
    "jaws testing guide",
    "voiceover testing guide",
    "talkback testing guide",
    "screen reader commands",
    "assistive technology testing",
    "screen reader keyboard shortcuts",
    "accessibility testing",
    "wcag testing",
  ],
  alternates: {
    canonical: "https://accessibility.build/guides/screen-reader-testing",
  },
  openGraph: {
    title: "Screen Reader Testing Guide | NVDA, JAWS, VoiceOver & TalkBack",
    description:
      "The complete guide to testing websites with screen readers. Setup guides, command references, and testing procedures for NVDA, JAWS, VoiceOver (macOS/iOS), and TalkBack.",
    url: "https://accessibility.build/guides/screen-reader-testing",
    type: "article",
  },
}

export default function ScreenReaderTestingGuidePage() {
  return (
    <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Guides", url: "https://accessibility.build/guides" },
          {
            name: "Screen Reader Testing",
            url: "https://accessibility.build/guides/screen-reader-testing",
          },
        ]}
      />

      <HowToStructuredData
        name="How to Test a Website with a Screen Reader"
        description="A step-by-step process for testing web accessibility using screen readers like NVDA, JAWS, VoiceOver, and TalkBack."
        totalTime="PT45M"
        tool={["NVDA", "JAWS", "VoiceOver", "TalkBack", "Web browser"]}
        steps={[
          {
            name: "Install a screen reader",
            text: "Install a screen reader (NVDA recommended for beginners). NVDA is free, open-source, and works on Windows with Firefox for the best testing experience.",
          },
          {
            name: "Learn basic navigation commands",
            text: "Learn basic navigation commands such as moving by headings (H key), links (K key), form fields (F key), and how to toggle between browse and focus modes.",
          },
          {
            name: "Navigate the page by headings",
            text: "Navigate the page by headings to verify the heading hierarchy is logical, no levels are skipped, and the structure makes sense without visual context.",
          },
          {
            name: "Test all interactive elements",
            text: "Test all interactive elements including buttons, links, menus, and custom widgets. Ensure they announce their role, name, and state correctly.",
          },
          {
            name: "Verify form labels and error messages",
            text: "Verify form labels and error messages are properly associated with their inputs using the label element or aria-labelledby, and that errors are linked via aria-describedby.",
          },
          {
            name: "Check images for alt text",
            text: "Check images for alt text by navigating to each image and listening for the description. Informative images should have descriptive alt text. Decorative images should be hidden with alt=\"\".",
          },
          {
            name: "Test dynamic content and ARIA live regions",
            text: "Test dynamic content and ARIA live regions by triggering notifications, loading states, and content updates. Verify that changes are announced automatically without requiring user action.",
          },
          {
            name: "Document findings and prioritize fixes",
            text: "Document findings and prioritize fixes based on severity. Critical issues that block access should be fixed first, followed by major issues that cause significant difficulty.",
          },
        ]}
      />

      <ArticleStructuredData
        headline="Screen Reader Testing Guide: NVDA, JAWS, VoiceOver & TalkBack"
        description="The complete guide to testing websites with screen readers. Setup guides, command references, and testing procedures for NVDA, JAWS, VoiceOver (macOS/iOS), and TalkBack."
        author={{
          name: "Accessibility.build Team",
          url: "https://accessibility.build/about",
        }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2024-12-01"
        dateModified="2025-01-15"
        image="https://accessibility.build/og-image.png"
        url="https://accessibility.build/guides/screen-reader-testing"
        wordCount={8500}
        keywords={[
          "screen reader testing",
          "NVDA",
          "JAWS",
          "VoiceOver",
          "TalkBack",
          "accessibility testing",
          "WCAG",
          "assistive technology",
        ]}
      />

      <ScreenReaderGuideClient />

      {/* FAQ Section with inline microdata */}
      <section className="max-w-5xl mx-auto px-4 py-16">
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
            className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800"
          >
            <h3
              itemProp="name"
              className="text-lg font-semibold text-slate-900 dark:text-white mb-3"
            >
              Which screen reader should I start with?
            </h3>
            <div
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
            >
              <p itemProp="text" className="text-slate-600 dark:text-slate-400">
                Start with NVDA on Windows or VoiceOver on macOS. NVDA is free,
                open-source, and widely used, making it an ideal first screen
                reader for developers. Pair it with Firefox for the best testing
                experience. If you are on a Mac, VoiceOver is already built in
                and works best with Safari.
              </p>
            </div>
          </div>

          <div
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
            className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800"
          >
            <h3
              itemProp="name"
              className="text-lg font-semibold text-slate-900 dark:text-white mb-3"
            >
              Do I need to test with every screen reader?
            </h3>
            <div
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
            >
              <p itemProp="text" className="text-slate-600 dark:text-slate-400">
                No. Testing with one desktop screen reader (NVDA or JAWS) and
                one mobile screen reader (VoiceOver on iOS or TalkBack on
                Android) covers the vast majority of your user base. NVDA plus
                Firefox is the recommended starting point because it is free and
                catches the most common issues. Add JAWS and VoiceOver testing
                when you need higher coverage.
              </p>
            </div>
          </div>

          <div
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
            className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800"
          >
            <h3
              itemProp="name"
              className="text-lg font-semibold text-slate-900 dark:text-white mb-3"
            >
              What is the most used screen reader?
            </h3>
            <div
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
            >
              <p itemProp="text" className="text-slate-600 dark:text-slate-400">
                According to the WebAIM Screen Reader Survey, JAWS holds
                approximately 40% of the desktop screen reader market, followed
                by NVDA at around 30%. On mobile devices, VoiceOver dominates
                iOS usage, and TalkBack is the primary screen reader on Android.
                Overall, JAWS and NVDA together represent roughly 70% of desktop
                screen reader usage.
              </p>
            </div>
          </div>

          <div
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
            className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800"
          >
            <h3
              itemProp="name"
              className="text-lg font-semibold text-slate-900 dark:text-white mb-3"
            >
              How do screen readers work?
            </h3>
            <div
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
            >
              <p itemProp="text" className="text-slate-600 dark:text-slate-400">
                Screen readers work by accessing the accessibility tree, a
                structured representation of the web page that the browser
                builds from the HTML DOM. The screen reader uses the
                accessibility APIs provided by the operating system (such as
                UI Automation on Windows, NSAccessibility on macOS, and
                AccessibilityService on Android) to read element names, roles,
                states, and values aloud via text-to-speech or to a refreshable
                Braille display. Proper semantic HTML and ARIA attributes ensure
                the accessibility tree accurately represents the page content.
              </p>
            </div>
          </div>

          <div
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
            className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800"
          >
            <h3
              itemProp="name"
              className="text-lg font-semibold text-slate-900 dark:text-white mb-3"
            >
              What percentage of users rely on screen readers?
            </h3>
            <div
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
            >
              <p itemProp="text" className="text-slate-600 dark:text-slate-400">
                The World Health Organization estimates that at least 2.2 billion
                people globally have a near or distance vision impairment. While
                not all of these users require a screen reader, surveys indicate
                that millions actively use screen readers daily. The WebAIM
                survey consistently finds that the vast majority of screen reader
                users are people who are blind or have low vision, though a
                growing number of users with cognitive and learning disabilities
                also use screen readers or read-aloud features.
              </p>
            </div>
          </div>

          <div
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
            className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800"
          >
            <h3
              itemProp="name"
              className="text-lg font-semibold text-slate-900 dark:text-white mb-3"
            >
              Is VoiceOver the same on Mac and iPhone?
            </h3>
            <div
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
            >
              <p itemProp="text" className="text-slate-600 dark:text-slate-400">
                No. While both are called VoiceOver and share the same brand,
                they have different interfaces and commands. macOS VoiceOver uses
                keyboard shortcuts with the VO modifier (Control + Option),
                whereas iOS VoiceOver uses touch gestures such as swipe, double
                tap, and the rotor (a two-finger twist). The underlying
                accessibility APIs also differ between macOS and iOS. You should
                test with both if your site serves desktop and mobile users.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Content */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <RelatedContent
          content="screen reader testing NVDA JAWS VoiceOver TalkBack accessibility assistive technology WCAG keyboard navigation forms images alt text ARIA live regions"
          maxItems={3}
        />
      </section>
    </div>
  )
}
