'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Copy,
  Eye,
  EyeOff,
  Palette,
  Calculator,
  RefreshCw,
  Zap,
  Target,
  Star,
  Info
} from 'lucide-react'

export default function WCAG143ClientPage() {
  // Contrast checker states
  const [foregroundColor, setForegroundColor] = useState('#000000')
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [contrastRatio, setContrastRatio] = useState(21)
  const [testText, setTestText] = useState('Sample text for contrast testing')
  const [fontSize, setFontSize] = useState(16)
  const [fontWeight, setFontWeight] = useState('normal')
  const [isLargeText, setIsLargeText] = useState(false)
  
  // Predefined color combinations
  const [selectedPreset, setSelectedPreset] = useState('')
  
  // Code examples and screen reader
  const [copiedCode, setCopiedCode] = useState('')
  const [showScreenReader, setShowScreenReader] = useState(false)

  // Calculate contrast ratio
  const calculateContrastRatio = (color1: string, color2: string) => {
    const getRGB = (color: string) => {
      const hex = color.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)
      return [r, g, b]
    }

    const getLuminance = (rgb: number[]) => {
      const [r, g, b] = rgb.map(c => {
        c = c / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }

    const rgb1 = getRGB(color1)
    const rgb2 = getRGB(color2)
    const lum1 = getLuminance(rgb1)
    const lum2 = getLuminance(rgb2)
    const brightest = Math.max(lum1, lum2)
    const darkest = Math.min(lum1, lum2)
    
    return (brightest + 0.05) / (darkest + 0.05)
  }

  // Update contrast ratio when colors change
  useEffect(() => {
    const ratio = calculateContrastRatio(foregroundColor, backgroundColor)
    setContrastRatio(Math.round(ratio * 100) / 100)
  }, [foregroundColor, backgroundColor])

  // Update large text status
  useEffect(() => {
    setIsLargeText(
      (fontSize >= 18 && fontWeight === 'normal') ||
      (fontSize >= 14 && fontWeight === 'bold')
    )
  }, [fontSize, fontWeight])

  // Get contrast status
  const getContrastStatus = () => {
    const minRatio = isLargeText ? 3 : 4.5
    const aaRatio = isLargeText ? 3 : 4.5
    const aaaRatio = isLargeText ? 4.5 : 7
    
    if (contrastRatio >= aaaRatio) {
      return { level: 'AAA', status: 'excellent', color: 'green' }
    } else if (contrastRatio >= aaRatio) {
      return { level: 'AA', status: 'good', color: 'blue' }
    } else {
      return { level: 'Fail', status: 'poor', color: 'red' }
    }
  }

  // Predefined color combinations
  const colorPresets = [
    { name: 'Black on White', fg: '#000000', bg: '#ffffff', ratio: 21 },
    { name: 'Dark Gray on Light Gray', fg: '#333333', bg: '#f0f0f0', ratio: 12.6 },
    { name: 'Blue on Light Blue', fg: '#0066cc', bg: '#e6f3ff', ratio: 7.2 },
    { name: 'White on Dark Blue', fg: '#ffffff', bg: '#003366', ratio: 12.6 },
    { name: 'Red on Pink (Fail)', fg: '#ff0000', bg: '#ffcccc', ratio: 2.3 },
    { name: 'Light Gray on White (Fail)', fg: '#cccccc', bg: '#ffffff', ratio: 1.6 },
  ]

  // Apply preset
  const applyPreset = (preset: typeof colorPresets[0]) => {
    setForegroundColor(preset.fg)
    setBackgroundColor(preset.bg)
    setSelectedPreset(preset.name)
  }

  // Generate random colors
  const generateRandomColors = () => {
    const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
    setForegroundColor(randomColor())
    setBackgroundColor(randomColor())
    setSelectedPreset('')
  }

  // Copy code to clipboard
  const copyCode = async (code: string, type: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(type)
      setTimeout(() => setCopiedCode(''), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  // Screen reader simulation
  const simulateScreenReader = (text: string) => {
    if (showScreenReader && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.pitch = 1
      window.speechSynthesis.speak(utterance)
    }
  }

  const contrastStatus = getContrastStatus()

  const htmlExample = `<!-- Good Example: High Contrast Text -->
<div style="background-color: #ffffff; color: #000000; padding: 20px;">
  <h1 style="font-size: 24px; font-weight: bold;">
    High Contrast Heading (21:1 ratio)
  </h1>
  <p style="font-size: 16px; line-height: 1.5;">
    This text has excellent contrast and is easy to read 
    for users with visual impairments.
  </p>
</div>

<!-- Good Example: Dark Theme -->
<div style="background-color: #1a1a1a; color: #ffffff; padding: 20px;">
  <h2 style="font-size: 20px; color: #ffffff;">
    Dark Theme with Good Contrast (15.3:1 ratio)
  </h2>
  <p style="font-size: 16px; color: #e0e0e0;">
    Light text on dark background also provides 
    excellent readability when done correctly.
  </p>
</div>

<!-- Bad Example: Poor Contrast -->
<div style="background-color: #ffcccc; color: #ff0000; padding: 20px;">
  <p style="font-size: 16px;">
    This red text on pink background has poor contrast (2.3:1) 
    and fails WCAG requirements.
  </p>
</div>`

  const cssExample = `/* High contrast color scheme */
.high-contrast-text {
  background-color: #ffffff;
  color: #000000;
  /* Contrast ratio: 21:1 (AAA) */
}

.dark-theme {
  background-color: #1a1a1a;
  color: #ffffff;
  /* Contrast ratio: 15.3:1 (AAA) */
}

.accessible-link {
  color: #0066cc;
  background-color: #ffffff;
  /* Contrast ratio: 7.2:1 (AA for normal text, AAA for large text) */
}

.accessible-link:hover {
  color: #004499;
  text-decoration: underline;
  /* Increased contrast on hover */
}

/* Large text (18px+ normal or 14px+ bold) */
.large-text {
  font-size: 18px;
  font-weight: normal;
  /* Minimum 3:1 contrast ratio required */
}

.large-text-bold {
  font-size: 14px;
  font-weight: bold;
  /* Minimum 3:1 contrast ratio required */
}

/* Button with sufficient contrast */
.accessible-button {
  background-color: #0066cc;
  color: #ffffff;
  border: 2px solid #0066cc;
  padding: 8px 16px;
  border-radius: 4px;
  /* Contrast ratio: 7.2:1 (AA) */
}

.accessible-button:hover {
  background-color: #004499;
  border-color: #004499;
  /* Maintain contrast on hover */
}

.accessible-button:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
  /* Ensure focus indicator has sufficient contrast */
}

/* Error states */
.error-message {
  background-color: #fff5f5;
  color: #c53030;
  border: 1px solid #feb2b2;
  /* Contrast ratio: 5.9:1 (AA) */
}

/* Success states */
.success-message {
  background-color: #f0fff4;
  color: #22543d;
  border: 1px solid #9ae6b4;
  /* Contrast ratio: 8.1:1 (AA) */
}`

  const reactExample = `import React, { useState, useEffect } from 'react'

// Utility function to calculate contrast ratio
const calculateContrastRatio = (color1, color2) => {
  const getRGB = (color) => {
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    return [r, g, b]
  }

  const getLuminance = (rgb) => {
    const [r, g, b] = rgb.map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const rgb1 = getRGB(color1)
  const rgb2 = getRGB(color2)
  const lum1 = getLuminance(rgb1)
  const lum2 = getLuminance(rgb2)
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  
  return (brightest + 0.05) / (darkest + 0.05)
}

// Component with contrast validation
function AccessibleText({ 
  children, 
  backgroundColor = '#ffffff', 
  textColor = '#000000',
  fontSize = 16,
  fontWeight = 'normal'
}) {
  const [contrastRatio, setContrastRatio] = useState(0)
  const [isAccessible, setIsAccessible] = useState(true)

  useEffect(() => {
    const ratio = calculateContrastRatio(textColor, backgroundColor)
    setContrastRatio(ratio)
    
    // Check if text is large (18px+ normal or 14px+ bold)
    const isLargeText = (fontSize >= 18 && fontWeight === 'normal') || 
                       (fontSize >= 14 && fontWeight === 'bold')
    
    // WCAG AA requirements: 4.5:1 for normal text, 3:1 for large text
    const minRatio = isLargeText ? 3 : 4.5
    setIsAccessible(ratio >= minRatio)
  }, [textColor, backgroundColor, fontSize, fontWeight])

  const textStyle = {
    color: textColor,
    backgroundColor: backgroundColor,
    fontSize: \`\${fontSize}px\`,
    fontWeight: fontWeight,
    padding: '12px',
    borderRadius: '4px',
    border: isAccessible ? '2px solid green' : '2px solid red'
  }

  return (
    <div>
      <div style={textStyle}>
        {children}
      </div>
      <div style={{ fontSize: '12px', marginTop: '4px' }}>
        Contrast Ratio: {contrastRatio.toFixed(2)}:1 
        {isAccessible ? ' ✅ WCAG AA' : ' ❌ Fails WCAG AA'}
      </div>
    </div>
  )
}

// Usage example
function App() {
  return (
    <div>
      <AccessibleText 
        backgroundColor="#ffffff" 
        textColor="#000000"
        fontSize={16}
      >
        This text meets WCAG AA standards
      </AccessibleText>
      
      <AccessibleText 
        backgroundColor="#ffcccc" 
        textColor="#ff0000"
        fontSize={16}
      >
        This text fails WCAG AA standards
      </AccessibleText>
    </div>
  )
}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-cyan-100 text-cyan-800 border-cyan-200">
            WCAG 2.2 Level AA
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            1.4.3 Contrast (Minimum)
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Text and background colors must have a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text.
          </p>
        </div>

        {/* Screen Reader Toggle */}
        <div className="mb-6 text-center">
          <Button
            onClick={() => setShowScreenReader(!showScreenReader)}
            variant="outline"
            className="border-cyan-200 text-cyan-700 hover:bg-cyan-50"
          >
            {showScreenReader ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
            {showScreenReader ? 'Disable' : 'Enable'} Screen Reader Simulation
          </Button>
        </div>

        {/* Interactive Contrast Checker */}
        <Card className="mb-8 border-cyan-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white">
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Interactive Contrast Checker
            </CardTitle>
            <CardDescription className="text-cyan-100">
              Test color combinations and see real-time contrast analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Controls */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="foreground-color">Text Color</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        id="foreground-color"
                        type="color"
                        value={foregroundColor}
                        onChange={(e) => setForegroundColor(e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <Input
                        value={foregroundColor}
                        onChange={(e) => setForegroundColor(e.target.value)}
                        className="flex-1"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="background-color">Background Color</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        id="background-color"
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <Input
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="flex-1"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="font-size">Font Size (px)</Label>
                    <Input
                      id="font-size"
                      type="number"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      min="10"
                      max="48"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="font-weight">Font Weight</Label>
                    <select
                      id="font-weight"
                      value={fontWeight}
                      onChange={(e) => setFontWeight(e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="test-text">Test Text</Label>
                  <Input
                    id="test-text"
                    value={testText}
                    onChange={(e) => setTestText(e.target.value)}
                    className="mt-1"
                    placeholder="Enter text to test"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={generateRandomColors}
                    variant="outline"
                    size="sm"
                    className="border-cyan-200 text-cyan-700 hover:bg-cyan-50"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Random Colors
                  </Button>
                </div>
                
                {/* Preset Colors */}
                <div>
                  <Label>Quick Presets</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {colorPresets.map((preset) => (
                      <Button
                        key={preset.name}
                        onClick={() => applyPreset(preset)}
                        variant="outline"
                        size="sm"
                        className={`text-xs ${
                          selectedPreset === preset.name 
                            ? 'border-cyan-500 bg-cyan-50' 
                            : 'border-gray-200'
                        }`}
                      >
                        {preset.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Preview and Results */}
              <div className="space-y-4">
                {/* Text Preview */}
                <div>
                  <Label>Preview</Label>
                  <div
                    className="mt-2 p-4 rounded-lg border-2 min-h-[100px] flex items-center justify-center"
                    style={{
                      backgroundColor: backgroundColor,
                      color: foregroundColor,
                      fontSize: `${fontSize}px`,
                      fontWeight: fontWeight
                    }}
                    onMouseEnter={() => simulateScreenReader(`Preview text with ${contrastRatio.toFixed(2)} to 1 contrast ratio`)}
                  >
                    {testText}
                  </div>
                </div>
                
                {/* Contrast Results */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Contrast Ratio</Label>
                    <div className="text-2xl font-bold">
                      {contrastRatio.toFixed(2)}:1
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={contrastStatus.color === 'green' ? 'default' : contrastStatus.color === 'blue' ? 'secondary' : 'destructive'}
                      className="flex items-center gap-1"
                    >
                      {contrastStatus.color === 'green' ? <Star className="h-3 w-3" /> : 
                       contrastStatus.color === 'blue' ? <CheckCircle2 className="h-3 w-3" /> : 
                       <XCircle className="h-3 w-3" />}
                      WCAG {contrastStatus.level}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      ({contrastStatus.status})
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    {isLargeText ? (
                      <div className="flex items-center gap-1">
                        <Info className="h-4 w-4" />
                        Large text: Minimum 3:1 required
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Info className="h-4 w-4" />
                        Normal text: Minimum 4.5:1 required
                      </div>
                    )}
                  </div>
                  
                  {/* Compliance Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {contrastRatio >= (isLargeText ? 3 : 4.5) ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-sm">WCAG AA: {isLargeText ? '3:1' : '4.5:1'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {contrastRatio >= (isLargeText ? 4.5 : 7) ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-sm">WCAG AAA: {isLargeText ? '4.5:1' : '7:1'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Good vs Bad Examples */}
        <Card className="mb-8 border-cyan-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Good vs Bad Examples
            </CardTitle>
            <CardDescription className="text-cyan-100">
              See the difference between accessible and inaccessible contrast
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="good" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="good">✅ Good Contrast</TabsTrigger>
                <TabsTrigger value="bad">❌ Poor Contrast</TabsTrigger>
              </TabsList>
              
              <TabsContent value="good" className="space-y-4">
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Compliant:</strong> These examples meet WCAG AA standards
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="bg-white text-black p-4 rounded-lg border-2 border-green-200">
                      <h3 className="font-semibold mb-2">Black on White</h3>
                      <p className="text-sm mb-2">Contrast Ratio: 21:1 (AAA)</p>
                      <p>This is the highest possible contrast and provides excellent readability for all users.</p>
                    </div>
                    
                    <div className="bg-slate-800 text-white p-4 rounded-lg border-2 border-green-200">
                      <h3 className="font-semibold mb-2">White on Dark Gray</h3>
                      <p className="text-sm mb-2">Contrast Ratio: 15.3:1 (AAA)</p>
                      <p>Dark themes can also provide excellent contrast when implemented correctly.</p>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="bg-blue-50 text-blue-900 p-4 rounded-lg border-2 border-green-200">
                      <h3 className="font-semibold mb-2">Dark Blue on Light Blue</h3>
                      <p className="text-sm mb-2">Contrast Ratio: 8.2:1 (AAA)</p>
                      <p>Subtle color combinations can still provide excellent accessibility.</p>
                    </div>
                    
                    <div className="bg-gray-100 text-gray-900 p-4 rounded-lg border-2 border-green-200">
                      <h3 className="font-semibold mb-2 text-xl">Large Text Example</h3>
                      <p className="text-sm mb-2">Contrast Ratio: 5.1:1 (AA for Large Text)</p>
                      <p className="text-lg">Large text (18px+ or 14px+ bold) needs only 3:1 contrast.</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="bad" className="space-y-4">
                <Alert className="border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Non-compliant:</strong> These examples fail WCAG standards
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="bg-red-100 text-red-300 p-4 rounded-lg border-2 border-red-200">
                      <h3 className="font-semibold mb-2">Light Red on Pink</h3>
                      <p className="text-sm mb-2">Contrast Ratio: 2.1:1 (Fail)</p>
                      <p>This text is barely readable and fails accessibility standards.</p>
                    </div>
                    
                    <div className="bg-white text-gray-300 p-4 rounded-lg border-2 border-red-200">
                      <h3 className="font-semibold mb-2">Light Gray on White</h3>
                      <p className="text-sm mb-2">Contrast Ratio: 1.6:1 (Fail)</p>
                      <p>This common mistake makes text nearly invisible to many users.</p>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="bg-yellow-200 text-yellow-400 p-4 rounded-lg border-2 border-red-200">
                      <h3 className="font-semibold mb-2">Yellow on Light Yellow</h3>
                      <p className="text-sm mb-2">Contrast Ratio: 1.4:1 (Fail)</p>
                      <p>Similar colors provide insufficient contrast for readability.</p>
                    </div>
                    
                    <div className="bg-blue-500 text-blue-300 p-4 rounded-lg border-2 border-red-200">
                      <h3 className="font-semibold mb-2">Light Blue on Medium Blue</h3>
                      <p className="text-sm mb-2">Contrast Ratio: 2.8:1 (Fail)</p>
                      <p>Even with different shades, insufficient contrast fails standards.</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Implementation Examples */}
        <Card className="mb-8 border-cyan-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white">
            <CardTitle>Implementation Examples</CardTitle>
            <CardDescription className="text-cyan-100">
              Copy-paste code examples for accessible contrast
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="html" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="css">CSS</TabsTrigger>
                <TabsTrigger value="react">React</TabsTrigger>
              </TabsList>
              
              <TabsContent value="html" className="space-y-4">
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{htmlExample}</code>
                  </pre>
                  <Button
                    onClick={() => copyCode(htmlExample, 'html')}
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                  >
                    <Copy className="h-4 w-4" />
                    {copiedCode === 'html' ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="css" className="space-y-4">
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{cssExample}</code>
                  </pre>
                  <Button
                    onClick={() => copyCode(cssExample, 'css')}
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                  >
                    <Copy className="h-4 w-4" />
                    {copiedCode === 'css' ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="react" className="space-y-4">
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{reactExample}</code>
                  </pre>
                  <Button
                    onClick={() => copyCode(reactExample, 'react')}
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                  >
                    <Copy className="h-4 w-4" />
                    {copiedCode === 'react' ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Testing Methods */}
        <Card className="mb-8 border-cyan-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white">
            <CardTitle>Testing Methods</CardTitle>
            <CardDescription className="text-cyan-100">
              How to test for WCAG 1.4.3 compliance
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="manual" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">Manual Testing</TabsTrigger>
                <TabsTrigger value="automated">Automated Testing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="manual" className="space-y-4">
                <div className="space-y-4">
                  <div className="border-l-4 border-cyan-500 pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Manual Test Steps</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                      <li>Use browser developer tools to inspect text elements</li>
                      <li>Note the computed color values for text and background</li>
                      <li>Use contrast checking tools to calculate ratios</li>
                      <li>Verify normal text meets 4.5:1 minimum</li>
                      <li>Verify large text meets 3:1 minimum</li>
                      <li>Check all text states (hover, focus, disabled)</li>
                      <li>Test with different screen brightness settings</li>
                    </ol>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Popular Testing Tools</h4>
                    <ul className="text-blue-800 space-y-1 text-sm">
                      <li>• <strong>WebAIM Contrast Checker:</strong> Online tool for checking individual colors</li>
                      <li>• <strong>Colour Contrast Analyser:</strong> Desktop app for system-wide checking</li>
                      <li>• <strong>Stark (Figma/Sketch):</strong> Design tool plugin for checking designs</li>
                      <li>• <strong>Sim Daltonism:</strong> Mac app for color blindness simulation</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="automated" className="space-y-4">
                <div className="space-y-4">
                  <div className="border-l-4 border-cyan-500 pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Automated Testing Tools</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li><strong>axe-core:</strong> Comprehensive accessibility testing including contrast</li>
                      <li><strong>Pa11y:</strong> Command-line tool for automated accessibility testing</li>
                      <li><strong>WAVE:</strong> Web accessibility evaluation tool</li>
                      <li><strong>Lighthouse:</strong> Built-in Chrome DevTools accessibility audit</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">JavaScript Testing Example:</h4>
                    <pre className="bg-gray-900 text-gray-100 p-3 rounded text-sm overflow-x-auto">
                      <code>{`// Test contrast ratios automatically
const contrastChecker = {
  calculateRatio: (color1, color2) => {
    // Implementation of contrast calculation
    const getLuminance = (hex) => {
      const rgb = parseInt(hex.slice(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >>  8) & 0xff;
      const b = (rgb >>  0) & 0xff;
      
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };
    
    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  },
  
  checkPage: () => {
    const textElements = document.querySelectorAll('*');
    const violations = [];
    
    textElements.forEach(element => {
      const style = window.getComputedStyle(element);
      const color = style.color;
      const backgroundColor = style.backgroundColor;
      const fontSize = parseFloat(style.fontSize);
      const fontWeight = style.fontWeight;
      
      if (color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
        const ratio = this.calculateRatio(color, backgroundColor);
        const isLarge = fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
        const minRatio = isLarge ? 3 : 4.5;
        
        if (ratio < minRatio) {
          violations.push({
            element: element,
            ratio: ratio,
            required: minRatio,
            colors: { text: color, background: backgroundColor }
          });
        }
      }
    });
    
    return violations;
  }
};

// Run the test
const violations = contrastChecker.checkPage();
console.log('Contrast violations found:', violations.length);`}</code>
                    </pre>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Key Requirements */}
        <Card className="border-cyan-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white">
            <CardTitle>Key Requirements Summary</CardTitle>
            <CardDescription className="text-cyan-100">
              Essential points for WCAG 1.4.3 compliance
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Contrast Requirements
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Normal text: 4.5:1 minimum contrast ratio</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Large text: 3:1 minimum contrast ratio</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Large text = 18px+ normal or 14px+ bold</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Test all text states (hover, focus, etc.)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Include interactive elements (buttons, links)</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  Common Mistakes
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Using light gray text on white backgrounds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Relying on color alone for information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Not testing with different screen brightness</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Forgetting to test hover/focus states</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Using transparent overlays without testing</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="text-center">
              <p className="text-gray-600 mb-2">
                <strong>Remember:</strong> Good contrast benefits everyone, especially users with visual impairments, 
                color vision deficiencies, and those using devices in bright environments.
              </p>
              <p className="text-sm text-gray-500">
                Test your colors with actual users and automated tools for the best results.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 