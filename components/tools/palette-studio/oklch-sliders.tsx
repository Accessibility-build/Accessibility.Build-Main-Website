"use client"

import { useMemo } from "react"
import { hexToOklch, oklchToHex } from "@/lib/color/oklch"
import { Label } from "@/components/ui/label"

interface OklchSlidersProps {
  hex: string
  onChange: (hex: string) => void
}

export function OklchSliders({ hex, onChange }: OklchSlidersProps) {
  const oklch = useMemo(() => hexToOklch(hex), [hex])

  const update = (next: Partial<{ l: number; c: number; h: number }>) => {
    const merged = { l: oklch.l, c: oklch.c, h: oklch.h, ...next }
    onChange(oklchToHex(merged))
  }

  // Build gradient stops for each slider (10 stops along the axis)
  const lGradient = useMemo(() => buildGradient((v) => oklchToHex({ l: v, c: oklch.c, h: oklch.h }), 0, 1), [oklch.c, oklch.h])
  const cGradient = useMemo(() => buildGradient((v) => oklchToHex({ l: oklch.l, c: v, h: oklch.h }), 0, 0.4), [oklch.l, oklch.h])
  const hGradient = useMemo(
    () => buildGradient((v) => oklchToHex({ l: oklch.l, c: Math.max(oklch.c, 0.18), h: v }), 0, 360),
    [oklch.l, oklch.c]
  )

  return (
    <div className="space-y-2.5">
      <Slider
        label="L"
        sublabel="lightness"
        min={0}
        max={1}
        step={0.005}
        value={oklch.l}
        gradient={lGradient}
        onChange={(v) => update({ l: v })}
        format={(v) => v.toFixed(3)}
      />
      <Slider
        label="C"
        sublabel="chroma"
        min={0}
        max={0.4}
        step={0.002}
        value={oklch.c}
        gradient={cGradient}
        onChange={(v) => update({ c: v })}
        format={(v) => v.toFixed(3)}
      />
      <Slider
        label="H"
        sublabel="hue"
        min={0}
        max={360}
        step={1}
        value={oklch.h}
        gradient={hGradient}
        onChange={(v) => update({ h: v })}
        format={(v) => `${Math.round(v)}°`}
      />
    </div>
  )
}

function Slider({
  label,
  sublabel,
  min,
  max,
  step,
  value,
  gradient,
  onChange,
  format,
}: {
  label: string
  sublabel: string
  min: number
  max: number
  step: number
  value: number
  gradient: string
  onChange: (v: number) => void
  format: (v: number) => string
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-wide text-muted-foreground">
        <Label className="flex items-center gap-1.5">
          <span className="font-semibold text-foreground">{label}</span>
          <span>{sublabel}</span>
        </Label>
        <span className="font-mono">{format(value)}</span>
      </div>
      <div className="relative h-6 rounded-md" style={{ background: gradient }}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          aria-label={`${label} ${sublabel}`}
          className="absolute inset-0 w-full cursor-pointer appearance-none bg-transparent
                     [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-2
                     [&::-webkit-slider-thumb]:rounded-sm [&::-webkit-slider-thumb]:bg-white
                     [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black/70
                     [&::-webkit-slider-thumb]:shadow-md
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-2
                     [&::-moz-range-thumb]:rounded-sm [&::-moz-range-thumb]:bg-white
                     [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-black/70"
        />
      </div>
    </div>
  )
}

function buildGradient(fn: (v: number) => string, min: number, max: number, steps = 10): string {
  const stops: string[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const v = min + t * (max - min)
    stops.push(`${fn(v)} ${(t * 100).toFixed(1)}%`)
  }
  return `linear-gradient(to right, ${stops.join(", ")})`
}
