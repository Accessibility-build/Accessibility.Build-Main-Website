import Image from "next/image"
import { cn } from "@/lib/utils"

interface ImageWithCaptionProps {
  src: string
  alt: string
  caption?: string
  width?: number
  height?: number
  className?: string
}

export function ImageWithCaption({ src, alt, caption, width = 1200, height = 630, className }: ImageWithCaptionProps) {
  return (
    <figure className={cn("my-8", className)}>
      <div className="overflow-hidden rounded-lg border">
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          className="w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      {caption && <figcaption className="mt-2 text-center text-sm text-muted-foreground">{caption}</figcaption>}
    </figure>
  )
}
