"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX, Square, RotateCcw, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface ListenFeatureProps {
  title: string
  content: any[]
}

interface ContentBlock {
  id: string
  type: 'title' | 'heading' | 'paragraph' | 'list' | 'blockquote'
  level?: number
  text: string
  rawContent: any
}

interface ReadingState {
  currentBlockIndex: number
  isPlaying: boolean
  isPaused: boolean
  highlightedBlockId: string | null
  progress: number
  currentSentence: number
  totalSentences: number
}

interface ReadingSettings {
  rate: number
  pitch: number
  volume: number
  pauseMultiplier: number
  voiceIndex: number
}

export function ListenFeature({ title, content }: ListenFeatureProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [readingState, setReadingState] = useState<ReadingState>({
    currentBlockIndex: -1,
    isPlaying: false,
    isPaused: false,
    highlightedBlockId: null,
    progress: 0,
    currentSentence: 0,
    totalSentences: 0
  })
  
  const [settings, setSettings] = useState<ReadingSettings>({
    rate: 0.85,
    pitch: 1.0,
    volume: 0.8,
    pauseMultiplier: 1.0,
    voiceIndex: 0
  })
  
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null)
  const blocksRef = useRef<ContentBlock[]>([])
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const currentElementRef = useRef<HTMLElement | null>(null)

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      setAvailableVoices(voices)
    }
    
    loadVoices()
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices)
    
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
    }
  }, [])

  // Parse content blocks into structured format
  const parseContentBlocks = useCallback((blocks: any[]): ContentBlock[] => {
    if (!blocks || !Array.isArray(blocks)) return []
    
    const parsedBlocks: ContentBlock[] = []
    
    // Add title as first block
    if (title) {
      parsedBlocks.push({
        id: 'title',
        type: 'title',
        text: title,
        rawContent: null
      })
    }
    
    blocks.forEach((block, index) => {
      if (block._type === "block" && block.children) {
        const blockId = `block-${index}`
        const text = block.children
          .map((child: any) => child.text || "")
          .join("")
          .trim()
        
        if (!text) return
        
        let blockType: ContentBlock['type'] = 'paragraph'
        let level: number | undefined
        
        switch (block.style) {
          case 'h1':
            blockType = 'heading'
            level = 1
            break
          case 'h2':
            blockType = 'heading'
            level = 2
            break
          case 'h3':
            blockType = 'heading'
            level = 3
            break
          case 'h4':
            blockType = 'heading'
            level = 4
            break
          case 'blockquote':
            blockType = 'blockquote'
            break
          case 'normal':
          default:
            blockType = 'paragraph'
            break
        }
        
        // Handle lists
        if (block.listItem) {
          blockType = 'list'
        }
        
        parsedBlocks.push({
          id: blockId,
          type: blockType,
          level,
          text,
          rawContent: block
        })
      }
    })
    
    return parsedBlocks
  }, [title])

  // Initialize content blocks
  useEffect(() => {
    blocksRef.current = parseContentBlocks(content)
  }, [content, parseContentBlocks])

  // Generate human-like speech text with natural introductions
  const generateSpeechText = useCallback((block: ContentBlock, isFirst: boolean = false): string => {
    let speechText = ""
    
    // Add natural introductions based on block type
    switch (block.type) {
      case 'title':
        speechText = isFirst ? 
          `Welcome! I'll be reading this article for you. The title is: "${block.text}". Let me begin with the content.` : 
          block.text
        break
      case 'heading':
        const levelText = block.level === 1 ? 'main section' : 
                         block.level === 2 ? 'section' : 
                         block.level === 3 ? 'subsection' : 'topic'
        speechText = `Moving on to the next ${levelText}: ${block.text}. Here's what this section covers.`
        break
      case 'paragraph':
        speechText = block.text
        break
      case 'list':
        speechText = `Here's an important point: ${block.text}`
        break
      case 'blockquote':
        speechText = `I'd like to highlight this quote: "${block.text}". This is particularly noteworthy.`
        break
      default:
        speechText = block.text
        break
    }
    
    // Clean up text and add natural pauses
    speechText = speechText.replace(/\s+/g, ' ').trim()
    
    // Add natural breathing pauses for longer content
    if (speechText.length > 150) {
      speechText = speechText.replace(/\. /g, '. ')
      speechText = speechText.replace(/\? /g, '? ')
      speechText = speechText.replace(/\! /g, '! ')
      speechText = speechText.replace(/; /g, '; ')
      speechText = speechText.replace(/, /g, ', ')
    }
    
    // Remove any weird characters that might cause issues
    speechText = speechText.replace(/[^\w\s.,!?;:'"()-]/g, '')
    
    return speechText
  }, [])

  // Get appropriate pause duration based on content type
  const getPauseDuration = useCallback((currentBlock: ContentBlock, nextBlock?: ContentBlock): number => {
    // Base pause durations in milliseconds (adjusted for more natural flow)
    const basePauses = {
      title: 2000,      // Longer pause after title
      heading: 1500,    // Good pause after headings
      paragraph: 1000,  // Standard pause after paragraphs
      list: 700,        // Shorter pause after list items
      blockquote: 1200  // Thoughtful pause after quotes
    }
    
    let pauseDuration = basePauses[currentBlock.type] || 1000
    
    // Apply user's pause multiplier
    pauseDuration *= settings.pauseMultiplier
    
    // Add extra pause when transitioning between different content types
    if (nextBlock && nextBlock.type !== currentBlock.type) {
      pauseDuration += 500
    }
    
    // Add extra pause when going from title to first content
    if (currentBlock.type === 'title' && nextBlock) {
      pauseDuration += 800
    }
    
    // Add extra pause when starting a new major section
    if (nextBlock?.type === 'heading' && nextBlock.level === 1) {
      pauseDuration += 600
    }
    
    return pauseDuration
  }, [settings.pauseMultiplier])

  // Enhanced highlighting with smooth scrolling
  const highlightBlock = useCallback((blockId: string | null) => {
    // Remove previous highlighting
    document.querySelectorAll('.reading-highlight').forEach(el => {
      el.classList.remove('reading-highlight')
    })
    
    if (!blockId) {
      currentElementRef.current = null
      return
    }
    
    let element: HTMLElement | null = null
    
    if (blockId === 'title') {
      // Find the title element
      element = document.querySelector('h1') as HTMLElement
    } else {
      // More sophisticated element matching
      const blockIndex = parseInt(blockId.split('-')[1])
      
      // Try to find the element by matching content
      const allElements = document.querySelectorAll('.prose-content > *')
      
      // Look for exact text match first
      for (let i = 0; i < allElements.length; i++) {
        const el = allElements[i] as HTMLElement
        if (el.textContent?.trim() === blocksRef.current[blockIndex + (title ? 1 : 0)]?.text) {
          element = el
          break
        }
      }
      
      // Fallback to positional matching
      if (!element && allElements[blockIndex]) {
        element = allElements[blockIndex] as HTMLElement
      }
    }
    
    if (element) {
      element.classList.add('reading-highlight')
      currentElementRef.current = element
      
      // Smooth scroll to the element
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
      })
    }
    
    setReadingState(prev => ({
      ...prev,
      highlightedBlockId: blockId
    }))
  }, [title])

  // Stop reading
  const stopSpeech = useCallback(() => {
    // Cancel current speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
    }
    
    // Clear any pending timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    
    // Update state
    setIsPlaying(false)
    setReadingState({
      currentBlockIndex: -1,
      isPlaying: false,
      isPaused: false,
      highlightedBlockId: null,
      progress: 0,
      currentSentence: 0,
      totalSentences: 0
    })
    highlightBlock(null)
  }, [highlightBlock])

  // Enhanced speech with better voice settings
  const speakBlock = useCallback((block: ContentBlock, blockIndex: number) => {
    if (!('speechSynthesis' in window)) return
    
    const speechText = generateSpeechText(block, blockIndex === 0)
    const utterance = new SpeechSynthesisUtterance(speechText)
    
    // Configure speech settings
    utterance.rate = settings.rate
    utterance.pitch = settings.pitch
    utterance.volume = isMuted ? 0 : settings.volume
    
    // Use selected voice
    if (availableVoices.length > 0 && availableVoices[settings.voiceIndex]) {
      utterance.voice = availableVoices[settings.voiceIndex]
    }
    
    // Set up event handlers
    utterance.onstart = () => {
      highlightBlock(block.id)
      setReadingState(prev => ({
        ...prev,
        currentBlockIndex: blockIndex,
        isPlaying: true,
        progress: (blockIndex / blocksRef.current.length) * 100
      }))
    }
    
    utterance.onend = () => {
      const nextBlockIndex = blockIndex + 1
      const nextBlock = blocksRef.current[nextBlockIndex]
      
      if (nextBlock) {
        // Add natural pause before next block
        const pauseDuration = getPauseDuration(block, nextBlock)
        
        timeoutRef.current = setTimeout(() => {
          speakBlock(nextBlock, nextBlockIndex)
        }, pauseDuration)
      } else {
        // Finished reading all blocks
        setIsPlaying(false)
        setReadingState(prev => ({
          ...prev,
          isPlaying: false,
          currentBlockIndex: -1,
          progress: 100
        }))
        highlightBlock(null)
      }
    }
    
    utterance.onerror = (event) => {
      // Only log errors that aren't interruptions (which are normal when stopping/pausing)
      if (event.error !== 'interrupted' && event.error !== 'canceled') {
        console.error('Speech synthesis error:', event.error)
      }
      
      // Don't stop playback for interruption errors as they're normal
      if (event.error === 'interrupted' || event.error === 'canceled') {
        return
      }
      
      // For other errors, stop playback
      setIsPlaying(false)
      setReadingState(prev => ({
        ...prev,
        isPlaying: false,
        currentBlockIndex: -1
      }))
      highlightBlock(null)
    }
    
    speechRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [generateSpeechText, getPauseDuration, highlightBlock, isMuted, settings, availableVoices])

  // Start or resume reading
  const toggleSpeech = useCallback(() => {
    if (!('speechSynthesis' in window)) {
      alert('Sorry, your browser does not support text-to-speech.')
      return
    }

    if (isPlaying) {
      // Pause - use cancel instead of pause to avoid interruption errors
      stopSpeech()
      setReadingState(prev => ({ ...prev, isPaused: true }))
    } else {
      if (readingState.isPaused && readingState.currentBlockIndex > -1) {
        // Resume from where we left off
        const currentBlock = blocksRef.current[readingState.currentBlockIndex]
        if (currentBlock) {
          setIsPlaying(true)
          speakBlock(currentBlock, readingState.currentBlockIndex)
          setReadingState(prev => ({ ...prev, isPlaying: true, isPaused: false }))
        }
      } else {
        // Start from beginning
        if (blocksRef.current.length > 0) {
          setIsPlaying(true)
          speakBlock(blocksRef.current[0], 0)
          setReadingState(prev => ({
            ...prev,
            isPlaying: true,
            isPaused: false,
            currentBlockIndex: 0
          }))
        }
      }
    }
  }, [isPlaying, readingState.isPaused, readingState.currentBlockIndex, speakBlock, stopSpeech])

  // Restart reading
  const restartSpeech = useCallback(() => {
    stopSpeech()
    setTimeout(() => {
      if (blocksRef.current.length > 0) {
        speakBlock(blocksRef.current[0], 0)
        setIsPlaying(true)
        setReadingState(prev => ({
          ...prev,
          isPlaying: true,
          isPaused: false,
          currentBlockIndex: 0
        }))
      }
    }, 100)
  }, [speakBlock, stopSpeech])

  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted)
    if (speechRef.current) {
      speechRef.current.volume = !isMuted ? 0 : settings.volume
    }
  }, [isMuted, settings.volume])

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<ReadingSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }, [])

  // Cleanup
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      highlightBlock(null)
    }
  }, [highlightBlock])

  // Don't render on server side
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSpeech}
          className="flex items-center gap-2 text-xs font-medium"
          aria-label={isPlaying ? "Pause reading" : "Listen to article"}
        >
          {isPlaying ? (
            <Pause className="h-3 w-3" />
          ) : (
            <Play className="h-3 w-3" />
          )}
          <span className="hidden sm:inline">
            {isPlaying ? "Pause" : "Listen"}
          </span>
        </Button>

        {/* Additional Controls */}
        {(isPlaying || readingState.currentBlockIndex > -1) && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={stopSpeech}
              className="text-xs"
              aria-label="Stop reading"
            >
              <Square className="h-3 w-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={restartSpeech}
              className="text-xs"
              aria-label="Restart reading"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="text-xs"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
            </Button>
          </>
        )}

        {/* Settings Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
          className="text-xs"
          aria-label="Reading settings"
        >
          <Settings className="h-3 w-3" />
        </Button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 space-y-3 border border-slate-200 dark:border-slate-700">
          <h4 className="font-medium text-sm">Reading Settings</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">Speed</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={settings.rate}
                onChange={(e) => updateSettings({ rate: parseFloat(e.target.value) })}
                className="w-full"
              />
              <span className="text-xs text-slate-500">{settings.rate}x</span>
            </div>
            
            <div>
              <label className="block text-xs font-medium mb-1">Pitch</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={settings.pitch}
                onChange={(e) => updateSettings({ pitch: parseFloat(e.target.value) })}
                className="w-full"
              />
              <span className="text-xs text-slate-500">{settings.pitch}</span>
            </div>
            
            <div>
              <label className="block text-xs font-medium mb-1">Volume</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.volume}
                onChange={(e) => updateSettings({ volume: parseFloat(e.target.value) })}
                className="w-full"
              />
              <span className="text-xs text-slate-500">{Math.round(settings.volume * 100)}%</span>
            </div>
            
            <div>
              <label className="block text-xs font-medium mb-1">Pauses</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={settings.pauseMultiplier}
                onChange={(e) => updateSettings({ pauseMultiplier: parseFloat(e.target.value) })}
                className="w-full"
              />
              <span className="text-xs text-slate-500">{settings.pauseMultiplier}x</span>
            </div>
          </div>
          
          {availableVoices.length > 0 && (
            <div>
              <label className="block text-xs font-medium mb-1">Voice</label>
              <select
                value={settings.voiceIndex}
                onChange={(e) => updateSettings({ voiceIndex: parseInt(e.target.value) })}
                className="w-full text-xs p-2 border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-700"
              >
                {availableVoices.map((voice, index) => (
                  <option key={index} value={index}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Progress Indicator */}
      {readingState.currentBlockIndex > -1 && (
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
            <div 
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-300 reading-progress"
              style={{ width: `${readingState.progress}%` }}
            />
          </div>
          <span className="text-xs font-medium min-w-[40px]">
            {Math.round(readingState.progress)}%
          </span>
        </div>
      )}

      {/* Enhanced Reading Status */}
      {readingState.currentBlockIndex > -1 && (
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isPlaying ? "bg-green-500 animate-pulse" : 
              readingState.isPaused ? "bg-yellow-500" : "bg-red-500"
            )} />
            <span>
              {isPlaying ? "Reading..." : readingState.isPaused ? "Paused" : "Stopped"}
            </span>
          </div>
          
          {readingState.currentBlockIndex >= 0 && blocksRef.current.length > 0 && (
            <span className="font-medium">
              {readingState.currentBlockIndex + 1} of {blocksRef.current.length} sections
            </span>
          )}
        </div>
      )}
    </div>
  )
} 