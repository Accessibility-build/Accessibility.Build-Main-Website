'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { 
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Copy,
  Eye,
  EyeOff,
  Play,
  Pause,
  Square,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Settings,
  EyeIcon,
  Volume2,
  VolumeX,
  SkipForward,
  SkipBack,
  Monitor,
  Zap,
  Timer,
  MousePointer,
  Users,
  Info
} from 'lucide-react'

interface AnimationControl {
  id: string
  name: string
  type: 'carousel' | 'ticker' | 'animation' | 'video'
  duration: number
  isPlaying: boolean
  canPause: boolean
  canStop: boolean
  canHide: boolean
  autoplay: boolean
}

export default function WCAG222ClientPage() {
  // Animation controls state
  const [animations, setAnimations] = useState<AnimationControl[]>([
    {
      id: 'carousel',
      name: 'News Carousel',
      type: 'carousel',
      duration: 5000,
      isPlaying: true,
      canPause: true,
      canStop: true,
      canHide: false,
      autoplay: true
    },
    {
      id: 'ticker',
      name: 'Stock Ticker',
      type: 'ticker',
      duration: 3000,
      isPlaying: true,
      canPause: true,
      canStop: true,
      canHide: true,
      autoplay: true
    },
    {
      id: 'animation',
      name: 'Loading Animation',
      type: 'animation',
      duration: 1000,
      isPlaying: true,
      canPause: true,
      canStop: true,
      canHide: true,
      autoplay: true
    },
    {
      id: 'video',
      name: 'Background Video',
      type: 'video',
      duration: 30000,
      isPlaying: true,
      canPause: true,
      canStop: true,
      canHide: false,
      autoplay: true
    }
  ])
  
  // User preferences
  const [userPreferences, setUserPreferences] = useState({
    reduceMotion: false,
    pauseAnimations: false,
    hideFlashing: false,
    autoplayVideos: true
  })
  
  // Demo states
  const [currentSlide, setCurrentSlide] = useState(0)
  const [tickerPosition, setTickerPosition] = useState(0)
  const [animationFrame, setAnimationFrame] = useState(0)
  const [showBadExamples, setShowBadExamples] = useState(false)
  const [motionLog, setMotionLog] = useState<string[]>([])
  
  // Code examples and screen reader
  const [copiedCode, setCopiedCode] = useState('')
  const [showScreenReader, setShowScreenReader] = useState(false)
  
  // Animation refs
  const carouselRef = useRef<NodeJS.Timeout | null>(null)
  const tickerRef = useRef<NodeJS.Timeout | null>(null)
  const animationRef = useRef<NodeJS.Timeout | null>(null)
  
  // Sample data
  const slides = [
    { title: 'Breaking News', content: 'Important announcement about accessibility' },
    { title: 'Technology Update', content: 'New features improve user experience' },
    { title: 'Community Event', content: 'Join us for accessibility awareness day' }
  ]
  
  const stockData = ['AAPL $150.25 ↑2.5%', 'MSFT $280.75 ↓1.2%', 'GOOG $2650.00 ↑0.8%']
  
  // Log motion events
  const logMotionEvent = (event: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setMotionLog(prev => [...prev.slice(-9), `${timestamp}: ${event}`])
  }
  
  // Control animation
  const controlAnimation = (id: string, action: 'pause' | 'stop' | 'hide' | 'play') => {
    setAnimations(prev => prev.map(anim => {
      if (anim.id === id) {
        let newState = { ...anim }
        
        switch (action) {
          case 'pause':
            newState.isPlaying = false
            break
          case 'play':
            newState.isPlaying = true
            break
          case 'stop':
            newState.isPlaying = false
            // Reset to beginning for some types
            if (id === 'carousel') setCurrentSlide(0)
            if (id === 'ticker') setTickerPosition(0)
            if (id === 'animation') setAnimationFrame(0)
            break
          case 'hide':
            // Hiding is handled by CSS/visibility
            newState.isPlaying = false
            break
        }
        
        logMotionEvent(`${newState.name}: ${action}`)
        return newState
      }
      return anim
    }))
  }
  
  // Apply user preferences
  const applyPreferences = (prefs: typeof userPreferences) => {
    setUserPreferences(prefs)
    
    if (prefs.reduceMotion || prefs.pauseAnimations) {
      setAnimations(prev => prev.map(anim => ({
        ...anim,
        isPlaying: false
      })))
      logMotionEvent('All animations paused due to user preference')
    }
    
    if (prefs.hideFlashing) {
      setAnimations(prev => prev.map(anim => 
        anim.type === 'animation' ? { ...anim, isPlaying: false } : anim
      ))
      logMotionEvent('Flashing content hidden due to user preference')
    }
    
    if (!prefs.autoplayVideos) {
      setAnimations(prev => prev.map(anim => 
        anim.type === 'video' ? { ...anim, isPlaying: false, autoplay: false } : anim
      ))
      logMotionEvent('Video autoplay disabled due to user preference')
    }
  }
  
  // Animation effects
  useEffect(() => {
    const carouselAnim = animations.find(a => a.id === 'carousel')
    if (carouselAnim?.isPlaying) {
      carouselRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length)
      }, carouselAnim.duration)
    } else {
      if (carouselRef.current) clearInterval(carouselRef.current)
    }
    
    return () => {
      if (carouselRef.current) clearInterval(carouselRef.current)
    }
  }, [animations])
  
  useEffect(() => {
    const tickerAnim = animations.find(a => a.id === 'ticker')
    if (tickerAnim?.isPlaying) {
      tickerRef.current = setInterval(() => {
        setTickerPosition(prev => (prev + 1) % stockData.length)
      }, tickerAnim.duration)
    } else {
      if (tickerRef.current) clearInterval(tickerRef.current)
    }
    
    return () => {
      if (tickerRef.current) clearInterval(tickerRef.current)
    }
  }, [animations])
  
  useEffect(() => {
    const loadingAnim = animations.find(a => a.id === 'animation')
    if (loadingAnim?.isPlaying) {
      animationRef.current = setInterval(() => {
        setAnimationFrame(prev => (prev + 1) % 4)
      }, loadingAnim.duration)
    } else {
      if (animationRef.current) clearInterval(animationRef.current)
    }
    
    return () => {
      if (animationRef.current) clearInterval(animationRef.current)
    }
  }, [animations])
  
  // Clear motion log
  const clearMotionLog = () => {
    setMotionLog([])
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

  const htmlExample = `<!-- Good Example: Carousel with Controls -->
<div class="carousel-container" role="region" aria-labelledby="carousel-title">
  <h3 id="carousel-title">Latest News</h3>
  
  <div class="carousel-controls">
    <button onclick="pauseCarousel()" aria-label="Pause carousel">
      <span class="icon">⏸</span> Pause
    </button>
    <button onclick="playCarousel()" aria-label="Play carousel">
      <span class="icon">▶</span> Play
    </button>
    <button onclick="stopCarousel()" aria-label="Stop carousel">
      <span class="icon">⏹</span> Stop
    </button>
  </div>
  
  <div class="carousel-content" aria-live="off" aria-atomic="true">
    <div class="slide active">
      <h4>Breaking News</h4>
      <p>Important announcement about accessibility</p>
    </div>
    <div class="slide">
      <h4>Technology Update</h4>
      <p>New features improve user experience</p>
    </div>
  </div>
  
  <div class="carousel-indicators">
    <button onclick="goToSlide(0)" aria-label="Go to slide 1">1</button>
    <button onclick="goToSlide(1)" aria-label="Go to slide 2">2</button>
  </div>
</div>

<!-- Good Example: Ticker with Controls -->
<div class="ticker-container">
  <div class="ticker-controls">
    <button onclick="pauseTicker()">Pause Updates</button>
    <button onclick="hideTicker()">Hide Ticker</button>
  </div>
  
  <div class="ticker-content" aria-live="polite">
    <span class="ticker-item">AAPL $150.25 ↑2.5%</span>
  </div>
</div>

<!-- Good Example: Video with Controls -->
<video controls preload="metadata" class="background-video">
  <source src="background.mp4" type="video/mp4">
  <track kind="captions" src="captions.vtt" srclang="en" label="English">
  <p>Your browser doesn't support HTML5 video. 
     <a href="background.mp4">Download the video</a>.</p>
</video>

<!-- User Preferences -->
<div class="motion-preferences">
  <h3>Motion Preferences</h3>
  <label>
    <input type="checkbox" onchange="setReduceMotion(this.checked)">
    Reduce motion and animations
  </label>
  <label>
    <input type="checkbox" onchange="setPauseAnimations(this.checked)">
    Pause auto-playing content
  </label>
  <label>
    <input type="checkbox" onchange="setHideFlashing(this.checked)">
    Hide flashing and blinking content
  </label>
</div>

<!-- Bad Example: No Controls -->
<div class="bad-carousel">
  <div class="auto-slide">
    <!-- Content that moves automatically with no way to stop -->
    <p>This content moves automatically and cannot be controlled</p>
  </div>
</div>

<script>
// Good implementation with user controls
class AccessibleCarousel {
  constructor(element, options = {}) {
    this.element = element;
    this.slides = element.querySelectorAll('.slide');
    this.currentSlide = 0;
    this.isPlaying = options.autoplay !== false;
    this.interval = options.interval || 5000;
    this.timer = null;
    
    this.init();
  }
  
  init() {
    this.createControls();
    this.setupEventListeners();
    this.setupKeyboardNavigation();
    
    if (this.isPlaying) {
      this.play();
    }
  }
  
  createControls() {
    const controls = document.createElement('div');
    controls.className = 'carousel-controls';
    controls.innerHTML = \`
      <button class="play-pause-btn" aria-label="Pause carousel">
        <span class="icon">⏸</span> Pause
      </button>
      <button class="stop-btn" aria-label="Stop carousel">
        <span class="icon">⏹</span> Stop
      </button>
      <button class="prev-btn" aria-label="Previous slide">
        <span class="icon">←</span> Previous
      </button>
      <button class="next-btn" aria-label="Next slide">
        <span class="icon">→</span> Next
      </button>
    \`;
    
    this.element.insertBefore(controls, this.element.firstChild);
  }
  
  play() {
    this.isPlaying = true;
    this.timer = setInterval(() => {
      this.nextSlide();
    }, this.interval);
    
    this.updatePlayButton();
    this.announceToScreenReader('Carousel playing');
  }
  
  pause() {
    this.isPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    
    this.updatePlayButton();
    this.announceToScreenReader('Carousel paused');
  }
  
  stop() {
    this.pause();
    this.goToSlide(0);
    this.announceToScreenReader('Carousel stopped');
  }
  
  nextSlide() {
    this.goToSlide((this.currentSlide + 1) % this.slides.length);
  }
  
  prevSlide() {
    this.goToSlide((this.currentSlide - 1 + this.slides.length) % this.slides.length);
  }
  
  goToSlide(index) {
    this.slides[this.currentSlide].classList.remove('active');
    this.currentSlide = index;
    this.slides[this.currentSlide].classList.add('active');
    
    // Update live region
    const liveRegion = this.element.querySelector('[aria-live]');
    if (liveRegion) {
      liveRegion.textContent = this.slides[this.currentSlide].textContent;
    }
  }
  
  updatePlayButton() {
    const playBtn = this.element.querySelector('.play-pause-btn');
    if (this.isPlaying) {
      playBtn.innerHTML = '<span class="icon">⏸</span> Pause';
      playBtn.setAttribute('aria-label', 'Pause carousel');
    } else {
      playBtn.innerHTML = '<span class="icon">▶</span> Play';
      playBtn.setAttribute('aria-label', 'Play carousel');
    }
  }
  
  setupEventListeners() {
    this.element.addEventListener('click', (e) => {
      if (e.target.matches('.play-pause-btn')) {
        this.isPlaying ? this.pause() : this.play();
      } else if (e.target.matches('.stop-btn')) {
        this.stop();
      } else if (e.target.matches('.prev-btn')) {
        this.prevSlide();
      } else if (e.target.matches('.next-btn')) {
        this.nextSlide();
      }
    });
    
    // Pause on hover (optional)
    this.element.addEventListener('mouseenter', () => {
      if (this.isPlaying) {
        this.pause();
      }
    });
    
    this.element.addEventListener('mouseleave', () => {
      if (!this.isPlaying) {
        this.play();
      }
    });
  }
  
  setupKeyboardNavigation() {
    this.element.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.prevSlide();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.nextSlide();
          break;
        case ' ':
          e.preventDefault();
          this.isPlaying ? this.pause() : this.play();
          break;
        case 'Home':
          e.preventDefault();
          this.goToSlide(0);
          break;
        case 'End':
          e.preventDefault();
          this.goToSlide(this.slides.length - 1);
          break;
      }
    });
  }
  
  announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  }
}

// Respect user preferences
const respectMotionPreferences = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    // Pause all animations
    document.querySelectorAll('.carousel').forEach(carousel => {
      const instance = carousel.carouselInstance;
      if (instance) {
        instance.pause();
      }
    });
    
    // Disable CSS animations
    document.body.classList.add('reduce-motion');
  }
};

// Initialize carousels
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.carousel-container').forEach(carousel => {
    carousel.carouselInstance = new AccessibleCarousel(carousel);
  });
  
  respectMotionPreferences();
});
</script>`

  const cssExample = `/* Accessible carousel styling */
.carousel-container {
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  background: white;
}

.carousel-controls {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.carousel-controls button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.carousel-controls button:hover {
  background: #f0f0f0;
  border-color: #0066cc;
}

.carousel-controls button:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

.carousel-content {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 2rem;
  opacity: 0;
  transform: translateX(100%);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.slide.active {
  opacity: 1;
  transform: translateX(0);
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #f5f5f5;
}

.carousel-indicators button {
  width: 2rem;
  height: 2rem;
  border: 1px solid #ccc;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.875rem;
}

.carousel-indicators button.active {
  background: #0066cc;
  color: white;
  border-color: #0066cc;
}

/* Ticker styling */
.ticker-container {
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  background: #1a1a1a;
  color: white;
}

.ticker-controls {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #333;
}

.ticker-controls button {
  padding: 0.25rem 0.5rem;
  border: 1px solid #666;
  background: #555;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
}

.ticker-controls button:hover {
  background: #666;
}

.ticker-content {
  padding: 1rem;
  font-family: monospace;
  white-space: nowrap;
  overflow: hidden;
}

.ticker-item {
  display: inline-block;
  animation: scroll-left 15s linear infinite;
}

@keyframes scroll-left {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}

/* Animation controls */
.loading-animation {
  display: flex;
  gap: 0.25rem;
  padding: 1rem;
  justify-content: center;
}

.loading-dot {
  width: 0.5rem;
  height: 0.5rem;
  background: #0066cc;
  border-radius: 50%;
  animation: pulse 1s ease-in-out infinite;
}

.loading-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes pulse {
  0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
  40% { opacity: 1; transform: scale(1); }
}

/* Video controls */
.background-video {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.video-controls {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

/* Motion preferences */
.motion-preferences {
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
  margin: 1rem 0;
}

.motion-preferences h3 {
  margin-top: 0;
  color: #333;
}

.motion-preferences label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
}

.motion-preferences input[type="checkbox"] {
  margin: 0;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .slide {
    transition: none;
  }
  
  .ticker-item {
    animation: none;
  }
  
  .loading-dot {
    animation: none;
    opacity: 0.7;
  }
  
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

.reduce-motion * {
  animation: none !important;
  transition: none !important;
}

/* Focus indicators */
.carousel-container:focus-within {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* Bad example styling */
.bad-carousel {
  background: #ffebee;
  border: 2px solid #f44336;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
}

.auto-slide {
  animation: auto-scroll 3s ease-in-out infinite;
  color: #d32f2f;
  font-weight: bold;
  text-align: center;
}

@keyframes auto-scroll {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(20px); }
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

/* High contrast mode support */
@media (prefers-contrast: high) {
  .carousel-controls button {
    border: 2px solid;
  }
  
  .carousel-indicators button {
    border: 2px solid;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .carousel-controls {
    flex-wrap: wrap;
    gap: 0.25rem;
  }
  
  .carousel-controls button {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }
  
  .slide {
    padding: 1rem;
  }
}`

  const reactExample = `import React, { useState, useEffect, useRef } from 'react'

// Hook for managing auto-playing content
const useAutoPlayControl = (autoplay = true, interval = 5000) => {
  const [isPlaying, setIsPlaying] = useState(autoplay)
  const [currentIndex, setCurrentIndex] = useState(0)
  const timerRef = useRef(null)
  
  const play = () => {
    setIsPlaying(true)
  }
  
  const pause = () => {
    setIsPlaying(false)
  }
  
  const stop = () => {
    setIsPlaying(false)
    setCurrentIndex(0)
  }
  
  const next = (maxIndex) => {
    setCurrentIndex(prev => (prev + 1) % maxIndex)
  }
  
  const previous = (maxIndex) => {
    setCurrentIndex(prev => (prev - 1 + maxIndex) % maxIndex)
  }
  
  const goTo = (index) => {
    setCurrentIndex(index)
  }
  
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentIndex(prev => prev + 1)
      }, interval)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isPlaying, interval])
  
  return {
    isPlaying,
    currentIndex,
    play,
    pause,
    stop,
    next,
    previous,
    goTo
  }
}

// Accessible carousel component
const AccessibleCarousel = ({ 
  slides, 
  autoplay = true, 
  interval = 5000,
  showControls = true,
  showIndicators = true 
}) => {
  const { 
    isPlaying, 
    currentIndex, 
    play, 
    pause, 
    stop, 
    next, 
    previous, 
    goTo 
  } = useAutoPlayControl(autoplay, interval)
  
  const [announcement, setAnnouncement] = useState('')
  
  const handleNext = () => {
    next(slides.length)
    setAnnouncement(\`Slide \${(currentIndex + 1) % slides.length + 1} of \${slides.length}\`)
  }
  
  const handlePrevious = () => {
    previous(slides.length)
    setAnnouncement(\`Slide \${(currentIndex - 1 + slides.length) % slides.length + 1} of \${slides.length}\`)
  }
  
  const handlePlay = () => {
    play()
    setAnnouncement('Carousel playing')
  }
  
  const handlePause = () => {
    pause()
    setAnnouncement('Carousel paused')
  }
  
  const handleStop = () => {
    stop()
    setAnnouncement('Carousel stopped, returned to first slide')
  }
  
  const handleGoTo = (index) => {
    goTo(index)
    setAnnouncement(\`Slide \${index + 1} of \${slides.length}\`)
  }
  
  const handleKeyDown = (event) => {
    switch(event.key) {
      case 'ArrowLeft':
        event.preventDefault()
        handlePrevious()
        break
      case 'ArrowRight':
        event.preventDefault()
        handleNext()
        break
      case ' ':
        event.preventDefault()
        isPlaying ? handlePause() : handlePlay()
        break
      case 'Home':
        event.preventDefault()
        handleGoTo(0)
        break
      case 'End':
        event.preventDefault()
        handleGoTo(slides.length - 1)
        break
    }
  }
  
  // Respect user motion preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    if (mediaQuery.matches) {
      pause()
    }
    
    const handleChange = () => {
      if (mediaQuery.matches) {
        pause()
      }
    }
    
    mediaQuery.addListener(handleChange)
    return () => mediaQuery.removeListener(handleChange)
  }, [])
  
  // Keep index in bounds
  const safeIndex = currentIndex % slides.length
  
  return (
    <div 
      className="carousel-container"
      role="region"
      aria-label="Image carousel"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {showControls && (
        <div className="carousel-controls">
          <button 
            onClick={isPlaying ? handlePause : handlePlay}
            aria-label={isPlaying ? 'Pause carousel' : 'Play carousel'}
          >
            {isPlaying ? '⏸️' : '▶️'} {isPlaying ? 'Pause' : 'Play'}
          </button>
          
          <button onClick={handleStop} aria-label="Stop carousel">
            ⏹️ Stop
          </button>
          
          <button onClick={handlePrevious} aria-label="Previous slide">
            ⬅️ Previous
          </button>
          
          <button onClick={handleNext} aria-label="Next slide">
            ➡️ Next
          </button>
        </div>
      )}
      
      <div className="carousel-content">
        <div 
          className="slide active"
          role="img"
          aria-label={\`Slide \${safeIndex + 1} of \${slides.length}\`}
        >
          <h3>{slides[safeIndex].title}</h3>
          <p>{slides[safeIndex].content}</p>
        </div>
      </div>
      
      {showIndicators && (
        <div className="carousel-indicators" role="tablist">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleGoTo(index)}
              aria-label={\`Go to slide \${index + 1}\`}
              aria-selected={index === safeIndex}
              role="tab"
              className={index === safeIndex ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
      
      {/* Screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
    </div>
  )
}

// Stock ticker component
const AccessibleTicker = ({ items, interval = 3000 }) => {
  const { isPlaying, currentIndex, play, pause, stop } = useAutoPlayControl(true, interval)
  const [isHidden, setIsHidden] = useState(false)
  
  const handleHide = () => {
    setIsHidden(true)
    pause()
  }
  
  const handleShow = () => {
    setIsHidden(false)
    play()
  }
  
  if (isHidden) {
    return (
      <div className="ticker-container hidden">
        <div className="ticker-controls">
          <button onClick={handleShow}>Show Ticker</button>
        </div>
        <div className="ticker-content">
          <p>Ticker hidden by user</p>
        </div>
      </div>
    )
  }
  
  const safeIndex = currentIndex % items.length
  
  return (
    <div className="ticker-container">
      <div className="ticker-controls">
        <button onClick={isPlaying ? pause : play}>
          {isPlaying ? 'Pause' : 'Play'} Updates
        </button>
        <button onClick={stop}>Stop Updates</button>
        <button onClick={handleHide}>Hide Ticker</button>
      </div>
      
      <div className="ticker-content" aria-live="polite">
        <span className="ticker-item">
          {items[safeIndex]}
        </span>
      </div>
    </div>
  )
}

// Loading animation component
const AccessibleLoadingAnimation = ({ size = 'medium' }) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isAnimating, setIsAnimating] = useState(true)
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    if (mediaQuery.matches) {
      setIsAnimating(false)
    }
    
    const handleChange = () => {
      setIsAnimating(!mediaQuery.matches)
    }
    
    mediaQuery.addListener(handleChange)
    return () => mediaQuery.removeListener(handleChange)
  }, [])
  
  if (!isVisible) {
    return null
  }
  
  return (
    <div className="loading-container">
      <div className="loading-controls">
        <button onClick={() => setIsAnimating(!isAnimating)}>
          {isAnimating ? 'Pause' : 'Resume'} Animation
        </button>
        <button onClick={() => setIsVisible(false)}>
          Hide Animation
        </button>
      </div>
      
      <div 
        className={\`loading-animation \${size} \${isAnimating ? 'animating' : 'static'}\`}
        role="status"
        aria-label="Loading"
      >
        <div className="loading-dot" />
        <div className="loading-dot" />
        <div className="loading-dot" />
      </div>
    </div>
  )
}

// Motion preferences component
const MotionPreferences = ({ onChange }) => {
  const [preferences, setPreferences] = useState({
    reduceMotion: false,
    pauseAnimations: false,
    hideFlashing: false,
    autoplayVideos: true
  })
  
  const handlePreferenceChange = (key, value) => {
    const newPreferences = { ...preferences, [key]: value }
    setPreferences(newPreferences)
    onChange(newPreferences)
  }
  
  return (
    <div className="motion-preferences">
      <h3>Motion and Animation Preferences</h3>
      
      <label>
        <input 
          type="checkbox"
          checked={preferences.reduceMotion}
          onChange={(e) => handlePreferenceChange('reduceMotion', e.target.checked)}
        />
        Reduce motion and animations
      </label>
      
      <label>
        <input 
          type="checkbox"
          checked={preferences.pauseAnimations}
          onChange={(e) => handlePreferenceChange('pauseAnimations', e.target.checked)}
        />
        Pause auto-playing content
      </label>
      
      <label>
        <input 
          type="checkbox"
          checked={preferences.hideFlashing}
          onChange={(e) => handlePreferenceChange('hideFlashing', e.target.checked)}
        />
        Hide flashing and blinking content
      </label>
      
      <label>
        <input 
          type="checkbox"
          checked={preferences.autoplayVideos}
          onChange={(e) => handlePreferenceChange('autoplayVideos', e.target.checked)}
        />
        Allow video autoplay
      </label>
    </div>
  )
}

// Main demo component
const PauseStopHideDemo = () => {
  const [motionPreferences, setMotionPreferences] = useState({
    reduceMotion: false,
    pauseAnimations: false,
    hideFlashing: false,
    autoplayVideos: true
  })
  
  const slides = [
    { title: 'Breaking News', content: 'Important announcement about accessibility' },
    { title: 'Technology Update', content: 'New features improve user experience' },
    { title: 'Community Event', content: 'Join us for accessibility awareness day' }
  ]
  
  const stockData = [
    'AAPL $150.25 ↑2.5%',
    'MSFT $280.75 ↓1.2%', 
    'GOOG $2650.00 ↑0.8%',
    'AMZN $3200.50 ↑1.5%'
  ]
  
  return (
    <div className="pause-stop-hide-demo">
      <header>
        <h1>WCAG 2.2.2 Pause, Stop, Hide Demo</h1>
        <p>
          This demonstrates how to provide users with control over 
          auto-playing, moving, and blinking content.
        </p>
      </header>
      
      <main>
        <MotionPreferences onChange={setMotionPreferences} />
        
        <section>
          <h2>News Carousel</h2>
          <AccessibleCarousel 
            slides={slides}
            autoplay={!motionPreferences.pauseAnimations}
          />
        </section>
        
        <section>
          <h2>Stock Ticker</h2>
          <AccessibleTicker 
            items={stockData}
            autoplay={!motionPreferences.pauseAnimations}
          />
        </section>
        
        <section>
          <h2>Loading Animation</h2>
          <AccessibleLoadingAnimation />
        </section>
      </main>
    </div>
  )
}

export default PauseStopHideDemo`

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-purple-100 text-purple-800 border-purple-200">
            WCAG 2.2 Level A
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            2.2.2 Pause, Stop, Hide
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            For moving, blinking, scrolling or auto-updating information that lasts more than five seconds, users must be able to pause, stop, or hide it.
          </p>
        </div>

        {/* Screen Reader Toggle */}
        <div className="mb-6 text-center">
          <Button
            onClick={() => setShowScreenReader(!showScreenReader)}
            variant="outline"
            className="border-purple-200 text-purple-700 hover:bg-purple-50"
          >
            {showScreenReader ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
            {showScreenReader ? 'Disable' : 'Enable'} Screen Reader Simulation
          </Button>
        </div>

        {/* Interactive Motion Controls */}
        <Card className="mb-8 border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-violet-500 text-white">
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Interactive Motion Controls
            </CardTitle>
            <CardDescription className="text-purple-100">
              Experience different types of auto-playing content with user controls
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Controls Panel */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">User Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="reduce-motion">Reduce Motion</Label>
                      <Switch
                        id="reduce-motion"
                        checked={userPreferences.reduceMotion}
                        onCheckedChange={(checked) => applyPreferences({
                          ...userPreferences,
                          reduceMotion: checked
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pause-animations">Pause Animations</Label>
                      <Switch
                        id="pause-animations"
                        checked={userPreferences.pauseAnimations}
                        onCheckedChange={(checked) => applyPreferences({
                          ...userPreferences,
                          pauseAnimations: checked
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="hide-flashing">Hide Flashing</Label>
                      <Switch
                        id="hide-flashing"
                        checked={userPreferences.hideFlashing}
                        onCheckedChange={(checked) => applyPreferences({
                          ...userPreferences,
                          hideFlashing: checked
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="autoplay-videos">Autoplay Videos</Label>
                      <Switch
                        id="autoplay-videos"
                        checked={userPreferences.autoplayVideos}
                        onCheckedChange={(checked) => applyPreferences({
                          ...userPreferences,
                          autoplayVideos: checked
                        })}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-3">Animation Controls</h3>
                  <div className="space-y-3">
                    {animations.map((anim) => (
                      <div key={anim.id} className="p-3 border rounded-lg bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h5 className="font-medium">{anim.name}</h5>
                            <p className="text-sm text-gray-600">
                              {anim.type} • {anim.duration}ms interval
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {anim.isPlaying ? (
                              <Badge variant="default" className="text-xs bg-green-500">
                                Playing
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">
                                Paused
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-1">
                          {anim.canPause && (
                            <Button
                              onClick={() => controlAnimation(anim.id, anim.isPlaying ? 'pause' : 'play')}
                              size="sm"
                              variant="outline"
                              className="border-purple-200 text-purple-700 hover:bg-purple-50"
                            >
                              {anim.isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                            </Button>
                          )}
                          
                          {anim.canStop && (
                            <Button
                              onClick={() => controlAnimation(anim.id, 'stop')}
                              size="sm"
                              variant="outline"
                              className="border-purple-200 text-purple-700 hover:bg-purple-50"
                            >
                              <Square className="h-3 w-3" />
                            </Button>
                          )}
                          
                          {anim.canHide && (
                            <Button
                              onClick={() => controlAnimation(anim.id, 'hide')}
                              size="sm"
                              variant="outline"
                              className="border-purple-200 text-purple-700 hover:bg-purple-50"
                            >
                              <EyeIcon className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Demo Content */}
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border">
                  <h4 className="font-medium mb-3">News Carousel</h4>
                  <div className="relative h-32 bg-gray-100 rounded overflow-hidden">
                    <div className="absolute inset-0 p-4 flex flex-col justify-center">
                      <h5 className="font-semibold text-lg">{slides[currentSlide].title}</h5>
                      <p className="text-sm text-gray-600">{slides[currentSlide].content}</p>
                    </div>
                    {animations.find(a => a.id === 'carousel')?.isPlaying && (
                      <div className="absolute bottom-2 right-2">
                        <Badge variant="default" className="text-xs bg-blue-500">
                          Auto-advancing
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex gap-1">
                      {slides.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index === currentSlide ? 'bg-purple-500' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                        size="sm"
                        variant="outline"
                      >
                        <ChevronLeft className="h-3 w-3" />
                      </Button>
                      <Button
                        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                        size="sm"
                        variant="outline"
                      >
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-black text-green-400 rounded-lg font-mono text-sm">
                  <h4 className="font-medium mb-2 text-white">Stock Ticker</h4>
                  <div className="overflow-hidden">
                    {animations.find(a => a.id === 'ticker')?.isPlaying ? (
                      <div className="whitespace-nowrap">
                        {stockData[tickerPosition]}
                      </div>
                    ) : (
                      <div className="text-gray-500">Ticker paused</div>
                    )}
                  </div>
                </div>
                
                <div className="p-4 bg-white rounded-lg border">
                  <h4 className="font-medium mb-3">Loading Animation</h4>
                  <div className="flex justify-center">
                    {animations.find(a => a.id === 'animation')?.isPlaying ? (
                      <div className="flex gap-1">
                        {[0, 1, 2].map((dot) => (
                          <div
                            key={dot}
                            className={`w-2 h-2 bg-purple-500 rounded-full transition-opacity ${
                              animationFrame === dot ? 'opacity-100' : 'opacity-30'
                            }`}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex gap-1">
                        {[0, 1, 2].map((dot) => (
                          <div
                            key={dot}
                            className="w-2 h-2 bg-gray-400 rounded-full opacity-50"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-4 bg-white rounded-lg border">
                  <h4 className="font-medium mb-3">Background Video</h4>
                  <div className="relative h-24 bg-gray-800 rounded overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {animations.find(a => a.id === 'video')?.isPlaying ? (
                        <div className="text-white text-center">
                          <Play className="h-8 w-8 mx-auto mb-1" />
                          <div className="text-xs">Video Playing</div>
                        </div>
                      ) : (
                        <div className="text-gray-400 text-center">
                          <Pause className="h-8 w-8 mx-auto mb-1" />
                          <div className="text-xs">Video Paused</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Motion Events Log */}
        <Card className="mb-8 border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-violet-500 text-white">
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              Motion Events Log
            </CardTitle>
            <CardDescription className="text-purple-100">
              Monitor user interactions with motion controls
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Recent Events</h3>
              <Button
                onClick={clearMotionLog}
                variant="outline"
                size="sm"
                className="border-purple-200 text-purple-700"
              >
                Clear Log
              </Button>
            </div>
            
            <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-48 overflow-y-auto">
              {motionLog.length === 0 ? (
                <div className="text-gray-500">No motion events logged yet...</div>
              ) : (
                motionLog.map((event, index) => (
                  <div key={index} className="mb-1">
                    {event}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Good vs Bad Examples */}
        <Card className="mb-8 border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-violet-500 text-white">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Good vs Bad Examples
            </CardTitle>
            <CardDescription className="text-purple-100">
              Compare compliant and non-compliant auto-playing content
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
                    <strong>Compliant:</strong> These examples provide user control over motion
                  </AlertDescription>
                </Alert>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <h3 className="font-semibold mb-3">✅ Controlled Carousel</h3>
                    <div className="bg-white p-3 rounded border mb-3">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-sm">Latest News</h4>
                        <div className="flex gap-1">
                          <Button size="sm" className="h-6 w-6 p-0 bg-green-600 hover:bg-green-700">
                            <Pause className="h-3 w-3" />
                          </Button>
                          <Button size="sm" className="h-6 w-6 p-0 bg-green-600 hover:bg-green-700">
                            <Square className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600">Breaking: Accessibility update</div>
                    </div>
                    <p className="text-sm text-green-700">
                      • Pause and stop controls<br/>
                      • Manual navigation arrows<br/>
                      • Keyboard accessible<br/>
                      • Screen reader friendly
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <h3 className="font-semibold mb-3">✅ Dismissible Ticker</h3>
                    <div className="bg-black text-green-400 p-2 rounded text-xs font-mono mb-3">
                      <div className="flex justify-between items-center">
                        <span>AAPL $150.25 ↑2.5%</span>
                        <div className="flex gap-1">
                          <Button size="sm" className="h-4 w-8 p-0 text-xs bg-gray-700 hover:bg-gray-600">
                            ⏸
                          </Button>
                          <Button size="sm" className="h-4 w-8 p-0 text-xs bg-gray-700 hover:bg-gray-600">
                            ✕
                          </Button>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-green-700">
                      • Can pause updates<br/>
                      • Can hide completely<br/>
                      • Non-essential information<br/>
                      • User has full control
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <h3 className="font-semibold mb-3">✅ User-Controlled Video</h3>
                    <div className="bg-gray-800 p-3 rounded mb-3">
                      <div className="flex justify-between items-center text-white">
                        <span className="text-sm">Background Video</span>
                        <div className="flex gap-1">
                          <Button size="sm" className="h-6 w-12 p-0 text-xs bg-blue-600 hover:bg-blue-700">
                            Pause
                          </Button>
                          <Button size="sm" className="h-6 w-12 p-0 text-xs bg-blue-600 hover:bg-blue-700">
                            Mute
                          </Button>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-green-700">
                      • Standard video controls<br/>
                      • No autoplay by default<br/>
                      • Audio controls available<br/>
                      • Respects user preferences
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <h3 className="font-semibold mb-3">✅ Optional Animations</h3>
                    <div className="bg-white p-3 rounded border mb-3">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div className="w-2 h-2 bg-green-500 rounded-full opacity-50"></div>
                          <div className="w-2 h-2 bg-green-500 rounded-full opacity-25"></div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Loading animation</div>
                    </div>
                    <p className="text-sm text-green-700">
                      • Respects motion preferences<br/>
                      • Can be disabled<br/>
                      • Provides feedback alternative<br/>
                      • Accessible to all users
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="bad" className="space-y-4">
                <Alert className="border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Non-compliant:</strong> These examples violate WCAG 2.2.2
                  </AlertDescription>
                </Alert>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                    <h3 className="font-semibold mb-3">❌ Uncontrolled Carousel</h3>
                    <div className="bg-white p-3 rounded border mb-3">
                      <div className="text-sm font-medium mb-1">Auto-rotating News</div>
                      <div className="text-xs text-gray-600">
                        Changes every 3 seconds...
                      </div>
                      <div className="text-xs text-red-600 mt-1">
                        No controls available
                      </div>
                    </div>
                    <p className="text-sm text-red-700">
                      • No pause or stop controls<br/>
                      • Moves too quickly<br/>
                      • Can't control timing<br/>
                      • Distracts from other content
                    </p>
                  </div>
                  
                  <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                    <h3 className="font-semibold mb-3">❌ Persistent Blinking</h3>
                    <div className="bg-black p-3 rounded mb-3">
                      <div className="text-red-400 font-mono text-sm">
                        <span className="animate-pulse">🔴 URGENT ALERT</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Blinks continuously
                      </div>
                    </div>
                    <p className="text-sm text-red-700">
                      • Continuous blinking<br/>
                      • No way to stop<br/>
                      • Seizure risk<br/>
                      • Highly distracting
                    </p>
                  </div>
                  
                  <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                    <h3 className="font-semibold mb-3">❌ Forced Autoplay</h3>
                    <div className="bg-gray-800 p-3 rounded mb-3">
                      <div className="text-white text-sm">
                        Auto-playing video with sound
                      </div>
                      <div className="text-xs text-red-400 mt-1">
                        Cannot pause or mute
                      </div>
                    </div>
                    <p className="text-sm text-red-700">
                      • Starts automatically<br/>
                      • No user controls<br/>
                      • Plays with sound<br/>
                      • Poor user experience
                    </p>
                  </div>
                  
                  <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                    <h3 className="font-semibold mb-3">❌ Excessive Motion</h3>
                    <div className="bg-white p-3 rounded border mb-3 overflow-hidden">
                      <div className="animate-bounce text-sm">
                        🎯 Moving target content
                      </div>
                      <div className="text-xs text-red-600 mt-1">
                        Constantly moving
                      </div>
                    </div>
                    <p className="text-sm text-red-700">
                      • Continuous movement<br/>
                      • Makes content hard to read<br/>
                      • No option to stop<br/>
                      • Vestibular disorder trigger
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Implementation Examples */}
        <Card className="mb-8 border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-violet-500 text-white">
            <CardTitle>Implementation Examples</CardTitle>
            <CardDescription className="text-purple-100">
              Copy-paste code examples for accessible motion controls
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
        <Card className="mb-8 border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-violet-500 text-white">
            <CardTitle>Testing Methods</CardTitle>
            <CardDescription className="text-purple-100">
              How to test for WCAG 2.2.2 compliance
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
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Manual Test Steps</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                      <li>Identify all moving, blinking, or auto-updating content</li>
                      <li>Time how long each element moves or updates</li>
                      <li>Look for pause, stop, or hide controls</li>
                      <li>Test all controls for functionality</li>
                      <li>Verify keyboard accessibility of controls</li>
                      <li>Check if content respects motion preferences</li>
                      <li>Test with screen readers for announcements</li>
                      <li>Verify essential vs non-essential content distinction</li>
                    </ol>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Key Test Areas</h4>
                    <ul className="text-blue-800 space-y-1 text-sm">
                      <li>• <strong>Carousels:</strong> Image sliders, content rotators, testimonials</li>
                      <li>• <strong>Tickers:</strong> News feeds, stock prices, social media feeds</li>
                      <li>• <strong>Animations:</strong> Loading indicators, progress bars, transitions</li>
                      <li>• <strong>Videos:</strong> Background videos, auto-playing media</li>
                      <li>• <strong>Live Updates:</strong> Chat messages, notifications, status updates</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="automated" className="space-y-4">
                <div className="space-y-4">
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Automated Testing Tools</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li><strong>Custom Scripts:</strong> Monitor motion and provide control detection</li>
                      <li><strong>Motion Analysis:</strong> Detect moving elements and timing</li>
                      <li><strong>Control Verification:</strong> Test pause/stop/hide functionality</li>
                      <li><strong>Preference Detection:</strong> Check for motion preference support</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">JavaScript Testing Example:</h4>
                    <pre className="bg-gray-900 text-gray-100 p-3 rounded text-sm overflow-x-auto">
                      <code>{`// Test for motion controls
const motionTester = {
  // Detect auto-playing content
  detectAutoPlayingContent: () => {
    const motionElements = []
    
    // Check for CSS animations
    const animatedElements = document.querySelectorAll('*')
    animatedElements.forEach(element => {
      const styles = window.getComputedStyle(element)
      const animation = styles.animation
      const transition = styles.transition
      
      if (animation !== 'none' || transition !== 'all 0s ease 0s') {
        motionElements.push({
          element: element,
          type: 'css-animation',
          animation: animation,
          transition: transition
        })
      }
    })
    
    // Check for JavaScript timers
    const originalSetInterval = window.setInterval
    const originalSetTimeout = window.setTimeout
    
    window.setInterval = function(callback, delay) {
      if (delay <= 5000) { // Motion that changes within 5 seconds
        motionElements.push({
          type: 'interval',
          delay: delay,
          callback: callback.toString()
        })
      }
      return originalSetInterval.apply(this, arguments)
    }
    
    return motionElements
  },
  
  // Test for user controls
  testMotionControls: () => {
    const controls = {
      pauseButtons: document.querySelectorAll('[aria-label*="pause"], [title*="pause"], .pause-btn'),
      stopButtons: document.querySelectorAll('[aria-label*="stop"], [title*="stop"], .stop-btn'),
      hideButtons: document.querySelectorAll('[aria-label*="hide"], [title*="hide"], .hide-btn'),
      playButtons: document.querySelectorAll('[aria-label*="play"], [title*="play"], .play-btn')
    }
    
    return {
      hasPauseControl: controls.pauseButtons.length > 0,
      hasStopControl: controls.stopButtons.length > 0,
      hasHideControl: controls.hideButtons.length > 0,
      hasPlayControl: controls.playButtons.length > 0,
      totalControls: Object.values(controls).reduce((sum, buttons) => sum + buttons.length, 0)
    }
  },
  
  // Test motion preferences
  testMotionPreferences: () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const bodyClasses = document.body.className
    
    return {
      systemPreference: prefersReducedMotion,
      respectsPreference: bodyClasses.includes('reduce-motion') || 
                         bodyClasses.includes('no-motion'),
      hasPreferenceControls: document.querySelectorAll('[data-motion-preference], .motion-settings').length > 0
    }
  },
  
  // Test essential vs non-essential content
  testEssentialContent: () => {
    const essentialMotion = []
    const nonEssentialMotion = []
    
    // Look for content that might be essential
    const progressBars = document.querySelectorAll('[role="progressbar"], .progress')
    const loadingIndicators = document.querySelectorAll('.loading, .spinner')
    const statusUpdates = document.querySelectorAll('[aria-live], .status')
    
    // Look for likely non-essential content
    const carousels = document.querySelectorAll('.carousel, .slider')
    const tickers = document.querySelectorAll('.ticker, .marquee')
    const decorativeAnimations = document.querySelectorAll('.decoration, .background-animation')
    
    return {
      essentialCount: progressBars.length + loadingIndicators.length + statusUpdates.length,
      nonEssentialCount: carousels.length + tickers.length + decorativeAnimations.length,
      needsControls: nonEssentialMotion.length > 0
    }
  }
}

// Run comprehensive motion test
const runMotionTest = () => {
  const autoPlayingContent = motionTester.detectAutoPlayingContent()
  const controls = motionTester.testMotionControls()
  const preferences = motionTester.testMotionPreferences()
  const essential = motionTester.testEssentialContent()
  
  const compliance = {
    hasMovingContent: autoPlayingContent.length > 0,
    hasUserControls: controls.totalControls > 0,
    respectsPreferences: preferences.respectsPreference,
    controlsAccessible: true, // Would need additional testing
    isCompliant: function() {
      return !this.hasMovingContent || 
             (this.hasUserControls && this.respectsPreferences && this.controlsAccessible)
    }
  }
  
  return {
    autoPlayingContent,
    controls,
    preferences,
    essential,
    compliance
  }
}

// Usage
const results = runMotionTest()
console.log('WCAG 2.2.2 Test Results:', results)
console.log('Compliance:', results.compliance.isCompliant() ? 'PASS' : 'FAIL')`}</code>
                    </pre>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Key Requirements */}
        <Card className="border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-violet-500 text-white">
            <CardTitle>Key Requirements Summary</CardTitle>
            <CardDescription className="text-purple-100">
              Essential points for WCAG 2.2.2 compliance
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
                    <span>Provide pause controls for auto-playing content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Allow users to stop auto-updating information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Enable hiding of non-essential moving content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Respect prefers-reduced-motion CSS media query</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Make controls keyboard accessible</span>
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
                    <span>Create uncontrollable auto-playing content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Make essential information move or blink</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Ignore user motion preferences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Create content that flashes more than 3 times per second</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Force users to interact with moving targets</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="text-center">
              <p className="text-gray-600 mb-2">
                <strong>Remember:</strong> Moving content can be distracting, trigger vestibular disorders, 
                and make it difficult for users with cognitive disabilities to focus on important information.
              </p>
              <p className="text-sm text-gray-500">
                Always provide user control over motion and respect accessibility preferences.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 