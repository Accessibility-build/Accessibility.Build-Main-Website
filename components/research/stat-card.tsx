"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Copy, Check, TrendingUp, TrendingDown, type LucideIcon } from "lucide-react"

interface StatCardProps {
  value: string
  label: string
  icon: LucideIcon
  trend?: { direction: "up" | "down"; percentage: number; label?: string }
  source?: string
  className?: string
}

export function StatCard({ value, label, icon: Icon, trend, source, className }: StatCardProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${value} ${label}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const textarea = document.createElement("textarea")
      textarea.value = `${value} ${label}`
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Card className={cn("relative overflow-hidden group hover:shadow-lg transition-all duration-300", className)}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600" />
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
            <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
            aria-label="Copy statistic"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4 text-slate-400" />
            )}
          </Button>
        </div>

        <div className="space-y-2">
          <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {value}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {label}
          </p>
        </div>

        {trend && (
          <div className="mt-4 flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                "text-xs font-medium",
                trend.direction === "down"
                  ? "text-green-700 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-800 dark:bg-green-950/30"
                  : "text-red-700 border-red-200 bg-red-50 dark:text-red-400 dark:border-red-800 dark:bg-red-950/30"
              )}
            >
              {trend.direction === "down" ? (
                <TrendingDown className="h-3 w-3 mr-1" />
              ) : (
                <TrendingUp className="h-3 w-3 mr-1" />
              )}
              {trend.percentage}%
            </Badge>
            {trend.label && (
              <span className="text-xs text-slate-500 dark:text-slate-400">{trend.label}</span>
            )}
          </div>
        )}

        {source && (
          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
            Source: {source}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
