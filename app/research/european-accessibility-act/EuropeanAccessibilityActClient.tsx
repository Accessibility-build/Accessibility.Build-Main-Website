"use client";

import NextLink from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CircleCheck, CircleDot, Info, TriangleAlert } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ChartSection } from "@/components/research/chart-section";
import { MethodologySection } from "@/components/research/methodology-section";
import {
  ReportDownloads,
  downloadBlobAs,
} from "@/components/research/report-downloads";

interface KeyDate {
  date: string;
  label: string;
  article: string;
  quote: string;
  status: string;
  note?: string;
}

interface MeasureRow {
  country: string;
  code: string;
  measures: number;
}

interface EaaData {
  lastUpdated: string;
  directive: {
    title: string;
    shortName: string;
    celex: string;
    adopted: string;
    officialJournal: string;
    eli: string;
    textUrl: string;
    transpositionTrackerUrl: string;
    status: string;
  };
  keyDates: KeyDate[];
  otherTransitionalRules: { article: string; rule: string }[];
  transposition: {
    asOf: string;
    memberStatesReporting: number;
    totalMeasures: number;
    deadline: string;
    caveat: string;
    measures: MeasureRow[];
  };
  enforcementDataStatus: { officialDatasetExists: boolean; explanation: string };
}

const REPORT_URL =
  "https://accessibility.build/research/european-accessibility-act";

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

