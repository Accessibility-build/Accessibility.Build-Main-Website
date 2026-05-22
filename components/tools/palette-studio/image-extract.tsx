"use client"

import { useCallback, useRef, useState } from "react"
import { ImagePlus, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { extractPaletteFromImage, pickPrimaryFromExtracted, type ExtractedSwatch } from "@/lib/color/image"

interface ImageExtractProps {
  onPrimary: (hex: string) => void
  onSwatches?: (swatches: ExtractedSwatch[]) => void
}

export function ImageExtract({ onPrimary, onSwatches }: ImageExtractProps) {
  const [swatches, setSwatches] = useState<ExtractedSwatch[]>([])
  const [thumb, setThumb] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Pick an image file (PNG, JPG, WebP, AVIF).")
        return
      }
      setError(null)
      setLoading(true)
      try {
        const url = URL.createObjectURL(file)
        setThumb((prev) => {
          if (prev) URL.revokeObjectURL(prev)
          return url
        })
        const result = await extractPaletteFromImage(file, 6)
        setSwatches(result)
        onSwatches?.(result)
        if (result.length > 0) onPrimary(pickPrimaryFromExtracted(result))
      } catch (e) {
        setError("Couldn't extract colors from that image. Try a different file.")
        console.error(e)
      } finally {
        setLoading(false)
      }
    },
    [onPrimary, onSwatches]
  )

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const reset = () => {
    if (thumb) URL.revokeObjectURL(thumb)
    setThumb(null)
    setSwatches([])
    setError(null)
  }

  return (
    <div className="space-y-3">
      <div
        ref={dropRef}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`relative flex min-h-[100px] flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center transition-colors ${
          dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/30 bg-muted/30"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleFile(f)
            e.currentTarget.value = "" // allow re-selecting same file
          }}
        />
        {thumb ? (
          <div className="flex w-full items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumb} alt="Source" className="h-16 w-16 rounded-md border object-cover" />
            <div className="flex-1 text-left">
              <p className="text-xs text-muted-foreground">
                {loading ? "Extracting…" : `${swatches.length} colors found`}
              </p>
              <p className="text-xs text-muted-foreground">
                Primary set to the most vibrant match.
              </p>
            </div>
            <Button size="sm" variant="ghost" onClick={reset} aria-label="Clear image">
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <ImagePlus className="mb-1 h-6 w-6 text-muted-foreground" aria-hidden="true" />
            <p className="text-xs text-muted-foreground">
              Drop an image or{" "}
              <button
                type="button"
                className="font-semibold underline underline-offset-2 hover:text-foreground"
                onClick={() => inputRef.current?.click()}
              >
                browse
              </button>
              {" "}— logo, photo, brand asset, anything.
            </p>
          </>
        )}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/70 backdrop-blur-sm">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        )}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {swatches.length > 0 && (
        <div className="flex gap-1">
          {swatches.map((s, i) => (
            <button
              key={`${s.hex}-${i}`}
              type="button"
              className="group relative flex-1 overflow-hidden rounded-md border text-left text-[10px] font-mono shadow-sm transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: s.hex, height: 36 }}
              onClick={() => onPrimary(s.hex)}
              title={`Use ${s.hex} as primary`}
            >
              <span className="absolute bottom-0.5 left-1 text-white drop-shadow">
                {Math.round(s.share * 100)}%
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
