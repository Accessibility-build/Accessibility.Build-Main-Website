"use client"

import { useState, useEffect, type CSSProperties } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Palette, 
  RefreshCw, 
  Copy, 
  Download, 
  CheckCircle, 
  Shuffle,
  Sparkles,
  Eye,
  Settings,
  Save,
  AlertTriangle,
  BarChart3,
  Mail,
  Moon,
  Sun
} from "lucide-react"

interface ColorData {
  hex: string
  hsl: { h: number; s: number; l: number }
  rgb: { r: number; g: number; b: number }
  name: string
  role: string
}

interface ColorPalette {
  primary: ColorData[]
  secondary: ColorData[]
  accent: ColorData[]
  neutral: ColorData[]
  name: string
  harmony: string
}

interface PreviewTokens {
  mode: "light" | "dark"
  name: string
  background: string
  surface: string
  raised: string
  foreground: string
  muted: string
  border: string
  primary: string
  primaryForeground: string
  primaryHover: string
  secondary: string
  secondaryForeground: string
  accent: string
  accentForeground: string
  success: string
  successForeground: string
  warning: string
  warningForeground: string
  danger: string
  dangerForeground: string
  focus: string
  disabled: string
  disabledForeground: string
}

type ColorHarmony = 'complementary' | 'analogous' | 'triadic' | 'monochromatic' | 'split-complementary' | 'tetradic'

