"use client";

import { useMemo } from "react";
import NextLink from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ClipboardCheck, ShoppingCart, TriangleAlert } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ChartSection } from "@/components/research/chart-section";
import { MethodologySection } from "@/components/research/methodology-section";
import {
  ReportDownloads,
  downloadBlobAs,
} from "@/components/research/report-downloads";

interface Distribution {
  level: string;
  agencies: number;
  percent: number;
}

interface Factor {
  id: string;
  label: string;
  description: string;
  distribution: Distribution[];
  percentLowOrVeryLow: number;
  percentHighOrVeryHigh: number;
}

interface Agency {
  name: string;
  size: string;
  conformance: string;
  implementation: string;
}

interface Section508Data {
  lastUpdated: string;
  fiscalYear: string;
  totalAgencies: number;
  levels: string[];
  factors: Factor[];
  agencies: Agency[];
  source: {
    name: string;
    url: string;
    published: string;
    publisher: string;
    dataFile: string;
    description: string;
  };
}

const REPORT_URL =
  "https://accessibility.build/research/section-508-assessment";

/** Ordered worst to best, so the stacked bars read left to right as improving. */
const LEVEL_FILL: Record<string, string> = {
  "Very Low": "#b45309",
  Low: "#d97706",
  Moderate: "#94a3b8",
  High: "#14b8a6",
  "Very High": "#0f766e",
};

