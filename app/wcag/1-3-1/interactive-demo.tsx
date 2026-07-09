"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

type ExampleKey = "headings" | "lists" | "tables" | "forms"

interface StructureExample {
  key: ExampleKey
  label: string
  description: string
  semantic: React.ReactNode
  nonSemantic: React.ReactNode
  semanticAnnouncement: string
  nonSemanticAnnouncement: string
  problems: string[]
}

const examples: StructureExample[] = [
  {
    key: "headings",
    label: "Headings",
    description:
      "Real heading elements let screen reader users pull up a heading list and jump between sections. Text that only looks like a heading is invisible to that map.",
    semantic: (
      <div className="space-y-1.5">
        <p className="text-lg font-bold text-slate-900 dark:text-white">Main Page Title (h1)</p>
        <p className="text-base font-semibold text-slate-700 dark:text-slate-300">Section Heading (h2)</p>
        <p className="pl-3 text-sm font-medium text-slate-600 dark:text-slate-400">Subsection (h3)</p>
        <p className="text-base font-semibold text-slate-700 dark:text-slate-300">Another Section (h2)</p>
      </div>
    ),
    nonSemantic: (
      <div className="space-y-1.5">
        <p className="text-lg font-bold text-slate-900 dark:text-white">Main Page Title (styled div)</p>
        <p className="text-base font-semibold text-slate-700 dark:text-slate-300">Section Heading (styled div)</p>
        <p className="pl-3 text-sm font-medium text-slate-600 dark:text-slate-400">Subsection (styled div)</p>
        <p className="text-base font-semibold text-slate-700 dark:text-slate-300">Another Section (styled div)</p>
      </div>
    ),
    semanticAnnouncement:
      "“Main Page Title, heading level 1. Section Heading, heading level 2. Subsection, heading level 3. Another Section, heading level 2.” The user can press H to jump between them.",
    nonSemanticAnnouncement:
      "“Main Page Title. Section Heading. Subsection. Another Section.” — announced as plain paragraphs with no levels, and the heading-list shortcut finds nothing.",
    problems: [
      "Uses bold or large text instead of h1–h6 elements",
      "Screen readers cannot build a heading map or jump by heading",
      "Nesting and hierarchy are conveyed only by font size, which is visual-only",
    ],
  },
  {
    key: "lists",
    label: "Lists",
    description:
      "A real ul/ol tells assistive tech how many items there are and lets users skip the group. Lines separated only by <br> or divs are just a run of text.",
    semantic: (
      <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
        <li>Create an account</li>
        <li>Verify your email</li>
        <li>Complete your profile</li>
      </ul>
    ),
    nonSemantic: (
      <div className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
        <div>&bull; Create an account</div>
        <div>&bull; Verify your email</div>
        <div>&bull; Complete your profile</div>
      </div>
    ),
    semanticAnnouncement:
      "“List of 3 items. Create an account, 1 of 3. Verify your email, 2 of 3. Complete your profile, 3 of 3.” The count and position come for free.",
    nonSemanticAnnouncement:
      "“bullet Create an account. bullet Verify your email. bullet Complete your profile.” — no list is announced, no item count, and the L shortcut skips right past it.",
    problems: [
      "Uses divs with typed bullet characters instead of ul/ol/li",
      "No item count or “2 of 3” position is conveyed",
      "The list-navigation shortcut cannot find or skip the group",
    ],
  },
  {
    key: "tables",
    label: "Tables",
    description:
      "A data table with th and scope binds each cell to its row and column header, so a screen reader can announce “Revenue, February: $18,000.” A grid of divs loses those relationships.",
    semantic: (
      <table className="w-full border-collapse text-sm">
        <caption className="mb-2 text-left font-medium text-slate-700 dark:text-slate-300">
          Monthly sales
        </caption>
        <thead>
          <tr className="border-b border-slate-300 dark:border-slate-600">
            <th scope="col" className="p-1.5 text-left font-semibold">Month</th>
            <th scope="col" className="p-1.5 text-left font-semibold">Revenue</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <td className="p-1.5">January</td>
            <td className="p-1.5">$15,000</td>
          </tr>
          <tr>
            <td className="p-1.5">February</td>
            <td className="p-1.5">$18,000</td>
          </tr>
        </tbody>
      </table>
    ),
    nonSemantic: (
      <div className="text-sm">
        <div className="mb-2 font-medium text-slate-700 dark:text-slate-300">Monthly sales</div>
        <div className="grid grid-cols-2 gap-1">
          <div className="bg-slate-100 p-1.5 font-semibold dark:bg-slate-700">Month</div>
          <div className="bg-slate-100 p-1.5 font-semibold dark:bg-slate-700">Revenue</div>
          <div className="p-1.5">January</div>
          <div className="p-1.5">$15,000</div>
          <div className="p-1.5">February</div>
          <div className="p-1.5">$18,000</div>
        </div>
      </div>
    ),
    semanticAnnouncement:
      "“Monthly sales, table, 2 columns, 3 rows. Month: February. Revenue: $18,000.” Header context is repeated as the user moves between cells.",
    nonSemanticAnnouncement:
      "“Month. Revenue. January. $15,000. February. $18,000.” — a flat stream of values; the user cannot tell that $18,000 is February’s revenue.",
    problems: [
      "Uses a CSS grid of divs instead of table/th/td",
      "No header-to-cell relationship, so a value like “$18,000” has no context",
      "No caption and no column/row navigation with the table shortcuts",
    ],
  },
  {
    key: "forms",
    label: "Forms",
    description:
      "A <label> tied to its input with for/id means the field announces its name when focused, and clicking the label focuses the field. Loose text beside an input is not connected to it.",
    semantic: (
      <div className="space-y-3">
        <div>
          <label htmlFor="demo-name" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Full name
          </label>
          <input
            id="demo-name"
            type="text"
            className="w-full rounded border border-slate-300 p-1.5 text-sm dark:border-slate-600 dark:bg-slate-800"
          />
        </div>
        <div>
          <label htmlFor="demo-email" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Email address
          </label>
          <input
            id="demo-email"
            type="email"
            className="w-full rounded border border-slate-300 p-1.5 text-sm dark:border-slate-600 dark:bg-slate-800"
          />
        </div>
      </div>
    ),
    nonSemantic: (
      <div className="space-y-3">
        <div>
          <div className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">Full name</div>
          <input
            type="text"
            placeholder="Full name"
            className="w-full rounded border border-slate-300 p-1.5 text-sm dark:border-slate-600 dark:bg-slate-800"
          />
        </div>
        <div>
          <div className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">Email address</div>
          <input
            type="email"
            placeholder="Email address"
            className="w-full rounded border border-slate-300 p-1.5 text-sm dark:border-slate-600 dark:bg-slate-800"
          />
        </div>
      </div>
    ),
    semanticAnnouncement:
      "“Full name, edit text. Email address, edit text.” Each field speaks its label on focus, and clicking the label moves focus into the field.",
    nonSemanticAnnouncement:
      "“Edit text. Edit text.” — the fields have no accessible name (the placeholder disappears on typing), so the user hears nothing that identifies them.",
    problems: [
      "Label text sits in a div next to the input, not a <label for>",
      "Relies on placeholder text, which vanishes as soon as the user types",
      "The input has no programmatic name, so it announces only “edit text”",
    ],
  },
]

