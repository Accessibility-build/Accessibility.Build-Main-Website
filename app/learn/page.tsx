import Link from "next/link"
import { LearnHub } from "@/components/learn/learn-hub"
import { getCriterion, wcagPath } from "@/lib/wcag-pages"

// The hub itself is a client component (framer-motion, hover state). The
// explanatory copy below is server-rendered and slotted into the hub between
// the pattern cards and the Coming Soon section, so it is in the served HTML.

const patternCriteria: Array<{
  pattern: string
  href: string
  criteria: string[]
  guide: { href: string; label: string } | null
}> = [
  {
    pattern: "Data tables",
    href: "/learn/table",
    criteria: ["1.3.1", "4.1.2", "4.1.3", "1.4.10"],
    guide: { href: "/guides/accessible-data-tables", label: "Accessible data tables guide" },
  },
  {
    pattern: "Pagination",
    href: "/learn/pagination",
    criteria: ["1.3.1", "2.4.4", "1.4.1", "4.1.3"],
    guide: { href: "/guides/accessible-pagination", label: "Accessible pagination guide" },
  },
  {
    pattern: "Modal dialogs",
    href: "/learn/modals",
    criteria: ["2.1.2", "2.4.3", "4.1.2", "2.4.7"],
    guide: { href: "/guides/accessible-dialog", label: "Accessible dialog guide" },
  },
  {
    pattern: "Carousels",
    href: "/learn/carousels",
    criteria: ["2.2.2", "2.1.1", "4.1.2", "2.5.8"],
    guide: null,
  },
  {
    pattern: "Search and autocomplete",
    href: "/learn/search",
    criteria: ["4.1.2", "3.3.2", "4.1.3", "2.1.1"],
    guide: { href: "/guides/accessible-combobox", label: "Accessible combobox guide" },
  },
]

function PatternOverview() {
  return (
    <section aria-labelledby="learn-overview" className="px-4 py-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="max-w-4xl space-y-4">
          <h2 id="learn-overview" className="text-2xl font-bold text-foreground">
            What These Demos Teach
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Each pattern page is a short, self-contained lesson on one interface
            component that is easy to get wrong: a data table, a set of page
            controls, a modal dialog, a carousel, or a search box with
            suggestions. The page is split into sections you move between with
            the tab bar at the top. Most sections pair a working demo with the
            code that produced it, and several demos have a toggle that swaps
            between an inaccessible version and the fixed one so you can feel
            the difference with a keyboard or a screen reader rather than read
            about it.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            The accessible versions follow the W3C ARIA Authoring Practices
            patterns and the relevant WCAG 2.2 success criteria, and each page
            ends with a list of the mistakes we see most often in production
            code. The demos are deliberately minimal. They show the essential
            markup, focus handling, and announcements, not a production
            component library, and they are teaching aids rather than proof of
            conformance for any real product. Test your own implementation
            against the criteria; do not assume that copying a demo settles
            the question.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
            <caption className="sr-only">
              Patterns covered, the WCAG 2.2 success criteria each one exercises, and the in-depth guide for each
            </caption>
            <thead className="bg-muted">
              <tr>
                <th scope="col" className="p-3 text-left font-semibold">Pattern</th>
                <th scope="col" className="p-3 text-left font-semibold">WCAG 2.2 criteria you will exercise</th>
                <th scope="col" className="p-3 text-left font-semibold">In-depth guide</th>
              </tr>
            </thead>
            <tbody>
              {patternCriteria.map((row) => (
                <tr key={row.pattern} className="border-t border-border align-top">
                  <th scope="row" className="p-3 text-left font-medium">
                    <Link href={row.href} className="text-blue-600 dark:text-blue-400 hover:underline">
                      {row.pattern}
                    </Link>
                  </th>
                  <td className="p-3 text-muted-foreground">
                    <ul className="space-y-1">
                      {row.criteria.map((number) => {
                        const criterion = getCriterion(number)
                        return (
                          <li key={number}>
                            <Link href={wcagPath(number)} className="hover:underline">
                              {number} {criterion?.title ?? ""}
                            </Link>
                            {criterion ? ` (${criterion.level})` : ""}
                          </li>
                        )
                      })}
                    </ul>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {row.guide ? (
                      <Link href={row.guide.href} className="text-blue-600 dark:text-blue-400 hover:underline">
                        {row.guide.label}
                      </Link>
                    ) : (
                      "No separate guide yet; the pattern page carries the full explanation."
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="max-w-4xl space-y-4">
          <h3 className="text-xl font-semibold text-foreground">How to Get the Most from a Demo</h3>
          <p className="text-muted-foreground leading-relaxed">
            Put the mouse down. Every accessible demo can be operated with Tab,
            Shift+Tab, Enter, Space, Escape, and the arrow keys, and each page
            lists the exact keys it expects. Then turn on a screen reader: on
            macOS, VoiceOver is built in and starts with Command+F5; on Windows,
            NVDA is free. Listen for the things sighted users take for granted,
            such as how many results appeared, which page is current, or that a
            dialog has opened. If you cannot tell from the audio alone, you have
            found the gap the lesson is about.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            When you are ready to apply a pattern, the{" "}
            <Link href="/guides/keyboard-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
              keyboard accessibility guide
            </Link>{" "}
            covers the conventions every widget shares, the{" "}
            <Link href="/checklists/interactive" className="text-blue-600 dark:text-blue-400 hover:underline">
              interactive WCAG checklist
            </Link>{" "}
            tracks which criteria you have verified, and the{" "}
            <Link href="/tools/accessibility-code-generator" className="text-blue-600 dark:text-blue-400 hover:underline">
              code generator
            </Link>{" "}
            can draft a starting point in your framework for you to review
            against what you learned here.
          </p>
        </div>
      </div>
    </section>
  )
}

export default function LearnPage() {
  return <LearnHub afterPatterns={<PatternOverview />} />
}
