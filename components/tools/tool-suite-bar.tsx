"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Check, ChevronDown, ChevronRight, Copy, Grid2X2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner"
import { getToolBySlug, getToolHref, toolCatalog, toolCategories } from "@/lib/tool-catalog"
import { ToolIcon } from "@/components/tools/tool-icon"

const FAVORITES_KEY = "accessibility-build-tool-favorites"
const RECENTS_KEY = "accessibility-build-tool-recents"

function readStoredList(key: string): string[] {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || "[]")
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []
  } catch {
    return []
  }
}

export function ToolSuiteBar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const slug = pathname.split("/").filter(Boolean)[1] || ""
  const currentTool = getToolBySlug(slug)

  useEffect(() => {
    const updateFavorites = () => setFavorites(readStoredList(FAVORITES_KEY))
    const frame = window.requestAnimationFrame(updateFavorites)
    window.addEventListener("storage", updateFavorites)
    window.addEventListener("tool-preferences-change", updateFavorites)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("storage", updateFavorites)
      window.removeEventListener("tool-preferences-change", updateFavorites)
    }
  }, [])

  useEffect(() => {
    if (!currentTool) return
    const recents = readStoredList(RECENTS_KEY)
    const next = [currentTool.slug, ...recents.filter((item) => item !== currentTool.slug)].slice(0, 6)
    window.localStorage.setItem(RECENTS_KEY, JSON.stringify(next))
  }, [currentTool])

  const currentIndex = useMemo(
    () => toolCatalog.findIndex((tool) => tool.slug === currentTool?.slug),
    [currentTool]
  )
  const nextTool = currentIndex >= 0 ? toolCatalog[(currentIndex + 1) % toolCatalog.length] : null
  const isFavorite = currentTool ? favorites.includes(currentTool.slug) : false

  if (!currentTool) return null

  const toggleFavorite = () => {
    const next = isFavorite
      ? favorites.filter((item) => item !== currentTool.slug)
      : [...favorites, currentTool.slug]
    setFavorites(next)
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next))
    window.dispatchEvent(new Event("tool-preferences-change"))
    toast.success(isFavorite ? "Removed from saved tools" : "Saved to your tools")
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    toast.success("Tool link copied")
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <TooltipProvider>
      <div className="sticky top-[88px] z-30 border-y border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
        <div className="container-wide flex min-h-14 items-center gap-2 py-2">
          <Button variant="ghost" size="sm" asChild className="shrink-0">
            <Link href="/tools" aria-label="All tools">
              <Grid2X2 aria-hidden="true" />
              <span className="hidden sm:inline">All tools</span>
            </Link>
          </Button>

          <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              asChild
              aria-label={`Choose tool. Current tool: ${currentTool.title}`}
              title={`Choose tool. Current tool: ${currentTool.title}`}
            >
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="min-w-0 flex-1 justify-between sm:max-w-sm"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <ToolIcon name={currentTool.icon} className="h-4 w-4 shrink-0 text-teal-700 dark:text-teal-300" />
                  <span className="truncate">{currentTool.shortTitle}</span>
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 opacity-60" aria-hidden="true" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[min(92vw,420px)] p-0">
              <Command>
                <CommandInput placeholder="Find a tool..." />
                <CommandList className="max-h-[420px]">
                  <CommandEmpty>No matching tools.</CommandEmpty>
                  {toolCategories.map((category) => (
                    <CommandGroup key={category} heading={category}>
                      {toolCatalog
                        .filter((tool) => tool.category === category)
                        .map((tool) => (
                          <CommandItem
                            key={tool.slug}
                            value={`${tool.title} ${tool.keywords.join(" ")}`}
                            onSelect={() => {
                              setOpen(false)
                              router.push(getToolHref(tool))
                            }}
                            className="cursor-pointer gap-3 py-2.5"
                            style={{ pointerEvents: "auto" }}
                          >
                            <ToolIcon name={tool.icon} className="h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" />
                            <span className="min-w-0 flex-1 truncate">{tool.title}</span>
                            {tool.slug === currentTool.slug && <Check className="h-4 w-4 text-teal-600" aria-hidden="true" />}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <div className="ml-auto flex shrink-0 items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggleFavorite} aria-label={isFavorite ? "Remove from saved tools" : "Save tool"}>
                  <Star className={isFavorite ? "fill-amber-400 text-amber-500" : ""} aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isFavorite ? "Remove from saved tools" : "Save tool"}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={copyLink} aria-label="Copy tool link">
                  {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy tool link</TooltipContent>
            </Tooltip>

            {nextTool && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={getToolHref(nextTool)} aria-label={`Next tool: ${nextTool.title}`}>
                      <ChevronRight aria-hidden="true" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Next: {nextTool.shortTitle}</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