export function EuropeanAccessibilityActClient({
  initialData,
}: {
  initialData: EaaData;
}) {
  const data = initialData;
  const measures = data.transposition.measures;

  const handleDownloadCSV = () => {
    const rows = [
      "EUROPEAN ACCESSIBILITY ACT TRACKER",
      `Reviewed,${data.lastUpdated}`,
      `Directive,${data.directive.celex}`,
      `Source,EUR-Lex,${data.directive.transpositionTrackerUrl}`,
      "",
      "KEY DATES",
      "Date,Milestone,Article",
      ...data.keyDates.map(
        (item) => `${item.date},"${item.label}","${item.article}"`,
      ),
      "",
      "NATIONAL TRANSPOSITION MEASURES COMMUNICATED",
      "Country,Code,Measures",
      ...measures.map(
        (row) => `"${row.country}",${row.code},${row.measures}`,
      ),
      "",
      `Total,,${data.transposition.totalMeasures}`,
    ];
    downloadBlobAs(
      new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" }),
      "european-accessibility-act-tracker.csv",
    );
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(17);
    doc.text("European Accessibility Act Tracker", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(90);
    doc.text(`${data.directive.title.slice(0, 95)}`, 14, 28);
    doc.text(`${data.directive.officialJournal} | Reviewed ${data.lastUpdated}`, 14, 34);

    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text("Statutory timeline", 14, 46);
    autoTable(doc, {
      startY: 50,
      head: [["Date", "Milestone", "Article"]],
      body: data.keyDates.map((item) => [
        formatDate(item.date),
        item.label,
        item.article,
      ]),
      theme: "striped",
      headStyles: { fillColor: [15, 118, 110] },
      margin: { left: 14, right: 14 },
    });

    const mid =
      ((doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable
        ?.finalY ?? 110) + 12;
    doc.setFontSize(12);
    doc.text("National transposition measures communicated", 14, mid);
    autoTable(doc, {
      startY: mid + 4,
      head: [["Country", "Measures"]],
      body: measures.map((row) => [row.country, String(row.measures)]),
      theme: "striped",
      headStyles: { fillColor: [15, 118, 110] },
      margin: { left: 14, right: 14 },
      styles: { fontSize: 8 },
    });

    const end =
      (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable
        ?.finalY ?? 200;
    doc.setTextColor(70);
    doc.setFontSize(8);
    doc.text(
      doc.splitTextToSize(
        `${data.transposition.caveat} ${data.enforcementDataStatus.explanation}`,
        180,
      ),
      14,
      Math.min(end + 10, 255),
    );
    doc.save("european-accessibility-act-tracker.pdf");
  };

  return (
    <div className="space-y-14 sm:space-y-16">
      <section
        id="timeline"
        aria-labelledby="timeline-heading"
        className="scroll-mt-40"
      >
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">
            The statutory timeline
          </p>
          <h2
            id="timeline-heading"
            className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white"
          >
            Every date that is actually in the Directive
          </h2>
          <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
            Quoted from the text of Directive (EU) 2019/882 rather than
            paraphrased, because the dates circulating in vendor marketing are
            frequently wrong or missing their conditions.
          </p>
        </div>

        <ol className="mt-7 space-y-4">
          {data.keyDates.map((item) => (
            <li
              key={`${item.date}-${item.article}`}
              className="rounded-lg border border-slate-200 p-5 dark:border-slate-800"
            >
              <div className="flex flex-wrap items-center gap-3">
                {item.status === "past" ? (
                  <CircleCheck
                    className="h-5 w-5 shrink-0 text-teal-700 dark:text-teal-300"
                    aria-hidden="true"
                  />
                ) : (
                  <CircleDot
                    className="h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300"
                    aria-hidden="true"
                  />
                )}
                <p className="text-lg font-semibold text-slate-950 dark:text-white">
                  {formatDate(item.date)}
                </p>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {item.article}
                </span>
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {item.status === "past" ? "In effect" : "Upcoming"}
                </span>
              </div>
              <p className="mt-2 font-medium text-slate-900 dark:text-slate-100">
                {item.label}
              </p>
              <blockquote className="mt-2 border-l-2 border-teal-500 pl-3 text-sm italic leading-6 text-slate-600 dark:text-slate-400">
                {item.quote}
              </blockquote>
              {item.note && (
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {item.note}
                </p>
              )}
            </li>
          ))}
        </ol>

        <div className="mt-6 rounded-lg border border-slate-200 p-5 dark:border-slate-800">
          <h3 className="flex items-center gap-2 text-base font-semibold text-slate-950 dark:text-white">
            <Info
              className="h-4 w-4 text-teal-700 dark:text-teal-300"
              aria-hidden="true"
            />
            Two transitional rules people miss
          </h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            {data.otherTransitionalRules.map((rule) => (
              <li key={rule.article}>
                <span className="font-medium text-slate-900 dark:text-slate-200">
                  {rule.article}:
                </span>{" "}
                {rule.rule}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="enforcement"
        aria-labelledby="enforcement-heading"
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
                id="enforcement-heading"
                className="text-lg font-semibold text-slate-950 dark:text-white"
              >
                There is no EAA enforcement data, and there will not be until
                2030
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700 dark:text-slate-300">
                {data.enforcementDataStatus.explanation}
              </p>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700 dark:text-slate-300">
                We looked for this data and did not find it. Rather than fill
                the gap with vendor claims, we are telling you the gap exists.
                If you need enforcement intelligence for a specific market, go
                to that country&apos;s named market surveillance authority.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="transposition"
        aria-labelledby="transposition-heading"
        className="scroll-mt-40"
      >
        <ChartSection
          title="National transposition measures by Member State"
          titleId="transposition-heading"
          headingLevel={2}
          description={`Instruments each Member State has communicated to the Commission, as recorded by EUR-Lex on ${formatDate(data.transposition.asOf)}.`}
          insight={`All ${data.transposition.memberStatesReporting} Member States have now communicated transposition measures, ${data.transposition.totalMeasures} in total. The spread from ${measures[0].measures} to ${measures[measures.length - 1].measures} says almost nothing about effort or quality: it reflects whether a country transposed through one consolidated act or amended dozens of existing laws.`}
          source="EUR-Lex national transposition measures"
          sourceUrl={data.directive.transpositionTrackerUrl}
          dataTable={
            <div className="overflow-x-auto">
              <table className="w-full min-w-[440px] border-collapse text-sm">
                <caption className="sr-only">
                  Number of national transposition measures communicated to the
                  European Commission by each Member State for Directive (EU)
                  2019/882
                </caption>
                <thead>
                  <tr className="border-b border-slate-300 dark:border-slate-700">
                    <th
                      scope="col"
                      className="px-3 py-3 text-left font-semibold"
                    >
                      Member State
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-right font-semibold"
                    >
                      Measures communicated
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {measures.map((row) => (
                    <tr
                      key={row.code}
                      className="border-b border-slate-200 last:border-0 dark:border-slate-800"
                    >
                      <th
                        scope="row"
                        className="px-3 py-3 text-left font-medium text-slate-900 dark:text-white"
                      >
                        {row.country}
                      </th>
                      <td className="px-3 py-3 text-right font-semibold tabular-nums">
                        {row.measures}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
          downloadData={{
            filename: "eaa-transposition-measures",
            data: measures.map((row) => ({
              Country: row.country,
              Code: row.code,
              Measures: row.measures,
            })),
          }}
        >
          <div className="mb-4 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300">
            <strong className="font-semibold">A count is not a score.</strong>{" "}
            {data.transposition.caveat}
          </div>

          <div
            className="h-[620px]"
            role="img"
            aria-label={`Bar chart of national transposition measures communicated per Member State for the European Accessibility Act. ${measures[0].country} has communicated the most at ${measures[0].measures}, while Cyprus, Ireland and Malta have each communicated one. All 27 Member States have reported.`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={measures}
                layout="vertical"
                margin={{ top: 5, right: 40, left: 20, bottom: 5 }}
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
                  dataKey="country"
                  type="category"
                  width={110}
                  tick={{ fill: "currentColor", fontSize: 11 }}
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
                          {payload[0].value} measures communicated
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="measures" fill="#0d9488" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartSection>

        <p className="mt-6 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
          This page tracks the legal instrument. For what the EAA actually
          requires of a website or app, who is in scope, the small-business
          exemption, and the route to compliance through EN 301 549, see our{" "}
          <NextLink
            href="/compliance/eaa"
            className="font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-300"
          >
            European Accessibility Act compliance guide
          </NextLink>{" "}
          and the{" "}
          <NextLink
            href="/compliance/en-301-549"
            className="font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-300"
          >
            EN 301 549 standard guide
          </NextLink>
          . For every other jurisdiction, see the{" "}
          <NextLink
            href="/research/accessibility-laws"
            className="font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-300"
          >
            accessibility laws tracker
          </NextLink>
          .
        </p>
      </section>

      <MethodologySection
        id="methodology"
        title="Methodology and limitations"
        summary="Where each figure on this page comes from."
        headingLevel={2}
        defaultExpanded
        dataSources={[
          {
            name: "Directive (EU) 2019/882, consolidated text",
            url: data.directive.textUrl,
            description:
              "All dates and quoted obligations are taken from the text of the Directive on EUR-Lex, article by article, not from secondary summaries.",
          },
          {
            name: "EUR-Lex national transposition measures",
            url: data.directive.transpositionTrackerUrl,
            description:
              "Counts of national instruments communicated to the Commission by each Member State. EUR-Lex updates this collection as Member States notify measures.",
          },
        ]}
        sampleSize={`${data.transposition.memberStatesReporting} Member States, ${data.transposition.totalMeasures} communicated measures`}
        dateRange={`Directive adopted ${formatDate(data.directive.adopted)}; transposition data read ${formatDate(data.transposition.asOf)}`}
        limitations={[
          "Measure counts are the number of national instruments communicated, not a measure of implementation quality, completeness, or enforcement activity.",
          "EUR-Lex states that Member States bear sole responsibility for this information and that it does not prejudge the Commission's verification of the completeness and correctness of transposition.",
          "A Member State that transposed through one consolidated act will show a low count next to one that amended many existing laws. The counts are not comparable as effort or compliance.",
          "No official EU-wide compliance or enforcement dataset exists. Article 33(1) sets the first Commission report on application of the Directive at 28 June 2030.",
          "Claims about national enforcement activity circulating in vendor content could not be verified against primary regulatory sources and are deliberately excluded from this page.",
          "This tracker covers the Directive itself. Individual Member State implementing laws may impose additional or earlier obligations that are not reflected in these counts.",
        ]}
        lastUpdated={data.lastUpdated}
      />

      <ReportDownloads
        reportUrl={REPORT_URL}
        citation={`Accessibility.build. (2026). European Accessibility Act Tracker. ${REPORT_URL}`}
        description="The PDF contains the statutory timeline and the full Member State table. The CSV contains one row per Member State plus the key dates."
        onDownloadPdf={handleDownloadPDF}
        onDownloadCsv={handleDownloadCSV}
        primaryDatasetUrl={data.directive.transpositionTrackerUrl}
        intro="EUR-Lex content is reusable with acknowledgement of the source under the Commission's reuse policy. Keep the link to the Directive when publishing extracts."
      />
    </div>
  );
}
