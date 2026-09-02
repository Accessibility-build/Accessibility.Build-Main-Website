import { NextRequest, NextResponse } from "next/server"
import {
  keyRulings,
  lawsuitSummary,
  lawsuitsByIndustry,
  lawsuitsByYear,
  settlementData,
  topStates,
} from "@/lib/data/lawsuit-statistics"
import { accessibilityLaws, lawsSummary } from "@/lib/data/accessibility-laws"
import snapshot from "@/lib/data/accessibility-snapshot.json"
import disability from "@/lib/data/disability-statistics.json"
import eaa from "@/lib/data/european-accessibility-act.json"
import section508 from "@/lib/data/section-508-assessment.json"
import salary from "@/lib/data/accessibility-salary.json"
import byIndustry from "@/lib/data/accessibility-by-industry.json"
import byTechnology from "@/lib/data/accessibility-by-technology.json"
import agentReadiness from "@/lib/data/agent-readiness-2026.json"
import statements from "@/lib/data/accessibility-statements-2026.json"

// Machine-readable access to every research dataset on the site.
//
// AI agents and answer engines retrieve what they can parse. A JSON document
// with a stable URL, a licence and a last-updated date is something they can
// use directly; a rendered chart is not. Each dataset is served whole as JSON,
// and each tabular part of it as CSV, so the same numbers the pages show can
// be pulled by a script, a spreadsheet, or a model.
//
// GET /api/research/<dataset>              -> JSON, the whole dataset
// GET /api/research/<dataset>?table=<name> -> JSON, one table
// GET /api/research/<dataset>?table=<name>&format=csv -> CSV

export const dynamic = "force-dynamic"

const LICENCE = "https://creativecommons.org/licenses/by/4.0/"
const ATTRIBUTION = "Accessibility.build, https://accessibility.build/research"

type Row = Record<string, unknown>

interface Dataset {
  name: string
  page: string
  lastUpdated: string
  tables: Record<string, Row[]>
  extra?: Record<string, unknown>
}

function build(): Record<string, Dataset> {
  return {
    lawsuits: {
      name: "US website accessibility lawsuits",
      page: "https://accessibility.build/research/accessibility-lawsuits",
      lastUpdated: "2026-08-27",
      tables: {
        byYear: lawsuitsByYear as unknown as Row[],
        byIndustry: lawsuitsByIndustry as unknown as Row[],
        settlements: settlementData.map((s) => ({
          category: s.category,
          averageCost: s.averageCost,
          medianCost: s.medianCost,
          rangeMin: s.range.min,
          rangeMax: s.range.max,
        })),
        keyRulings: keyRulings as unknown as Row[],
        topStates: topStates as unknown as Row[],
      },
      extra: { summary: lawsuitSummary },
    },
    laws: {
      name: "Accessibility laws by jurisdiction",
      page: "https://accessibility.build/research/accessibility-laws",
      lastUpdated: "2026-08-27",
      tables: {
        laws: accessibilityLaws.map((l) => ({
          ...l,
          appliesTo: l.appliesTo.join("; "),
          enforcement: l.enforcement.join("; "),
          penalties: JSON.stringify(l.penalties),
        })),
      },
      extra: { summary: lawsSummary },
    },
    "state-of-accessibility": {
      name: "State of web accessibility (WebAIM Million synthesis)",
      page: "https://accessibility.build/research/state-of-accessibility",
      lastUpdated: snapshot.lastUpdated,
      tables: {
        topViolations: snapshot.topViolations as Row[],
        yearOverYearTrends: snapshot.yearOverYearTrends as Row[],
      },
      extra: {
        keyFindings: snapshot.keyFindings,
        contextFindings: snapshot.contextFindings,
        structuralFindings: snapshot.structuralFindings,
        sources: snapshot.sources,
      },
    },
    "disability-statistics": {
      name: "US disability prevalence (CDC BRFSS)",
      page: "https://accessibility.build/research/disability-statistics",
      lastUpdated: disability.lastUpdated,
      tables: { types: disability.types as Row[], trend: disability.trend as Row[] },
      extra: { source: disability.source, dataYear: disability.dataYear },
    },
    "european-accessibility-act": {
      name: "European Accessibility Act tracker",
      page: "https://accessibility.build/research/european-accessibility-act",
      lastUpdated: eaa.lastUpdated,
      tables: { keyDates: eaa.keyDates as Row[] },
      extra: {
        directive: eaa.directive,
        transposition: eaa.transposition,
        otherTransitionalRules: eaa.otherTransitionalRules,
        enforcementDataStatus: eaa.enforcementDataStatus,
      },
    },
    "section-508": {
      name: "Section 508 federal agency assessment",
      page: "https://accessibility.build/research/section-508-assessment",
      lastUpdated: section508.lastUpdated,
      tables: {
        agencies: section508.agencies as Row[],
        levels: (section508.levels as string[]).map((level, rank) => ({ rank: rank + 1, level })),
        factors: section508.factors as Row[],
      },
      extra: { fiscalYear: section508.fiscalYear, source: section508.source },
    },
    salary: {
      name: "Digital accessibility salary survey",
      page: "https://accessibility.build/research/accessibility-salary",
      lastUpdated: salary.lastUpdated,
      tables: {
        byLocation: salary.byLocation as Row[],
        byExperience: salary.byExperience as Row[],
        byWorkLocation: salary.byWorkLocation as Row[],
        byOrgSize: salary.byOrgSize as Row[],
        byDisability: salary.byDisability as Row[],
      },
      extra: { overall: salary.overall, responses: salary.responses, source: salary.source },
    },
    "by-industry": {
      name: "Accessibility errors by industry (WebAIM Million)",
      page: "https://accessibility.build/research/accessibility-by-industry",
      lastUpdated: byIndustry.lastUpdated,
      tables: { categories: byIndustry.categories as Row[], languages: byIndustry.languages as Row[] },
      extra: { baselineErrors: byIndustry.baselineErrors, source: byIndustry.source },
    },
    "by-technology": {
      name: "Accessibility errors by technology stack (WebAIM Million)",
      page: "https://accessibility.build/research/accessibility-by-technology",
      lastUpdated: byTechnology.lastUpdated,
      tables: Object.fromEntries(
        (byTechnology.groups as { id: string; label: string; rows: Row[] }[]).map((g) => [g.id, g.rows]),
      ),
      extra: { baselineErrors: byTechnology.baselineErrors, source: byTechnology.source },
    },
    "agent-readiness": {
      name: "AI agent readiness of UK home pages, 2026",
      page: "https://accessibility.build/research/ai-agent-readiness",
      lastUpdated: agentReadiness.measuredOn,
      tables: {
        ftse100: agentReadiness.groups.ftse100.sites as Row[],
        councils: agentReadiness.groups.councils.sites as Row[],
      },
      extra: {
        method: agentReadiness.method,
        ftse100Summary: { ...agentReadiness.groups.ftse100, sites: undefined },
        councilsSummary: { ...agentReadiness.groups.councils, sites: undefined },
      },
    },
    "accessibility-statements": {
      name: "Accessibility statements of UK councils and the FTSE 100, 2026",
      page: "https://accessibility.build/research/accessibility-statements-2026",
      lastUpdated: statements.measuredOn,
      tables: {
        councils: statements.groups.councils.sites as Row[],
        ftse100: statements.groups.ftse100.sites as Row[],
        councilFailures: statements.groups.councils.mandatoryFailures as Row[],
        ftse100Failures: statements.groups.ftse100.mandatoryFailures as Row[],
      },
      extra: {
        method: statements.method,
        councilsSummary: { ...statements.groups.councils, sites: undefined, mandatoryFailures: undefined },
        ftse100Summary: { ...statements.groups.ftse100, sites: undefined, mandatoryFailures: undefined },
      },
    },
  }
}

