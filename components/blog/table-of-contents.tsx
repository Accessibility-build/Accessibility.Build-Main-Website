"use client"

import { useState, useEffect } from 'react'
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
    // Track active heading while scrolling
    const handleScroll = () => {
      const headingElements = headings.map(h => document.getElementById(h.id)).filter(Boolean)
      
      let currentActive = ''
      for (const element of headingElements) {
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100) {
            currentActive = element.id
          }
        }
      }
      
      setActiveId(currentActive)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [headings])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (headings.length === 0) return null

  return (
    <div className={`bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden ${className}`}>
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 dark:text-white flex items-center text-sm">
            <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
            Table of Contents
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-6 w-6 p-0"
          >
            {isCollapsed ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronUp className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>

      {!isCollapsed && (
        <nav className="p-4">
          <ul className="space-y-2">
            {headings.map((heading) => (
              <li key={heading.id}>
                <button
                  onClick={() => scrollToHeading(heading.id)}
                  className={`block w-full text-left text-sm transition-all duration-200 hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1 ${
                    activeId === heading.id
                      ? 'text-blue-600 dark:text-blue-400 font-medium'
                      : heading.level === 2
                      ? 'text-slate-700 dark:text-slate-300 font-medium'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                  style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
                >
                  {heading.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  )
}
