"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BookOpen,
  Calendar,
  AlertTriangle,
  Database,
} from "lucide-react";

interface MethodologySectionProps {
  title?: string;
  dataSources: { name: string; url?: string; description: string }[];
  sampleSize?: string;
  dateRange?: string;
  limitations?: string[];
  lastUpdated?: string;
  className?: string;
  id?: string;
  summary?: string;
  headingLevel?: 2 | 3;
  defaultExpanded?: boolean;
}

export function MethodologySection({
  title = "Methodology",
  dataSources,
  sampleSize,
  dateRange,
  limitations,
  lastUpdated,
  className,
  id = "methodology",
  summary,
  headingLevel = 2,
  defaultExpanded = false,
}: MethodologySectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const contentId = `${id}-details`;
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const Subheading = headingLevel === 2 ? "h3" : "h4";

  return (
    <div
      id={id}
      className={cn(
        "scroll-mt-28 overflow-hidden rounded-lg border bg-white dark:bg-slate-900",
        className,
      )}
    >
      <Heading>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 sm:px-6"
          aria-expanded={isExpanded}
          aria-controls={contentId}
        >
          <span className="flex items-start gap-3">
            <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
            <span>
              <span className="block text-lg font-semibold text-slate-900 dark:text-white">
                {title}
              </span>
              {summary && (
                <span className="mt-1 block text-sm font-normal leading-relaxed text-slate-600 dark:text-slate-400">
                  {summary}
                </span>
              )}
            </span>
          </span>
          {isExpanded ? (
            <ChevronUp className="mt-0.5 h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400" />
          ) : (
            <ChevronDown className="mt-0.5 h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400" />
          )}
        </button>
      </Heading>

      {isExpanded && (
        <div
          id={contentId}
          className="space-y-6 border-t px-5 pb-6 dark:border-slate-800 sm:px-6"
        >
          {/* Data Sources */}
          <div className="pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Database className="h-4 w-4 text-slate-500" />
              <Subheading className="font-semibold text-sm text-slate-900 dark:text-white uppercase tracking-wide">
                Data Sources
              </Subheading>
            </div>
            <ul className="space-y-3">
              {dataSources.map((source, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {source.url ? (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                        >
                          {source.name}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        source.name
                      )}
                    </span>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {source.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Sample & Date Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sampleSize && (
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                  Sample Size
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {sampleSize}
                </p>
              </div>
            )}
            {dateRange && (
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-slate-500" />
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Date Range
                  </p>
                </div>
                <p className="font-semibold text-slate-900 dark:text-white mt-1">
                  {dateRange}
                </p>
              </div>
            )}
          </div>

          {/* Limitations */}
          {limitations && limitations.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <Subheading className="font-semibold text-sm text-slate-900 dark:text-white uppercase tracking-wide">
                  Limitations
                </Subheading>
              </div>
              <ul className="space-y-2">
                {limitations.map((limitation, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    {limitation}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Last Updated */}
          {lastUpdated && (
            <p className="border-t pt-2 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
              Last updated: {lastUpdated}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
