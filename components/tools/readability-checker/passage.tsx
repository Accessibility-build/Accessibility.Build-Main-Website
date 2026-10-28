"use client"

import { Fragment, memo, useMemo } from "react"
import type { FindingKind, ReadabilityReport } from "@/lib/readability/analyse"
import { buildPassage, type PassageNode, type PassageSentence } from "@/lib/readability/passage"
import { cn } from "@/lib/utils"
import { FINDING_META, badgeText } from "./finding-meta"

// The checked text with findings marked in place. Every highlight is a real element with an id,
// so the findings lists can link to it and focus lands on it; a highlight that is switched off
// keeps its id but drops its styling, badge and screen reader label.
//
// Badges are aria-hidden because the screen reader label says the same thing in a full phrase.
// Word-level marks use <mark>, which screen readers announce as highlighted text.

const BADGE =
  "mx-0.5 inline-block rounded border border-slate-400 bg-white px-1 align-[0.1em] text-[0.7rem] font-semibold leading-4 tracking-wide text-slate-800 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-100"
const TARGET = "scroll-mt-28 rounded-sm focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-teal-600"

function Nodes({ nodes, enabled }: { nodes: PassageNode[]; enabled: Record<FindingKind, boolean> }) {
  return (
    <>
      {nodes.map((node, index) => {
        if (node.type === "text") return <Fragment key={index}>{node.text}</Fragment>
        const { finding } = node
        const meta = FINDING_META[finding.kind]
        const children = <Nodes nodes={node.children} enabled={enabled} />
        if (!enabled[finding.kind]) {
          return (
            <span key={finding.anchor} id={finding.anchor} tabIndex={-1} className={TARGET}>
              {children}
            </span>
          )
        }
        return (
          <Fragment key={finding.anchor}>
            <mark id={finding.anchor} tabIndex={-1} className={cn("bg-transparent text-inherit", meta.className, TARGET)}>
              {children}
              <span className="sr-only"> ({meta.srLabel(finding)})</span>
            </mark>
            <span aria-hidden="true" className={BADGE}>
              {badgeText(finding)}
            </span>
          </Fragment>
        )
      })}
    </>
  )
}

function SentenceView({ value, enabled }: { value: PassageSentence; enabled: Record<FindingKind, boolean> }) {
  const shown = value.kinds
    .map((kind, index) => ({ kind, detail: value.details[index] }))
    .filter(({ kind }) => enabled[kind])
  // The background comes from the most serious finding; the dashed border marks length.
  const background = shown.find(({ kind }) => kind === "veryHardSentence" || kind === "hardSentence")
  const long = shown.find(({ kind }) => kind === "longSentence")
  const label = shown.map(({ kind, detail }) => (kind === "longSentence" ? `very long, ${detail}` : `${FINDING_META[kind].badge.toLowerCase()}, ${detail}`))
  return (
    <span
      id={`rc-s-${value.sentence.index}`}
      tabIndex={-1}
      className={cn(
        TARGET,
        "box-decoration-clone",
        background && FINDING_META[background.kind].className,
        long && FINDING_META.longSentence.className,
      )}
    >
      {shown.length > 0 && (
        <>
          <span aria-hidden="true" className={BADGE}>
            {shown.map(({ kind }) => FINDING_META[kind].badge).join(", ")}
          </span>
          <span className="sr-only">Sentence flagged: {label.join("; ")}. </span>
        </>
      )}
      <Nodes nodes={value.nodes} enabled={enabled} />
    </span>
  )
}

function PassageView({ report, enabled }: { report: ReadabilityReport; enabled: Record<FindingKind, boolean> }) {
  const paragraphs = useMemo(() => buildPassage(report), [report])
  return (
    <div className="space-y-4 text-base leading-8 text-slate-900 dark:text-slate-100">
      {paragraphs.map((paragraph) => {
        const long = paragraph.longParagraph && enabled.longParagraph ? paragraph.longParagraph : null
        return (
          <div
            key={paragraph.index}
            id={`rc-p-${paragraph.index}`}
            tabIndex={-1}
            className={cn(TARGET, long && FINDING_META.longParagraph.className)}
          >
            {long && (
              <p className="mb-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Long paragraph: {long.detail}
              </p>
            )}
            <p className="whitespace-pre-line">
              {paragraph.parts.map((part, index) =>
                part.type === "gap" ? (
                  <Fragment key={`gap-${index}`}>{part.text}</Fragment>
                ) : (
                  <SentenceView key={part.value.sentence.index} value={part.value} enabled={enabled} />
                ),
              )}
            </p>
          </div>
        )
      })}
    </div>
  )
}

export const ReadabilityPassage = memo(PassageView)
