"use client";

import NextLink from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TriangleAlert } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ChartSection } from "@/components/research/chart-section";
import { MethodologySection } from "@/components/research/methodology-section";
import {
  ReportDownloads,
  downloadBlobAs,
} from "@/components/research/report-downloads";

// Types mirror lib/data/screen-reader-survey-2026.json. Every percentage is as
// published by WebAIM; the only derived value is changePp (Survey #11 minus
// Survey #10, in percentage points).

export interface SurveyRow {
  response: string;
  respondents: number | null;
  percent: number | null;
}

export interface ComparisonRow {
  response: string;
  percent2024: number | null;
  percent2026: number | null;
  changePp: number | null;
}

export interface SurveyQuestion {
  id: string;
  title: string;
  questionText: string;
  questionText10?: string;
  availability: "both" | "survey10Only" | "survey11Only";
  survey10: SurveyRow[] | null;
  survey11: SurveyRow[] | null;
  comparison?: ComparisonRow[];
}

interface SurveyMeta {
  name: string;
  shortName: string;
  year: number;
  url: string;
  publisher: string;
  surveyPeriod: string;
  validResponses: number;
  lastUpdatedBySource: string;
}

interface RegionRow {
  region: string;
  jaws2024: number | null;
  nvda2024: number | null;
  jaws2026: number;
  nvda2026: number;
}

interface ProseFigure {
  survey: "survey10" | "survey11";
  topic: string;
  text: string;
  value?: number;
  previous?: number;
  previous2019?: number;
  previous2021?: number;
}

export interface SurveyData {
  lastUpdated: string;
  title: string;
  licenceNote: string;
  licenceUrl: string;
  comparisonNote: string;
  surveys: { survey11: SurveyMeta; survey10: SurveyMeta };
  questions: SurveyQuestion[];
  primaryByRegion: { note: string; rows: RegionRow[]; survey11Caveat: string };
  publishedProseFigures: ProseFigure[];
  survey10OnlyProblematicItems: { note: string; rankedItems: string[] };
}

const REPORT_URL =
  "https://accessibility.build/research/screen-reader-survey-2026";
const COLOR_2026 = "#0d9488";
const COLOR_2024 = "#64748b";
const COLOR_NVDA = "#7c3aed";

const fmt = (value: number | null | undefined) =>
  value == null ? "Not listed" : `${value.toFixed(1)}%`;

const fmtPp = (value: number | null | undefined) => {
  if (value == null) return "n/a";
  if (value === 0) return "0.0 pp";
  // U+2212 minus sign reads as "minus" in screen readers, unlike a hyphen.
  return `${value > 0 ? "+" : "−"}${Math.abs(value).toFixed(1)} pp`;
};

// Short labels for chart axes only. Tables always show WebAIM's full wording.
const SHORT_LABELS: Record<string, string> = {
  "Navigate through the headings on the page": "Headings",
  "Read through the page": "Read through",
  "Use the Find feature": "Find feature",
  "Navigate through the links of the page": "Links",
  "Navigate through the landmarks/regions of the page": "Landmarks",
  "Web content has become more accessible": "More accessible",
  "Web content accessibility has not changed": "Not changed",
  "Web content has become less accessible": "Less accessible",
  "To generate image descriptions / alternative text":
    "Image descriptions / alt text",
  "To provide in-depth analysis or description of complex images":
    "Complex images",
  "To provide guidance in performing an online task": "Guidance with a task",
  "To provide summaries of webpages or documents": "Summaries",
  "To generate text or other alternatives for multimedia content":
    "Multimedia alternatives",
  "To perform accessibility evaluations of content": "Accessibility evaluation",
  "To generate audio alternatives of text content": "Audio alternatives",
  "Africa/Middle East": "Africa / Middle East",
};
const short = (label: string) => SHORT_LABELS[label] ?? label;

interface Series {
  key: string;
  label: string;
  color: string;
  /** Striped fill so the series is distinguishable without colour (WCAG 1.4.1). */
  striped?: boolean;
}

const YEAR_SERIES: Series[] = [
  {
    key: "y2024",
    label: "2024 (Survey #10)",
    color: COLOR_2024,
    striped: true,
  },
  { key: "y2026", label: "2026 (Survey #11)", color: COLOR_2026 },
];

function Swatch({ series, id }: { series: Series; id: string }) {
  return (
    <svg
      width="18"
      height="12"
      aria-hidden="true"
      focusable="false"
      className="shrink-0"
    >
      {series.striped ? (
        <defs>
          <pattern
            id={id}
            width="5"
            height="5"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <rect width="5" height="5" fill="transparent" />
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="5"
              stroke={series.color}
              strokeWidth="3"
            />
          </pattern>
        </defs>
      ) : null}
      <rect
        x="0.5"
        y="0.5"
        width="17"
        height="11"
        rx="2"
        fill={series.striped ? `url(#${id})` : series.color}
        stroke={series.color}
      />
    </svg>
  );
}

function ChartLegend({
  series,
  idPrefix,
}: {
  series: Series[];
  idPrefix: string;
}) {
  return (
    <ul className="mb-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-700 dark:text-slate-300">
      {series.map((s) => (
        <li key={s.key} className="flex items-center gap-2">
          <Swatch series={s} id={`${idPrefix}-legend-${s.key}`} />
          {s.label}
          {s.striped ? " (striped)" : " (solid)"}
        </li>
      ))}
    </ul>
  );
}

