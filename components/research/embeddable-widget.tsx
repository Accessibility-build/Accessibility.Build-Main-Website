"use client"

import { useId, useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { Share2, Code, Copy, Check, Twitter, Linkedin, Link } from "lucide-react"

interface EmbeddableWidgetProps {
  title: string
  description?: string
  url: string
  stat?: { value: string; label: string }
  className?: string
  headingLevel?: 2 | 3
  id?: string
  /** Page the iframe loads, when it differs from the shared url (such as a chromeless /embed/ widget). */
  embedUrl?: string
  /** Names what the iframe shows (its title attribute and the attribution line), when that differs from the page title. */
  embedTitle?: string
  embedHeight?: number
  /**
   * Link the brand name rather than the title in the attribution line. Use it for
   * tool widgets: Google's link spam policy names keyword-rich links in widgets.
   */
  brandedAttribution?: boolean
  /**
   * Add a listener script that sizes the iframe to the height the embedded page
   * reports (see components/embed/embed-frame.tsx), so narrow columns and zoomed
   * pages get no scrollbar inside the iframe.
   */
  autoResize?: boolean
}

export function EmbeddableWidget({
  title,
  description,
  url,
  stat,
  className,
  headingLevel = 3,
  id,
  embedUrl = url,
  embedTitle = title,
  embedHeight = 400,
  brandedAttribution = false,
  autoResize = false,
}: EmbeddableWidgetProps) {
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedEmbed, setCopiedEmbed] = useState(false)
  const embedCodeId = useId()
  const embedHintId = useId()

  const attribution = brandedAttribution
    ? `${embedTitle} by <a href="${url}">Accessibility.build</a>`
    : `Source: <a href="${url}">${embedTitle}</a> by Accessibility.build`
  // The attribution line inherits the host page's text colour, which the host
  // has already made readable on its own background; a fixed grey could fail
  // contrast on a dark or tinted page.
  const resizeScript = autoResize
    ? `\n<script>addEventListener("message",function(e){var d=e.data;if(e.origin!=="${new URL(embedUrl).origin}"||!d||d.type!=="accessibility-build:height"||typeof d.height!=="number")return;document.querySelectorAll("iframe").forEach(function(f){if(f.contentWindow===e.source)f.style.height=Math.min(Math.max(d.height,200),2000)+"px"})})</script>`
    : ""
  const embedCode = `<iframe src="${embedUrl}" width="600" height="${embedHeight}" loading="lazy" title="${embedTitle}" style="max-width:100%;border:1px solid #e2e8f0;border-radius:12px;"></iframe>\n<p style="font-size:0.875em;">${attribution}</p>${resizeScript}`

  const tweetText = stat
    ? `${stat.value} ${stat.label} - ${title}`
    : title

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(tweetText)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  }
  const Heading = headingLevel === 2 ? "h2" : "h3"

  const copyToClipboard = async (text: string, type: "link" | "embed") => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
    }
    if (type === "link") {
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    } else {
      setCopiedEmbed(true)
      setTimeout(() => setCopiedEmbed(false), 2000)
    }
  }

  return (
    <div id={id} className={cn("scroll-mt-28 overflow-hidden rounded-lg border bg-white dark:bg-slate-900", className)}>
      <div className="px-6 py-4 border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
        <Heading className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
          <Share2 className="h-4 w-4 text-blue-600" aria-hidden="true" />
          Share & Embed
        </Heading>
        {description && (
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{description}</p>
        )}
      </div>

      <div className="p-6">
        <Tabs defaultValue="share">
          <TabsList className="mb-4">
            <TabsTrigger value="share" className="gap-2">
              <Link className="h-3 w-3" aria-hidden="true" />
              Share
            </TabsTrigger>
            <TabsTrigger value="embed" className="gap-2">
              <Code className="h-3 w-3" aria-hidden="true" />
              Embed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="share">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(shareUrls.twitter, "share-twitter", "width=600,height=400")}
                className="hover:bg-blue-50 dark:hover:bg-blue-950/30"
              >
                <Twitter className="h-4 w-4 mr-2" aria-hidden="true" />
                Twitter
                <span className="sr-only"> (opens in a new window)</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(shareUrls.linkedin, "share-linkedin", "width=600,height=400")}
                className="hover:bg-blue-50 dark:hover:bg-blue-950/30"
              >
                <Linkedin className="h-4 w-4 mr-2" aria-hidden="true" />
                LinkedIn
                <span className="sr-only"> (opens in a new window)</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(url, "link")}
                className={copiedLink ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-950/30 dark:text-green-400" : ""}
              >
                {copiedLink ? <Check className="h-4 w-4 mr-2" aria-hidden="true" /> : <Copy className="h-4 w-4 mr-2" aria-hidden="true" />}
                {copiedLink ? "Copied!" : "Copy Link"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="embed">
            <div className="space-y-3">
              <div>
                <label htmlFor={embedCodeId} className="text-sm font-medium text-slate-900 dark:text-white">
                  Embed code
                </label>
                <p id={embedHintId} className="text-sm text-slate-600 dark:text-slate-400">
                  Paste this HTML where you want it to appear on your page.
                </p>
              </div>
              <textarea
                id={embedCodeId}
                readOnly
                value={embedCode}
                aria-describedby={embedHintId}
                className={cn(
                  "w-full p-3 rounded-lg border border-slate-500 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 resize-none",
                  autoResize ? "h-44" : "h-32",
                )}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(embedCode, "embed")}
                className={copiedEmbed ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-950/30 dark:text-green-400" : ""}
              >
                {copiedEmbed ? <Check className="h-4 w-4 mr-2" aria-hidden="true" /> : <Copy className="h-4 w-4 mr-2" aria-hidden="true" />}
                {copiedEmbed ? "Copied!" : "Copy Embed Code"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* A focused button's changing label is not reliably announced, so the
            copy confirmation also goes through a status message. */}
        <p role="status" className="sr-only">
          {copiedEmbed ? "Embed code copied" : copiedLink ? "Link copied" : ""}
        </p>
      </div>
    </div>
  )
}
