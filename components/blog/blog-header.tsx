"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Share2,
  BookmarkPlus,
  BookmarkCheck,
  Menu,
  X,
  Twitter,
  Linkedin,
  Link as LinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogHeaderProps {
  currentUrl: string;
  title: string;
  description?: string;
  tags: string[];
  imageUrl?: string;
  showProgress?: boolean;
}

export function BlogHeader({
  currentUrl,
  title,
  description,
  tags,
  imageUrl,
  showProgress = true,
}: BlogHeaderProps) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const [indicatorSize, setIndicatorSize] = useState<number | null>(null);

  {
    /* Compute Floating progress bar size */
  }
  useEffect(() => {
    function computeSize() {
      const w = window.innerWidth;
      if (w <= 320) return 58;
      if (w <= 375) return 64;
      if (w <= 425) return 88;
      return 64;
    }

    const update = () => setIndicatorSize(computeSize());
    update();

    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.body.scrollHeight - window.innerHeight || 1;
      const scrollPercent = scrollTop / docHeight;
      setReadingProgress(Math.min(scrollPercent * 100, 100));
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener("scroll", updateProgress);
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  useEffect(() => {
    const bookmarkedPosts = JSON.parse(
      localStorage.getItem("bookmarkedPosts") || "[]"
    );
    setIsBookmarked(bookmarkedPosts.includes(currentUrl));
  }, [currentUrl]);

  const handleBookmark = () => {
    try {
      const bookmarkedPosts = JSON.parse(
        localStorage.getItem("bookmarkedPosts") || "[]"
      );

      if (isBookmarked) {
        const updatedBookmarks = bookmarkedPosts.filter(
          (url: string) => url !== currentUrl
        );
        localStorage.setItem(
          "bookmarkedPosts",
          JSON.stringify(updatedBookmarks)
        );
        setIsBookmarked(false);
      } else {
        const updatedBookmarks = [...bookmarkedPosts, currentUrl];
        localStorage.setItem(
          "bookmarkedPosts",
          JSON.stringify(updatedBookmarks)
        );
        localStorage.setItem(
          `bookmark_${currentUrl}`,
          JSON.stringify({
            url: currentUrl,
            title,
            description,
            bookmarkedAt: new Date().toISOString(),
          })
        );
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error("Error managing bookmark:", error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL: ", err);
    }
  };

  const shareOnTwitter = () => {
    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedTitle = encodeURIComponent(title);
    const encodedTags =
      tags.length > 0 ? encodeURIComponent(tags.join(",")) : "";
    const url = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${encodedTags}`;
    window.open(
      url,
      "share-twitter",
      "width=600,height=400,scrollbars=yes,resizable=yes"
    );
  };

  const shareOnLinkedIn = () => {
    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = description
      ? encodeURIComponent(description)
      : "";
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`;
    window.open(
      url,
      "share-linkedin",
      "width=600,height=400,scrollbars=yes,resizable=yes"
    );
  };

  return (
    <>
      {/* Main Header */}
      <div
        className="h-[12px] xs2:h-[13px] xs3:h-[14px] md:h-[18px]"
        aria-hidden="true"
      />
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300 border-b overflow-x-hidden", // <-- prevent horizontal spill
          isScrolled
            ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-slate-200 dark:border-slate-800 shadow-sm"
            : "bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-slate-100 dark:border-slate-800"
        )}
      >
        {/* guard container: overflow-hidden to keep any children from pushing outside */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
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
            <div
              className={cn(
                "flex-1 mx-4 transition-all duration-300 min-w-0",
                isScrolled ? "opacity-100" : "opacity-0"
              )}
            >
              <h1 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {title}
              </h1>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Desktop Actions */}
              <div className="hidden md:!flex items-center gap-2">
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
                  {isBookmarked ? (
                    <BookmarkCheck className="h-4 w-4" />
                  ) : (
                    <BookmarkPlus className="h-4 w-4" />
                  )}
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
                {showMobileActions ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
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
                  className="w-full justify-start flex-wrap"
                  onClick={handleBookmark}
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="mr-2 h-4 w-4" />
                  ) : (
                    <BookmarkPlus className="mr-2 h-4 w-4" />
                  )}
                  {isBookmarked ? "Bookmarked" : "Save for Later"}
                </Button>

                {/* Mobile action buttons */}
                <div className="grid grid-cols-3 gap-2 w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareOnTwitter}
                    className="w-full justify-center px-2 py-2 text-sm flex items-center gap-2 truncate
               xs:px-1 xs:py-1 xs:text-xs"
                  >
                    <Twitter className="mr-2 h-4 w-4 xs:h-3 xs:w-3 flex-shrink-0" />
                    <span className="truncate">Twitter</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareOnLinkedIn}
                    className="w-full justify-center px-2 py-2 text-sm flex items-center gap-2 truncate
               xs:px-1 xs:py-1 xs:text-xs"
                  >
                    <Linkedin className="mr-2 h-4 w-4 xs:h-3 xs:w-3 flex-shrink-0" />
                    <span className="truncate">LinkedIn</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className={cn(
                      "w-full justify-center px-2 py-2 text-sm flex items-center gap-2 truncate xs:px-1 xs:py-1 xs:text-xs",
                      linkCopied &&
                        "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300"
                    )}
                  >
                    <LinkIcon className="mr-2 h-4 w-4 xs:h-3 xs:w-3 flex-shrink-0" />
                    <span className="truncate">
                      {linkCopied ? "Copied!" : "Copy"}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
<<<<<<< Updated upstream
=======

      {/* Floating Reading Progress Indicator */}
      {showProgress && indicatorSize !== null && (
        <div
          className={cn(
            "fixed z-40 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-200 dark:border-slate-700",
            "xs:right-2 xs:top-20 " +
              "xs2:right-2 xs2:top-22 " +
              "xs3:right-4 xs3:top-20 " +
              "md:right-4 md:top-20"
          )}
          style={{
            width: `${indicatorSize}px`,
            height: `${indicatorSize}px`,
            padding: indicatorSize > 72 ? "0.4rem" : "0.25rem",
            boxSizing: "border-box",
          }}
          aria-hidden="true"
        >
          <div className="relative w-full h-full">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 36 36"
              role="img"
              aria-label={`Reading progress ${Math.round(readingProgress)} percent`}
            >
              <path
                d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeDasharray="100, 100"
                className="text-slate-200 dark:text-slate-700"
              />
              <path
                d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeDasharray={`${readingProgress}, 100`}
                className="text-blue-600"
              />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                style={{
                  fontSize: indicatorSize <= 72 ? 10 : 12,
                }}
              >
                {Math.round(readingProgress)}%
              </span>
            </div>
          </div>
        </div>
      )}
>>>>>>> Stashed changes
    </>
  );
}
