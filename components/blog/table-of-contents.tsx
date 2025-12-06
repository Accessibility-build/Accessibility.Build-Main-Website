"use client"

import { useState, useEffect } from 'react'
import { BookOpen, ChevronDown, ChevronUp, Circle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TOCItem {
  id: string
  title: string
  level: number
}

interface TableOfContentsProps {
  content?: any
  className?: string
}

export function TableOfContents({ content, className = '' }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [readProgress, setReadProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      setIsCollapsed(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Extract headings from the page after it's rendered
    const extractHeadings = () => {
      const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      const extractedHeadings: TOCItem[] = []
      const usedIds = new Set<string>()

      headingElements.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1))
        const title = heading.textContent || ''
        
        // Create a unique ID based on title and position
        let baseId = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .substring(0, 50) // Limit length
        
        // If baseId is empty, use heading with index
        if (!baseId) {
          baseId = `heading-${index}`
        }
        
        // Ensure uniqueness by adding suffix if needed
        let uniqueId = baseId
        let counter = 1
        while (usedIds.has(uniqueId)) {
          uniqueId = `${baseId}-${counter}`
          counter++
        }
        
        usedIds.add(uniqueId)
        
        // Add ID to the heading element if it doesn't have one
        if (!heading.id) {
          heading.id = uniqueId
        }

        extractedHeadings.push({ id: uniqueId, title, level })
      })

      setHeadings(extractedHeadings)
    }

    // Wait for content to be rendered
    const timer = setTimeout(extractHeadings, 500)
    return () => clearTimeout(timer)
  }, [content])

  useEffect(() => {
    // Track active heading and reading progress while scrolling
    const handleScroll = () => {
      const headingElements = headings.map(h => document.getElementById(h.id)).filter(Boolean)
      
      let currentActive = ''
      let activeIndex = -1
      
      for (let i = 0; i < headingElements.length; i++) {
        const element = headingElements[i]
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 120) {
            currentActive = element.id
            activeIndex = i
          }
        }
      }
      
      setActiveId(currentActive)
      
      // Calculate read progress based on active section
      if (activeIndex >= 0 && headings.length > 0) {
        setReadProgress(((activeIndex + 1) / headings.length) * 100)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial call
    return () => window.removeEventListener('scroll', handleScroll)
  }, [headings])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  // Get index of a heading for progress indicator
  const getHeadingIndex = (id: string) => {
    return headings.findIndex(h => h.id === id)
  }

  const activeIndex = getHeadingIndex(activeId)

  if (headings.length === 0) return null

  return (
    <div className={cn(
      "lg:sticky lg:top-24 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200",
      className
    )}>
      {/* Header */}
      <div className={cn(
        "px-4 sm:px-5 py-3 sm:py-4 bg-gradient-to-br from-slate-50/80 to-white dark:from-slate-800/50 dark:to-slate-900",
        !isCollapsed && "border-b border-slate-100 dark:border-slate-800"
      )}>
        <div className={cn("flex items-center justify-between", !isCollapsed && "mb-3")}>
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Table of Contents
              </h3>
              {!isCollapsed && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">
                  {headings.length} sections
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex-shrink-0"
            aria-label={isCollapsed ? "Expand table of contents" : "Collapse table of contents"}
          >
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            ) : (
              <ChevronUp className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            )}
          </Button>
        </div>
        
        {/* Progress bar with percentage */}
        {!isCollapsed && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-medium">
                Reading Progress
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-bold tabular-nums">
                {Math.round(readProgress)}%
              </span>
            </div>
            <div className="relative h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 transition-all duration-500 ease-out rounded-full shadow-sm"
                style={{ width: `${readProgress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      {!isCollapsed && (
        <nav className="p-3 sm:p-4 max-h-[60vh] lg:max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar" aria-label="Table of contents">
          <ul className="space-y-1">
            {headings.map((heading, index) => {
              const isActive = activeId === heading.id
              const isPassed = activeIndex > index
              const isNext = activeIndex + 1 === index
              
              return (
                <li key={heading.id} className="relative">
                  <button
                    onClick={() => scrollToHeading(heading.id)}
                    className={cn(
                      "group relative flex items-center gap-2.5 w-full text-left py-2.5 pl-3 pr-3 rounded-lg transition-all duration-200",
                      isActive 
                        ? "bg-gradient-to-r from-blue-50 to-blue-50/50 dark:from-blue-900/30 dark:to-blue-900/10 text-blue-700 dark:text-blue-300 shadow-sm" 
                        : isNext
                          ? "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700"
                          : isPassed
                            ? "text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/30"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    )}
                    style={{ 
                      paddingLeft: `${(heading.level - 2) * 12 + 12}px`,
                      marginLeft: `${(heading.level - 2) * 8}px`
                    }}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full shadow-sm" />
                    )}

                    {/* Status icon */}
                    <span className="flex-shrink-0">
                      {isPassed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 dark:text-green-400" />
                      ) : isActive ? (
                        <Circle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 fill-current" />
                      ) : (
                        <Circle className={cn(
                          "w-3.5 h-3.5 transition-all duration-200",
                          isNext 
                            ? "text-blue-400 dark:text-blue-500" 
                            : "text-slate-300 dark:text-slate-600 group-hover:text-slate-400 dark:group-hover:text-slate-500"
                        )} />
                      )}
                    </span>
                    
                    <span className={cn(
                      "flex-1 transition-all duration-200 leading-snug min-w-0",
                      isActive && "font-semibold",
                      heading.level === 2 && !isActive && "font-medium",
                      "text-sm"
                    )}>
                      {heading.title}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgb(203 213 225);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgb(148 163 184);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgb(51 65 85);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgb(71 85 105);
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  )
}
