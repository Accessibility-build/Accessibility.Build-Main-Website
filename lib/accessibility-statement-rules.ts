/**
 * Rules for checking an accessibility statement against what the law actually
 * requires it to contain.
 *
 * This is deliberately NOT another WCAG scanner. Plenty of tools scan a site for
 * contrast and label failures. Almost nothing checks the statement itself, which
 * is where public sector monitoring keeps finding the gap: when GDS first tested
 * 593 UK public sector sites (Feb 2020 to Nov 2021) only 7% had a compliant
 * statement, while 83% had published one that was missing mandatory information.
 * A statement that exists but omits the enforcement route or the feedback
 * mechanism is the single most common failure, and no scanner reports it.
 *
 * Sources for the rulesets:
 *  - UK: Public Sector Bodies (Websites and Mobile Applications) (No. 2)
 *    Accessibility Regulations 2018, reg 8, plus the GDS model statement.
 *  - EU: Commission Implementing Decision (EU) 2018/1523, the model
 *    accessibility statement under the Web Accessibility Directive 2016/2102.
 *  - EAA: Directive (EU) 2019/882 Annex V, the information service providers
 *    must publish about how a service meets the accessibility requirements.
 */

export type StatementRegime = "uk-psbar" | "eu-wad" | "eaa"

export type CheckStatus = "pass" | "fail" | "warning"

export type CheckSeverity = "mandatory" | "recommended"

export interface StatementCheck {
  id: string
  label: string
  /** What the law asks for, in plain words. */
  requirement: string
  status: CheckStatus
  severity: CheckSeverity
  /** The text found in the statement that satisfied or triggered the check. */
  evidence: string | null
  /** What to do about it when the check does not pass. */
  fix: string
  legalRef: string
}

export interface RegimeMeta {
  id: StatementRegime
  label: string
  shortLabel: string
  appliesTo: string
  legalBasis: string
}

export const REGIMES: Record<StatementRegime, RegimeMeta> = {
  "uk-psbar": {
    id: "uk-psbar",
    label: "UK public sector (PSBAR 2018)",
    shortLabel: "UK PSBAR",
    appliesTo:
      "UK public sector bodies: central and local government, NHS, most schools and universities, and some charities carrying out public functions.",
    legalBasis:
      "Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018, regulation 8, and the GDS model statement.",
  },
  "eu-wad": {
    id: "eu-wad",
    label: "EU public sector (Web Accessibility Directive)",
    shortLabel: "EU WAD",
    appliesTo:
      "Public sector bodies in EU member states, covering websites and mobile applications.",
    legalBasis:
      "Directive (EU) 2016/2102, with the statement format set by Commission Implementing Decision (EU) 2018/1523.",
  },
  eaa: {
    id: "eaa",
    label: "European Accessibility Act (private sector services)",
    shortLabel: "EAA",
    appliesTo:
      "Private sector providers of in-scope services in the EU: e-commerce, banking, e-books, transport, and electronic communications. Microenterprises providing services are exempt.",
    legalBasis:
      "Directive (EU) 2019/882 Annex V, the information on how the service meets the accessibility requirements.",
  },
}

/** Checks that a given regime treats as mandatory rather than good practice. */
const MANDATORY_BY_REGIME: Record<StatementRegime, string[]> = {
  "uk-psbar": [
    "compliance-status",
    "standard-named",
    "non-accessible-content",
    "feedback-mechanism",
    "enforcement-procedure",
    "preparation-date",
    "evaluation-method",
    "scope-statement",
  ],
  "eu-wad": [
    "compliance-status",
    "standard-named",
    "non-accessible-content",
    "feedback-mechanism",
    "enforcement-procedure",
    "preparation-date",
    "evaluation-method",
  ],
  eaa: [
    "compliance-status",
    "standard-named",
    "non-accessible-content",
    "feedback-mechanism",
    "service-description",
  ],
}

const has = (text: string, patterns: RegExp[]): RegExp | null =>
  patterns.find((p) => p.test(text)) ?? null

/** Pull a short readable snippet around the first match, for evidence. */
function snippet(text: string, pattern: RegExp, radius = 90): string | null {
  const m = text.match(pattern)
  if (!m || m.index === undefined) return null
  const start = Math.max(0, m.index - radius)
  const end = Math.min(text.length, m.index + m[0].length + radius)
  return (start > 0 ? "..." : "") + text.slice(start, end).replace(/\s+/g, " ").trim() + (end < text.length ? "..." : "")
}

