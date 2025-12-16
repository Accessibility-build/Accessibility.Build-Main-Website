"use client";

import { Twitter, Linkedin, Link, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  tags?: string[];
  imageUrl?: string;
  showLabel?: boolean;
}

export function SocialShare({
  url,
  title,
  description,
  tags = [],
  imageUrl,
  showLabel = true,
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  // Check for native share support on client side only
  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  // Encode parameters for sharing
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = description ? encodeURIComponent(description) : "";
  const encodedTags = tags.length > 0 ? encodeURIComponent(tags.join(",")) : "";

  // Generate sharing URLs
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${encodedTags}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
  };

  // Copy URL to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL: ", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error("Fallback copy failed: ", fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const openShareDialog = (platform: keyof typeof shareUrls) => {
    const url = shareUrls[platform];
    const popup = window.open(
      url,
      `share-${platform}`,
      "width=600,height=400,scrollbars=yes,resizable=yes"
    );

    // Focus the popup
    if (popup) {
      popup.focus();
    }
  };

  // Web Share API support
  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: url,
        });
      } catch (err) {
        console.error("Native share failed: ", err);
      }
    }
  };

  return (
    <div className="space-y-3">
      {/* Unnecessary label */}
      {/* {showLabel && (
        <h3 className="text-sm font-medium text-slate-900 dark:text-white">
          Share this content
        </h3>
      )} */}

      <div
        className="flex flex-wrap gap-2 justify-start"
        suppressHydrationWarning
      >
        {/* Twitter */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => openShareDialog("twitter")}
          aria-label="Share on Twitter"
          className="hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-900/20 transition-colors"
        >
          <Twitter className="h-4 w-4 mr-2" />
          Twitter
        </Button>

        {/* LinkedIn */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => openShareDialog("linkedin")}
          aria-label="Share on LinkedIn"
          className="hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-900/20 transition-colors"
        >
          <Linkedin className="h-4 w-4 mr-2" />
          LinkedIn
        </Button>

        {/* Native share button for mobile - only show after client-side check */}
        {canNativeShare && (
          <Button
            variant="outline"
            size="sm"
            onClick={nativeShare}
            aria-label="Share using device's native share"
            className="hover:bg-slate-50 hover:border-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        )}

        {/* Copy link button */}
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          aria-label="Copy link"
          className={
            copied
              ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300"
              : "hover:bg-slate-50 hover:border-slate-200 dark:hover:bg-slate-800 transition-colors"
          }
        >
          <Link className="h-4 w-4 mr-2" />
          {copied ? "Copied!" : "Copy Link"}
        </Button>
      </div>

      {/* Schema markup for social sharing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SocialMediaPosting",
            url: url,
            headline: title,
            description: description,
            datePublished: new Date().toISOString(),
            author: {
              "@type": "Organization",
              name: "Accessibility.build",
            },
          }),
        }}
      />
    </div>
  );
}
