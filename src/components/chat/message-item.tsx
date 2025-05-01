"use client"

import { useState } from "react"
import { MoreHorizontal, Reply } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { MessageReactions } from "./message-reactions"
import { StatusIndicator } from "@/components/ui/status-indicator"
import type { UserStatus } from "@/types"

// Define the Reaction type if it's not imported
export type Reaction = {
  emoji: string
  count: number
  users: Array<{
    id: string
    username: string
    avatar?: string
  }>
}

export interface MessageProps {
  id: string
  content: string
  timestamp: string
  sender: {
    id: string
    name: string
    avatar?: string
    status?: UserStatus
  }
  isCurrentUser: boolean
  hasAttachment?: boolean
  attachmentType?: "image" | "file" | "link"
  attachmentUrl?: string
  attachmentPreview?: string
  reactions?: Reaction[]
  onReactionAdd?: (messageId: string, emoji: string) => void
  onReactionRemove?: (messageId: string, emoji: string) => void
  onReply?: (messageId: string) => void
}

export function MessageItem({
  id,
  content,
  timestamp,
  sender,
  isCurrentUser,
  hasAttachment,
  attachmentType,
  attachmentUrl,
  attachmentPreview,
  reactions = [],
  onReactionAdd,
  onReactionRemove,
  onReply,
}: MessageProps) {
  const [showActions, setShowActions] = useState(false)

  // Handle adding a reaction
  const handleAddReaction = (messageId: string, emoji: string) => {
    onReactionAdd?.(messageId, emoji)
  }

  // Handle removing a reaction
  const handleRemoveReaction = (messageId: string, emoji: string) => {
    onReactionRemove?.(messageId, emoji)
  }

  // Handle reply to message
  const handleReply = () => {
    onReply?.(id)
  }

  // Ensure sender object is properly defined with fallbacks
  const senderName = sender?.name || "Unknown User"
  const senderAvatar = sender?.avatar || "/placeholder.svg"
  const senderInitial = senderName.charAt(0)

  return (
    <div
      className={cn("group flex items-start gap-3", isCurrentUser && "justify-end")}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {!isCurrentUser && (
        <div className="relative">
          <Avatar className="h-8 w-8 mt-1">
            <AvatarImage src={senderAvatar || "/placeholder.svg"} alt={senderName} />
            <AvatarFallback>{senderInitial}</AvatarFallback>
          </Avatar>

          {sender?.status && (
            <StatusIndicator
              status={sender.status}
              className="absolute -bottom-0.5 -right-0.5 border border-white"
              size="xs"
            />
          )}
        </div>
      )}

      <div className={cn("flex flex-col", isCurrentUser && "items-end")}>
        <div className={cn("relative rounded-lg p-3 max-w-md shadow-sm", isCurrentUser ? "bg-[#fff9e5]" : "bg-white")}>
          {/* Message content */}
          <p className={cn(isCurrentUser && "font-medium")}>{content}</p>

          {/* Attachment preview */}
          {hasAttachment && attachmentType === "image" && attachmentPreview && (
            <img
              src={attachmentPreview || "/placeholder.svg"}
              alt="Attachment"
              className="mt-2 rounded-md w-full h-auto max-h-60 object-cover"
            />
          )}

          {/* Link preview */}
          {hasAttachment && attachmentType === "link" && (
            <div className="mt-2 rounded-md border border-gray-200 overflow-hidden">
              <div className="p-2">
                <a href={attachmentUrl || "#"} className="text-[#ff6a00] hover:underline text-sm">
                  {attachmentUrl || "Link"}
                </a>
              </div>
            </div>
          )}

          {/* File attachment */}
          {hasAttachment && attachmentType === "file" && (
            <div className="mt-2 rounded-md border border-gray-200 p-2 flex items-center gap-2">
              <div className="bg-gray-100 p-2 rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-500"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">Document.pdf</p>
                <p className="text-xs text-gray-500">2.4 MB</p>
              </div>
            </div>
          )}

          {/* Message actions */}
          <div
            className={cn(
              "absolute -top-3 opacity-0 transition-opacity group-hover:opacity-100",
              isCurrentUser ? "left-0 -translate-x-1" : "right-0 translate-x-1",
            )}
          >
            <div className="flex items-center gap-1 bg-white rounded-full shadow-md border border-gray-100 p-0.5">
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={handleReply}>
                <Reply className="h-3.5 w-3.5 text-gray-500" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                    <MoreHorizontal className="h-3.5 w-3.5 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isCurrentUser ? "start" : "end"} className="w-40">
                  <DropdownMenuItem>Copy text</DropdownMenuItem>
                  <DropdownMenuItem>Forward</DropdownMenuItem>
                  <DropdownMenuItem>Pin message</DropdownMenuItem>
                  {isCurrentUser && <DropdownMenuItem>Edit message</DropdownMenuItem>}
                  {isCurrentUser && <DropdownMenuItem className="text-red-500">Delete message</DropdownMenuItem>}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <p className="text-xs text-gray-500 mt-1">{timestamp}</p>

        {/* Reactions */}
        {reactions && reactions.length > 0 && (
          <MessageReactions
            reactions={reactions}
            messageId={id}
            onAddReaction={handleAddReaction}
            onRemoveReaction={handleRemoveReaction}
            currentUserId={sender?.id || "user-1"} // Fallback to "user-1" if sender.id is undefined
          />
        )}
      </div>
    </div>
  )
}
