"use client";

import NextLink from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Briefcase, Home, TrendingUp, TriangleAlert } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ChartSection } from "@/components/research/chart-section";
import { MethodologySection } from "@/components/research/methodology-section";
import {
  ReportDownloads,
  downloadBlobAs,
} from "@/components/research/report-downloads";

interface LocationRow {
  location: string;
  localAverage: string;
  averageUsd: number;
  medianUsd: number;
}
interface BandRow {
  band: string;
  averageUsd?: number;
  respondents?: number;
  percent?: number;
}
interface WorkLocationRow {
  mode: string;
  respondents: number;
  percent: number;
  averageUsd: number;
}
interface DisabilityRow {
  type: string;
  respondents: number;
  percent: number;
  averageUsd: number;
}
interface RoleRow {
  role: string;
  respondents: number;
  percent: number;
}

interface SalaryData {
  lastUpdated: string;
  surveyPeriod: string;
  responses: number;
  countriesRepresented: number;
  overall: {
    averageSalaryUsd: number;
    medianSalaryUsd: number;
    previousAverageUsd: number;
    previousYear: number;
    changeNote: string;
    averageYearsExperience: number;
    percentReportingDisability: number;
  };
  byLocation: LocationRow[];
  byExperience: BandRow[];
  experienceGapPercent: number;
  experienceDistribution: BandRow[];
  byWorkLocation: WorkLocationRow[];
  byOrgSize: BandRow[];
  byDisability: DisabilityRow[];
  byRole: RoleRow[];
  source: {
    name: string;
    url: string;
    published: string;
    publisher: string;
    description: string;
  };
}

const REPORT_URL =
  "https://accessibility.build/research/accessibility-salary";

const usd = (value: number) => `$${value.toLocaleString()}`;

