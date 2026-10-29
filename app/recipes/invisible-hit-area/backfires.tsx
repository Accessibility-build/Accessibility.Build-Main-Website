"use client"

import { useState, type CSSProperties, type ReactNode } from "react"
import { Archive, Trash2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import styles from "./hit.module.css"

function Pane({ kind, children }: { kind: "Backfires" | "Fixed"; children: ReactNode }) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-300 p-4 dark:border-slate-700">
      <p
        className={cn(
          "mb-3 inline-block rounded-full px-2.5 py-0.5 font-mono text-xs font-bold uppercase tracking-wide",
          kind === "Backfires" ? "bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200" : "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
        )}
      >
        {kind}
      </p>
      {children}
    </div>
  )
}

function Case({ number, title, why, children }: { number: string; title: string; why: ReactNode; children: ReactNode }) {
  return (
    <article className="rounded-3xl border-2 border-[#0b2545] bg-white p-5 sm:p-7 dark:border-amber-300/60 dark:bg-slate-950">
      <p className="font-mono text-sm font-semibold text-[#0b2545] dark:text-amber-200">Detail {number}</p>
      <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
      <div className="mt-2 max-w-prose text-slate-700 dark:text-slate-300">{why}</div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">{children}</div>
    </article>
  )
}

const code = "rounded bg-slate-100 px-1 font-mono text-sm dark:bg-slate-800"
const iconButton = "flex h-4 w-4 items-center justify-center rounded bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-white"

function OverlapPair({ inset, gap }: { inset: number; gap: number }) {
  const [last, setLast] = useState("Nothing yet")
  return (
    <div>
      <div className={cn("flex h-40 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900", styles.reveal)}>
        {/* Drawn 2.5 times actual size; the transform scales the hit areas too. */}
        <div className="flex items-center" style={{ gap, transform: "scale(2.5)" }}>
          {[
            { label: "Delete", icon: Trash2 },
            { label: "Archive", icon: Archive },
          ].map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              onClick={() => setLast(label)}
              className={cn(styles.hit, iconButton)}
              style={{ "--hit-inset": `${-inset}px` } as CSSProperties}
            >
              <Icon aria-hidden="true" className="h-3 w-3" />
            </button>
          ))}
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-700 dark:text-slate-300" role="status">
        Last tap went to: <strong className="text-slate-900 dark:text-white">{last}</strong>
      </p>
    </div>
  )
}

function CornerCard({ fixed }: { fixed: boolean }) {
  return (
    <div className={cn(styles.reveal)}>
      <div className={cn("relative h-28 overflow-hidden rounded-xl border border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900", fixed && "p-1.5")}>
        <div className="relative h-full">
          <p className="p-3 pr-8 text-sm text-slate-700 dark:text-slate-300">A dismissable notice with overflow: hidden.</p>
          {/* The wrapper does the corner positioning: .hit makes the button itself position: relative. */}
          <span className="absolute right-0 top-0 flex">
            <button
              type="button"
              aria-label={fixed ? "Dismiss notice (fixed example)" : "Dismiss notice (example that backfires)"}
              className={cn(styles.hit, iconButton)}
              style={{ "--hit-inset": "-4px" } as CSSProperties}
            >
              <X aria-hidden="true" className="h-3 w-3" />
            </button>
          </span>
        </div>
      </div>
    </div>
  )
}