const DATE_PATTERNS = [
  /\b(0?[1-9]|[12]\d|3[01])\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+(19|20)\d{2}\b/i,
  /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+(0?[1-9]|[12]\d|3[01]),?\s+(19|20)\d{2}\b/i,
  /\b(19|20)\d{2}-\d{2}-\d{2}\b/,
  /\b(0?[1-9]|[12]\d|3[01])[/.](0?[1-9]|1[0-2])[/.](19|20)\d{2}\b/,
]

/** Best-effort extraction of the most recent date mentioned near review wording. */
export function extractDates(text: string): Date[] {
  const found: Date[] = []
  for (const p of DATE_PATTERNS) {
    const re = new RegExp(p.source, p.flags.includes("g") ? p.flags : p.flags + "g")
    for (const m of text.matchAll(re)) {
      const d = new Date(m[0].replace(/(\d)(st|nd|rd|th)/gi, "$1"))
      if (!Number.isNaN(d.getTime()) && d.getFullYear() >= 1990) found.push(d)
    }
  }
  return found.sort((a, b) => b.getTime() - a.getTime())
}

export interface AnalyseInput {
  /** Visible text of the statement page, already lowercased is not required. */
  text: string
  /** Raw HTML, used for link and mailto detection. */
  html: string
  regime: StatementRegime
  /** Used to resolve whether the enforcement link points somewhere real. */
  now?: Date
}

