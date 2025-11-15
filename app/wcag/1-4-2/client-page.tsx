'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Square, 
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Copy,
  Eye,
  EyeOff,
  Settings,
  Timer,
  Headphones
} from 'lucide-react'

export default function WCAG142ClientPage() {
  // Audio control states
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState([50])
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [autoplayDemo, setAutoplayDemo] = useState(false)
  const [badAudioPlaying, setBadAudioPlaying] = useState(false)
  
  // Audio refs for simulation
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const badAudioRef = useRef<HTMLAudioElement | null>(null)
  
  // Compliance test states
  const [testResults, setTestResults] = useState({
    hasControls: false,
    hasVolumeControl: false,
    hasPauseButton: false,
    autoplayDuration: 0,
    tested: false
  })
  
  // Code examples
  const [copiedCode, setCopiedCode] = useState('')
  const [showScreenReader, setShowScreenReader] = useState(false)

  // Initialize audio simulation
  useEffect(() => {
    // Create audio context for simulation
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio()
      badAudioRef.current = new Audio()
      
      // Set up audio properties (using silence for demo)
      audioRef.current.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBCF+x/DZgyEFl'
      badAudioRef.current.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBCF+x/DZgyEFl'
      
      // Set duration for simulation
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(30) // 30 seconds simulation
      })
    }
  }, [])

  // Audio control functions
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause()
      setIsPlaying(false)
    } else {
      audioRef.current?.play()
      setIsPlaying(true)
      
      // Simulate time progress
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= 30) {
            clearInterval(interval)
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 1000)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
    }
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value)
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100
    }
  }

  const stopAudio = () => {
    setIsPlaying(false)
    setCurrentTime(0)
    audioRef.current?.pause()
    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }
  }

  const resetAudio = () => {
    stopAudio()
    setVolume([50])
    setIsMuted(false)
  }

  // Bad audio auto-play simulation
  const startBadAudio = () => {
    setBadAudioPlaying(true)
    setTimeout(() => {
      setBadAudioPlaying(false)
    }, 5000) // Auto-stop after 5 seconds
  }

  // Test audio compliance
  const testAudioCompliance = () => {
    setTestResults({
      hasControls: true, // Our demo has controls
      hasVolumeControl: true, // Our demo has volume control
      hasPauseButton: true, // Our demo has pause
      autoplayDuration: 0, // Our demo doesn't auto-play
      tested: true
    })
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

  const htmlExample = `<!-- Good Example: Audio with Controls -->
<audio controls preload="none">
  <source src="podcast.mp3" type="audio/mpeg">
  <source src="podcast.ogg" type="audio/ogg">
  <p>Your browser doesn't support HTML5 audio. 
     <a href="podcast.mp3">Download the audio file</a>.</p>
</audio>

<!-- Good Example: Background Audio with User Control -->
<div class="audio-controls">
  <button id="play-btn">Play Background Music</button>
  <button id="pause-btn">Pause</button>
  <button id="stop-btn">Stop</button>
  <input type="range" id="volume" min="0" max="100" value="50">
  <label for="volume">Volume</label>
</div>

<!-- Bad Example: Auto-playing Audio -->
<audio autoplay>
  <source src="background-music.mp3" type="audio/mpeg">
</audio>`

  const reactExample = `import React, { useState, useRef } from 'react'

function AccessibleAudioPlayer({ src, title }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(50)
  const audioRef = useRef(null)

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    audioRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value
    setVolume(newVolume)
    audioRef.current.volume = newVolume / 100
  }

  return (
    <div className="audio-player">
      <audio 
        ref={audioRef}
        src={src}
        preload="metadata"
        aria-label={title}
      />
      
      <div className="controls">
        <button 
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        
        <button 
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? 'Unmute' : 'Mute'}
        </button>
        
        <label htmlFor="volume-slider">
          Volume: {volume}%
        </label>
        <input
          id="volume-slider"
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          aria-label="Volume control"
        />
      </div>
    </div>
  )
}`

  const cssExample = `.audio-player {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;
}

.controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.controls button {
  padding: 0.5rem 1rem;
  border: 1px solid #007acc;
  background: #007acc;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.controls button:hover {
  background: #005a9e;
}

.controls button:focus {
  outline: 2px solid #007acc;
  outline-offset: 2px;
}

.controls input[type="range"] {
  width: 100px;
}

.controls label {
  font-weight: 500;
}

/* Auto-play warning styles */
.autoplay-warning {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  color: #856404;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.autoplay-warning::before {
  content: "⚠️ ";
  font-weight: bold;
}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-orange-100 text-orange-800 border-orange-200">
            WCAG 2.2 Level A
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            1.4.2 Audio Control
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            If audio on a web page plays automatically for more than 3 seconds, provide controls to pause or stop the audio, or control its volume.
          </p>
        </div>

        {/* Screen Reader Toggle */}
        <div className="mb-6 text-center">
          <Button
            onClick={() => setShowScreenReader(!showScreenReader)}
            variant="outline"
            className="border-orange-200 text-orange-700 hover:bg-orange-50"
          >
            {showScreenReader ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
            {showScreenReader ? 'Disable' : 'Enable'} Screen Reader Simulation
          </Button>
        </div>

        {/* Interactive Demo */}
        <Card className="mb-8 border-orange-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <CardTitle className="flex items-center gap-2">
              <Headphones className="h-5 w-5" />
              Interactive Audio Control Demo
            </CardTitle>
            <CardDescription className="text-orange-100">
              Experience proper audio controls and test different scenarios
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="good" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="good">✅ Good Example</TabsTrigger>
                <TabsTrigger value="bad">❌ Bad Example</TabsTrigger>
                <TabsTrigger value="test">🧪 Test Controls</TabsTrigger>
              </TabsList>
              
              <TabsContent value="good" className="space-y-4">
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Compliant:</strong> User-controlled audio with full controls
                  </AlertDescription>
                </Alert>
                
                <div className="bg-white p-6 rounded-lg border-2 border-green-200">
                  <h3 className="text-lg font-semibold mb-4">Accessible Audio Player</h3>
                  
                  {/* Audio Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Podcast Episode</span>
                      <span>{Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')} / {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}</span>
                    </div>
                    <Progress value={(currentTime / duration) * 100} className="h-2" />
                  </div>
                  
                  {/* Audio Controls */}
                  <div className="flex items-center gap-4 mb-4">
                    <Button
                      onClick={togglePlay}
                      variant="outline"
                      size="sm"
                      className="border-orange-200 text-orange-700 hover:bg-orange-50"
                      onMouseEnter={() => simulateScreenReader(isPlaying ? 'Pause button' : 'Play button')}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {isPlaying ? 'Pause' : 'Play'}
                    </Button>
                    
                    <Button
                      onClick={stopAudio}
                      variant="outline"
                      size="sm"
                      className="border-orange-200 text-orange-700 hover:bg-orange-50"
                      onMouseEnter={() => simulateScreenReader('Stop button')}
                    >
                      <Square className="h-4 w-4" />
                      Stop
                    </Button>
                    
                    <Button
                      onClick={toggleMute}
                      variant="outline"
                      size="sm"
                      className="border-orange-200 text-orange-700 hover:bg-orange-50"
                      onMouseEnter={() => simulateScreenReader(isMuted ? 'Unmute button' : 'Mute button')}
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      {isMuted ? 'Unmute' : 'Mute'}
                    </Button>
                    
                    <Button
                      onClick={resetAudio}
                      variant="outline"
                      size="sm"
                      className="border-orange-200 text-orange-700 hover:bg-orange-50"
                      onMouseEnter={() => simulateScreenReader('Reset audio button')}
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                  
                  {/* Volume Control */}
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700">Volume:</label>
                    <div className="flex-1 max-w-xs">
                      <Slider
                        value={volume}
                        onValueChange={handleVolumeChange}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12">{volume[0]}%</span>
                  </div>
                  
                  {isPlaying && (
                    <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
                      <p className="text-green-800 text-sm">
                        🎵 Audio is playing with user-controlled volume at {volume[0]}% {isMuted ? '(Muted)' : ''}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="bad" className="space-y-4">
                <Alert className="border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Non-compliant:</strong> Auto-playing audio without user controls
                  </AlertDescription>
                </Alert>
                
                <div className="bg-white p-6 rounded-lg border-2 border-red-200">
                  <h3 className="text-lg font-semibold mb-4">Problematic Audio Implementation</h3>
                  
                  <div className="space-y-4">
                    <Button
                      onClick={startBadAudio}
                      variant="destructive"
                      className="bg-red-500 hover:bg-red-600"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Simulate Auto-playing Audio
                    </Button>
                    
                    {badAudioPlaying && (
                      <div className="p-4 bg-red-50 rounded border border-red-200">
                        <p className="text-red-800 font-medium mb-2">
                          🔊 Audio is auto-playing!
                        </p>
                        <p className="text-red-700 text-sm">
                          This audio started automatically and plays for more than 3 seconds. 
                          Users cannot control or stop it, violating WCAG 1.4.2.
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-red-600">
                          <Timer className="h-4 w-4" />
                          <span className="text-sm">Playing automatically...</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-4 bg-gray-50 rounded border">
                      <h4 className="font-medium text-gray-900 mb-2">Problems with this approach:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• No pause or stop button</li>
                        <li>• No volume control</li>
                        <li>• Plays automatically for more than 3 seconds</li>
                        <li>• Cannot be controlled by users</li>
                        <li>• Interferes with screen readers</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="test" className="space-y-4">
                <Alert className="border-blue-200 bg-blue-50">
                  <Settings className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    Test audio implementations for WCAG 1.4.2 compliance
                  </AlertDescription>
                </Alert>
                
                <div className="bg-white p-6 rounded-lg border-2 border-blue-200">
                  <h3 className="text-lg font-semibold mb-4">Audio Control Compliance Test</h3>
                  
                  <div className="space-y-4">
                    <Button
                      onClick={testAudioCompliance}
                      variant="outline"
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Test Audio Controls
                    </Button>
                    
                    {testResults.tested && (
                      <div className="space-y-3">
                        <div className="p-4 bg-gray-50 rounded border">
                          <h4 className="font-medium text-gray-900 mb-3">Test Results:</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              {testResults.hasControls ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              <span className="text-sm">
                                Audio has user controls: {testResults.hasControls ? 'Yes' : 'No'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {testResults.hasVolumeControl ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              <span className="text-sm">
                                Volume control available: {testResults.hasVolumeControl ? 'Yes' : 'No'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {testResults.hasPauseButton ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              <span className="text-sm">
                                Pause/Stop button: {testResults.hasPauseButton ? 'Yes' : 'No'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {testResults.autoplayDuration <= 3 ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              <span className="text-sm">
                                Auto-play duration: {testResults.autoplayDuration}s (≤3s required)
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className={`p-4 rounded border ${
                          testResults.hasControls && testResults.hasVolumeControl && testResults.hasPauseButton && testResults.autoplayDuration <= 3
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                        }`}>
                          <p className={`font-medium ${
                            testResults.hasControls && testResults.hasVolumeControl && testResults.hasPauseButton && testResults.autoplayDuration <= 3
                              ? 'text-green-800'
                              : 'text-red-800'
                          }`}>
                            {testResults.hasControls && testResults.hasVolumeControl && testResults.hasPauseButton && testResults.autoplayDuration <= 3
                              ? '✅ WCAG 1.4.2 Compliant'
                              : '❌ WCAG 1.4.2 Non-compliant'
                            }
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Implementation Examples */}
        <Card className="mb-8 border-orange-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <CardTitle>Implementation Examples</CardTitle>
            <CardDescription className="text-orange-100">
              Copy-paste code examples for compliant audio controls
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="html" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="react">React</TabsTrigger>
                <TabsTrigger value="css">CSS</TabsTrigger>
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
            </Tabs>
          </CardContent>
        </Card>

        {/* Testing Methods */}
        <Card className="mb-8 border-orange-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <CardTitle>Testing Methods</CardTitle>
            <CardDescription className="text-orange-100">
              How to test for WCAG 1.4.2 compliance
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
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Manual Test Steps</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                      <li>Load the page and listen for any audio that starts automatically</li>
                      <li>If audio plays automatically, time how long it plays (must be ≤3 seconds to pass)</li>
                      <li>Check for visible audio controls (play/pause, stop, volume)</li>
                      <li>Test that all audio controls work properly</li>
                      <li>Verify volume control adjusts audio level or mutes completely</li>
                      <li>Ensure controls are keyboard accessible</li>
                      <li>Test with screen readers to ensure controls are announced</li>
                    </ol>
                  </div>
                  
                  <Alert className="border-blue-200 bg-blue-50">
                    <AlertTriangle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>Important:</strong> Test with actual screen reader users when possible, as they are most affected by auto-playing audio.
                    </AlertDescription>
                  </Alert>
                </div>
              </TabsContent>
              
              <TabsContent value="automated" className="space-y-4">
                <div className="space-y-4">
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Automated Testing Tools</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li><strong>axe-core:</strong> Detects audio elements without controls</li>
                      <li><strong>Pa11y:</strong> Checks for autoplay attributes</li>
                      <li><strong>WAVE:</strong> Identifies audio elements and control accessibility</li>
                      <li><strong>Custom Scripts:</strong> Test autoplay duration and control functionality</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">JavaScript Test Example:</h4>
                    <pre className="bg-gray-900 text-gray-100 p-3 rounded text-sm overflow-x-auto">
                      <code>{`// Test for auto-playing audio
const audioElements = document.querySelectorAll('audio, video');
const violations = [];

audioElements.forEach(element => {
  if (element.autoplay) {
    violations.push({
      element: element,
      issue: 'Auto-playing media detected'
    });
  }
  
  if (!element.controls && !element.hasAttribute('muted')) {
    violations.push({
      element: element,
      issue: 'No user controls available'
    });
  }
});

console.log('WCAG 1.4.2 Violations:', violations);`}</code>
                    </pre>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Key Requirements */}
        <Card className="border-orange-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <CardTitle>Key Requirements Summary</CardTitle>
            <CardDescription className="text-orange-100">
              Essential points for WCAG 1.4.2 compliance
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  What TO Do
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Provide audio controls (play, pause, stop, volume)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Use preload="none" or preload="metadata" for large audio files</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Make controls keyboard accessible</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Provide proper ARIA labels for controls</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Test with screen readers</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  What NOT to Do
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Use autoplay for audio longer than 3 seconds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Provide audio without user controls</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Auto-play background music without controls</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Create controls that are not keyboard accessible</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Hide or disable native browser controls</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="text-center">
              <p className="text-gray-600 mb-2">
                <strong>Remember:</strong> Audio control is crucial for users with cognitive disabilities, 
                hearing impairments, and those using screen readers.
              </p>
              <p className="text-sm text-gray-500">
                Auto-playing audio can interfere with assistive technologies and cause disorientation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 