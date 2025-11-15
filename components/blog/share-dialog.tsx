"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Share2, Copy, Check, Twitter, Facebook, Linkedin, Mail } from "lucide-react"

interface ShareDialogProps {
  url: string
  title: string
  description: string
}

export function ShareDialog({ url, title, description }: ShareDialogProps) {
  const [copied, setCopied] = useState(false)
  const fullUrl = `https://accessibility.build${url}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`
  const mailShareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${fullUrl}`)}`

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" aria-label="Share this article">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this article</DialogTitle>
          <DialogDescription>Share this article with your friends and colleagues</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 mt-4">
          <div className="grid flex-1 gap-2">
            <Input value={fullUrl} readOnly className="w-full" aria-label="URL to share" />
          </div>
          <Button size="sm" onClick={handleCopy} className="px-3">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span className="sr-only">{copied ? "Copied" : "Copy"}</span>
          </Button>
        </div>
        <div className="flex flex-col space-y-4 mt-4">
          <p className="text-sm font-medium">Share via</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter">
                <Twitter className="mr-2 h-4 w-4" />
                Twitter
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
                <Facebook className="mr-2 h-4 w-4" />
                Facebook
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={linkedinShareUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
                <Linkedin className="mr-2 h-4 w-4" />
                LinkedIn
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={mailShareUrl} aria-label="Share via Email">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
