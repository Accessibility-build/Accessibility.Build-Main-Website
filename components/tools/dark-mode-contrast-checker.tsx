"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import { AlertTriangle, CheckCircle2, Info, Moon, Sun, XCircle } from "lucide-react"
import { UrlCheckForm } from "@/components/tools/url-check-form"
import { SiteScanHandoff } from "@/components/tools/site-scan-handoff"
import { postTool } from "@/lib/render/client"
import {
  RISK_INFO,
  SUPPORT_LABEL,
  VERDICT_LABEL,
  WHERE_LABEL,
  formatRatio,
  headline,
  plural,
  reasonLabel,
  safeColour,
} from "@/lib/dark-mode/describe"
import type { ContrastFinding, ContrastItem, DarkModeResult, Shot } from "@/lib/dark-mode/types"
import { cn } from "@/lib/utils"

// Dark mode contrast checker. The server renders the page with a light colour scheme, then a dark
// one, runs axe colour contrast in each, and reads the colour-scheme signals Safari's Adaptive
// Dark Mode looks at. Every finding is listed as text; the screenshots are a visual aid only.

const ENDPOINT = "/api/tools/dark-mode-contrast-checker"

const linkClass = "font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300"
const thClass =
  "border-b border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
const tdClass = "border-b border-slate-200 px-3 py-2 align-top dark:border-slate-800"
const regionClass =
  "mt-3 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"

export default function DarkModeContrastChecker() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<DarkModeResult | null>(null)
  const [status, setStatus] = useState("")
  const abortRef = useRef<AbortController | null>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => () => abortRef.current?.abort(), [])

  // Focus from an effect keyed on the result, once the heading exists: a requestAnimationFrame
  // after the await can fire before React has committed it.
  useEffect(() => {
    if (result) headingRef.current?.focus()
  }, [result])

  const run = async () => {
    if (!url.trim()) {
      setError("Enter a page address, for example https://example.com")
      return
    }
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setLoading(true)
    setError(null)
    setResult(null)
    setStatus("Loading the page in light mode, then in dark mode. This usually takes 20 to 50 seconds.")
    try {
      const data = await postTool<DarkModeResult>(ENDPOINT, { url }, controller.signal)
      setResult(data)
      setStatus(`Results ready. ${headline(data)}`)
    } catch (caught) {
      if ((caught as Error)?.name === "AbortError") return
      // The form announces the error itself (role="alert"), so the status region stays quiet.
      setError(caught instanceof Error ? caught.message : "The check failed. Please try again.")
      setStatus("")
    } finally {
      if (abortRef.current === controller) setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <UrlCheckForm
        value={url}
        onChange={setUrl}
        onSubmit={run}
        loading={loading}
        submitLabel="Check light and dark"
        loadingLabel="Checking both modes"
        help="A public page. We load it in Chrome at 1280 by 800 pixels with a light colour scheme, then with a dark one, as a first-time visitor with no cookies."
        error={error}
      />

      <p role="status" aria-live="polite" className={cn("text-sm text-slate-700 dark:text-slate-300", !status && "sr-only")}>
        {status}
      </p>

      {result && (
        <section aria-labelledby="dark-mode-results" className="space-y-10">
          <div>
            <h2
              id="dark-mode-results"
              ref={headingRef}
              tabIndex={-1}
              className="font-serif text-2xl font-semibold text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-white sm:text-3xl"
            >
              Dark mode results
            </h2>
            <p className="mt-2 break-all text-sm text-slate-600 dark:text-slate-400">
              {result.title ? `${result.title}, ` : ""}
              {result.finalUrl}
            </p>
            <p className="mt-3 text-base text-slate-800 dark:text-slate-200">{headline(result)}</p>
          </div>
          <Results result={result} />
          <SiteScanHandoff
            source="dark_mode_contrast_checker"
            headingLevel="h3"
            heading="Check the rest of this page"
            body="Colour contrast is one part of WCAG. The free scan runs axe-core on the same page and reports missing labels, alt text, headings and more."
            defaultValue={result.finalUrl}
          />
        </section>
      )}
    </div>
  )
}

function Stat({ label, value, tone }: { label: string; value: string | number; tone: "neutral" | "good" | "bad" | "note" }) {
  const Icon = tone === "bad" ? XCircle : tone === "good" ? CheckCircle2 : tone === "note" ? Info : null
  return (
    <div
      className={cn(
        "rounded-lg border p-3",
        tone === "bad" ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/40" : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900",
      )}
    >
      <dt className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
        {Icon && (
          <Icon
            className={cn("h-3.5 w-3.5 shrink-0", tone === "bad" && "text-red-700 dark:text-red-300", tone === "good" && "text-emerald-700 dark:text-emerald-300")}
            aria-hidden="true"
          />
        )}
        {label}
      </dt>
      <dd className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{value}</dd>
    </div>
  )
}

