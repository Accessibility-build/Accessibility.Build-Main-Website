"use client";

import { useMemo } from "react";
import NextLink from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Brain, Eye, TriangleAlert } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ChartSection } from "@/components/research/chart-section";
import { MethodologySection } from "@/components/research/methodology-section";
import {
  ReportDownloads,
  downloadBlobAs,
} from "@/components/research/report-downloads";

interface DisabilityType {
  id: string;
  label: string;
  prevalence: number;
  ciLow: number;
  ciHigh: number;
  adults: number;
  sampleSize: number;
}

type TrendRow = { year: number } & Record<string, number | null>;

interface DisabilityData {
  lastUpdated: string;
  dataYear: number;
  types: DisabilityType[];
  trend: TrendRow[];
  source: {
    name: string;
    url: string;
    publisher: string;
    dataSource: string;
    measure: string;
    geography: string;
    license: string;
    infographic: string;
    description: string;
  };
}

const REPORT_URL =
  "https://accessibility.build/research/disability-statistics";

const SERIES = [
  { id: "cognitive", label: "Cognitive", color: "#0d9488" },
  { id: "mobility", label: "Mobility", color: "#d97706" },
  { id: "independent-living", label: "Independent living", color: "#7c3aed" },
  { id: "hearing", label: "Hearing", color: "#0284c7" },
  { id: "vision", label: "Vision", color: "#be123c" },
  { id: "self-care", label: "Self-care", color: "#65a30d" },
];

