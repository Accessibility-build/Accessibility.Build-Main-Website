"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronUp, ExternalLink, BookOpen, Calendar, AlertTriangle, Database } from "lucide-react"

interface MethodologySectionProps {
  title?: string
  dataSources: { name: string; url?: string; description: string }[]
  sampleSize?: string
  dateRange?: string
  limitations?: string[]
  lastUpdated?: string
  className?: string
}

export function MethodologySection({
  title = "Methodology",
  dataSources,
  sampleSize,
  dateRange,
  limitations,
  lastUpdated,
  className,
}: MethodologySectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={cn("border rounded-xl overflow-hidden bg-white dark:bg-slate-900", className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span className="text-lg font-semibold text-slate-900 dark:text-white">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-slate-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-400" />
        )}
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 space-y-6 border-t dark:border-slate-800">
          {/* Data Sources */}
          <div className="pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Database className="h-4 w-4 text-slate-500" />
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white uppercase tracking-wide">
                Data Sources
              </h4>
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
                    <p className="text-sm text-slate-600 dark:text-slate-400">{source.description}</p>
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
                <p className="font-semibold text-slate-900 dark:text-white">{sampleSize}</p>
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
                <p className="font-semibold text-slate-900 dark:text-white mt-1">{dateRange}</p>
              </div>
            )}
          </div>

          {/* Limitations */}
          {limitations && limitations.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white uppercase tracking-wide">
                  Limitations
                </h4>
              </div>
              <ul className="space-y-2">
                {limitations.map((limitation, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    {limitation}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Last Updated */}
          {lastUpdated && (
            <p className="text-xs text-slate-400 dark:text-slate-500 pt-2 border-t dark:border-slate-800">
              Last updated: {lastUpdated}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