function FactorTable({ factors, levels }: { factors: Factor[]; levels: string[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] border-collapse text-sm">
        <caption className="sr-only">
          Number of federal agencies at each maturity level for every Section
          508 assessment factor, from the FY2025 governmentwide assessment
        </caption>
        <thead>
          <tr className="border-b border-slate-300 dark:border-slate-700">
            <th scope="col" className="px-3 py-3 text-left font-semibold">
              Factor
            </th>
            {levels.map((level) => (
              <th
                key={level}
                scope="col"
                className="px-3 py-3 text-right font-semibold"
              >
                {level}
              </th>
            ))}
            <th scope="col" className="px-3 py-3 text-right font-semibold">
              Low or Very Low
            </th>
          </tr>
        </thead>
        <tbody>
          {factors.map((factor) => (
            <tr
              key={factor.id}
              className="border-b border-slate-200 last:border-0 dark:border-slate-800"
            >
              <th
                scope="row"
                className="px-3 py-3 text-left font-medium text-slate-900 dark:text-white"
              >
                {factor.label}
              </th>
              {levels.map((level) => {
                const cell = factor.distribution.find((d) => d.level === level);
                return (
                  <td
                    key={level}
                    className="px-3 py-3 text-right tabular-nums text-slate-600 dark:text-slate-400"
                  >
                    {cell?.agencies ?? 0}{" "}
                    <span className="text-xs">({cell?.percent ?? 0}%)</span>
                  </td>
                );
              })}
              <td className="px-3 py-3 text-right font-semibold tabular-nums text-amber-700 dark:text-amber-300">
                {factor.percentLowOrVeryLow}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AgencyTable({ agencies }: { agencies: Agency[] }) {
  return (
    <div className="max-h-[520px] overflow-auto">
      <table className="w-full min-w-[620px] border-collapse text-sm">
        <caption className="sr-only">
          All {agencies.length} federal agencies in the FY2025 assessment with
          their Accessibility Conformance Index and Accessibility Implementation
          Index outcomes, ordered from lowest conformance to highest
        </caption>
        <thead className="sticky top-0 bg-white dark:bg-slate-950">
          <tr className="border-b border-slate-300 dark:border-slate-700">
            <th scope="col" className="px-3 py-3 text-left font-semibold">
              Agency
            </th>
            <th scope="col" className="px-3 py-3 text-left font-semibold">
              Conformance
            </th>
            <th scope="col" className="px-3 py-3 text-left font-semibold">
              Implementation
            </th>
          </tr>
        </thead>
        <tbody>
          {agencies.map((agency) => (
            <tr
              key={agency.name}
              className="border-b border-slate-200 last:border-0 dark:border-slate-800"
            >
              <th
                scope="row"
                className="px-3 py-3 text-left font-medium text-slate-900 dark:text-white"
              >
                {agency.name}
              </th>
              <td className="px-3 py-3 text-slate-600 dark:text-slate-400">
                {agency.conformance}
              </td>
              <td className="px-3 py-3 text-slate-600 dark:text-slate-400">
                {agency.implementation}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Section508Client({
  initialData,
}: {
  initialData: Section508Data;
}) {
  const data = initialData;

  const chartData = useMemo(
    () =>
      data.factors.map((factor) => {
        const row: Record<string, string | number> = { name: factor.label };
        factor.distribution.forEach((d) => {
          row[d.level] = d.agencies;
        });
        return row;
      }),
    [data.factors],
  );

  const conformance = data.factors.find((f) => f.id === "conformance");
  const testing = data.factors.find((f) => f.id === "testing");
  const acquisition = data.factors.find((f) => f.id === "acquisition");

  const handleDownloadCSV = () => {
    const rows = [
      `GOVERNMENTWIDE SECTION 508 ASSESSMENT ${data.fiscalYear}`,
      `Reviewed,${data.lastUpdated}`,
      `Agencies assessed,${data.totalAgencies}`,
      `Source,${data.source.name},${data.source.url}`,
      "",
      "FACTOR DISTRIBUTION",
      `Factor,${data.levels.join(",")},Percent Low or Very Low`,
      ...data.factors.map(
        (factor) =>
          `"${factor.label}",${data.levels
            .map(
              (level) =>
                factor.distribution.find((d) => d.level === level)?.agencies ??
                0,
            )
            .join(",")},${factor.percentLowOrVeryLow}`,
      ),
      "",
      "AGENCIES",
      "Agency,Conformance index,Implementation index",
      ...data.agencies.map(
        (agency) =>
          `"${agency.name}","${agency.conformance}","${agency.implementation}"`,
      ),
    ];
    downloadBlobAs(
      new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" }),
      `section-508-assessment-${data.fiscalYear.toLowerCase()}.csv`,
    );
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Section 508 Assessment ${data.fiscalYear}`, 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(90);
    doc.text(
      `${data.totalAgencies} federal agencies | Reviewed ${data.lastUpdated}`,
      14,
      28,
    );

    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text("Factor distribution (agencies)", 14, 40);
    autoTable(doc, {
      startY: 44,
      head: [["Factor", ...data.levels, "Low or Very Low"]],
      body: data.factors.map((factor) => [
        factor.label,
        ...data.levels.map((level) =>
          String(
            factor.distribution.find((d) => d.level === level)?.agencies ?? 0,
          ),
        ),
        `${factor.percentLowOrVeryLow}%`,
      ]),
      theme: "striped",
      headStyles: { fillColor: [15, 118, 110] },
      margin: { left: 14, right: 14 },
      styles: { fontSize: 8 },
    });

    doc.addPage();
    doc.setFontSize(12);
    doc.text("Agencies", 14, 20);
    autoTable(doc, {
      startY: 24,
      head: [["Agency", "Conformance", "Implementation"]],
      body: data.agencies.map((agency) => [
        agency.name,
        agency.conformance,
        agency.implementation,
      ]),
      theme: "striped",
      headStyles: { fillColor: [15, 118, 110] },
      margin: { left: 14, right: 14 },
      styles: { fontSize: 8 },
    });

    const end =
      (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable
        ?.finalY ?? 120;
    doc.setTextColor(70);
    doc.setFontSize(9);
    doc.text(
      doc.splitTextToSize(
        `Source: ${data.source.name}, ${data.source.publisher}, published ${data.source.published}. ${data.source.url} Percentages are computed from the published agency response data file. Self-reported by agencies.`,
        180,
      ),
      14,
      Math.min(end + 12, 270),
    );
    doc.save(`section-508-assessment-${data.fiscalYear.toLowerCase()}.pdf`);
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
                These scores are self-reported
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700 dark:text-slate-300">
                Agencies answer the assessment themselves. Nobody independently
                audits their websites, documents, or internal software to
                produce these ratings. That cuts in an uncomfortable direction:
                if anything, self-assessment tends to flatter, so the real
                picture is unlikely to be better than what agencies reported
                about themselves.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="factors"
        aria-labelledby="factors-heading"
        className="scroll-mt-40"
      >
        <ChartSection
          title="How agencies scored on each factor"
          titleId="factors-heading"
          headingLevel={2}
          description={`Number of the ${data.totalAgencies} assessed agencies at each maturity level, by assessment factor.`}
          insight={`The two index scores tell different stories. ${conformance?.percentLowOrVeryLow}% of agencies rated Low or Very Low on the Accessibility Conformance Index, which measures whether their ICT is actually accessible, while only ${data.factors.find((f) => f.id === "implementation")?.percentLowOrVeryLow}% rated that low on Implementation, which measures whether they have a programme in place. Having a programme is not the same as having accessible technology.`}
          source={data.source.name}
          sourceUrl={data.source.url}
          dataTable={<FactorTable factors={data.factors} levels={data.levels} />}
          downloadData={{
            filename: `section-508-factor-distribution-${data.fiscalYear.toLowerCase()}`,
            data: data.factors.map((factor) => ({
              Factor: factor.label,
              ...Object.fromEntries(
                data.levels.map((level) => [
                  level,
                  factor.distribution.find((d) => d.level === level)
                    ?.agencies ?? 0,
                ]),
              ),
              "Percent Low or Very Low": factor.percentLowOrVeryLow,
            })),
          }}
        >
          <div className="space-y-5 md:hidden">
            {data.factors.map((factor) => (
              <div key={factor.id}>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {factor.label}
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {factor.percentLowOrVeryLow}% Low or Very Low
                </p>
                <div className="mt-2 flex h-3 overflow-hidden rounded-full">
                  {factor.distribution.map((d) => (
                    <div
                      key={d.level}
                      style={{
                        width: `${(d.agencies / data.totalAgencies) * 100}%`,
                        backgroundColor: LEVEL_FILL[d.level],
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Bars run from Very Low on the left to Very High on the right. Open
              the data table for exact counts.
            </p>
          </div>

          <div
            className="hidden h-[420px] md:block"
            role="img"
            aria-label={`Stacked bar chart of Section 508 assessment factors. On the Accessibility Conformance Index, ${conformance?.percentLowOrVeryLow}% of agencies rated Low or Very Low. On Testing and Remediation, ${testing?.percentLowOrVeryLow}% rated Low or Very Low, the weakest factor. On Acquisition, ${acquisition?.percentHighOrVeryHigh}% rated High or Very High, the strongest.`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
                  width={190}
                  tick={{ fill: "currentColor", fontSize: 11 }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg dark:border-slate-700 dark:bg-slate-900">
                        <p className="mb-1 font-medium text-slate-950 dark:text-white">
                          {label}
                        </p>
                        {payload.map((entry) => (
                          <p
                            key={String(entry.name)}
                            className="text-slate-600 dark:text-slate-300"
                          >
                            {entry.name}: {entry.value} agencies
                          </p>
                        ))}
                      </div>
                    );
                  }}
                />
                <Legend />
                {data.levels.map((level) => (
                  <Bar
                    key={level}
                    dataKey={level}
                    stackId="a"
                    fill={LEVEL_FILL[level]}
                  />
                ))}
              </BarChart>
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
            Good at buying it, bad at checking it
          </h2>
          <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
            The factor scores form a clear shape. Agencies have largely
            succeeded at writing accessibility into policy and contracts. They
            have largely failed at verifying that what they bought and built
            actually works.
          </p>
        </div>

        <div className="mt-7 grid gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 dark:border-slate-800 dark:bg-slate-800 lg:grid-cols-3">
          <article className="bg-white p-6 dark:bg-slate-950">
            <ShoppingCart
              className="h-5 w-5 text-teal-700 dark:text-teal-300"
              aria-hidden="true"
            />
            <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
              Acquisition is the strongest factor
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {acquisition?.percentHighOrVeryHigh}% of agencies rated High or
              Very High on Acquisition, the best result of any factor. Putting
              Section 508 language into a solicitation is a paperwork exercise
              an agency controls completely, and it shows.
            </p>
          </article>
          <article className="bg-white p-6 dark:bg-slate-950">
            <ClipboardCheck
              className="h-5 w-5 text-teal-700 dark:text-teal-300"
              aria-hidden="true"
            />
            <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
              Testing is the weakest
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {testing?.percentLowOrVeryLow}% of agencies rated Low or Very Low
              on Testing and Remediation, the worst factor in the assessment.
              Testing requires trained staff, assistive technology, and time
              against real user journeys. That is where the effort collapses.
            </p>
          </article>
          <article className="bg-white p-6 dark:bg-slate-950">
            <TriangleAlert
              className="h-5 w-5 text-teal-700 dark:text-teal-300"
              aria-hidden="true"
            />
            <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
              A VPAT is not a test result
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Strong acquisition scores alongside weak testing scores suggest
              agencies are accepting vendor conformance claims without
              verifying them. A supplier&apos;s accessibility conformance report
              is a starting point for evaluation, not evidence of conformance.
            </p>
          </article>
        </div>

        <p className="mt-6 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
          If you are on the buying side of this, our{" "}
          <NextLink
            href="/procurement"
            className="font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-300"
          >
            accessible procurement guidance
          </NextLink>{" "}
          covers how to evaluate a conformance report, and the{" "}
          <NextLink
            href="/guides/how-to-audit-website-accessibility"
            className="font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-300"
          >
            audit guide
          </NextLink>{" "}
          covers what real verification involves. For the standard itself, see{" "}
          <NextLink
            href="/compliance/section-508"
            className="font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-300"
          >
            Section 508
          </NextLink>
          .
        </p>
      </section>

      <section
        id="agencies"
        aria-labelledby="agencies-heading"
        className="scroll-mt-40"
      >
        <ChartSection
          title="Every agency, scored"
          titleId="agencies-heading"
          headingLevel={2}
          description={`All ${data.totalAgencies} agencies with their Conformance and Implementation index outcomes, ordered from lowest conformance to highest.`}
          insight="Open the data table to find a specific agency. Conformance measures whether the ICT is accessible; Implementation measures whether the programme to deliver it exists."
          source={data.source.name}
          sourceUrl={data.source.url}
          dataTable={<AgencyTable agencies={data.agencies} />}
          downloadData={{
            filename: `section-508-agencies-${data.fiscalYear.toLowerCase()}`,
            data: data.agencies.map((agency) => ({
              Agency: agency.name,
              "Conformance index": agency.conformance,
              "Implementation index": agency.implementation,
            })),
          }}
        >
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
            The {data.totalAgencies} agencies break down as{" "}
            {conformance?.distribution
              .map((d) => `${d.agencies} ${d.level}`)
              .join(", ")}{" "}
            on the Accessibility Conformance Index. Select View data table below
            for the full list.
          </p>
        </ChartSection>
      </section>

      <MethodologySection
        id="methodology"
        title="Methodology and limitations"
        summary="Where the assessment comes from and what the index scores mean."
        headingLevel={2}
        defaultExpanded
        dataSources={[
          {
            name: data.source.name,
            url: data.source.url,
            description: data.source.description,
          },
        ]}
        sampleSize={`${data.totalAgencies} federal agencies`}
        dateRange={`${data.fiscalYear}, published ${data.source.published}`}
        limitations={[
          "Agencies self-report. No independent audit of agency websites, documents, or internal software produces these ratings.",
          "The Accessibility Conformance Index and Accessibility Implementation Index are maturity ratings on a five-point scale, not counts of WCAG failures. A Very High rating does not mean an agency's ICT is conformant.",
          "The percentages on this page are our own computation from the published agency response data file, not figures quoted from the GSA narrative report.",
          "Agency size and mission vary enormously across the 60 respondents, and the assessment does not weight by the number of people an agency serves.",
          "A correction issued on 30 July 2026 added missing data from five agencies. This page uses the corrected file.",
          "The assessment covers United States federal agencies only. It says nothing about state or local government, which fall under ADA Title II rather than Section 508.",
        ]}
        lastUpdated={data.lastUpdated}
      />

      <ReportDownloads
        reportUrl={REPORT_URL}
        citation={`Accessibility.build. (2026). Section 508 Assessment ${data.fiscalYear}: How Federal Agencies Scored. ${REPORT_URL}`}
        description="The PDF contains the factor distribution and the full agency list. The CSV contains one row per agency plus the factor breakdown."
        onDownloadPdf={handleDownloadPDF}
        onDownloadCsv={handleDownloadCSV}
        primaryDatasetUrl={data.source.dataFile}
        intro="This assessment is a United States Government work in the public domain. Cite the original alongside our analysis."
      />
    </div>
  );
}
