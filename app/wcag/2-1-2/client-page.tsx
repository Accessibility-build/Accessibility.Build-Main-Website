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
  Zap,
  Shield,
  X,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  Lock,
  Unlock,
  Search,
  Settings,
  Info,
  MousePointer
} from 'lucide-react'

export default function WCAG212ClientPage() {
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBadModalOpen, setIsBadModalOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  // Trap detection states
  const [isTrapped, setIsTrapped] = useState(false)
  const [trapDetected, setTrapDetected] = useState(false)
  const [currentFocus, setCurrentFocus] = useState('')
  const [navigationLog, setNavigationLog] = useState<string[]>([])
  
  // Code examples and screen reader
  const [copiedCode, setCopiedCode] = useState('')
  const [showScreenReader, setShowScreenReader] = useState(false)
  
  // Refs for focus management
  const modalRef = useRef<HTMLDivElement>(null)
  const badModalRef = useRef<HTMLDivElement>(null)
  const trapRef = useRef<HTMLDivElement>(null)
  const firstFocusableRef = useRef<HTMLElement>(null)
  const lastFocusableRef = useRef<HTMLElement>(null)
  
  // Focus trap elements
  const [trapElements, setTrapElements] = useState<HTMLElement[]>([])
  
  // Log navigation events
  const logNavigation = (event: string) => {
    setNavigationLog(prev => [...prev.slice(-9), event])
  }
  
  // Get focusable elements
  const getFocusableElements = (container: HTMLElement) => {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ]
    
    return Array.from(container.querySelectorAll(focusableSelectors.join(', '))) as HTMLElement[]
  }
  
  // Handle modal keyboard navigation
  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsModalOpen(false)
      logNavigation('Escape pressed - Modal closed')
      return
    }
    
    if (e.key === 'Tab') {
      const focusableElements = getFocusableElements(modalRef.current!)
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      
      if (e.shiftKey) {
        // Shift+Tab - going backward
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
          logNavigation('Tab trap: Wrapped to last element')
        }
      } else {
        // Tab - going forward
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
          logNavigation('Tab trap: Wrapped to first element')
        }
      }
    }
  }
  
  // Handle bad modal (keyboard trap)
  const handleBadModalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      // This is the bad example - we'll prevent tabbing out
      e.preventDefault()
      setTrapDetected(true)
      logNavigation('TRAP DETECTED: Tab key blocked!')
      
      // Simulate being stuck in the modal
      const focusableElements = getFocusableElements(badModalRef.current!)
      const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement)
      const nextIndex = e.shiftKey 
        ? (currentIndex - 1 + focusableElements.length) % focusableElements.length
        : (currentIndex + 1) % focusableElements.length
      
      focusableElements[nextIndex]?.focus()
    }
    
    // Note: We don't handle Escape in the bad example
  }
  
  // Open modal with proper focus management
  const openModal = () => {
    setIsModalOpen(true)
    logNavigation('Modal opened')
    
    // Focus first element when modal opens
    setTimeout(() => {
      const focusableElements = getFocusableElements(modalRef.current!)
      focusableElements[0]?.focus()
    }, 100)
  }
  
  // Open bad modal (creates keyboard trap)
  const openBadModal = () => {
    setIsBadModalOpen(true)
    setTrapDetected(false)
    logNavigation('Bad modal opened - Trap created')
    
    setTimeout(() => {
      const focusableElements = getFocusableElements(badModalRef.current!)
      focusableElements[0]?.focus()
    }, 100)
  }
  
  // Force close bad modal (simulating user frustration)
  const forceCloseBadModal = () => {
    setIsBadModalOpen(false)
    setTrapDetected(false)
    logNavigation('Bad modal force closed')
  }
  
  // Clear navigation log
  const clearLog = () => {
    setNavigationLog([])
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

  const htmlExample = `<!-- Good Example: Modal with Proper Focus Management -->
<div class="modal" role="dialog" aria-labelledby="modal-title" aria-modal="true">
  <div class="modal-content" onkeydown="handleModalKeyDown(event)">
    <header>
      <h2 id="modal-title">Settings</h2>
      <button class="close-button" onclick="closeModal()" aria-label="Close modal">
        ×
      </button>
    </header>
    <main>
      <label for="username">Username:</label>
      <input id="username" type="text" />
      
      <label for="email">Email:</label>
      <input id="email" type="email" />
    </main>
    <footer>
      <button onclick="saveSettings()">Save</button>
      <button onclick="closeModal()">Cancel</button>
    </footer>
  </div>
</div>

<!-- Good Example: Dropdown with Escape -->
<div class="dropdown">
  <button onclick="toggleDropdown()" aria-expanded="false" aria-haspopup="true">
    Options
  </button>
  <ul class="dropdown-menu" onkeydown="handleDropdownKeys(event)">
    <li><a href="#option1">Option 1</a></li>
    <li><a href="#option2">Option 2</a></li>
    <li><a href="#option3">Option 3</a></li>
  </ul>
</div>

<!-- Bad Example: Modal without Escape -->
<div class="bad-modal" role="dialog">
  <div class="modal-content" onkeydown="preventEscape(event)">
    <h2>Trapped Modal</h2>
    <input type="text" placeholder="You're stuck here!" />
    <button>Can't escape!</button>
  </div>
</div>

<script>
function handleModalKeyDown(event) {
  if (event.key === 'Escape') {
    closeModal();
    return;
  }
  
  if (event.key === 'Tab') {
    const focusableElements = getFocusableElements();
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }
}

function preventEscape(event) {
  // BAD: This prevents escape and creates a trap
  if (event.key === 'Escape') {
    event.preventDefault();
  }
}
</script>`

  const cssExample = `/* Modal with proper focus management */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-content:focus {
  outline: none;
}

.modal-content > *:first-child {
  /* First focusable element gets focus */
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
}

.close-button:hover {
  background: rgba(0, 0, 0, 0.1);
}

.close-button:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* Dropdown with escape handling */
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  min-width: 150px;
}

.dropdown-menu li {
  list-style: none;
}

.dropdown-menu a {
  display: block;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #333;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
}

.dropdown-menu a:hover,
.dropdown-menu a:focus {
  background: #f5f5f5;
  outline: none;
}

/* Focus trap prevention */
.no-trap-container {
  /* Ensure focus can always escape */
  position: relative;
}

.no-trap-container:focus-within {
  /* Visual indication when container has focus */
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* Keyboard trap warning */
.trap-warning {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  color: #856404;
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
}

.trap-warning::before {
  content: "⚠️ ";
  font-weight: bold;
}

/* Bad example - trapped modal */
.bad-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.bad-modal .modal-content {
  background: #ffebee;
  border: 2px solid #f44336;
  /* This modal traps focus and doesn't allow escape */
}

/* Screen reader only text */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}`

  const reactExample = `import React, { useState, useRef, useEffect } from 'react'

// Hook for managing focus traps
const useFocusTrap = (isActive) => {
  const containerRef = useRef(null)
  const previousFocusRef = useRef(null)

  useEffect(() => {
    if (!isActive) return

    const container = containerRef.current
    if (!container) return

    // Store the previously focused element
    previousFocusRef.current = document.activeElement

    // Get all focusable elements
    const getFocusableElements = () => {
      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]'
      ]
      
      return Array.from(container.querySelectorAll(focusableSelectors.join(', ')))
    }

    // Handle keydown events
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        // Allow escape to close
        return
      }

      if (event.key === 'Tab') {
        const focusableElements = getFocusableElements()
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (event.shiftKey) {
          // Shift+Tab
          if (document.activeElement === firstElement) {
            event.preventDefault()
            lastElement?.focus()
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            event.preventDefault()
            firstElement?.focus()
          }
        }
      }
    }

    // Add event listener
    container.addEventListener('keydown', handleKeyDown)

    // Focus first element
    const focusableElements = getFocusableElements()
    focusableElements[0]?.focus()

    // Cleanup
    return () => {
      container.removeEventListener('keydown', handleKeyDown)
      // Restore previous focus
      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }
  }, [isActive])

  return containerRef
}

// Accessible Modal Component
const AccessibleModal = ({ isOpen, onClose, title, children }) => {
  const trapRef = useFocusTrap(isOpen)

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={trapRef}
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <header className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button 
            className="close-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </header>
        <main className="modal-body">
          {children}
        </main>
      </div>
    </div>
  )
}

// Accessible Dropdown Component
const AccessibleDropdown = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsOpen(false)
      // Return focus to trigger
      event.currentTarget.focus()
    }
  }

  const handleTriggerKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setIsOpen(true)
      // Focus first menu item
      setTimeout(() => {
        const firstItem = dropdownRef.current?.querySelector('a, button')
        firstItem?.focus()
      }, 0)
    }
  }

  return (
    <div className="dropdown">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleTriggerKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {trigger}
      </button>
      
      {isOpen && (
        <ul 
          ref={dropdownRef}
          className="dropdown-menu"
          onKeyDown={handleKeyDown}
          role="menu"
        >
          {children}
        </ul>
      )}
    </div>
  )
}

// Focus Management Hook
const useFocusManagement = () => {
  const [focusHistory, setFocusHistory] = useState([])
  
  const pushFocus = (element) => {
    if (element) {
      setFocusHistory(prev => [...prev, element])
    }
  }
  
  const popFocus = () => {
    setFocusHistory(prev => {
      const newHistory = [...prev]
      const previousElement = newHistory.pop()
      if (previousElement) {
        previousElement.focus()
      }
      return newHistory
    })
  }
  
  return { pushFocus, popFocus, focusHistory }
}

// Main Application Component
const NoTrapApp = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { pushFocus, popFocus } = useFocusManagement()
  
  const openModal = () => {
    pushFocus(document.activeElement)
    setIsModalOpen(true)
  }
  
  const closeModal = () => {
    setIsModalOpen(false)
    popFocus()
  }

  return (
    <div className="app">
      <main>
        <h1>No Keyboard Trap Example</h1>
        
        <button onClick={openModal}>
          Open Accessible Modal
        </button>
        
        <AccessibleDropdown trigger="Options">
          <li><a href="#option1">Option 1</a></li>
          <li><a href="#option2">Option 2</a></li>
          <li><a href="#option3">Option 3</a></li>
        </AccessibleDropdown>
        
        <AccessibleModal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="Settings"
        >
          <form>
            <label htmlFor="username">Username:</label>
            <input id="username" type="text" />
            
            <label htmlFor="email">Email:</label>
            <input id="email" type="email" />
            
            <div className="form-actions">
              <button type="button" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit">
                Save
              </button>
            </div>
          </form>
        </AccessibleModal>
      </main>
    </div>
  )
}

export default NoTrapApp`

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-green-100 text-green-800 border-green-200">
            WCAG 2.2 Level A
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            2.1.2 No Keyboard Trap
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            If keyboard focus can be moved to a component, then focus can be moved away from that component using only the keyboard.
          </p>
        </div>

        {/* Screen Reader Toggle */}
        <div className="mb-6 text-center">
          <Button
            onClick={() => setShowScreenReader(!showScreenReader)}
            variant="outline"
            className="border-green-200 text-green-700 hover:bg-green-50"
          >
            {showScreenReader ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
            {showScreenReader ? 'Disable' : 'Enable'} Screen Reader Simulation
          </Button>
        </div>

        {/* Interactive Trap Detection Demo */}
        <Card className="mb-8 border-green-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Interactive Keyboard Trap Detection
            </CardTitle>
            <CardDescription className="text-green-100">
              Experience the difference between proper focus management and keyboard traps
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Demo Controls */}
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Unlock className="h-4 w-4 text-green-600" />
                    Good Example: Accessible Modal
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    This modal allows escape with Esc key and proper tab cycling
                  </p>
                  <Button
                    onClick={openModal}
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onFocus={() => simulateScreenReader('Open accessible modal button')}
                  >
                    Open Accessible Modal
                  </Button>
                </div>
                
                <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Lock className="h-4 w-4 text-red-600" />
                    Bad Example: Keyboard Trap
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    This modal creates a keyboard trap - you can't escape!
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={openBadModal}
                      variant="destructive"
                      className="bg-red-500 hover:bg-red-600"
                      onFocus={() => simulateScreenReader('Open trapped modal button - WARNING: creates keyboard trap')}
                    >
                      Open Trapped Modal
                    </Button>
                    {isBadModalOpen && (
                      <Button
                        onClick={forceCloseBadModal}
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-700 hover:bg-red-50"
                      >
                        Force Close
                      </Button>
                    )}
                  </div>
                  
                  {trapDetected && (
                    <Alert className="mt-3 border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        <strong>Keyboard Trap Detected!</strong> Tab navigation is blocked in this modal.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
              
              {/* Navigation Log */}
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Navigation Events Log</h3>
                    <Button
                      onClick={clearLog}
                      variant="outline"
                      size="sm"
                      className="border-green-200 text-green-700"
                    >
                      Clear
                    </Button>
                  </div>
                  <div className="bg-black text-green-400 p-3 rounded font-mono text-sm h-32 overflow-y-auto">
                    {navigationLog.length === 0 ? (
                      <div className="text-gray-500">No events logged yet...</div>
                    ) : (
                      navigationLog.map((event, index) => (
                        <div key={index} className="mb-1">
                          {event}
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Testing Instructions</h3>
                  <div className="text-sm space-y-1 text-gray-700">
                    <div>1. Open the accessible modal and try to escape with <kbd className="px-2 py-1 bg-gray-200 rounded">Esc</kbd></div>
                    <div>2. Try tabbing through the modal elements</div>
                    <div>3. Open the trapped modal and notice you can't escape</div>
                    <div>4. Watch the navigation log for detected traps</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modals */}
        {/* Good Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              ref={modalRef}
              className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              onKeyDown={handleModalKeyDown}
            >
              <header className="flex justify-between items-center mb-4">
                <h2 id="modal-title" className="text-xl font-semibold">Accessible Modal</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                  aria-label="Close modal"
                  onFocus={() => simulateScreenReader('Close modal button')}
                >
                  <X className="h-5 w-5" />
                </button>
              </header>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="modal-input-1">Username</Label>
                  <Input
                    id="modal-input-1"
                    type="text"
                    placeholder="Enter username"
                    onFocus={() => simulateScreenReader('Username input field')}
                  />
                </div>
                
                <div>
                  <Label htmlFor="modal-input-2">Email</Label>
                  <Input
                    id="modal-input-2"
                    type="email"
                    placeholder="Enter email"
                    onFocus={() => simulateScreenReader('Email input field')}
                  />
                </div>
                
                <div className="flex gap-2 justify-end">
                  <Button
                    onClick={() => setIsModalOpen(false)}
                    variant="outline"
                    className="border-green-200 text-green-700 hover:bg-green-50"
                    onFocus={() => simulateScreenReader('Cancel button')}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => setIsModalOpen(false)}
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onFocus={() => simulateScreenReader('Save button')}
                  >
                    Save
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
                <p className="text-sm text-green-800">
                  <strong>Try this:</strong> Press <kbd className="px-2 py-1 bg-green-200 rounded">Esc</kbd> to close, 
                  or <kbd className="px-2 py-1 bg-green-200 rounded">Tab</kbd> to cycle through elements.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bad Modal (Keyboard Trap) */}
        {isBadModalOpen && (
          <div className="fixed inset-0 bg-red-900 bg-opacity-50 flex items-center justify-center z-50">
            <div
              ref={badModalRef}
              className="bg-red-50 p-6 rounded-lg shadow-xl max-w-md w-full mx-4 border-2 border-red-300"
              role="dialog"
              aria-modal="true"
              aria-labelledby="bad-modal-title"
              onKeyDown={handleBadModalKeyDown}
            >
              <header className="flex justify-between items-center mb-4">
                <h2 id="bad-modal-title" className="text-xl font-semibold text-red-800">
                  Trapped Modal
                </h2>
                <span className="text-red-600 text-sm">(No close button!)</span>
              </header>
              
              <div className="space-y-4">
                <Alert className="border-red-200 bg-red-100">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Warning:</strong> This modal creates a keyboard trap!
                  </AlertDescription>
                </Alert>
                
                <div>
                  <Label htmlFor="bad-input-1" className="text-red-700">You're stuck here!</Label>
                  <Input
                    id="bad-input-1"
                    type="text"
                    placeholder="Try to escape..."
                    className="border-red-300"
                    onFocus={() => simulateScreenReader('Trapped input field - cannot escape')}
                  />
                </div>
                
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white w-full"
                  onFocus={() => simulateScreenReader('Trapped button - cannot escape')}
                >
                  Can't Escape!
                </Button>
              </div>
              
              <div className="mt-4 p-3 bg-red-100 rounded border border-red-300">
                <p className="text-sm text-red-700">
                  <strong>Notice:</strong> <kbd className="px-2 py-1 bg-red-200 rounded">Esc</kbd> doesn't work, 
                  and <kbd className="px-2 py-1 bg-red-200 rounded">Tab</kbd> is blocked!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Focus Management Examples */}
        <Card className="mb-8 border-green-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <CardTitle className="flex items-center gap-2">
              <Focus className="h-5 w-5" />
              Focus Management Examples
            </CardTitle>
            <CardDescription className="text-green-100">
              Learn proper focus management techniques
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="good" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="good">✅ Good Examples</TabsTrigger>
                <TabsTrigger value="bad">❌ Bad Examples</TabsTrigger>
              </TabsList>
              
              <TabsContent value="good" className="space-y-4">
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Compliant:</strong> These examples allow users to escape focus
                  </AlertDescription>
                </Alert>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <h3 className="font-semibold mb-3">✅ Dropdown with Escape</h3>
                    <div className="relative">
                      <Button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        variant="outline"
                        className="border-green-200 text-green-700 hover:bg-green-50"
                        onKeyDown={(e) => {
                          if (e.key === 'ArrowDown') {
                            e.preventDefault()
                            setIsDropdownOpen(true)
                          }
                        }}
                        onFocus={() => simulateScreenReader('Dropdown trigger button')}
                      >
                        Options {isDropdownOpen ? '▲' : '▼'}
                      </Button>
                      
                      {isDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-green-200 rounded shadow-lg z-10">
                          <div
                            onKeyDown={(e) => {
                              if (e.key === 'Escape') {
                                setIsDropdownOpen(false)
                                logNavigation('Dropdown escaped with Esc')
                              }
                            }}
                          >
                            <button
                              className="block w-full px-4 py-2 text-left hover:bg-green-50 focus:bg-green-50 focus:outline-none"
                              onFocus={() => simulateScreenReader('Option 1')}
                            >
                              Option 1
                            </button>
                            <button
                              className="block w-full px-4 py-2 text-left hover:bg-green-50 focus:bg-green-50 focus:outline-none"
                              onFocus={() => simulateScreenReader('Option 2')}
                            >
                              Option 2
                            </button>
                            <button
                              className="block w-full px-4 py-2 text-left hover:bg-green-50 focus:bg-green-50 focus:outline-none"
                              onFocus={() => simulateScreenReader('Option 3')}
                            >
                              Option 3
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-green-700 mt-2">
                      • Esc key closes dropdown<br/>
                      • Tab moves to next element<br/>
                      • Arrow keys navigate options<br/>
                      • Focus returns to trigger
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <h3 className="font-semibold mb-3">✅ Search with Clear</h3>
                    <div className="relative">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Search..."
                          className="flex-1"
                          onFocus={() => simulateScreenReader('Search input field')}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-200 text-green-700 hover:bg-green-50"
                          onFocus={() => simulateScreenReader('Clear search button')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-green-700 mt-2">
                      • All elements focusable<br/>
                      • Clear button accessible<br/>
                      • Natural tab order<br/>
                      • No focus traps
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <h3 className="font-semibold mb-3">✅ Tabbed Interface</h3>
                    <div className="border border-green-200 rounded">
                      <div className="flex border-b border-green-200">
                        <button
                          className="px-4 py-2 bg-green-100 text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                          onFocus={() => simulateScreenReader('Tab 1 selected')}
                        >
                          Tab 1
                        </button>
                        <button
                          className="px-4 py-2 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                          onFocus={() => simulateScreenReader('Tab 2')}
                        >
                          Tab 2
                        </button>
                      </div>
                      <div className="p-4">
                        <p className="text-sm">Tab content can be navigated out of</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 border-green-200 text-green-700"
                          onFocus={() => simulateScreenReader('Tab content button')}
                        >
                          Action
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-green-700 mt-2">
                      • Tab key moves between tabs<br/>
                      • Arrow keys navigate within tabs<br/>
                      • Content is not trapped<br/>
                      • Focus can move to next section
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <h3 className="font-semibold mb-3">✅ Form with Validation</h3>
                    <form className="space-y-3">
                      <div>
                        <Label htmlFor="good-form-email">Email</Label>
                        <Input
                          id="good-form-email"
                          type="email"
                          className="mt-1"
                          onFocus={() => simulateScreenReader('Email input field')}
                        />
                      </div>
                      <div>
                        <Label htmlFor="good-form-password">Password</Label>
                        <Input
                          id="good-form-password"
                          type="password"
                          className="mt-1"
                          onFocus={() => simulateScreenReader('Password input field')}
                        />
                      </div>
                      <Button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white"
                        onFocus={() => simulateScreenReader('Submit button')}
                      >
                        Submit
                      </Button>
                    </form>
                    <p className="text-sm text-green-700 mt-2">
                      • Natural form navigation<br/>
                      • Validation doesn't trap focus<br/>
                      • Error messages are announced<br/>
                      • Submit button is reachable
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="bad" className="space-y-4">
                <Alert className="border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Non-compliant:</strong> These examples create keyboard traps
                  </AlertDescription>
                </Alert>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                    <h3 className="font-semibold mb-3">❌ Modal Without Escape</h3>
                    <div className="bg-red-100 p-3 rounded border border-red-300">
                      <p className="text-sm text-red-700 mb-2">This modal would trap users:</p>
                      <pre className="text-xs bg-red-200 p-2 rounded">
{`// BAD: Prevents escape
modal.onkeydown = (e) => {
  if (e.key === 'Escape') {
    e.preventDefault(); // Blocks escape!
  }
}`}
                      </pre>
                    </div>
                    <p className="text-sm text-red-700 mt-2">
                      • Escape key blocked<br/>
                      • No close button<br/>
                      • Focus cannot leave modal<br/>
                      • User is trapped
                    </p>
                  </div>
                  
                  <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                    <h3 className="font-semibold mb-3">❌ Infinite Loop Navigation</h3>
                    <div className="bg-red-100 p-3 rounded border border-red-300">
                      <p className="text-sm text-red-700 mb-2">Tab navigation loops forever:</p>
                      <pre className="text-xs bg-red-200 p-2 rounded">
{`// BAD: Forces focus to stay
element.onblur = () => {
  element.focus(); // Trap!
}`}
                      </pre>
                    </div>
                    <p className="text-sm text-red-700 mt-2">
                      • Focus forced back to element<br/>
                      • Tab key doesn't work<br/>
                      • No way to move forward<br/>
                      • Violates user expectations
                    </p>
                  </div>
                  
                  <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                    <h3 className="font-semibold mb-3">❌ Dropdown Without Escape</h3>
                    <div className="bg-red-100 p-3 rounded border border-red-300">
                      <p className="text-sm text-red-700 mb-2">Dropdown that won't close:</p>
                      <div className="text-xs">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-300 text-red-700 mb-2"
                          disabled
                        >
                          Options ▼
                        </Button>
                        <div className="bg-white border border-red-300 rounded p-2">
                          <div className="text-red-700">• Option 1</div>
                          <div className="text-red-700">• Option 2</div>
                          <div className="text-red-700">• Option 3</div>
                          <div className="text-xs text-red-600 mt-1">
                            (Can't escape!)
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-red-700 mt-2">
                      • Escape key ignored<br/>
                      • Tab navigation blocked<br/>
                      • Focus stuck in dropdown<br/>
                      • Poor user experience
                    </p>
                  </div>
                  
                  <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                    <h3 className="font-semibold mb-3">❌ Form That Traps Focus</h3>
                    <div className="bg-red-100 p-3 rounded border border-red-300">
                      <p className="text-sm text-red-700 mb-2">Form with validation trap:</p>
                      <pre className="text-xs bg-red-200 p-2 rounded">
{`// BAD: Traps on validation
input.onblur = () => {
  if (!isValid(input.value)) {
    input.focus(); // Trap!
  }
}`}
                      </pre>
                    </div>
                    <p className="text-sm text-red-700 mt-2">
                      • Focus forced back on error<br/>
                      • User cannot skip field<br/>
                      • No way to get help<br/>
                      • Accessibility violation
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Implementation Examples */}
        <Card className="mb-8 border-green-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <CardTitle>Implementation Examples</CardTitle>
            <CardDescription className="text-green-100">
              Copy-paste code examples for preventing keyboard traps
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
        <Card className="mb-8 border-green-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <CardTitle>Testing Methods</CardTitle>
            <CardDescription className="text-green-100">
              How to test for WCAG 2.1.2 compliance
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
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Manual Test Steps</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                      <li>Navigate to each interactive component using Tab key</li>
                      <li>Try to move focus away from each component</li>
                      <li>Test Escape key functionality in modals and dropdowns</li>
                      <li>Verify Tab key continues normal navigation</li>
                      <li>Check that focus is not forced back to elements</li>
                      <li>Test with screen readers for additional verification</li>
                      <li>Ensure no infinite focus loops exist</li>
                    </ol>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Key Testing Points</h4>
                    <ul className="text-blue-800 space-y-1 text-sm">
                      <li>• <strong>Modals:</strong> Must close with Escape or have a close button</li>
                      <li>• <strong>Dropdowns:</strong> Must close with Escape or lose focus</li>
                      <li>• <strong>Forms:</strong> Validation errors shouldn't trap focus</li>
                      <li>• <strong>Media Players:</strong> Controls must be escapable</li>
                      <li>• <strong>Custom Components:</strong> Must allow focus to move away</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="automated" className="space-y-4">
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Automated Testing Tools</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li><strong>axe-core:</strong> Detects potential keyboard traps</li>
                      <li><strong>Pa11y:</strong> Checks focus management issues</li>
                      <li><strong>Lighthouse:</strong> Identifies keyboard navigation problems</li>
                      <li><strong>Custom Scripts:</strong> Test specific focus trap scenarios</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">JavaScript Testing Example:</h4>
                    <pre className="bg-gray-900 text-gray-100 p-3 rounded text-sm overflow-x-auto">
                      <code>{`// Test for keyboard traps
const keyboardTrapTester = {
  // Test if element creates a trap
  testForTrap: (element) => {
    return new Promise((resolve) => {
      const originalFocus = document.activeElement
      
      // Focus the element
      element.focus()
      
      // Simulate Tab key
      const tabEvent = new KeyboardEvent('keydown', { 
        key: 'Tab', 
        bubbles: true 
      })
      
      element.dispatchEvent(tabEvent)
      
      // Check if focus moved away
      setTimeout(() => {
        const focusChanged = document.activeElement !== element
        resolve({
          element: element,
          trapped: !focusChanged,
          originalFocus: originalFocus
        })
      }, 100)
    })
  },
  
  // Test escape functionality
  testEscapeKey: (element) => {
    return new Promise((resolve) => {
      const escapeEvent = new KeyboardEvent('keydown', { 
        key: 'Escape', 
        bubbles: true 
      })
      
      let escapeHandled = false
      
      // Listen for escape handling
      const escapeListener = (e) => {
        if (e.key === 'Escape') {
          escapeHandled = true
        }
      }
      
      element.addEventListener('keydown', escapeListener)
      element.dispatchEvent(escapeEvent)
      
      setTimeout(() => {
        element.removeEventListener('keydown', escapeListener)
        resolve({
          element: element,
          escapeHandled: escapeHandled
        })
      }, 100)
    })
  },
  
  // Test all interactive elements
  testAllElements: async () => {
    const interactiveElements = document.querySelectorAll(
      'button, input, select, textarea, a[href], [tabindex], [role="button"]'
    )
    
    const results = []
    
    for (const element of interactiveElements) {
      if (element.offsetParent !== null) { // Element is visible
        const trapResult = await keyboardTrapTester.testForTrap(element)
        const escapeResult = await keyboardTrapTester.testEscapeKey(element)
        
        results.push({
          element: element,
          tagName: element.tagName,
          className: element.className,
          id: element.id,
          trapped: trapResult.trapped,
          escapeHandled: escapeResult.escapeHandled
        })
      }
    }
    
    return results
  }
}

// Run comprehensive keyboard trap test
keyboardTrapTester.testAllElements().then(results => {
  const trappedElements = results.filter(r => r.trapped)
  const noEscapeElements = results.filter(r => !r.escapeHandled)
  
  console.log('Keyboard Trap Test Results:')
  console.log('Trapped elements:', trappedElements.length)
  console.log('Elements without escape:', noEscapeElements.length)
  console.log('Full results:', results)
})`}</code>
                    </pre>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Key Requirements */}
        <Card className="border-green-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <CardTitle>Key Requirements Summary</CardTitle>
            <CardDescription className="text-green-100">
              Essential points for WCAG 2.1.2 compliance
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
                    <span>Provide Escape key functionality in modals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Allow Tab key to move focus away from components</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Implement proper focus management in dialogs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Test with keyboard-only navigation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Provide alternative methods to close components</span>
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
                    <span>Block Escape key functionality</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Force focus back to elements on blur</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Prevent Tab key from working normally</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Create infinite focus loops</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Trap users in validation errors</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="text-center">
              <p className="text-gray-600 mb-2">
                <strong>Remember:</strong> Keyboard traps are one of the most frustrating accessibility barriers. 
                Users must always be able to navigate away from any focusable element.
              </p>
              <p className="text-sm text-gray-500">
                Always provide a way to escape, whether through Escape key, close buttons, or natural Tab navigation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 