export default function SemanticsDemo() {
  const [selected, setSelected] = useState<ExampleKey>("headings")
  const [showAnnouncement, setShowAnnouncement] = useState(false)

  const example = examples.find((e) => e.key === selected)!

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {examples.map((e) => (
          <Button
            key={e.key}
            variant={selected === e.key ? "default" : "outline"}
            size="sm"
            onClick={() => setSelected(e.key)}
          >
            {e.label}
          </Button>
        ))}
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        {example.description}
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-950/20 p-5">
          <h3 className="mb-3 font-semibold text-green-800 dark:text-green-300">
            ✓ Semantic markup
          </h3>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
            {example.semantic}
          </div>
          {showAnnouncement && (
            <div className="mt-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-3">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <span className="font-medium">Screen reader:</span>{" "}
                {example.semanticAnnouncement}
              </p>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
          <h3 className="mb-3 font-semibold text-rose-800 dark:text-rose-300">
            ✗ Visual-only markup
          </h3>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
            {example.nonSemantic}
          </div>
          {showAnnouncement && (
            <div className="mt-3 rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-100/60 dark:bg-rose-950/30 p-3">
              <p className="text-sm text-rose-800 dark:text-rose-300">
                <span className="font-medium">Screen reader:</span>{" "}
                {example.nonSemanticAnnouncement}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
        <Button
          onClick={() => setShowAnnouncement((v) => !v)}
          variant={showAnnouncement ? "default" : "outline"}
        >
          {showAnnouncement ? "Hide screen reader output" : "Show screen reader output"}
        </Button>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Reveal what each version conveys to assistive technology.
        </p>
      </div>

      <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
        <h3 className="mb-2 font-semibold text-rose-800 dark:text-rose-300">
          Why the visual-only version fails 1.3.1
        </h3>
        <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
          {example.problems.map((p) => (
            <li key={p} className="flex gap-2">
              <span aria-hidden="true" className="text-rose-500 font-bold">✗</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
