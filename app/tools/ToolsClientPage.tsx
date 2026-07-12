"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, Clock3, Search, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import TrialStatusBanner from "@/components/trial-status-banner"
import { ToolIcon } from "@/components/tools/tool-icon"
import {
  getToolBySlug,
  getToolHref,
  toolCatalog,
  toolCategories,
  type ToolCatalogItem,
  type ToolCategory,
} from "@/lib/tool-catalog"

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

function ToolCard({
  tool,
  isFavorite,
  onToggleFavorite,
}: {
  tool: ToolCatalogItem
  isFavorite: boolean
  onToggleFavorite: (slug: string) => void
}) {
  return (
    <article className="flex min-w-0 flex-col rounded-lg border border-slate-200 bg-white p-5 transition-colors hover:border-teal-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-700">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <ToolIcon name={tool.icon} className="h-5 w-5" />
        </span>
        <div className="flex items-center gap-1">
          {tool.popular && (
            <Badge variant="outline" className="border-teal-200 text-teal-800 dark:border-teal-800 dark:text-teal-300">
              Popular
            </Badge>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onToggleFavorite(tool.slug)}
                aria-label={isFavorite ? `Remove ${tool.title} from saved tools` : `Save ${tool.title}`}
                className="h-9 w-9"
              >
                <Star className={isFavorite ? "fill-amber-400 text-amber-500" : "text-slate-500"} aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isFavorite ? "Remove from saved tools" : "Save tool"}</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="mt-5 min-w-0 flex-1">
        <p className="text-xs font-semibold text-teal-700 dark:text-teal-300">{tool.category}</p>
        <h2 className="mt-1.5 text-lg font-semibold text-slate-950 dark:text-white">
          <Link href={getToolHref(tool)} className="rounded-sm hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:hover:text-teal-300">
            {tool.title}
          </Link>
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{tool.description}</p>

        <ul className="mt-4 space-y-1.5">
          {tool.features.slice(0, 3).map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <Check className="h-3.5 w-3.5 shrink-0 text-teal-600 dark:text-teal-400" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {tool.credits === 0 ? "Free" : `${tool.credits} ${tool.credits === 1 ? "credit" : "credits"}`}
        </span>
        <Button size="sm" variant="outline" asChild>
          <Link href={getToolHref(tool)}>
            Open
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </article>
  )
}

export default function ToolsClientPage() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<"All" | ToolCategory>("All")
  const [favorites, setFavorites] = useState<string[]>([])
  const [recents, setRecents] = useState<string[]>([])

  useEffect(() => {
    const updateStoredTools = () => {
      setFavorites(readStoredList(FAVORITES_KEY))
      setRecents(readStoredList(RECENTS_KEY))
    }
    const frame = window.requestAnimationFrame(updateStoredTools)
    window.addEventListener("storage", updateStoredTools)
    window.addEventListener("tool-preferences-change", updateStoredTools)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("storage", updateStoredTools)
      window.removeEventListener("tool-preferences-change", updateStoredTools)
    }
  }, [])

  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return toolCatalog.filter((tool) => {
      const matchesCategory = category === "All" || tool.category === category
      const searchable = `${tool.title} ${tool.description} ${tool.features.join(" ")} ${tool.keywords.join(" ")}`.toLowerCase()
      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery))
    })
  }, [category, query])

  const savedTools = favorites.map(getToolBySlug).filter((tool): tool is ToolCatalogItem => Boolean(tool))
  const recentTools = recents
    .filter((slug) => !favorites.includes(slug))
    .map(getToolBySlug)
    .filter((tool): tool is ToolCatalogItem => Boolean(tool))
    .slice(0, 5)

  const toggleFavorite = (slug: string) => {
    const next = favorites.includes(slug)
      ? favorites.filter((item) => item !== slug)
      : [...favorites, slug]
    setFavorites(next)
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next))
    window.dispatchEvent(new Event("tool-preferences-change"))
  }

  const freeCount = toolCatalog.filter((tool) => tool.credits === 0).length

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="container-wide py-10 sm:py-14">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,460px)] lg:items-end">
              <div>
                <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">Accessibility.build utilities</p>
                <h1 className="mt-2 text-4xl font-semibold text-slate-950 sm:text-5xl dark:text-white">Tools for accessibility work</h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                  Test interfaces, prepare content, build design tokens, organize findings, and handle common developer tasks in one workspace.
                </p>
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <span><strong className="text-slate-950 dark:text-white">{toolCatalog.length}</strong> tools</span>
                  <span><strong className="text-slate-950 dark:text-white">{freeCount}</strong> free utilities</span>
                  <span>Local processing where supported</span>
                </div>
              </div>

              <div>
                <label htmlFor="tool-search" className="mb-2 block text-sm font-medium text-slate-800 dark:text-slate-200">Find a tool</label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
                  <Input
                    id="tool-search"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search by task, standard, or format"
                    className="h-12 bg-white pl-10 dark:bg-slate-950"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container-wide py-8 sm:py-10">
          <TrialStatusBanner />

          {(savedTools.length > 0 || recentTools.length > 0) && (
            <section aria-labelledby="your-tools-heading" className="mt-8 border-y border-slate-200 py-6 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-slate-500" aria-hidden="true" />
                <h2 id="your-tools-heading" className="text-sm font-semibold text-slate-900 dark:text-white">Your tools</h2>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {[...savedTools, ...recentTools].map((tool) => (
                  <Button key={tool.slug} size="sm" variant="outline" asChild>
                    <Link href={getToolHref(tool)}>
                      <ToolIcon name={tool.icon} className="h-4 w-4" />
                      {tool.shortTitle}
                      {favorites.includes(tool.slug) && <Star className="fill-amber-400 text-amber-500" aria-hidden="true" />}
                    </Link>
                  </Button>
                ))}
              </div>
            </section>
          )}

          <section aria-labelledby="tool-directory-heading" className="mt-8">
            <div>
              <div>
                <h2 id="tool-directory-heading" className="text-2xl font-semibold text-slate-950 dark:text-white">Tool directory</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {filteredTools.length} {filteredTools.length === 1 ? "tool" : "tools"} shown
                </p>
              </div>
              <div className="mt-5 flex max-w-full gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter tools by category">
                {["All" as const, ...toolCategories].map((item) => (
                  <Button
                    key={item}
                    type="button"
                    size="sm"
                    variant={category === item ? "default" : "outline"}
                    onClick={() => setCategory(item)}
                    aria-pressed={category === item}
                    className="shrink-0"
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </div>

            {filteredTools.length > 0 ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredTools.map((tool) => (
                  <ToolCard
                    key={tool.slug}
                    tool={tool}
                    isFavorite={favorites.includes(tool.slug)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900">
                <Search className="mx-auto h-6 w-6 text-slate-400" aria-hidden="true" />
                <h3 className="mt-3 font-semibold text-slate-950 dark:text-white">No matching tools</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Try another search or clear the category filter.</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setQuery("")
                    setCategory("All")
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </section>
        </div>
      </div>
    </TooltipProvider>
  )
}
