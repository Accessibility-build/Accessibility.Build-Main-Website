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
  Boxes,
  Check,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Layers3,
  Link as LinkIcon,
  Linkedin,
  ShoppingCart,
  TriangleAlert,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";
import { ChartSection } from "@/components/research/chart-section";
import { MethodologySection } from "@/components/research/methodology-section";

interface TechRow {
  name: string;
  homePages: number;
  avgErrors: number;
  vsAverage: number;
}

interface TechGroup {
  id: string;
  label: string;
  intro: string;
  rows: TechRow[];
}

interface TechnologyData {
  lastUpdated: string;
  reportPeriod: string;
  baselineErrors: number;
  totalSitesAnalyzed: number;
  source: {
    name: string;
    url: string;
    published: string;
    dataPeriod: string;
    description: string;
  };
  groups: TechGroup[];
}

const REPORT_URL =
  "https://accessibility.build/research/accessibility-by-technology";

/**
 * Describes a technology's distance from the million-page average in words as
 * well as a number, so the comparison never depends on colour or on a screen
 * reader announcing a bare sign glyph (WCAG 1.4.1).
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

function GroupDataTable({
  group,
  baseline,
}: {
  group: TechGroup;
  baseline: number;
}) {
  const rows = [...group.rows].sort((a, b) => a.avgErrors - b.avgErrors);
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[620px] border-collapse text-sm">
        <caption className="sr-only">
          {group.label} ranked by average detected accessibility errors per home
          page in February 2026, compared with the million-page average of{" "}
          {baseline} errors
        </caption>
        <thead>
          <tr className="border-b border-slate-300 dark:border-slate-700">
            <th scope="col" className="px-3 py-3 text-left font-semibold">
              Rank
            </th>
            <th scope="col" className="px-3 py-3 text-left font-semibold">
              Technology
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
          {rows.map((row, index) => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GroupSection({
  group,
  baseline,
  sourceUrl,
  sourceName,
}: {
  group: TechGroup;
  baseline: number;
  sourceUrl: string;
  sourceName: string;
}) {
  const rows = useMemo(
    () => [...group.rows].sort((a, b) => a.avgErrors - b.avgErrors),
    [group.rows],
  );
  const chartHeight = Math.max(240, rows.length * 30 + 60);

  return (
    <ChartSection
      title={group.label}
      titleId={`${group.id}-heading`}
      headingLevel={2}
      description={`Average detected errors per home page, against a million-page average of ${baseline}.`}
      insight={group.intro}
      source={sourceName}
      sourceUrl={sourceUrl}
      dataTable={<GroupDataTable group={group} baseline={baseline} />}
      downloadData={{
        filename: `accessibility-by-${group.id}-2026`,
        data: rows.map((row, index) => ({
          Rank: index + 1,
          Technology: row.name,
          "Home pages": row.homePages,
          "Average errors": row.avgErrors,
          "Percent vs average": row.vsAverage,
        })),
      }}
    >
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
                  width: `${Math.min(100, (row.avgErrors / 150) * 100)}%`,
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
        style={{ height: chartHeight }}
        role="img"
        aria-label={`Bar chart ranking ${group.label.toLowerCase()} by average detected accessibility errors per home page. Lowest is ${rows[0].name} at ${rows[0].avgErrors} errors and highest is ${rows[rows.length - 1].name} at ${rows[rows.length - 1].avgErrors}, against a million-page average of ${baseline}.`}
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
            <XAxis
              type="number"
              tick={{ fill: "currentColor", fontSize: 12 }}
            />
            <YAxis
              dataKey="name"
              type="category"
              width={170}
              tick={{ fill: "currentColor", fontSize: 12 }}
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
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const row = payload[0].payload as TechRow;
                return (
                  <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg dark:border-slate-700 dark:bg-slate-900">
                    <p className="font-medium text-slate-950 dark:text-white">
                      {label}
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
    </ChartSection>
  );
}

export function AccessibilityByTechnologyClient({
  initialData,
}: {
  initialData: TechnologyData;
}) {
  const data = initialData;
  const [citationCopied, setCitationCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const citation =
    "Accessibility.build. (2026). Web Accessibility by Technology Stack. https://accessibility.build/research/accessibility-by-technology";

  const allRows = useMemo(
    () => data.groups.flatMap((group) => group.rows),
    [data.groups],
  );

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
      "WEB ACCESSIBILITY BY TECHNOLOGY STACK",
      `Reviewed,${data.lastUpdated}`,
      `Primary data period,${data.reportPeriod}`,
      `Million-page average errors per home page,${data.baselineErrors}`,
      `Source,${data.source.name},${data.source.url}`,
      "",
      "Group,Technology,Home pages,Average errors,Percent vs average",
      ...data.groups.flatMap((group) =>
        [...group.rows]
          .sort((a, b) => a.avgErrors - b.avgErrors)
          .map(
            (row) =>
              `"${group.label}","${row.name}",${row.homePages},${row.avgErrors},${row.vsAverage}`,
          ),
      ),
    ];
    downloadBlobAs(
      new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" }),
      "accessibility-by-technology-2026.csv",
    );
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(19);
    doc.text("Web Accessibility by Technology Stack", 14, 20);
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

    let cursor = 42;
    data.groups.forEach((group) => {
      doc.setTextColor(0);
      doc.setFontSize(12);
      doc.text(group.label, 14, cursor);
      autoTable(doc, {
        startY: cursor + 4,
        head: [["Technology", "Home pages", "Avg. errors", "Vs average"]],
        body: [...group.rows]
          .sort((a, b) => a.avgErrors - b.avgErrors)
          .map((row) => [
            row.name,
            row.homePages.toLocaleString(),
            String(row.avgErrors),
            formatVsAverage(row.vsAverage),
          ]),
        theme: "striped",
        headStyles: { fillColor: [15, 118, 110] },
        margin: { left: 14, right: 14 },
      });
      cursor =
        ((doc as unknown as { lastAutoTable?: { finalY: number } })
          .lastAutoTable?.finalY ?? cursor) + 14;
      if (cursor > 240) {
        doc.addPage();
        cursor = 20;
      }
    });

    doc.setTextColor(70);
    doc.setFontSize(9);
    const note = doc.splitTextToSize(
      "Source: WebAIM Million 2026 (February 2026 sample), https://webaim.org/projects/million/. WebAIM notes that additional errors correlated with a technology cannot always be attributed to that technology. Sites built on a given platform differ in purpose and complexity, so these figures describe what was measured, not what a technology causes.",
      180,
    );
    doc.text(note, 14, Math.min(cursor, 265));
    doc.save("accessibility-by-technology-2026.pdf");
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
                Read this as correlation, not causation
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700 dark:text-slate-300">
                WebAIM states directly that additional errors correlated with a
                technology cannot always be attributed to that technology. A
                platform&apos;s score reflects the sites built on it as much as
                the platform itself. Ecommerce stores are more complex than
                brochure sites, and the teams choosing an enterprise CMS often
                have accessibility budgets that a hobbyist does not. Use these
                numbers to ask better questions about your stack, not to declare
                a winner.
              </p>
            </div>
          </div>
        </div>
      </section>

      {data.groups.map((group) => (
        <section
          key={group.id}
          id={group.id}
          aria-labelledby={`${group.id}-heading`}
          className="scroll-mt-40"
        >
          <GroupSection
            group={group}
            baseline={data.baselineErrors}
            sourceUrl={data.source.url}
            sourceName={data.source.name}
          />
        </section>
      ))}

      <section
        id="what-to-do"
        aria-labelledby="what-to-do-heading"
        className="scroll-mt-40"
      >
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">
            Interpretation
          </p>
          <h2
            id="what-to-do-heading"
            className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white"
          >
            What to do with this
          </h2>
          <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
            The useful signal is not a leaderboard. It is that the pieces you
            add to a page carry more risk than the platform you start from.
          </p>
        </div>

        <div className="mt-7 grid gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 dark:border-slate-800 dark:bg-slate-800 lg:grid-cols-3">
          <article className="bg-white p-6 dark:bg-slate-950">
            <Layers3
              className="h-5 w-5 text-teal-700 dark:text-teal-300"
              aria-hidden="true"
            />
            <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
              Your CMS sets a floor, not a ceiling
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Every mainstream CMS in the sample came in at or below the
              million-page average, and the spread between the best and the
              worst is smaller than the spread inside any one of them. Picking a
              different CMS will not fix a theme, a page builder or a plugin
              that emits inaccessible markup.
            </p>
          </article>
          <article className="bg-white p-6 dark:bg-slate-950">
            <Boxes
              className="h-5 w-5 text-teal-700 dark:text-teal-300"
              aria-hidden="true"
            />
            <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
              Widget libraries are where it goes wrong
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Almost every popular library measured was associated with more
              errors than average. The pattern is telling: the worst are
              carousels, lightboxes, custom selects and alert replacements, the
              exact components teams install so they do not have to build them.
              Reach for a native element first, then a headless library that
              documents its keyboard and ARIA behaviour.
            </p>
          </article>
          <article className="bg-white p-6 dark:bg-slate-950">
            <ShoppingCart
              className="h-5 w-5 text-teal-700 dark:text-teal-300"
              aria-hidden="true"
            />
            <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
              Ecommerce carries the most risk
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Every ecommerce platform measured sat above the average, and
              Shopping was one of the worst-performing sectors overall. Online
              stores also attract the most accessibility litigation, so this is
              the stack where the gap between measured errors and legal exposure
              matters most.
            </p>
          </article>
        </div>

        <p className="mt-6 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
          If the library findings match your stack, the component guides are the
          place to start:{" "}
          <NextLink
            href="/learn/carousels"
            className="font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-300"
          >
            accessible carousels
          </NextLink>
          ,{" "}
          <NextLink
            href="/guides/accessible-dialog"
            className="font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-300"
          >
            dialogs and modals
          </NextLink>{" "}
          for lightbox and alert replacements, and{" "}
          <NextLink
            href="/guides/accessible-combobox"
            className="font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-300"
          >
            comboboxes
          </NextLink>{" "}
          or{" "}
          <NextLink
            href="/guides/accessible-listbox"
            className="font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-300"
          >
            listboxes
          </NextLink>{" "}
          for custom selects. For framework-level patterns, see the{" "}
          <NextLink
            href="/guides/react-accessibility"
            className="font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-300"
          >
            React
          </NextLink>
          ,{" "}
          <NextLink
            href="/guides/vue-accessibility"
            className="font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-300"
          >
            Vue
          </NextLink>{" "}
          and{" "}
          <NextLink
            href="/guides/angular-accessibility"
            className="font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-300"
          >
            Angular
          </NextLink>{" "}
          guides, and for storefronts the{" "}
          <NextLink
            href="/industries/ecommerce"
            className="font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-300"
          >
            ecommerce accessibility guide
          </NextLink>
          .
        </p>
      </section>

      <MethodologySection
        id="methodology"
        title="Methodology and limitations"
        summary="Where the technology detection comes from and what the averages can support."
        headingLevel={2}
        defaultExpanded
        dataSources={[
          {
            name: data.source.name,
            url: data.source.url,
            description: data.source.description,
          },
        ]}
        sampleSize={`${data.totalSitesAnalyzed.toLocaleString()} home pages, of which ${allRows
          .reduce((total, row) => total + row.homePages, 0)
          .toLocaleString()} technology detections are represented across the groups above`}
        dateRange={`${data.reportPeriod} sample, published ${data.source.published}`}
        limitations={[
          "Automated tests evaluate only a subset of WCAG requirements and cannot establish conformance. A low error count does not mean a technology produces accessible sites.",
          "WebAIM states that additional errors correlated with a technology cannot always be attributed to that technology. These are observed averages, not causal effects.",
          "Technology detection is inferred from the rendered page, and a single home page can match several groups at once, so the groups overlap and do not sum to the sample.",
          "Sample sizes vary enormously, from a few thousand home pages to over 500,000. A small sample moves more between years.",
          "Only home pages were evaluated, so checkout flows, dashboards and authenticated pages, where many platform differences actually show up, were never tested.",
          "The averages describe the sites built with a technology, which reflects the budgets, themes and plugins of the teams that chose it as much as the technology itself.",
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
            Reuse the findings with a clear citation, and keep the link to
            WebAIM when publishing extracts.
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
              The PDF contains every group as a table with the methodology note.
              The CSV contains one row per technology for your own analysis.
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