function LocationTable({ rows }: { rows: LocationRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px] border-collapse text-sm">
        <caption className="sr-only">
          Average and median full-time digital accessibility salary by location,
          shown in local currency and converted to US dollars at January 2026
          rates
        </caption>
        <thead>
          <tr className="border-b border-slate-300 dark:border-slate-700">
            <th scope="col" className="px-3 py-3 text-left font-semibold">
              Location
            </th>
            <th scope="col" className="px-3 py-3 text-left font-semibold">
              Local average
            </th>
            <th scope="col" className="px-3 py-3 text-right font-semibold">
              Average (USD)
            </th>
            <th scope="col" className="px-3 py-3 text-right font-semibold">
              Median (USD)
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.location}
              className="border-b border-slate-200 last:border-0 dark:border-slate-800"
            >
              <th
                scope="row"
                className="px-3 py-3 text-left font-medium text-slate-900 dark:text-white"
              >
                {row.location}
              </th>
              <td className="px-3 py-3 text-slate-600 dark:text-slate-400">
                {row.localAverage}
              </td>
              <td className="px-3 py-3 text-right font-semibold tabular-nums">
                {usd(row.averageUsd)}
              </td>
              <td className="px-3 py-3 text-right tabular-nums text-slate-600 dark:text-slate-400">
                {usd(row.medianUsd)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AccessibilitySalaryClient({
  initialData,
}: {
  initialData: SalaryData;
}) {
  const data = initialData;
  const remote = data.byWorkLocation.find((row) => row.mode === "Remote");
  const office = data.byWorkLocation.find((row) => row.mode === "In office");
  const junior = data.byExperience[0];
  const senior = data.byExperience[1];

  const handleDownloadCSV = () => {
    const rows = [
      "DIGITAL ACCESSIBILITY SALARY REPORT",
      `Reviewed,${data.lastUpdated}`,
      `Survey period,${data.surveyPeriod}`,
      `Responses,${data.responses}`,
      `Average full-time salary USD,${data.overall.averageSalaryUsd}`,
      `Median full-time salary USD,${data.overall.medianSalaryUsd}`,
      `Source,${data.source.name},${data.source.url}`,
      "",
      "BY LOCATION",
      "Location,Local average,Average USD,Median USD",
      ...data.byLocation.map(
        (row) =>
          `"${row.location}","${row.localAverage}",${row.averageUsd},${row.medianUsd}`,
      ),
      "",
      "BY WORK LOCATION",
      "Mode,Respondents,Percent,Average USD",
      ...data.byWorkLocation.map(
        (row) =>
          `"${row.mode}",${row.respondents},${row.percent},${row.averageUsd}`,
      ),
      "",
      "BY EXPERIENCE",
      "Band,Average USD",
      ...data.byExperience.map((row) => `"${row.band}",${row.averageUsd}`),
      "",
      "BY REPORTED DISABILITY",
      "Type,Respondents,Percent,Average USD",
      ...data.byDisability.map(
        (row) =>
          `"${row.type}",${row.respondents},${row.percent},${row.averageUsd}`,
      ),
      "",
      "BY ROLE",
      "Role,Respondents,Percent",
      ...data.byRole.map(
        (row) => `"${row.role}",${row.respondents},${row.percent}`,
      ),
    ];
    downloadBlobAs(
      new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" }),
      "digital-accessibility-salary-2026.csv",
    );
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Digital Accessibility Salary Report", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(90);
    doc.text(
      `${data.responses} responses, ${data.countriesRepresented} countries | Survey ${data.surveyPeriod}`,
      14,
      28,
    );
    doc.text(
      `Average ${usd(data.overall.averageSalaryUsd)} | Median ${usd(data.overall.medianSalaryUsd)}`,
      14,
      34,
    );

    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text("By location", 14, 46);
    autoTable(doc, {
      startY: 50,
      head: [["Location", "Local average", "Average USD", "Median USD"]],
      body: data.byLocation.map((row) => [
        row.location,
        row.localAverage,
        usd(row.averageUsd),
        usd(row.medianUsd),
      ]),
      theme: "striped",
      headStyles: { fillColor: [15, 118, 110] },
      margin: { left: 14, right: 14 },
    });

    let cursor =
      ((doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable
        ?.finalY ?? 110) + 12;
    doc.setFontSize(12);
    doc.text("By work location and experience", 14, cursor);
    autoTable(doc, {
      startY: cursor + 4,
      head: [["Segment", "Average USD"]],
      body: [
        ...data.byWorkLocation.map((row) => [row.mode, usd(row.averageUsd)]),
        ...data.byExperience.map((row) => [
          row.band,
          usd(row.averageUsd ?? 0),
        ]),
        ...data.byOrgSize.map((row) => [row.band, usd(row.averageUsd ?? 0)]),
      ],
      theme: "striped",
      headStyles: { fillColor: [15, 118, 110] },
      margin: { left: 14, right: 14 },
    });

    cursor =
      ((doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable
        ?.finalY ?? 200) + 12;
    doc.setTextColor(70);
    doc.setFontSize(9);
    doc.text(
      doc.splitTextToSize(
        `Source: ${data.source.name}, ${data.source.publisher}, published ${data.source.published}. ${data.source.url} ${data.overall.changeNote}`,
        180,
      ),
      14,
      Math.min(cursor, 265),
    );
    doc.save("digital-accessibility-salary-2026.pdf");
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
                The average fell, but pay probably did not
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700 dark:text-slate-300">
                The reported average dropped from{" "}
                {usd(data.overall.previousAverageUsd)} in{" "}
                {data.overall.previousYear} to{" "}
                {usd(data.overall.averageSalaryUsd)}. {data.overall.changeNote}{" "}
                With {data.responses} uncontrolled responses, the composition of
                who answered moves the average more than the market does. Do not
                report this as a pay cut.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="location"
        aria-labelledby="location-heading"
        className="scroll-mt-40"
      >
        <ChartSection
          title="Pay by country"
          titleId="location-heading"
          headingLevel={2}
          description="Average full-time salary converted to US dollars at January 2026 rates, for locations with more than ten respondents."
          insight={`United States respondents reported the highest average at ${usd(data.byLocation[0].averageUsd)}, roughly 46% above the United Kingdom and the European Union. Currency conversion does a lot of work here: Australian salaries look high in local terms and land mid-table once converted.`}
          source={data.source.name}
          sourceUrl={data.source.url}
          dataTable={<LocationTable rows={data.byLocation} />}
          downloadData={{
            filename: "accessibility-salary-by-location-2026",
            data: data.byLocation.map((row) => ({
              Location: row.location,
              "Local average": row.localAverage,
              "Average USD": row.averageUsd,
              "Median USD": row.medianUsd,
            })),
          }}
        >
          <div
            className="h-[320px]"
            role="img"
            aria-label={`Bar chart of average full-time digital accessibility salary in US dollars by location. United States ${usd(data.byLocation[0].averageUsd)}, Australia ${usd(data.byLocation[1].averageUsd)}, Canada ${usd(data.byLocation[2].averageUsd)}, United Kingdom ${usd(data.byLocation[3].averageUsd)}, European Union ${usd(data.byLocation[4].averageUsd)}.`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.byLocation}
                layout="vertical"
                margin={{ top: 5, right: 70, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  className="stroke-slate-200 dark:stroke-slate-700"
                />
                <XAxis
                  type="number"
                  tickFormatter={(value) => `$${value / 1000}k`}
                  tick={{ fill: "currentColor", fontSize: 12 }}
                />
                <YAxis
                  dataKey="location"
                  type="category"
                  width={130}
                  tick={{ fill: "currentColor", fontSize: 12 }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0].payload as LocationRow;
                    return (
                      <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg dark:border-slate-700 dark:bg-slate-900">
                        <p className="font-medium text-slate-950 dark:text-white">
                          {label}
                        </p>
                        <p className="text-slate-600 dark:text-slate-300">
                          Average {usd(row.averageUsd)}
                        </p>
                        <p className="text-slate-600 dark:text-slate-300">
                          Median {usd(row.medianUsd)}
                        </p>
                        <p className="text-slate-500 dark:text-slate-400">
                          Local: {row.localAverage}
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="averageUsd" radius={[0, 4, 4, 0]}>
                  {data.byLocation.map((row) => (
                    <Cell key={row.location} fill="#0d9488" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartSection>
      </section>

      <section
        id="drivers"
        aria-labelledby="drivers-heading"
        className="scroll-mt-40"
      >
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">
            Interpretation
          </p>
          <h2
            id="drivers-heading"
            className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white"
          >
            What actually moves the number
          </h2>
          <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
            Three variables separate the top of this market from the bottom, and
            none of them is a certification.
          </p>
        </div>

        <div className="mt-7 grid gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 dark:border-slate-800 dark:bg-slate-800 lg:grid-cols-3">
          <article className="bg-white p-6 dark:bg-slate-950">
            <TrendingUp
              className="h-5 w-5 text-teal-700 dark:text-teal-300"
              aria-hidden="true"
            />
            <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
              Ten years is the cliff
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Respondents with more than ten years of experience averaged{" "}
              {usd(senior?.averageUsd ?? 0)} against{" "}
              {usd(junior?.averageUsd ?? 0)} for ten years or fewer, a{" "}
              {data.experienceGapPercent}% gap. Two thirds of the field sits
              below that line, which is what you would expect of a discipline
              still growing quickly.
            </p>
          </article>
          <article className="bg-white p-6 dark:bg-slate-950">
            <Home
              className="h-5 w-5 text-teal-700 dark:text-teal-300"
              aria-hidden="true"
            />
            <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
              Remote pays more
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Fully remote respondents averaged {usd(remote?.averageUsd ?? 0)}{" "}
              against {usd(office?.averageUsd ?? 0)} in office, about 31% higher.{" "}
              {remote && office
                ? `${(remote.percent + (data.byWorkLocation.find((r) => r.mode === "Hybrid")?.percent ?? 0)).toFixed(1)}%`
                : ""}{" "}
              of the field works remote or hybrid. Read the gap as remote roles
              skewing senior and US-based rather than as a premium for staying
              home.
            </p>
          </article>
          <article className="bg-white p-6 dark:bg-slate-950">
            <Briefcase
              className="h-5 w-5 text-teal-700 dark:text-teal-300"
              aria-hidden="true"
            />
            <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
              Big organisations pay more
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {usd(data.byOrgSize[1].averageUsd ?? 0)} at organisations with
              10,000 or more employees against{" "}
              {usd(data.byOrgSize[0].averageUsd ?? 0)} at those under 100. Large
              organisations are also the ones with legal exposure and dedicated
              accessibility teams.
            </p>
          </article>
        </div>

        <p className="mt-6 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
          {data.overall.percentReportingDisability}% of respondents reported
          having a disability, far above the general population, and
          neurodivergent respondents were the single largest group. This is a
          field substantially staffed by the people it serves. If you are
          building a career here, the{" "}
          <NextLink
            href="/guides/how-to-audit-website-accessibility"
            className="font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-300"
          >
            audit guide
          </NextLink>{" "}
          and the{" "}
          <NextLink
            href="/guides/screen-reader-testing"
            className="font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-300"
          >
            screen reader testing guide
          </NextLink>{" "}
          cover the skills that show up in senior job descriptions.
        </p>
      </section>

      <section
        id="segments"
        aria-labelledby="segments-heading"
        className="scroll-mt-40"
      >
        <ChartSection
          title="Pay by segment"
          titleId="segments-heading"
          headingLevel={2}
          description="Average full-time salary in US dollars across experience, work location, and organisation size."
          insight="Experience separates this market more than geography does within a single country. The gap between under and over ten years is larger than the gap between the United Kingdom and the European Union."
          source={data.source.name}
          sourceUrl={data.source.url}
          dataTable={
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-sm">
                <caption className="sr-only">
                  Average full-time digital accessibility salary in US dollars by
                  experience band, work location, and organisation size
                </caption>
                <thead>
                  <tr className="border-b border-slate-300 dark:border-slate-700">
                    <th
                      scope="col"
                      className="px-3 py-3 text-left font-semibold"
                    >
                      Segment
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left font-semibold"
                    >
                      Group
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-right font-semibold"
                    >
                      Average (USD)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ...data.byExperience.map((row) => ({
                      segment: "Experience",
                      group: row.band,
                      value: row.averageUsd ?? 0,
                    })),
                    ...data.byWorkLocation.map((row) => ({
                      segment: "Work location",
                      group: row.mode,
                      value: row.averageUsd,
                    })),
                    ...data.byOrgSize.map((row) => ({
                      segment: "Organisation size",
                      group: row.band,
                      value: row.averageUsd ?? 0,
                    })),
                  ].map((row) => (
                    <tr
                      key={`${row.segment}-${row.group}`}
                      className="border-b border-slate-200 last:border-0 dark:border-slate-800"
                    >
                      <td className="px-3 py-3 text-slate-500 dark:text-slate-400">
                        {row.segment}
                      </td>
                      <th
                        scope="row"
                        className="px-3 py-3 text-left font-medium text-slate-900 dark:text-white"
                      >
                        {row.group}
                      </th>
                      <td className="px-3 py-3 text-right font-semibold tabular-nums">
                        {usd(row.value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
          downloadData={{
            filename: "accessibility-salary-by-segment-2026",
            data: [
              ...data.byExperience.map((row) => ({
                Segment: "Experience",
                Group: row.band,
                "Average USD": row.averageUsd,
              })),
              ...data.byWorkLocation.map((row) => ({
                Segment: "Work location",
                Group: row.mode,
                "Average USD": row.averageUsd,
              })),
              ...data.byOrgSize.map((row) => ({
                Segment: "Organisation size",
                Group: row.band,
                "Average USD": row.averageUsd,
              })),
            ],
          }}
        >
          <div
            className="h-[330px]"
            role="img"
            aria-label={`Bar chart comparing average salary by segment. Over ten years experience ${usd(senior?.averageUsd ?? 0)} against ten or fewer ${usd(junior?.averageUsd ?? 0)}. Remote ${usd(remote?.averageUsd ?? 0)} against in office ${usd(office?.averageUsd ?? 0)}.`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  ...data.byExperience.map((row) => ({
                    name: row.band,
                    value: row.averageUsd ?? 0,
                  })),
                  ...data.byWorkLocation.map((row) => ({
                    name: row.mode,
                    value: row.averageUsd,
                  })),
                ]}
                layout="vertical"
                margin={{ top: 5, right: 70, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  className="stroke-slate-200 dark:stroke-slate-700"
                />
                <XAxis
                  type="number"
                  tickFormatter={(value) => `$${value / 1000}k`}
                  tick={{ fill: "currentColor", fontSize: 12 }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={150}
                  tick={{ fill: "currentColor", fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value: number) => usd(value)}
                  contentStyle={{ fontSize: 13 }}
                />
                <Bar dataKey="value" fill="#0d9488" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartSection>
      </section>

      <MethodologySection
        id="methodology"
        title="Methodology and limitations"
        summary="Who answered, and why the sample matters more than usual here."
        headingLevel={2}
        defaultExpanded
        dataSources={[
          {
            name: data.source.name,
            url: data.source.url,
            description: data.source.description,
          },
        ]}
        sampleSize={`${data.responses} responses across ${data.countriesRepresented} countries`}
        dateRange={`Survey conducted ${data.surveyPeriod}, published ${data.source.published}`}
        limitations={[
          "WebAIM states the sample was not controlled and may not represent everyone in the digital accessibility field. Respondents self-select, and people engaged enough to answer a WebAIM survey are not a random sample of practitioners.",
          "300 responses across 23 countries means thin cells once you slice by country. Only locations with more than ten respondents are reported, and even those carry wide uncertainty.",
          "The year-over-year decline in average salary is attributed by WebAIM to fewer respondents reporting 25 or more years of experience and tenure, not to falling market rates.",
          "Salaries were converted to US dollars at January 2026 rates, so cross-country comparisons move with exchange rates as well as with pay.",
          "Salary figures cover full-time respondents only. Freelance, part-time, and contract rates are not comparable and are excluded from the averages.",
          "Totals may not sum to 100% because of rounding, and not every respondent answered every question.",
        ]}
        lastUpdated={data.lastUpdated}
      />

      <ReportDownloads
        reportUrl={REPORT_URL}
        citation={`Accessibility.build. (2026). Digital Accessibility Salary Report. ${REPORT_URL}`}
        description="The PDF contains the location and segment tables with the methodology note. The CSV contains every segment including role and reported disability."
        onDownloadPdf={handleDownloadPDF}
        onDownloadCsv={handleDownloadCSV}
        primaryDatasetUrl={data.source.url}
        intro="WebAIM permits reproduction of its content at no cost to recipients with full credit and a link. Keep the attribution when publishing extracts."
      />
    </div>
  );
}