export function Backfires() {
  return (
    <div className="space-y-6">
      <Case
        number="01"
        title="Hit areas that overlap their neighbours"
        why={
          <p>
            Two 16px buttons 4px apart, each given a 44px hit area. The painted areas overlap, and a tap in the overlap goes to
            whichever button comes later in the page, here Archive, even when the person was aiming at Delete. WCAG does not
            count overlapping area toward target size, so this fails 2.5.8 as well as being risky. Tap the space just right of
            Delete in each version.
          </p>
        }
      >
        <Pane kind="Backfires">
          <OverlapPair inset={14} gap={4} />
        </Pane>
        <Pane kind="Fixed">
          <OverlapPair inset={4} gap={8} />
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">24px hit areas and an 8px gap: the areas meet but never overlap.</p>
        </Pane>
      </Case>

      <Case
        number="02"
        title="A container that clips the hit area"
        why={
          <p>
            The hit area lives outside the button, so a parent with <code className={code}>overflow: hidden</code> cuts it off. A
            close button tucked into a corner keeps only a quarter of its extra area. Give the container padding at least as wide
            as the inset, or move the button in from the edge.
          </p>
        }
      >
        <Pane kind="Backfires">
          <CornerCard fixed={false} />
        </Pane>
        <Pane kind="Fixed">
          <CornerCard fixed />
        </Pane>
      </Case>

      <Case
        number="03"
        title="A focus ring that ignores the hit area"
        why={
          <p>
            Keyboard focus still draws its ring around the visible 16px button, not the area that takes the tap. That is
            fine for 2.4.7, but a ring drawn on the <code className={code}>::before</code> shows the real target and is easier to
            see. Tab to each button.
          </p>
        }
      >
        <Pane kind="Backfires">
          <div className="flex h-32 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900 [&>*]:scale-[2.5]">
            <button type="button" aria-label="Close (ring on the icon)" className={cn(styles.hit, iconButton)} style={{ "--hit-inset": "-4px" } as CSSProperties}>
              <X aria-hidden="true" className="h-3 w-3" />
            </button>
          </div>
        </Pane>
        <Pane kind="Fixed">
          <div className="flex h-32 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900 [&>*]:scale-[2.5]">
            <button type="button" aria-label="Close (ring on the hit area)" className={cn(styles.hit, styles.ringOnHit, iconButton)} style={{ "--hit-inset": "-4px" } as CSSProperties}>
              <X aria-hidden="true" className="h-3 w-3" />
            </button>
          </div>
        </Pane>
      </Case>

      <Case
        number="04"
        title="Automated checkers cannot see it"
        why={
          <p>
            axe, and most target size checkers including ours, measure the element&apos;s own box and do not add its{" "}
            <code className={code}>::before</code>. A button that really takes taps across 24px is reported as 16px, so expect a
            flag and verify by hand. If the report has to come back clean, use padding with{" "}
            <code className={code}>min-width</code> and <code className={code}>min-height</code> instead (W3C technique C42).
            Tools can measure that, but unlike the pseudo-element it takes up space in the layout.
          </p>
        }
      >
        <Pane kind="Backfires">
          <div className={cn("flex h-32 items-center justify-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-900 [&>*]:scale-[2.5]", styles.reveal)}>
            <button type="button" aria-label="Close (pseudo-element hit area)" className={cn(styles.hit, iconButton)} style={{ "--hit-inset": "-4px" } as CSSProperties}>
              <X aria-hidden="true" className="h-3 w-3" />
            </button>
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Real target 24px. A checker sees a 16px box.</p>
        </Pane>
        <Pane kind="Fixed">
          <div className="flex h-32 items-center justify-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-900 [&>*]:scale-[2.5]">
            <button
              type="button"
              aria-label="Close (padded to 24px)"
              className="flex min-h-6 min-w-6 items-center justify-center rounded outline-1 outline-dashed outline-amber-600 dark:outline-amber-300"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-white">
                <X aria-hidden="true" className="h-3 w-3" />
              </span>
            </button>
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">The same look, padded to a 24px box that tools can measure.</p>
        </Pane>
      </Case>

      <Case
        number="05"
        title="Links inside a sentence"
        why={
          <p>
            Inline links are exempt from both target size criteria, and for good reason: growing a link in a paragraph makes its
            hit area cover the lines above and below, so a tap meant for the text, or for another link, opens this one. Leave
            inline links alone and give the text a generous line height instead.
          </p>
        }
      >
        <Pane kind="Backfires">
          <p className={cn("text-sm leading-5 text-slate-700 dark:text-slate-300", styles.reveal)}>
            Our returns window is thirty days from delivery. Read the{" "}
            <a href="#backfires" className={cn(styles.hit, "underline")} style={{ "--hit-inset": "-10px" } as CSSProperties}>
              returns policy
            </a>{" "}
            before you send anything back, and keep the original packaging where you can.
          </p>
        </Pane>
        <Pane kind="Fixed">
          <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">
            Our returns window is thirty days from delivery. Read the{" "}
            <a href="#backfires" className="underline">
              returns policy
            </a>{" "}
            before you send anything back, and keep the original packaging where you can.
          </p>
        </Pane>
      </Case>
    </div>
  )
}
