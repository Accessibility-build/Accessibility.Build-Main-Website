"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
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
  Save
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

type ColorHarmony = 'complementary' | 'analogous' | 'triadic' | 'monochromatic' | 'split-complementary' | 'tetradic'

export default function ColorPaletteGenerator() {
  const [baseColor, setBaseColor] = useState("#3b82f6")
  const [harmony, setHarmony] = useState<ColorHarmony>("complementary")
  const [palette, setPalette] = useState<ColorPalette | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [showContrastInfo, setShowContrastInfo] = useState(false)

  // Color conversion utilities
  const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2

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

  // Generate initial palette
  useEffect(() => {
    generatePalette()
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
                {/* Primary Colors */}
                <div>
                  <h3 className="font-semibold mb-3 text-lg">Primary</h3>
                  <div className="space-y-3">
                    {palette.primary.map((color, index) => (
                      <div
                        key={index}
                        className="group relative rounded-lg overflow-hidden border cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
                        onClick={() => copyColor(color.hex)}
                      >
                        <div 
                          className="h-16 w-full"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-mono text-sm font-medium">{color.hex}</p>
                              <p className="text-xs text-muted-foreground">{color.name}</p>
                            </div>
                            {copied === color.hex && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground">
                            <p>HSL: {color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%</p>
                            <p>RGB: {color.rgb.r}, {color.rgb.g}, {color.rgb.b}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Secondary Colors */}
                <div>
                  <h3 className="font-semibold mb-3 text-lg">Secondary</h3>
                  <div className="space-y-3">
                    {palette.secondary.map((color, index) => (
                      <div
                        key={index}
                        className="group relative rounded-lg overflow-hidden border cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
                        onClick={() => copyColor(color.hex)}
                      >
                        <div 
                          className="h-16 w-full"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-mono text-sm font-medium">{color.hex}</p>
                              <p className="text-xs text-muted-foreground">{color.name}</p>
                            </div>
                            {copied === color.hex && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground">
                            <p>HSL: {color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%</p>
                            <p>RGB: {color.rgb.r}, {color.rgb.g}, {color.rgb.b}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Accent Colors */}
                <div>
                  <h3 className="font-semibold mb-3 text-lg">Accent</h3>
                  <div className="space-y-3">
                    {palette.accent.map((color, index) => (
                      <div
                        key={index}
                        className="group relative rounded-lg overflow-hidden border cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
                        onClick={() => copyColor(color.hex)}
                      >
                        <div 
                          className="h-16 w-full"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-mono text-sm font-medium">{color.hex}</p>
                              <p className="text-xs text-muted-foreground">{color.name}</p>
                            </div>
                            {copied === color.hex && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground">
                            <p>HSL: {color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%</p>
                            <p>RGB: {color.rgb.r}, {color.rgb.g}, {color.rgb.b}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Neutral Colors */}
                <div>
                  <h3 className="font-semibold mb-3 text-lg">Neutral</h3>
                  <div className="space-y-3">
                    {palette.neutral.map((color, index) => (
                      <div
                        key={index}
                        className="group relative rounded-lg overflow-hidden border cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
                        onClick={() => copyColor(color.hex)}
                      >
                        <div 
                          className="h-16 w-full"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-mono text-sm font-medium">{color.hex}</p>
                              <p className="text-xs text-muted-foreground">{color.name}</p>
                            </div>
                            {copied === color.hex && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground">
                            <p>HSL: {color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%</p>
                            <p>RGB: {color.rgb.r}, {color.rgb.g}, {color.rgb.b}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
                  <h4 className="font-semibold mb-2">✅ Good Practices:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Test with real users</li>
                    <li>• Ensure 4.5:1 contrast for normal text</li>
                    <li>• Use tools to verify accessibility</li>
                    <li>• Consider colorblind users</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">⚠️ Avoid:</h4>
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