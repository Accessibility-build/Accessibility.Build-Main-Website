"use client"

import { useState } from "react"
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
}

export function EmbeddableWidget({ title, description, url, stat, className }: EmbeddableWidgetProps) {
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedEmbed, setCopiedEmbed] = useState(false)

  const embedCode = `<iframe src="${url}" width="600" height="400" frameborder="0" title="${title}" style="border:1px solid #e2e8f0;border-radius:12px;"></iframe>\n<p style="font-size:12px;color:#64748b;">Source: <a href="${url}">${title}</a> by Accessibility.build</p>`

  const tweetText = stat
    ? `${stat.value} ${stat.label} - ${title}`
    : title

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(tweetText)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  }

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
    <div className={cn("border rounded-xl bg-white dark:bg-slate-900 overflow-hidden", className)}>
      <div className="px-6 py-4 border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
        <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Share2 className="h-4 w-4 text-blue-600" />
          Share & Embed
        </h3>
        {description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
        )}
      </div>

      <div className="p-6">
        <Tabs defaultValue="share">
          <TabsList className="mb-4">
            <TabsTrigger value="share" className="gap-2">
              <Link className="h-3 w-3" />
              Share
            </TabsTrigger>
            <TabsTrigger value="embed" className="gap-2">
              <Code className="h-3 w-3" />
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
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(shareUrls.linkedin, "share-linkedin", "width=600,height=400")}
                className="hover:bg-blue-50 dark:hover:bg-blue-950/30"
              >
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(url, "link")}
                className={copiedLink ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-950/30 dark:text-green-400" : ""}
              >
                {copiedLink ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copiedLink ? "Copied!" : "Copy Link"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="embed">
            <div className="space-y-3">
              <textarea
                readOnly
                value={embedCode}
                className="w-full h-32 p-3 rounded-lg border bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300 resize-none"
                aria-label="Embed code"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(embedCode, "embed")}
                className={copiedEmbed ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-950/30 dark:text-green-400" : ""}
              >
                {copiedEmbed ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copiedEmbed ? "Copied!" : "Copy Embed Code"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
