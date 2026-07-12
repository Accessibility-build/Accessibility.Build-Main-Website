"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  Braces,
  Check,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Gauge,
  Globe2,
  Layers3,
  Link as LinkIcon,
  Linkedin,
  ScanSearch,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";
import { ChartSection } from "@/components/research/chart-section";
import { MethodologySection } from "@/components/research/methodology-section";

interface AccessibilityData {
  lastUpdated: string;
  reportPeriod: string;
  sources: {
    name: string;
    url: string;
    year: number;
    description: string;
  }[];
  keyFindings: {
    totalSitesAnalyzed: number;
    percentWithErrors: number;
    averageErrorsPerPage: number;
    errorDensity: number;
    fiveOrFewerErrors: number;
    tenOrFewerErrors: number;
  };
  topViolations: {
    id: string;
    name: string;
    percentage: number;
    wcagCriteria: string;
    description: string;
  }[];
  yearOverYearTrends: {
    year: number;
    percentWithErrors: number;
    avgErrorsPerPage: number;
  }[];
  contextFindings: {
    averageElementsPerPage: number;
    complexityIncreaseYearOverYear: number;
    complexityIncreaseSince2019: number;
    ariaUsage: number;
    averageErrorsWithAria: number;
    averageErrorsWithoutAria: number;
    medianLighthouseScore: number;
  };
}

interface StateOfAccessibilityClientProps {
  initialData: AccessibilityData;
}

interface MetricProps {
  value: string;
  label: string;
  detail: string;
  icon: typeof Globe2;
}

const REPORT_URL =
  "https://accessibility.build/research/state-of-accessibility";
const WEBAIM_URL = "https://webaim.org/projects/million/2025";

function Metric({ value, label, detail, icon: Icon }: MetricProps) {
  return (
    <article className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 sm:p-5">
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 sm:h-10 sm:w-10">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <p className="mt-4 text-2xl font-semibold text-slate-950 dark:text-white sm:text-3xl">
        {value}
      </p>
      <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
        {label}
      </h3>
      <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
        {detail}
      </p>
    </article>
  );
}

