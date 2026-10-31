// Decorative drawings for the /research hub. Each is drawn in code so it stays
// sharp and follows the theme. They carry no data of their own, except the
// benchmark grid, which draws the published 12 of 30 result.

const hidden = { "aria-hidden": true, focusable: false } as const

export function HubHeroIllustration({ className }: { className?: string }) {
  const bars = [46, 92, 68, 138, 104, 176, 124, 210, 158]
  return (
    <svg viewBox="0 0 420 300" fill="none" className={className} {...hidden}>
      <g className="stroke-border" strokeWidth="1">
        {[20, 80, 140, 200, 260].map((y) => (
          <line key={y} x1="0" x2="420" y1={y} y2={y} />
        ))}
      </g>
      {bars.map((height, index) => {
        const x = 18 + index * 44
        const highlighted = index === 7
        return (
          <rect
            key={x}
            x={x}
            y={260 - height}
            width="30"
            height={height}
            className={highlighted ? "fill-primary" : "fill-muted-foreground/25"}
          />
        )
      })}
      <g className="stroke-foreground" strokeWidth="2.5">
        <path d="M312 42V30h12" />
        <path d="M356 30h12v12" />
        <path d="M368 262v12h-12" />
        <path d="M324 274h-12v-12" />
      </g>
      <rect x="0" y="288" width="12" height="12" className="fill-a11y-teal" />
      <line x1="24" x2="420" y1="294" y2="294" className="stroke-foreground" strokeWidth="2" />
    </svg>
  )
}

/** An accessibility tree in which some controls have no name. */
export function AgentTreeIllustration({ className }: { className?: string }) {
  const leaves = [
    { y: 26, named: true },
    { y: 62, named: false },
    { y: 98, named: true },
    { y: 134, named: false },
  ]
  return (
    <svg viewBox="0 0 320 160" fill="none" className={className} {...hidden}>
      <rect x="20" y="66" width="72" height="28" className="fill-primary" />
      {leaves.map(({ y, named }) => (
        <g key={y}>
          <path d={`M92 80H130V${y}H160`} className="stroke-muted-foreground" strokeWidth="1.5" />
          <rect
            x="160"
            y={y - 12}
            width="140"
            height="24"
            className={named ? "fill-muted-foreground/25" : "stroke-foreground"}
            strokeWidth="1.5"
            strokeDasharray={named ? undefined : "5 4"}
          />
          {named ? <rect x="172" y={y - 3} width="74" height="6" className="fill-foreground" /> : null}
        </g>
      ))}
    </svg>
  )
}

/** A statement with some required elements present and some missing. */
export function StatementIllustration({ className }: { className?: string }) {
  const rows = [
    { y: 34, present: true, width: 150 },
    { y: 66, present: true, width: 122 },
    { y: 98, present: false, width: 140 },
    { y: 130, present: true, width: 96 },
  ]
  return (
    <svg viewBox="0 0 320 160" fill="none" className={className} {...hidden}>
      <rect x="60" y="10" width="200" height="146" className="stroke-foreground" strokeWidth="1.5" />
      {rows.map(({ y, present, width }) => (
        <g key={y}>
          {present ? (
            <>
              <rect x="76" y={y - 8} width="16" height="16" className="fill-primary" />
              <path d={`M80 ${y}l3 3 5-6`} className="stroke-primary-foreground" strokeWidth="1.5" />
              <rect x="102" y={y - 3} width={width} height="6" className="fill-muted-foreground/40" />
            </>
          ) : (
            <>
              <rect x="76" y={y - 8} width="16" height="16" className="stroke-foreground" strokeWidth="1.5" strokeDasharray="3 3" />
              <rect x="102" y={y - 3} width={width} height="6" className="stroke-muted-foreground" strokeDasharray="4 4" />
            </>
          )}
        </g>
      ))}
    </svg>
  )
}

/** Thirty seeded defects, twelve of them found by all four tools. */
export function BenchmarkGridIllustration({ className }: { className?: string }) {
  const cells = Array.from({ length: 30 }, (_, index) => index)
  return (
    <svg viewBox="0 0 320 160" fill="none" className={className} {...hidden}>
      {cells.map((index) => {
        const x = 30 + (index % 10) * 27
        const y = 22 + Math.floor(index / 10) * 42
        return (
          <rect
            key={index}
            x={x}
            y={y}
            width="21"
            height="32"
            className={index < 12 ? "fill-primary" : "stroke-muted-foreground"}
            strokeWidth="1.5"
          />
        )
      })}
    </svg>
  )
}
