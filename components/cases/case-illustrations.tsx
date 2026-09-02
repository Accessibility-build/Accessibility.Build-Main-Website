// Original diagrams for the case studies. Drawn here rather than sourced,
// because the alternatives are worse: a defendant's brand marks carry trademark
// problems, and stock photography of disabled people using computers is both
// cliched and tells the reader nothing. These carry information.

/**
 * The route the case took through the courts, with the outcome at each step.
 * Communicates the thing a paragraph struggles with: five stops, two reversals,
 * and six years to arrive where the complaint started.
 */
export function CourtPathDiagram() {
  const stops = [
    { court: "District Court", year: "2017", outcome: "Dismissed", tone: "defence" },
    { court: "Ninth Circuit", year: "2019", outcome: "Reversed", tone: "plaintiff" },
    { court: "Supreme Court", year: "2019", outcome: "Declined", tone: "neutral" },
    { court: "District Court", year: "2021", outcome: "Judgment", tone: "plaintiff" },
    { court: "Settled", year: "2022", outcome: "Confidential", tone: "neutral" },
  ] as const

  const toneFill: Record<string, string> = {
    defence: "fill-rose-700 dark:fill-rose-400",
    plaintiff: "fill-emerald-700 dark:fill-emerald-400",
    neutral: "fill-slate-400 dark:fill-slate-500",
  }

  return (
    <figure className="not-prose my-10">
      <figcaption className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
        The route the case took
      </figcaption>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/40 sm:p-6">
        <svg viewBox="0 0 760 150" className="w-full min-w-[560px]" role="img" aria-hidden="true">
          <line
            x1={40}
            x2={720}
            y1={62}
            y2={62}
            className="stroke-slate-200 dark:stroke-slate-700"
            strokeWidth={2}
          />
          {stops.map((stop, i) => {
            const x = 40 + i * ((720 - 40) / (stops.length - 1))
            return (
              <g key={`${stop.court}-${stop.year}`}>
                <circle cx={x} cy={62} r={9} className={toneFill[stop.tone]} />
                <circle
                  cx={x}
                  cy={62}
                  r={13}
                  fill="none"
                  className="stroke-white dark:stroke-slate-900"
                  strokeWidth={3}
                />
                <text
                  x={x}
                  y={34}
                  textAnchor="middle"
                  className="fill-slate-500 text-[11px] dark:fill-slate-400"
                >
                  {stop.year}
                </text>
                <text
                  x={x}
                  y={96}
                  textAnchor="middle"
                  className="fill-slate-900 text-[12px] font-semibold dark:fill-white"
                >
                  {stop.court}
                </text>
                <text
                  x={x}
                  y={114}
                  textAnchor="middle"
                  className="fill-slate-500 text-[11px] dark:fill-slate-400"
                >
                  {stop.outcome}
                </text>
              </g>
            )
          })}
          <text x={380} y={143} textAnchor="middle" className="fill-slate-500 text-[11px] dark:fill-slate-400">
            5 years, 9 months
          </text>
        </svg>

        {/* The same sequence in text, which is what assistive technology reads. */}
        <ol className="sr-only">
          {stops.map((stop) => (
            <li key={`${stop.court}-${stop.year}-text`}>
              {stop.year}, {stop.court}: {stop.outcome}.
            </li>
          ))}
          <li>Total elapsed time: 5 years, 9 months.</li>
        </ol>
      </div>
    </figure>
  )
}

/**
 * The three conformance levels as a stack, with the case's barriers marked at
 * the bottom one. The argument of the whole study in a single image: this was
 * not a hard case at the edge of the standard.
 */
export function ConformanceLevelsDiagram() {
  const levels = [
    { level: "AAA", label: "Enhanced. Rarely required in law.", w: 300, muted: true },
    { level: "AA", label: "The level regulators and contracts name.", w: 420, muted: true },
    { level: "A", label: "The floor. Every barrier in this case failed here.", w: 540, muted: false },
  ]

  return (
    <figure className="not-prose my-10">
      <figcaption className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
        Where the failures sat in the standard
      </figcaption>
      <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/40 sm:p-6">
        <svg viewBox="0 0 600 210" className="w-full" role="img" aria-hidden="true">
          {levels.map((l, i) => {
            const y = 12 + i * 62
            const x = (600 - l.w) / 2
            return (
              <g key={l.level}>
                <rect
                  x={x}
                  y={y}
                  width={l.w}
                  height={52}
                  rx={6}
                  className={
                    l.muted
                      ? "fill-slate-100 stroke-slate-200 dark:fill-slate-800/60 dark:stroke-slate-700"
                      : "fill-rose-50 stroke-rose-300 dark:fill-rose-950/40 dark:stroke-rose-800"
                  }
                  strokeWidth={1.5}
                />
                <text
                  x={x + 18}
                  y={y + 31}
                  className={
                    l.muted
                      ? "fill-slate-500 text-[15px] font-bold dark:fill-slate-400"
                      : "fill-rose-800 text-[15px] font-bold dark:fill-rose-300"
                  }
                >
                  {l.level}
                </text>
                <text
                  x={x + 58}
                  y={y + 31}
                  className={
                    l.muted
                      ? "fill-slate-500 text-[12px] dark:fill-slate-400"
                      : "fill-rose-900 text-[12px] font-medium dark:fill-rose-200"
                  }
                >
                  {l.label}
                </text>
              </g>
            )
          })}
        </svg>
        <p className="sr-only">
          The three WCAG conformance levels as a stack. AAA is enhanced and rarely required in law.
          AA is the level regulators and contracts name. A is the floor, and every barrier alleged in
          this case failed at that level.
        </p>
      </div>
    </figure>
  )
}