function downloadBlobAs(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function StateOfAccessibilityClient({
  initialData,
}: StateOfAccessibilityClientProps) {
  const data = initialData;
  const [citationCopied, setCitationCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const sortedViolations = useMemo(
    () => [...data.topViolations].sort((a, b) => b.percentage - a.percentage),
    [data.topViolations],
  );

  const methodologyDataSources = useMemo(
    () =>
      data.sources.map((source) => ({
        name: source.name,
        url: source.url,
        description: source.description,
      })),
    [data.sources],
  );

  const citation =
    "Accessibility.build. (2026). State of Web Accessibility 2026. https://accessibility.build/research/state-of-accessibility";

  const copyText = async (text: string, type: "citation" | "link") => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    if (type === "citation") {
      setCitationCopied(true);
      window.setTimeout(() => setCitationCopied(false), 2000);
    } else {
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const handleDownloadCSV = () => {
    const rows = [
      "STATE OF WEB ACCESSIBILITY 2026",
      `Reviewed,${data.lastUpdated}`,
      `Primary data period,${data.reportPeriod}`,
      "",
      "KEY FINDINGS",
      "Metric,Value",
      `Homepages analyzed,${data.keyFindings.totalSitesAnalyzed}`,
      `Homepages with detectable WCAG failures,${data.keyFindings.percentWithErrors}%`,
      `Average detected errors per homepage,${data.keyFindings.averageErrorsPerPage}`,
      `Page elements with a detected error,${data.keyFindings.errorDensity}%`,
      "",
      "COMMON DETECTED FAILURES",
      "Failure,WCAG criterion,Percentage of homepages",
      ...sortedViolations.map(
        (item) => `"${item.name}",${item.wcagCriteria},${item.percentage}%`,
      ),
      "",
      "YEAR-OVER-YEAR",
      "Year,Homepages with failures,Average errors per homepage",
      ...data.yearOverYearTrends.map(
        (item) =>
          `${item.year},${item.percentWithErrors}%,${item.avgErrorsPerPage}`,
      ),
      "",
      "SOURCES",
      ...data.sources.map((source) => `"${source.name}",${source.url}`),
    ];

    downloadBlobAs(
      new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" }),
      "state-of-web-accessibility-2026.csv",
    );
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("State of Web Accessibility 2026", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(90);
    doc.text("Source-linked accessibility research synthesis", 14, 28);
    doc.text(
      `Reviewed ${data.lastUpdated} | Primary data period: ${data.reportPeriod}`,
      14,
      34,
    );

    doc.setTextColor(0);
    doc.setFontSize(13);
    doc.text("At a glance", 14, 46);
    autoTable(doc, {
      startY: 50,
      head: [["Measure", "Finding"]],
      body: [
        [
          "Homepages analyzed",
          data.keyFindings.totalSitesAnalyzed.toLocaleString(),
        ],
        [
          "With detectable WCAG failures",
          `${data.keyFindings.percentWithErrors}%`,
        ],
        [
          "Average detected errors",
          `${data.keyFindings.averageErrorsPerPage} per homepage`,
        ],
        ["Elements with a detected error", `${data.keyFindings.errorDensity}%`],
      ],
      theme: "striped",
      headStyles: { fillColor: [15, 118, 110] },
    });

    const firstTableEnd =
      (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable
        ?.finalY ?? 90;
    doc.setFontSize(13);
    doc.text("Six most common detected failures", 14, firstTableEnd + 12);
    autoTable(doc, {
      startY: firstTableEnd + 16,
      head: [["Failure", "WCAG", "% of homepages"]],
      body: sortedViolations.map((item) => [
        item.name,
        item.wcagCriteria,
        `${item.percentage}%`,
      ]),
      theme: "striped",
      headStyles: { fillColor: [15, 118, 110] },
    });

    doc.addPage();
    doc.setFontSize(13);
    doc.text("Year-over-year trend", 14, 20);
    autoTable(doc, {
      startY: 24,
      head: [["Year", "Homepages with failures", "Average errors"]],
      body: data.yearOverYearTrends.map((item) => [
        item.year,
        `${item.percentWithErrors}%`,
        item.avgErrorsPerPage,
      ]),
      theme: "striped",
      headStyles: { fillColor: [15, 118, 110] },
    });

    const trendTableEnd =
      (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable
        ?.finalY ?? 100;
    doc.setFontSize(13);
    doc.text("Methodology and limitations", 14, trendTableEnd + 14);
    doc.setFontSize(10);
    doc.setTextColor(70);
    const methodology = doc.splitTextToSize(
      "This report is an independent synthesis of public research. WebAIM evaluated one million homepages using automated tests in February 2025. Automated detection covers only a subset of WCAG requirements, evaluates homepages rather than complete websites, and cannot establish conformance. HTTP Archive findings are presented as separate context and are not merged into the WebAIM sample.",
      180,
    );
    doc.text(methodology, 14, trendTableEnd + 22);

    doc.setTextColor(0);
    doc.setFontSize(13);
    doc.text("Primary sources", 14, trendTableEnd + 52);
    doc.setFontSize(9);
    data.sources.forEach((source, index) => {
      doc.text(
        `${source.name}: ${source.url}`,
        14,
        trendTableEnd + 60 + index * 7,
      );
    });

    doc.save("state-of-web-accessibility-2026.pdf");
  };

  const violationsTable = (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[620px] border-collapse text-sm">
        <caption className="sr-only">
          Six most common automatically detected WCAG failures in the WebAIM
          Million 2025 study
        </caption>
        <thead>
          <tr className="border-b border-slate-300 dark:border-slate-700">
            <th scope="col" className="px-3 py-3 text-left font-semibold">
              Rank
            </th>
            <th scope="col" className="px-3 py-3 text-left font-semibold">
              Detected failure
            </th>
            <th scope="col" className="px-3 py-3 text-left font-semibold">
              WCAG
            </th>
            <th scope="col" className="px-3 py-3 text-right font-semibold">
              Homepages
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedViolations.map((item, index) => (
            <tr
              key={item.id}
              className="border-b border-slate-200 dark:border-slate-800"
            >
              <td className="px-3 py-3 text-slate-500 dark:text-slate-400">
                {index + 1}
              </td>
              <td className="px-3 py-3">
                <span className="font-medium text-slate-900 dark:text-white">
                  {item.name}
                </span>
                <span className="mt-1 block text-xs text-slate-600 dark:text-slate-400">
                  {item.description}
                </span>
              </td>
              <td className="px-3 py-3 font-mono text-xs">
                {item.wcagCriteria}
              </td>
              <td className="px-3 py-3 text-right font-semibold tabular-nums">
                {item.percentage}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const trendsTable = (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <caption className="sr-only">
          WebAIM Million year-over-year detectable failure and average error
          data
        </caption>
        <thead>
          <tr className="border-b border-slate-300 dark:border-slate-700">
            <th scope="col" className="px-3 py-3 text-left font-semibold">
              Year
            </th>
            <th scope="col" className="px-3 py-3 text-right font-semibold">
              With failures
            </th>
            <th scope="col" className="px-3 py-3 text-right font-semibold">
              Average errors
            </th>
          </tr>
        </thead>
        <tbody>
          {data.yearOverYearTrends.map((item) => (
            <tr
              key={item.year}
              className="border-b border-slate-200 dark:border-slate-800"
            >
              <th scope="row" className="px-3 py-3 text-left font-medium">
                {item.year}
              </th>
              <td className="px-3 py-3 text-right tabular-nums">
                {item.percentWithErrors}%
              </td>
              <td className="px-3 py-3 text-right tabular-nums">
                {item.avgErrorsPerPage}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-16 sm:space-y-20">
      <section
        id="key-findings"
        aria-labelledby="key-findings-heading"
        className="scroll-mt-40"
      >
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">
              At a glance
            </p>
            <h2
              id="key-findings-heading"
              className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white"
            >
              The scale of detectable barriers
            </h2>
          </div>
          <a
            href={WEBAIM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:underline dark:text-teal-300"
          >
            WebAIM Million 2025
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Metric
            value={data.keyFindings.totalSitesAnalyzed.toLocaleString()}
            label="Homepages analyzed"
            detail="A homepage-level sample, not one million complete websites."
            icon={Globe2}
          />
          <Metric
            value={`${data.keyFindings.percentWithErrors}%`}
            label="With detectable WCAG failures"
            detail="Automatically detectable failures only; not a full conformance result."
            icon={AlertTriangle}
          />
          <Metric
            value={String(data.keyFindings.averageErrorsPerPage)}
            label="Average errors per homepage"
            detail="The mean number of detected errors in the 2025 sample."
            icon={ScanSearch}
          />
          <Metric
            value={`${data.keyFindings.errorDensity}%`}
            label="Elements with detected errors"
            detail="About one detected error for every 24 page elements."
            icon={Gauge}
          />
        </div>
      </section>

      <section
        id="barriers"
        aria-labelledby="barriers-heading"
        className="scroll-mt-40"
      >
        <ChartSection
          title="Six common detectable failures"
          titleId="barriers-heading"
          headingLevel={2}
          description="The six failure types reported by WebAIM across the one-million-homepage sample."
          insight="Low contrast remains the most widespread detected issue. Together, these six categories account for 96% of all errors WebAIM detected."
          source="WebAIM Million 2025"
          sourceUrl={WEBAIM_URL}
          dataTable={violationsTable}
          downloadData={{
            filename: "common-detected-accessibility-failures-2025",
            data: sortedViolations.map((item, index) => ({
              Rank: index + 1,
              Failure: item.name,
              WCAG: item.wcagCriteria,
              "Percentage of homepages": item.percentage,
            })),
          }}
        >
          <div
            className="space-y-4 md:hidden"
            aria-label="Common detected failures ranked by prevalence"
          >
            {sortedViolations.map((item, index) => (
              <div key={item.id}>
                <div className="mb-1.5 flex items-start justify-between gap-3 text-sm">
                  <span className="font-medium text-slate-900 dark:text-white">
                    {index + 1}. {item.name}
                  </span>
                  <span className="shrink-0 font-semibold tabular-nums">
                    {item.percentage}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-teal-600 dark:bg-teal-400"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div
            className="hidden h-[390px] md:block"
            role="img"
            aria-label="Horizontal bar chart ranking six common detectable WCAG failures by percentage of affected homepages"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedViolations}
                layout="vertical"
                margin={{ top: 5, right: 50, left: 20, bottom: 5 }}
              >
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
                  width={180}
                  tick={{ fill: "currentColor", fontSize: 12 }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg dark:border-slate-700 dark:bg-slate-900">
                        <p className="font-medium text-slate-950 dark:text-white">
                          {label}
                        </p>
                        <p className="text-slate-600 dark:text-slate-300">
                          {payload[0].value}% of homepages
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="percentage" fill="#0d9488" radius={[0, 4, 4, 0]}>
                  {sortedViolations.map((item) => (
                    <Cell key={item.id} fill="#0d9488" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartSection>
      </section>

      <section
        id="trends"
        aria-labelledby="trends-heading"
        className="scroll-mt-40"
      >
        <ChartSection
          title="Progress remains gradual"
          titleId="trends-heading"
          headingLevel={2}
          description="WebAIM Million results for detectable failures and average errors per homepage, 2019-2025."
          insight="The share of homepages with detectable failures improved by 3 percentage points from 2019 to 2025, but 94.8% still had at least one detected failure."
          source="WebAIM Million 2025"
          sourceUrl={WEBAIM_URL}
          dataTable={trendsTable}
          downloadData={{
            filename: "webaim-million-year-over-year-2019-2025",
            data: data.yearOverYearTrends.map((item) => ({
              Year: item.year,
              "Percentage with failures": item.percentWithErrors,
              "Average errors per homepage": item.avgErrorsPerPage,
            })),
          }}
        >
          <div
            className="space-y-2 md:hidden"
            aria-label="Year-over-year accessibility findings"
          >
            {data.yearOverYearTrends.map((item) => (
              <div
                key={item.year}
                className="grid grid-cols-[48px_1fr_1fr] items-center gap-3 border-b border-slate-200 py-2.5 text-sm dark:border-slate-800"
              >
                <span className="font-semibold">{item.year}</span>
                <span>
                  <strong>{item.percentWithErrors}%</strong>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    with failures
                  </span>
                </span>
                <span>
                  <strong>{item.avgErrorsPerPage}</strong>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    average errors
                  </span>
                </span>
              </div>
            ))}
          </div>

          <div
            className="hidden h-[410px] md:block"
            role="img"
            aria-label="Line chart showing the percentage of homepages with detectable failures and the average errors per homepage from 2019 through 2025"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data.yearOverYearTrends}
                margin={{ top: 10, right: 25, left: 5, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-slate-200 dark:stroke-slate-700"
                />
                <XAxis
                  dataKey="year"
                  tick={{ fill: "currentColor", fontSize: 12 }}
                />
                <YAxis
                  yAxisId="failures"
                  domain={[92, 100]}
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fill: "currentColor", fontSize: 12 }}
                />
                <YAxis
                  yAxisId="errors"
                  orientation="right"
                  domain={[40, 70]}
                  tick={{ fill: "currentColor", fontSize: 12 }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg dark:border-slate-700 dark:bg-slate-900">
                        <p className="mb-1 font-medium text-slate-950 dark:text-white">
                          {label}
                        </p>
                        <p className="text-teal-700 dark:text-teal-300">
                          Homepages with failures: {payload[0]?.value}%
                        </p>
                        <p className="text-amber-700 dark:text-amber-300">
                          Average errors: {payload[1]?.value}
                        </p>
                      </div>
                    );
                  }}
                />
                <Legend
                  formatter={(value) =>
                    value === "percentWithErrors"
                      ? "Homepages with failures (%)"
                      : "Average errors per homepage"
                  }
                />
                <Line
                  yAxisId="failures"
                  type="monotone"
                  dataKey="percentWithErrors"
                  stroke="#0d9488"
                  strokeWidth={3}
                  dot={{ fill: "#0d9488", r: 4 }}
                />
                <Line
                  yAxisId="errors"
                  type="monotone"
                  dataKey="avgErrorsPerPage"
                  stroke="#d97706"
                  strokeWidth={3}
                  dot={{ fill: "#d97706", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartSection>
      </section>

      <section
        id="context"
        aria-labelledby="context-heading"
        className="scroll-mt-40"
      >
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">
            Interpretation
          </p>
          <h2
            id="context-heading"
            className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white"
          >
            What the numbers do and do not show
          </h2>
          <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
            Automated measurements are useful for tracking recurring code-level
            barriers. They are not a substitute for manual review or testing
            with disabled people.
          </p>
        </div>

        <div className="mt-7 grid gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 dark:border-slate-800 dark:bg-slate-800 lg:grid-cols-3">
          <article className="bg-white p-6 dark:bg-slate-950">
            <Layers3
              className="h-5 w-5 text-teal-700 dark:text-teal-300"
              aria-hidden="true"
            />
            <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
              Pages are getting more complex
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              WebAIM found an average of{" "}
              <strong>
                {data.contextFindings.averageElementsPerPage.toLocaleString()}{" "}
                elements
              </strong>{" "}
              per homepage, up{" "}
              {data.contextFindings.complexityIncreaseYearOverYear}% in one year
              and {data.contextFindings.complexityIncreaseSince2019}% since
              2019.
            </p>
          </article>
          <article className="bg-white p-6 dark:bg-slate-950">
            <Braces
              className="h-5 w-5 text-teal-700 dark:text-teal-300"
              aria-hidden="true"
            />
            <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
              ARIA is not a shortcut
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {data.contextFindings.ariaUsage}% of homepages used ARIA. Pages
              with ARIA averaged {data.contextFindings.averageErrorsWithAria}{" "}
              detected errors versus{" "}
              {data.contextFindings.averageErrorsWithoutAria} without it, an
              association that also reflects greater page complexity.
            </p>
          </article>
          <article className="bg-white p-6 dark:bg-slate-950">
            <Gauge
              className="h-5 w-5 text-teal-700 dark:text-teal-300"
              aria-hidden="true"
            />
            <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
              A score is not conformance
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              HTTP Archive reported a median Lighthouse accessibility score of{" "}
              {data.contextFindings.medianLighthouseScore} in 2024. Lighthouse
              tests only part of WCAG, so even a perfect automated score cannot
              establish accessibility.
            </p>
          </article>
        </div>
      </section>

      <MethodologySection
        id="methodology"
        title="Methodology and limitations"
        summary="How the underlying studies were selected, kept separate, and interpreted for this report."
        headingLevel={2}
        defaultExpanded
        dataSources={methodologyDataSources}
        sampleSize="1,000,000 homepages in the primary WebAIM dataset"
        dateRange={`${data.reportPeriod} primary sample; June 2024 HTTP Archive context`}
        limitations={[
          "Automated tests evaluate only a subset of WCAG requirements and cannot establish conformance.",
          "The primary WebAIM sample covers homepages, not every template or user journey on each website.",
          "HTTP Archive findings are presented as separate context and are not merged into the WebAIM sample.",
          "Observed associations, including the relationship between ARIA usage and detected errors, do not prove causation.",
        ]}
        lastUpdated={data.lastUpdated}
      />

      <section
        id="downloads"
        aria-labelledby="downloads-heading"
        className="scroll-mt-40 border-t border-slate-200 pt-10 dark:border-slate-800"
      >
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">
            Use the research
          </p>
          <h2
            id="downloads-heading"
            className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white"
          >
            Download, cite, and share
          </h2>
          <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
            Reuse the findings with a clear citation and retain links to the
            primary sources when publishing extracts.
          </p>
        </div>

        <div className="mt-7 grid min-w-0 gap-6 lg:grid-cols-2">
          <div
            id="download-report"
            className="min-w-0 rounded-lg border border-slate-200 p-6 dark:border-slate-800"
          >
            <FileText
              className="h-5 w-5 text-teal-700 dark:text-teal-300"
              aria-hidden="true"
            />
            <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
              Download report data
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              The PDF includes key findings, trend tables, methodology, and
              source links. The CSV contains the underlying values used here.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                onClick={handleDownloadPDF}
                className="bg-teal-700 text-white hover:bg-teal-800"
              >
                <Download aria-hidden="true" />
                Download PDF
              </Button>
              <Button variant="outline" onClick={handleDownloadCSV}>
                <Download aria-hidden="true" />
                Download CSV
              </Button>
            </div>
          </div>

          <div className="min-w-0 rounded-lg border border-slate-200 p-6 dark:border-slate-800">
            <LinkIcon
              className="h-5 w-5 text-teal-700 dark:text-teal-300"
              aria-hidden="true"
            />
            <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
              Cite this report
            </h3>
            <p className="mt-2 break-words font-mono text-xs leading-6 text-slate-600 dark:text-slate-400">
              {citation}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => copyText(citation, "citation")}
              >
                {citationCopied ? (
                  <Check aria-hidden="true" />
                ) : (
                  <Copy aria-hidden="true" />
                )}
                {citationCopied ? "Citation copied" : "Copy citation"}
              </Button>
              <Button
                variant="outline"
                onClick={() => copyText(REPORT_URL, "link")}
              >
                {linkCopied ? (
                  <Check aria-hidden="true" />
                ) : (
                  <LinkIcon aria-hidden="true" />
                )}
                {linkCopied ? "Link copied" : "Copy link"}
              </Button>
              <Button variant="outline" asChild>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(REPORT_URL)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin aria-hidden="true" />
                  LinkedIn
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
