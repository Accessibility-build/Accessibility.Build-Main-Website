"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon, X, ArrowRight, File, Settings, Lightbulb } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

// Mock search data - in a real app, this would come from an API or search index
const searchData = [
  {
    type: "page",
    title: "Services",
    description: "Professional accessibility services we offer",
    url: "/services",
    icon: Lightbulb,
  },
  {
    type: "tool",
    title: "Contrast Checker",
    description: "Check color contrast ratios for accessibility compliance",
    url: "/tools/contrast-checker",
    icon: Settings,
  },
  {
    type: "tool",
    title: "Alt Text Generator",
    description: "Generate accessible alt text for images using AI",
    url: "/tools/alt-text-generator",
    icon: Settings,
  },
  {
    type: "blog",
    title: "Understanding WCAG 2.2",
    description: "A comprehensive guide to the latest WCAG standards",
    url: "/blog/understanding-wcag-2-2",
    icon: File,
  },
  {
    type: "blog",
    title: "Creating Accessible Forms",
    description: "Best practices for designing accessible forms",
    url: "/blog/creating-accessible-forms",
    icon: File,
  },
  {
    type: "page",
    title: "About Accessibility.build",
    description: "Learn about our mission and team",
    url: "/about",
    icon: Lightbulb,
  },
]

type SearchResult = {
  type: string
  title: string
  description: string
  url: string
  icon: any
}

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter results based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setResults([])
      return
    }

    const filtered = searchData.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setResults(filtered)
    setSelectedIndex(0)
  }, [searchQuery])

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    } else {
      setSearchQuery("")
      setResults([])
    }
  }, [open])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prevIndex) => (prevIndex + 1) % results.length)
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prevIndex) => (prevIndex - 1 + results.length) % results.length)
        break
      case "Enter":
        e.preventDefault()
        if (results[selectedIndex]) {
          navigateToResult(results[selectedIndex])
        }
        break
      case "Escape":
        e.preventDefault()
        onOpenChange(false)
        break
    }
  }

  const navigateToResult = (result: SearchResult) => {
    router.push(result.url)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-4 pt-4 pb-2 border-b">
          <div className="flex items-center gap-2">
            <SearchIcon className="h-5 w-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for tools, articles, and resources..."
              className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 pl-0"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery("")}
                className="h-6 w-6"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto p-0">
          {results.length > 0 ? (
            <div className="py-2">
              {results.map((result, index) => (
                <button
                  key={result.url}
                  className={cn(
                    "w-full text-left px-4 py-2 hover:bg-muted/50 flex items-start gap-3",
                    selectedIndex === index && "bg-muted",
                  )}
                  onClick={() => navigateToResult(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="mt-0.5 bg-primary/10 text-primary p-1.5 rounded">
                    <result.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium line-clamp-1">{result.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">{result.description}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground self-center opacity-0 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="px-4 py-8 text-center">
              <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try searching for tools, articles, or accessibility topics
              </p>
            </div>
          ) : (
            <div className="px-4 py-2">
              <div className="text-sm font-medium text-muted-foreground mb-2">Popular searches</div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="rounded-full" onClick={() => setSearchQuery("wcag")}>
                  WCAG 2.2
                </Button>
                <Button variant="outline" size="sm" className="rounded-full" onClick={() => setSearchQuery("contrast")}>
                  Contrast Checker
                </Button>
                <Button variant="outline" size="sm" className="rounded-full" onClick={() => setSearchQuery("forms")}>
                  Accessible Forms
                </Button>
                <Button variant="outline" size="sm" className="rounded-full" onClick={() => setSearchQuery("alt text")}>
                  Alt Text
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-t text-xs text-muted-foreground">
          <div className="flex gap-3 justify-center">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted border rounded text-xs">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-muted border rounded text-xs">↓</kbd> to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted border rounded text-xs">Enter</kbd> to select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted border rounded text-xs">Esc</kbd> to close
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
