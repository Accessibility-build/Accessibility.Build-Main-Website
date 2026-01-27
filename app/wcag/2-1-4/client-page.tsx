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
import { Switch } from '@/components/ui/switch'
import { 
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Copy,
  Eye,
  EyeOff,
  Keyboard,
  Settings,
  Zap,
  Shield,
  Key,
  X,
  Edit,
  Save,
  RefreshCw,
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipForward,
  SkipBack,
  Info,
  Users,
  Type
} from 'lucide-react'

interface KeyShortcut {
  id: string
  key: string
  description: string
  action: string
  enabled: boolean
  customizable: boolean
  conflictsWith?: string[]
}

export default function WCAG214ClientPage() {
  // Shortcut management states
  const [shortcuts, setShortcuts] = useState<KeyShortcut[]>([
    { id: 'play', key: 'p', description: 'Play/Pause media', action: 'playPause', enabled: true, customizable: true },
    { id: 'mute', key: 'm', description: 'Mute/Unmute audio', action: 'toggleMute', enabled: true, customizable: true },
    { id: 'search', key: 's', description: 'Focus search', action: 'focusSearch', enabled: true, customizable: true },
    { id: 'help', key: 'h', description: 'Show help', action: 'showHelp', enabled: true, customizable: true },
    { id: 'save', key: 'n', description: 'Save document', action: 'saveDocument', enabled: true, customizable: true },
  ])
  
  // Demo states
  const [shortcutsEnabled, setShortcutsEnabled] = useState(true)
  const [lastTriggered, setLastTriggered] = useState('')
  const [keyLog, setKeyLog] = useState<string[]>([])
  const [conflicts, setConflicts] = useState<string[]>([])
  const [editingShortcut, setEditingShortcut] = useState<string | null>(null)
  const [newKey, setNewKey] = useState('')
  
  // Media player state
  const [mediaState, setMediaState] = useState({
    playing: false,
    muted: false,
    currentTime: 0,
    duration: 100
  })
  
  // Code examples and screen reader
  const [copiedCode, setCopiedCode] = useState('')
  const [showScreenReader, setShowScreenReader] = useState(false)
  
  // Refs
  const searchRef = useRef<HTMLInputElement>(null)
  const helpRef = useRef<HTMLDivElement>(null)
  
  // Log key events
  const logKey = (key: string, action: string) => {
    setKeyLog(prev => [...prev.slice(-9), `${key.toUpperCase()} → ${action}`])
  }
  
  // Handle single character shortcuts
  const handleKeyDown = (e: KeyboardEvent) => {
    // Only handle single character keys without modifiers
    if (e.ctrlKey || e.altKey || e.metaKey || e.shiftKey) return
    if (e.key.length !== 1) return
    
    // Don't handle shortcuts when typing in input fields
    const target = e.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
      return
    }
    
    if (!shortcutsEnabled) return
    
    const key = e.key.toLowerCase()
    const shortcut = shortcuts.find(s => s.key === key && s.enabled)
    
    if (shortcut) {
      e.preventDefault()
      triggerShortcut(shortcut)
    }
  }
  
  // Trigger shortcut action
  const triggerShortcut = (shortcut: KeyShortcut) => {
    setLastTriggered(shortcut.description)
    logKey(shortcut.key, shortcut.description)
    
    switch (shortcut.action) {
      case 'playPause':
        setMediaState(prev => ({ ...prev, playing: !prev.playing }))
        break
      case 'toggleMute':
        setMediaState(prev => ({ ...prev, muted: !prev.muted }))
        break
      case 'focusSearch':
        searchRef.current?.focus()
        break
      case 'showHelp':
        helpRef.current?.scrollIntoView({ behavior: 'smooth' })
        break
      case 'saveDocument':
        // Simulate save action
        break
    }
  }
  
  // Add global event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts, shortcutsEnabled])
  
  // Check for conflicts
  useEffect(() => {
    const keyMap = new Map<string, string[]>()
    shortcuts.forEach(shortcut => {
      if (shortcut.enabled) {
        const existing = keyMap.get(shortcut.key) || []
        keyMap.set(shortcut.key, [...existing, shortcut.description])
      }
    })
    
    const newConflicts: string[] = []
    keyMap.forEach((descriptions, key) => {
      if (descriptions.length > 1) {
        newConflicts.push(`Key '${key}' conflicts: ${descriptions.join(', ')}`)
      }
    })
    
    setConflicts(newConflicts)
  }, [shortcuts])
  
  // Toggle shortcut enabled state
  const toggleShortcut = (id: string) => {
    setShortcuts(prev => 
      prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s)
    )
  }
  
  // Edit shortcut key
  const editShortcut = (id: string) => {
    const shortcut = shortcuts.find(s => s.id === id)
    if (shortcut) {
      setEditingShortcut(id)
      setNewKey(shortcut.key)
    }
  }
  
  // Save shortcut edit
  const saveShortcutEdit = () => {
    if (editingShortcut && newKey.length === 1) {
      setShortcuts(prev => 
        prev.map(s => s.id === editingShortcut ? { ...s, key: newKey.toLowerCase() } : s)
      )
      setEditingShortcut(null)
      setNewKey('')
    }
  }
  
  // Cancel shortcut edit
  const cancelShortcutEdit = () => {
    setEditingShortcut(null)
    setNewKey('')
  }
  
  // Clear key log
  const clearKeyLog = () => {
    setKeyLog([])
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

  const htmlExample = `<!-- Good Example: Configurable Shortcuts -->
<div class="shortcut-manager">
  <h2>Keyboard Shortcuts</h2>
  <div class="shortcuts-settings">
    <label>
      <input type="checkbox" checked onchange="toggleShortcuts()">
      Enable keyboard shortcuts
    </label>
    
    <div class="shortcut-list">
      <div class="shortcut-item">
        <span class="shortcut-key">P</span>
        <span class="shortcut-desc">Play/Pause</span>
        <button onclick="customizeShortcut('play')">Customize</button>
        <button onclick="disableShortcut('play')">Disable</button>
      </div>
      
      <div class="shortcut-item">
        <span class="shortcut-key">M</span>
        <span class="shortcut-desc">Mute/Unmute</span>
        <button onclick="customizeShortcut('mute')">Customize</button>
        <button onclick="disableShortcut('mute')">Disable</button>
      </div>
    </div>
  </div>
</div>

<!-- Good Example: Alternative Access -->
<div class="media-player">
  <div class="controls">
    <button onclick="playPause()" title="Play/Pause (P)">
      <span class="icon">⏯</span>
      <span class="shortcut-hint">P</span>
    </button>
    
    <button onclick="toggleMute()" title="Mute/Unmute (M)">
      <span class="icon">🔊</span>
      <span class="shortcut-hint">M</span>
    </button>
  </div>
  
  <!-- Keyboard shortcut help -->
  <div class="shortcuts-help" aria-live="polite">
    <h3>Available Shortcuts:</h3>
    <ul>
      <li><kbd>P</kbd> - Play/Pause</li>
      <li><kbd>M</kbd> - Mute/Unmute</li>
      <li><kbd>?</kbd> - Show help</li>
    </ul>
  </div>
</div>

<!-- Bad Example: Unconfigurable Shortcuts -->
<div class="bad-shortcuts">
  <div class="media-player">
    <!-- No way to disable or customize these shortcuts -->
    <button onclick="playPause()">Play</button>
    <button onclick="toggleMute()">Mute</button>
  </div>
  
  <!-- Hidden shortcuts with no documentation -->
  <script>
    document.addEventListener('keydown', function(e) {
      // BAD: No way to disable or customize
      switch(e.key) {
        case 'p': playPause(); break;
        case 'm': toggleMute(); break;
        case 's': search(); break;
        // Many more undocumented shortcuts...
      }
    });
  </script>
</div>

<script>
// Good implementation with configuration
class ShortcutManager {
  constructor() {
    this.shortcuts = new Map();
    this.enabled = true;
    this.loadUserPreferences();
  }
  
  register(key, action, options = {}) {
    this.shortcuts.set(key, {
      action: action,
      description: options.description || '',
      customizable: options.customizable !== false,
      enabled: options.enabled !== false
    });
  }
  
  handleKeyDown(event) {
    if (!this.enabled) return;
    
    // Only handle single character keys without modifiers
    if (event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) return;
    if (event.key.length !== 1) return;
    
    // Don't interfere with form input
    if (event.target.matches('input, textarea, [contenteditable]')) return;
    
    const shortcut = this.shortcuts.get(event.key.toLowerCase());
    if (shortcut && shortcut.enabled) {
      event.preventDefault();
      shortcut.action();
    }
  }
  
  customize(oldKey, newKey) {
    const shortcut = this.shortcuts.get(oldKey);
    if (shortcut && shortcut.customizable) {
      this.shortcuts.delete(oldKey);
      this.shortcuts.set(newKey, shortcut);
      this.saveUserPreferences();
    }
  }
  
  disable(key) {
    const shortcut = this.shortcuts.get(key);
    if (shortcut) {
      shortcut.enabled = false;
      this.saveUserPreferences();
    }
  }
  
  toggle(enabled) {
    this.enabled = enabled;
    this.saveUserPreferences();
  }
}
</script>`

  const cssExample = `/* Shortcut manager styling */
.shortcut-manager {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;
  margin: 1rem 0;
}

.shortcut-manager h2 {
  margin-top: 0;
  color: #333;
}

.shortcuts-settings {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.shortcuts-settings label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.shortcut-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.shortcut-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.shortcut-key {
  background: #333;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: monospace;
  font-weight: bold;
  min-width: 2rem;
  text-align: center;
}

.shortcut-desc {
  flex: 1;
  font-weight: 500;
}

.shortcut-item button {
  padding: 0.25rem 0.5rem;
  border: 1px solid #ccc;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.shortcut-item button:hover {
  background: #f5f5f5;
}

.shortcut-item button:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* Media player with shortcuts */
.media-player {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  background: white;
}

.controls {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.controls button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.controls button:hover {
  background: #f5f5f5;
}

.controls button:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

.shortcut-hint {
  background: #666;
  color: white;
  padding: 0.125rem 0.25rem;
  border-radius: 3px;
  font-size: 0.75rem;
  font-family: monospace;
}

/* Shortcuts help */
.shortcuts-help {
  background: #f0f8ff;
  border: 1px solid #b0d4f1;
  border-radius: 4px;
  padding: 1rem;
  margin-top: 1rem;
}

.shortcuts-help h3 {
  margin-top: 0;
  color: #0066cc;
}

.shortcuts-help ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.shortcuts-help li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.shortcuts-help kbd {
  background: #333;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.875rem;
  min-width: 2rem;
  text-align: center;
}

/* Conflict warnings */
.conflict-warning {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  color: #856404;
  padding: 0.75rem;
  border-radius: 4px;
  margin: 0.5rem 0;
}

.conflict-warning::before {
  content: "⚠️ ";
  font-weight: bold;
}

/* Disabled shortcuts */
.shortcut-item.disabled {
  opacity: 0.5;
}

.shortcut-item.disabled .shortcut-key {
  background: #999;
}

/* Customization interface */
.customize-shortcut {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f0f8ff;
  border: 1px solid #b0d4f1;
  border-radius: 4px;
  margin: 0.5rem 0;
}

.customize-shortcut input {
  width: 3rem;
  padding: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
  font-family: monospace;
  font-weight: bold;
}

.customize-shortcut button {
  padding: 0.25rem 0.5rem;
  border: 1px solid #ccc;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

/* Accessible focus indicators */
.shortcut-manager *:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* Screen reader friendly */
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

  const reactExample = `import React, { useState, useEffect, useRef } from 'react'

// Hook for managing keyboard shortcuts
const useKeyboardShortcuts = (shortcuts, enabled = true) => {
  const [triggeredShortcut, setTriggeredShortcut] = useState(null)
  
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!enabled) return
      
      // Only handle single character keys without modifiers
      if (event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) return
      if (event.key.length !== 1) return
      
      // Don't interfere with form input
      if (event.target.matches('input, textarea, [contenteditable]')) return
      
      const key = event.key.toLowerCase()
      const shortcut = shortcuts.find(s => s.key === key && s.enabled)
      
      if (shortcut) {
        event.preventDefault()
        shortcut.action()
        setTriggeredShortcut(shortcut)
        
        // Clear after a short delay
        setTimeout(() => setTriggeredShortcut(null), 1000)
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts, enabled])
  
  return triggeredShortcut
}

