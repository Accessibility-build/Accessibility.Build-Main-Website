"use client"

import { useMemo, useState } from "react"
import { BookOpen, Sparkles } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { analyzeReadability, type ReadabilityResult } from "@/lib/typography/readability"

const SAMPLE_TEXT = `Accessibility is not a feature you add at the end of a project. It is a thread that runs through every choice a team makes — from the color of a focus ring to the order in which a screen reader announces a modal.

When teams treat accessibility as compliance, the work becomes a checklist of avoidance. When they treat it as a craft discipline, the same constraints turn into design fuel. Generous type, calm motion, clear hierarchy — these are not accommodations. They are the foundation of a product that reads as care.`

export function ReadabilityAnalyzer() {
  const [text, setText] = useState(SAMPLE_TEXT)
  const [submittedText, setSubmittedText] = useState<string | null>(null)

  const result = useMemo<ReadabilityResult | null>(() => {
    if (!submittedText) return null
    return analyzeReadability(submittedText)
  }, [submittedText])

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="readability-text" className="text-xs">
          Paste copy to analyze
        </Label>
        <Textarea
          id="readability-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste any English text — marketing copy, docs, blog post…"
          className="mt-1 min-h-[120px] resize-y font-sans text-sm"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={() => setSubmittedText(text)}>
          <Sparkles className="mr-1.5 h-3.5 w-3.5" />
          Analyze
        </Button>
        <Button size="sm" variant="outline" onClick={() => { setText(SAMPLE_TEXT); setSubmittedText(null) }}>
          Reset
        </Button>
        <span className="text-xs text-muted-foreground">
          {text.length} characters · {text.split(/\s+/).filter(Boolean).length} words
        </span>
      </div>

      {result && (
        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Reading ease" value={result.fleschReadingEase.toFixed(1)} tone={readingEaseTone(result.fleschReadingEase)} />
            <Metric label="Grade level" value={result.fleschKincaidGrade.toFixed(1)} tone={gradeTone(result.fleschKincaidGrade)} />
            <Metric label="Avg sentence length" value={result.averageWordsPerSentence.toFixed(1)} tone={sentenceLengthTone(result.averageWordsPerSentence)} />
            <Metric label="Long words (3+ syl)" value={`${result.longWords}`} tone="neutral" />
          </div>

          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-xs font-semibold">
            <BookOpen className="h-3.5 w-3.5" />
            {result.readingLevel}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {result.recommendation}
          </p>
        </div>
      )}
    </div>
  )
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: "good" | "caution" | "bad" | "neutral"
}) {
  const cls =
    tone === "good"
      ? "text-emerald-600 dark:text-emerald-400"
      : tone === "caution"
      ? "text-amber-600 dark:text-amber-400"
      : tone === "bad"
      ? "text-rose-600 dark:text-rose-400"
      : "text-foreground"
  return (
    <div className="rounded-md border bg-background p-3">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-1 text-xl font-bold tabular-nums ${cls}`}>{value}</p>
    </div>
  )
}

function readingEaseTone(score: number) {
  if (score >= 60) return "good" as const
  if (score >= 50) return "caution" as const
  return "bad" as const
}

function gradeTone(grade: number) {
  if (grade <= 8) return "good" as const
  if (grade <= 12) return "caution" as const
  return "bad" as const
}

function sentenceLengthTone(avg: number) {
  if (avg <= 18) return "good" as const
  if (avg <= 25) return "caution" as const
  return "bad" as const
}