function TypesTable({
  types,
  dataYear,
}: {
  types: DisabilityType[];
  dataYear: number;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <caption className="sr-only">
          Age-adjusted prevalence of disability among United States adults in{" "}
          {dataYear}, by disability type, with 95% confidence intervals and
          estimated population
        </caption>
        <thead>
          <tr className="border-b border-slate-300 dark:border-slate-700">
            <th scope="col" className="px-3 py-3 text-left font-semibold">
              Disability type
            </th>
            <th scope="col" className="px-3 py-3 text-right font-semibold">
              Prevalence
            </th>
            <th scope="col" className="px-3 py-3 text-right font-semibold">
              95% CI
            </th>
            <th scope="col" className="px-3 py-3 text-right font-semibold">
              Adults
            </th>
          </tr>
        </thead>
        <tbody>
          {types.map((type) => (
            <tr
              key={type.id}
              className="border-b border-slate-200 last:border-0 dark:border-slate-800"
            >
              <th
                scope="row"
                className="px-3 py-3 text-left font-medium text-slate-900 dark:text-white"
              >
                {type.label}
              </th>
              <td className="px-3 py-3 text-right font-semibold tabular-nums">
                {type.prevalence}%
              </td>
              <td className="px-3 py-3 text-right tabular-nums text-slate-600 dark:text-slate-400">
                {type.ciLow} to {type.ciHigh}
              </td>
              <td className="px-3 py-3 text-right tabular-nums text-slate-600 dark:text-slate-400">
                {type.adults.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TrendTable({ trend }: { trend: TrendRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px] border-collapse text-sm">
        <caption className="sr-only">
          Age-adjusted prevalence of disability among United States adults by
          year and disability type, 2016 to 2022. The 2020 figures reflect a
          pandemic-related change in survey data collection.
        </caption>
        <thead>
          <tr className="border-b border-slate-300 dark:border-slate-700">
            <th scope="col" className="px-3 py-3 text-left font-semibold">
              Year
            </th>
            <th scope="col" className="px-3 py-3 text-right font-semibold">
              Any
            </th>
            {SERIES.map((series) => (
              <th
                key={series.id}
                scope="col"
                className="px-3 py-3 text-right font-semibold"
              >
                {series.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {trend.map((row) => (
            <tr
              key={row.year}
              className="border-b border-slate-200 last:border-0 dark:border-slate-800"
            >
              <th
                scope="row"
                className="px-3 py-3 text-left font-medium text-slate-900 dark:text-white"
              >
                {row.year}
                {row.year === 2020 && (
                  <span className="ml-1 text-xs font-normal text-amber-700 dark:text-amber-300">
                    (collection change)
                  </span>
                )}
              </th>
              <td className="px-3 py-3 text-right font-semibold tabular-nums">
                {row.any}%
              </td>
              {SERIES.map((series) => (
                <td
                  key={series.id}
                  className="px-3 py-3 text-right tabular-nums text-slate-600 dark:text-slate-400"
                >
                  {row[series.id]}%
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DisabilityStatisticsClient({
  initialData,
}: {
  initialData: DisabilityData;
}) {
  const data = initialData;
  const byType = useMemo(
    () => data.types.filter((type) => type.id !== "any"),
    [data.types],
  );
  const any = data.types.find((type) => type.id === "any");
  const cognitive = data.types.find((type) => type.id === "cognitive");
  const first = data.trend[0];
  const last = data.trend[data.trend.length - 1];

  const handleDownloadCSV = () => {
    const rows = [
      "US DISABILITY PREVALENCE",
      `Reviewed,${data.lastUpdated}`,
      `Data year,${data.dataYear}`,
      `Measure,${data.source.measure}`,
      `Source,${data.source.name},${data.source.url}`,
      "",
      `PREVALENCE BY TYPE (${data.dataYear})`,
      "Type,Prevalence percent,CI low,CI high,Adults",
      ...data.types.map(
        (type) =>
          `"${type.label}",${type.prevalence},${type.ciLow},${type.ciHigh},${type.adults}`,
      ),
      "",
      "TREND BY YEAR",
      `Year,Any,${SERIES.map((s) => s.label).join(",")}`,
      ...data.trend.map(
        (row) =>
          `${row.year},${row.any},${SERIES.map((s) => row[s.id]).join(",")}`,
      ),
    ];
    downloadBlobAs(
      new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" }),
      "us-disability-prevalence.csv",
    );
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("US Disability Prevalence", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(90);
    doc.text(
      `${data.source.measure}, adults 18 and over | Data year ${data.dataYear}`,
      14,
      28,
    );

    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text(`Prevalence by type (${data.dataYear})`, 14, 40);
    autoTable(doc, {
      startY: 44,
      head: [["Type", "Prevalence", "95% CI", "Adults"]],
      body: data.types.map((type) => [
        type.label,
        `${type.prevalence}%`,
        `${type.ciLow} to ${type.ciHigh}`,
        type.adults.toLocaleString(),
      ]),
      theme: "striped",
      headStyles: { fillColor: [15, 118, 110] },
      margin: { left: 14, right: 14 },
    });

    const mid =
      (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable
        ?.finalY ?? 110;
    doc.setFontSize(12);
    doc.text("Trend by year", 14, mid + 12);
    autoTable(doc, {
      startY: mid + 16,
      head: [["Year", "Any", ...SERIES.map((s) => s.label)]],
      body: data.trend.map((row) => [
        String(row.year),
        `${row.any}%`,
        ...SERIES.map((s) => `${row[s.id]}%`),
      ]),
      theme: "striped",
      headStyles: { fillColor: [15, 118, 110] },
      margin: { left: 14, right: 14 },
      styles: { fontSize: 8 },
    });

    const end =
      (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable
        ?.finalY ?? 200;
    doc.setTextColor(70);
    doc.setFontSize(9);
    doc.text(
      doc.splitTextToSize(
        `Source: ${data.source.name} (${data.source.dataSource}), ${data.source.publisher}. ${data.source.url} Public domain. The 2020 estimates reflect a pandemic-related change in survey data collection and should not be read as a real decline.`,
        180,
      ),
      14,
      Math.min(end + 12, 268),
    );
    doc.save("us-disability-prevalence.pdf");
  };

  return (
    <div className="space-y-14 sm:space-y-16">
      <section
        id="types"
        aria-labelledby="types-heading"
        className="scroll-mt-40"
      >
        <ChartSection
          title={`Prevalence by disability type, ${data.dataYear}`}
          titleId="types-heading"
          headingLevel={2}
          description={`${data.source.measure} among United States adults aged 18 and over. Categories overlap, because a person can report more than one type.`}
          insight={`Cognitive disability is now the most commonly reported type at ${cognitive?.prevalence}%, ahead of mobility. That ordering matters for the web: cognitive and learning disabilities are the least well served by the checklist-driven approach most teams take, and the hardest to catch with automated testing.`}
          source={data.source.name}
          sourceUrl={data.source.url}
          dataTable={<TypesTable types={data.types} dataYear={data.dataYear} />}
          downloadData={{
            filename: `us-disability-prevalence-${data.dataYear}`,
            data: data.types.map((type) => ({
              Type: type.label,
              "Prevalence percent": type.prevalence,
              "CI low": type.ciLow,
              "CI high": type.ciHigh,
              Adults: type.adults,
            })),
          }}
        >
          <div className="space-y-3 md:hidden">
            {byType.map((type) => (
              <div key={type.id}>
                <div className="mb-1.5 flex items-start justify-between gap-3 text-sm">
                  <span className="font-medium text-slate-900 dark:text-white">
                    {type.label}
                  </span>
                  <span className="shrink-0 font-semibold tabular-nums">
                    {type.prevalence}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-teal-600 dark:bg-teal-400"
                    style={{ width: `${(type.prevalence / 15) * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {type.adults.toLocaleString()} adults
                </p>
              </div>
            ))}
          </div>

          <div
            className="hidden h-[340px] md:block"
            role="img"
            aria-label={`Bar chart of disability prevalence among United States adults in ${data.dataYear}. Cognitive is highest at ${cognitive?.prevalence}%, followed by mobility at 12.2%, independent living at 7.7%, hearing at 6.2%, vision at 5.5%, and self-care at 3.6%.`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={byType}
                margin={{ top: 10, right: 20, left: 5, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-slate-200 dark:stroke-slate-700"
                />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "currentColor", fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fill: "currentColor", fontSize: 12 }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0].payload as DisabilityType;
                    return (
                      <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg dark:border-slate-700 dark:bg-slate-900">
                        <p className="font-medium text-slate-950 dark:text-white">
                          {label}
                        </p>
                        <p className="text-slate-600 dark:text-slate-300">
                          {row.prevalence}% of adults
                        </p>
                        <p className="text-slate-500 dark:text-slate-400">
                          {row.adults.toLocaleString()} people
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="prevalence" radius={[4, 4, 0, 0]}>
                  {byType.map((type) => (
                    <Cell
                      key={type.id}
                      fill={type.id === "cognitive" ? "#0f766e" : "#0d9488"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartSection>
      </section>

      <section
        id="trend"
        aria-labelledby="trend-heading"
        className="scroll-mt-40"
      >
        <ChartSection
          title="Seven years of change"
          titleId="trend-heading"
          headingLevel={2}
          description="Age-adjusted prevalence by disability type, 2016 to 2022."
          insight={`Reported disability rose from ${first.any}% to ${last.any}% of United States adults over this period, and cognitive disability drove most of it, climbing from ${first.cognitive}% to ${last.cognitive}%. Mobility, by contrast, is roughly flat. The 2020 dip across every series is a survey artifact, not a real fall.`}
          source={data.source.name}
          sourceUrl={data.source.url}
          dataTable={<TrendTable trend={data.trend} />}
          downloadData={{
            filename: "us-disability-prevalence-trend",
            data: data.trend.map((row) => ({
              Year: row.year,
              Any: row.any,
              ...Object.fromEntries(
                SERIES.map((series) => [series.label, row[series.id]]),
              ),
            })),
          }}
        >
          <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-slate-700 dark:border-amber-900 dark:bg-amber-950/25 dark:text-slate-300">
            <strong className="font-semibold">Read 2020 with care.</strong> Every
            series dips in 2020 and recovers in 2021. That reflects a
            pandemic-related change in how the BRFSS survey was collected, not a
            year in which fewer Americans had disabilities. The shaded band on
            the chart marks it.
          </div>

          <div
            className="h-[400px]"
            role="img"
            aria-label={`Line chart of disability prevalence among United States adults from 2016 to 2022 by type. Cognitive disability rises from ${first.cognitive}% to ${last.cognitive}% and is the largest increase. All series dip in 2020 because of a change in survey data collection, then recover.`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data.trend}
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
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fill: "currentColor", fontSize: 12 }}
                />
                <ReferenceArea
                  x1={2019.6}
                  x2={2020.4}
                  fill="#d97706"
                  fillOpacity={0.12}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg dark:border-slate-700 dark:bg-slate-900">
                        <p className="mb-1 font-medium text-slate-950 dark:text-white">
                          {label}
                          {label === 2020 ? " (collection change)" : ""}
                        </p>
                        {payload.map((entry) => (
                          <p
                            key={String(entry.name)}
                            style={{ color: entry.color as string }}
                          >
                            {entry.name}: {entry.value}%
                          </p>
                        ))}
                      </div>
                    );
                  }}
                />
                <Legend />
                {SERIES.map((series) => (
                  <Line
                    key={series.id}
                    type="monotone"
                    dataKey={series.id}
                    name={series.label}
                    stroke={series.color}
                    strokeWidth={series.id === "cognitive" ? 3 : 2}
                    dot={{ r: 3 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartSection>
      </section>

      <section
        id="interpretation"
        aria-labelledby="interpretation-heading"
        className="scroll-mt-40"
      >
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">
            Interpretation
          </p>
          <h2
            id="interpretation-heading"
            className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white"
          >
            What this means for the web
          </h2>
          <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
            Accessibility work still skews heavily toward screen reader support.
            The prevalence data does not.
          </p>
        </div>

        <div className="mt-7 grid gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 dark:border-slate-800 dark:bg-slate-800 lg:grid-cols-3">
          <article className="bg-white p-6 dark:bg-slate-950">
            <Brain
              className="h-5 w-5 text-teal-700 dark:text-teal-300"
              aria-hidden="true"
            />
            <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
              Cognitive is the largest category
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {cognitive?.prevalence}% of adults, roughly{" "}
              {(cognitive ? cognitive.adults / 1_000_000 : 0).toFixed(0)} million
              people, and the fastest growing. Yet cognitive accessibility is
              the area with the fewest testable success criteria and almost no
              automated coverage. Plain language, consistent navigation,
              generous timeouts, and forgiving forms matter more than any ARIA
              attribute here.
            </p>
          </article>
          <article className="bg-white p-6 dark:bg-slate-950">
            <Eye
              className="h-5 w-5 text-teal-700 dark:text-teal-300"
              aria-hidden="true"
            />
            <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
              Vision is the smallest of the big five
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              At 5.5% it is real and it matters, but it is smaller than
              cognitive, mobility, independent living, and hearing. Most people
              in this group have low vision rather than blindness, so contrast,
              text resizing, and reflow do more good than screen reader support
              alone.
            </p>
          </article>
          <article className="bg-white p-6 dark:bg-slate-950">
            <TriangleAlert
              className="h-5 w-5 text-teal-700 dark:text-teal-300"
              aria-hidden="true"
            />
            <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
              These categories overlap
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              The type percentages sum to more than {any?.prevalence}% because a
              person can report several. Never add them together to produce a
              total, and be careful with any source that does.
            </p>
          </article>
        </div>

        <p className="mt-6 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
          For the criteria that serve these groups, see{" "}
          <NextLink
            href="/wcag/1-4-3"
            className="font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-300"
          >
            1.4.3 Contrast
          </NextLink>{" "}
          and{" "}
          <NextLink
            href="/wcag/1-4-10"
            className="font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-300"
          >
            1.4.10 Reflow
          </NextLink>{" "}
          for low vision,{" "}
          <NextLink
            href="/wcag/3-3-7"
            className="font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-300"
          >
            3.3.7 Redundant Entry
          </NextLink>{" "}
          and{" "}
          <NextLink
            href="/wcag/3-2-3"
            className="font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-300"
          >
            3.2.3 Consistent Navigation
          </NextLink>{" "}
          for cognitive load,{" "}
          <NextLink
            href="/guides/accessible-video-player"
            className="font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-300"
          >
            captions and transcripts
          </NextLink>{" "}
          for hearing, and{" "}
          <NextLink
            href="/guides/keyboard-accessibility"
            className="font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-300"
          >
            keyboard accessibility
          </NextLink>{" "}
          for motor disabilities.
        </p>
      </section>

      <MethodologySection
        id="methodology"
        title="Methodology and limitations"
        summary="What age-adjusted prevalence means and how to quote these figures safely."
        headingLevel={2}
        defaultExpanded
        dataSources={[
          {
            name: data.source.name,
            url: data.source.url,
            description: data.source.description,
          },
        ]}
        sampleSize={`BRFSS survey responses; ${any?.sampleSize.toLocaleString()} unweighted respondents for the any-disability estimate in ${data.dataYear}`}
        dateRange={`${data.trend[0].year} to ${data.dataYear}`}
        limitations={[
          "Figures are age-adjusted prevalence, which standardises for the age structure of the population so years can be compared. They are not raw counts of people, and they will not match crude prevalence figures from other sources.",
          "BRFSS is a self-report telephone survey of non-institutionalised adults aged 18 and over. People in nursing homes, prisons, and other institutions are not represented, and children are excluded entirely.",
          "Disability types overlap. A person can report several, so the type percentages must never be summed into a total.",
          "The 2020 estimates reflect a pandemic-related change in survey data collection and should not be read as a real decline in disability prevalence.",
          "The latest available data year is 2022, even though the dataset and CDC pages have been reviewed more recently. Check for a newer year before quoting these as current.",
          "Geography is United States, DC and Territories. Individual state estimates are available in the source dataset but are not reproduced here.",
        ]}
        lastUpdated={data.lastUpdated}
      />

      <ReportDownloads
        reportUrl={REPORT_URL}
        citation={`Accessibility.build. (2026). US Disability Prevalence. ${REPORT_URL}`}
        description="The PDF contains the prevalence table and the full trend series. The CSV contains one row per disability type and one per year."
        onDownloadPdf={handleDownloadPDF}
        onDownloadCsv={handleDownloadCSV}
        primaryDatasetUrl={data.source.url}
        intro="This is public domain data from the CDC. Cite the Centers for Disease Control and Prevention alongside our analysis."
      />
    </div>
  );
}
