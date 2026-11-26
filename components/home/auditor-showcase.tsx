import Link from "next/link"
import { ArrowRight, Check, Code2, Keyboard, MonitorSmartphone, ScanSearch, Type, Wand2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { AuditorQuickStart } from "@/components/home/auditor-quick-start"

// Home page section for the URL Accessibility Auditor, sized to fit one desktop screen like the
// hero. The report on the right is a real result: a scan of Deque's Mars Commuter demo (a site
// built to fail) on 26 November 2026. If the engine changes what it reports, re-run that page and
// update EXAMPLE.

const CHECKS = [
  { icon: Keyboard, title: "Keyboard pass", sc: "2.4.7 · 2.4.11" },
  { icon: MonitorSmartphone, title: "Reflow at 320 px", sc: "1.4.10" },
  { icon: Type, title: "Text spacing", sc: "1.4.12" },
  { icon: Wand2, title: "Reduced motion", sc: "2.2.2" },
  { icon: Code2, title: "16 checks axe skips", sc: "1.1.1 · 2.1.1" },
  { icon: ScanSearch, title: "Full axe-core rules", sc: "WCAG 2.2 AA" },
]

const EXAMPLE = {
  host: "dequeuniversity.com/demo/mars",
  score: 0,
  failing: 18,
  review: 11,
  signals: [
    { label: "Keyboard", value: "1 control with no visible focus", ok: false },
    { label: "Reflow at 320 px", value: "Scrolls 644 px sideways", ok: false },
    { label: "Text spacing", value: "9 containers cut off", ok: false },
    { label: "Reduced motion", value: "No looping animation", ok: true },
  ],
  findings: [
    { title: "Alt text is a file name", detail: 'alt="icecream.jpg"' },
    { title: "Looks clickable, keyboard cannot reach it", detail: "“Add Another Trip”" },
  ],
  // WCAG 2.2 A and AA criteria in order: f fail, r review, t tested with nothing found, m manual.
  coverage: "fmmmmmtmmttfmftmfmrmrtmmmmtttfmmftmmmmmffmmmmmmmrmmmmfm",
}

const COVERAGE_CELL: Record<string, string> = {
  f: "bg-red-500",
  r: "bg-amber-400",
  t: "bg-emerald-500",
  m: "bg-slate-700",
}

export function AuditorShowcase() {
  const count = (code: string) => EXAMPLE.coverage.split("").filter((c) => c === code).length

  return (
    <section className="relative isolate overflow-hidden border-b" aria-labelledby="auditor-heading">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute right-0 top-0 h-full w-[44%] bg-muted/40 max-lg:hidden" />
      </div>

      <div className="container-wide py-12 lg:py-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase text-primary">
              <span className="h-2.5 w-2.5 bg-a11y-teal" aria-hidden="true" />
              Free tool · URL Accessibility Auditor
            </p>
            <h2 id="auditor-heading" className="mt-3 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
              Most scanners stop at axe&#8209;core. Ours keeps going.
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
              It uses your page the way people do, with a keyboard, zoomed in and with wider text spacing, then maps every result to WCAG 2.2 and lists what is left to test by hand.
            </p>

            <ul className="mt-6 grid max-w-2xl grid-cols-2 gap-2 sm:grid-cols-3" aria-label="What the audit checks">
              {CHECKS.map(({ icon: Icon, title, sc }) => (
                <li key={title} className="flex items-center gap-2.5 border bg-background px-3 py-2.5">
                  <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold leading-tight">{title}</span>
                    <span className="mt-0.5 block font-mono text-[11px] font-semibold text-primary">
                      <span className="sr-only">WCAG </span>
                      {sc}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 max-w-2xl">
              <AuditorQuickStart />
              <Link
                href="/tools/url-accessibility-auditor"
                className="mt-3 inline-flex items-center text-sm font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
              >
                See everything the auditor checks <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <figure>
            <div className="relative">
              <span className="absolute -left-2 -top-2 h-7 w-7 border-l-2 border-t-2 border-primary" aria-hidden="true" />
              <span className="absolute -bottom-2 -right-2 h-7 w-7 border-b-2 border-r-2 border-a11y-teal" aria-hidden="true" />
              <div className="overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 shadow-2xl">
                <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-2.5">
                  <span className="flex gap-1.5" aria-hidden="true">
                    <span className="h-2 w-2 rounded-full bg-slate-700" />
                    <span className="h-2 w-2 rounded-full bg-slate-700" />
                    <span className="h-2 w-2 rounded-full bg-slate-700" />
                  </span>
                  <span className="ml-2 truncate font-mono text-xs text-slate-300">Audit report · {EXAMPLE.host}</span>
                </div>

                <div className="space-y-4 p-4 sm:p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-[5px] border-slate-800">
                      <span className="text-xl font-bold tabular-nums">{EXAMPLE.score}</span>
                      <span className="sr-only"> out of 100</span>
                    </div>
                    <div>
                      <p className="font-semibold text-red-300">Severe barriers</p>
                      <p className="text-sm text-slate-300">
                        {EXAMPLE.failing} failing rules · {EXAMPLE.review} items to review
                      </p>
                    </div>
                  </div>

                  <ul className="divide-y divide-slate-800 border-y border-slate-800" aria-label="Beyond axe-core">
                    {EXAMPLE.signals.map((signal) => (
                      <li key={signal.label} className="flex items-center justify-between gap-3 py-2 text-sm">
                        <span className="text-slate-300">{signal.label}</span>
                        <span className="flex items-center gap-2 text-right font-medium">
                          {signal.value}
                          {signal.ok ? (
                            <Check className="h-4 w-4 shrink-0 text-emerald-400" aria-label="passed" role="img" />
                          ) : (
                            <X className="h-4 w-4 shrink-0 text-red-400" aria-label="problem" role="img" />
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">WCAG 2.2 A and AA coverage</p>
                    <div className="mt-2 grid grid-cols-[repeat(28,minmax(0,1fr))] gap-[3px]" aria-hidden="true">
                      {EXAMPLE.coverage.split("").map((code, index) => (
                        <span key={index} className={cn("aspect-square", COVERAGE_CELL[code])} />
                      ))}
                    </div>
                    <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-300">
                      <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 bg-red-500" aria-hidden="true" />{count("f")} fail</span>
                      <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 bg-amber-400" aria-hidden="true" />{count("r")} review</span>
                      <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 bg-emerald-500" aria-hidden="true" />{count("t")} no issues found</span>
                      <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 bg-slate-700 ring-1 ring-slate-500" aria-hidden="true" />{count("m")} need a person</span>
                    </p>
                  </div>

                  <ul className="space-y-2" aria-label="Findings axe-core passes">
                    {EXAMPLE.findings.map((finding) => (
                      <li key={finding.title} className="flex items-baseline justify-between gap-3 border border-slate-800 bg-slate-900 px-3 py-2">
                        <span className="text-sm font-medium">{finding.title}</span>
                        <span className="shrink-0 font-mono text-xs text-teal-300">{finding.detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <figcaption className="mt-4 text-xs leading-5 text-muted-foreground">
              Real result from our scan of Deque&apos;s Mars Commuter demo, a site built to fail, on 26 November 2026. axe-core passes both findings shown.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
