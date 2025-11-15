"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shuffle, Eye } from "lucide-react"

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Remove # if present
  hex = hex.replace(/^#/, "")

  // Handle shorthand hex
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }

  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)
}

function luminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
}

function calculateContrast(
  rgb1: { r: number; g: number; b: number },
  rgb2: { r: number; g: number; b: number },
): number {
  const lum1 = luminance(rgb1.r, rgb1.g, rgb1.b)
  const lum2 = luminance(rgb2.r, rgb2.g, rgb2.b)
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  return (brightest + 0.05) / (darkest + 0.05)
}

function getContrastRating(contrast: number): {
  normalText: string
  largeText: string
  normalTextPass: boolean
  largeTextPass: boolean
  normalTextAAA: boolean
  largeTextAAA: boolean
} {
  return {
    normalText: contrast >= 4.5 ? "AA" : "Fail",
    largeText: contrast >= 3 ? "AA" : "Fail",
    normalTextPass: contrast >= 4.5,
    largeTextPass: contrast >= 3,
    normalTextAAA: contrast >= 7,
    largeTextAAA: contrast >= 4.5,
  }
}

function generateRandomColor(): string {
  return rgbToHex(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256))
}

export function ContrastCheckerDemo() {
  const [foreground, setForeground] = useState("#000000")
  const [background, setBackground] = useState("#ffffff")
  const [fontSize, setFontSize] = useState(16)
  const [fontWeight, setFontWeight] = useState(400)
  const [contrast, setContrast] = useState(21)
  const [rating, setRating] = useState({
    normalText: "AAA",
    largeText: "AAA",
    normalTextPass: true,
    largeTextPass: true,
    normalTextAAA: true,
    largeTextAAA: true,
  })
  const [activeTab, setActiveTab] = useState("preview")

  useEffect(() => {
    const fgRgb = hexToRgb(foreground)
    const bgRgb = hexToRgb(background)

    if (fgRgb && bgRgb) {
      const contrastRatio = calculateContrast(fgRgb, bgRgb)
      setContrast(contrastRatio)
      setRating(getContrastRating(contrastRatio))
    }
  }, [foreground, background])

  const handleForegroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForeground(e.target.value)
  }

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBackground(e.target.value)
  }

  const handleFontSizeChange = (value: number[]) => {
    setFontSize(value[0])
  }

  const handleFontWeightChange = (value: number[]) => {
    // Map 0-100 to 100-900
    setFontWeight(Math.floor(value[0] * 8) * 100 + 100)
  }

  const generateNewColors = () => {
    setForeground(generateRandomColor())
    setBackground(generateRandomColor())
  }

  const swapColors = () => {
    const temp = foreground
    setForeground(background)
    setBackground(temp)
  }

  const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700)

  return (
    <div className="border rounded-lg p-6 bg-card">
      <h3 className="text-xl font-semibold mb-4">Interactive Contrast Checker</h3>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="mt-0">
          <div
            className="border rounded-lg p-8 flex items-center justify-center min-h-[200px] transition-colors"
            style={{ backgroundColor: background }}
          >
            <p
              style={{
                color: foreground,
                fontSize: `${fontSize}px`,
                fontWeight: fontWeight,
              }}
              className="transition-all"
            >
              Sample Text
            </p>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Contrast Ratio</span>
                <span className="text-xl font-bold">{contrast.toFixed(2)}:1</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    contrast >= 7
                      ? "bg-green-500"
                      : contrast >= 4.5
                        ? "bg-blue-500"
                        : contrast >= 3
                          ? "bg-yellow-500"
                          : "bg-red-500"
                  }`}
                  style={{ width: `${Math.min(100, (contrast / 21) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col items-center p-2 border rounded-md">
                <span className="text-sm text-muted-foreground">Normal Text</span>
                <Badge variant={rating.normalTextPass ? "default" : "destructive"} className="mt-1">
                  {rating.normalTextPass ? (rating.normalTextAAA ? "AAA" : "AA") : "Fail"}
                </Badge>
              </div>
              <div className="flex flex-col items-center p-2 border rounded-md">
                <span className="text-sm text-muted-foreground">Large Text</span>
                <Badge variant={rating.largeTextPass ? "default" : "destructive"} className="mt-1">
                  {rating.largeTextPass ? (rating.largeTextAAA ? "AAA" : "AA") : "Fail"}
                </Badge>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="controls" className="mt-0 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="foreground-color">Text Color</Label>
              <div className="flex mt-1.5">
                <div className="w-10 h-10 border rounded-l-md" style={{ backgroundColor: foreground }} />
                <Input
                  id="foreground-color"
                  type="text"
                  value={foreground}
                  onChange={handleForegroundChange}
                  className="rounded-l-none"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="background-color">Background Color</Label>
              <div className="flex mt-1.5">
                <div className="w-10 h-10 border rounded-l-md" style={{ backgroundColor: background }} />
                <Input
                  id="background-color"
                  type="text"
                  value={background}
                  onChange={handleBackgroundChange}
                  className="rounded-l-none"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="font-size">Font Size: {fontSize}px</Label>
            <Slider
              id="font-size"
              min={12}
              max={32}
              step={1}
              value={[fontSize]}
              onValueChange={handleFontSizeChange}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="font-weight">Font Weight: {fontWeight}</Label>
            <Slider
              id="font-weight"
              min={0}
              max={1}
              step={0.125}
              value={[(fontWeight - 100) / 800]}
              onValueChange={handleFontWeightChange}
              className="mt-2"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={swapColors} className="flex-1">
              Swap Colors
            </Button>
            <Button onClick={generateNewColors} variant="outline" className="flex-1">
              <Shuffle className="mr-2 h-4 w-4" />
              Random Colors
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-4 p-3 bg-muted/30 rounded-md text-sm">
        <p className="flex items-center">
          <Eye className="inline-block mr-2 h-4 w-4" />
          {isLargeText ? "This is considered large text (≥18px or ≥14px bold)" : "This is considered normal text"}
        </p>
        <p className="mt-1 text-muted-foreground">
          WCAG AA requires {isLargeText ? "3:1" : "4.5:1"} contrast ratio, AAA requires {isLargeText ? "4.5:1" : "7:1"}
        </p>
      </div>
    </div>
  )
}
