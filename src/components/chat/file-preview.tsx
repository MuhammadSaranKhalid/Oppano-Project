"use client"

import { useState } from "react"
import { X, FileText, ImageIcon, Video, Music, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import type { Attachment } from "./enhanced-chat-input"

interface FilePreviewProps {
  attachment: Attachment
  onRemove: () => void
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function FilePreview({ attachment, onRemove }: FilePreviewProps) {
  const [previewError, setPreviewError] = useState(false)

  // Get icon based on file type
  const getFileIcon = () => {
    switch (attachment.type) {
      case "image":
        return <ImageIcon className="h-5 w-5 text-blue-500" />
      case "video":
        return <Video className="h-5 w-5 text-purple-500" />
      case "audio":
        return <Music className="h-5 w-5 text-green-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div
      className={cn(
        "group relative flex items-center gap-2 p-2 pr-8 rounded-md border border-gray-200 bg-gray-50",
        attachment.uploading && "bg-gray-100",
      )}
    >
      {/* File icon or preview */}
      <div className="flex-shrink-0 w-10 h-10 rounded overflow-hidden bg-white flex items-center justify-center border border-gray-200">
        {attachment.type === "image" && attachment.previewUrl && !previewError ? (
          <img
            src={attachment.previewUrl || "/placeholder.svg"}
            alt={attachment.name}
            className="w-full h-full object-cover"
            onError={() => setPreviewError(true)}
          />
        ) : attachment.type === "video" && attachment.previewUrl && !previewError ? (
          <video
            src={attachment.previewUrl}
            className="w-full h-full object-cover"
            onError={() => setPreviewError(true)}
          />
        ) : (
          getFileIcon()
        )}
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{attachment.name}</p>
        <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>

        {/* Upload progress */}
        {attachment.uploading && (
          <div className="mt-1">
            <Progress value={attachment.progress} className="h-1" />
            <p className="text-xs text-gray-500 mt-0.5">Uploading: {attachment.progress}%</p>
          </div>
        )}
      </div>

      {/* Remove button */}
      <button
        type="button"
        className="absolute right-1 top-1 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 focus:outline-none"
        onClick={onRemove}
        disabled={attachment.uploading}
      >
        {attachment.uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
      </button>
    </div>
  )
}