export function analyseStatement(input: AnalyseInput): StatementCheck[] {
  const raw = input.text || ""
  const t = raw.toLowerCase()
  const html = (input.html || "").toLowerCase()
  const now = input.now ?? new Date()
  const mandatory = new Set(MANDATORY_BY_REGIME[input.regime])
  const checks: StatementCheck[] = []

  const sev = (id: string): CheckSeverity => (mandatory.has(id) ? "mandatory" : "recommended")

  const push = (
    id: string,
    label: string,
    requirement: string,
    ok: boolean,
    evidence: string | null,
    fix: string,
    legalRef: string,
    warnInstead = false
  ) => {
    checks.push({
      id,
      label,
      requirement,
      status: ok ? "pass" : warnInstead ? "warning" : sev(id) === "mandatory" ? "fail" : "warning",
      severity: sev(id),
      evidence,
      fix,
      legalRef,
    })
  }

  // 1. Compliance status, in the prescribed three-way wording.
  const statusPattern =
    /(fully compliant|partially compliant|not compliant|non-compliant|niet volledig|teilweise konform)/i
  const statusHit = has(t, [statusPattern])
  push(
    "compliance-status",
    "Compliance status is declared",
    'The statement must say whether the site is "fully compliant", "partially compliant" or "not compliant" with the standard.',
    Boolean(statusHit),
    statusHit ? snippet(raw, statusPattern) : null,
    'Add one of the three prescribed phrases. Most sites are honestly "partially compliant"; claiming full compliance without evidence is the most common overclaim.',
    input.regime === "uk-psbar" ? "PSBAR 2018 reg 8; GDS model statement" : "Implementing Decision (EU) 2018/1523, section 1"
  )

  // 2. The standard being claimed against.
  const standardPattern = /(wcag\s*2\.[0-2]|web content accessibility guidelines|en\s*301\s*549)/i
  const stdHit = has(t, [standardPattern])
  push(
    "standard-named",
    "Accessibility standard is named",
    "The statement must name the standard and level it is measured against, normally WCAG 2.1 or 2.2 AA, or EN 301 549.",
    Boolean(stdHit),
    stdHit ? snippet(raw, standardPattern) : null,
    "Name the standard and the conformance level explicitly, for example \"WCAG 2.2 level AA\". A statement that claims compliance without naming a standard is unverifiable.",
    input.regime === "eaa" ? "Directive (EU) 2019/882 Annex V" : "Implementing Decision (EU) 2018/1523, section 1"
  )

  // 3. What is not accessible.
  const nonAccessiblePattern =
    /(non-accessible content|not accessible|inaccessible|known issues|limitations|do not fully|does not fully|cannot currently)/i
  const naHit = has(t, [nonAccessiblePattern])
  push(
    "non-accessible-content",
    "Non-accessible content is listed",
    "The statement must list the parts that are not accessible, so a disabled user knows what to expect before they hit it.",
    Boolean(naHit),
    naHit ? snippet(raw, nonAccessiblePattern) : null,
    "List the specific known problems and, where you can, the criterion each one fails. A statement with no known issues reads as untested rather than perfect.",
    "Implementing Decision (EU) 2018/1523, section 1(b)"
  )

  // 4. A way to report problems.
  const mailto = /mailto:/i.test(html)
  const contactWord = /(contact us|report|email us|get in touch|feedback|tell us)/i.test(t)
  const phone = /(\+\d{1,3}[\s\d().-]{6,}|telephone|phone number)/i.test(t)
  const feedbackOk = mailto || (contactWord && (phone || /form/i.test(t)))
  push(
    "feedback-mechanism",
    "Feedback mechanism is provided",
    "There must be a way for anyone to report an accessibility problem and request information in an accessible format.",
    feedbackOk,
    mailto ? "A mailto: contact link is present on the statement page." : contactWord ? snippet(raw, /(contact us|report|email us|feedback|tell us)/i) : null,
    "Give a direct route: an email address, a phone number, or a linked contact form. A generic \"contact us\" nav link is not a feedback mechanism.",
    input.regime === "uk-psbar" ? "PSBAR 2018 reg 8(2)" : "Directive (EU) 2016/2102 Art 7(1)"
  )

  // 5. Escalation route when the response is unsatisfactory.
  const ukEnforcement = /(equality advisory|equality and human rights commission|ehrc|equality commission for northern ireland|ecni|eass)/i
  const euEnforcement = /(enforcement procedure|enforcement body|ombudsman|supervisory authority|complaint|supervisory body)/i
  const enfPattern = input.regime === "uk-psbar" ? ukEnforcement : euEnforcement
  const enfHit = has(t, [enfPattern])
  push(
    "enforcement-procedure",
    "Enforcement procedure is named",
    "The statement must tell people where to escalate if they are not happy with the response, and name the body that handles it.",
    Boolean(enfHit),
    enfHit ? snippet(raw, enfPattern) : null,
    input.regime === "uk-psbar"
      ? "Name the Equality Advisory and Support Service (EASS), and for Northern Ireland the Equality Commission for Northern Ireland. This is the single most commonly missing section."
      : "Name your national enforcement body and link to its complaints procedure.",
    input.regime === "uk-psbar" ? "PSBAR 2018 reg 8(2)(c)" : "Directive (EU) 2016/2102 Art 7(1)(b)"
  )

  // 6. When it was written, and whether it has gone stale.
  const dates = extractDates(raw)
  const prepWord = /(prepared on|last reviewed|last updated|statement was reviewed|written on|first published)/i
  const prepHit = has(t, [prepWord])
  const hasDate = dates.length > 0
  push(
    "preparation-date",
    "Preparation or review date is given",
    "The statement must say when it was prepared and when it was last reviewed.",
    Boolean(prepHit) && hasDate,
    prepHit ? snippet(raw, prepWord) : hasDate ? `Most recent date found: ${dates[0].toISOString().slice(0, 10)}` : null,
    'Add an explicit line such as "This statement was prepared on 1 March 2026. It was last reviewed on 1 March 2026."',
    "Implementing Decision (EU) 2018/1523, section 2"
  )

  // 7. Staleness. GDS reported in Dec 2024 that many statements had not been
  //    reviewed in the last 12 months, which is the quiet failure mode.
  if (hasDate) {
    const newest = dates[0]
    const months = (now.getTime() - newest.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
    const fresh = months <= 12
    checks.push({
      id: "statement-freshness",
      label: "Statement has been reviewed in the last 12 months",
      requirement: "A statement should be reviewed at least annually, and after any significant site change.",
      status: fresh ? "pass" : "warning",
      severity: "recommended",
      evidence: `Most recent date in the statement: ${newest.toISOString().slice(0, 10)} (about ${Math.round(months)} months ago).`,
      fix: "Re-test the site, update the known issues, and refresh the review date. A statement that is years old undermines the rest of the document.",
      legalRef: "GDS monitoring guidance; Implementing Decision (EU) 2018/1523, section 2",
    })
  }

  // 8. How it was tested.
  const evalPattern =
    /(self-assessment|self assessed|third[- ]party|audited by|external audit|(evaluation|assessment|testing|test) was (carried out|conducted|performed)|(was|were) (last )?tested|we (last )?tested|tested (by|in|on|against)|last tested)/i
  const evalHit = has(t, [evalPattern])
  push(
    "evaluation-method",
    "Evaluation method is stated",
    "The statement must say how the assessment was made, whether self-assessment or a third-party audit.",
    Boolean(evalHit),
    evalHit ? snippet(raw, evalPattern) : null,
    'Say who tested it and how, for example "This site was last tested in March 2026 by an external auditor against WCAG 2.2 AA."',
    "Implementing Decision (EU) 2018/1523, section 2"
  )

  // 9. UK model statement opens by scoping what the statement covers.
  if (input.regime === "uk-psbar") {
    const scopePattern = /(this (accessibility )?statement applies to|this statement covers)/i
    const scopeHit = has(t, [scopePattern])
    push(
      "scope-statement",
      "Scope of the statement is defined",
      "The GDS model statement opens by saying exactly which site or app the statement applies to.",
      Boolean(scopeHit),
      scopeHit ? snippet(raw, scopePattern) : null,
      'Open with "This accessibility statement applies to [domain]." A statement covering an unclear set of sites cannot be relied on.',
      "GDS model accessibility statement"
    )
  }

  // 10. EAA asks service providers to describe how the service meets the requirements.
  if (input.regime === "eaa") {
    const descPattern = /(how (the|our) service|the service meets|accessibility features|description of the service|meets the accessibility requirements)/i
    const descHit = has(t, [descPattern])
    push(
      "service-description",
      "Explains how the service meets the requirements",
      "Annex V asks for a general description of the service and an explanation of how it meets the accessibility requirements, not just a conformance claim.",
      Boolean(descHit),
      descHit ? snippet(raw, descPattern) : null,
      "Describe the service and the accessibility features that support it. Annex V wants an explanation, not only a WCAG badge.",
      "Directive (EU) 2019/882 Annex V"
    )
  }

  // 11. Overclaiming. Not a legal requirement, but it is the fastest way to
  //     turn a statement into evidence against you.
  const overclaimPattern = /(fully accessible to all|100% (accessible|compliant)|completely accessible|wcag 2\.[0-2]\s*(level\s*)?aaa compliant|fully compliant with wcag)/i
  const overHit = has(t, [overclaimPattern])
  checks.push({
    id: "overclaiming",
    label: "No unsupported accessibility claims",
    requirement: "The statement should not claim more than the evidence supports.",
    status: overHit ? "warning" : "pass",
    severity: "recommended",
    evidence: overHit ? snippet(raw, overclaimPattern) : null,
    fix: overHit
      ? 'Remove absolute claims. "Fully accessible" and "100% compliant" are treated as representations, and a single reproducible barrier contradicts them.'
      : "No absolute accessibility claims detected.",
    legalRef: "Consumer protection and equality law exposure; not a formatting rule",
  })

  // 12. Overlay reliance. A statement that points at a widget as the remedy is
  //     a specific, well documented failure mode.
  const overlayPattern = /(accessibe|userway|audioeye|equalweb|recite ?me|accessibility widget|accessibility toolbar|accessibility overlay|adally|maxaccess)/i
  const overlayHit = has(t, [overlayPattern])
  checks.push({
    id: "overlay-reliance",
    label: "Does not present an overlay as the remedy",
    requirement:
      "An overlay widget does not make a site conformant, and citing one as the accessibility measure is a known weak point.",
    status: overlayHit ? "warning" : "pass",
    severity: "recommended",
    evidence: overlayHit ? snippet(raw, overlayPattern) : null,
    fix: overlayHit
      ? "Describe the underlying fixes rather than the widget. The European Commission has warned that overlay tools may make a website less accessible, so naming one as your compliance measure invites scrutiny."
      : "No accessibility overlay is presented as the remedy.",
    legalRef: "Guidance rather than statute",
  })

  return checks
}

export interface StatementScore {
  mandatoryTotal: number
  mandatoryPassed: number
  warnings: number
  /** 0 to 100, based on mandatory checks only. */
  percent: number
  verdict: "compliant" | "missing-information" | "not-compliant"
}

export function scoreChecks(checks: StatementCheck[]): StatementScore {
  const mandatory = checks.filter((c) => c.severity === "mandatory")
  const passed = mandatory.filter((c) => c.status === "pass").length
  const warnings = checks.filter((c) => c.status === "warning").length
  const percent = mandatory.length === 0 ? 0 : Math.round((passed / mandatory.length) * 100)

  // Wording deliberately mirrors how monitoring bodies report: the common
  // failure is "published but missing mandatory information", not "absent".
  const verdict: StatementScore["verdict"] =
    passed === mandatory.length ? "compliant" : passed >= Math.ceil(mandatory.length / 2) ? "missing-information" : "not-compliant"

  return { mandatoryTotal: mandatory.length, mandatoryPassed: passed, warnings, percent, verdict }
}
