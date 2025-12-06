"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX, Square, RotateCcw, Settings, Headphones } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

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
    <div className="flex items-center gap-2">
      {/* Main Play/Pause Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={toggleSpeech}
        className="flex items-center gap-2 font-medium border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
        aria-label={isPlaying ? "Pause reading" : "Listen to article"}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Headphones className="h-4 w-4" />
        )}
        <span className="hidden sm:inline text-sm">
          {isPlaying ? "Pause" : "Listen"}
        </span>
      </Button>

      {/* Additional Controls - Only show when playing */}
      {(isPlaying || readingState.currentBlockIndex > -1) && (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={stopSpeech}
            className="h-8 w-8 p-0"
            aria-label="Stop reading"
          >
            <Square className="h-3.5 w-3.5" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={restartSpeech}
            className="h-8 w-8 p-0"
            aria-label="Restart reading"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="h-8 w-8 p-0"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </Button>
        </div>
      )}

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            aria-label="Reading settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Headphones className="h-5 w-5 text-blue-600" />
              Reading Settings
            </DialogTitle>
            <DialogDescription>
              Customize your listening experience with these audio settings.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Speed Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="speed" className="text-sm font-medium">
                  Reading Speed
                </Label>
                <span className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                  {settings.rate.toFixed(1)}x
                </span>
              </div>
              <Slider
                id="speed"
                min={0.5}
                max={2}
                step={0.1}
                value={[settings.rate]}
                onValueChange={(value) => updateSettings({ rate: value[0] })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Slower</span>
                <span>Faster</span>
              </div>
            </div>

            {/* Pitch Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="pitch" className="text-sm font-medium">
                  Voice Pitch
                </Label>
                <span className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                  {settings.pitch.toFixed(1)}
                </span>
              </div>
              <Slider
                id="pitch"
                min={0.5}
                max={2}
                step={0.1}
                value={[settings.pitch]}
                onValueChange={(value) => updateSettings({ pitch: value[0] })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Lower</span>
                <span>Higher</span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="volume" className="text-sm font-medium">
                  Volume
                </Label>
                <span className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                  {Math.round(settings.volume * 100)}%
                </span>
              </div>
              <Slider
                id="volume"
                min={0}
                max={1}
                step={0.1}
                value={[settings.volume]}
                onValueChange={(value) => updateSettings({ volume: value[0] })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Quiet</span>
                <span>Loud</span>
              </div>
            </div>

            {/* Pause Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="pauses" className="text-sm font-medium">
                  Pause Duration
                </Label>
                <span className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                  {settings.pauseMultiplier.toFixed(1)}x
                </span>
              </div>
              <Slider
                id="pauses"
                min={0.5}
                max={2}
                step={0.1}
                value={[settings.pauseMultiplier]}
                onValueChange={(value) => updateSettings({ pauseMultiplier: value[0] })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Shorter</span>
                <span>Longer</span>
              </div>
            </div>

            {/* Voice Selection */}
            {availableVoices.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="voice" className="text-sm font-medium">
                  Voice Selection
                </Label>
                <select
                  id="voice"
                  value={settings.voiceIndex}
                  onChange={(e) => updateSettings({ voiceIndex: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {availableVoices.map((voice, index) => (
                    <option key={index} value={index}>
                      {voice.name} {voice.lang && `(${voice.lang})`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Progress Indicator */}
            {readingState.currentBlockIndex > -1 && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Reading Progress</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {Math.round(readingState.progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${readingState.progress}%` }}
                    />
                  </div>
                  {blocksRef.current.length > 0 && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Section {readingState.currentBlockIndex + 1} of {blocksRef.current.length}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Progress Indicator - Inline */}
      {readingState.currentBlockIndex > -1 && (
        <div className="hidden md:flex items-center gap-2 min-w-[120px]">
          <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 max-w-[80px]">
            <div 
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${readingState.progress}%` }}
            />
          </div>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400 tabular-nums">
            {Math.round(readingState.progress)}%
          </span>
        </div>
      )}
    </div>
  )
}