// Configurable shortcut manager component
const ShortcutManager = ({ shortcuts, onUpdate, enabled, onToggle }) => {
  const [editingId, setEditingId] = useState(null)
  const [newKey, setNewKey] = useState('')
  
  const handleEdit = (shortcut) => {
    setEditingId(shortcut.id)
    setNewKey(shortcut.key)
  }
  
  const handleSave = () => {
    if (newKey.length === 1) {
      onUpdate(editingId, { key: newKey.toLowerCase() })
      setEditingId(null)
      setNewKey('')
    }
  }
  
  const handleCancel = () => {
    setEditingId(null)
    setNewKey('')
  }
  
  const handleToggle = (shortcut) => {
    onUpdate(shortcut.id, { enabled: !shortcut.enabled })
  }
  
  return (
    <div className="shortcut-manager">
      <div className="manager-header">
        <h3>Keyboard Shortcuts</h3>
        <label className="toggle-shortcuts">
          <input 
            type="checkbox" 
            checked={enabled}
            onChange={(e) => onToggle(e.target.checked)}
          />
          Enable shortcuts
        </label>
      </div>
      
      <div className="shortcuts-list">
        {shortcuts.map(shortcut => (
          <div 
            key={shortcut.id} 
            className={\`shortcut-item \${!shortcut.enabled ? 'disabled' : ''}\`}
          >
            {editingId === shortcut.id ? (
              <div className="edit-mode">
                <input
                  type="text"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value.slice(0, 1))}
                  maxLength={1}
                  className="key-input"
                  placeholder="Key"
                />
                <span className="description">{shortcut.description}</span>
                <button onClick={handleSave}>Save</button>
                <button onClick={handleCancel}>Cancel</button>
              </div>
            ) : (
              <div className="view-mode">
                <kbd className="shortcut-key">{shortcut.key.toUpperCase()}</kbd>
                <span className="description">{shortcut.description}</span>
                <div className="actions">
                  {shortcut.customizable && (
                    <button onClick={() => handleEdit(shortcut)}>
                      Edit
                    </button>
                  )}
                  <button onClick={() => handleToggle(shortcut)}>
                    {shortcut.enabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Media player with configurable shortcuts
const MediaPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(50)
  const [shortcuts, setShortcuts] = useState([
    { 
      id: 'play', 
      key: 'p', 
      description: 'Play/Pause', 
      enabled: true, 
      customizable: true,
      action: () => setIsPlaying(!isPlaying)
    },
    { 
      id: 'mute', 
      key: 'm', 
      description: 'Mute/Unmute', 
      enabled: true, 
      customizable: true,
      action: () => setIsMuted(!isMuted)
    }
  ])
  const [shortcutsEnabled, setShortcutsEnabled] = useState(true)
  
  const triggeredShortcut = useKeyboardShortcuts(shortcuts, shortcutsEnabled)
  
  const updateShortcut = (id, updates) => {
    setShortcuts(prev => 
      prev.map(s => s.id === id ? { ...s, ...updates } : s)
    )
  }
  
  const togglePlay = () => setIsPlaying(!isPlaying)
  const toggleMute = () => setIsMuted(!isMuted)
  
  return (
    <div className="media-player">
      <div className="player-controls">
        <button 
          onClick={togglePlay}
          title={\`Play/Pause (\${shortcuts.find(s => s.id === 'play')?.key.toUpperCase()})\`}
        >
          {isPlaying ? '⏸️' : '▶️'}
          <span className="shortcut-hint">
            {shortcuts.find(s => s.id === 'play')?.key.toUpperCase()}
          </span>
        </button>
        
        <button 
          onClick={toggleMute}
          title={\`Mute/Unmute (\${shortcuts.find(s => s.id === 'mute')?.key.toUpperCase()})\`}
        >
          {isMuted ? '🔇' : '🔊'}
          <span className="shortcut-hint">
            {shortcuts.find(s => s.id === 'mute')?.key.toUpperCase()}
          </span>
        </button>
        
        <div className="volume-control">
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            aria-label="Volume"
          />
          <span>{volume}%</span>
        </div>
      </div>
      
      {triggeredShortcut && (
        <div className="shortcut-feedback" aria-live="polite">
          Triggered: {triggeredShortcut.description}
        </div>
      )}
      
      <ShortcutManager
        shortcuts={shortcuts}
        onUpdate={updateShortcut}
        enabled={shortcutsEnabled}
        onToggle={setShortcutsEnabled}
      />
    </div>
  )
}

// Main app component
const CharacterShortcutsApp = () => {
  return (
    <div className="app">
      <header>
        <h1>Character Key Shortcuts Demo</h1>
        <p>
          This demo shows how to implement accessible keyboard shortcuts 
          that users can customize or disable.
        </p>
      </header>
      
      <main>
        <MediaPlayer />
        
        <div className="shortcuts-info">
          <h2>About Character Key Shortcuts</h2>
          <p>
            WCAG 2.1.4 requires that if a keyboard shortcut uses only 
            character keys (no modifiers), at least one of the following 
            must be true:
          </p>
          <ul>
            <li>A mechanism to turn off the shortcut</li>
            <li>A mechanism to remap the shortcut</li>
            <li>The shortcut is only active when relevant component has focus</li>
          </ul>
        </div>
      </main>
    </div>
  )
}

export default CharacterShortcutsApp`

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-yellow-100 text-yellow-800 border-yellow-200">
            WCAG 2.2 Level A
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            2.1.4 Character Key Shortcuts
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            If a keyboard shortcut uses only character keys, users must be able to turn it off, remap it, or it must only be active when the relevant component has focus.
          </p>
        </div>

        {/* Screen Reader Toggle */}
        <div className="mb-6 text-center">
          <Button
            onClick={() => setShowScreenReader(!showScreenReader)}
            variant="outline"
            className="border-yellow-200 text-yellow-700 hover:bg-yellow-50"
          >
            {showScreenReader ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
            {showScreenReader ? 'Disable' : 'Enable'} Screen Reader Simulation
          </Button>
        </div>

        {/* Interactive Shortcut Manager */}
        <Card className="mb-8 border-yellow-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white">
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Interactive Shortcut Manager
            </CardTitle>
            <CardDescription className="text-yellow-100">
              Experience configurable keyboard shortcuts with full user control
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Shortcut Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Shortcut Settings</h3>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="enable-shortcuts">Enable Shortcuts</Label>
                    <Switch
                      id="enable-shortcuts"
                      checked={shortcutsEnabled}
                      onCheckedChange={setShortcutsEnabled}
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  {shortcuts.map((shortcut) => (
                    <div key={shortcut.id} className={`p-3 rounded-lg border-2 ${
                      shortcut.enabled ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <kbd className={`px-2 py-1 rounded text-sm font-mono font-bold ${
                            shortcut.enabled ? 'bg-yellow-500 text-white' : 'bg-gray-400 text-white'
                          }`}>
                            {shortcut.key.toUpperCase()}
                          </kbd>
                          <span className="font-medium">{shortcut.description}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={shortcut.enabled}
                            onCheckedChange={() => toggleShortcut(shortcut.id)}
                          />
                        </div>
                      </div>
                      
                      {shortcut.customizable && (
                        <div className="flex items-center gap-2 mt-2">
                          {editingShortcut === shortcut.id ? (
                            <div className="flex items-center gap-2">
                              <Input
                                value={newKey}
                                onChange={(e) => setNewKey(e.target.value.slice(0, 1))}
                                maxLength={1}
                                className="w-16 text-center font-mono"
                                placeholder="Key"
                              />
                              <Button
                                onClick={saveShortcutEdit}
                                size="sm"
                                variant="outline"
                                className="border-yellow-200 text-yellow-700 hover:bg-yellow-50"
                              >
                                <Save className="h-3 w-3" />
                              </Button>
                              <Button
                                onClick={cancelShortcutEdit}
                                size="sm"
                                variant="outline"
                                className="border-gray-200 text-gray-700 hover:bg-gray-50"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              onClick={() => editShortcut(shortcut.id)}
                              size="sm"
                              variant="outline"
                              className="border-yellow-200 text-yellow-700 hover:bg-yellow-50"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Customize
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {conflicts.length > 0 && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <strong>Conflicts Detected:</strong>
                      <ul className="mt-2 space-y-1">
                        {conflicts.map((conflict, index) => (
                          <li key={index} className="text-sm">• {conflict}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              
              {/* Demo Area */}
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-3">Interactive Demo</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Try pressing the configured shortcut keys. Make sure you're not typing in an input field.
                  </p>
                  
                  {/* Media Player Simulation */}
                  <div className="bg-white p-4 rounded border-2 border-gray-200">
                    <h4 className="font-medium mb-3">Media Player</h4>
                    <div className="flex items-center gap-2 mb-3">
                      <Button
                        onClick={() => triggerShortcut(shortcuts.find(s => s.id === 'play')!)}
                        variant="outline"
                        size="sm"
                        className="border-yellow-200 text-yellow-700 hover:bg-yellow-50"
                      >
                        {mediaState.playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        {mediaState.playing ? 'Pause' : 'Play'}
                      </Button>
                      
                      <Button
                        onClick={() => triggerShortcut(shortcuts.find(s => s.id === 'mute')!)}
                        variant="outline"
                        size="sm"
                        className="border-yellow-200 text-yellow-700 hover:bg-yellow-50"
                      >
                        {mediaState.muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        {mediaState.muted ? 'Unmute' : 'Mute'}
                      </Button>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      Status: {mediaState.playing ? 'Playing' : 'Paused'} | 
                      Audio: {mediaState.muted ? 'Muted' : 'Unmuted'}
                    </div>
                  </div>
                  
                  {/* Search Field */}
                  <div className="mt-4">
                    <Label htmlFor="demo-search">Search (Focus with 'S')</Label>
                    <Input
                      id="demo-search"
                      ref={searchRef}
                      placeholder="Type to search..."
                      className="mt-1"
                      onFocus={() => simulateScreenReader('Search input focused')}
                    />
                  </div>
                  
                  {lastTriggered && (
                    <div className="mt-4 p-2 bg-green-50 rounded border border-green-200">
                      <p className="text-sm text-green-800">
                        <strong>Triggered:</strong> {lastTriggered}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Key Event Log</h3>
                    <Button
                      onClick={clearKeyLog}
                      variant="outline"
                      size="sm"
                      className="border-yellow-200 text-yellow-700"
                    >
                      Clear
                    </Button>
                  </div>
                  <div className="bg-black text-green-400 p-3 rounded font-mono text-sm h-32 overflow-y-auto">
                    {keyLog.length === 0 ? (
                      <div className="text-gray-500">No shortcuts triggered yet...</div>
                    ) : (
                      keyLog.map((event, index) => (
                        <div key={index} className="mb-1">
                          {event}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Good vs Bad Examples */}
        <Card className="mb-8 border-yellow-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Good vs Bad Examples
            </CardTitle>
            <CardDescription className="text-yellow-100">
              Compare compliant and non-compliant shortcut implementations
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="good" className="w-full">
              <TabsList className="flex flex-col h-auto w-full sm:!grid sm:!grid-cols-2">
                <TabsTrigger value="good" className="w-full">✅ Good Examples</TabsTrigger>
                <TabsTrigger value="bad" className="w-full">❌ Bad Examples</TabsTrigger>
              </TabsList>
              
              <TabsContent value="good" className="space-y-4">
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Compliant:</strong> These examples provide user control over shortcuts
                  </AlertDescription>
                </Alert>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <h3 className="font-semibold mb-3">✅ Configurable Shortcuts</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-green-500 text-white rounded">P</kbd>
                        <span>Play/Pause</span>
                        <Button size="sm" variant="outline" className="ml-auto">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-green-500 text-white rounded">M</kbd>
                        <span>Mute/Unmute</span>
                        <Button size="sm" variant="outline" className="ml-auto">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={true} />
                        <span className="text-green-700">Shortcuts enabled</span>
                      </div>
                    </div>
                    <p className="text-sm text-green-700 mt-2">
                      • Users can customize keys<br/>
                      • Users can disable shortcuts<br/>
                      • Clear documentation<br/>
                      • No conflicts with typing
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <h3 className="font-semibold mb-3">✅ Context-Aware Shortcuts</h3>
                    <div className="border border-green-300 rounded p-3">
                      <h4 className="font-medium text-green-800 mb-2">Video Player</h4>
                      <div className="text-sm text-green-700">
                        <div>• Space: Play/Pause (when focused)</div>
                        <div>• ← →: Skip backward/forward</div>
                        <div>• ↑ ↓: Volume up/down</div>
                      </div>
                    </div>
                    <p className="text-sm text-green-700 mt-2">
                      • Shortcuts only work when player has focus<br/>
                      • Don't interfere with page navigation<br/>
                      • Standard media key conventions<br/>
                      • Clear user expectations
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <h3 className="font-semibold mb-3">✅ Modifier-Based Shortcuts</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-green-500 text-white rounded">Ctrl+S</kbd>
                        <span>Save</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-green-500 text-white rounded">Ctrl+Z</kbd>
                        <span>Undo</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-green-500 text-white rounded">Ctrl+F</kbd>
                        <span>Find</span>
                      </div>
                    </div>
                    <p className="text-sm text-green-700 mt-2">
                      • Uses modifier keys (Ctrl, Alt, Cmd)<br/>
                      • Standard conventions<br/>
                      • Won't interfere with typing<br/>
                      • WCAG 2.1.4 doesn't apply
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <h3 className="font-semibold mb-3">✅ Help and Documentation</h3>
                    <div className="border border-green-300 rounded p-3">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="mb-2 border-green-200 text-green-700"
                      >
                        <Key className="h-3 w-3 mr-1" />
                        Show Shortcuts (?)
                      </Button>
                      <div className="text-sm text-green-700">
                        Available shortcuts are clearly documented and accessible
                      </div>
                    </div>
                    <p className="text-sm text-green-700 mt-2">
                      • Keyboard shortcut help available<br/>
                      • Visual indicators on buttons<br/>
                      • Screen reader announcements<br/>
                      • User education provided
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="bad" className="space-y-4">
                <Alert className="border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Non-compliant:</strong> These examples violate WCAG 2.1.4
                  </AlertDescription>
                </Alert>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                    <h3 className="font-semibold mb-3">❌ Unconfigurable Shortcuts</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-red-500 text-white rounded">S</kbd>
                        <span>Search</span>
                        <span className="text-red-600 text-xs ml-auto">No control</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-red-500 text-white rounded">H</kbd>
                        <span>Help</span>
                        <span className="text-red-600 text-xs ml-auto">No control</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-red-500 text-white rounded">N</kbd>
                        <span>New</span>
                        <span className="text-red-600 text-xs ml-auto">No control</span>
                      </div>
                    </div>
                    <p className="text-sm text-red-700 mt-2">
                      • Users cannot disable shortcuts<br/>
                      • No customization options<br/>
                      • Interferes with typing<br/>
                      • Violates WCAG 2.1.4
                    </p>
                  </div>
                  
                  <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                    <h3 className="font-semibold mb-3">❌ Hidden Shortcuts</h3>
                    <div className="bg-red-100 p-3 rounded border border-red-300">
                      <p className="text-sm text-red-700 mb-2">Undocumented shortcuts:</p>
                      <pre className="text-xs bg-red-200 p-2 rounded">
{`// BAD: Hidden shortcuts
document.addEventListener('keydown', (e) => {
  switch(e.key) {
    case 'a': selectAll(); break;
    case 'd': deleteSelected(); break;
    case 'r': refresh(); break;
    // Many more...
  }
});`}
                      </pre>
                    </div>
                    <p className="text-sm text-red-700 mt-2">
                      • No documentation<br/>
                      • Users unaware of shortcuts<br/>
                      • Unexpected behavior<br/>
                      • Poor user experience
                    </p>
                  </div>
                  
                  <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                    <h3 className="font-semibold mb-3">❌ Conflicting Shortcuts</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-red-500 text-white rounded">S</kbd>
                        <span>Save & Search</span>
                        <span className="text-red-600 text-xs ml-auto">Conflict!</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-red-500 text-white rounded">P</kbd>
                        <span>Play & Print</span>
                        <span className="text-red-600 text-xs ml-auto">Conflict!</span>
                      </div>
                    </div>
                    <p className="text-sm text-red-700 mt-2">
                      • Multiple actions for same key<br/>
                      • Unpredictable behavior<br/>
                      • User confusion<br/>
                      • No conflict resolution
                    </p>
                  </div>
                  
                  <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                    <h3 className="font-semibold mb-3">❌ Global Shortcuts</h3>
                    <div className="bg-red-100 p-3 rounded border border-red-300">
                      <p className="text-sm text-red-700 mb-2">Shortcuts work everywhere:</p>
                      <div className="text-xs text-red-600">
                        • While typing in forms<br/>
                        • In text editors<br/>
                        • During password entry<br/>
                        • No context awareness
                      </div>
                    </div>
                    <p className="text-sm text-red-700 mt-2">
                      • Interferes with normal typing<br/>
                      • Breaks form functionality<br/>
                      • Poor accessibility<br/>
                      • User frustration
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Implementation Examples */}
        <Card className="mb-8 border-yellow-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white">
            <CardTitle>Implementation Examples</CardTitle>
            <CardDescription className="text-yellow-100">
              Copy-paste code examples for accessible character key shortcuts
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
        <Card className="mb-8 border-yellow-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white">
            <CardTitle>Testing Methods</CardTitle>
            <CardDescription className="text-yellow-100">
              How to test for WCAG 2.1.4 compliance
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="manual" className="w-full">
              <TabsList className="flex flex-col h-auto w-full sm:!grid sm:!grid-cols-2">
                <TabsTrigger value="manual" className="w-full">Manual Testing</TabsTrigger>
                <TabsTrigger value="automated" className="w-full">Automated Testing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="manual" className="space-y-4">
                <div className="space-y-4">
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Manual Test Steps</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                      <li>Identify all single-character keyboard shortcuts</li>
                      <li>Test each shortcut to see if it works</li>
                      <li>Try typing in form fields with shortcuts enabled</li>
                      <li>Check if shortcuts can be disabled</li>
                      <li>Check if shortcuts can be remapped</li>
                      <li>Verify shortcuts only work when component has focus</li>
                      <li>Test with different keyboard layouts</li>
                      <li>Verify no conflicts with assistive technologies</li>
                    </ol>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Key Testing Scenarios</h4>
                    <ul className="text-blue-800 space-y-1 text-sm">
                      <li>• <strong>Form Input:</strong> Type letters in text fields - shortcuts shouldn't interfere</li>
                      <li>• <strong>Password Fields:</strong> Ensure shortcuts don't reveal passwords</li>
                      <li>• <strong>Screen Readers:</strong> Test with NVDA, JAWS, VoiceOver</li>
                      <li>• <strong>Switch Control:</strong> Verify shortcuts don't conflict with switch navigation</li>
                      <li>• <strong>Speech Input:</strong> Test with voice control software</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="automated" className="space-y-4">
                <div className="space-y-4">
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Automated Testing Tools</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li><strong>axe-core:</strong> Can detect some keyboard shortcut issues</li>
                      <li><strong>Custom Scripts:</strong> Test shortcut behavior and conflicts</li>
                      <li><strong>Keyboard Simulation:</strong> Automated testing of key combinations</li>
                      <li><strong>User Preference Detection:</strong> Check for customization options</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">JavaScript Testing Example:</h4>
                    <pre className="bg-gray-900 text-gray-100 p-3 rounded text-sm overflow-x-auto">
                      <code>{`// Test for character key shortcuts
const shortcutTester = {
  // Detect single character shortcuts
  detectShortcuts: () => {
    const shortcuts = []
    
    // Test common single character keys
    const testKeys = 'abcdefghijklmnopqrstuvwxyz0123456789'
    
    for (const key of testKeys) {
      const hasShortcut = shortcutTester.testKey(key)
      if (hasShortcut) {
        shortcuts.push({
          key: key,
          hasDisableOption: shortcutTester.canDisable(key),
          hasCustomization: shortcutTester.canCustomize(key),
          isContextual: shortcutTester.isContextual(key)
        })
      }
    }
    
    return shortcuts
  },
  
  // Test if key triggers a shortcut
  testKey: (key) => {
    const event = new KeyboardEvent('keydown', { key: key })
    const prevented = !document.dispatchEvent(event)
    return prevented
  },
  
  // Check if shortcut can be disabled
  canDisable: (key) => {
    // Look for disable controls in UI
    const disableControls = document.querySelectorAll(
      \`[aria-label*="disable"]\`, 
      \`[title*="disable"]\`,
      \`input[type="checkbox"]\`
    )
    
    return disableControls.length > 0
  },
  
  // Check if shortcut can be customized
  canCustomize: (key) => {
    // Look for customization controls
    const customControls = document.querySelectorAll(
      \`[aria-label*="customize"]\`, 
      \`[title*="customize"]\`,
      \`[aria-label*="remap"]\`
    )
    
    return customControls.length > 0
  },
  
  // Check if shortcut is contextual
  isContextual: (key) => {
    // Test if shortcut only works when specific element has focus
    const focusableElements = document.querySelectorAll(
      'button, input, textarea, select, [tabindex]'
    )
    
    let contextualCount = 0
    let totalCount = 0
    
    focusableElements.forEach(element => {
      element.focus()
      const works = shortcutTester.testKey(key)
      if (works) contextualCount++
      totalCount++
    })
    
    // If shortcut only works with some elements focused, it's contextual
    return contextualCount > 0 && contextualCount < totalCount
  },
  
  // Test for conflicts with typing
  testTypingConflicts: () => {
    const conflicts = []
    const inputElements = document.querySelectorAll('input[type="text"], textarea')
    
    inputElements.forEach(input => {
      input.focus()
      
      // Test typing common letters
      const testText = 'hello world'
      for (const char of testText) {
        const event = new KeyboardEvent('keydown', { key: char })
        const prevented = !input.dispatchEvent(event)
        
        if (prevented) {
          conflicts.push({
            element: input,
            key: char,
            issue: 'Shortcut prevents typing'
          })
        }
      }
    })
    
    return conflicts
  }
}

// Run comprehensive shortcut test
const testResults = {
  shortcuts: shortcutTester.detectShortcuts(),
  typingConflicts: shortcutTester.testTypingConflicts()
}

// Analyze compliance
const compliance = {
  hasShortcuts: testResults.shortcuts.length > 0,
  allConfigurable: testResults.shortcuts.every(s => 
    s.hasDisableOption || s.hasCustomization || s.isContextual
  ),
  hasTypingConflicts: testResults.typingConflicts.length > 0,
  isCompliant: function() {
    return !this.hasShortcuts || 
           (this.allConfigurable && !this.hasTypingConflicts)
  }
}

console.log('WCAG 2.1.4 Test Results:', testResults)
console.log('Compliance Status:', compliance.isCompliant() ? 'PASS' : 'FAIL')`}</code>
                    </pre>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mb-8 border-yellow-200 shadow-lg" ref={helpRef}>
          <CardHeader className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white">
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Help & Documentation
            </CardTitle>
            <CardDescription className="text-yellow-100">
              Quick reference for using shortcuts and understanding requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Available Shortcuts</h3>
                <div className="space-y-2">
                  {shortcuts.map((shortcut) => (
                    <div key={shortcut.id} className="flex items-center gap-2 text-sm">
                      <kbd className={`px-2 py-1 rounded font-mono font-bold text-xs ${
                        shortcut.enabled ? 'bg-yellow-500 text-white' : 'bg-gray-400 text-white'
                      }`}>
                        {shortcut.key.toUpperCase()}
                      </kbd>
                      <span className={shortcut.enabled ? 'text-gray-700' : 'text-gray-400'}>
                        {shortcut.description}
                      </span>
                      {!shortcut.enabled && (
                        <span className="text-xs text-gray-500">(disabled)</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Tips for Users</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Shortcuts won't work when typing in text fields</li>
                  <li>• Use the settings to disable shortcuts if needed</li>
                  <li>• Customize shortcuts to avoid conflicts</li>
                  <li>• Press 'H' to return to this help section</li>
                  <li>• All shortcuts have button alternatives</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Requirements */}
        <Card className="border-yellow-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white">
            <CardTitle>Key Requirements Summary</CardTitle>
            <CardDescription className="text-yellow-100">
              Essential points for WCAG 2.1.4 compliance
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Compliance Options
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Provide mechanism to turn off shortcuts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Allow users to remap shortcuts to different keys</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Make shortcuts only active when component has focus</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Use modifier keys (Ctrl, Alt, Cmd) instead</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Provide clear documentation of all shortcuts</span>
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
                    <span>Create unconfigurable single-key shortcuts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Interfere with typing in form fields</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Hide shortcuts from users</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Create conflicts with assistive technologies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Assume all users want shortcuts enabled</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="text-center">
              <p className="text-gray-600 mb-2">
                <strong>Remember:</strong> Character key shortcuts can significantly impact users with motor disabilities, 
                speech recognition users, and those using assistive technologies.
              </p>
              <p className="text-sm text-gray-500">
                Always provide user control over shortcuts to ensure they help rather than hinder.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 