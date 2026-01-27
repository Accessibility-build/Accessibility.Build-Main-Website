'use client'

import { useState, useRef, useEffect } from 'react'
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
  Keyboard,
  Focus,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  MousePointer,
  Settings,
  Play,
  Pause,
  Square,
  SkipForward,
  Volume2,
  Info
} from 'lucide-react'

export default function WCAG211ClientPage() {
  // Keyboard navigation states
  const [currentFocus, setCurrentFocus] = useState('')
  const [keyboardEventsLog, setKeyboardEventsLog] = useState<string[]>([])
  const [focusVisible, setFocusVisible] = useState(true)
  const [customTabOrder, setCustomTabOrder] = useState(false)
  
  // Demo states
  const [demoMode, setDemoMode] = useState('good')
  const [mediaPlayerState, setMediaPlayerState] = useState({
    playing: false,
    volume: 50,
    currentTime: 0,
    duration: 100
  })
  
  // Code examples and screen reader
  const [copiedCode, setCopiedCode] = useState('')
  const [showScreenReader, setShowScreenReader] = useState(false)
  
  // Refs for focus management
  const focusRefs = useRef<{ [key: string]: HTMLElement | null }>({})
  
  // Log keyboard events
  const logKeyboardEvent = (event: string) => {
    setKeyboardEventsLog(prev => [...prev.slice(-9), event])
  }
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, elementId: string) => {
    setCurrentFocus(elementId)
    
    const key = e.key
    const target = e.target as HTMLElement
    
    logKeyboardEvent(`${key} on ${elementId}`)
    
    // Handle special keys
    if (key === 'Enter' || key === ' ') {
      if (elementId.includes('button') || elementId.includes('play')) {
        e.preventDefault()
        // Simulate click
        target.click()
      }
    }
    
    // Handle arrow keys for custom navigation
    if (elementId.includes('custom-nav')) {
      const customElements = ['custom-nav-1', 'custom-nav-2', 'custom-nav-3', 'custom-nav-4']
      const currentIndex = customElements.indexOf(elementId)
      
      if (key === 'ArrowLeft' && currentIndex > 0) {
        e.preventDefault()
        focusRefs.current[customElements[currentIndex - 1]]?.focus()
      } else if (key === 'ArrowRight' && currentIndex < customElements.length - 1) {
        e.preventDefault()
        focusRefs.current[customElements[currentIndex + 1]]?.focus()
      }
    }
  }
  
  // Handle media player keyboard controls
  const handleMediaKeyDown = (e: React.KeyboardEvent) => {
    const key = e.key
    
    switch (key) {
      case ' ':
      case 'Enter':
        e.preventDefault()
        togglePlay()
        break
      case 'ArrowLeft':
        e.preventDefault()
        skipBackward()
        break
      case 'ArrowRight':
        e.preventDefault()
        skipForward()
        break
      case 'ArrowUp':
        e.preventDefault()
        volumeUp()
        break
      case 'ArrowDown':
        e.preventDefault()
        volumeDown()
        break
    }
  }
  
  // Media player controls
  const togglePlay = () => {
    setMediaPlayerState(prev => ({
      ...prev,
      playing: !prev.playing
    }))
  }
  
  const skipForward = () => {
    setMediaPlayerState(prev => ({
      ...prev,
      currentTime: Math.min(prev.currentTime + 10, prev.duration)
    }))
  }
  
  const skipBackward = () => {
    setMediaPlayerState(prev => ({
      ...prev,
      currentTime: Math.max(prev.currentTime - 10, 0)
    }))
  }
  
  const volumeUp = () => {
    setMediaPlayerState(prev => ({
      ...prev,
      volume: Math.min(prev.volume + 10, 100)
    }))
  }
  
  const volumeDown = () => {
    setMediaPlayerState(prev => ({
      ...prev,
      volume: Math.max(prev.volume - 10, 0)
    }))
  }
  
  // Clear event log
  const clearLog = () => {
    setKeyboardEventsLog([])
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

  const htmlExample = `<!-- Good Example: Keyboard Accessible Button -->
<button 
  type="button" 
  onclick="handleClick()"
  onkeydown="handleKeyDown(event)"
  aria-label="Save document"
  class="accessible-button"
>
  Save
</button>

<!-- Good Example: Keyboard Accessible Link -->
<a 
  href="/documents" 
  onkeydown="handleKeyDown(event)"
  aria-describedby="documents-help"
>
  View Documents
</a>
<div id="documents-help" class="sr-only">
  Navigate to documents page
</div>

<!-- Good Example: Custom Interactive Element -->
<div 
  role="button" 
  tabindex="0"
  onclick="customAction()"
  onkeydown="handleCustomKeyDown(event)"
  aria-label="Toggle sidebar"
  class="custom-button"
>
  Toggle Sidebar
</div>

<!-- Good Example: Skip Link -->
<a href="#main-content" class="skip-link">
  Skip to main content
</a>
<main id="main-content" tabindex="-1">
  <!-- Main content -->
</main>

<!-- Bad Example: Non-keyboard Accessible -->
<div onclick="handleClick()">
  <!-- This div is not keyboard accessible -->
  Click me
</div>

<!-- Bad Example: Missing Tab Navigation -->
<div role="button" onclick="handleClick()">
  <!-- Missing tabindex and keyboard handlers -->
  Not keyboard accessible
</div>`

  const cssExample = `/* Focus indicators */
.accessible-button:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
  /* Never remove focus indicators */
}

.custom-button:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
  background-color: #f0f8ff;
  /* Custom focus styling */
}

/* Skip links */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 1000;
  transition: top 0.3s;
}

.skip-link:focus {
  top: 6px;
  /* Show skip link on focus */
}

/* Focus within containers */
.navigation-container:focus-within {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* Keyboard navigation indicators */
.keyboard-nav-active .focusable-element {
  position: relative;
}

.keyboard-nav-active .focusable-element:focus::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 2px solid #0066cc;
  border-radius: 4px;
  pointer-events: none;
}

/* Tab order management */
.tab-order-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tab-order-item {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-order-item:hover {
  background: #f5f5f5;
}

.tab-order-item:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
  background: #f0f8ff;
}

/* Bad example - removed focus indicators */
.bad-button:focus {
  outline: none; /* DON'T DO THIS */
}

/* Media player keyboard controls */
.media-player {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  background: white;
}

.media-player:focus-within {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

.media-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.media-control-button {
  padding: 8px;
  border: 1px solid #ccc;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.media-control-button:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
  background: #f0f8ff;
}

.media-control-button:active {
  background: #e0e0e0;
}`

  const reactExample = `import React, { useState, useRef, useEffect } from 'react'

// Hook for managing keyboard navigation
const useKeyboardNavigation = (items) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemRefs = useRef([])

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setCurrentIndex(prev => (prev + 1) % items.length)
        break
      case 'ArrowUp':
        event.preventDefault()
        setCurrentIndex(prev => (prev - 1 + items.length) % items.length)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        items[currentIndex].action()
        break
    }
  }

  useEffect(() => {
    itemRefs.current[currentIndex]?.focus()
  }, [currentIndex])

  return { currentIndex, itemRefs, handleKeyDown }
}

// Keyboard accessible button component
const AccessibleButton = ({ 
  children, 
  onClick, 
  disabled = false, 
  ariaLabel,
  className = "" 
}) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (!disabled) {
        onClick()
      }
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-label={ariaLabel}
      className={\`accessible-button \${className}\`}
    >
      {children}
    </button>
  )
}

// Keyboard accessible custom element
const AccessibleCustomElement = ({ 
  children, 
  onClick, 
  role = "button",
  ariaLabel 
}) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick()
    }
  }

  return (
    <div
      role={role}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      className="custom-interactive-element"
    >
      {children}
    </div>
  )
}

// Media player with keyboard controls
const KeyboardMediaPlayer = ({ src, title }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(50)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(100)
  const playerRef = useRef(null)

  const handlePlayerKeyDown = (event) => {
    switch (event.key) {
      case ' ':
      case 'Enter':
        event.preventDefault()
        togglePlay()
        break
      case 'ArrowLeft':
        event.preventDefault()
        skipBackward()
        break
      case 'ArrowRight':
        event.preventDefault()
        skipForward()
        break
      case 'ArrowUp':
        event.preventDefault()
        volumeUp()
        break
      case 'ArrowDown':
        event.preventDefault()
        volumeDown()
        break
    }
  }

  const togglePlay = () => setIsPlaying(!isPlaying)
  const skipForward = () => setCurrentTime(Math.min(currentTime + 10, duration))
  const skipBackward = () => setCurrentTime(Math.max(currentTime - 10, 0))
  const volumeUp = () => setVolume(Math.min(volume + 10, 100))
  const volumeDown = () => setVolume(Math.max(volume - 10, 0))

  return (
    <div 
      className="media-player"
      ref={playerRef}
      tabIndex={0}
      onKeyDown={handlePlayerKeyDown}
      aria-label={\`Media player: \${title}\`}
      role="region"
    >
      <div className="media-info">
        <h3>{title}</h3>
        <div>
          Time: {currentTime}s / {duration}s | Volume: {volume}%
        </div>
      </div>
      
      <div className="media-controls">
        <button 
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>
        
        <div className="keyboard-hints">
          <small>
            Space: Play/Pause | ←→: Skip | ↑↓: Volume
          </small>
        </div>
      </div>
    </div>
  )
}

// Skip link component
const SkipLink = ({ href, children }) => {
  return (
    <a 
      href={href} 
      className="skip-link"
      onFocus={() => {
        // Ensure skip link is visible when focused
        const target = document.querySelector(href)
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' })
        }
      }}
    >
      {children}
    </a>
  )
}

// Main app component
function KeyboardAccessibleApp() {
  const menuItems = [
    { label: 'Home', action: () => console.log('Home clicked') },
    { label: 'About', action: () => console.log('About clicked') },
    { label: 'Services', action: () => console.log('Services clicked') },
    { label: 'Contact', action: () => console.log('Contact clicked') }
  ]

  const { currentIndex, itemRefs, handleKeyDown } = useKeyboardNavigation(menuItems)

  return (
    <div className="app">
      <SkipLink href="#main-content">
        Skip to main content
      </SkipLink>
      
      <nav 
        className="navigation"
        onKeyDown={handleKeyDown}
        aria-label="Main navigation"
      >
        {menuItems.map((item, index) => (
          <button
            key={item.label}
            ref={el => itemRefs.current[index] = el}
            onClick={item.action}
            className={index === currentIndex ? 'nav-item active' : 'nav-item'}
            tabIndex={index === currentIndex ? 0 : -1}
          >
            {item.label}
          </button>
        ))}
      </nav>
      
      <main id="main-content" tabIndex={-1}>
        <KeyboardMediaPlayer 
          src="/audio/sample.mp3" 
          title="Sample Audio" 
        />
        
        <AccessibleButton 
          onClick={() => console.log('Save clicked')}
          ariaLabel="Save document"
        >
          Save
        </AccessibleButton>
        
        <AccessibleCustomElement
          onClick={() => console.log('Custom action')}
          ariaLabel="Toggle sidebar"
        >
          Toggle Sidebar
        </AccessibleCustomElement>
      </main>
    </div>
  )
}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-indigo-100 text-indigo-800 border-indigo-200">
            WCAG 2.2 Level A
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            2.1.1 Keyboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            All functionality must be available from a keyboard without requiring specific timings for individual keystrokes.
          </p>
        </div>

        {/* Screen Reader Toggle */}
        <div className="mb-6 text-center">
          <Button
            onClick={() => setShowScreenReader(!showScreenReader)}
            variant="outline"
            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
          >
            {showScreenReader ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
            {showScreenReader ? 'Disable' : 'Enable'} Screen Reader Simulation
          </Button>
        </div>

        {/* Interactive Keyboard Demo */}
        <Card className="mb-8 border-indigo-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <CardTitle className="flex flex-wrap items-center gap-2">
              <Keyboard className="h-5 w-5" />
              Interactive Keyboard Navigation Demo
            </CardTitle>
            <CardDescription className="text-indigo-100">
              Test keyboard navigation and see real-time focus indicators
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Demo Controls */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label>Focus Indicators:</Label>
                  <Button
                    onClick={() => setFocusVisible(!focusVisible)}
                    variant="outline"
                    size="sm"
                    className="border-indigo-200 text-indigo-700"
                  >
                    {focusVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    {focusVisible ? 'Visible' : 'Hidden'}
                  </Button>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-3">Try These Elements (Use Tab/Shift+Tab)</h3>
                  <div className="space-y-2">
                    <Button
                      ref={el => { focusRefs.current['demo-button-1'] = el }}
                      onKeyDown={(e) => handleKeyDown(e, 'demo-button-1')}
                      onFocus={() => {
                        setCurrentFocus('demo-button-1')
                        simulateScreenReader('Interactive button 1')
                      }}
                      className="w-full bg-indigo-500 hover:bg-indigo-600"
                      style={{ outline: focusVisible ? undefined : 'none' }}
                    >
                      Button 1
                    </Button>
                    
                    <Button
                      ref={el => { focusRefs.current['demo-button-2'] = el }}
                      onKeyDown={(e) => handleKeyDown(e, 'demo-button-2')}
                      onFocus={() => {
                        setCurrentFocus('demo-button-2')
                        simulateScreenReader('Interactive button 2')
                      }}
                      variant="outline"
                      className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                      style={{ outline: focusVisible ? undefined : 'none' }}
                    >
                      Button 2
                    </Button>
                    
                    <Input
                      ref={el => { focusRefs.current['demo-input'] = el }}
                      onKeyDown={(e) => handleKeyDown(e, 'demo-input')}
                      onFocus={() => {
                        setCurrentFocus('demo-input')
                        simulateScreenReader('Text input field')
                      }}
                      placeholder="Type something..."
                      className="w-full"
                      style={{ outline: focusVisible ? undefined : 'none' }}
                    />
                    
                    <div
                      ref={el => { focusRefs.current['demo-custom'] = el }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => handleKeyDown(e, 'demo-custom')}
                      onFocus={() => {
                        setCurrentFocus('demo-custom')
                        simulateScreenReader('Custom interactive element')
                      }}
                      className="w-full p-3 bg-purple-100 border border-purple-300 rounded text-center cursor-pointer hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      style={{ outline: focusVisible ? undefined : 'none' }}
                    >
                      Custom Element (Press Enter/Space)
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Custom Arrow Key Navigation</h3>
                  <p className="text-sm text-gray-600 mb-3">Use left/right arrows to navigate:</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map(num => (
                      <button
                        key={num}
                        ref={el => { focusRefs.current[`custom-nav-${num}`] = el }}
                        onKeyDown={(e) => handleKeyDown(e, `custom-nav-${num}`)}
                        onFocus={() => {
                          setCurrentFocus(`custom-nav-${num}`)
                          simulateScreenReader(`Custom navigation item ${num}`)
                        }}
                        className="flex-1 p-2 bg-blue-200 border border-blue-300 rounded hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ outline: focusVisible ? undefined : 'none' }}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Focus Tracking */}
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Current Focus</h3>
                  <div className="flex items-center gap-2">
                    <Focus className="h-4 w-4 text-indigo-600" />
                    <span className="font-mono text-sm">
                      {currentFocus || 'No element focused'}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Keyboard Events Log</h3>
                    <Button
                      onClick={clearLog}
                      variant="outline"
                      size="sm"
                      className="border-indigo-200 text-indigo-700"
                    >
                      Clear
                    </Button>
                  </div>
                  <div className="bg-black text-green-400 p-3 rounded font-mono text-sm h-32 overflow-y-auto">
                    {keyboardEventsLog.length === 0 ? (
                      <div className="text-gray-500">No events logged yet...</div>
                    ) : (
                      keyboardEventsLog.map((event, index) => (
                        <div key={index} className="mb-1">
                          {event}
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Keyboard Shortcuts</h3>
                  <div className="text-sm space-y-1 text-gray-700">
                    <div><kbd className="px-2 py-1 bg-gray-200 rounded">Tab</kbd> - Next element</div>
                    <div><kbd className="px-2 py-1 bg-gray-200 rounded">Shift+Tab</kbd> - Previous element</div>
                    <div><kbd className="px-2 py-1 bg-gray-200 rounded">Enter</kbd> - Activate element</div>
                    <div><kbd className="px-2 py-1 bg-gray-200 rounded">Space</kbd> - Activate button</div>
                    <div><kbd className="px-2 py-1 bg-gray-200 rounded">←→</kbd> - Custom navigation</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media Player Demo */}
        <Card className="mb-8 border-indigo-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Keyboard-Accessible Media Player
            </CardTitle>
            <CardDescription className="text-indigo-100">
              Control media playback using keyboard only
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div
              className="p-4 bg-gray-100 rounded-lg border-2 border-gray-300 focus-within:border-indigo-500"
              tabIndex={0}
              onKeyDown={handleMediaKeyDown}
              onFocus={() => simulateScreenReader('Media player controls. Use space to play or pause, arrow keys to navigate and control volume.')}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Sample Audio Track</h3>
                <Badge variant="secondary">Focus this area and use keyboard</Badge>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={togglePlay}
                    variant="outline"
                    size="sm"
                    className="border-indigo-200 text-indigo-700"
                  >
                    {mediaPlayerState.playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {mediaPlayerState.playing ? 'Pause' : 'Play'}
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    <span className="text-sm">Volume: {mediaPlayerState.volume}%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{mediaPlayerState.currentTime}s</span>
                    <span>{mediaPlayerState.duration}s</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(mediaPlayerState.currentTime / mediaPlayerState.duration) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Keyboard Controls:</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <div><kbd className="px-2 py-1 bg-blue-200 rounded">Space</kbd> or <kbd className="px-2 py-1 bg-blue-200 rounded">Enter</kbd> - Play/Pause</div>
                    <div><kbd className="px-2 py-1 bg-blue-200 rounded">←</kbd> - Skip backward 10s</div>
                    <div><kbd className="px-2 py-1 bg-blue-200 rounded">→</kbd> - Skip forward 10s</div>
                    <div><kbd className="px-2 py-1 bg-blue-200 rounded">↑</kbd> - Volume up</div>
                    <div><kbd className="px-2 py-1 bg-blue-200 rounded">↓</kbd> - Volume down</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Good vs Bad Examples */}
        <Card className="mb-8 border-indigo-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Good vs Bad Examples
            </CardTitle>
            <CardDescription className="text-indigo-100">
              Compare keyboard accessible and inaccessible implementations
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="good" className="w-full">
              <TabsList className="flex flex-col h-auto w-full sm:grid sm:grid-cols-2">
                <TabsTrigger value="good" className="w-full">✅ Good Examples</TabsTrigger>
                <TabsTrigger value="bad" className="w-full">❌ Bad Examples</TabsTrigger>
              </TabsList>
              
              <TabsContent value="good" className="space-y-4">
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Compliant:</strong> These examples provide full keyboard accessibility
                  </AlertDescription>
                </Alert>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <h3 className="font-semibold mb-3">✅ Native Button</h3>
                    <button 
                      className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onFocus={() => simulateScreenReader('Good example: Native button with proper focus handling')}
                    >
                      Native Button
                    </button>
                    <p className="text-sm text-green-700 mt-2">
                      • Focusable by default<br/>
                      • Responds to Enter and Space<br/>
                      • Clear focus indicator<br/>
                      • Accessible to screen readers
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <h3 className="font-semibold mb-3">✅ Custom Interactive Element</h3>
                    <div
                      role="button"
                      tabIndex={0}
                      className="w-full p-3 bg-purple-500 text-white rounded cursor-pointer hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          alert('Custom element activated!')
                        }
                      }}
                      onFocus={() => simulateScreenReader('Good example: Custom element with proper ARIA roles and keyboard handling')}
                    >
                      Custom Element
                    </div>
                    <p className="text-sm text-green-700 mt-2">
                      • Has role="button"<br/>
                      • Has tabIndex="0"<br/>
                      • Handles Enter and Space<br/>
                      • Visible focus indicator
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <h3 className="font-semibold mb-3">✅ Skip Link</h3>
                    <a 
                      href="#main-content"
                      className="inline-block p-2 bg-black text-white rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      onFocus={() => simulateScreenReader('Good example: Skip link for keyboard navigation')}
                    >
                      Skip to main content
                    </a>
                    <p className="text-sm text-green-700 mt-2">
                      • Allows quick navigation<br/>
                      • Visible on focus<br/>
                      • Helps keyboard users<br/>
                      • Screen reader friendly
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <h3 className="font-semibold mb-3">✅ Form with Labels</h3>
                    <div className="space-y-2">
                      <label htmlFor="good-input" className="block text-sm font-medium">
                        Your Name
                      </label>
                      <input
                        id="good-input"
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onFocus={() => simulateScreenReader('Good example: Form input with proper label association')}
                      />
                    </div>
                    <p className="text-sm text-green-700 mt-2">
                      • Proper label association<br/>
                      • Clear focus indicator<br/>
                      • Screen reader accessible<br/>
                      • Logical tab order
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="bad" className="space-y-4">
                <Alert className="border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Non-compliant:</strong> These examples fail keyboard accessibility
                  </AlertDescription>
                </Alert>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                    <h3 className="font-semibold mb-3">❌ Div with Only onClick</h3>
                    <div 
                      className="w-full p-3 bg-gray-500 text-white rounded cursor-pointer hover:bg-gray-600"
                      onClick={() => alert('Clicked but not keyboard accessible!')}
                      onFocus={() => simulateScreenReader('Bad example: Div with only mouse click handler')}
                    >
                      Non-focusable Div
                    </div>
                    <p className="text-sm text-red-700 mt-2">
                      • No tabIndex<br/>
                      • No keyboard handlers<br/>
                      • Not focusable<br/>
                      • Screen reader issues
                    </p>
                  </div>
                  
                  <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                    <h3 className="font-semibold mb-3">❌ Button with Removed Focus</h3>
                    <button 
                      className="w-full p-3 bg-red-500 text-white rounded hover:bg-red-600"
                      style={{ outline: 'none' }}
                      onFocus={() => simulateScreenReader('Bad example: Button with removed focus indicators')}
                    >
                      No Focus Outline
                    </button>
                    <p className="text-sm text-red-700 mt-2">
                      • Focus outline removed<br/>
                      • Keyboard users can't see focus<br/>
                      • Poor accessibility<br/>
                      • WCAG violation
                    </p>
                  </div>
                  
                  <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                    <h3 className="font-semibold mb-3">❌ Image as Button</h3>
                    <img 
                      src="/api/placeholder/200/50"
                      alt="Click me"
                      className="cursor-pointer border border-gray-300 rounded"
                      onClick={() => alert('Image clicked but not keyboard accessible!')}
                      onFocus={() => simulateScreenReader('Bad example: Image used as button without proper accessibility')}
                    />
                    <p className="text-sm text-red-700 mt-2">
                      • Image used as button<br/>
                      • No keyboard interaction<br/>
                      • No proper role<br/>
                      • Confusing for users
                    </p>
                  </div>
                  
                  <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                    <h3 className="font-semibold mb-3">❌ Form without Labels</h3>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Enter your name"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onFocus={() => simulateScreenReader('Bad example: Form input without proper label')}
                      />
                    </div>
                    <p className="text-sm text-red-700 mt-2">
                      • No label association<br/>
                      • Screen reader issues<br/>
                      • Poor user experience<br/>
                      • Accessibility violation
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Implementation Examples */}
        <Card className="mb-8 border-indigo-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <CardTitle>Implementation Examples</CardTitle>
            <CardDescription className="text-indigo-100">
              Copy-paste code examples for keyboard accessibility
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="html" className="w-full">
              <TabsList className="h-auto w-full grid grid-cols-3">
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
        <Card className="mb-8 border-indigo-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <CardTitle>Testing Methods</CardTitle>
            <CardDescription className="text-indigo-100">
              How to test for WCAG 2.1.1 compliance
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="manual" className="w-full">
              <TabsList className="flex flex-col h-auto w-full sm:grid sm:grid-cols-2">
                <TabsTrigger value="manual" className="w-full">Manual Testing</TabsTrigger>
                <TabsTrigger value="automated" className="w-full">Automated Testing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="manual" className="space-y-4">
                <div className="space-y-4">
                  <div className="border-l-4 border-indigo-500 pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Manual Test Steps</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                      <li>Unplug your mouse or hide your cursor</li>
                      <li>Navigate the entire page using only the keyboard</li>
                      <li>Test all interactive elements (buttons, links, forms)</li>
                      <li>Verify focus indicators are visible on all elements</li>
                      <li>Check that Tab order is logical and intuitive</li>
                      <li>Test custom interactive elements for Enter/Space support</li>
                      <li>Verify no keyboard traps exist</li>
                      <li>Test with screen readers for additional verification</li>
                    </ol>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Essential Keyboard Testing</h4>
                    <ul className="text-blue-800 space-y-1 text-sm">
                      <li>• <strong>Tab/Shift+Tab:</strong> Navigate between focusable elements</li>
                      <li>• <strong>Enter:</strong> Activate buttons and links</li>
                      <li>• <strong>Space:</strong> Activate buttons and checkboxes</li>
                      <li>• <strong>Arrow Keys:</strong> Navigate within components (dropdowns, tabs)</li>
                      <li>• <strong>Escape:</strong> Close modals and dropdowns</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="automated" className="space-y-4">
                <div className="space-y-4">
                  <div className="border-l-4 border-indigo-500 pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Automated Testing Tools</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li><strong>axe-core:</strong> Detects keyboard accessibility issues</li>
                      <li><strong>Pa11y:</strong> Checks focusability and tab order</li>
                      <li><strong>WAVE:</strong> Identifies keyboard navigation problems</li>
                      <li><strong>Lighthouse:</strong> Includes keyboard accessibility checks</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">JavaScript Testing Example:</h4>
                    <pre className="bg-gray-900 text-gray-100 p-3 rounded text-sm overflow-x-auto">
                      <code>{`// Test keyboard accessibility
const keyboardTester = {
  // Check if element is focusable
  isFocusable: (element) => {
    if (element.disabled) return false;
    if (element.tabIndex < 0) return false;
    
    const focusableElements = [
      'a', 'button', 'input', 'textarea', 'select', 'details',
      '[tabindex]', '[contenteditable]'
    ];
    
    return focusableElements.some(selector => 
      element.matches(selector)
    );
  },
  
  // Get tab order
  getTabOrder: () => {
    const focusableElements = Array.from(
      document.querySelectorAll(
        'a, button, input, textarea, select, details, [tabindex], [contenteditable]'
      )
    ).filter(el => {
      return keyboardTester.isFocusable(el) && 
             window.getComputedStyle(el).display !== 'none';
    });
    
    return focusableElements.sort((a, b) => {
      const aIndex = a.tabIndex || 0;
      const bIndex = b.tabIndex || 0;
      
      if (aIndex === bIndex) return 0;
      if (aIndex === 0) return 1;
      if (bIndex === 0) return -1;
      return aIndex - bIndex;
    });
  },
  
  // Test for keyboard traps
  testKeyboardTraps: () => {
    const tabOrder = keyboardTester.getTabOrder();
    const violations = [];
    
    tabOrder.forEach((element, index) => {
      element.focus();
      
      // Simulate Tab key
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
      element.dispatchEvent(tabEvent);
      
      // Check if focus moved to next element
      const nextElement = tabOrder[index + 1];
      if (nextElement && document.activeElement !== nextElement) {
        violations.push({
          element: element,
          issue: 'Potential keyboard trap detected'
        });
      }
    });
    
    return violations;
  },
  
  // Test custom interactive elements
  testCustomElements: () => {
    const customElements = document.querySelectorAll('[role="button"], [role="tab"], [role="menuitem"]');
    const violations = [];
    
    customElements.forEach(element => {
      if (!keyboardTester.isFocusable(element)) {
        violations.push({
          element: element,
          issue: 'Custom interactive element not focusable'
        });
      }
      
      // Test for keyboard event handlers
      const hasKeyHandler = element.onkeydown || element.onkeyup || element.onkeypress;
      if (!hasKeyHandler) {
        violations.push({
          element: element,
          issue: 'Custom interactive element missing keyboard handlers'
        });
      }
    });
    
    return violations;
  }
};

// Run comprehensive keyboard test
const testResults = {
  tabOrder: keyboardTester.getTabOrder(),
  keyboardTraps: keyboardTester.testKeyboardTraps(),
  customElements: keyboardTester.testCustomElements()
};

console.log('Keyboard Accessibility Test Results:', testResults);`}</code>
                    </pre>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Key Requirements */}
        <Card className="border-indigo-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <CardTitle>Key Requirements Summary</CardTitle>
            <CardDescription className="text-indigo-100">
              Essential points for WCAG 2.1.1 compliance
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
                    <span>Make all interactive elements keyboard focusable</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Provide visible focus indicators</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Ensure logical tab order</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Handle Enter and Space keys for custom buttons</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Test with keyboard-only navigation</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  What NOT to Do
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Remove focus indicators (outline: none)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Use divs with only onClick handlers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Create keyboard traps</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Ignore logical tab order</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Rely solely on mouse interactions</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="text-center">
              <p className="text-gray-600 mb-2">
                <strong>Remember:</strong> Keyboard accessibility is essential for users with motor disabilities, 
                power users, and anyone who cannot use a mouse effectively.
              </p>
              <p className="text-sm text-gray-500">
                Test your interfaces with keyboard-only navigation regularly to ensure full accessibility.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 