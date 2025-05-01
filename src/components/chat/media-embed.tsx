"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface MediaEmbedProps {
  type: "image" | "video"
  url: string
  alt?: string
  className?: string
}

export function MediaEmbed({ type, url, alt = "", className }: MediaEmbedProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  return (
    <div className={cn("relative rounded-md overflow-hidden", className)}>
      {isLoading && <Skeleton className="absolute inset-0 w-full h-full" />}

      {type === "image" ? (
        <img
          src={url || "/placeholder.svg"}
          alt={alt}
          className={cn("max-w-full h-auto rounded-md", isLoading && "opacity-0", hasError && "hidden")}
          onLoad={handleLoad}
          onError={handleError}
        />
      ) : (
        <video
          src={url}
          controls
          className={cn("max-w-full h-auto rounded-md", isLoading && "opacity-0", hasError && "hidden")}
          onLoadedData={handleLoad}
          onError={handleError}
        />
      )}

      {hasError && (
        <div className="flex items-center justify-center bg-gray-100 text-gray-500 p-4 rounded-md min-h-[100px]">
          Failed to load {type}
        </div>
      )}
    </div>
  )
}
