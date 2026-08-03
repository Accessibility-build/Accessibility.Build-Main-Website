"use client";

import { useMemo, useState } from "react";
import NextLink from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Landmark,
  Languages,
  Link as LinkIcon,
  Linkedin,
  ShoppingBag,
  TriangleAlert,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";
import { ChartSection } from "@/components/research/chart-section";
import { MethodologySection } from "@/components/research/methodology-section";

interface SegmentRow {
  name: string;
  homePages: number;
  avgErrors: number;
  vsAverage: number;
}

interface IndustryData {
  lastUpdated: string;
  reportPeriod: string;
  baselineErrors: number;
  totalSitesAnalyzed: number;
  categoryNote: string;
  source: {
    name: string;
    url: string;
    published: string;
    dataPeriod: string;
    description: string;
  };
  categories: SegmentRow[];
  languages: SegmentRow[];
}

const REPORT_URL =
  "https://accessibility.build/research/accessibility-by-industry";

/**
 * Describes a sector's distance from the million-page average in words as well
 * as a number, so the comparison never depends on colour alone (WCAG 1.4.1).
 */
function formatVsAverage(value: number) {
  const rounded = Math.round(Math.abs(value) * 10) / 10;
  if (rounded === 0) return "at the average";
  return `${rounded}% ${value < 0 ? "below" : "above"} average`;
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

/** Sectors that map onto an industry guide we publish. */
const SECTOR_GUIDES: Record<string, { href: string; label: string }> = {
  Government: { href: "/industries/government", label: "government guide" },
  Education: { href: "/industries/education", label: "education guide" },
  Shopping: { href: "/industries/ecommerce", label: "ecommerce guide" },
  "Health & Fitness": {
    href: "/industries/healthcare",
    label: "healthcare guide",
  },
};

function SegmentTable({
  rows,
  caption,
  unitLabel,
  baseline,
  withGuides = false,
}: {
  rows: SegmentRow[];
  caption: string;
  unitLabel: string;
  baseline: number;
  withGuides?: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <caption className="sr-only">
          {caption} Compared with the million-page average of {baseline}{" "}
          detected errors per home page.
        </caption>
        <thead>
          <tr className="border-b border-slate-300 dark:border-slate-700">
            <th scope="col" className="px-3 py-3 text-left font-semibold">
              Rank
            </th>
            <th scope="col" className="px-3 py-3 text-left font-semibold">
              {unitLabel}
            </th>
            <th scope="col" className="px-3 py-3 text-right font-semibold">
              Home pages
            </th>
            <th scope="col" className="px-3 py-3 text-right font-semibold">
              Avg. errors
            </th>
            <th scope="col" className="px-3 py-3 text-right font-semibold">
              Vs average
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const guide = withGuides ? SECTOR_GUIDES[row.name] : undefined;
            return (
              <tr
                key={row.name}
                className="border-b border-slate-200 last:border-0 dark:border-slate-800"
              >
                <td className="px-3 py-3 text-slate-500 dark:text-slate-400">
                  {index + 1}
                </td>
                <th
                  scope="row"
                  className="px-3 py-3 text-left font-medium text-slate-900 dark:text-white"
                >
                  {row.name}
                  {guide && (
                    <>
                      {" "}
                      <NextLink
                        href={guide.href}
                        className="text-xs font-normal text-teal-700 underline-offset-4 hover:underline dark:text-teal-300"
                      >
                        ({guide.label})
                      </NextLink>
                    </>
                  )}
                </th>
                <td className="px-3 py-3 text-right tabular-nums text-slate-600 dark:text-slate-400">
                  {row.homePages.toLocaleString()}
                </td>
                <td className="px-3 py-3 text-right font-semibold tabular-nums">
                  {row.avgErrors}
                </td>
                <td
                  className={`px-3 py-3 text-right tabular-nums ${
                    row.vsAverage < 0
                      ? "text-teal-700 dark:text-teal-300"
                      : "text-amber-700 dark:text-amber-300"
                  }`}
                >
                  {formatVsAverage(row.vsAverage)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function SegmentChart({
  rows,
  baseline,
  label,
}: {
  rows: SegmentRow[];
  baseline: number;
  label: string;
}) {
  return (
    <>
      <div className="space-y-3 md:hidden">
        {rows.map((row, index) => (
          <div key={row.name}>
            <div className="mb-1.5 flex items-start justify-between gap-3 text-sm">
              <span className="font-medium text-slate-900 dark:text-white">
                {index + 1}. {row.name}
              </span>
              <span className="shrink-0 font-semibold tabular-nums">
                {row.avgErrors}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className={`h-full rounded-full ${
                  row.vsAverage < 0
                    ? "bg-teal-600 dark:bg-teal-400"
                    : "bg-amber-600 dark:bg-amber-400"
                }`}
                style={{
                  width: `${Math.min(100, (row.avgErrors / 145) * 100)}%`,
                }}
              />
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {formatVsAverage(row.vsAverage)}
            </p>
          </div>
        ))}
      </div>

      <div
        className="hidden md:block"
        style={{ height: Math.max(300, rows.length * 27 + 60) }}
        role="img"
        aria-label={`Bar chart ranking ${label} by average detected accessibility errors per home page. Lowest is ${rows[0].name} at ${rows[0].avgErrors} errors and highest is ${rows[rows.length - 1].name} at ${rows[rows.length - 1].avgErrors}, against a million-page average of ${baseline}.`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={rows}
            layout="vertical"
            margin={{ top: 5, right: 60, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              className="stroke-slate-200 dark:stroke-slate-700"
            />
            <XAxis type="number" tick={{ fill: "currentColor", fontSize: 12 }} />
            <YAxis
              dataKey="name"
              type="category"
              width={185}
              tick={{ fill: "currentColor", fontSize: 11 }}
            />
            <ReferenceLine
              x={baseline}
              stroke="#64748b"
              strokeDasharray="4 4"
              label={{
                value: `avg ${baseline}`,
                position: "top",
                fill: "currentColor",
                fontSize: 11,
              }}
            />
            <Tooltip
              content={({ active, payload, label: rowLabel }) => {
                if (!active || !payload?.length) return null;
                const row = payload[0].payload as SegmentRow;
                return (
                  <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg dark:border-slate-700 dark:bg-slate-900">
                    <p className="font-medium text-slate-950 dark:text-white">
                      {rowLabel}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300">
                      {row.avgErrors} errors per home page
                    </p>
                    <p className="text-slate-600 dark:text-slate-300">
                      {formatVsAverage(row.vsAverage)}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400">
                      {row.homePages.toLocaleString()} home pages
                    </p>
                  </div>
                );
              }}
            />
            <Bar dataKey="avgErrors" radius={[0, 4, 4, 0]}>
              {rows.map((row) => (
                <Cell
                  key={row.name}
                  fill={row.vsAverage < 0 ? "#0d9488" : "#d97706"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

export function AccessibilityByIndustryClient({
  initialData,
}: {
  initialData: IndustryData;
}) {
  const data = initialData;
  const [citationCopied, setCitationCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const categories = useMemo(
    () => [...data.categories].sort((a, b) => a.avgErrors - b.avgErrors),
    [data.categories],
  );
  const languages = useMemo(
    () => [...data.languages].sort((a, b) => a.avgErrors - b.avgErrors),
    [data.languages],
  );

  const citation =
    "Accessibility.build. (2026). Web Accessibility by Industry. https://accessibility.build/research/accessibility-by-industry";

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
      "WEB ACCESSIBILITY BY INDUSTRY",
      `Reviewed,${data.lastUpdated}`,
      `Primary data period,${data.reportPeriod}`,
      `Million-page average errors per home page,${data.baselineErrors}`,
      `Source,${data.source.name},${data.source.url}`,
      "",
      "SITE CATEGORIES",
      "Rank,Category,Home pages,Average errors,Percent vs average",
      ...categories.map(
        (row, index) =>
          `${index + 1},"${row.name}",${row.homePages},${row.avgErrors},${row.vsAverage}`,
      ),
      "",
      "LANGUAGES",
      "Rank,Language,Home pages,Average errors,Percent vs average",
      ...languages.map(
        (row, index) =>
          `${index + 1},"${row.name}",${row.homePages},${row.avgErrors},${row.vsAverage}`,
      ),
    ];
    downloadBlobAs(
      new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" }),
      "accessibility-by-industry-2026.csv",
    );
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(19);
    doc.text("Web Accessibility by Industry", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(90);
    doc.text(
      `Reviewed ${data.lastUpdated} | Primary data period: ${data.reportPeriod}`,
      14,
      28,
    );
    doc.text(
      `Million-page average: ${data.baselineErrors} detected errors per home page`,
      14,
      34,
    );

    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text("Site categories", 14, 44);
    autoTable(doc, {
      startY: 48,
      head: [["Rank", "Category", "Home pages", "Avg. errors", "Vs average"]],
      body: categories.map((row, index) => [
        index + 1,
        row.name,
        row.homePages.toLocaleString(),
        String(row.avgErrors),
        formatVsAverage(row.vsAverage),
      ]),
      theme: "striped",
      headStyles: { fillColor: [15, 118, 110] },
      margin: { left: 14, right: 14 },
    });

    doc.addPage();
    doc.setFontSize(12);
    doc.text("Languages", 14, 20);
    autoTable(doc, {
      startY: 24,
      head: [["Rank", "Language", "Home pages", "Avg. errors", "Vs average"]],
      body: languages.map((row, index) => [
        index + 1,
        row.name,
        row.homePages.toLocaleString(),
        String(row.avgErrors),
        formatVsAverage(row.vsAverage),
      ]),
      theme: "striped",
      headStyles: { fillColor: [15, 118, 110] },
      margin: { left: 14, right: 14 },
    });

    const end =
      (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable
        ?.finalY ?? 120;
    doc.setTextColor(70);
    doc.setFontSize(9);
    const note = doc.splitTextToSize(
      `Source: WebAIM Million 2026 (February 2026 sample), https://webaim.org/projects/million/. ${data.categoryNote} Automated testing covers only a subset of WCAG and evaluates home pages only, so these averages cannot establish conformance for any sector or site.`,
      180,
    );
    doc.text(note, 14, Math.min(end + 12, 265));
    doc.save("accessibility-by-industry-2026.pdf");
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
                How the sectors were assigned
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700 dark:text-slate-300">
                {data.categoryNote} That means a category label is a machine
                judgement about what a site is for, not a self-declared industry
                or a regulatory classification. Sector averages also mix
                organisations of wildly different size and budget, so treat a
                figure as a benchmark to compare your own audit against, not as
                a grade for an industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="categories"
        aria-labelledby="categories-heading"
        className="scroll-mt-40"
      >
        <ChartSection
          title="Every sector, ranked"
          titleId="categories-heading"
          headingLevel={2}
          description={`Average detected errors per home page across ${categories.length} site categories, against a million-page average of ${data.baselineErrors}.`}
          insight={`Government home pages had the fewest detected errors at ${categories[0].avgErrors}, and Sports the most at ${categories[categories.length - 1].avgErrors}. The gap between the best and worst sector is roughly 29 errors per page, which is smaller than the gap between the best and worst JavaScript library.`}
          source={data.source.name}
          sourceUrl={data.source.url}
          dataTable={
            <SegmentTable
              rows={categories}
              caption={`All ${categories.length} site categories ranked by average detected accessibility errors per home page in February 2026.`}
              unitLabel="Category"
              baseline={data.baselineErrors}
              withGuides
            />
          }
          downloadData={{
            filename: "accessibility-by-industry-categories-2026",
            data: categories.map((row, index) => ({
              Rank: index + 1,
              Category: row.name,
              "Home pages": row.homePages,
              "Average errors": row.avgErrors,
              "Percent vs average": row.vsAverage,
            })),
          }}
        >
          <SegmentChart
            rows={categories}
            baseline={data.baselineErrors}
            label="site categories"
          />
        </ChartSection>
      </section>

      <section
        id="sectors"
        aria-labelledby="sectors-heading"
        className="scroll-mt-40"
      >
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">
            Interpretation
          </p>
          <h2
            id="sectors-heading"
            className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white"
          >
            Regulation shows up in the data
          </h2>
          <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
            The sectors at the top of the table are the ones that have been
            legally obliged to care the longest. The sectors at the bottom sell
            things.
          </p>
        </div>

        <div className="mt-7 grid gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 dark:border-slate-800 dark:bg-slate-800 lg:grid-cols-3">
          <article className="bg-white p-6 dark:bg-slate-950">
            <Landmark
              className="h-5 w-5 text-teal-700 dark:text-teal-300"
              aria-hidden="true"
            />
            <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
              Public sector leads
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Government sites averaged {categories[0].avgErrors} errors,{" "}
              {formatVsAverage(categories[0].vsAverage)}, and Non-Profit and
              Education were close behind. These are the sectors covered by
              Section 508, ADA Title II, and the EU Web Accessibility Directive.
              Sustained legal obligation correlates with measurably better
              markup.
            </p>
            <p className="mt-3 text-sm">
              <NextLink
                href="/industries/government"
                className="font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-300"
              >
                Government accessibility guide
              </NextLink>
            </p>
          </article>
          <article className="bg-white p-6 dark:bg-slate-950">
            <ShoppingBag
              className="h-5 w-5 text-teal-700 dark:text-teal-300"
              aria-hidden="true"
            />
            <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
              Retail trails, and gets sued
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Shopping sat near the bottom of the table, and every ecommerce
              platform we measured separately also came in above average. Retail
              is simultaneously the sector with the most detected barriers and
              the one facing the most digital accessibility litigation.
            </p>
            <p className="mt-3 text-sm">
              <NextLink
                href="/industries/ecommerce"
                className="font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-300"
              >
                Ecommerce accessibility guide
              </NextLink>
            </p>
          </article>
          <article className="bg-white p-6 dark:bg-slate-950">
            <Languages
              className="h-5 w-5 text-teal-700 dark:text-teal-300"
              aria-hidden="true"
            />
            <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
              Language matters more than sector
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              The spread across languages is far wider than across industries.
              Home pages in the worst-performing language averaged{" "}
              {languages[languages.length - 1].avgErrors} errors, more than
              double the million-page average, which dwarfs any sector
              difference in this dataset.
            </p>
          </article>
        </div>
      </section>

      <section
        id="languages"
        aria-labelledby="languages-heading"
        className="scroll-mt-40"
      >
        <ChartSection
          title="By primary language"
          titleId="languages-heading"
          headingLevel={2}
          description={`Average detected errors per home page across ${languages.length} languages, against a million-page average of ${data.baselineErrors}.`}
          insight={`The range here is the widest segmentation in the study, from ${languages[0].avgErrors} errors to ${languages[languages.length - 1].avgErrors}. Language is a proxy for regional web conventions, popular platforms, and local regulation rather than anything about the language itself.`}
          source={data.source.name}
          sourceUrl={data.source.url}
          dataTable={
            <SegmentTable
              rows={languages}
              caption={`All ${languages.length} languages ranked by average detected accessibility errors per home page in February 2026.`}
              unitLabel="Language"
              baseline={data.baselineErrors}
            />
          }
          downloadData={{
            filename: "accessibility-by-language-2026",
            data: languages.map((row, index) => ({
              Rank: index + 1,
              Language: row.name,
              "Home pages": row.homePages,
              "Average errors": row.avgErrors,
              "Percent vs average": row.vsAverage,
            })),
          }}
        >
          <SegmentChart
            rows={languages}
            baseline={data.baselineErrors}
            label="languages"
          />
        </ChartSection>
      </section>

      <MethodologySection
        id="methodology"
        title="Methodology and limitations"
        summary="How sectors were classified and what the averages can support."
        headingLevel={2}
        defaultExpanded
        dataSources={[
          {
            name: data.source.name,
            url: data.source.url,
            description: data.source.description,
          },
        ]}
        sampleSize={`${data.totalSitesAnalyzed.toLocaleString()} home pages classified into ${data.categories.length} categories and ${data.languages.length} languages`}
        dateRange={`${data.reportPeriod} sample, published ${data.source.published}`}
        limitations={[
          "Automated tests evaluate only a subset of WCAG requirements and cannot establish conformance for a sector or for any individual site within it.",
          data.categoryNote,
          "Only home pages were evaluated. For most sectors the accessibility-critical journeys, such as checkout, patient portals, enrolment, and benefit applications, sit behind the home page and were never tested.",
          "Category sample sizes range from a few thousand to over 300,000 home pages, so smaller categories move more between years.",
          "Sector averages mix organisations of very different size and budget, and a category label describes what a site is for rather than how it is regulated.",
          "Language reflects the detected primary language of the home page, which is a proxy for regional platform and regulatory differences rather than a property of the language.",
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
            Useful as a benchmark in an audit report or a business case. Keep
            the link to WebAIM when publishing extracts.
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
              Download the data
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              The PDF contains the full sector and language tables with the
              methodology note. The CSV contains one row per sector and
              language.
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
              <Button variant="outline" asChild>
                <a
                  href={data.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink aria-hidden="true" />
                  Primary dataset
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
