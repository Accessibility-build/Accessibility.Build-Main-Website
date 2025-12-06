'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Share2, BookmarkPlus, BookmarkCheck, Menu, X, Twitter, Linkedin, Link as LinkIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface BlogHeaderProps {
  currentUrl: string
  title: string
  description?: string
  tags: string[]
  imageUrl?: string
  showProgress?: boolean
}

export function BlogHeader({ 
  currentUrl, 
  title, 
  description, 
  tags, 
  imageUrl, 
  showProgress = true 
}: BlogHeaderProps) {
  const [readingProgress, setReadingProgress] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showMobileActions, setShowMobileActions] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.pageYOffset
      const docHeight = document.body.scrollHeight - window.innerHeight
      const scrollPercent = scrollTop / docHeight
      setReadingProgress(Math.min(scrollPercent * 100, 100))
      setIsScrolled(scrollTop > 100)
    }

    window.addEventListener('scroll', updateProgress)
    updateProgress()

    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  // Check if post is bookmarked on component mount
  useEffect(() => {
    const bookmarkedPosts = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]')
    setIsBookmarked(bookmarkedPosts.includes(currentUrl))
  }, [currentUrl])

  const handleBookmark = () => {
    try {
      const bookmarkedPosts = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]')
      
      if (isBookmarked) {
        // Remove bookmark
        const updatedBookmarks = bookmarkedPosts.filter((url: string) => url !== currentUrl)
        localStorage.setItem('bookmarkedPosts', JSON.stringify(updatedBookmarks))
        setIsBookmarked(false)
      } else {
        // Add bookmark
        const postData = {
          url: currentUrl,
          title,
          description,
          bookmarkedAt: new Date().toISOString()
        }
        const updatedBookmarks = [...bookmarkedPosts, currentUrl]
        localStorage.setItem('bookmarkedPosts', JSON.stringify(updatedBookmarks))
        localStorage.setItem(`bookmark_${currentUrl}`, JSON.stringify(postData))
        setIsBookmarked(true)
      }
    } catch (error) {
      console.error('Error managing bookmark:', error)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy URL: ", err)
    }
  }

  const shareOnTwitter = () => {
    const encodedUrl = encodeURIComponent(currentUrl)
    const encodedTitle = encodeURIComponent(title)
    const encodedTags = tags.length > 0 ? encodeURIComponent(tags.join(",")) : ""
    const url = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${encodedTags}`
    window.open(url, 'share-twitter', 'width=600,height=400,scrollbars=yes,resizable=yes')
  }

  const shareOnLinkedIn = () => {
    const encodedUrl = encodeURIComponent(currentUrl)
    const encodedTitle = encodeURIComponent(title)
    const encodedDescription = description ? encodeURIComponent(description) : ""
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`
    window.open(url, 'share-linkedin', 'width=600,height=400,scrollbars=yes,resizable=yes')
  }

  return (
    <>
      {/* Main Header */}
      <header className={cn(
        "sticky top-0 z-50 transition-all duration-300 border-b",
        isScrolled 
          ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-slate-200 dark:border-slate-800 shadow-sm" 
          : "bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-slate-100 dark:border-slate-800"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Back Button */}
            <div className="flex items-center">
              <Button 
                asChild 
                variant="ghost" 
                size="sm" 
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Link href="/blog">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Back to Blog</span>
                  <span className="sm:hidden">Back</span>
                </Link>
              </Button>
            </div>

            {/* Center: Title (when scrolled) */}
            <div className={cn(
              "flex-1 mx-4 transition-all duration-300",
              isScrolled ? "opacity-100" : "opacity-0"
            )}>
              <h1 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {title}
              </h1>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              
              {/* Desktop Actions */}
              <div className="hidden md:flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleBookmark}
                  className={cn(
                    "transition-colors",
                    isBookmarked 
                      ? "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300" 
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  )}
                  aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                >
                  {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <BookmarkPlus className="h-4 w-4" />}
                </Button>
                
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={shareOnTwitter}
                    className="text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400"
                    aria-label="Share on Twitter"
                  >
                    <Twitter className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={shareOnLinkedIn}
                    className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={copyToClipboard}
                    className={cn(
                      "transition-colors",
                      linkCopied 
                        ? "text-green-600 dark:text-green-400" 
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    )}
                    aria-label="Copy link"
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                onClick={() => setShowMobileActions(!showMobileActions)}
                aria-label="Toggle menu"
              >
                {showMobileActions ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Reading Progress Bar */}
          {showProgress && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-700">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-150 ease-out"
                style={{ width: `${readingProgress}%` }}
              />
            </div>
          )}
        </div>

        {/* Mobile Actions Dropdown */}
        {showMobileActions && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={handleBookmark}
                >
                  {isBookmarked ? <BookmarkCheck className="mr-2 h-4 w-4" /> : <BookmarkPlus className="mr-2 h-4 w-4" />}
                  {isBookmarked ? "Bookmarked" : "Save for Later"}
                </Button>
                
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={shareOnTwitter}
                    className="flex-1 justify-center"
                  >
                    <Twitter className="mr-2 h-4 w-4" />
                    Twitter
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={shareOnLinkedIn}
                    className="flex-1 justify-center"
                  >
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={copyToClipboard}
                    className={cn(
                      "flex-1 justify-center",
                      linkCopied && "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300"
                    )}
                  >
                    <LinkIcon className="mr-2 h-4 w-4" />
                    {linkCopied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
} 