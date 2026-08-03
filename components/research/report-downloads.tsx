"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Link as LinkIcon,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReportDownloadsProps {
  /** Absolute URL of the report, used for the share and copy-link actions. */
  reportUrl: string;
  citation: string;
  /** What the PDF and CSV each contain. */
  description: string;
  onDownloadPdf: () => void;
  onDownloadCsv: () => void;
  primaryDatasetUrl?: string;
  intro?: string;
}

/** Shared download, cite, and share block for the /research report pages. */
export function ReportDownloads({
  reportUrl,
  citation,
  description,
  onDownloadPdf,
  onDownloadCsv,
  primaryDatasetUrl,
  intro = "Reuse the findings with a clear citation, and keep the link to the primary source when publishing extracts.",
}: ReportDownloadsProps) {
  const [citationCopied, setCitationCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

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

  return (
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
          {intro}
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
            {description}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              onClick={onDownloadPdf}
              className="bg-teal-700 text-white hover:bg-teal-800"
            >
              <Download aria-hidden="true" />
              Download PDF
            </Button>
            <Button variant="outline" onClick={onDownloadCsv}>
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
              onClick={() => copyText(reportUrl, "link")}
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
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(reportUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin aria-hidden="true" />
                LinkedIn
              </a>
            </Button>
            {primaryDatasetUrl && (
              <Button variant="outline" asChild>
                <a
                  href={primaryDatasetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink aria-hidden="true" />
                  Primary dataset
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Triggers a client-side file download for a generated blob. */
export function downloadBlobAs(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Describes a value's distance from a baseline in words as well as a number, so
 * the comparison never depends on colour or on a screen reader announcing a
 * bare sign glyph (WCAG 1.4.1).
 */
export function formatVsAverage(value: number) {
  const rounded = Math.round(Math.abs(value) * 10) / 10;
  if (rounded === 0) return "at the average";
  return `${rounded}% ${value < 0 ? "below" : "above"} average`;
}
