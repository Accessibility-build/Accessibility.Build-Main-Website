"use client"

import { useState, useRef, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { 
  Upload, 
  Copy, 
  Palette, 
  Download, 
  X, 
  Eye,
  Pipette,
  ImageIcon,
  FileText
} from 'lucide-react'

interface ColorData {
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
  x: number
  y: number
}

interface ColorPalette {
  id: string
  colors: ColorData[]
  name: string
  createdAt: Date
}

const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, '0')).join('')}`
}

const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  const red = r / 255
  const green = g / 255
  const blue = b / 255
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const difference = max - min
    s = l > 0.5 ? difference / (2 - max - min) : difference / (max + min)
    if (max === red) h = (green - blue) / difference + (green < blue ? 6 : 0)
    if (max === green) h = (blue - red) / difference + 2
    if (max === blue) h = (red - green) / difference + 4
    h /= 6
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

export default function ImageColorPicker() {
  const [image, setImage] = useState<string | null>(null)
  const [selectedColors, setSelectedColors] = useState<ColorData[]>([])
  const [isPickingColor, setIsPickingColor] = useState(false)
  const [savedPalettes, setSavedPalettes] = useState<ColorPalette[]>([])
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const [sampleX, setSampleX] = useState(0)
  const [sampleY, setSampleY] = useState(0)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      setImage(imageUrl)
      setSelectedColors([])
      
      // Create image element to get dimensions
      const img = new Image()
      img.onload = () => {
        setImageSize({ width: img.width, height: img.height })
        setSampleX(Math.floor(img.width / 2))
        setSampleY(Math.floor(img.height / 2))
      }
      img.src = imageUrl
    }
    reader.readAsDataURL(file)
  }, [])

  const extractColor = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current
    const sourceImage = imageRef.current
    if (!canvas || !sourceImage) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = sourceImage.naturalWidth
    canvas.height = sourceImage.naturalHeight
    ctx.drawImage(sourceImage, 0, 0)

    const clampedX = Math.max(0, Math.min(x, canvas.width - 1))
    const clampedY = Math.max(0, Math.min(y, canvas.height - 1))

    try {
      const imageData = ctx.getImageData(clampedX, clampedY, 1, 1)
      const [r, g, b] = imageData.data
      const hex = rgbToHex(r, g, b)
      const hsl = rgbToHsl(r, g, b)

      const colorData: ColorData = {
        hex,
        rgb: { r, g, b },
        hsl,
        x: clampedX,
        y: clampedY
      }

      setSelectedColors((current) => {
        const withoutDuplicate = current.filter((color) => color.hex !== colorData.hex)
        return [...withoutDuplicate, colorData]
      })
      setSampleX(clampedX)
      setSampleY(clampedY)
      setIsPickingColor(false)
      toast.success(`Color picked: ${hex}`)
    } catch (error) {
      console.error('Error extracting color:', error)
      toast.error('Failed to extract color. Please try again.')
    }
  }, [])

  const handleImageClick = useCallback((event: React.MouseEvent<HTMLImageElement>) => {
    if (!isPickingColor || !imageRef.current) return
    const rect = imageRef.current.getBoundingClientRect()
    const scaleX = imageRef.current.naturalWidth / rect.width
    const scaleY = imageRef.current.naturalHeight / rect.height
    extractColor(
      Math.floor((event.clientX - rect.left) * scaleX),
      Math.floor((event.clientY - rect.top) * scaleY),
    )
  }, [extractColor, isPickingColor])


  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${format} copied to clipboard`)
    })
  }

  const removeColor = (index: number) => {
    setSelectedColors(prev => prev.filter((_, i) => i !== index))
  }

  const savePalette = () => {
    if (selectedColors.length === 0) {
      toast.error('No colors selected to save')
      return
    }

    const palette: ColorPalette = {
      id: Date.now().toString(),
      colors: selectedColors,
      name: `Palette ${savedPalettes.length + 1}`,
      createdAt: new Date()
    }

    setSavedPalettes(prev => [...prev, palette])
    toast.success('Palette saved successfully!')
  }

  const exportPalette = (format: 'json' | 'css' | 'scss') => {
    if (selectedColors.length === 0) {
      toast.error('No colors to export')
      return
    }

    let content = ''
    let filename = ''

    switch (format) {
      case 'json':
        content = JSON.stringify(selectedColors, null, 2)
        filename = 'color-palette.json'
        break
      case 'css':
        content = ':root {\n' + selectedColors.map((color, index) => 
          `  --color-${index + 1}: ${color.hex};`
        ).join('\n') + '\n}'
        filename = 'color-palette.css'
        break
      case 'scss':
        content = selectedColors.map((color, index) => 
          `$color-${index + 1}: ${color.hex};`
        ).join('\n')
        filename = 'color-palette.scss'
        break
    }

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    toast.success(`Palette exported as ${format.toUpperCase()}`)
  }

  const clearAll = () => {
    setSelectedColors([])
    setImage(null)
    setIsPickingColor(false)
    toast.success('All data cleared')
  }

  return (
    <div className="bg-transparent">
      <div className="container mx-auto px-0 py-0">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-950/50 rounded-md">
              <Palette className="h-7 w-7 text-purple-600 dark:text-purple-300" />
            </div>
            <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Image Color Picker</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
            Upload an image and sample colors by pointer or exact coordinates. Build a palette, copy values, and export reusable tokens.
          </p>
        </div>

        <h2 className="sr-only">Image color sampling workspace</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Image Upload & Display */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Image
                </CardTitle>
                <CardDescription>
                  Upload an image to start picking colors
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!image ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 md:p-12 text-center">
                    <Upload className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-slate-700 dark:text-slate-300 mb-4 text-sm md:text-base">Click to upload an image</p>
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-purple-700 text-white hover:bg-purple-800"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Image
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {imageSize.width} × {imageSize.height}
                        </Badge>
                        <Button
                          variant={isPickingColor ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            if (!image) {
                              toast.error('Please upload an image first')
                              return
                            }
                            setIsPickingColor(!isPickingColor)
                            if (!isPickingColor) {
                              toast.info('Click anywhere on the image to pick a color')
                            }
                          }}
                        >
                          <Pipette className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">{isPickingColor ? 'Cancel Picking' : 'Pick Color'}</span>
                          <span className="sm:hidden">{isPickingColor ? 'Cancel' : 'Pick'}</span>
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Change
                      </Button>
                    </div>
                    
                    <div className="relative">
                      {/* Data URLs are sampled through canvas, so a native image avoids optimization rewrites. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        ref={imageRef}
                        src={image}
                        alt="Color picker source"
                        className={`w-full h-auto rounded-lg shadow-lg transition-all duration-200 ${
                          isPickingColor ? 'cursor-crosshair ring-2 ring-purple-500 ring-opacity-50' : 'cursor-default'
                        }`}
                        onClick={handleImageClick}
                        onMouseDown={(e) => e.preventDefault()}
                        style={{ userSelect: 'none', pointerEvents: 'auto' }}
                        draggable={false}
                      />
                      {isPickingColor && (
                        <div 
                          className="absolute inset-0 bg-purple-500 bg-opacity-10 rounded-lg flex items-center justify-center pointer-events-none"
                        >
                          <div className="bg-white px-4 py-2 rounded-lg shadow-lg">
                            <p className="text-sm font-medium text-purple-600">
                              Click anywhere to pick a color
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid gap-3 rounded-lg border border-slate-200 p-4 dark:border-slate-700 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                      <div className="space-y-1.5">
                        <label htmlFor="sample-x" className="text-sm font-medium">X coordinate</label>
                        <Input
                          id="sample-x"
                          type="number"
                          min={0}
                          max={Math.max(0, imageSize.width - 1)}
                          value={sampleX}
                          onChange={(event) => setSampleX(Number(event.target.value))}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="sample-y" className="text-sm font-medium">Y coordinate</label>
                        <Input
                          id="sample-y"
                          type="number"
                          min={0}
                          max={Math.max(0, imageSize.height - 1)}
                          value={sampleY}
                          onChange={(event) => setSampleY(Number(event.target.value))}
                        />
                      </div>
                      <Button type="button" variant="outline" onClick={() => extractColor(sampleX, sampleY)}>
                        <Pipette className="h-4 w-4" />
                        Sample coordinate
                      </Button>
                    </div>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Color Palette */}
          <div className="space-y-6">
            {/* Selected Colors */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Picked Colors ({selectedColors.length})
                  </CardTitle>
                  {selectedColors.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAll}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {selectedColors.length === 0 ? (
                  <p className="text-slate-600 dark:text-slate-400 text-center py-8">
                    No colors picked yet. Upload an image and click to pick colors.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedColors.map((color, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center gap-3 mb-2">
                          <div 
                            className="w-8 h-8 rounded-full border-2 border-gray-200 shrink-0"
                            style={{ backgroundColor: color.hex }}
                          />
                          <div className="flex-1">
                            <div className="font-mono text-sm font-medium">
                              {color.hex}
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">
                              Position: {color.x}, {color.y}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeColor(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          <div className="bg-gray-50 p-2 rounded">
                            <div className="font-medium mb-1">HEX</div>
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs sm:text-sm">{color.hex}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 flex-shrink-0"
                                onClick={() => copyToClipboard(color.hex, 'HEX')}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-2 rounded">
                            <div className="font-medium mb-1">RGB</div>
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs">
                                {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 flex-shrink-0"
                                onClick={() => copyToClipboard(
                                  `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`, 
                                  'RGB'
                                )}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-2 rounded">
                            <div className="font-medium mb-1">HSL</div>
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs">
                                {color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 flex-shrink-0"
                                onClick={() => copyToClipboard(
                                  `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`, 
                                  'HSL'
                                )}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Export Options */}
            {selectedColors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Export Palette
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        className="justify-start text-xs sm:text-sm"
                        onClick={() => exportPalette('json')}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        JSON
                      </Button>
                      <Button
                        variant="outline"
                        className="justify-start text-xs sm:text-sm"
                        onClick={() => exportPalette('css')}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        CSS
                      </Button>
                      <Button
                        variant="outline"
                        className="justify-start text-xs sm:text-sm"
                        onClick={() => exportPalette('scss')}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        SCSS
                      </Button>
                    </div>
                    <Separator />
                    <Button
                      onClick={savePalette}
                      className="w-full bg-purple-700 text-white hover:bg-purple-800"
                    >
                      <Palette className="h-4 w-4 mr-2" />
                      Save Palette
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Canvas for color extraction */}
        <canvas
          ref={canvasRef}
          className="hidden"
        />
      </div>
    </div>
  )
} 

 