function SubHeading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h3 id={id} className="text-xl font-semibold text-slate-900 dark:text-white">
      {children}
    </h3>
  )
}

function Explain({ children }: { children: ReactNode }) {
  return <div className="mt-2 max-w-[70ch] space-y-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{children}</div>
}

function Results({ result }: { result: DarkModeResult }) {
  const { counts, declaration, darkTheme, adaptive } = result
  const tone = (n: number) => (n > 0 ? "bad" : "good")
  const darkTested = result.dark !== null

  return (
    <div className="space-y-10">
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Fail only in dark" value={darkTested ? counts.darkOnly : "n/a"} tone={darkTested ? tone(counts.darkOnly) : "note"} />
        <Stat label="Fail in both modes" value={darkTested ? counts.both : "n/a"} tone={darkTested ? tone(counts.both) : "note"} />
        <Stat label={darkTested ? "Fail only in light" : "Fail in light"} value={darkTested ? counts.lightOnly : counts.lightOnly + counts.both} tone={tone(counts.lightOnly)} />
        <Stat label="Invisible text" value={counts.invisible} tone={tone(counts.invisible)} />
        <Stat label="Links lost (1.4.1)" value={counts.links} tone={tone(counts.links)} />
        <Stat label="Check by eye" value={counts.review} tone="note" />
      </dl>

      {result.notes.length > 0 && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <ul className="space-y-1">
            {result.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      <section aria-labelledby="dm-support">
        <SubHeading id="dm-support">Dark mode support</SubHeading>
        <dl className="mt-3 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          <Fact term="Declared colour schemes" detail={`${SUPPORT_LABEL[declaration.supports]}${declaration.source ? ` (from ${declaration.source === "meta" ? "the meta tag" : `CSS on ${declaration.source}`})` : ""}`} />
          <Fact term="color-scheme meta tag" detail={declaration.meta ? <code className="font-mono">{declaration.meta}</code> : "None"} />
          <Fact
            term="CSS color-scheme on html and body"
            detail={
              <>
                <code className="font-mono">{declaration.rootColorScheme}</code> and <code className="font-mono">{declaration.bodyColorScheme}</code>
              </>
            }
          />
          <Fact
            term="Own dark styles"
            detail={
              darkTheme.respondsToPreference
                ? `Yes: ${Math.round(darkTheme.changedShare * 100)}% of ${darkTheme.sampled} sampled text elements change colour${darkTheme.backgroundChanged ? ", and so does the page background" : ""}`
                : "No colours set by the page change between the two modes"
            }
          />
          <Fact
            term="Dark rules in the stylesheets"
            detail={`${plural(darkTheme.darkMediaRules, "prefers-color-scheme: dark block")}${darkTheme.usesLightDarkFunction ? ", plus light-dark()" : ""}, in ${plural(darkTheme.stylesheetsRead, "stylesheet")} read`}
          />
          <Fact
            term="Page background"
            detail={
              <span className="inline-flex flex-wrap items-center gap-2">
                <Swatch colour={darkTheme.lightBackground} /> light {darkTheme.lightBackground || "unknown"}
                <Swatch colour={darkTheme.darkBackground} /> dark {darkTheme.darkBackground || "unknown"}
              </span>
            }
          />
          {(declaration.darkPictureSources > 0 || declaration.themeColorByScheme) && (
            <Fact
              term="Other dark signals"
              detail={[
                declaration.darkPictureSources > 0 && `${plural(declaration.darkPictureSources, "picture source")} for dark mode`,
                declaration.themeColorByScheme && "theme-color set per scheme",
              ]
                .filter(Boolean)
                .join("; ")}
            />
          )}
        </dl>
        <Explain>
          <SupportExplanation result={result} />
        </Explain>
      </section>

      <section aria-labelledby="dm-safari">
        <SubHeading id="dm-safari">Safari Adaptive Dark Mode</SubHeading>
        <p
          className={cn(
            "mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold",
            adaptive.verdict === "will-adapt"
              ? "border-amber-400 bg-amber-50 text-amber-950 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100"
              : "border-slate-300 bg-slate-50 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white",
          )}
        >
          {adaptive.verdict === "will-adapt" ? <Moon className="h-4 w-4" aria-hidden="true" /> : <Sun className="h-4 w-4" aria-hidden="true" />}
          {VERDICT_LABEL[adaptive.verdict]}
        </p>
        <Explain>
          <p>{adaptive.reason}</p>
          <p>
            Adaptive Dark Mode is a Safari 27.3 beta feature that visitors turn on themselves. It changes colours in the browser, so its
            results sit outside your WCAG conformance, but they are what those visitors will see.
          </p>
        </Explain>
        {adaptive.preview && (
          <figure className="mt-4 max-w-2xl">
            <Screenshot shot={adaptive.preview} alt={`Top of the page with Chromium's automatic dark theme applied, as a rough stand-in for Safari's Adaptive Dark Mode.`} />
            <figcaption className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200">
              Approximation using Chromium&apos;s automatic dark theme, not Safari&apos;s algorithm. Safari uses its own colour transform and
              treats images, masks and blend modes differently, so its result will differ.
            </figcaption>
          </figure>
        )}
        {result.risks.length > 0 ? (
          <div className="mt-6 space-y-5">
            <h4 className="text-base font-semibold text-slate-900 dark:text-white">What Adaptive Dark Mode may not handle well</h4>
            {result.risks.map((group) => (
              <div key={group.kind}>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {RISK_INFO[group.kind].title} ({group.total})
                </p>
                <p className="mt-1 max-w-[70ch] text-sm leading-6 text-slate-700 dark:text-slate-300">{RISK_INFO[group.kind].explain}</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  {group.items.map((item, i) => (
                    <li key={`${item.selector}-${i}`} className="break-words">
                      <code className="break-all font-mono text-xs text-slate-600 dark:text-slate-400">{item.selector}</code>: {item.detail}
                    </li>
                  ))}
                  {group.total > group.items.length && <li>And {group.total - group.items.length} more.</li>}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-700 dark:text-slate-300">
            No bitmap logos in the header, canvases, masks, blend modes or repeating background images were found.
          </p>
        )}
      </section>

      <section aria-labelledby="dm-shots">
        <SubHeading id="dm-shots">Light and dark, side by side</SubHeading>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
          The top of the page, up to 1,600 pixels, in each mode. Every finding is also listed in the tables below.
        </p>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <figure className="min-w-0">
            {result.light.screenshot ? (
              <Screenshot shot={result.light.screenshot} alt={`Top of the page with a light colour scheme. ${plural(result.light.failures, "contrast failure")} in this mode.`} />
            ) : (
              <NoShot />
            )}
            <figcaption className="mt-2 flex items-center gap-1.5 text-sm font-medium text-slate-800 dark:text-slate-200">
              <Sun className="h-4 w-4" aria-hidden="true" />
              Light mode
            </figcaption>
          </figure>
          <figure className="min-w-0">
            {result.dark?.screenshot ? (
              <Screenshot shot={result.dark.screenshot} alt={`Top of the page with a dark colour scheme. ${plural(result.dark.failures, "contrast failure")} in this mode.`} />
            ) : (
              <NoShot />
            )}
            <figcaption className="mt-2 flex items-center gap-1.5 text-sm font-medium text-slate-800 dark:text-slate-200">
              <Moon className="h-4 w-4" aria-hidden="true" />
              Dark mode (prefers-color-scheme: dark)
            </figcaption>
          </figure>
        </div>
      </section>

      <section aria-labelledby="dm-contrast">
        <SubHeading id="dm-contrast">Contrast failures (WCAG 1.4.3)</SubHeading>
        <Explain>
          <p>
            Text that falls below 4.5:1, or 3:1 for large text, against its background. Failures that appear only in dark mode come from
            your dark styling, or from colours you set for light mode meeting the browser&apos;s dark defaults. Light-mode failures count
            against WCAG 1.4.3; treat dark-mode failures the same way, since your dark theme is your own code.
          </p>
        </Explain>
        {result.contrast.length > 0 ? (
          <ContrastTable findings={result.contrast} darkTested={darkTested} />
        ) : (
          <Good>No contrast failures found by axe-core in either mode.</Good>
        )}
        {result.contrast.length < counts.darkOnly + counts.lightOnly + counts.both && (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">The table shows up to 30 items per group.</p>
        )}
      </section>

      <section aria-labelledby="dm-invisible">
        <SubHeading id="dm-invisible">Invisible text</SubHeading>
        <Explain>
          <p>
            Text the same colour as its background (1:1). axe-core files these under &quot;needs review&quot; rather than failures, so most
            tools miss them. They usually come from setting only one of the two colours: a white background with the default text colour,
            which turns white in dark mode, or the reverse.
          </p>
        </Explain>
        {result.invisible.length > 0 ? (
          <SimpleTable
            caption="Elements whose text is the same colour as its background"
            headings={["Mode", "Element", "Text and background"]}
            rows={result.invisible.map((item) => [
              WHERE_LABEL[item.where],
              <Element key="e" selector={item.selector} text={item.text} />,
              <Colours key="c" item={item} />,
            ])}
          />
        ) : (
          <Good>No invisible text found.</Good>
        )}
      </section>

      <section aria-labelledby="dm-links">
        <SubHeading id="dm-links">Links that rely on colour (WCAG 1.4.1)</SubHeading>
        <Explain>
          <p>
            Links inside a block of text that are not underlined must differ from the surrounding text by at least 3:1. A link colour picked
            for a white page often blends into the text on a dark one.
          </p>
        </Explain>
        {result.links.length > 0 ? (
          <SimpleTable
            caption="Links distinguished from surrounding text by colour alone"
            headings={["Mode", "Link", "Contrast with the text around it"]}
            rows={result.links.map((item) => [WHERE_LABEL[item.where], <Element key="e" selector={item.selector} text={item.text} />, formatRatio(item.ratio)])}
          />
        ) : (
          <Good>No links in text failed this check.</Good>
        )}
      </section>

      <section aria-labelledby="dm-review">
        <SubHeading id="dm-review">Check by eye</SubHeading>
        <Explain>
          <p>
            axe-core could not work out the background behind these, for example text over an image or a gradient. Look at them in both
            modes; they are not failures until someone checks.
          </p>
        </Explain>
        {result.review.length > 0 ? (
          <>
            <SimpleTable
              caption="Text whose contrast needs checking by eye"
              headings={["Mode", "Element", "Why it needs a look"]}
              rows={result.review.map((item) => [WHERE_LABEL[item.where], <Element key="e" selector={item.selector} text={item.text} />, reasonLabel(item.reason)])}
            />
            {counts.review > result.review.length && (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Showing {result.review.length} of {counts.review}.</p>
            )}
          </>
        ) : (
          <Good>Nothing needs checking by eye.</Good>
        )}
      </section>

      <p className="text-sm text-slate-600 dark:text-slate-400">
        One page, at 1280 by 800 pixels, in Chrome. Theme switches on the site itself (a toggle button) are not tested, only the
        system preference. Check other colour pairs with the{" "}
        <Link href="/tools/contrast-checker" className={linkClass}>
          contrast checker
        </Link>
        .
      </p>
    </div>
  )
}

function SupportExplanation({ result }: { result: DarkModeResult }) {
  const { declaration, darkTheme } = result
  const hasDarkRules = darkTheme.darkMediaRules > 0 || darkTheme.usesLightDarkFunction
  if (!darkTheme.respondsToPreference && hasDarkRules) {
    return (
      <p>
        The stylesheets contain dark rules, but no colour the page sets changed with dark mode on. The site may choose its theme another
        way, such as a saved setting or a toggle, or the rules may belong to parts of the site not on this page.
        {declaration.supports === "light-dark" &&
          " Because the page declares light dark, Safari will not adapt it either, so dark mode visitors get the light design."}
      </p>
    )
  }
  if (declaration.supports === "light-dark" && !darkTheme.respondsToPreference) {
    return (
      <p>
        The page tells browsers it supports dark mode, but sets no dark colours of its own. In dark mode the browser switches its default
        background and text colours, while any colours you hard-coded for light mode stay as they are. That mix is where most dark-only
        failures and invisible text come from.
      </p>
    )
  }
  if (declaration.supports === "light-dark") {
    return <p>The page declares light and dark support and has its own dark styles. The contrast results below test that dark theme.</p>
  }
  if (darkTheme.respondsToPreference) {
    return (
      <p>
        The page has dark styles but does not declare color-scheme: light dark. Add the meta tag or the CSS property so browsers render
        form controls, scrollbars and the page background dark too, and so Safari knows not to adapt the page.
      </p>
    )
  }
  return (
    <p>
      The page has no dark mode of its own: it looks the same with dark mode on. That is not a WCAG failure, but Safari&apos;s Adaptive
      Dark Mode and similar browser features may darken it for visitors who ask for it.
    </p>
  )
}

function Fact({ term, detail }: { term: string; detail: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="font-medium text-slate-900 dark:text-white">{term}</dt>
      <dd className="mt-0.5 break-words text-slate-700 dark:text-slate-300">{detail}</dd>
    </div>
  )
}

function Good({ children }: { children: ReactNode }) {
  return (
    <p className="mt-3 flex items-start gap-2 text-sm text-emerald-800 dark:text-emerald-300">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      {children}
    </p>
  )
}

function Screenshot({ shot, alt }: { shot: Shot; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- a data URL from the API, not an optimisable asset
    <img
      src={shot.dataUrl}
      alt={alt}
      width={shot.width}
      height={shot.height}
      className="h-auto w-full rounded-lg border border-slate-300 dark:border-slate-700"
    />
  )
}

function NoShot() {
  return (
    <p className="flex aspect-[8/5] items-center justify-center rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
      No screenshot for this mode.
    </p>
  )
}

function Swatch({ colour }: { colour: string | null }) {
  const value = safeColour(colour)
  if (!value) return null
  return <span aria-hidden="true" className="inline-block h-3.5 w-3.5 shrink-0 rounded-sm border border-slate-400 align-middle dark:border-slate-500" style={{ backgroundColor: value }} />
}

function Element({ selector, text }: { selector: string; text: string }) {
  return (
    <>
      <span className="block text-slate-900 dark:text-white">{text || <em>No text</em>}</span>
      <code className="mt-0.5 block break-all font-mono text-xs text-slate-600 dark:text-slate-400">{selector}</code>
    </>
  )
}

function Colours({ item }: { item: Pick<ContrastItem, "fg" | "bg"> }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5 whitespace-nowrap font-mono text-xs">
      <Swatch colour={item.fg} />
      {item.fg ?? "?"} on
      <Swatch colour={item.bg} />
      {item.bg ?? "?"}
    </span>
  )
}

function Measure({ item }: { item: ContrastItem | null }) {
  if (!item) return <span className="text-slate-600 dark:text-slate-400">Passes</span>
  return (
    <>
      <span className="block font-semibold text-slate-900 dark:text-white">{formatRatio(item.ratio)}</span>
      <Colours item={item} />
    </>
  )
}

function ContrastTable({ findings, darkTested }: { findings: ContrastFinding[]; darkTested: boolean }) {
  const caption = "Contrast failures in light and dark mode"
  return (
    <div tabIndex={0} role="region" aria-label={caption} className={regionClass}>
      <table className="w-full min-w-[44rem] border-collapse text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            <th scope="col" className={thClass}>
              Where
            </th>
            <th scope="col" className={thClass}>
              Element
            </th>
            <th scope="col" className={thClass}>
              Light mode
            </th>
            <th scope="col" className={thClass}>
              Dark mode
            </th>
            <th scope="col" className={thClass}>
              Needs
            </th>
          </tr>
        </thead>
        <tbody className="text-slate-700 dark:text-slate-300">
          {findings.map((finding, i) => (
            <tr key={`${finding.where}-${finding.selector}-${i}`}>
              <th scope="row" className={cn(tdClass, "text-left font-medium text-slate-900 dark:text-white")}>
                {darkTested ? WHERE_LABEL[finding.where] : "Light"}
              </th>
              <td className={cn(tdClass, "max-w-[18rem]")}>
                <Element selector={finding.selector} text={finding.text} />
                {finding.hint && <span className="mt-1 block text-xs text-slate-700 dark:text-slate-300">{finding.hint}</span>}
              </td>
              <td className={tdClass}>
                <Measure item={finding.light} />
              </td>
              <td className={tdClass}>{darkTested ? <Measure item={finding.dark} /> : <span>Not tested</span>}</td>
              <td className={cn(tdClass, "whitespace-nowrap")}>{formatRatio((finding.dark ?? finding.light)?.required ?? null)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SimpleTable({ caption, headings, rows }: { caption: string; headings: string[]; rows: ReactNode[][] }) {
  return (
    <div tabIndex={0} role="region" aria-label={caption} className={regionClass}>
      <table className="w-full min-w-[36rem] border-collapse text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {headings.map((heading) => (
              <th key={heading} scope="col" className={thClass}>
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-slate-700 dark:text-slate-300">
          {rows.map((cells, i) => (
            <tr key={i}>
              {cells.map((cell, j) =>
                j === 0 ? (
                  <th key={j} scope="row" className={cn(tdClass, "text-left font-medium text-slate-900 dark:text-white")}>
                    {cell}
                  </th>
                ) : (
                  <td key={j} className={tdClass}>
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