/**
 * Horizontal grouped bar chart. Each bar carries its value as a text label,
 * one series is striped, the wrapper has an aria-label listing every value,
 * and the full table is always available, so nothing depends on colour.
 */
function GroupedBars({
  id,
  rows,
  series,
  ariaLabel,
  yWidth = 150,
}: {
  id: string;
  rows: Record<string, string | number | null>[];
  series: Series[];
  ariaLabel: string;
  yWidth?: number;
}) {
  const narrow = useMediaQuery("(max-width: 639px)");
  const axisWidth = narrow ? Math.min(yWidth, 104) : yWidth;
  const height = rows.length * (series.length * 20 + 18) + 40;
  return (
    <div>
      <ChartLegend series={series} idPrefix={id} />
      <div
        role="img"
        aria-label={ariaLabel}
        className="text-slate-700 dark:text-slate-300"
        style={{ height }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={rows}
            layout="vertical"
            margin={{ top: 5, right: 56, left: 4, bottom: 5 }}
            barCategoryGap="18%"
            barGap={2}
          >
            <defs>
              {series
                .filter((s) => s.striped)
                .map((s) => (
                  <pattern
                    key={s.key}
                    id={`${id}-${s.key}`}
                    width="6"
                    height="6"
                    patternUnits="userSpaceOnUse"
                    patternTransform="rotate(45)"
                  >
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="6"
                      stroke={s.color}
                      strokeWidth="3"
                    />
                  </pattern>
                ))}
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              className="stroke-slate-200 dark:stroke-slate-700"
            />
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              tick={{ fill: "currentColor", fontSize: 12 }}
            />
            <YAxis
              dataKey="name"
              type="category"
              width={axisWidth}
              tick={{ fill: "currentColor", fontSize: narrow ? 11 : 12 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(148, 163, 184, 0.15)" }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg dark:border-slate-700 dark:bg-slate-900">
                    <p className="font-medium text-slate-950 dark:text-white">
                      {label}
                    </p>
                    {payload.map((item) => {
                      const s = series.find((x) => x.key === item.dataKey);
                      return (
                        <p
                          key={String(item.dataKey)}
                          className="text-slate-600 dark:text-slate-300"
                        >
                          {s?.label}: {fmt(item.value as number | null)}
                        </p>
                      );
                    })}
                  </div>
                );
              }}
            />
            {series.map((s) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.label}
                fill={s.striped ? `url(#${id}-${s.key})` : s.color}
                stroke={s.color}
                strokeWidth={1}
                radius={[0, 3, 3, 0]}
                isAnimationActive={false}
              >
                <LabelList
                  dataKey={s.key}
                  position="right"
                  fill="currentColor"
                  fontSize={11}
                  formatter={(value: unknown) =>
                    typeof value === "number" ? `${value.toFixed(1)}%` : ""
                  }
                />
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function comparisonChartRows(rows: ComparisonRow[]) {
  return rows.map((row) => ({
    name: short(row.response),
    y2024: row.percent2024,
    y2026: row.percent2026,
  }));
}

function comparisonAria(title: string, rows: ComparisonRow[]) {
  return `Bar chart: ${title}, 2024 compared with 2026. ${rows
    .map(
      (row) =>
        `${row.response}: 2024 ${fmt(row.percent2024)}, 2026 ${fmt(row.percent2026)}`,
    )
    .join("; ")}.`;
}

const thBase = "px-3 py-3 font-semibold";
const tdNum = "px-3 py-3 text-right tabular-nums";

function ComparisonTable({ question }: { question: SurveyQuestion }) {
  const rows = question.comparison ?? [];
  return (
    <div tabIndex={0} role="region" aria-label={`${question.title}: Survey #10 and #11 compared`} className="overflow-x-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
      <table className="w-full min-w-[520px] border-collapse text-sm">
        <caption className="pb-2 text-left text-sm text-slate-600 dark:text-slate-400">
          {question.title}: &ldquo;{question.questionText}&rdquo; Percent of
          respondents in Survey #10 (2024) and Survey #11 (2026), and the change
          in percentage points.
        </caption>
        <thead>
          <tr className="border-b border-slate-300 dark:border-slate-700">
            <th scope="col" className={`${thBase} text-left`}>
              Response
            </th>
            <th scope="col" className={`${thBase} text-right`}>
              2024 (Survey #10)
            </th>
            <th scope="col" className={`${thBase} text-right`}>
              2026 (Survey #11)
            </th>
            <th scope="col" className={`${thBase} text-right`}>
              Change
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.response}
              className="border-b border-slate-200 last:border-0 dark:border-slate-800"
            >
              <th
                scope="row"
                className="px-3 py-3 text-left font-medium text-slate-900 dark:text-white"
              >
                {row.response}
              </th>
              <td className={`${tdNum} text-slate-600 dark:text-slate-400`}>
                {fmt(row.percent2024)}
              </td>
              <td className={`${tdNum} font-semibold`}>
                {fmt(row.percent2026)}
              </td>
              <td className={`${tdNum} text-slate-600 dark:text-slate-400`}>
                {fmtPp(row.changePp)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {question.questionText10 ? (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Survey #10 wording: &ldquo;{question.questionText10}&rdquo;
        </p>
      ) : null}
    </div>
  );
}

function SingleSurveyTable({ question }: { question: SurveyQuestion }) {
  const rows = question.survey11 ?? question.survey10 ?? [];
  const label =
    question.availability === "survey11Only"
      ? "Survey #11 (2026)"
      : "Survey #10 (2024)";
  const hasCounts = rows.some((r) => r.respondents != null);
  return (
    <div tabIndex={0} role="region" aria-label={`${question.title}: ${label} only`} className="overflow-x-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
      <table className="w-full min-w-[420px] border-collapse text-sm">
        <caption className="pb-2 text-left text-sm text-slate-600 dark:text-slate-400">
          {question.title}: &ldquo;{question.questionText}&rdquo; Asked in{" "}
          {label} only.
        </caption>
        <thead>
          <tr className="border-b border-slate-300 dark:border-slate-700">
            <th scope="col" className={`${thBase} text-left`}>
              Response
            </th>
            {hasCounts ? (
              <th scope="col" className={`${thBase} text-right`}>
                Respondents
              </th>
            ) : null}
            <th scope="col" className={`${thBase} text-right`}>
              Percent
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.response}
              className="border-b border-slate-200 last:border-0 dark:border-slate-800"
            >
              <th
                scope="row"
                className="px-3 py-3 text-left font-medium text-slate-900 dark:text-white"
              >
                {row.response}
              </th>
              {hasCounts ? (
                <td className={`${tdNum} text-slate-600 dark:text-slate-400`}>
                  {row.respondents?.toLocaleString() ?? ""}
                </td>
              ) : null}
              <td className={`${tdNum} font-semibold`}>{fmt(row.percent)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RegionTable({ rows }: { rows: RegionRow[] }) {
  return (
    <div tabIndex={0} role="region" aria-label="Percent of respondents in each region whose primary desktop screen reader is JAWS or NVDA, Survey #10 (2024) and..." className="overflow-x-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
      <table className="w-full min-w-[600px] border-collapse text-sm">
        <caption className="pb-2 text-left text-sm text-slate-600 dark:text-slate-400">
          Percent of respondents in each region whose primary desktop screen
          reader is JAWS or NVDA, Survey #10 (2024) and Survey #11 (2026), as
          published by WebAIM. Survey #10 did not report South America.
        </caption>
        <thead>
          <tr className="border-b border-slate-300 dark:border-slate-700">
            <th scope="col" className={`${thBase} text-left`}>
              Region
            </th>
            <th scope="col" className={`${thBase} text-right`}>
              JAWS 2024
            </th>
            <th scope="col" className={`${thBase} text-right`}>
              JAWS 2026
            </th>
            <th scope="col" className={`${thBase} text-right`}>
              NVDA 2024
            </th>
            <th scope="col" className={`${thBase} text-right`}>
              NVDA 2026
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.region}
              className="border-b border-slate-200 last:border-0 dark:border-slate-800"
            >
              <th
                scope="row"
                className="px-3 py-3 text-left font-medium text-slate-900 dark:text-white"
              >
                {row.region}
              </th>
              <td className={`${tdNum} text-slate-600 dark:text-slate-400`}>
                {row.jaws2024 == null ? "Not reported" : fmt(row.jaws2024)}
              </td>
              <td className={`${tdNum} font-semibold`}>{fmt(row.jaws2026)}</td>
              <td className={`${tdNum} text-slate-600 dark:text-slate-400`}>
                {row.nvda2024 == null ? "Not reported" : fmt(row.nvda2024)}
              </td>
              <td className={`${tdNum} font-semibold`}>{fmt(row.nvda2026)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function comparisonCsvData(question: SurveyQuestion) {
  return (question.comparison ?? []).map((row) => ({
    Response: row.response,
    "2024 percent": row.percent2024 ?? "",
    "2026 percent": row.percent2026 ?? "",
    "Change (pp)": row.changePp ?? "",
  }));
}

const linkClass =
  "font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-300";

export function ScreenReaderSurveyClient({
  initialData,
}: {
  initialData: SurveyData;
}) {
  const data = initialData;
  const s11 = data.surveys.survey11;
  const s10 = data.surveys.survey10;
  const q = (id: string) => {
    const question = data.questions.find((item) => item.id === id);
    if (!question) throw new Error(`Unknown question ${id}`);
    return question;
  };
  const cmp = (id: string, response: string) =>
    q(id).comparison?.find((row) => row.response === response);
  const prose = (topic: string, survey: "survey10" | "survey11" = "survey11") =>
    data.publishedProseFigures.find(
      (p) => p.topic === topic && p.survey === survey,
    );

  const primary = q("primaryScreenReader");
  const commonly = q("commonlyUsed");
  const finding = q("findingInformation");
  const progress = q("webAccessibilityProgress");
  const browsers = q("browsers");
  const ai = q("aiUsage");
  const both = data.questions.filter((item) => item.availability === "both");
  const only11 = data.questions.filter(
    (item) => item.availability === "survey11Only",
  );
  const only10 = data.questions.filter(
    (item) => item.availability === "survey10Only",
  );

  const jaws = cmp("primaryScreenReader", "JAWS");
  const nvda = cmp("primaryScreenReader", "NVDA");
  const vo = cmp("primaryScreenReader", "VoiceOver");
  const na = cmp("region", "North America");
  const eu = cmp("region", "Europe");
  const headings = cmp(
    "findingInformation",
    "Navigate through the headings on the page",
  );
  const readThrough = cmp("findingInformation", "Read through the page");
  const linksNav = cmp(
    "findingInformation",
    "Navigate through the links of the page",
  );
  const less = cmp(
    "webAccessibilityProgress",
    "Web content has become less accessible",
  );
  const more = cmp(
    "webAccessibilityProgress",
    "Web content has become more accessible",
  );
  const betterSites = cmp(
    "impactOnAccessibility",
    "Better (more accessible) web sites",
  );
  const windows = cmp("operatingSystem", "Windows");
  const ios = cmp("mobilePlatform", "Apple iPhone, iPad, or iPod touch");
  const edge = cmp("browsers", "Microsoft Edge");
  const chrome = cmp("browsers", "Chrome");
  const jawsChrome = cmp("browserCombinations", "JAWS with Chrome");
  const landmarksProse = prose("Landmarks");
  const skipProse = prose("Skip links");
  const pdfProse = prose("PDF documents");
  const wordProse = prose("Word documents");
  const noAiProse = prose("AI usage");
  const otherPrimary = prose("Other primary screen readers");
  const nvdaRegion = data.primaryByRegion.rows;

  const aiRows = [...(ai.survey11 ?? [])]
    .filter((row) => row.response !== "Other")
    .sort((a, b) => (b.percent ?? 0) - (a.percent ?? 0));

  const handleDownloadCSV = () => {
    const esc = (v: unknown) => {
      const s = v == null ? "" : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines: string[] = [
      "SCREEN READER SURVEY 2026 VS 2024",
      `Reviewed,${data.lastUpdated}`,
      `Survey #11,${esc(s11.surveyPeriod)},${s11.validResponses} valid responses,${s11.url}`,
      `Survey #10,${esc(s10.surveyPeriod)},${s10.validResponses} valid responses,${s10.url}`,
      `Licence,${esc(data.licenceNote)}`,
      `Note,${esc(data.comparisonNote)}`,
      "",
      "QUESTIONS ASKED IN BOTH SURVEYS",
      "Question,Response,2024 percent,2026 percent,Change (pp)",
      ...both.flatMap((question) =>
        (question.comparison ?? []).map((row) =>
          [
            question.title,
            row.response,
            row.percent2024,
            row.percent2026,
            row.changePp,
          ]
            .map(esc)
            .join(","),
        ),
      ),
      "",
      "PRIMARY SCREEN READER BY REGION (JAWS AND NVDA)",
      "Region,JAWS 2024,JAWS 2026,NVDA 2024,NVDA 2026",
      ...nvdaRegion.map((row) =>
        [row.region, row.jaws2024, row.jaws2026, row.nvda2024, row.nvda2026]
          .map(esc)
          .join(","),
      ),
      "",
      "QUESTIONS ASKED IN ONE SURVEY ONLY",
      "Survey,Question,Response,Respondents,Percent",
      ...[...only11, ...only10].flatMap((question) =>
        (question.survey11 ?? question.survey10 ?? []).map((row) =>
          [
            question.availability === "survey11Only"
              ? "Survey #11 (2026)"
              : "Survey #10 (2024)",
            question.title,
            row.response,
            row.respondents,
            row.percent,
          ]
            .map(esc)
            .join(","),
        ),
      ),
    ];
    downloadBlobAs(
      new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" }),
      "screen-reader-survey-2026-vs-2024.csv",
    );
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Screen Reader Survey 2026 vs 2024", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(90);
    doc.text(
      `WebAIM Survey #11 (${s11.surveyPeriod}, n=${s11.validResponses}) vs Survey #10 (${s10.surveyPeriod}, n=${s10.validResponses})`,
      14,
      28,
    );
    doc.setTextColor(0);
    let cursor = 36;
    const lastY = () =>
      (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable
        ?.finalY ?? cursor;
    for (const id of [
      "primaryScreenReader",
      "commonlyUsed",
      "findingInformation",
      "webAccessibilityProgress",
    ]) {
      const question = q(id);
      if (cursor > 240) {
        doc.addPage();
        cursor = 20;
      }
      doc.setFontSize(12);
      doc.text(question.title, 14, cursor);
      autoTable(doc, {
        startY: cursor + 4,
        head: [["Response", "2024", "2026", "Change"]],
        body: (question.comparison ?? []).map((row) => [
          row.response,
          fmt(row.percent2024),
          fmt(row.percent2026),
          fmtPp(row.changePp).replace("−", "-"),
        ]),
        theme: "striped",
        headStyles: { fillColor: [15, 118, 110] },
        margin: { left: 14, right: 14 },
      });
      cursor = lastY() + 12;
    }
    if (cursor > 220) {
      doc.addPage();
      cursor = 20;
    }
    doc.setFontSize(12);
    doc.text("Primary screen reader by region", 14, cursor);
    autoTable(doc, {
      startY: cursor + 4,
      head: [["Region", "JAWS 2024", "JAWS 2026", "NVDA 2024", "NVDA 2026"]],
      body: nvdaRegion.map((row) => [
        row.region,
        row.jaws2024 == null ? "n/r" : fmt(row.jaws2024),
        fmt(row.jaws2026),
        row.nvda2024 == null ? "n/r" : fmt(row.nvda2024),
        fmt(row.nvda2026),
      ]),
      theme: "striped",
      headStyles: { fillColor: [15, 118, 110] },
      margin: { left: 14, right: 14 },
    });
    cursor = lastY() + 12;
    if (cursor > 250) {
      doc.addPage();
      cursor = 20;
    }
    doc.setTextColor(70);
    doc.setFontSize(9);
    doc.text(
      doc.splitTextToSize(
        `Source: ${s11.name} (${s11.url}) and ${s10.name} (${s10.url}). ${data.licenceNote} Self-selected sample; not a market share. Change is in percentage points.`,
        180,
      ),
      14,
      cursor,
    );
    doc.save("screen-reader-survey-2026-vs-2024.pdf");
  };

  return (
    <div className="space-y-14 sm:space-y-16">
      <section
        id="how-to-read"
        aria-labelledby="how-to-read-heading"
        className="scroll-mt-40"
      >
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 dark:border-amber-900 dark:bg-amber-950/25">
          <div className="flex items-start gap-3">
            <TriangleAlert
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300"
              aria-hidden="true"
            />
            <div>
              <h2
                id="how-to-read-heading"
                className="text-lg font-semibold text-slate-950 dark:text-white"
              >
                This is a survey of volunteers, not a market share
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700 dark:text-slate-300">
                WebAIM states plainly that the sample was not controlled and may
                not represent all screen reader users. People choose to answer,
                and the ones who do are more engaged with the accessibility
                community than average. Neither survey measures sales, licences
                or installations.
              </p>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700 dark:text-slate-300">
                The mix of respondents also moved. North America rose from{" "}
                {fmt(na?.percent2024)} to {fmt(na?.percent2026)} of the sample
                and Europe fell from {fmt(eu?.percent2024)} to{" "}
                {fmt(eu?.percent2026)}. JAWS is far more common in North
                America, so some of its rise is who answered. WebAIM&rsquo;s own
                note: &ldquo;{data.primaryByRegion.survey11Caveat}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="primary"
        aria-labelledby="primary-heading"
        className="scroll-mt-40"
      >
        <ChartSection
          title="Primary desktop screen reader, 2024 and 2026"
          titleId="primary-heading"
          headingLevel={2}
          description={`"${primary.questionText}" Percent of respondents. Rows marked Not listed were not in that survey's published table.`}
          insight={`JAWS: ${fmt(jaws?.percent2024)} to ${fmt(jaws?.percent2026)} (${fmtPp(jaws?.changePp)}). NVDA: ${fmt(nvda?.percent2024)} to ${fmt(nvda?.percent2026)} (${fmtPp(nvda?.changePp)}). VoiceOver: ${fmt(vo?.percent2024)} to ${fmt(vo?.percent2026)} (${fmtPp(vo?.changePp)}). ${otherPrimary?.text ?? ""}`}
          source={`${s11.name} and #10`}
          sourceUrl={s11.url}
          dataTable={<ComparisonTable question={primary} />}
          downloadData={{
            filename: "primary-screen-reader-2024-2026",
            data: comparisonCsvData(primary),
          }}
        >
          <GroupedBars
            id="primary-chart"
            rows={comparisonChartRows(primary.comparison ?? [])}
            series={YEAR_SERIES}
            ariaLabel={comparisonAria(
              "primary desktop or laptop screen reader",
              primary.comparison ?? [],
            )}
            yWidth={130}
          />
        </ChartSection>

        <div className="mt-8">
          <ChartSection
            title="Screen readers commonly used"
            headingLevel={3}
            description={`"${commonly.questionText}" Respondents could choose more than one, so totals exceed 100%.`}
            insight={`In 2024 more respondents used NVDA (${fmt(cmp("commonlyUsed", "NVDA")?.percent2024)}) than JAWS (${fmt(cmp("commonlyUsed", "JAWS")?.percent2024)}). In 2026 the order flipped: JAWS ${fmt(cmp("commonlyUsed", "JAWS")?.percent2026)}, NVDA ${fmt(cmp("commonlyUsed", "NVDA")?.percent2026)}. ${prose("Narrator")?.text ?? ""}`}
            source={`${s11.name} and #10`}
            sourceUrl={s11.url}
            dataTable={<ComparisonTable question={commonly} />}
            downloadData={{
              filename: "screen-readers-commonly-used-2024-2026",
              data: comparisonCsvData(commonly),
            }}
          >
            <GroupedBars
              id="commonly-chart"
              rows={comparisonChartRows(commonly.comparison ?? [])}
              series={YEAR_SERIES}
              ariaLabel={comparisonAria(
                "desktop screen readers commonly used",
                commonly.comparison ?? [],
              )}
              yWidth={150}
            />
          </ChartSection>
        </div>
      </section>

      <section
        id="regions"
        aria-labelledby="regions-heading"
        className="scroll-mt-40"
      >
        <ChartSection
          title="JAWS and NVDA by region"
          titleId="regions-heading"
          headingLevel={2}
          description="Primary desktop screen reader share within each region in 2026. WebAIM published these figures in its commentary rather than as a table; 2024 values are in the table below."
          insight={`JAWS leads in North America and Australia, the two are level in Europe, and NVDA leads in Asia, Africa and the Middle East, and South America. JAWS also gained inside North America (${fmt(nvdaRegion[0].jaws2024)} to ${fmt(nvdaRegion[0].jaws2026)}), so the shift is not only a change in who answered.`}
          source={s11.name}
          sourceUrl={s11.url}
          downloadData={{
            filename: "jaws-nvda-by-region-2024-2026",
            data: nvdaRegion.map((row) => ({
              Region: row.region,
              "JAWS 2024": row.jaws2024 ?? "",
              "JAWS 2026": row.jaws2026,
              "NVDA 2024": row.nvda2024 ?? "",
              "NVDA 2026": row.nvda2026,
            })),
          }}
        >
          <GroupedBars
            id="region-chart"
            rows={nvdaRegion.map((row) => ({
              name: short(row.region),
              jaws: row.jaws2026,
              nvda: row.nvda2026,
            }))}
            series={[
              { key: "jaws", label: "JAWS, 2026", color: COLOR_2026 },
              {
                key: "nvda",
                label: "NVDA, 2026",
                color: COLOR_NVDA,
                striped: true,
              },
            ]}
            ariaLabel={`Bar chart: primary screen reader by region in 2026. ${nvdaRegion
              .map(
                (row) =>
                  `${row.region}: JAWS ${fmt(row.jaws2026)}, NVDA ${fmt(row.nvda2026)}`,
              )
              .join("; ")}.`}
            yWidth={140}
          />
        </ChartSection>
        <div className="mt-6">
          <RegionTable rows={nvdaRegion} />
        </div>
      </section>

      <section
        id="navigation"
        aria-labelledby="navigation-heading"
        className="scroll-mt-40"
      >
        <ChartSection
          title="How people find information on a long page"
          titleId="navigation-heading"
          headingLevel={2}
          description={`"${finding.questionText}"`}
          insight={`Headings remain the first move for ${fmt(headings?.percent2026)}, against ${fmt(headings?.percent2024)} in 2024 (${fmtPp(headings?.changePp)}). Reading through the page (${fmtPp(readThrough?.changePp)}) and following links (${fmtPp(linksNav?.changePp)}) picked up the difference. ${landmarksProse?.text ?? ""}`}
          source={`${s11.name} and #10`}
          sourceUrl={s11.url}
          dataTable={<ComparisonTable question={finding} />}
          downloadData={{
            filename: "finding-information-2024-2026",
            data: comparisonCsvData(finding),
          }}
        >
          <GroupedBars
            id="finding-chart"
            rows={comparisonChartRows(finding.comparison ?? [])}
            series={YEAR_SERIES}
            ariaLabel={comparisonAria(
              "first method for finding information on a lengthy page",
              finding.comparison ?? [],
            )}
            yWidth={110}
          />
        </ChartSection>
        <p className="mt-6 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
          {prose("Heading levels")?.text}{" "}
          {prose("Headings by proficiency")?.text} {skipProse?.text}{" "}If you want
          to check a page&rsquo;s outline the way these users meet it, run it
          through the{" "}
          <NextLink href="/tools/heading-analyzer" className={linkClass}>
            heading structure analyzer
          </NextLink>
          .
        </p>
      </section>

      <section
        id="progress"
        aria-labelledby="progress-heading"
        className="scroll-mt-40"
      >
        <ChartSection
          title="Has the web become more accessible?"
          titleId="progress-heading"
          headingLevel={2}
          description={`"${progress.questionText}"`}
          insight={`${fmt(less?.percent2026)} now say the web became less accessible, up from ${fmt(less?.percent2024)}, while "more accessible" fell from ${fmt(more?.percent2024)} to ${fmt(more?.percent2026)}. Asked what would have the bigger impact, ${fmt(betterSites?.percent2026)} still chose better web sites over better assistive technology (${fmt(betterSites?.percent2024)} in 2024).`}
          source={`${s11.name} and #10`}
          sourceUrl={s11.url}
          dataTable={<ComparisonTable question={progress} />}
          downloadData={{
            filename: "web-accessibility-progress-2024-2026",
            data: comparisonCsvData(progress),
          }}
        >
          <GroupedBars
            id="progress-chart"
            rows={comparisonChartRows(progress.comparison ?? [])}
            series={YEAR_SERIES}
            ariaLabel={comparisonAria(
              "perceived change in web accessibility over the previous year",
              progress.comparison ?? [],
            )}
            yWidth={130}
          />
        </ChartSection>
      </section>

      <section
        id="browsers"
        aria-labelledby="browsers-heading"
        className="scroll-mt-40"
      >
        <ChartSection
          title="Browser used most often with a screen reader"
          titleId="browsers-heading"
          headingLevel={2}
          description={`"${browsers.questionText}"`}
          insight={`Chrome held at ${fmt(chrome?.percent2026)} and Edge rose to ${fmt(edge?.percent2026)} (${fmtPp(edge?.changePp)}). JAWS with Chrome is the most common pairing at ${fmt(jawsChrome?.percent2026)} (${fmt(jawsChrome?.percent2024)} in 2024). Windows is the desktop platform for ${fmt(windows?.percent2026)}, and Apple devices are the primary mobile platform for ${fmt(ios?.percent2026)} (${fmt(ios?.percent2024)} in 2024).`}
          source={`${s11.name} and #10`}
          sourceUrl={s11.url}
          dataTable={<ComparisonTable question={browsers} />}
          downloadData={{
            filename: "screen-reader-browsers-2024-2026",
            data: comparisonCsvData(browsers),
          }}
        >
          <GroupedBars
            id="browsers-chart"
            rows={comparisonChartRows(browsers.comparison ?? [])}
            series={YEAR_SERIES}
            ariaLabel={comparisonAria(
              "browser used most often with primary screen reader",
              browsers.comparison ?? [],
            )}
            yWidth={130}
          />
        </ChartSection>
      </section>

      <section id="ai" aria-labelledby="ai-heading" className="scroll-mt-40">
        <ChartSection
          title="New in 2026: how screen reader users use AI"
          titleId="ai-heading"
          headingLevel={2}
          description={`"${ai.questionText}" Asked in Survey #11 only, so there is no 2024 comparison. Respondents could choose more than one.`}
          insight={`${noAiProse?.text ?? ""} AI filling in for missing alt text is a workaround users have adopted, not a substitute for writing it: only the author knows why an image is there.`}
          source={s11.name}
          sourceUrl={s11.url}
          dataTable={<SingleSurveyTable question={ai} />}
          downloadData={{
            filename: "screen-reader-users-ai-usage-2026",
            data: (ai.survey11 ?? []).map((row) => ({
              Response: row.response,
              Respondents: row.respondents ?? "",
              Percent: row.percent ?? "",
            })),
          }}
        >
          <GroupedBars
            id="ai-chart"
            rows={aiRows.map((row) => ({
              name: short(row.response),
              y2026: row.percent,
            }))}
            series={[
              { key: "y2026", label: "2026 (Survey #11)", color: COLOR_2026 },
            ]}
            ariaLabel={`Bar chart: ways screen reader users commonly use AI, 2026. ${(
              ai.survey11 ?? []
            )
              .map((row) => `${row.response}: ${fmt(row.percent)}`)
              .join("; ")}.`}
            yWidth={180}
          />
        </ChartSection>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-200 p-5 dark:border-slate-800">
            <h3 className="font-semibold text-slate-950 dark:text-white">
              PDF documents
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {pdfProse?.text}{" "}
              <NextLink
                href="/tools/pdf-accessibility-checker"
                className={linkClass}
              >
                Check a PDF
              </NextLink>{" "}
              before you publish it.
            </p>
            <div className="mt-4">
              <SingleSurveyTable question={q("pdfIssues")} />
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 p-5 dark:border-slate-800">
            <h3 className="font-semibold text-slate-950 dark:text-white">
              Word documents
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {wordProse?.text}
            </p>
            <div className="mt-4">
              <SingleSurveyTable question={q("wordIssues")} />
            </div>
          </div>
        </div>
      </section>

      <section
        id="not-asked"
        aria-labelledby="not-asked-heading"
        className="scroll-mt-40"
      >
        <div className="max-w-3xl">
          <h2
            id="not-asked-heading"
            className="text-2xl font-semibold text-slate-950 dark:text-white"
          >
            What Survey #11 did not ask
          </h2>
          <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
            {data.survey10OnlyProblematicItems.note}{" "}Anyone quoting
            &ldquo;CAPTCHA is the top problem in 2026&rdquo; is quoting the 2024
            survey. The Survey #10 order, most problematic first:
          </p>
          <ol className="mt-4 list-decimal space-y-1.5 pl-6 text-sm leading-6 text-slate-700 dark:text-slate-300">
            {data.survey10OnlyProblematicItems.rankedItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
          <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Also asked in 2024 only:{" "}
            {only10.map((item) => item.title.toLowerCase()).join("; ")}. Asked
            in 2026 only:{" "}
            {only11.map((item) => item.title.toLowerCase()).join("; ")}. The
            tables for all of them are below.
          </p>
        </div>
      </section>

      <section
        id="all-questions"
        aria-labelledby="all-questions-heading"
        className="scroll-mt-40"
      >
        <div className="max-w-3xl">
          <h2
            id="all-questions-heading"
            className="text-2xl font-semibold text-slate-950 dark:text-white"
          >
            Every question, both surveys
          </h2>
          <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
            {both.length}{" "}questions appear in both surveys. Each table shows
            WebAIM&rsquo;s published percentage for 2024 and 2026 and the change
            in percentage points; nothing else is calculated. &ldquo;Not
            listed&rdquo; means the answer did not appear in that year&rsquo;s
            published table. Two 2024 answer labels are shown in the 2026
            wording: &ldquo;app&rdquo; and &ldquo;web&rdquo; as &ldquo;Mobile
            app&rdquo; and &ldquo;Web site&rdquo;, and &ldquo;I Don&rsquo;t
            Know&rdquo; as &ldquo;I don&rsquo;t know&rdquo;.
          </p>
        </div>
        <div className="mt-6 divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          {both.map((question) => (
            <details
              key={question.id}
              id={`q-${question.id}`}
              className="group py-1"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md py-3 font-medium text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-white [&::-webkit-details-marker]:hidden">
                {question.title}
                <span
                  aria-hidden="true"
                  className="shrink-0 text-slate-500 transition-transform group-open:rotate-180 dark:text-slate-400"
                >
                  &#9662;
                </span>
              </summary>
              <div className="pb-5">
                <ComparisonTable question={question} />
              </div>
            </details>
          ))}
        </div>

        <h3 className="mt-10 text-lg font-semibold text-slate-950 dark:text-white">
          Asked in one survey only
        </h3>
        <div className="mt-4 divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          {[...only11, ...only10].map((question) => (
            <details
              key={question.id}
              id={`q-${question.id}`}
              className="group py-1"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md py-3 font-medium text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-white [&::-webkit-details-marker]:hidden">
                <span>
                  {question.title}{" "}
                  <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                    (
                    {question.availability === "survey11Only"
                      ? "2026 only"
                      : "2024 only"}
                    )
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-slate-500 transition-transform group-open:rotate-180 dark:text-slate-400"
                >
                  &#9662;
                </span>
              </summary>
              <div className="pb-5">
                <SingleSurveyTable question={question} />
              </div>
            </details>
          ))}
        </div>
      </section>

      <section aria-labelledby="testing-heading">
        <div className="max-w-3xl">
          <h2
            id="testing-heading"
            className="text-2xl font-semibold text-slate-950 dark:text-white"
          >
            What this means for testing
          </h2>
          <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
            Test with JAWS and NVDA on Windows, plus VoiceOver on iOS for
            mobile. Which desktop reader matters most depends on your
            audience&rsquo;s region, and most users run more than one. Start
            with the{" "}
            <NextLink
              href="/guides/screen-reader-testing"
              className={linkClass}
            >
              screen reader testing guide
            </NextLink>
            , then the{" "}
            <NextLink
              href="/guides/jaws-screen-reader-testing"
              className={linkClass}
            >
              JAWS
            </NextLink>{" "}
            and{" "}
            <NextLink
              href="/guides/nvda-screen-reader-testing"
              className={linkClass}
            >
              NVDA
            </NextLink>{" "}
            walkthroughs. For the wider numbers, see{" "}
            <NextLink
              href="/research/web-accessibility-statistics"
              className={linkClass}
            >
              web accessibility statistics
            </NextLink>
            .
          </p>
        </div>
      </section>

      <MethodologySection
        id="methodology"
        title="Methodology and limitations"
        summary="Where every number comes from, and why the comparison needs care."
        headingLevel={2}
        defaultExpanded
        dataSources={[
          {
            name: s11.name,
            url: s11.url,
            description: `${s11.validResponses.toLocaleString()} valid responses collected ${s11.surveyPeriod}. Page last updated by WebAIM ${s11.lastUpdatedBySource}. © WebAIM.`,
          },
          {
            name: s10.name,
            url: s10.url,
            description: `${s10.validResponses.toLocaleString()} valid responses collected ${s10.surveyPeriod}. Page last updated by WebAIM ${s10.lastUpdatedBySource}. © WebAIM.`,
          },
        ]}
        sampleSize={`${s11.validResponses.toLocaleString()} (2026) and ${s10.validResponses.toLocaleString()} (2024) valid responses`}
        dateRange={`${s10.surveyPeriod} and ${s11.surveyPeriod}`}
        limitations={[
          "Every table was parsed from the raw HTML of both WebAIM results pages, not retyped. Regional JAWS and NVDA shares, and figures such as the PDF and AI totals, come from WebAIM's published commentary and are labelled as such in the dataset.",
          "WebAIM states that the sample was not controlled and may not represent all screen reader users. Respondents self-select, so these are shares of survey respondents, not market share, sales or installations.",
          `The regional mix changed: North America went from ${fmt(na?.percent2024)} to ${fmt(na?.percent2026)} of respondents. Shifts in overall shares partly reflect who answered. WebAIM says this alone does not account for the rise in JAWS.`,
          "The only figure we calculate is the percentage-point change (2026 minus 2024). We do not re-weight, combine or estimate anything, and where an answer appears in only one year's table we show it as Not listed rather than zero.",
          "Survey #11 dropped several 2024 questions, including the problematic items ranking that placed CAPTCHA first, and added questions on AI, skip links and documents. Single-survey questions are shown separately.",
          "Totals may not equal 100% because of rounding, and not every respondent answered every question, so the base for each percentage differs slightly.",
        ]}
        lastUpdated={data.lastUpdated}
      />

      <ReportDownloads
        reportUrl={REPORT_URL}
        citation={`Accessibility.build. (2026). Screen Reader Survey 2026: What Changed Since 2024. ${REPORT_URL}. Data © WebAIM, ${s11.url}`}
        description="The PDF contains the primary screen reader, commonly used, navigation, progress and regional tables with the source note. The CSV contains every question asked in both surveys, the regional split, and the single-survey questions."
        onDownloadPdf={handleDownloadPDF}
        onDownloadCsv={handleDownloadCSV}
        primaryDatasetUrl={s11.url}
        intro="WebAIM permits reproduction of its content only at no cost to recipients, with full credit, a link to webaim.org and the © WebAIM notice intact. Keep that attribution when you reuse these figures."
      />
    </div>
  );
}
