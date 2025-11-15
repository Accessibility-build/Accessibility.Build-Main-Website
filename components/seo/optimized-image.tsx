"use client"

import Image from "next/image"
import { useState } from "react"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
  fill?: boolean
  sizes?: string
  loading?: "eager" | "lazy"
  quality?: number
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down"
  objectPosition?: string
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = "",
  fill = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  loading = "lazy",
  quality = 85,
  objectFit = "cover",
  objectPosition = "center",
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)

  // Generate a placeholder if the image is a placeholder URL
  const isPlaceholder = src.includes("placeholder.svg") || src.includes("placeholder.png")

  // Default placeholder for error state - using dynamic URL instead of file path
  const errorPlaceholder = `/placeholder.svg?height=${height || 300}&width=${width || 300}&query=image unavailable`

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true)
  }

  // Handle image error
  const handleError = () => {
    setError(true)
    console.error(`Failed to load image: ${src}`)
  }

  // Ensure alt text is never empty - use descriptive text or empty string for decorative images
  const safeAlt = alt.trim() === "" ? (isPlaceholder ? "Placeholder image" : "") : alt

  // Fix the src to ensure it's a valid URL path, not a file system path
  const safeSrc = error ? errorPlaceholder : src.startsWith("/") ? src : `/${src}`

  // Common props for both fill and non-fill images
  const commonProps = {
    src: safeSrc,
    alt: safeAlt,
    onLoad: handleLoad,
    onError: handleError,
    className: `transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"} ${className}`,
    loading: priority ? undefined : loading,
    priority,
    sizes,
    quality,
    style: {
      objectFit,
      objectPosition,
    },
  }

  return (
    <div className={`relative ${fill ? "h-full w-full" : ""} overflow-hidden`} aria-hidden={safeAlt === ""}>
      {/* Show a blur placeholder while loading */}
      {!isLoaded && !isPlaceholder && <div className="absolute inset-0 bg-muted animate-pulse" aria-hidden="true" />}

      {fill ? (
        <Image 
          {...commonProps} 
          fill 
          sizes={sizes}
          alt={safeAlt}
        />
      ) : (
        <Image 
          {...commonProps} 
          width={width || 800} 
          height={height || 600}
          alt={safeAlt}
        />
      )}
    </div>
  )
}
