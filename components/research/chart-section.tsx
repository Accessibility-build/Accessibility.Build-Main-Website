"use client";

import { useId, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Download, ExternalLink, Table2 } from "lucide-react";

interface ChartSectionProps {
  title: string;
  description?: string;
  insight?: string;
  source?: string;
  sourceUrl?: string;
  children: React.ReactNode;
  downloadData?: { filename: string; data: Record<string, unknown>[] };
  className?: string;
  titleId?: string;
  headingLevel?: 2 | 3;
  dataTable?: React.ReactNode;
}

export function ChartSection({
  title,
  description,
  insight,
  source,
  sourceUrl,
  children,
  downloadData,
  className,
  titleId,
  headingLevel = 3,
  dataTable,
}: ChartSectionProps) {
  const [downloading, setDownloading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const generatedTitleId = useId().replace(/:/g, "");
  const resolvedTitleId = titleId || `chart-${generatedTitleId}`;

  const handleDownloadCSV = () => {
    if (!downloadData) return;
    setDownloading(true);

    try {
      const { filename, data } = downloadData;
      if (!data.length) return;

      const headers = Object.keys(data[0]);
      const csvRows = [
        headers.join(","),
        ...data.map((row) =>
          headers
            .map((h) => {
              const val = row[h];
              const str = String(val ?? "");
              return str.includes(",") || str.includes('"')
                ? `"${str.replace(/"/g, '""')}"`
                : str;
            })
            .join(","),
        ),
      ];

      const blob = new Blob([csvRows.join("\n")], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Card
      className={cn("overflow-hidden rounded-lg", className)}
      aria-labelledby={resolvedTitleId}
    >
      <CardHeader>
        {headingLevel === 2 ? (
          <h2
            id={resolvedTitleId}
            className="text-xl font-bold text-slate-900 dark:text-white md:text-2xl"
          >
            {title}
          </h2>
        ) : (
          <h3
            id={resolvedTitleId}
            className="text-xl font-bold text-slate-900 dark:text-white"
          >
            {title}
          </h3>
        )}
        {description && (
          <CardDescription className="text-slate-600 dark:text-slate-400">
            {description}
          </CardDescription>
        )}
        {insight && (
          <p className="mt-3 border-l-2 border-teal-500 pl-3 text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-200">
            {insight}
          </p>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {dataTable && showTable && (
        <div className="border-t border-slate-200 px-4 py-5 dark:border-slate-800 sm:px-6">
          {dataTable}
        </div>
      )}
      {(source || downloadData || dataTable) && (
        <CardFooter className="flex flex-col items-start justify-between gap-3 border-t bg-slate-50/50 px-6 py-3 dark:bg-slate-900/30 sm:flex-row sm:items-center">
          {source && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Source:{" "}
              {sourceUrl ? (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  {source}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                source
              )}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {dataTable && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTable((current) => !current)}
                aria-expanded={showTable}
                className="text-xs"
              >
                <Table2 className="h-3 w-3" />
                {showTable ? "Hide data table" : "View data table"}
              </Button>
            )}
            {downloadData && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadCSV}
                disabled={downloading}
                className="text-xs"
                aria-label={`${downloading ? "Downloading" : "Download"} ${title} data as CSV`}
              >
                <Download className="h-3 w-3" />
                {downloading ? "Downloading..." : "Download CSV"}
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
