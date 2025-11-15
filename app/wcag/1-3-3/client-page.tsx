"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Volume2,
  VolumeX,
  FileText,
  Info,
  Lightbulb,
  Code,
  TestTube,
  Copy,
  Eye,
  EyeOff,
  Circle,
  Square,
  Triangle,
  Star,
  MapPin,
  Palette,
  Volume1,
  Play
} from "lucide-react"
import { useState } from "react"

export default function WCAG133ClientPage() {
  const [colorBlindMode, setColorBlindMode] = useState(false)
  const [selectedExample, setSelectedExample] = useState('color')

  const simulateInstruction = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(`Instruction: ${text}`)
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-amber-950">
      <div className="container-wide py-12">
        {/* Back Navigation */}
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/checklists/wcag-2-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to WCAG Checklist
          </Link>
        </Button>

        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl">
                <Palette className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                    1.3.3 Sensory Characteristics
                  </h1>
                  <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700">
                    Level A
                  </Badge>
                </div>
                <p className="text-xl text-slate-600 dark:text-slate-400">
                  Instructions do not rely solely on sensory characteristics like shape, color, size, visual location, orientation, or sound
                </p>
              </div>
            </div>
          </div>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-amber-600" />
                  <span className="font-semibold text-slate-900 dark:text-white">Principle</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-1">1. Perceivable</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-amber-600" />
                  <span className="font-semibold text-slate-900 dark:text-white">Guideline</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-1">1.3 Adaptable</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-slate-900 dark:text-white">Since</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-1">WCAG 2.0</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Understanding Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-amber-600" />
              Understanding 1.3.3 Sensory Characteristics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">What does this mean?</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Instructions and content must not rely solely on sensory characteristics to convey meaning. 
                Users with different disabilities may not be able to perceive color, shape, size, position, 
                orientation, or sound. Always provide multiple ways to identify and understand content.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Problematic sensory characteristics:</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                    <Palette className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-red-800 dark:text-red-200">Color only</p>
                      <p className="text-sm text-red-600 dark:text-red-300">"Click the red button" - unusable for color blind users</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                    <Circle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-red-800 dark:text-red-200">Shape only</p>
                      <p className="text-sm text-red-600 dark:text-red-300">"Select the circular icon" - not clear for blind users</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                    <MapPin className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-red-800 dark:text-red-200">Position only</p>
                      <p className="text-sm text-red-600 dark:text-red-300">"Use the menu on the right" - varies by screen size</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                    <Volume1 className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-red-800 dark:text-red-200">Sound only</p>
                      <p className="text-sm text-red-600 dark:text-red-300">"Listen for the beep" - unusable for deaf users</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                    <Square className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-red-800 dark:text-red-200">Size only</p>
                      <p className="text-sm text-red-600 dark:text-red-300">"Click the small button" - relative and unclear</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                    <Eye className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-red-800 dark:text-red-200">Orientation only</p>
                      <p className="text-sm text-red-600 dark:text-red-300">"Rotate your device" - may not be possible</p>
                    </div>
                  </div>
                </div>
              </div>

              <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertTitle>Solution</AlertTitle>
                <AlertDescription>
                  Always provide multiple cues: combine color with text, shape with labels, 
                  position with clear descriptions. Make instructions accessible to all users.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Examples */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-6 w-6 text-amber-600" />
              Interactive Examples
            </CardTitle>
            <CardDescription>
              Compare accessible vs inaccessible instructions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Example Selector */}
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { key: 'color', label: 'Color Instructions', icon: Palette },
                  { key: 'shape', label: 'Shape Instructions', icon: Circle },
                  { key: 'position', label: 'Position Instructions', icon: MapPin },
                  { key: 'sound', label: 'Sound Instructions', icon: Volume1 }
                ].map(({ key, label, icon: Icon }) => (
                  <Button
                    key={key}
                    variant={selectedExample === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedExample(key)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {label}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setColorBlindMode(!colorBlindMode)}
                >
                  {colorBlindMode ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                  {colorBlindMode ? 'Normal' : 'Color Blind'} View
                </Button>
              </div>

              {/* Color Instructions Example */}
              {selectedExample === 'color' && (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Bad Example */}
                  <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-xl border border-red-200 dark:border-red-700">
                    <h4 className="font-semibold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
                      <XCircle className="h-5 w-5" />
                      ❌ Color Only Instructions
                    </h4>
                    
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border space-y-4">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        "To save your work, click the green button. To cancel, click the red button."
                      </p>
                      
                      <div className="flex gap-4 justify-center">
                        <button 
                          className={`px-6 py-2 rounded text-white font-medium ${
                            colorBlindMode 
                              ? 'bg-gray-500' // Simulates how it looks to color blind users
                              : 'bg-green-600 hover:bg-green-700'
                          }`}
                        >
                          Save
                        </button>
                        <button 
                          className={`px-6 py-2 rounded text-white font-medium ${
                            colorBlindMode 
                              ? 'bg-gray-600' // Simulates how it looks to color blind users
                              : 'bg-red-600 hover:bg-red-700'
                          }`}
                        >
                          Cancel
                        </button>
                      </div>
                      
                      {colorBlindMode && (
                        <div className="mt-3 p-3 bg-red-100 dark:bg-red-950/30 rounded">
                          <p className="text-sm text-red-700 dark:text-red-300">
                            ❌ In color blind view: Both buttons look similar! The instruction is unusable.
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      size="sm"
                      variant="destructive"
                      className="mt-3"
                      onClick={() => simulateInstruction('To save your work, click the green button. To cancel, click the red button.')}
                    >
                      <VolumeX className="h-4 w-4 mr-2" />
                      Hear Bad Instruction
                    </Button>
                  </div>

                  {/* Good Example */}
                  <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-xl border border-green-200 dark:border-green-700">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      ✅ Color + Text Instructions
                    </h4>
                    
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border space-y-4">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        "To save your work, click the 'Save' button. To cancel, click the 'Cancel' button."
                      </p>
                      
                      <div className="flex gap-4 justify-center">
                        <button 
                          className={`px-6 py-2 rounded text-white font-medium flex items-center gap-2 ${
                            colorBlindMode 
                              ? 'bg-gray-500' 
                              : 'bg-green-600 hover:bg-green-700'
                          }`}
                        >
                          <CheckCircle className="h-4 w-4" />
                          Save
                        </button>
                        <button 
                          className={`px-6 py-2 rounded text-white font-medium flex items-center gap-2 ${
                            colorBlindMode 
                              ? 'bg-gray-600' 
                              : 'bg-red-600 hover:bg-red-700'
                          }`}
                        >
                          <XCircle className="h-4 w-4" />
                          Cancel
                        </button>
                      </div>
                      
                      <div className="mt-3 p-3 bg-green-100 dark:bg-green-950/30 rounded">
                        <p className="text-sm text-green-700 dark:text-green-300">
                          ✅ Even in color blind view: Clear labels and icons make the buttons identifiable!
                        </p>
                      </div>
                    </div>
                    
                    <Button 
                      size="sm"
                      className="mt-3"
                      onClick={() => simulateInstruction('To save your work, click the Save button. To cancel, click the Cancel button.')}
                    >
                      <Volume2 className="h-4 w-4 mr-2" />
                      Hear Good Instruction
                    </Button>
                  </div>
                </div>
              )}

              {/* Shape Instructions Example */}
              {selectedExample === 'shape' && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-xl border border-red-200 dark:border-red-700">
                    <h4 className="font-semibold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
                      <XCircle className="h-5 w-5" />
                      ❌ Shape Only Instructions
                    </h4>
                    
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border space-y-4">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        "Click the circular button to play, the square button to stop, and the triangular button to record."
                      </p>
                      
                      <div className="flex gap-4 justify-center items-center">
                        <button className="p-3 bg-blue-600 rounded-full hover:bg-blue-700">
                          <Circle className="h-6 w-6 text-white fill-current" />
                        </button>
                        <button className="p-3 bg-blue-600 rounded hover:bg-blue-700">
                          <Square className="h-6 w-6 text-white fill-current" />
                        </button>
                        <button className="p-3 bg-blue-600 rounded hover:bg-blue-700">
                          <Triangle className="h-6 w-6 text-white fill-current" />
                        </button>
                      </div>
                      
                      <div className="mt-3 p-3 bg-red-100 dark:bg-red-950/30 rounded">
                        <p className="text-sm text-red-700 dark:text-red-300">
                          ❌ Problem: Blind users can't see shapes, and the instructions are unclear.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-xl border border-green-200 dark:border-green-700">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      ✅ Shape + Label Instructions
                    </h4>
                    
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border space-y-4">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        "Click 'Play' to start, 'Stop' to end, and 'Record' to begin recording."
                      </p>
                      
                      <div className="flex gap-4 justify-center items-center">
                        <button className="flex flex-col items-center gap-1 p-3 bg-blue-600 rounded hover:bg-blue-700">
                          <Play className="h-6 w-6 text-white" />
                          <span className="text-white text-xs">Play</span>
                        </button>
                        <button className="flex flex-col items-center gap-1 p-3 bg-blue-600 rounded hover:bg-blue-700">
                          <Square className="h-6 w-6 text-white fill-current" />
                          <span className="text-white text-xs">Stop</span>
                        </button>
                        <button className="flex flex-col items-center gap-1 p-3 bg-blue-600 rounded hover:bg-blue-700">
                          <Circle className="h-6 w-6 text-white border-2 border-white rounded-full" />
                          <span className="text-white text-xs">Record</span>
                        </button>
                      </div>
                      
                      <div className="mt-3 p-3 bg-green-100 dark:bg-green-950/30 rounded">
                        <p className="text-sm text-green-700 dark:text-green-300">
                          ✅ Clear labels make buttons accessible to all users!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Position Instructions Example */}
              {selectedExample === 'position' && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-xl border border-red-200 dark:border-red-700">
                    <h4 className="font-semibold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
                      <XCircle className="h-5 w-5" />
                      ❌ Position Only Instructions
                    </h4>
                    
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        "Use the menu on the right to navigate. Click the button at the bottom to submit."
                      </p>
                      
                      <div className="relative min-h-48 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded">
                        <div className="absolute top-4 right-4 bg-blue-100 dark:bg-blue-900/20 p-2 rounded text-xs">
                          Navigation Menu
                        </div>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm">
                            Submit
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-3 p-3 bg-red-100 dark:bg-red-950/30 rounded">
                        <p className="text-sm text-red-700 dark:text-red-300">
                          ❌ Problem: Position references fail on different screen sizes and for screen reader users.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-xl border border-green-200 dark:border-green-700">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      ✅ Descriptive Instructions
                    </h4>
                    
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        "Use the 'Navigation Menu' to browse sections. Click the 'Submit Form' button when ready."
                      </p>
                      
                      <div className="space-y-4">
                        <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded">
                          <h4 className="font-medium text-blue-800 dark:text-blue-200">Navigation Menu</h4>
                          <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1">
                            <li>• Home</li>
                            <li>• Products</li>
                            <li>• Support</li>
                          </ul>
                        </div>
                        
                        <div className="text-center">
                          <button className="px-6 py-3 bg-blue-600 text-white rounded font-medium">
                            Submit Form
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-3 p-3 bg-green-100 dark:bg-green-950/30 rounded">
                        <p className="text-sm text-green-700 dark:text-green-300">
                          ✅ Clear, descriptive labels work for all users and screen sizes!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sound Instructions Example */}
              {selectedExample === 'sound' && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-xl border border-red-200 dark:border-red-700">
                    <h4 className="font-semibold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
                      <XCircle className="h-5 w-5" />
                      ❌ Sound Only Instructions
                    </h4>
                    
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border space-y-4">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        "Listen for the beep sound to know when the file upload is complete."
                      </p>
                      
                      <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded text-center">
                        <Volume1 className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                        <p className="text-sm text-slate-600 dark:text-slate-400">Upload in progress...</p>
                        <p className="text-xs text-slate-500 mt-1">(Beep sound only indicator)</p>
                      </div>
                      
                      <div className="mt-3 p-3 bg-red-100 dark:bg-red-950/30 rounded">
                        <p className="text-sm text-red-700 dark:text-red-300">
                          ❌ Problem: Deaf and hard of hearing users cannot hear the completion signal.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-xl border border-green-200 dark:border-green-700">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      ✅ Multiple Indicators
                    </h4>
                    
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border space-y-4">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        "A success message will appear when your file upload is complete."
                      </p>
                      
                      <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded text-center border border-green-300 dark:border-green-700">
                        <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-green-800 dark:text-green-200">Upload Complete!</p>
                        <p className="text-xs text-green-700 dark:text-green-300 mt-1">Your file has been successfully uploaded</p>
                      </div>
                      
                      <div className="mt-3 p-3 bg-green-100 dark:bg-green-950/30 rounded">
                        <p className="text-sm text-green-700 dark:text-green-300">
                          ✅ Visual, text, and icon indicators work for all users!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Testing Methods */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-6 w-6 text-amber-600" />
              Testing Methods for 1.3.3
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Manual Testing</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Use color blindness simulators</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Turn off audio and test instructions</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Test with screen reader only</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Check on different screen sizes</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Automated Testing</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">axe DevTools color contrast analysis</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">WAVE color dependency checker</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Pa11y instruction analysis</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Color blindness browser extensions</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Implementation Examples */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-6 w-6 text-indigo-600" />
              Implementation Examples
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">HTML/CSS Implementation</h4>
                <div className="bg-slate-900 dark:bg-slate-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">HTML/CSS</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-slate-400 hover:text-white"
                      onClick={() => {
                        const code = `<!-- Bad: Color only -->
<button class="red-button">Delete</button>
<button class="green-button">Save</button>

<!-- Good: Color + text + icons -->
<button class="delete-button">
  <svg aria-hidden="true"><!-- delete icon --></svg>
  Delete
</button>
<button class="save-button">
  <svg aria-hidden="true"><!-- save icon --></svg>
  Save
</button>

<!-- Bad: Position only -->
<p>Click the button on the right to continue.</p>

<!-- Good: Clear identification -->
<p>Click the "Continue" button to proceed.</p>
<button id="continue-btn">Continue</button>

<!-- Bad: Shape only -->
<p>Select the circular option.</p>
<input type="radio" id="option1">

<!-- Good: Shape + label -->
<label for="option1">
  <input type="radio" id="option1">
  Premium Plan (recommended)
</label>

/* CSS for accessible styling */
.error { 
  color: red; 
  background: url('error-icon.svg') no-repeat;
  padding-left: 20px;
}

.error::before {
  content: "Error: ";
  font-weight: bold;
}

.success {
  color: green;
  background: url('success-icon.svg') no-repeat;
  padding-left: 20px;
}

.success::before {
  content: "Success: ";
  font-weight: bold;
}`;
                        navigator.clipboard.writeText(code);
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="text-sm text-slate-300 overflow-x-auto">
                    <code>{`<!-- Bad: Color only -->
<button class="red-button">Delete</button>
<button class="green-button">Save</button>

<!-- Good: Color + text + icons -->
<button class="delete-button">
  <svg aria-hidden="true"><!-- delete icon --></svg>
  Delete
</button>
<button class="save-button">
  <svg aria-hidden="true"><!-- save icon --></svg>
  Save
</button>

<!-- Bad: Position only -->
<p>Click the button on the right to continue.</p>

<!-- Good: Clear identification -->
<p>Click the "Continue" button to proceed.</p>
<button id="continue-btn">Continue</button>

<!-- Bad: Shape only -->
<p>Select the circular option.</p>
<input type="radio" id="option1">

<!-- Good: Shape + label -->
<label for="option1">
  <input type="radio" id="option1">
  Premium Plan (recommended)
</label>

/* CSS for accessible styling */
.error { 
  color: red; 
  background: url('error-icon.svg') no-repeat;
  padding-left: 20px;
}

.error::before {
  content: "Error: ";
  font-weight: bold;
}

.success {
  color: green;
  background: url('success-icon.svg') no-repeat;
  padding-left: 20px;
}

.success::before {
  content: "Success: ";
  font-weight: bold;
}`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">React Implementation</h4>
                <div className="bg-slate-900 dark:bg-slate-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">React/JSX</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-slate-400 hover:text-white"
                      onClick={() => {
                        const code = `// Accessible button component
function AccessibleButton({ type, children, onClick, ...props }) {
  const getButtonConfig = (type) => {
    const configs = {
      save: {
        className: 'bg-green-600 hover:bg-green-700',
        icon: <SaveIcon />,
        ariaLabel: 'Save your changes'
      },
      delete: {
        className: 'bg-red-600 hover:bg-red-700',
        icon: <DeleteIcon />,
        ariaLabel: 'Delete this item'
      },
      cancel: {
        className: 'bg-gray-600 hover:bg-gray-700',
        icon: <CancelIcon />,
        ariaLabel: 'Cancel operation'
      }
    };
    return configs[type] || {};
  };

  const config = getButtonConfig(type);

  return (
    <button
      className={\`flex items-center gap-2 px-4 py-2 text-white rounded font-medium \${config.className}\`}
      aria-label={config.ariaLabel}
      onClick={onClick}
      {...props}
    >
      {config.icon}
      {children}
    </button>
  );
}

// Accessible status messages
function StatusMessage({ type, message }) {
  const getStatusConfig = (type) => {
    return {
      error: {
        className: 'bg-red-50 border-red-200 text-red-800',
        icon: <ErrorIcon className="text-red-600" />,
        prefix: 'Error: '
      },
      success: {
        className: 'bg-green-50 border-green-200 text-green-800',
        icon: <SuccessIcon className="text-green-600" />,
        prefix: 'Success: '
      },
      warning: {
        className: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        icon: <WarningIcon className="text-yellow-600" />,
        prefix: 'Warning: '
      }
    }[type];
  };

  const config = getStatusConfig(type);

  return (
    <div 
      className={\`flex items-start gap-3 p-4 border rounded \${config.className}\`}
      role="alert"
      aria-live="polite"
    >
      {config.icon}
      <div>
        <span className="font-medium">{config.prefix}</span>
        {message}
      </div>
    </div>
  );
}

// Usage examples
<AccessibleButton type="save" onClick={handleSave}>
  Save Changes
</AccessibleButton>

<StatusMessage 
  type="success" 
  message="Your changes have been saved successfully." 
/>`;
                        navigator.clipboard.writeText(code);
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="text-sm text-slate-300 overflow-x-auto">
                    <code>{`// Accessible button component
function AccessibleButton({ type, children, onClick, ...props }) {
  const getButtonConfig = (type) => {
    const configs = {
      save: {
        className: 'bg-green-600 hover:bg-green-700',
        icon: <SaveIcon />,
        ariaLabel: 'Save your changes'
      },
      delete: {
        className: 'bg-red-600 hover:bg-red-700',
        icon: <DeleteIcon />,
        ariaLabel: 'Delete this item'
      },
      cancel: {
        className: 'bg-gray-600 hover:bg-gray-700',
        icon: <CancelIcon />,
        ariaLabel: 'Cancel operation'
      }
    };
    return configs[type] || {};
  };

  const config = getButtonConfig(type);

  return (
    <button
      className={\`flex items-center gap-2 px-4 py-2 text-white rounded font-medium \${config.className}\`}
      aria-label={config.ariaLabel}
      onClick={onClick}
      {...props}
    >
      {config.icon}
      {children}
    </button>
  );
}

// Accessible status messages
function StatusMessage({ type, message }) {
  const getStatusConfig = (type) => {
    return {
      error: {
        className: 'bg-red-50 border-red-200 text-red-800',
        icon: <ErrorIcon className="text-red-600" />,
        prefix: 'Error: '
      },
      success: {
        className: 'bg-green-50 border-green-200 text-green-800',
        icon: <SuccessIcon className="text-green-600" />,
        prefix: 'Success: '
      },
      warning: {
        className: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        icon: <WarningIcon className="text-yellow-600" />,
        prefix: 'Warning: '
      }
    }[type];
  };

  const config = getStatusConfig(type);

  return (
    <div 
      className={\`flex items-start gap-3 p-4 border rounded \${config.className}\`}
      role="alert"
      aria-live="polite"
    >
      {config.icon}
      <div>
        <span className="font-medium">{config.prefix}</span>
        {message}
      </div>
    </div>
  );
}

// Usage examples
<AccessibleButton type="save" onClick={handleSave}>
  Save Changes
</AccessibleButton>

<StatusMessage 
  type="success" 
  message="Your changes have been saved successfully." 
/>`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 