export default function ColorPaletteGenerator() {
  const [baseColor, setBaseColor] = useState("#3b82f6")
  const [harmony, setHarmony] = useState<ColorHarmony>("complementary")
  const [palette, setPalette] = useState<ColorPalette | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  // Color conversion utilities
  const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0, s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
  }

  const hslToHex = (h: number, s: number, l: number): string => {
    h = h % 360
    s = s / 100
    l = l / 100

    const c = (1 - Math.abs(2 * l - 1)) * s
    const x = c * (1 - Math.abs((h / 60) % 2 - 1))
    const m = l - c / 2

    let r = 0, g = 0, b = 0

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x
    }

    r = Math.round((r + m) * 255)
    g = Math.round((g + m) * 255)
    b = Math.round((b + m) * 255)

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }

  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return { r, g, b }
  }

  // Calculate contrast ratio
  const getContrastRatio = (color1: string, color2: string): number => {
    const getLuminance = (rgb: { r: number; g: number; b: number }): number => {
      const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
        c = c / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }

    const rgb1 = hexToRgb(color1)
    const rgb2 = hexToRgb(color2)
    const lum1 = getLuminance(rgb1)
    const lum2 = getLuminance(rgb2)
    const brightest = Math.max(lum1, lum2)
    const darkest = Math.min(lum1, lum2)
    
    return (brightest + 0.05) / (darkest + 0.05)
  }

  const generateColorName = (hex: string): string => {
    const hsl = hexToHsl(hex)
    const hue = hsl.h
    const sat = hsl.s
    const light = hsl.l

    let hueName = ''
    if (hue < 15 || hue >= 345) hueName = 'Red'
    else if (hue < 45) hueName = 'Orange'
    else if (hue < 75) hueName = 'Yellow'
    else if (hue < 165) hueName = 'Green'
    else if (hue < 195) hueName = 'Cyan'
    else if (hue < 255) hueName = 'Blue'
    else if (hue < 285) hueName = 'Purple'
    else if (hue < 315) hueName = 'Magenta'
    else hueName = 'Pink'

    let lightness = ''
    if (light < 20) lightness = 'Very Dark'
    else if (light < 40) lightness = 'Dark'
    else if (light < 60) lightness = 'Medium'
    else if (light < 80) lightness = 'Light'
    else lightness = 'Very Light'

    let saturation = ''
    if (sat < 20) saturation = 'Muted'
    else if (sat < 60) saturation = 'Soft'
    else if (sat < 80) saturation = 'Vivid'
    else saturation = 'Bright'

    return `${lightness} ${saturation} ${hueName}`
  }

  const generateHarmonyColors = (baseHex: string, harmonyType: ColorHarmony): string[] => {
    const hsl = hexToHsl(baseHex)
    const colors = [baseHex]

    switch (harmonyType) {
      case 'complementary':
        colors.push(hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l))
        break
      
      case 'analogous':
        colors.push(hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l))
        colors.push(hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l))
        break
      
      case 'triadic':
        colors.push(hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l))
        colors.push(hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l))
        break
      
      case 'split-complementary':
        colors.push(hslToHex((hsl.h + 150) % 360, hsl.s, hsl.l))
        colors.push(hslToHex((hsl.h + 210) % 360, hsl.s, hsl.l))
        break
      
      case 'tetradic':
        colors.push(hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l))
        colors.push(hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l))
        colors.push(hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l))
        break
      
      case 'monochromatic':
        // Generate different shades and tints
        colors.push(hslToHex(hsl.h, hsl.s, Math.max(10, hsl.l - 30)))
        colors.push(hslToHex(hsl.h, hsl.s, Math.min(90, hsl.l + 30)))
        break
    }

    return colors
  }

  const generateShades = (baseHex: string, count: number = 5): ColorData[] => {
    const hsl = hexToHsl(baseHex)
    const shades: ColorData[] = []
    
    for (let i = 0; i < count; i++) {
      const lightness = Math.max(10, Math.min(90, hsl.l + (i - 2) * 20))
      const hex = hslToHex(hsl.h, hsl.s, lightness)
      const rgb = hexToRgb(hex)
      const newHsl = hexToHsl(hex)
      
      shades.push({
        hex,
        hsl: newHsl,
        rgb,
        name: generateColorName(hex),
        role: i === 2 ? 'base' : i < 2 ? 'dark' : 'light'
      })
    }
    
    return shades
  }

  const generatePalette = () => {
    setIsGenerating(true)
    
    // Simulate some processing time for better UX
    setTimeout(() => {
      const harmonyColors = generateHarmonyColors(baseColor, harmony)
      
      const newPalette: ColorPalette = {
        name: `${harmony.charAt(0).toUpperCase() + harmony.slice(1)} Palette`,
        harmony: harmony,
        primary: generateShades(harmonyColors[0] || baseColor),
        secondary: harmonyColors[1] ? generateShades(harmonyColors[1]) : generateShades(hslToHex(hexToHsl(baseColor).h, 50, 50)),
        accent: harmonyColors[2] ? generateShades(harmonyColors[2]) : generateShades(hslToHex((hexToHsl(baseColor).h + 60) % 360, 70, 60)),
        neutral: generateShades('#6b7280') // Gray neutral
      }
      
      setPalette(newPalette)
      setIsGenerating(false)
    }, 800)
  }

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex)
    setCopied(hex)
    setTimeout(() => setCopied(null), 2000)
  }

  const copyPalette = () => {
    if (!palette) return
    
    const cssVars = `
/* ${palette.name} */
:root {
  /* Primary Colors */
${palette.primary.map((color, i) => `  --primary-${i * 100}: ${color.hex};`).join('\n')}
  
  /* Secondary Colors */
${palette.secondary.map((color, i) => `  --secondary-${i * 100}: ${color.hex};`).join('\n')}
  
  /* Accent Colors */
${palette.accent.map((color, i) => `  --accent-${i * 100}: ${color.hex};`).join('\n')}
  
  /* Neutral Colors */
${palette.neutral.map((color, i) => `  --neutral-${i * 100}: ${color.hex};`).join('\n')}
}
    `.trim()

    navigator.clipboard.writeText(cssVars)
    setCopied('palette')
    setTimeout(() => setCopied(null), 2000)
  }

  const exportPalette = (format: string) => {
    if (!palette) return

    let content = ''
    const filename = `${palette.name.toLowerCase().replace(/\s+/g, '-')}`

    switch (format) {
      case 'css':
        content = `/* ${palette.name} */\n:root {\n`
        content += palette.primary.map((color, i) => `  --primary-${i * 100}: ${color.hex};`).join('\n') + '\n'
        content += palette.secondary.map((color, i) => `  --secondary-${i * 100}: ${color.hex};`).join('\n') + '\n'
        content += palette.accent.map((color, i) => `  --accent-${i * 100}: ${color.hex};`).join('\n') + '\n'
        content += palette.neutral.map((color, i) => `  --neutral-${i * 100}: ${color.hex};`).join('\n')
        content += '\n}'
        break
      
      case 'scss':
        content = `// ${palette.name}\n`
        content += palette.primary.map((color, i) => `$primary-${i * 100}: ${color.hex};`).join('\n') + '\n'
        content += palette.secondary.map((color, i) => `$secondary-${i * 100}: ${color.hex};`).join('\n') + '\n'
        content += palette.accent.map((color, i) => `$accent-${i * 100}: ${color.hex};`).join('\n') + '\n'
        content += palette.neutral.map((color, i) => `$neutral-${i * 100}: ${color.hex};`).join('\n')
        break
      
      case 'json':
        content = JSON.stringify({
          name: palette.name,
          harmony: palette.harmony,
          colors: {
            primary: palette.primary.map(c => ({ hex: c.hex, rgb: c.rgb, hsl: c.hsl, name: c.name })),
            secondary: palette.secondary.map(c => ({ hex: c.hex, rgb: c.rgb, hsl: c.hsl, name: c.name })),
            accent: palette.accent.map(c => ({ hex: c.hex, rgb: c.rgb, hsl: c.hsl, name: c.name })),
            neutral: palette.neutral.map(c => ({ hex: c.hex, rgb: c.rgb, hsl: c.hsl, name: c.name }))
          }
        }, null, 2)
        break
    }

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.${format}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const randomizeBaseColor = () => {
    const randomHue = Math.floor(Math.random() * 360)
    const randomSat = 60 + Math.floor(Math.random() * 40) // 60-100%
    const randomLight = 40 + Math.floor(Math.random() * 30) // 40-70%
    setBaseColor(hslToHex(randomHue, randomSat, randomLight))
  }

  const getReadableTextColor = (backgroundColor: string): string => {
    const darkText = "#111827"
    const lightText = "#ffffff"
    const darkContrast = getContrastRatio(backgroundColor, darkText)
    const lightContrast = getContrastRatio(backgroundColor, lightText)

    return darkContrast >= lightContrast ? darkText : lightText
  }

  const getContrastLevel = (foreground: string, background: string): string => {
    const ratio = getContrastRatio(foreground, background)

    if (ratio >= 7) return "AAA"
    if (ratio >= 4.5) return "AA"
    if (ratio >= 3) return "Large text"
    return "Check"
  }

  const getPreferredSwatch = (colors: ColorData[], fallback: string, preferredIndex: number): string => {
    return colors[preferredIndex]?.hex || colors[Math.floor(colors.length / 2)]?.hex || fallback
  }

  const getShiftedColor = (hex: string, shift: number): string => {
    const hsl = hexToHsl(hex)
    return hslToHex(hsl.h, hsl.s, Math.max(8, Math.min(94, hsl.l + shift)))
  }

  const getPreviewTokens = (activePalette: ColorPalette, mode: "light" | "dark"): PreviewTokens => {
    const neutralBase = activePalette.neutral[2]?.hex || "#6b7280"
    const neutralHsl = hexToHsl(neutralBase)
    const neutralSaturation = Math.min(neutralHsl.s, 24)
    const primary = getPreferredSwatch(activePalette.primary, baseColor, mode === "light" ? 1 : 3)
    const secondary = getPreferredSwatch(activePalette.secondary, "#2563eb", mode === "light" ? 1 : 3)
    const accent = getPreferredSwatch(activePalette.accent, "#7c3aed", mode === "light" ? 2 : 3)
    const background = mode === "light"
      ? hslToHex(neutralHsl.h, neutralSaturation, 97)
      : hslToHex(neutralHsl.h, neutralSaturation, 9)
    const surface = mode === "light"
      ? "#ffffff"
      : hslToHex(neutralHsl.h, neutralSaturation, 14)
    const raised = mode === "light"
      ? hslToHex(neutralHsl.h, neutralSaturation, 99)
      : hslToHex(neutralHsl.h, neutralSaturation, 19)
    const foreground = mode === "light"
      ? hslToHex(neutralHsl.h, neutralSaturation, 12)
      : hslToHex(neutralHsl.h, neutralSaturation, 94)
    const muted = mode === "light"
      ? hslToHex(neutralHsl.h, neutralSaturation, 34)
      : hslToHex(neutralHsl.h, neutralSaturation, 76)
    const border = mode === "light"
      ? hslToHex(neutralHsl.h, neutralSaturation, 84)
      : hslToHex(neutralHsl.h, neutralSaturation, 30)
    const disabled = mode === "light"
      ? hslToHex(neutralHsl.h, neutralSaturation, 88)
      : hslToHex(neutralHsl.h, neutralSaturation, 25)

    return {
      mode,
      name: mode === "light" ? "Light mode" : "Dark mode",
      background,
      surface,
      raised,
      foreground,
      muted,
      border,
      primary,
      primaryForeground: getReadableTextColor(primary),
      primaryHover: getShiftedColor(primary, mode === "light" ? -8 : 8),
      secondary,
      secondaryForeground: getReadableTextColor(secondary),
      accent,
      accentForeground: getReadableTextColor(accent),
      success: mode === "light" ? "#15803d" : "#22c55e",
      successForeground: getReadableTextColor(mode === "light" ? "#15803d" : "#22c55e"),
      warning: mode === "light" ? "#b45309" : "#f59e0b",
      warningForeground: getReadableTextColor(mode === "light" ? "#b45309" : "#f59e0b"),
      danger: mode === "light" ? "#b91c1c" : "#f87171",
      dangerForeground: getReadableTextColor(mode === "light" ? "#b91c1c" : "#f87171"),
      focus: accent,
      disabled,
      disabledForeground: getReadableTextColor(disabled)
    }
  }

  const renderContrastBadge = (label: string, foreground: string, background: string, tokens: PreviewTokens) => {
    const ratio = getContrastRatio(foreground, background)

    return (
      <span
        className="rounded-full border px-2.5 py-1 text-xs font-medium"
        style={{
          borderColor: tokens.border,
          backgroundColor: tokens.raised,
          color: tokens.foreground
        }}
      >
        {label}: {ratio.toFixed(1)}:1 {getContrastLevel(foreground, background)}
      </span>
    )
  }

  const renderLivePreview = (tokens: PreviewTokens) => {
    const primaryHoverForeground = getReadableTextColor(tokens.primaryHover)
    const chartBars = [
      { label: "Text", value: 92, color: tokens.primary },
      { label: "UI", value: 74, color: tokens.secondary },
      { label: "Focus", value: 86, color: tokens.accent },
      { label: "Errors", value: 48, color: tokens.danger }
    ]

    const previewStyle: CSSProperties = {
      backgroundColor: tokens.background,
      color: tokens.foreground,
      borderColor: tokens.border
    }

    const surfaceStyle: CSSProperties = {
      backgroundColor: tokens.surface,
      color: tokens.foreground,
      borderColor: tokens.border
    }

    const raisedStyle: CSSProperties = {
      backgroundColor: tokens.raised,
      color: tokens.foreground,
      borderColor: tokens.border
    }

    const buttonBaseStyle: CSSProperties = {
      borderRadius: "0.5rem",
      minHeight: "2.5rem",
      padding: "0.625rem 0.875rem",
      fontWeight: 600
    }

    return (
      <div
        className="rounded-lg border p-4 md:p-5"
        style={previewStyle}
      >
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            {tokens.mode === "light" ? (
              <Sun className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4" aria-hidden="true" />
            )}
            <h3 className="text-base font-semibold">{tokens.name}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {renderContrastBadge("Text", tokens.foreground, tokens.background, tokens)}
            {renderContrastBadge("Button", tokens.primaryForeground, tokens.primary, tokens)}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div
              className="rounded-lg border p-4"
              style={surfaceStyle}
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Component states</p>
                  <p className="text-xs" style={{ color: tokens.muted }}>
                    Normal, hover, focus, and disabled controls.
                  </p>
                </div>
                <a
                  href="/tools/contrast-checker"
                  className="rounded text-sm font-semibold underline underline-offset-4"
                  style={{ color: tokens.primary }}
                >
                  Contrast checker
                </a>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <button
                  type="button"
                  className="transition-transform hover:-translate-y-0.5"
                  style={{
                    ...buttonBaseStyle,
                    backgroundColor: tokens.primary,
                    color: tokens.primaryForeground
                  }}
                >
                  Button
                </button>
                <button
                  type="button"
                  style={{
                    ...buttonBaseStyle,
                    backgroundColor: tokens.primaryHover,
                    color: primaryHoverForeground
                  }}
                >
                  Hover
                </button>
                <button
                  type="button"
                  style={{
                    ...buttonBaseStyle,
                    backgroundColor: tokens.surface,
                    color: tokens.primary,
                    border: `2px solid ${tokens.focus}`,
                    boxShadow: `0 0 0 4px ${tokens.focus}33`
                  }}
                >
                  Focus
                </button>
                <button
                  type="button"
                  disabled
                  style={{
                    ...buttonBaseStyle,
                    backgroundColor: tokens.disabled,
                    color: tokens.disabledForeground,
                    cursor: "not-allowed",
                    opacity: 0.72
                  }}
                >
                  Disabled
                </button>
              </div>
            </div>

            <div
              className="rounded-lg border p-4"
              style={surfaceStyle}
            >
              <div className="mb-3 flex items-center gap-2">
                <Mail className="h-4 w-4" aria-hidden="true" />
                <p className="text-sm font-semibold">Form preview</p>
              </div>
              <div>
                <label htmlFor={`email-preview-${tokens.mode}`} className="mb-1 block text-sm font-medium">
                  Email address
                </label>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
                  <input
                    id={`email-preview-${tokens.mode}`}
                    type="email"
                    value="alex@example.com"
                    readOnly
                    className="h-10 w-full min-w-0 flex-1 rounded-md border px-3 text-sm outline-none"
                    style={{
                      backgroundColor: tokens.raised,
                      color: tokens.foreground,
                      borderColor: tokens.focus,
                      boxShadow: `0 0 0 3px ${tokens.focus}2b`
                    }}
                  />
                  <button
                    type="button"
                    className="h-10 w-full shrink-0 sm:w-auto"
                    style={{
                      ...buttonBaseStyle,
                      minHeight: "2.5rem",
                      backgroundColor: tokens.secondary,
                      color: tokens.secondaryForeground
                    }}
                  >
                    Save
                  </button>
                </div>
                <p className="mt-2 text-xs" style={{ color: tokens.muted }}>
                  Focus ring uses the generated accent color.
                </p>
              </div>
            </div>

            <div
              className="rounded-lg border border-l-4 p-4"
              role="status"
              style={{
                ...raisedStyle,
                borderLeftColor: tokens.success
              }}
            >
              <div className="flex gap-3">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: tokens.success }} aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold">Accessible palette ready</p>
                  <p className="text-sm" style={{ color: tokens.muted }}>
                    Use these tokens for readable alerts, status messages, and inline feedback.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div
              className="rounded-lg border p-4"
              style={surfaceStyle}
            >
              <p className="text-sm font-semibold">Card preview</p>
              <p className="mt-1 text-sm" style={{ color: tokens.muted }}>
                Test how body copy, links, borders, and primary actions feel together.
              </p>
              <div className="mt-4 rounded-md border p-3" style={raisedStyle}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">Audit summary</p>
                    <p className="text-xs" style={{ color: tokens.muted }}>
                      18 checks passed
                    </p>
                  </div>
                  <span
                    className="rounded-full px-2.5 py-1 text-xs font-semibold"
                    style={{
                      backgroundColor: tokens.success,
                      color: tokens.successForeground
                    }}
                  >
                    Good
                  </span>
                </div>
                <button
                  type="button"
                  className="mt-4 w-full"
                  style={{
                    ...buttonBaseStyle,
                    backgroundColor: tokens.primary,
                    color: tokens.primaryForeground
                  }}
                >
                  Review report
                </button>
              </div>
            </div>

            <div
              className="rounded-lg border p-4"
              style={surfaceStyle}
            >
              <div className="mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" aria-hidden="true" />
                <p className="text-sm font-semibold">Chart preview</p>
              </div>
              <div role="img" aria-label={`${tokens.name} chart color preview`} className="space-y-2">
                {chartBars.map((bar) => (
                  <div key={bar.label} className="grid grid-cols-[3.5rem_1fr_2rem] items-center gap-2 text-xs">
                    <span style={{ color: tokens.muted }}>{bar.label}</span>
                    <div
                      className="h-3 overflow-hidden rounded-full"
                      style={{ backgroundColor: tokens.disabled }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${bar.value}%`,
                          backgroundColor: bar.color
                        }}
                      />
                    </div>
                    <span className="text-right" style={{ color: tokens.muted }}>{bar.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded-lg border p-4"
              style={surfaceStyle}
            >
              <div className="flex gap-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: tokens.warning }} aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold">Warning state</p>
                  <p className="text-sm" style={{ color: tokens.muted }}>
                    Warning and error colors are checked against their text color before display.
                  </p>
                  <a
                    href="/wcag/1-4-3"
                    className="mt-2 inline-block rounded text-sm font-semibold underline underline-offset-4"
                    style={{
                      color: tokens.primary,
                      outline: `2px solid ${tokens.focus}`,
                      outlineOffset: "3px"
                    }}
                  >
                    WCAG 1.4.3 reference
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderColorGroup = (title: string, colors: ColorData[]) => (
    <div>
      <h3 className="font-semibold mb-3 text-lg">{title}</h3>
      <div className="space-y-3">
        {colors.map((color, index) => (
          <button
            key={`${title}-${color.hex}-${index}`}
            type="button"
            className="group relative w-full overflow-hidden rounded-lg border text-left transition-all hover:ring-2 hover:ring-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            onClick={() => copyColor(color.hex)}
            aria-label={`Copy ${color.hex} from the ${title} palette`}
          >
            <span
              className="block h-16 w-full"
              style={{ backgroundColor: color.hex }}
              aria-hidden="true"
            />
            <span className="block p-3">
              <span className="flex items-center justify-between">
                <span>
                  <span className="block font-mono text-sm font-medium">{color.hex}</span>
                  <span className="block text-xs text-muted-foreground">{color.name}</span>
                </span>
                {copied === color.hex && (
                  <CheckCircle className="h-4 w-4 text-green-600" aria-hidden="true" />
                )}
              </span>
              <span className="mt-2 block text-xs text-muted-foreground">
                <span className="block">HSL: {color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%</span>
                <span className="block">RGB: {color.rgb.r}, {color.rgb.g}, {color.rgb.b}</span>
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )

  // Generate initial palette
  useEffect(() => {
    const timer = window.setTimeout(() => {
      generatePalette()
    }, 0)

    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="max-w-6xl mx-auto">
      {/* Controls */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Generate Color Palette
          </CardTitle>
          <CardDescription>
            Create accessible color palettes using color theory principles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="base-color">Base Color</Label>
              <div className="flex gap-2">
                <Input
                  id="base-color"
                  type="color"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="w-20 h-10 p-1 border rounded"
                />
                <Input
                  type="text"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="flex-1"
                  placeholder="#3b82f6"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={randomizeBaseColor}
                  title="Random color"
                >
                  <Shuffle className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="harmony">Color Harmony</Label>
              <Select value={harmony} onValueChange={(value) => setHarmony(value as ColorHarmony)}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select harmony" />
                </SelectTrigger>
                <SelectContent className="bg-background border">
                  <SelectItem value="complementary">Complementary</SelectItem>
                  <SelectItem value="analogous">Analogous</SelectItem>
                  <SelectItem value="triadic">Triadic</SelectItem>
                  <SelectItem value="monochromatic">Monochromatic</SelectItem>
                  <SelectItem value="split-complementary">Split Complementary</SelectItem>
                  <SelectItem value="tetradic">Tetradic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <Button 
                onClick={generatePalette}
                disabled={isGenerating}
                className="flex-1"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {palette && (
        <div className="space-y-8">
          {/* Palette Overview */}
          <Card>
            <CardHeader>
              <div className="flex flex-col items-start gap-4 md:!flex-row md:items-center md:justify-between md:gap-0">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    {palette.name}
                  </CardTitle>
                  <CardDescription>
                    {palette.harmony.charAt(0).toUpperCase() + palette.harmony.slice(1)} color harmony
                  </CardDescription>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Button
                    variant="outline"
                    onClick={copyPalette}
                  >
                    {copied === 'palette' ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy CSS
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => exportPalette('json')}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {renderColorGroup("Primary", palette.primary)}
                {renderColorGroup("Secondary", palette.secondary)}
                {renderColorGroup("Accent", palette.accent)}
                {renderColorGroup("Neutral", palette.neutral)}
              </div>
            </CardContent>
          </Card>

          {/* Live UI Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Live UI Preview
              </CardTitle>
              <CardDescription>
                See the palette applied to real interface states before using it in a design system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6">
                {renderLivePreview(getPreviewTokens(palette, "light"))}
                {renderLivePreview(getPreviewTokens(palette, "dark"))}
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export Palette
              </CardTitle>
              <CardDescription>
                Download your palette in various formats for different tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  onClick={() => exportPalette('css')}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <Settings className="h-6 w-6" />
                  <span>CSS Variables</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => exportPalette('scss')}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <Settings className="h-6 w-6" />
                  <span>SCSS Variables</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => exportPalette('json')}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <Save className="h-6 w-6" />
                  <span>JSON Data</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={copyPalette}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <Copy className="h-6 w-6" />
                  <span>Copy CSS</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Accessibility Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Accessibility Notes
              </CardTitle>
              <CardDescription>
                Important considerations for using these colors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Remember:</strong> Always test color combinations for sufficient contrast before using them in your designs. 
                  Use our <a href="/tools/contrast-checker" className="text-primary hover:underline">Contrast Checker</a> to validate 
                  text and background color combinations meet WCAG requirements.
                </AlertDescription>
              </Alert>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="mb-2 flex items-center gap-2 font-semibold">
                    <CheckCircle className="h-4 w-4 text-green-600" aria-hidden="true" />
                    Good Practices:
                  </h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Test with real users</li>
                    <li>• Ensure 4.5:1 contrast for normal text</li>
                    <li>• Use tools to verify accessibility</li>
                    <li>• Consider colorblind users</li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 flex items-center gap-2 font-semibold">
                    <AlertTriangle className="h-4 w-4 text-amber-600" aria-hidden="true" />
                    Avoid:
                  </h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Relying only on color for information</li>
                    <li>• Very bright or saturated backgrounds</li>
                    <li>• Red-green combinations for critical info</li>
                    <li>• Insufficient contrast ratios</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
