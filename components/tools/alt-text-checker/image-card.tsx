"use client"

import { useState } from "react"
import Link from "next/link"
import { AlertTriangle, CheckCircle2, Copy, EyeOff, ImageOff, Info, Lightbulb, Sparkles, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { KIND_LABEL, OUTCOME_LABEL, VERDICT_LABEL } from "@/lib/alt-text-audit/csv"
import type { AiVerdictKind, CheckedImage, Outcome, Severity } from "@/lib/alt-text-audit/types"
import { cn } from "@/lib/utils"

// One image from the check: a thumbnail, the current alt exactly as the page has it, what the rules
// found, and the AI verdict and suggestion when the image was reviewed. Every state carries an icon
// and words, never colour alone.

const OUTCOME_STYLE: Record<Outcome, { icon: typeof XCircle; className: string }> = {
  fail: { icon: XCircle, className: "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200" },
  review: { icon: AlertTriangle, className: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200" },
  decorative: { icon: EyeOff, className: "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200" },
  pass: { icon: CheckCircle2, className: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200" },
}

const SEVERITY_STYLE: Record<Severity, { label: string; icon: typeof XCircle; className: string }> = {
  fail: { label: "Fails", icon: XCircle, className: "text-rose-800 dark:text-rose-300" },
  warning: { label: "Review", icon: AlertTriangle, className: "text-amber-800 dark:text-amber-300" },
  advice: { label: "Tip", icon: Lightbulb, className: "text-slate-600 dark:text-slate-400" },
}

const VERDICT_TONE: Record<AiVerdictKind, Outcome> = {
  accurate: "pass",
  decorative_and_fine: "pass",
  incomplete: "review",
  should_be_decorative: "review",
  inaccurate: "fail",
  needs_alt: "fail",
}

export function OutcomeBadge({ outcome, label, className }: { outcome: Outcome; label?: string; className?: string }) {
  const { icon: Icon, className: tone } = OUTCOME_STYLE[outcome]
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold", tone, className)}>
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {label ?? OUTCOME_LABEL[outcome]}
    </span>
  )
}

function Thumbnail({ image }: { image: CheckedImage }) {
  const [failed, setFailed] = useState(false)
  const frame = "flex h-40 w-full items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"

  // The captured JPEG is exactly what the AI saw. Otherwise the page's own file, only over https
  // and without a referrer, so the site does not learn where it was viewed from.
  const src = image.capture ?? (image.src?.startsWith("https://") && !failed ? image.src : null)
  if (!src) {
    return (
      <div className={cn(frame, "flex-col gap-1 text-xs text-slate-600 dark:text-slate-300")}>
        <ImageOff className="h-5 w-5" aria-hidden="true" />
        <span>{image.kind === "svg" || image.kind === "role-img" ? "Inline graphic, no preview" : "No preview available"}</span>
      </div>
    )
  }
  return (
    <div className={frame}>
      {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary third-party and data: images; next/image cannot optimise them */}
      <img
        src={src}
        alt={`Image ${image.id} from the page${image.capture ? ", as captured for the AI review" : ""}`}
        referrerPolicy="no-referrer"
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="max-h-full max-w-full object-contain"
      />
    </div>
  )
}

function CurrentAlt({ image }: { image: CheckedImage }) {
  const empty = "inline-flex items-center gap-1.5 rounded-md border border-dashed border-slate-300 px-2 py-1 text-sm font-medium text-slate-700 dark:border-slate-600 dark:text-slate-200"
  if (image.ariaHidden) return <span className={empty}>Hidden with aria-hidden=&quot;true&quot;</span>
  if (image.kind === "svg" || image.kind === "role-img") {
    if (!image.name) return <span className={empty}>No name</span>
    return (
      <span>
        <span className="block whitespace-pre-wrap rounded-md bg-slate-100 px-2 py-1 text-sm text-slate-900 [overflow-wrap:anywhere] dark:bg-slate-800 dark:text-slate-100">{image.name}</span>
        <span className="mt-1 block text-xs text-slate-600 dark:text-slate-400">From the {image.nameSource}</span>
      </span>
    )
  }
  if (image.altState === "missing") {
    return (
      <span>
        <span className={empty}>Missing: no alt attribute</span>
        {image.name && (
          <span className="mt-1 block text-xs text-slate-600 dark:text-slate-400">
            Named by its {image.nameSource} instead: &ldquo;{image.name}&rdquo;
          </span>
        )}
      </span>
    )
  }
  if (image.altState === "empty") {
    return (
      <span>
        <span className={empty}>Empty: alt=&quot;&quot;</span>
        {image.name && (
          <span className="mt-1 block text-xs text-slate-600 dark:text-slate-400">
            Named by its {image.nameSource} instead: &ldquo;{image.name}&rdquo;
          </span>
        )}
      </span>
    )
  }
  return (
    <span className="block whitespace-pre-wrap rounded-md bg-slate-100 px-2 py-1 text-sm text-slate-900 [overflow-wrap:anywhere] dark:bg-slate-800 dark:text-slate-100">
      {image.alt}
    </span>
  )
}

function Context({ image }: { image: CheckedImage }) {
  const control = image.control
  const items: string[] = []
  if (control?.self) items.push(image.kind === "area" ? "An image map link" : "An image button")
  else if (control) {
    items.push(
      image.onlyContent
        ? `The only content of a ${control.kind}, so its alt is the ${control.kind}'s name`
        : `Inside a ${control.kind} that also says "${control.label || control.text || control.title}"`,
    )
  }
  if (image.caption) items.push(`Caption: "${image.caption}"`)
  items.push(`${KIND_LABEL[image.kind]}, shown at ${image.width} by ${image.height} px${image.fileName ? `, file ${image.fileName}` : ""}`)
  return (
    <ul className="space-y-1 text-sm text-slate-600 [overflow-wrap:anywhere] dark:text-slate-400">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
      {control?.href && (
        <li>
          Goes to <span className="font-mono text-xs">{control.href}</span>
        </li>
      )}
    </ul>
  )
}

export function ImageCard({ image, onCopied }: { image: CheckedImage; onCopied: (message: string) => void }) {
  const headingId = `alt-image-${image.id}`
  const verdict = image.ai

  const copy = async () => {
    if (!verdict) return
    const text = verdict.suggestedAlt === "" ? 'alt=""' : verdict.suggestedAlt
    try {
      await navigator.clipboard.writeText(text)
      onCopied(`Suggested alt for image ${image.id} copied.`)
    } catch {
      onCopied("Copying was blocked by the browser. Select the text and copy it instead.")
    }
  }

  return (
    <article aria-labelledby={headingId} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 id={headingId} className="text-base font-semibold text-slate-900 dark:text-white">
          Image {image.id}
        </h3>
        <OutcomeBadge outcome={image.outcome} />
      </div>

      <div className="mt-4 grid gap-5 sm:grid-cols-[11rem_minmax(0,1fr)]">
        <Thumbnail image={image} />
        <div className="min-w-0 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">Current alt text</p>
            <div className="mt-1">
              <CurrentAlt image={image} />
            </div>
          </div>
          <Context image={image} />
        </div>
      </div>

      {image.findings.length > 0 && (
        <div className="mt-5">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">What the rules found</h4>
          <ul className="mt-2 space-y-3">
            {image.findings.map((finding) => {
              const style = SEVERITY_STYLE[finding.severity]
              const Icon = style.icon
              return (
                <li key={finding.rule} className="text-sm leading-6">
                  <p className="flex flex-wrap items-baseline gap-x-2">
                    <span className={cn("inline-flex items-center gap-1 font-semibold", style.className)}>
                      <Icon className="h-4 w-4 shrink-0 self-center" aria-hidden="true" />
                      {style.label}:
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white">{finding.title}</span>
                  </p>
                  <p className="mt-0.5 text-slate-700 dark:text-slate-300">{finding.detail}</p>
                  <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                    {finding.wcag.map((ref, index) => (
                      <span key={ref.id}>
                        {index > 0 && ", "}
                        <Link href={ref.href} className="font-medium text-teal-700 underline underline-offset-2 hover:text-teal-900 dark:text-teal-300 dark:hover:text-teal-200">
                          WCAG {ref.id} {ref.name}
                        </Link>
                      </span>
                    ))}
                  </p>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {verdict && (
        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <Sparkles className="h-4 w-4 text-teal-700 dark:text-teal-300" aria-hidden="true" />
            AI review
          </h4>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            <span className="sr-only">Verdict:</span>
            <OutcomeBadge outcome={VERDICT_TONE[verdict.verdict]} label={VERDICT_LABEL[verdict.verdict]} />
            <span className="text-slate-700 dark:text-slate-300">{verdict.reason}</span>
          </p>
          <div className="mt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">Suggested alt text</p>
            {verdict.suggestedAlt === "" && verdict.verdict !== "should_be_decorative" && verdict.verdict !== "decorative_and_fine" ? (
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">No suggestion for this image.</p>
            ) : (
              <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-start">
                <p className="min-w-0 flex-1 whitespace-pre-wrap rounded-md border border-slate-200 bg-white px-2 py-1 text-sm text-slate-900 [overflow-wrap:anywhere] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                  {verdict.suggestedAlt === "" ? 'alt="" (decorative)' : verdict.suggestedAlt}
                </p>
                <Button type="button" variant="outline" size="sm" onClick={copy} className="shrink-0 focus-visible:ring-2 focus-visible:ring-teal-600">
                  <Copy className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                  Copy<span className="sr-only"> suggested alt for image {image.id}</span>
                </Button>
              </div>
            )}
          </div>
          <p className="mt-3 flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            A model&apos;s judgement from a screenshot and nearby text. Check it against what the image is for before you use it.
          </p>
        </div>
      )}
    </article>
  )
}
