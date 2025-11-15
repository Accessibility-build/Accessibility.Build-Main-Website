"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Copy, Info, Check, RefreshCw, Palette, Eye, Zap } from "lucide-react"

export default function ContrastCheckerPage() {
  const [foreground, setForeground] = useState("#000000")
  const [background, setBackground] = useState("#FFFFFF")
  const [contrastRatio, setContrastRatio] = useState(21)
  const [wcagAA, setWcagAA] = useState(true)
  const [wcagAAA, setWcagAAA] = useState(true)
  const [copied, setCopied] = useState(false)
  const [wcagVersion, setWcagVersion] = useState<"2.2" | "3.0">("2.2")
  const [textSize, setTextSize] = useState<"normal" | "large">("normal")

  // RGB values for sliders
  const [foregroundRGB, setForegroundRGB] = useState({ r: 0, g: 0, b: 0 })
  const [backgroundRGB, setBackgroundRGB] = useState({ r: 255, g: 255, b: 255 })

  // WCAG 3.0 APCA calculation
  const calculateAPCA = (fgLuminance: number, bgLuminance: number) => {
    const Ybg = bgLuminance
    const Yfg = fgLuminance
    
    // APCA constants
    const Ntx = 0.57
    const Nrx = 0.62
    const Rco = 0.55
    const Rca = 0.43
    const Rbc = 0.1
    const Rtx = 0.1
    
    let Yc = Ybg
    let Yt = Yfg
    
    // Clamp and normalize
    Yc = Math.max(Yc, 0.022)
    Yt = Math.max(Yt, 0.022)
    
    // Calculate contrast
    let contrast = 0
    if (Yc > Yt) {
      contrast = (Math.pow(Yc, Nrx) - Math.pow(Yt, Ntx)) * 1.414
    } else {
      contrast = (Math.pow(Yc, Nrx) - Math.pow(Yt, Ntx)) * 1.414
    }
    
    // Apply scaling
    if (Math.abs(contrast) < Rtx) contrast = 0
    else if (contrast > 0) contrast = contrast - Rco
    else contrast = contrast + Rco
    
    return Math.round(contrast * 100)
  }

  // Calculate contrast ratio
  useEffect(() => {
    const calculateContrastRatio = () => {
      // Convert hex to RGB
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result
          ? {
              r: Number.parseInt(result[1], 16),
              g: Number.parseInt(result[2], 16),
              b: Number.parseInt(result[3], 16),
            }
          : { r: 0, g: 0, b: 0 }
      }

      // Calculate relative luminance
      const calculateLuminance = (rgb: { r: number; g: number; b: number }) => {
        const { r, g, b } = rgb
        const rsrgb = r / 255
        const gsrgb = g / 255
        const bsrgb = b / 255

        const r1 = rsrgb <= 0.03928 ? rsrgb / 12.92 : Math.pow((rsrgb + 0.055) / 1.055, 2.4)
        const g1 = gsrgb <= 0.03928 ? gsrgb / 12.92 : Math.pow((gsrgb + 0.055) / 1.055, 2.4)
        const b1 = bsrgb <= 0.03928 ? bsrgb / 12.92 : Math.pow((bsrgb + 0.055) / 1.055, 2.4)

        return 0.2126 * r1 + 0.7152 * g1 + 0.0722 * b1
      }

      const fgRGB = hexToRgb(foreground)
      const bgRGB = hexToRgb(background)

      const fgLuminance = calculateLuminance(fgRGB)
      const bgLuminance = calculateLuminance(bgRGB)

      if (wcagVersion === "2.2") {
      const ratio = (Math.max(fgLuminance, bgLuminance) + 0.05) / (Math.min(fgLuminance, bgLuminance) + 0.05)
      setContrastRatio(Math.round(ratio * 100) / 100)

        // Check WCAG 2.2 compliance
        if (textSize === "normal") {
      setWcagAA(ratio >= 4.5)
      setWcagAAA(ratio >= 7)
        } else {
          setWcagAA(ratio >= 3)
          setWcagAAA(ratio >= 4.5)
        }
      } else {
        // WCAG 3.0 APCA
        const apcaScore = calculateAPCA(fgLuminance, bgLuminance)
        setContrastRatio(Math.abs(apcaScore))

        // WCAG 3.0 compliance thresholds (simplified)
        if (textSize === "normal") {
          setWcagAA(Math.abs(apcaScore) >= 60)
          setWcagAAA(Math.abs(apcaScore) >= 75)
        } else {
          setWcagAA(Math.abs(apcaScore) >= 45)
          setWcagAAA(Math.abs(apcaScore) >= 60)
        }
      }
    }

    calculateContrastRatio()
  }, [foreground, background, wcagVersion, textSize])

  // Update RGB values when hex changes
  useEffect(() => {
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result
        ? {
            r: Number.parseInt(result[1], 16),
            g: Number.parseInt(result[2], 16),
            b: Number.parseInt(result[3], 16),
          }
        : { r: 0, g: 0, b: 0 }
    }

    setForegroundRGB(hexToRgb(foreground))
    setBackgroundRGB(hexToRgb(background))
  }, [foreground, background])

  // Update hex when RGB changes
  const updateForegroundFromRGB = (newRGB: { r: number; g: number; b: number }) => {
    const { r, g, b } = newRGB
    setForeground(
      `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`,
    )
  }

  const updateBackgroundFromRGB = (newRGB: { r: number; g: number; b: number }) => {
    const { r, g, b } = newRGB
    setBackground(
      `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`,
    )
  }

  // Validate hex color
  const isValidHex = (hex: string) => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)
  }

  // Copy color combination
  const copyColorCombination = () => {
    const versionText = wcagVersion === "2.2" ? `${contrastRatio}:1` : `${contrastRatio}Lc`
    const text = `Foreground: ${foreground}\nBackground: ${background}\nWCAG ${wcagVersion} ${wcagVersion === "2.2" ? "Contrast Ratio" : "APCA Score"}: ${versionText}\nText Size: ${textSize}\nAA: ${wcagAA ? "Pass" : "Fail"}\nAAA: ${wcagAAA ? "Pass" : "Fail"}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Helper functions for color calculations
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 }
  }

  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  // Color scheme types
  const [selectedScheme, setSelectedScheme] = useState<string>('professional')
  const [showRecommendations, setShowRecommendations] = useState<boolean>(false)

  const colorSchemes = {
    monochrome: "Monochrome",
    complementary: "Complementary",
    professional: "Professional",
    highContrast: "High Contrast"
  }

  // Calculate exact foreground color needed for target contrast ratio
  const calculateTargetForeground = (bgColor: string, targetRatio: number, isDark: boolean = true) => {
    const bgRgb = hexToRgb(bgColor)
    if (!bgRgb) return null
    
    const bgLum = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b)
    
    // Calculate required luminance for target ratio
    let targetLum: number
    if (isDark) {
      // For dark text: (bgLum + 0.05) / (targetLum + 0.05) = targetRatio
      targetLum = (bgLum + 0.05) / targetRatio - 0.05
    } else {
      // For light text: (targetLum + 0.05) / (bgLum + 0.05) = targetRatio
      targetLum = targetRatio * (bgLum + 0.05) - 0.05
    }
    
    // Clamp luminance between 0 and 1
    targetLum = Math.max(0, Math.min(1, targetLum))
    
    // Convert luminance back to RGB (approximate grayscale)
    const gamma = 2.4
    let value = targetLum <= 0.03928 ? targetLum * 12.92 : Math.pow((targetLum + 0.055) / 1.055, 1 / gamma)
    value = Math.round(value * 255)
    
    const hex = `#${value.toString(16).padStart(2, '0')}${value.toString(16).padStart(2, '0')}${value.toString(16).padStart(2, '0')}`
    return hex
  }

  // Generate accessible foreground colors for a given background
  const generateAccessibleForegrounds = (bgColor: string) => {
    const bgRgb = hexToRgb(bgColor)
    if (!bgRgb) return []
    
    const bgLum = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b)
    const targetRatio = textSize === "normal" ? 4.5 : 3.0
    const suggestions: Array<{fg: string, bg: string, name: string, ratio: number, apca: number}> = []
    
    // Calculate exact colors for target ratios
    const exactDark = calculateTargetForeground(bgColor, targetRatio, true)
    const exactLight = calculateTargetForeground(bgColor, targetRatio, false)
    const exactAAA = calculateTargetForeground(bgColor, textSize === "normal" ? 7.0 : 4.5, true)
    
    // Add calculated exact matches
    if (exactDark) {
      const darkRgb = hexToRgb(exactDark)
      if (darkRgb) {
        const darkLum = getLuminance(darkRgb.r, darkRgb.g, darkRgb.b)
        const ratio = (Math.max(bgLum, darkLum) + 0.05) / (Math.min(bgLum, darkLum) + 0.05)
        suggestions.push({
          fg: exactDark,
          bg: bgColor,
          name: `Exact ${targetRatio.toFixed(1)}:1 dark text`,
          ratio,
          apca: Math.abs(calculateAPCA(darkLum, bgLum))
        })
      }
    }
    
    if (exactLight && exactLight !== exactDark) {
      const lightRgb = hexToRgb(exactLight)
      if (lightRgb) {
        const lightLum = getLuminance(lightRgb.r, lightRgb.g, lightRgb.b)
        const ratio = (Math.max(bgLum, lightLum) + 0.05) / (Math.min(bgLum, lightLum) + 0.05)
        suggestions.push({
          fg: exactLight,
          bg: bgColor,
          name: `Exact ${targetRatio.toFixed(1)}:1 light text`,
          ratio,
          apca: Math.abs(calculateAPCA(lightLum, bgLum))
        })
      }
    }
    
    if (exactAAA && exactAAA !== exactDark) {
      const aaaRgb = hexToRgb(exactAAA)
      if (aaaRgb) {
        const aaaLum = getLuminance(aaaRgb.r, aaaRgb.g, aaaRgb.b)
        const ratio = (Math.max(bgLum, aaaLum) + 0.05) / (Math.min(bgLum, aaaLum) + 0.05)
        suggestions.push({
          fg: exactAAA,
          bg: bgColor,
          name: `AAA compliant text`,
          ratio,
          apca: Math.abs(calculateAPCA(aaaLum, bgLum))
        })
      }
    }
    
    // Add pure black/white if they meet requirements
    const blackRatio = (Math.max(bgLum, 0) + 0.05) / (Math.min(bgLum, 0) + 0.05)
    const whiteRatio = (Math.max(bgLum, 1) + 0.05) / (Math.min(bgLum, 1) + 0.05)
    
    if (blackRatio >= targetRatio && !suggestions.find(s => s.fg === '#000000')) {
      suggestions.push({
        fg: '#000000',
        bg: bgColor,
        name: 'Pure black text',
        ratio: blackRatio,
        apca: Math.abs(calculateAPCA(0, bgLum))
      })
    }
    
    if (whiteRatio >= targetRatio && !suggestions.find(s => s.fg === '#ffffff')) {
      suggestions.push({
        fg: '#ffffff',
        bg: bgColor,
        name: 'Pure white text',
        ratio: whiteRatio,
        apca: Math.abs(calculateAPCA(1, bgLum))
      })
    }
    
    return suggestions.slice(0, 3)
  }

  // Calculate exact background color needed for target contrast ratio
  const calculateTargetBackground = (fgColor: string, targetRatio: number, isLight: boolean = true) => {
    const fgRgb = hexToRgb(fgColor)
    if (!fgRgb) return null
    
    const fgLum = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b)
    
    // Calculate required luminance for target ratio
    let targetLum: number
    if (isLight) {
      // For light background: (targetLum + 0.05) / (fgLum + 0.05) = targetRatio
      targetLum = targetRatio * (fgLum + 0.05) - 0.05
    } else {
      // For dark background: (fgLum + 0.05) / (targetLum + 0.05) = targetRatio
      targetLum = (fgLum + 0.05) / targetRatio - 0.05
    }
    
    // Clamp luminance between 0 and 1
    targetLum = Math.max(0, Math.min(1, targetLum))
    
    // Convert luminance back to RGB (approximate grayscale)
    const gamma = 2.4
    let value = targetLum <= 0.03928 ? targetLum * 12.92 : Math.pow((targetLum + 0.055) / 1.055, 1 / gamma)
    value = Math.round(value * 255)
    
    const hex = `#${value.toString(16).padStart(2, '0')}${value.toString(16).padStart(2, '0')}${value.toString(16).padStart(2, '0')}`
    return hex
  }

  // Generate accessible background colors for a given foreground
  const generateAccessibleBackgrounds = (fgColor: string) => {
    const fgRgb = hexToRgb(fgColor)
    if (!fgRgb) return []
    
    const fgLum = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b)
    const targetRatio = textSize === "normal" ? 4.5 : 3.0
    const suggestions: Array<{fg: string, bg: string, name: string, ratio: number, apca: number}> = []
    
    // Calculate exact colors for target ratios
    const exactLight = calculateTargetBackground(fgColor, targetRatio, true)
    const exactDark = calculateTargetBackground(fgColor, targetRatio, false)
    const exactAAA = calculateTargetBackground(fgColor, textSize === "normal" ? 7.0 : 4.5, true)
    
    // Add calculated exact matches
    if (exactLight) {
      const lightRgb = hexToRgb(exactLight)
      if (lightRgb) {
        const lightLum = getLuminance(lightRgb.r, lightRgb.g, lightRgb.b)
        const ratio = (Math.max(fgLum, lightLum) + 0.05) / (Math.min(fgLum, lightLum) + 0.05)
        suggestions.push({
          fg: fgColor,
          bg: exactLight,
          name: `Exact ${targetRatio.toFixed(1)}:1 light background`,
          ratio,
          apca: Math.abs(calculateAPCA(fgLum, lightLum))
        })
      }
    }
    
    if (exactDark && exactDark !== exactLight) {
      const darkRgb = hexToRgb(exactDark)
      if (darkRgb) {
        const darkLum = getLuminance(darkRgb.r, darkRgb.g, darkRgb.b)
        const ratio = (Math.max(fgLum, darkLum) + 0.05) / (Math.min(fgLum, darkLum) + 0.05)
        suggestions.push({
          fg: fgColor,
          bg: exactDark,
          name: `Exact ${targetRatio.toFixed(1)}:1 dark background`,
          ratio,
          apca: Math.abs(calculateAPCA(fgLum, darkLum))
        })
      }
    }
    
    if (exactAAA && exactAAA !== exactLight) {
      const aaaRgb = hexToRgb(exactAAA)
      if (aaaRgb) {
        const aaaLum = getLuminance(aaaRgb.r, aaaRgb.g, aaaRgb.b)
        const ratio = (Math.max(fgLum, aaaLum) + 0.05) / (Math.min(fgLum, aaaLum) + 0.05)
        suggestions.push({
          fg: fgColor,
          bg: exactAAA,
          name: `AAA compliant background`,
          ratio,
          apca: Math.abs(calculateAPCA(fgLum, aaaLum))
        })
      }
    }
    
    // Add pure white/black if they meet requirements
    const whiteRatio = (Math.max(fgLum, 1) + 0.05) / (Math.min(fgLum, 1) + 0.05)
    const blackRatio = (Math.max(fgLum, 0) + 0.05) / (Math.min(fgLum, 0) + 0.05)
    
    if (whiteRatio >= targetRatio && !suggestions.find(s => s.bg === '#ffffff')) {
      suggestions.push({
        fg: fgColor,
        bg: '#ffffff',
        name: 'Pure white background',
        ratio: whiteRatio,
        apca: Math.abs(calculateAPCA(fgLum, 1))
      })
    }
    
    if (blackRatio >= targetRatio && !suggestions.find(s => s.bg === '#000000')) {
      suggestions.push({
        fg: fgColor,
        bg: '#000000',
        name: 'Pure black background',
        ratio: blackRatio,
        apca: Math.abs(calculateAPCA(fgLum, 0))
      })
    }
    
    return suggestions.slice(0, 3)
  }

  // Generate color recommendations based on scheme
  const generateColorRecommendations = (currentFg: string, currentBg: string) => {
    const recommendations: Array<{fg: string, bg: string, name: string, ratio?: number, apca?: number, category?: string}> = []
    
    // First approach: Keep background same, adjust foreground
    const fgSuggestions = generateAccessibleForegrounds(currentBg)
    fgSuggestions.forEach(suggestion => {
      recommendations.push({
        ...suggestion,
        category: 'Keep Background'
      })
    })
    
    // Second approach: Keep foreground same, adjust background  
    const bgSuggestions = generateAccessibleBackgrounds(currentFg)
    bgSuggestions.forEach(suggestion => {
      recommendations.push({
        ...suggestion,
        category: 'Keep Foreground'
      })
    })
    
    // Third approach: Alternative combinations (always show some alternatives)
    const alternatives = [
      { fg: '#000000', bg: '#FFFFFF', name: 'Black on white (classic)', category: 'Alternative' },
      { fg: '#FFFFFF', bg: '#000000', name: 'White on black (classic)', category: 'Alternative' },
      { fg: '#1f2937', bg: '#f9fafb', name: 'Dark gray on light gray', category: 'Alternative' },
      { fg: '#ffffff', bg: '#1f2937', name: 'White on dark gray', category: 'Alternative' },
      { fg: '#1e40af', bg: '#eff6ff', name: 'Blue on light blue', category: 'Alternative' },
      { fg: '#dc2626', bg: '#fef2f2', name: 'Red on light red', category: 'Alternative' }
    ]
    
    // Calculate ratios for alternatives
    alternatives.forEach(alt => {
      const fgRgb = hexToRgb(alt.fg)
      const bgRgb = hexToRgb(alt.bg)
      
      if (fgRgb && bgRgb) {
        const fgLum = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b)
        const bgLum = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b)
        const ratio = (Math.max(fgLum, bgLum) + 0.05) / (Math.min(fgLum, bgLum) + 0.05)
        const apca = Math.abs(calculateAPCA(fgLum, bgLum))
        
        recommendations.push({
          ...alt,
          ratio,
          apca
        })
      }
    })
    
    // Sort by category priority and then by contrast ratio
    return recommendations
      .filter(rec => rec.ratio && rec.ratio >= (textSize === "normal" ? 4.5 : 3.0))
      .sort((a, b) => {
        // Priority: Keep Background > Keep Foreground > Alternative
        const categoryOrder = { 'Keep Background': 0, 'Keep Foreground': 1, 'Alternative': 2 }
        const aPriority = categoryOrder[a.category as keyof typeof categoryOrder] || 3
        const bPriority = categoryOrder[b.category as keyof typeof categoryOrder] || 3
        
        if (aPriority !== bPriority) return aPriority - bPriority
        return (b.ratio || 0) - (a.ratio || 0) // Then by highest contrast
      })
      .slice(0, 9) // Increase limit to show more recommendations
  }

  // Generate accessible color suggestions
  const generateAccessibleColors = () => {
    const suggestions = [
      { fg: "#000000", bg: "#FFFFFF", name: "Classic Black on White" },
      { fg: "#FFFFFF", bg: "#000000", name: "Classic White on Black" },
      { fg: "#1f2937", bg: "#f9fafb", name: "Dark Gray on Light Gray" },
      { fg: "#0f172a", bg: "#e2e8f0", name: "Slate Dark on Light" },
      { fg: "#1e40af", bg: "#dbeafe", name: "Blue on Light Blue" },
      { fg: "#dc2626", bg: "#fef2f2", name: "Red on Light Red" },
      { fg: "#059669", bg: "#ecfdf5", name: "Green on Light Green" },
      { fg: "#7c2d12", bg: "#fed7aa", name: "Brown on Light Orange" },
    ]
    
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
    setForeground(randomSuggestion.fg)
    setBackground(randomSuggestion.bg)
  }

  // Apply recommended color combination
  const applyRecommendation = (fg: string, bg: string) => {
    setForeground(fg)
    setBackground(bg)
    setShowRecommendations(false)
  }

  // Get smart recommendations based on current colors
  const getSmartRecommendations = () => {
    if (!wcagAA || showRecommendations) {
      return generateColorRecommendations(foreground, background)
    }
    return []
  }

  // Swap colors
  const swapColors = () => {
    const tempFg = foreground
    const tempBg = background
    setForeground(tempBg)
    setBackground(tempFg)
  }

  // Generate random colors
  const generateRandomColors = () => {
    const randomHex = () => {
      return `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")}`
    }

    setForeground(randomHex())
    setBackground(randomHex())
  }

  return (
    <div className="container-wide py-12">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Palette className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Advanced Color Contrast Checker</h1>
        </div>
        <p className="text-xl text-muted-foreground mb-6">
          Test color combinations against WCAG 2.2 and 3.0 standards with professional-grade accuracy.
        </p>
        
        {/* WCAG Version Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center space-x-3">
            <Label htmlFor="wcag-version" className="text-sm font-medium">
              WCAG Version:
            </Label>
            <div className="flex items-center space-x-2">
              <Badge variant={wcagVersion === "2.2" ? "default" : "secondary"} className="cursor-pointer">
                2.2
              </Badge>
              <Switch
                id="wcag-version"
                checked={wcagVersion === "3.0"}
                onCheckedChange={(checked) => setWcagVersion(checked ? "3.0" : "2.2")}
              />
              <Badge variant={wcagVersion === "3.0" ? "default" : "secondary"} className="cursor-pointer">
                3.0 <Zap className="h-3 w-3 ml-1" />
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Label htmlFor="text-size" className="text-sm font-medium">
              Text Size:
            </Label>
            <div className="flex items-center space-x-2">
              <Badge variant={textSize === "normal" ? "default" : "secondary"} className="cursor-pointer">
                Normal
              </Badge>
              <Switch
                id="text-size"
                checked={textSize === "large"}
                onCheckedChange={(checked) => setTextSize(checked ? "large" : "normal")}
              />
              <Badge variant={textSize === "large" ? "default" : "secondary"} className="cursor-pointer">
                Large
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Color Picker */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Color Picker</CardTitle>
              <CardDescription>Adjust colors using hex values or RGB sliders.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="hex">
                <TabsList className="mb-4">
                  <TabsTrigger value="hex">Hex Values</TabsTrigger>
                  <TabsTrigger value="rgb">RGB Sliders</TabsTrigger>
                </TabsList>

                <TabsContent value="hex" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="foreground-hex">Foreground Color</Label>
                      <div className="flex">
                        <input
                          type="color"
                          value={foreground}
                          onChange={(e) => setForeground(e.target.value)}
                          className="h-10 w-10 rounded-l-md border cursor-pointer"
                        />
                        <Input
                          id="foreground-hex"
                          value={foreground}
                          onChange={(e) => {
                            const value = e.target.value
                            if (value.startsWith('#') && value.length <= 7) {
                              setForeground(value)
                            }
                          }}
                          className="rounded-l-none font-mono"
                          placeholder="#000000"
                        />
                      </div>
                      {!isValidHex(foreground) && (
                        <p className="text-sm text-destructive">Invalid hex color format</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="background-hex">Background Color</Label>
                      <div className="flex">
                        <input
                          type="color"
                          value={background}
                          onChange={(e) => setBackground(e.target.value)}
                          className="h-10 w-10 rounded-l-md border cursor-pointer"
                        />
                        <Input
                          id="background-hex"
                          value={background}
                          onChange={(e) => {
                            const value = e.target.value
                            if (value.startsWith('#') && value.length <= 7) {
                              setBackground(value)
                            }
                          }}
                          className="rounded-l-none font-mono"
                          placeholder="#FFFFFF"
                        />
                      </div>
                      {!isValidHex(background) && (
                        <p className="text-sm text-destructive">Invalid hex color format</p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="rgb" className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Foreground Color</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="foreground-r">Red ({foregroundRGB.r})</Label>
                        </div>
                        <Slider
                          id="foreground-r"
                          min={0}
                          max={255}
                          step={1}
                          value={[foregroundRGB.r]}
                          onValueChange={(value) => {
                            const newRGB = { ...foregroundRGB, r: value[0] }
                            setForegroundRGB(newRGB)
                            updateForegroundFromRGB(newRGB)
                          }}
                          className="[&_[role=slider]]:bg-red-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="foreground-g">Green ({foregroundRGB.g})</Label>
                        </div>
                        <Slider
                          id="foreground-g"
                          min={0}
                          max={255}
                          step={1}
                          value={[foregroundRGB.g]}
                          onValueChange={(value) => {
                            const newRGB = { ...foregroundRGB, g: value[0] }
                            setForegroundRGB(newRGB)
                            updateForegroundFromRGB(newRGB)
                          }}
                          className="[&_[role=slider]]:bg-green-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="foreground-b">Blue ({foregroundRGB.b})</Label>
                        </div>
                        <Slider
                          id="foreground-b"
                          min={0}
                          max={255}
                          step={1}
                          value={[foregroundRGB.b]}
                          onValueChange={(value) => {
                            const newRGB = { ...foregroundRGB, b: value[0] }
                            setForegroundRGB(newRGB)
                            updateForegroundFromRGB(newRGB)
                          }}
                          className="[&_[role=slider]]:bg-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Background Color</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="background-r">Red ({backgroundRGB.r})</Label>
                        </div>
                        <Slider
                          id="background-r"
                          min={0}
                          max={255}
                          step={1}
                          value={[backgroundRGB.r]}
                          onValueChange={(value) => {
                            const newRGB = { ...backgroundRGB, r: value[0] }
                            setBackgroundRGB(newRGB)
                            updateBackgroundFromRGB(newRGB)
                          }}
                          className="[&_[role=slider]]:bg-red-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="background-g">Green ({backgroundRGB.g})</Label>
                        </div>
                        <Slider
                          id="background-g"
                          min={0}
                          max={255}
                          step={1}
                          value={[backgroundRGB.g]}
                          onValueChange={(value) => {
                            const newRGB = { ...backgroundRGB, g: value[0] }
                            setBackgroundRGB(newRGB)
                            updateBackgroundFromRGB(newRGB)
                          }}
                          className="[&_[role=slider]]:bg-green-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="background-b">Blue ({backgroundRGB.b})</Label>
                        </div>
                        <Slider
                          id="background-b"
                          min={0}
                          max={255}
                          step={1}
                          value={[backgroundRGB.b]}
                          onValueChange={(value) => {
                            const newRGB = { ...backgroundRGB, b: value[0] }
                            setBackgroundRGB(newRGB)
                            updateBackgroundFromRGB(newRGB)
                          }}
                          className="[&_[role=slider]]:bg-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-muted-foreground">
                  Tip: Use the color pickers for precise selection
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={generateAccessibleColors}>
                    <Palette className="h-4 w-4 mr-2" />
                    Accessible Colors
                  </Button>
                  <Button variant="outline" size="sm" onClick={generateRandomColors}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Random
                  </Button>
                  <Button variant="outline" size="sm" onClick={swapColors}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Swap
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Live Preview
              </CardTitle>
              <CardDescription>See how your text looks with the selected colors in different contexts.</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="p-8 rounded-lg mb-6 transition-all duration-300 border"
                style={{ backgroundColor: background, color: foreground }}
              >
                <h2 className={`font-bold mb-3 ${textSize === "large" ? "text-3xl" : "text-xl"}`}>
                  Sample Heading
                </h2>
                <p className={`mb-4 leading-relaxed ${textSize === "large" ? "text-lg" : "text-base"}`}>
                  This is an example of how your text will look with the selected color combination. 
                  The text should be easily readable for all users, including those with visual impairments.
                </p>
                <div className="flex gap-3 flex-wrap">
                <Button
                    className="transition-all duration-300"
                  style={{
                    backgroundColor: foreground,
                    color: background,
                    borderColor: foreground,
                  }}
                    size={textSize === "large" ? "lg" : "default"}
                  >
                    Primary Button
                  </Button>
                  <Button
                    variant="outline"
                    className="transition-all duration-300"
                    style={{
                      borderColor: foreground,
                      color: foreground,
                    }}
                    size={textSize === "large" ? "lg" : "default"}
                  >
                    Secondary Button
                </Button>
              </div>

                {/* Additional preview elements */}
                <div className="mt-6 pt-4 border-t" style={{ borderColor: foreground + "40" }}>
                  <p className={`${textSize === "large" ? "text-base" : "text-sm"} opacity-80`}>
                    Small text example for testing readability at different sizes.
                  </p>
                  <a href="#" className="underline hover:no-underline" style={{ color: foreground }}>
                    Sample Link
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="h-8 w-8 rounded-md border-2 border-muted-foreground/20 shadow-sm" 
                    style={{ backgroundColor: foreground }}
                  ></div>
                  <div className="text-sm">
                    <div className="font-mono font-medium">{foreground}</div>
                    <div className="text-muted-foreground">Foreground</div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={swapColors} aria-label="Swap colors">
                  <RefreshCw className="h-4 w-4" />
                </Button>
                  <Button variant="ghost" size="sm" onClick={generateAccessibleColors} aria-label="Generate accessible colors">
                    <Palette className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-sm text-right">
                    <div className="font-mono font-medium">{background}</div>
                    <div className="text-muted-foreground">Background</div>
                  </div>
                  <div 
                    className="h-8 w-8 rounded-md border-2 border-muted-foreground/20 shadow-sm" 
                    style={{ backgroundColor: background }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Contrast Results
                <Badge variant="outline" className="ml-auto">
                  WCAG {wcagVersion}
                </Badge>
              </CardTitle>
              <CardDescription>
                {wcagVersion === "2.2" 
                  ? "WCAG 2.2 contrast ratio compliance information" 
                  : "WCAG 3.0 APCA (Advanced Perceptual Contrast Algorithm) results"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-5xl font-bold mb-2">
                  {wcagVersion === "2.2" ? `${contrastRatio}:1` : `${contrastRatio}Lc`}
              </div>
                <div className="text-sm text-muted-foreground">
                  {wcagVersion === "2.2" ? "Contrast Ratio" : "APCA Score"}
                  </div>
                {wcagVersion === "3.0" && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Higher scores indicate better contrast
                  </div>
                )}
                </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${wcagAA ? "bg-green-500" : "bg-red-500"}`} />
                    <span className="font-medium">
                      {wcagVersion === "2.2" ? "AA Level" : "Bronze Level"} ({textSize} text)
                    </span>
                  </div>
                  <Badge variant={wcagAA ? "default" : "destructive"}>
                    {wcagAA ? "Pass" : "Fail"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${wcagAAA ? "bg-green-500" : "bg-red-500"}`} />
                    <span className="font-medium">
                      {wcagVersion === "2.2" ? "AAA Level" : "Silver Level"} ({textSize} text)
                    </span>
                  </div>
                  <Badge variant={wcagAAA ? "default" : "destructive"}>
                    {wcagAAA ? "Pass" : "Fail"}
                  </Badge>
                </div>

                {/* Thresholds info */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    {wcagVersion === "2.2" ? "WCAG 2.2 Requirements" : "WCAG 3.0 Requirements"}
                  </h4>
                  <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    {wcagVersion === "2.2" ? (
                      <>
                        <div>• AA Level: {textSize === "normal" ? "4.5:1" : "3:1"} minimum</div>
                        <div>• AAA Level: {textSize === "normal" ? "7:1" : "4.5:1"} minimum</div>
                      </>
                    ) : (
                      <>
                        <div>• Bronze Level: {textSize === "normal" ? "60Lc" : "45Lc"} minimum</div>
                        <div>• Silver Level: {textSize === "normal" ? "75Lc" : "60Lc"} minimum</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={copyColorCombination}>
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Results
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Color Recommendations */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Smart Color Recommendations
                {!wcagAA && (
                  <Badge variant="destructive" className="ml-auto">
                    Improvement Needed
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {!wcagAA 
                  ? "Your current combination doesn't meet accessibility standards. Try these alternatives:" 
                  : "Explore different color schemes while maintaining accessibility."
                }
              </CardDescription>
            </CardHeader>
            <CardContent>

              {/* Show recommendations button if not failing */}
              {wcagAA && !showRecommendations && (
                <div className="text-center py-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowRecommendations(true)}
                    className="w-full"
                  >
                    <Palette className="h-4 w-4 mr-2" />
                    Show Color Recommendations
                  </Button>
                </div>
              )}

              {/* Recommendations Grid */}
              {(!wcagAA || showRecommendations) && (
                <div className="space-y-4">
                  {(() => {
                    const recommendations = getSmartRecommendations()
                    const groupedRecs = recommendations.reduce((groups, rec) => {
                      const category = rec.category || 'Alternative'
                      if (!groups[category]) groups[category] = []
                      groups[category].push(rec)
                      return groups
                    }, {} as Record<string, typeof recommendations>)

                    return Object.entries(groupedRecs).map(([category, recs]) => (
                      <div key={category} className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          {category === 'Keep Background' && (
                            <>
                              <div className="h-2 w-2 rounded-full bg-blue-500" />
                              Keep Background, Adjust Text Color
                            </>
                          )}
                          {category === 'Keep Foreground' && (
                            <>
                              <div className="h-2 w-2 rounded-full bg-green-500" />
                              Keep Text Color, Adjust Background
                            </>
                          )}
                          {category === 'Alternative' && (
                            <>
                              <div className="h-2 w-2 rounded-full bg-orange-500" />
                              Try These Similar Combinations
                            </>
                          )}
                        </h4>
                        
                        <div className="space-y-2">
                          {recs.slice(0, 3).map((rec, index) => {
                            const meetsAA = wcagVersion === "2.2" 
                              ? (rec.ratio || 0) >= (textSize === "normal" ? 4.5 : 3)
                              : (rec.apca || 0) >= (textSize === "normal" ? 60 : 45)
                            
                            const meetsAAA = wcagVersion === "2.2"
                              ? (rec.ratio || 0) >= (textSize === "normal" ? 7 : 4.5)
                              : (rec.apca || 0) >= (textSize === "normal" ? 75 : 60)

                            return (
                              <div
                                key={`${category}-${index}`}
                                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                                onClick={() => applyRecommendation(rec.fg, rec.bg)}
                              >
                                <div className="flex items-center gap-3">
                                  {/* Color Preview */}
                                  <div className="flex">
                                    <div 
                                      className="h-8 w-8 rounded-l-md border border-r-0" 
                                      style={{ backgroundColor: rec.bg }}
                                    />
                                    <div 
                                      className="h-8 w-8 rounded-r-md border border-l-0 flex items-center justify-center text-xs font-bold" 
                                      style={{ backgroundColor: rec.bg, color: rec.fg }}
                                    >
                                      Aa
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <div className="font-medium text-sm">{rec.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {wcagVersion === "2.2" 
                                        ? `${rec.ratio?.toFixed(1)}:1 ratio` 
                                        : `${rec.apca?.toFixed(0)}Lc score`
                                      }
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {meetsAAA && (
                                    <Badge variant="default" className="text-xs">
                                      {wcagVersion === "2.2" ? "AAA" : "Silver"}
                                    </Badge>
                                  )}
                                  {meetsAA && !meetsAAA && (
                                    <Badge variant="secondary" className="text-xs">
                                      {wcagVersion === "2.2" ? "AA" : "Bronze"}
                                    </Badge>
                                  )}
                                  {!meetsAA && (
                                    <Badge variant="destructive" className="text-xs">
                                      Fail
                                    </Badge>
                                  )}
                                  <Button variant="ghost" size="sm">
                                    <RefreshCw className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))
                  })()}
                  
                  {showRecommendations && (
                    <div className="text-center pt-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowRecommendations(false)}
                      >
                        Hide Recommendations
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>About Contrast Standards</CardTitle>
              <CardDescription>Understanding WCAG 2.2 and 3.0 contrast requirements.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <div>
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <Badge variant="outline">WCAG 2.2</Badge>
                  Traditional Contrast Ratio
                </h3>
                <p className="mb-3">
                  WCAG 2.2 uses the traditional contrast ratio formula based on relative luminance. 
                  This method has been the standard for web accessibility compliance.
                </p>
                <ul className="space-y-1 list-disc pl-5">
                  <li><strong>AA Level:</strong> 4.5:1 (normal), 3:1 (large text)</li>
                  <li><strong>AAA Level:</strong> 7:1 (normal), 4.5:1 (large text)</li>
                  <li><strong>Large Text:</strong> 18pt+ or 14pt+ bold</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <Badge variant="outline">WCAG 3.0</Badge>
                  <Zap className="h-4 w-4" />
                  APCA (Advanced)
                </h3>
                <p className="mb-3">
                  WCAG 3.0 introduces APCA (Advanced Perceptual Contrast Algorithm), which better reflects 
                  human visual perception and provides more accurate contrast measurements.
                </p>
                <ul className="space-y-1 list-disc pl-5">
                  <li><strong>Bronze Level:</strong> 60Lc (normal), 45Lc (large text)</li>
                  <li><strong>Silver Level:</strong> 75Lc (normal), 60Lc (large text)</li>
                  <li><strong>Improved accuracy</strong> for different color combinations</li>
              </ul>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <p className="text-amber-800 dark:text-amber-200">
                  <strong>Note:</strong> WCAG 3.0 is still in development. Use WCAG 2.2 for current compliance requirements.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
