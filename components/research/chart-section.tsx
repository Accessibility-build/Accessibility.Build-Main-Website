"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Download, ExternalLink } from "lucide-react"

interface ChartSectionProps {
  title: string
  description?: string
  source?: string
  sourceUrl?: string
  children: React.ReactNode
  downloadData?: { filename: string; data: Record<string, unknown>[] }
  className?: string
}

export function ChartSection({
  title,
  description,
  source,
  sourceUrl,
  children,
  downloadData,
  className,
}: ChartSectionProps) {
  const [downloading, setDownloading] = useState(false)

  const handleDownloadCSV = () => {
    if (!downloadData) return
    setDownloading(true)

    try {
      const { filename, data } = downloadData
      if (!data.length) return

      const headers = Object.keys(data[0])
      const csvRows = [
        headers.join(","),
        ...data.map((row) =>
          headers.map((h) => {
            const val = row[h]
            const str = String(val ?? "")
            return str.includes(",") || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str
          }).join(",")
        ),
      ]

      const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${filename}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-slate-600 dark:text-slate-400">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {(source || downloadData) && (
        <CardFooter className="flex items-center justify-between border-t bg-slate-50/50 dark:bg-slate-900/30 px-6 py-3">
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
          {downloadData && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadCSV}
              disabled={downloading}
              className="text-xs"
            >
              <Download className="h-3 w-3 mr-1" />
              {downloading ? "Downloading..." : "Download CSV"}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