function csvCell(v: unknown): string {
  const s = v === null || v === undefined ? "" : typeof v === "object" ? JSON.stringify(v) : String(v)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

function toCsv(rows: Row[]): string {
  const cols = Array.from(rows.reduce((set, r) => (Object.keys(r).forEach((k) => set.add(k)), set), new Set<string>()))
  return [cols.join(","), ...rows.map((r) => cols.map((c) => csvCell(r[c])).join(","))].join("\n") + "\n"
}

export async function GET(request: NextRequest, context: { params: Promise<{ dataset: string }> }) {
  const { dataset } = await context.params
  const all = build()
  const ds = all[dataset]
  if (!ds) {
    return NextResponse.json(
      { error: "Unknown dataset", available: Object.keys(all).map((k) => `/api/research/${k}`) },
      { status: 404 },
    )
  }
  const url = new URL(request.url)
  const table = url.searchParams.get("table")
  const format = url.searchParams.get("format")

  if (table) {
    const rows = ds.tables[table]
    if (!rows) {
      return NextResponse.json({ error: "Unknown table", available: Object.keys(ds.tables) }, { status: 404 })
    }
    if (format === "csv") {
      return new NextResponse(toCsv(rows), {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="accessibility-build-${dataset}-${table}.csv"`,
          "Cache-Control": "public, max-age=3600, s-maxage=86400",
          "X-Licence": LICENCE,
        },
      })
    }
    return NextResponse.json({ dataset, table, name: ds.name, page: ds.page, lastUpdated: ds.lastUpdated, licence: LICENCE, attribution: ATTRIBUTION, rows })
  }

  return NextResponse.json(
    {
      dataset,
      name: ds.name,
      page: ds.page,
      lastUpdated: ds.lastUpdated,
      licence: LICENCE,
      attribution: ATTRIBUTION,
      tables: Object.fromEntries(Object.entries(ds.tables).map(([k, v]) => [k, { rows: v.length, csv: `/api/research/${dataset}?table=${k}&format=csv`, json: `/api/research/${dataset}?table=${k}` }])),
      data: { ...ds.tables, ...(ds.extra ?? {}) },
    },
    { headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" } },
  )
}
