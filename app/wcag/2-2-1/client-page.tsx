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
import { Progress } from '@/components/ui/progress'
import { 
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Copy,
  Eye,
  EyeOff,
  Clock,
  Settings,
  Play,
  Pause,
  RefreshCw,
  Bell,
  Timer,
  Shield,
  User,
  Zap,
  Clock4,
  Clock8,
  Info,
  Users,
  AlertCircle,
  CheckCircle,
  XOctagon,
  Square,
  Type
} from 'lucide-react'

interface TimingSession {
  id: string
  name: string
  timeLimit: number
  warningTime: number
  extensionTime: number
  maxExtensions: number
  allowDisable: boolean
  userPreferences?: {
    timeLimit: number
    warningTime: number
    extensionTime: number
    disableTimeouts: boolean
  }
}

export default function WCAG221ClientPage() {
  // Session management states
  const [sessions, setSessions] = useState<TimingSession[]>([
    {
      id: 'shopping',
      name: 'Shopping Cart',
      timeLimit: 30,
      warningTime: 5,
      extensionTime: 15,
      maxExtensions: 3,
      allowDisable: true
    },
    {
      id: 'banking',
      name: 'Banking Session',
      timeLimit: 15,
      warningTime: 2,
      extensionTime: 10,
      maxExtensions: 2,
      allowDisable: false
    },
    {
      id: 'quiz',
      name: 'Timed Quiz',
      timeLimit: 60,
      warningTime: 10,
      extensionTime: 30,
      maxExtensions: 1,
      allowDisable: true
    }
  ])
  
  // Active session state
  const [activeSession, setActiveSession] = useState<string | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [showWarning, setShowWarning] = useState(false)
  const [extensionsUsed, setExtensionsUsed] = useState(0)
  const [sessionExpired, setSessionExpired] = useState(false)
  const [userActivity, setUserActivity] = useState(0)
  
  // Demo states
  const [globalTimeouts, setGlobalTimeouts] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [lastActivity, setLastActivity] = useState('')
  const [timingLog, setTimingLog] = useState<string[]>([])
  
  // Code examples and screen reader
  const [copiedCode, setCopiedCode] = useState('')
  const [showScreenReader, setShowScreenReader] = useState(false)
  
  // Timer refs
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const warningRef = useRef<NodeJS.Timeout | null>(null)
  
  // Log timing events
  const logTimingEvent = (event: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setTimingLog(prev => [...prev.slice(-9), `${timestamp}: ${event}`])
  }
  
  // Start session
  const startSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId)
    if (!session) return
    
    // Clear existing timers
    if (timerRef.current) clearInterval(timerRef.current)
    if (warningRef.current) clearTimeout(warningRef.current)
    
    setActiveSession(sessionId)
    setTimeRemaining(session.timeLimit)
    setShowWarning(false)
    setExtensionsUsed(0)
    setSessionExpired(false)
    setUserActivity(0)
    
    logTimingEvent(`Started ${session.name} session (${session.timeLimit}s)`)
    
    // Start countdown timer
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1
        
        if (newTime <= 0) {
          handleSessionExpiry(sessionId)
          return 0
        }
        
        // Show warning at specified time
        if (newTime === session.warningTime) {
          setShowWarning(true)
          logTimingEvent(`Warning: ${session.warningTime}s remaining`)
          if (notificationsEnabled) {
            simulateScreenReader(`Warning: Your session will expire in ${session.warningTime} seconds. You can extend your session.`)
          }
        }
        
        return newTime
      })
    }, 1000)
    
    // Set warning timer
    warningRef.current = setTimeout(() => {
      setShowWarning(true)
    }, (session.timeLimit - session.warningTime) * 1000)
  }
  
  // Handle session expiry
  const handleSessionExpiry = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId)
    if (!session) return
    
    if (timerRef.current) clearInterval(timerRef.current)
    if (warningRef.current) clearTimeout(warningRef.current)
    
    setSessionExpired(true)
    setActiveSession(null)
    setShowWarning(false)
    
    logTimingEvent(`${session.name} session expired`)
    
    if (notificationsEnabled) {
      simulateScreenReader(`Your ${session.name} session has expired. Please start a new session.`)
    }
  }
  
  // Extend session
  const extendSession = () => {
    if (!activeSession) return
    
    const session = sessions.find(s => s.id === activeSession)
    if (!session) return
    
    if (extensionsUsed >= session.maxExtensions) {
      logTimingEvent('Extension denied: Maximum extensions reached')
      return
    }
    
    setTimeRemaining(prev => prev + session.extensionTime)
    setExtensionsUsed(prev => prev + 1)
    setShowWarning(false)
    
    logTimingEvent(`Session extended by ${session.extensionTime}s (${extensionsUsed + 1}/${session.maxExtensions})`)
    
    if (notificationsEnabled) {
      simulateScreenReader(`Session extended by ${session.extensionTime} seconds. You have ${session.maxExtensions - extensionsUsed - 1} extensions remaining.`)
    }
  }
  
  // Disable timeouts for session
  const disableTimeouts = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId)
    if (!session || !session.allowDisable) return
    
    if (timerRef.current) clearInterval(timerRef.current)
    if (warningRef.current) clearTimeout(warningRef.current)
    
    setActiveSession(null)
    setTimeRemaining(0)
    setShowWarning(false)
    
    logTimingEvent(`Timeouts disabled for ${session.name}`)
    
    if (notificationsEnabled) {
      simulateScreenReader(`Timeouts have been disabled for ${session.name}. You can continue without time limits.`)
    }
  }
  
  // Stop session
  const stopSession = () => {
    if (!activeSession) return
    
    const session = sessions.find(s => s.id === activeSession)
    if (!session) return
    
    if (timerRef.current) clearInterval(timerRef.current)
    if (warningRef.current) clearTimeout(warningRef.current)
    
    setActiveSession(null)
    setTimeRemaining(0)
    setShowWarning(false)
    setSessionExpired(false)
    
    logTimingEvent(`Stopped ${session.name} session`)
  }
  
  // Simulate user activity
  const simulateActivity = (activity: string) => {
    setUserActivity(prev => prev + 1)
    setLastActivity(activity)
    logTimingEvent(`User activity: ${activity}`)
  }
  
  // Clear timing log
  const clearTimingLog = () => {
    setTimingLog([])
  }
  
  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (warningRef.current) clearTimeout(warningRef.current)
    }
  }, [])
  
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

  const activeSessionData = sessions.find(s => s.id === activeSession)
  const progressPercentage = activeSessionData ? ((activeSessionData.timeLimit - timeRemaining) / activeSessionData.timeLimit) * 100 : 0

  const htmlExample = `<!-- Good Example: Session with Extension Option -->
<div class="session-manager">
  <div class="session-timer" role="timer" aria-live="polite">
    <h3>Session Time Remaining</h3>
    <div class="time-display">
      <span class="time-value" id="timer-display">15:00</span>
      <div class="time-bar">
        <div class="time-progress" style="width: 75%"></div>
      </div>
    </div>
  </div>
  
  <!-- Session controls -->
  <div class="session-controls">
    <button onclick="extendSession()" class="extend-btn">
      Extend Session (+ 10 minutes)
    </button>
    <button onclick="disableTimeouts()" class="disable-btn">
      Disable Time Limits
    </button>
    <div class="extensions-remaining">
      Extensions remaining: <span id="extensions">2</span>
    </div>
  </div>
  
  <!-- Warning dialog -->
  <div id="timeout-warning" class="warning-dialog" aria-live="assertive" hidden>
    <div class="warning-content">
      <h3>Session Expiring Soon</h3>
      <p>Your session will expire in <span id="warning-time">2</span> minutes.</p>
      <div class="warning-actions">
        <button onclick="extendSession()" class="primary">
          Extend Session
        </button>
        <button onclick="continueSession()" class="secondary">
          Continue Working
        </button>
        <button onclick="saveAndLogout()" class="secondary">
          Save & Logout
        </button>
      </div>
    </div>
  </div>
</div>

<!-- Good Example: User Preferences -->
<div class="timing-preferences">
  <h3>Timing Preferences</h3>
  <form class="preferences-form">
    <fieldset>
      <legend>Session Length</legend>
      <label>
        <input type="radio" name="session-length" value="15" checked>
        15 minutes (default)
      </label>
      <label>
        <input type="radio" name="session-length" value="30">
        30 minutes
      </label>
      <label>
        <input type="radio" name="session-length" value="60">
        60 minutes
      </label>
      <label>
        <input type="radio" name="session-length" value="0">
        No time limit
      </label>
    </fieldset>
    
    <fieldset>
      <legend>Warning Settings</legend>
      <label for="warning-time">Warning time before expiry:</label>
      <select id="warning-time" name="warning-time">
        <option value="1">1 minute</option>
        <option value="2" selected>2 minutes</option>
        <option value="5">5 minutes</option>
        <option value="10">10 minutes</option>
      </select>
    </fieldset>
    
    <button type="submit">Save Preferences</button>
  </form>
</div>

<!-- Bad Example: No User Control -->
<div class="bad-session">
  <div class="fixed-timeout">
    <p>Your session will expire in 5 minutes.</p>
    <!-- No way to extend or disable -->
  </div>
</div>

<script>
// Good implementation with user control
class SessionManager {
  constructor(options = {}) {
    this.timeLimit = options.timeLimit || 900; // 15 minutes
    this.warningTime = options.warningTime || 120; // 2 minutes
    this.extensionTime = options.extensionTime || 600; // 10 minutes
    this.maxExtensions = options.maxExtensions || 3;
    this.allowDisable = options.allowDisable !== false;
    
    this.timeRemaining = this.timeLimit;
    this.extensionsUsed = 0;
    this.isActive = false;
    this.warningShown = false;
    
    this.loadUserPreferences();
    this.setupEventListeners();
  }
  
  start() {
    this.isActive = true;
    this.timeRemaining = this.timeLimit;
    this.startTimer();
    this.updateDisplay();
  }
  
  startTimer() {
    this.timer = setInterval(() => {
      this.timeRemaining--;
      this.updateDisplay();
      
      if (this.timeRemaining <= this.warningTime && !this.warningShown) {
        this.showWarning();
      }
      
      if (this.timeRemaining <= 0) {
        this.handleExpiry();
      }
    }, 1000);
  }
  
  extendSession() {
    if (this.extensionsUsed >= this.maxExtensions) {
      this.showMessage('Maximum extensions reached');
      return;
    }
    
    this.timeRemaining += this.extensionTime;
    this.extensionsUsed++;
    this.hideWarning();
    this.updateDisplay();
    
    // Announce to screen readers
    this.announceToScreenReader(
      \`Session extended by \${this.extensionTime / 60} minutes. \${this.maxExtensions - this.extensionsUsed} extensions remaining.\`
    );
  }
  
  disableTimeouts() {
    if (!this.allowDisable) {
      this.showMessage('Timeouts cannot be disabled for this session');
      return;
    }
    
    clearInterval(this.timer);
    this.isActive = false;
    this.hideWarning();
    this.hideTimer();
    
    this.announceToScreenReader('Session timeouts have been disabled');
  }
  
  showWarning() {
    this.warningShown = true;
    const warningDialog = document.getElementById('timeout-warning');
    warningDialog.hidden = false;
    warningDialog.focus();
    
    // Announce to screen readers
    this.announceToScreenReader(
      \`Warning: Your session will expire in \${Math.ceil(this.timeRemaining / 60)} minutes\`
    );
  }
  
  announceToScreenReader(message) {
    // Create a temporary live region for announcements
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'assertive');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  }
  
  loadUserPreferences() {
    const prefs = localStorage.getItem('sessionPreferences');
    if (prefs) {
      const parsed = JSON.parse(prefs);
      this.timeLimit = parsed.timeLimit || this.timeLimit;
      this.warningTime = parsed.warningTime || this.warningTime;
      this.extensionTime = parsed.extensionTime || this.extensionTime;
    }
  }
  
  saveUserPreferences() {
    const prefs = {
      timeLimit: this.timeLimit,
      warningTime: this.warningTime,
      extensionTime: this.extensionTime
    };
    localStorage.setItem('sessionPreferences', JSON.stringify(prefs));
  }
}
</script>`

  const cssExample = `/* Session timer styling */
.session-timer {
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  border: 2px solid #0066cc;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 250px;
}

.session-timer h3 {
  margin: 0 0 0.5rem 0;
  color: #0066cc;
  font-size: 1rem;
}

.time-display {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.time-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  font-family: monospace;
}

.time-bar {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.time-progress {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #FFC107, #F44336);
  transition: width 0.3s ease;
}

/* Session controls */
.session-controls {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.session-controls button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.extend-btn {
  background: #4CAF50;
  color: white;
}

.extend-btn:hover {
  background: #45a049;
}

.extend-btn:focus {
  outline: 2px solid #4CAF50;
  outline-offset: 2px;
}

.disable-btn {
  background: #f44336;
  color: white;
}

.disable-btn:hover {
  background: #da190b;
}

.disable-btn:focus {
  outline: 2px solid #f44336;
  outline-offset: 2px;
}

.extensions-remaining {
  font-size: 0.875rem;
  color: #666;
  text-align: center;
}

/* Warning dialog */
.warning-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.warning-dialog[hidden] {
  display: none;
}

.warning-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  border: 3px solid #FFC107;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.warning-content h3 {
  margin: 0 0 1rem 0;
  color: #FF9800;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.warning-content h3::before {
  content: "⚠️";
  font-size: 1.5rem;
}

.warning-actions {
  margin-top: 1.5rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.warning-actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.warning-actions .primary {
  background: #4CAF50;
  color: white;
}

.warning-actions .secondary {
  background: #757575;
  color: white;
}

.warning-actions button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.warning-actions button:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* Timing preferences */
.timing-preferences {
  margin: 2rem 0;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}

.timing-preferences h3 {
  margin-top: 0;
  color: #333;
}

.preferences-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.preferences-form fieldset {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
}

.preferences-form legend {
  font-weight: bold;
  color: #333;
  padding: 0 0.5rem;
}

.preferences-form label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
}

.preferences-form input[type="radio"] {
  margin: 0;
}

.preferences-form select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  font-size: 0.875rem;
}

.preferences-form button[type="submit"] {
  padding: 0.75rem 1.5rem;
  background: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  align-self: flex-start;
}

.preferences-form button[type="submit"]:hover {
  background: #0056b3;
}

.preferences-form button[type="submit"]:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* Bad example styling */
.bad-session {
  background: #ffebee;
  border: 2px solid #f44336;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
}

.fixed-timeout {
  color: #d32f2f;
  font-weight: bold;
}

/* Responsive design */
@media (max-width: 768px) {
  .session-timer {
    position: static;
    width: 100%;
    margin: 1rem 0;
  }
  
  .warning-content {
    width: 95%;
    padding: 1rem;
  }
  
  .warning-actions {
    flex-direction: column;
  }
  
  .warning-actions button {
    width: 100%;
  }
}

/* Screen reader only content */
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
}

/* Focus management */
.warning-dialog:focus-within {
  outline: none;
}

.warning-content:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* Animation for warnings */
@keyframes warning-pulse {
  0% { background-color: #fff3cd; }
  50% { background-color: #ffeaa7; }
  100% { background-color: #fff3cd; }
}

.warning-active {
  animation: warning-pulse 2s infinite;
}`

  const reactExample = `import React, { useState, useEffect, useRef } from 'react'

// Hook for managing timing sessions
const useTimingSession = (config) => {
  const [timeRemaining, setTimeRemaining] = useState(config.timeLimit)
  const [isActive, setIsActive] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [extensionsUsed, setExtensionsUsed] = useState(0)
  const [isExpired, setIsExpired] = useState(false)
  const timerRef = useRef(null)
  const warningShownRef = useRef(false)
  
  const startSession = () => {
    setIsActive(true)
    setTimeRemaining(config.timeLimit)
    setShowWarning(false)
    setExtensionsUsed(0)
    setIsExpired(false)
    warningShownRef.current = false
    
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1
        
        if (newTime <= 0) {
          setIsExpired(true)
          setIsActive(false)
          setShowWarning(false)
          clearInterval(timerRef.current)
          return 0
        }
        
        if (newTime <= config.warningTime && !warningShownRef.current) {
          setShowWarning(true)
          warningShownRef.current = true
          
          // Announce to screen readers
          announceToScreenReader(
            \`Warning: Your session will expire in \${Math.ceil(newTime / 60)} minutes\`
          )
        }
        
        return newTime
      })
    }, 1000)
  }
  
  const extendSession = () => {
    if (extensionsUsed >= config.maxExtensions) {
      announceToScreenReader('Maximum extensions reached')
      return false
    }
    
    setTimeRemaining(prev => prev + config.extensionTime)
    setExtensionsUsed(prev => prev + 1)
    setShowWarning(false)
    warningShownRef.current = false
    
    announceToScreenReader(
      \`Session extended by \${config.extensionTime / 60} minutes. \${config.maxExtensions - extensionsUsed - 1} extensions remaining.\`
    )
    
    return true
  }
  
  const disableTimeouts = () => {
    if (!config.allowDisable) {
      announceToScreenReader('Timeouts cannot be disabled for this session')
      return false
    }
    
    clearInterval(timerRef.current)
    setIsActive(false)
    setShowWarning(false)
    setTimeRemaining(0)
    
    announceToScreenReader('Session timeouts have been disabled')
    return true
  }
  
  const stopSession = () => {
    clearInterval(timerRef.current)
    setIsActive(false)
    setShowWarning(false)
    setTimeRemaining(0)
    setIsExpired(false)
  }
  
  const announceToScreenReader = (message) => {
    // Create temporary live region for announcements
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'assertive')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    
    document.body.appendChild(announcement)
    setTimeout(() => document.body.removeChild(announcement), 1000)
  }
  
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])
  
  return {
    timeRemaining,
    isActive,
    showWarning,
    extensionsUsed,
    isExpired,
    startSession,
    extendSession,
    disableTimeouts,
    stopSession
  }
}

// Session timer component
const SessionTimer = ({ config, onExpiry }) => {
  const {
    timeRemaining,
    isActive,
    showWarning,
    extensionsUsed,
    isExpired,
    startSession,
    extendSession,
    disableTimeouts,
    stopSession
  } = useTimingSession(config)
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return \`\${mins.toString().padStart(2, '0')}:\${secs.toString().padStart(2, '0')}\`
  }
  
  const getProgressPercentage = () => {
    return ((config.timeLimit - timeRemaining) / config.timeLimit) * 100
  }
  
  const getProgressColor = () => {
    const percentage = getProgressPercentage()
    if (percentage < 50) return '#4CAF50'
    if (percentage < 80) return '#FFC107'
    return '#F44336'
  }
  
  useEffect(() => {
    if (isExpired && onExpiry) {
      onExpiry()
    }
  }, [isExpired, onExpiry])
  
  if (!isActive && !isExpired) {
    return (
      <div className="session-controls">
        <button onClick={startSession} className="start-session-btn">
          Start {config.name} Session
        </button>
      </div>
    )
  }
  
  return (
    <div className="session-timer">
      <div className="timer-header">
        <h3>{config.name} Session</h3>
        <button onClick={stopSession} className="stop-btn" aria-label="Stop session">
          ✕
        </button>
      </div>
      
      {isActive && (
        <>
          <div className="time-display" role="timer" aria-live="polite">
            <span className="time-value">{formatTime(timeRemaining)}</span>
            <div className="time-bar">
              <div 
                className="time-progress" 
                style={{
                  width: \`\${getProgressPercentage()}%\`,
                  backgroundColor: getProgressColor()
                }}
              />
            </div>
          </div>
          
          <div className="session-controls">
            <button 
              onClick={extendSession}
              disabled={extensionsUsed >= config.maxExtensions}
              className="extend-btn"
            >
              Extend (+{Math.floor(config.extensionTime / 60)}min)
            </button>
            
            {config.allowDisable && (
              <button onClick={disableTimeouts} className="disable-btn">
                Disable Timeouts
              </button>
            )}
            
            <div className="extensions-info">
              Extensions: {extensionsUsed}/{config.maxExtensions}
            </div>
          </div>
        </>
      )}
      
      {isExpired && (
        <div className="expired-message">
          <h3>Session Expired</h3>
          <p>Your {config.name} session has expired.</p>
          <button onClick={startSession} className="restart-btn">
            Start New Session
          </button>
        </div>
      )}
      
      {/* Warning Modal */}
      {showWarning && (
        <div className="warning-modal" role="dialog" aria-modal="true">
          <div className="warning-content">
            <h3>Session Expiring Soon</h3>
            <p>
              Your session will expire in {Math.ceil(timeRemaining / 60)} minute
              {Math.ceil(timeRemaining / 60) !== 1 ? 's' : ''}.
            </p>
            <div className="warning-actions">
              <button onClick={extendSession} className="primary">
                Extend Session
              </button>
              <button onClick={() => setShowWarning(false)} className="secondary">
                Continue Working
              </button>
              <button onClick={stopSession} className="secondary">
                Save & Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// User preferences component
const TimingPreferences = ({ onPreferencesChange }) => {
  const [preferences, setPreferences] = useState({
    timeLimit: 900, // 15 minutes
    warningTime: 120, // 2 minutes
    extensionTime: 600, // 10 minutes
    maxExtensions: 3,
    notificationsEnabled: true,
    allowDisable: true
  })
  
  const handlePreferenceChange = (key, value) => {
    const newPreferences = { ...preferences, [key]: value }
    setPreferences(newPreferences)
    onPreferencesChange(newPreferences)
  }
  
  return (
    <div className="timing-preferences">
      <h3>Timing Preferences</h3>
      
      <div className="preference-group">
        <label>Session Length:</label>
        <select 
          value={preferences.timeLimit}
          onChange={(e) => handlePreferenceChange('timeLimit', parseInt(e.target.value))}
        >
          <option value={600}>10 minutes</option>
          <option value={900}>15 minutes</option>
          <option value={1800}>30 minutes</option>
          <option value={3600}>60 minutes</option>
          <option value={0}>No limit</option>
        </select>
      </div>
      
      <div className="preference-group">
        <label>Warning Time:</label>
        <select 
          value={preferences.warningTime}
          onChange={(e) => handlePreferenceChange('warningTime', parseInt(e.target.value))}
        >
          <option value={60}>1 minute</option>
          <option value={120}>2 minutes</option>
          <option value={300}>5 minutes</option>
          <option value={600}>10 minutes</option>
        </select>
      </div>
      
      <div className="preference-group">
        <label>Extension Time:</label>
        <select 
          value={preferences.extensionTime}
          onChange={(e) => handlePreferenceChange('extensionTime', parseInt(e.target.value))}
        >
          <option value={300}>5 minutes</option>
          <option value={600}>10 minutes</option>
          <option value={900}>15 minutes</option>
          <option value={1800}>30 minutes</option>
        </select>
      </div>
      
      <div className="preference-group">
        <label>
          <input 
            type="checkbox"
            checked={preferences.notificationsEnabled}
            onChange={(e) => handlePreferenceChange('notificationsEnabled', e.target.checked)}
          />
          Enable notifications
        </label>
      </div>
      
      <div className="preference-group">
        <label>
          <input 
            type="checkbox"
            checked={preferences.allowDisable}
            onChange={(e) => handlePreferenceChange('allowDisable', e.target.checked)}
          />
          Allow disabling timeouts
        </label>
      </div>
    </div>
  )
}

// Main app component
const TimingAdjustableApp = () => {
  const [sessionConfig, setSessionConfig] = useState({
    name: 'Shopping Cart',
    timeLimit: 900,
    warningTime: 120,
    extensionTime: 600,
    maxExtensions: 3,
    allowDisable: true
  })
  
  const handlePreferencesChange = (preferences) => {
    setSessionConfig(prev => ({
      ...prev,
      ...preferences
    }))
  }
  
  const handleSessionExpiry = () => {
    console.log('Session expired - redirecting to login')
    // Handle session expiry (redirect, show message, etc.)
  }
  
  return (
    <div className="timing-app">
      <header>
        <h1>WCAG 2.2.1 Timing Adjustable Demo</h1>
        <p>
          This demonstrates how to provide users with control over time limits
          in web applications.
        </p>
      </header>
      
      <main>
        <SessionTimer 
          config={sessionConfig}
          onExpiry={handleSessionExpiry}
        />
        
        <TimingPreferences 
          onPreferencesChange={handlePreferencesChange}
        />
      </main>
    </div>
  )
}

export default TimingAdjustableApp`

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
            WCAG 2.2 Level A
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            2.2.1 Timing Adjustable
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            For each time limit set by content, users must be able to turn off, adjust, or extend the time limit before encountering it.
          </p>
        </div>

        {/* Screen Reader Toggle */}
        <div className="mb-6 text-center">
          <Button
            onClick={() => setShowScreenReader(!showScreenReader)}
            variant="outline"
            className="border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            {showScreenReader ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
            {showScreenReader ? 'Disable' : 'Enable'} Screen Reader Simulation
          </Button>
        </div>

        {/* Interactive Session Manager */}
        <Card className="mb-8 border-blue-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-slate-500 text-white">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Interactive Session Manager
            </CardTitle>
            <CardDescription className="text-blue-100">
              Experience different timing scenarios with full user control
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Session Controls */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Global Settings</h3>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="global-timeouts">Enable Timeouts</Label>
                    <Switch
                      id="global-timeouts"
                      checked={globalTimeouts}
                      onCheckedChange={setGlobalTimeouts}
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Label htmlFor="notifications">Notifications</Label>
                  <Switch
                    id="notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h4 className="font-medium">Available Sessions</h4>
                  {sessions.map((session) => (
                    <div key={session.id} className="p-3 border rounded-lg bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h5 className="font-medium">{session.name}</h5>
                          <p className="text-sm text-gray-600">
                            {session.timeLimit}s limit, {session.warningTime}s warning
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {session.allowDisable && (
                            <Badge variant="secondary" className="text-xs">
                              Configurable
                            </Badge>
                          )}
                          {!session.allowDisable && (
                            <Badge variant="destructive" className="text-xs">
                              Required
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => startSession(session.id)}
                          disabled={!globalTimeouts || activeSession === session.id}
                          size="sm"
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Start
                        </Button>
                        
                        {activeSession === session.id && (
                          <Button
                            onClick={stopSession}
                            size="sm"
                            variant="outline"
                            className="border-red-200 text-red-700 hover:bg-red-50"
                          >
                            <Square className="h-3 w-3 mr-1" />
                            Stop
                          </Button>
                        )}
                        
                        {session.allowDisable && (
                          <Button
                            onClick={() => disableTimeouts(session.id)}
                            size="sm"
                            variant="outline"
                            className="border-gray-200 text-gray-700 hover:bg-gray-50"
                          >
                            <Shield className="h-3 w-3 mr-1" />
                            Disable
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Timer Display */}
              <div className="space-y-4">
                {activeSession && activeSessionData ? (
                  <div className="p-4 bg-white rounded-lg border-2 border-blue-200">
                    <div className="text-center mb-4">
                      <h3 className="font-semibold text-lg">{activeSessionData.name}</h3>
                      <div className="text-3xl font-mono font-bold text-blue-600">
                        {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                      </div>
                    </div>
                    
                    <Progress value={progressPercentage} className="mb-4" />
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <span>Time Remaining</span>
                      <span>{timeRemaining}s</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <span>Extensions Used</span>
                      <span>{extensionsUsed}/{activeSessionData.maxExtensions}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={extendSession}
                        disabled={extensionsUsed >= activeSessionData.maxExtensions}
                        size="sm"
                        className="flex-1 bg-green-500 hover:bg-green-600"
                      >
                        <Clock4 className="h-3 w-3 mr-1" />
                        Extend (+{activeSessionData.extensionTime}s)
                      </Button>
                      
                      {activeSessionData.allowDisable && (
                        <Button
                          onClick={() => disableTimeouts(activeSession)}
                          size="sm"
                          variant="outline"
                          className="border-red-200 text-red-700 hover:bg-red-50"
                        >
                          <XOctagon className="h-3 w-3 mr-1" />
                          Disable
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <Clock className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-600">No active session</p>
                    <p className="text-sm text-gray-500">Start a session to see timing controls</p>
                  </div>
                )}
                
                {/* User Activity Simulation */}
                <div className="p-4 bg-white rounded-lg border">
                  <h4 className="font-medium mb-3">Simulate User Activity</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => simulateActivity('Form input')}
                      size="sm"
                      variant="outline"
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      <Type className="h-3 w-3 mr-1" />
                      Type
                    </Button>
                    <Button
                      onClick={() => simulateActivity('Page navigation')}
                      size="sm"
                      variant="outline"
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Navigate
                    </Button>
                    <Button
                      onClick={() => simulateActivity('Button click')}
                      size="sm"
                      variant="outline"
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Click
                    </Button>
                    <Button
                      onClick={() => simulateActivity('Form submission')}
                      size="sm"
                      variant="outline"
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Submit
                    </Button>
                  </div>
                  
                  <div className="mt-3 text-sm text-gray-600">
                    <div>Activities: {userActivity}</div>
                    <div>Last: {lastActivity || 'None'}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warning Modal */}
        {showWarning && activeSessionData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 border-2 border-yellow-400">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
                <h2 className="text-xl font-semibold">Session Expiring Soon</h2>
              </div>
              
              <p className="text-gray-700 mb-4">
                Your {activeSessionData.name} session will expire in{' '}
                <strong>{Math.ceil(timeRemaining / 60)} minute{Math.ceil(timeRemaining / 60) !== 1 ? 's' : ''}</strong>.
              </p>
              
              <div className="space-y-2 mb-4">
                <Button
                  onClick={extendSession}
                  disabled={extensionsUsed >= activeSessionData.maxExtensions}
                  className="w-full bg-green-500 hover:bg-green-600"
                >
                  <Clock4 className="h-4 w-4 mr-2" />
                  Extend Session (+{Math.floor(activeSessionData.extensionTime / 60)}min)
                </Button>
                
                <Button
                  onClick={() => setShowWarning(false)}
                  variant="outline"
                  className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  Continue Working
                </Button>
                
                <Button
                  onClick={stopSession}
                  variant="outline"
                  className="w-full border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Save & Logout
                </Button>
                
                {activeSessionData.allowDisable && (
                  <Button
                    onClick={() => {
                      disableTimeouts(activeSession!)
                      setShowWarning(false)
                    }}
                    variant="outline"
                    className="w-full border-red-200 text-red-700 hover:bg-red-50"
                  >
                    <XOctagon className="h-4 w-4 mr-2" />
                    Disable All Timeouts
                  </Button>
                )}
              </div>
              
              <div className="text-xs text-gray-500 text-center">
                Extensions remaining: {activeSessionData.maxExtensions - extensionsUsed}
              </div>
            </div>
          </div>
        )}

        {/* Session Expired Modal */}
        {sessionExpired && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 border-2 border-red-400">
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="h-8 w-8 text-red-500" />
                <h2 className="text-xl font-semibold">Session Expired</h2>
              </div>
              
              <p className="text-gray-700 mb-4">
                Your session has expired. Please start a new session to continue.
              </p>
              
              <Button
                onClick={() => setSessionExpired(false)}
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                Start New Session
              </Button>
            </div>
          </div>
        )}

        {/* Timing Event Log */}
        <Card className="mb-8 border-blue-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-slate-500 text-white">
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              Timing Events Log
            </CardTitle>
            <CardDescription className="text-blue-100">
              Monitor timing events and user interactions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Recent Events</h3>
              <Button
                onClick={clearTimingLog}
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-700"
              >
                Clear Log
              </Button>
            </div>
            
            <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-48 overflow-y-auto">
              {timingLog.length === 0 ? (
                <div className="text-gray-500">No events logged yet...</div>
              ) : (
                timingLog.map((event, index) => (
                  <div key={index} className="mb-1">
                    {event}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Good vs Bad Examples */}
        <Card className="mb-8 border-blue-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-slate-500 text-white">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Good vs Bad Examples
            </CardTitle>
            <CardDescription className="text-blue-100">
              Compare compliant and non-compliant timing implementations
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
                    <strong>Compliant:</strong> These examples provide appropriate timing control
                  </AlertDescription>
                </Alert>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <h3 className="font-semibold mb-3">✅ Extendable Session</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-600" />
                        <span>15-minute session</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-green-600" />
                        <span>2-minute warning</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 text-green-600" />
                        <span>3 extensions available</span>
                      </div>
                    </div>
                    <div className="mt-3 p-2 bg-green-100 rounded">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 w-full">
                        Extend Session (+10min)
                      </Button>
                    </div>
                    <p className="text-sm text-green-700 mt-2">
                      • Clear warning before expiry<br/>
                      • Multiple extension options<br/>
                      • User has control<br/>
                      • Accessible notifications
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <h3 className="font-semibold mb-3">✅ Configurable Timeouts</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-green-600" />
                        <span>User preferences</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span>Can disable timeouts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-green-600" />
                        <span>Personalized timing</span>
                      </div>
                    </div>
                    <div className="mt-3 p-2 bg-green-100 rounded">
                      <div className="flex items-center gap-2">
                        <Switch checked={true} />
                        <span className="text-sm">Custom timing</span>
                      </div>
                    </div>
                    <p className="text-sm text-green-700 mt-2">
                      • Adjustable time limits<br/>
                      • User-controlled preferences<br/>
                      • Option to disable entirely<br/>
                      • Persistent settings
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <h3 className="font-semibold mb-3">✅ Activity-Based Timing</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-green-600" />
                        <span>Detects user activity</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 text-green-600" />
                        <span>Auto-extends on activity</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-600" />
                        <span>Intelligent timing</span>
                      </div>
                    </div>
                    <div className="mt-3 p-2 bg-green-100 rounded text-xs">
                      <div>Last activity: 30s ago</div>
                      <div>Session auto-extended</div>
                    </div>
                    <p className="text-sm text-green-700 mt-2">
                      • Monitors user engagement<br/>
                      • Automatically extends sessions<br/>
                      • Reduces interruptions<br/>
                      • Smart timeout management
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <h3 className="font-semibold mb-3">✅ Graceful Degradation</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-green-600" />
                        <span>Clear timeout reason</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Data recovery options</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 text-green-600" />
                        <span>Easy session restart</span>
                      </div>
                    </div>
                    <div className="mt-3 p-2 bg-green-100 rounded">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 w-full">
                        Restore Session
                      </Button>
                    </div>
                    <p className="text-sm text-green-700 mt-2">
                      • Explains timeout reasons<br/>
                      • Preserves user data<br/>
                      • Quick recovery options<br/>
                      • Helpful error messages
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="bad" className="space-y-4">
                <Alert className="border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Non-compliant:</strong> These examples violate WCAG 2.2.1
                  </AlertDescription>
                </Alert>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                    <h3 className="font-semibold mb-3">❌ Fixed Timeout</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span>5-minute hard limit</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span>No extension option</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span>No user control</span>
                      </div>
                    </div>
                    <div className="mt-3 p-2 bg-red-100 rounded text-center">
                      <span className="text-red-700 font-mono">05:00</span>
                      <div className="text-xs text-red-600">Cannot extend</div>
                    </div>
                    <p className="text-sm text-red-700 mt-2">
                      • No warning before expiry<br/>
                      • Cannot extend session<br/>
                      • No user preferences<br/>
                      • Violates WCAG 2.2.1
                    </p>
                  </div>
                  
                  <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                    <h3 className="font-semibold mb-3">❌ No Warning System</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span>Silent expiration</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span>No advance notice</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span>Sudden logout</span>
                      </div>
                    </div>
                    <div className="mt-3 p-2 bg-red-100 rounded text-center">
                      <span className="text-red-700 text-sm">Session expired!</span>
                    </div>
                    <p className="text-sm text-red-700 mt-2">
                      • No advance warning<br/>
                      • Unexpected termination<br/>
                      • Data loss risk<br/>
                      • Poor user experience
                    </p>
                  </div>
                  
                  <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                    <h3 className="font-semibold mb-3">❌ Aggressive Timeouts</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span>30-second timeout</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span>Too short for users</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span>No adjustment option</span>
                      </div>
                    </div>
                    <div className="mt-3 p-2 bg-red-100 rounded text-center">
                      <span className="text-red-700 font-mono">00:30</span>
                      <div className="text-xs text-red-600">Too fast!</div>
                    </div>
                    <p className="text-sm text-red-700 mt-2">
                      • Unreasonably short timeouts<br/>
                      • Doesn't consider user needs<br/>
                      • Causes frustration<br/>
                      • Accessibility barrier
                    </p>
                  </div>
                  
                  <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                    <h3 className="font-semibold mb-3">❌ Security Override</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span>"Security requires timeout"</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span>No exceptions allowed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span>Misused exemption</span>
                      </div>
                    </div>
                    <div className="mt-3 p-2 bg-red-100 rounded text-center">
                      <span className="text-red-700 text-sm">Non-negotiable</span>
                    </div>
                    <p className="text-sm text-red-700 mt-2">
                      • Misuses security exemption<br/>
                      • Doesn't provide alternatives<br/>
                      • Blanket security claim<br/>
                      • Often not truly required
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Implementation Examples */}
        <Card className="mb-8 border-blue-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-slate-500 text-white">
            <CardTitle>Implementation Examples</CardTitle>
            <CardDescription className="text-blue-100">
              Copy-paste code examples for accessible timing controls
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
        <Card className="mb-8 border-blue-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-slate-500 text-white">
            <CardTitle>Testing Methods</CardTitle>
            <CardDescription className="text-blue-100">
              How to test for WCAG 2.2.1 compliance
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
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Manual Test Steps</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                      <li>Identify all time limits in the application</li>
                      <li>Test each timeout without taking any action</li>
                      <li>Verify users receive adequate warning</li>
                      <li>Check if timeouts can be extended</li>
                      <li>Test the ability to disable timeouts</li>
                      <li>Verify timeout adjustments are saved</li>
                      <li>Test with assistive technologies</li>
                      <li>Verify timeout notifications are accessible</li>
                    </ol>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Key Test Areas</h4>
                    <ul className="text-blue-800 space-y-1 text-sm">
                      <li>• <strong>Session Management:</strong> Login sessions, shopping carts, forms</li>
                      <li>• <strong>Timed Content:</strong> Slideshows, carousels, news tickers</li>
                      <li>• <strong>Interactive Elements:</strong> Quizzes, games, tutorials</li>
                      <li>• <strong>Security Features:</strong> Auto-logout, password expiry</li>
                      <li>• <strong>Media Players:</strong> Video/audio with time controls</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="automated" className="space-y-4">
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Automated Testing Tools</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li><strong>Custom Scripts:</strong> Monitor timing behavior and user controls</li>
                      <li><strong>Session Monitoring:</strong> Track timeout implementations</li>
                      <li><strong>User Flow Testing:</strong> Test complete timing scenarios</li>
                      <li><strong>API Testing:</strong> Verify timeout configuration endpoints</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">JavaScript Testing Example:</h4>
                    <pre className="bg-gray-900 text-gray-100 p-3 rounded text-sm overflow-x-auto">
                      <code>{`// Test for timing controls
const timingTester = {
  // Detect timing mechanisms
  detectTimers: () => {
    const timers = []
    
    // Check for setTimeout/setInterval usage
    const originalSetTimeout = window.setTimeout
    const originalSetInterval = window.setInterval
    
    window.setTimeout = function(callback, delay) {
      if (delay > 5000) { // Timers longer than 5 seconds
        timers.push({
          type: 'timeout',
          delay: delay,
          callback: callback.toString()
        })
      }
      return originalSetTimeout.apply(this, arguments)
    }
    
    window.setInterval = function(callback, delay) {
      timers.push({
        type: 'interval',
        delay: delay,
        callback: callback.toString()
      })
      return originalSetInterval.apply(this, arguments)
    }
    
    return timers
  },
  
  // Test for user controls
  testUserControls: () => {
    const controls = {
      extendButtons: document.querySelectorAll('[data-extend], [aria-label*="extend"]'),
      disableButtons: document.querySelectorAll('[data-disable], [aria-label*="disable"]'),
      preferenceSettings: document.querySelectorAll('input[name*="timeout"], select[name*="timeout"]'),
      warningDialogs: document.querySelectorAll('[role="dialog"], [aria-live]')
    }
    
    return {
      hasExtendOption: controls.extendButtons.length > 0,
      hasDisableOption: controls.disableButtons.length > 0,
      hasPreferences: controls.preferenceSettings.length > 0,
      hasWarnings: controls.warningDialogs.length > 0
    }
  },
  
  // Test warning timing
  testWarningTiming: async () => {
    const warnings = document.querySelectorAll('[data-warning-time]')
    const results = []
    
    for (const warning of warnings) {
      const warningTime = parseInt(warning.dataset.warningTime)
      const totalTime = parseInt(warning.dataset.totalTime)
      
      if (warningTime && totalTime) {
        const warningRatio = warningTime / totalTime
        results.push({
          element: warning,
          warningTime: warningTime,
          totalTime: totalTime,
          warningRatio: warningRatio,
          adequate: warningRatio >= 0.1 // At least 10% warning time
        })
      }
    }
    
    return results
  },
  
  // Test accessibility of timing controls
  testAccessibility: () => {
    const issues = []
    
    // Check for accessible labels
    const timerElements = document.querySelectorAll('[role="timer"]')
    timerElements.forEach(timer => {
      if (!timer.getAttribute('aria-label') && !timer.getAttribute('aria-labelledby')) {
        issues.push({
          element: timer,
          issue: 'Timer missing accessible label'
        })
      }
    })
    
    // Check for live regions
    const warningElements = document.querySelectorAll('[data-warning]')
    warningElements.forEach(warning => {
      if (!warning.getAttribute('aria-live')) {
        issues.push({
          element: warning,
          issue: 'Warning missing live region'
        })
      }
    })
    
    return issues
  }
}

// Run comprehensive timing test
const runTimingTest = async () => {
  const timers = timingTester.detectTimers()
  const controls = timingTester.testUserControls()
  const warnings = await timingTester.testWarningTiming()
  const accessibility = timingTester.testAccessibility()
  
  const compliance = {
    hasTimeLimits: timers.length > 0,
    hasUserControls: controls.hasExtendOption || controls.hasDisableOption || controls.hasPreferences,
    hasAdequateWarnings: warnings.every(w => w.adequate),
    isAccessible: accessibility.length === 0,
    isCompliant: function() {
      return !this.hasTimeLimits || 
             (this.hasUserControls && this.hasAdequateWarnings && this.isAccessible)
    }
  }
  
  return {
    timers,
    controls,
    warnings,
    accessibility,
    compliance
  }
}

// Usage
runTimingTest().then(results => {
  console.log('WCAG 2.2.1 Test Results:', results)
  console.log('Compliance:', results.compliance.isCompliant() ? 'PASS' : 'FAIL')
})`}</code>
                    </pre>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Key Requirements */}
        <Card className="border-blue-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-slate-500 text-white">
            <CardTitle>Key Requirements Summary</CardTitle>
            <CardDescription className="text-blue-100">
              Essential points for WCAG 2.2.1 compliance
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
                    <span>Allow users to turn off time limits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Let users adjust time limits (up to 10x default)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Provide extension options with adequate warning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Warn users at least 20 seconds before timeout</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Preserve user data during timeouts</span>
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
                    <span>Implement fixed, non-adjustable timeouts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Timeout users without warning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Provide insufficient warning time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Lose user data on timeout</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Claim security exemptions unnecessarily</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="text-center">
              <p className="text-gray-600 mb-2">
                <strong>Remember:</strong> Time limits disproportionately affect users with disabilities who may need more time to read, understand, or interact with content.
              </p>
              <p className="text-sm text-gray-500">
                Always provide user control over timing to ensure equal access to your content and functionality.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 