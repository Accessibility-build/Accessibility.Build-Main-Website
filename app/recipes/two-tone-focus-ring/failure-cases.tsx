"use client"

import { useId, useState, type KeyboardEvent, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import styles from "./rings.module.css"

function Pane({ kind, children }: { kind: "Broken" | "Fixed"; children: ReactNode }) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-300 p-4 dark:border-slate-700">
      <p
        className={cn(
          "mb-3 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide",
          kind === "Broken" ? "bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200" : "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
        )}
      >
        {kind}
      </p>
      {children}
    </div>
  )
}

function Case({ number, title, criterion, children, why }: { number: string; title: string; criterion: string; why: ReactNode; children: ReactNode }) {
  return (
    <article className="rounded-3xl border border-slate-300 bg-white p-5 sm:p-7 dark:border-slate-700 dark:bg-slate-950">
      <p className="font-mono text-sm text-slate-600 dark:text-slate-400">
        Failure {number} · {criterion}
      </p>
      <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
      <div className="mt-2 max-w-prose text-slate-700 dark:text-slate-300">{why}</div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">{children}</div>
    </article>
  )
}

const ITEMS = ["Preheat", "Measure", "Whisk", "Fold", "Rest", "Bake", "Cool", "Serve"]

function StickyList({ fixed }: { fixed: boolean }) {
  return (
    <div
      role="region"
      aria-label={fixed ? "Fixed list under a sticky header" : "Broken list under a sticky header"}
      className="relative h-56 overflow-y-auto rounded-xl border border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
      style={fixed ? { scrollPaddingTop: "3.75rem" } : undefined}
    >
      <div className="sticky top-0 z-10 flex h-12 items-center bg-slate-900 px-3 text-sm font-semibold text-white dark:bg-black">
        Sticky header
      </div>
      <ul className="space-y-2 p-3">
        {ITEMS.map((item) => (
          <li key={item}>
            <button type="button" className="min-h-11 w-full rounded-lg border border-slate-400 bg-white px-3 text-left text-sm text-slate-900 dark:bg-slate-800 dark:text-white">
              {item}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ClippedCard({ fixed }: { fixed: boolean }) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900", fixed && "p-1.5")}>
      <p className="px-3 py-3 text-sm text-slate-700 dark:text-slate-300">A card with overflow: hidden and a full-width button.</p>
      <button
        type="button"
        className={cn(
          "min-h-11 w-full bg-white text-sm font-semibold text-slate-900 dark:bg-slate-800 dark:text-white",
          fixed ? "rounded-lg" : "rounded-none",
          styles.twoTonePreview,
          styles.twoTone,
        )}
      >
        Add to basket
      </button>
    </div>
  )
}

function Checkbox({ fixed }: { fixed: boolean }) {
  return (
    <label className="relative flex min-h-11 cursor-pointer items-center gap-3 text-sm text-slate-900 dark:text-white">
      <input type="checkbox" className={cn("peer", styles.checkInput, fixed && styles.checkInputFixed)} />
      <span
        aria-hidden="true"
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 border-slate-900 bg-white text-transparent peer-checked:bg-slate-900 peer-checked:text-white dark:border-white dark:bg-slate-900 dark:peer-checked:bg-white dark:peer-checked:text-slate-900",
          styles.checkBox,
        )}
      >
        ✓
      </span>
      Email me the next recipe
      <span className="sr-only">{fixed ? " (fixed example)" : " (broken example)"}</span>
    </label>
  )
}

const HERBS = ["Basil", "Coriander", "Mint", "Parsley"]

function HerbListbox({ fixed }: { fixed: boolean }) {
  const [active, setActive] = useState(0)
  const [focused, setFocused] = useState(false)
  const base = useId()
  const labelId = `${base}-label`
  const optionId = (i: number) => `${base}-option-${i}`

  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const next =
      e.key === "ArrowDown" ? Math.min(active + 1, HERBS.length - 1)
      : e.key === "ArrowUp" ? Math.max(active - 1, 0)
      : e.key === "Home" ? 0
      : e.key === "End" ? HERBS.length - 1
      : null
    if (next === null) return
    e.preventDefault()
    setActive(next)
  }

  return (
    <div>
      <p id={labelId} className="mb-2 text-sm font-medium text-slate-900 dark:text-white">
        Pick a herb {fixed ? "(fixed)" : "(broken)"}
      </p>
      <ul
        role="listbox"
        tabIndex={0}
        aria-labelledby={labelId}
        aria-activedescendant={optionId(active)}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="space-y-1 rounded-xl border border-slate-400 bg-white p-2 dark:bg-slate-900"
      >
        {HERBS.map((herb, i) => (
          <li
            key={herb}
            id={optionId(i)}
            role="option"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={cn(
              "flex min-h-11 cursor-pointer items-center justify-between rounded-lg px-3 text-sm text-slate-900 dark:text-white",
              focused && i === active && (fixed ? styles.optionActiveFixed : "bg-slate-100 dark:bg-slate-800"),
            )}
          >
            {herb}
            {i === active && <span aria-hidden="true">✓</span>}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function FailureCases() {
  const [forced, setForced] = useState(false)

  return (
    <div className="space-y-6">
      <Case
        number="01"
        criterion="2.4.11 Focus Not Obscured (AA)"
        title="It is hiding under a sticky header"
        why={
          <p>
            A perfect ring is no help if the focused control is under something. Tab to the bottom of each list, then press Shift and
            Tab to come back up. In the broken list each item slides under the sticky bar. The fixed list adds{" "}
            <code className="rounded bg-slate-100 px-1 font-mono text-sm dark:bg-slate-800">scroll-padding-top</code>{" "}
            equal to the bar&apos;s height, so the browser stops scrolling before the bar.
          </p>
        }
      >
        <Pane kind="Broken">
          <StickyList fixed={false} />
        </Pane>
        <Pane kind="Fixed">
          <StickyList fixed />
        </Pane>
      </Case>

      <Case
        number="02"
        criterion="1.4.11 Non-text Contrast and 2.4.7 Focus Visible (AA)"
        title="Its container cuts it off"
        why={
          <p>
            The ring is drawn outside the button, so a parent with{" "}
            <code className="rounded bg-slate-100 px-1 font-mono text-sm dark:bg-slate-800">overflow: hidden</code> clips it. Both
            buttons below show the ring as if focused. The fix is room: padding on the container at least as wide as the ring (4px
            here).
          </p>
        }
      >
        <Pane kind="Broken">
          <ClippedCard fixed={false} />
        </Pane>
        <Pane kind="Fixed">
          <ClippedCard fixed />
        </Pane>
      </Case>

      <Case
        number="03"
        criterion="2.4.7 Focus Visible (AA)"
        title="Forced-colours mode deletes half of it"
        why={
          <>
            <p>
              Windows high contrast mode and other forced-colours modes remove every{" "}
              <code className="rounded bg-slate-100 px-1 font-mono text-sm dark:bg-slate-800">box-shadow</code>. A ring made only of
              shadows vanishes completely. The recipe keeps one band as an{" "}
              <code className="rounded bg-slate-100 px-1 font-mono text-sm dark:bg-slate-800">outline</code>, which survives in the
              user&apos;s own colours. The switch below imitates the mode; to test the real thing, use Chrome DevTools, Rendering,
              Emulate CSS media feature forced-colors.
            </p>
            <button
              type="button"
              aria-pressed={forced}
              onClick={() => setForced((f) => !f)}
              className="mt-3 min-h-11 rounded-full border border-slate-500 px-4 text-sm font-medium text-slate-900 aria-pressed:bg-slate-900 aria-pressed:text-white dark:text-white dark:aria-pressed:bg-white dark:aria-pressed:text-slate-900"
            >
              Simulate forced colours
            </button>
          </>
        }
      >
        <Pane kind="Broken">
          <div className={cn("flex min-h-28 items-center justify-center rounded-xl bg-slate-50 p-6 dark:bg-slate-900", forced && styles.simulateForcedColors)}>
            <button type="button" className={cn("min-h-11 rounded-full bg-white px-5 text-sm font-semibold text-slate-900", styles.shadowOnlyPreview, styles.shadowOnly)}>
              Shadow-only ring
            </button>
          </div>
        </Pane>
        <Pane kind="Fixed">
          <div className={cn("flex min-h-28 items-center justify-center rounded-xl bg-slate-50 p-6 dark:bg-slate-900", forced && styles.simulateForcedColors)}>
            <button type="button" className={cn("min-h-11 rounded-full bg-white px-5 text-sm font-semibold text-slate-900", styles.twoTonePreview, styles.twoTone)}>
              Outline and shadow
            </button>
          </div>
        </Pane>
      </Case>

      <Case
        number="04"
        criterion="2.4.7 Focus Visible (AA)"
        title="Focus lands on something invisible"
        why={
          <p>
            Custom checkboxes usually hide the real input and draw a box next to it. Focus goes to the hidden input, so the ring is
            drawn around nothing. Tab to each checkbox. The fix moves the ring to the visible box with{" "}
            <code className="rounded bg-slate-100 px-1 font-mono text-sm dark:bg-slate-800">input:focus-visible + .box</code>.
          </p>
        }
      >
        <Pane kind="Broken">
          <Checkbox fixed={false} />
        </Pane>
        <Pane kind="Fixed">
          <Checkbox fixed />
        </Pane>
      </Case>

      <Case
        number="05"
        criterion="2.4.7 Focus Visible (AA)"
        title="Focus never reaches the option"
        why={
          <p>
            In a listbox or combobox built with{" "}
            <code className="rounded bg-slate-100 px-1 font-mono text-sm dark:bg-slate-800">aria-activedescendant</code>, keyboard
            focus stays on the container and the arrow keys only change which option is active. The CSS ring therefore circles the
            whole list. Tab into each list and use the arrow keys: the broken one marks the active option with a pale tint, the
            fixed one gives it the two-tone ring too.
          </p>
        }
      >
        <Pane kind="Broken">
          <HerbListbox fixed={false} />
        </Pane>
        <Pane kind="Fixed">
          <HerbListbox fixed />
        </Pane>
      </Case>
    </div>
  )
}
