"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Reply, Forward, Edit, Trash, FileText, Download, ExternalLink } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
// import { MessageReactions } from "./message-reactions"
import { StatusIndicator } from "@/components/ui/status-indicator"
// import { useNotification } from "@/providers/notification-provider"
import { useDelete } from "@refinedev/core"
import { formatMessageTime } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { useSupabase } from "@/providers/supabase-provider"
// import { useSession } from "@/providers/supabase-provider"
import { UserStatus } from "@/types"

// Define the Reaction type
export type Reaction = {
  id: string
  emoji: string
  count: number
  users: Array<{
    id: string
    name: string
    avatar?: string
  }>
}

// Define the Attachment type
export type Attachment = {
  id: string
  name: string
  size: number
  type: string
  url: string
  path?: string
}

export interface EnhancedMessageProps {
  id: string
  content: string
  timestamp: string | Date
  sender: {
    id: string
    name: string
    avatar?: string
    status?: UserStatus
  }
  isCurrentUser: boolean
  attachments?: Attachment[]
  reactions?: Reaction[]
  replyTo?: {
    id: string
    content: string
    sender: {
      name: string
    }
  }
  forwardedFrom?: {
    id: string
    content: string
    sender: {
      name: string
    }
  }
  edited?: boolean
  onReactionAdd?: (messageId: string, emoji: string) => void
  onReactionRemove?: (messageId: string, emoji: string) => void
  onReply?: (messageId: string) => void
  onForward?: (messageId: string) => void
  onEdit?: (messageId: string) => void
  conversationId: string
}

/**
 * EnhancedMessageItem component
 * Displays a message with advanced features like replies, forwarding, and file attachments
 */
export function EnhancedMessageItem({
  id,
  content,
  timestamp,
  sender,
  isCurrentUser,
  attachments = [],
  reactions = [],
  replyTo,
  forwardedFrom,
  edited = false,
  onReactionAdd,
  onReactionRemove,
  onReply,
  onForward,
  onEdit,
  conversationId,
}: EnhancedMessageProps) {
  const [showActions, setShowActions] = useState(false)
  const [isForwardDialogOpen, setIsForwardDialogOpen] = useState(false)
  // const notification = useNotification()
  const router = useRouter()
  // const supabase = useSupabase()
  // const session = useSession()

  // Use Refine's useDelete hook for message deletion
  const { mutate: deleteMutation } = useDelete()

  // Handle adding a reaction
  const handleAddReaction = (messageId: string, emoji: string) => {
    // if (!session) {
    //   notification.error("You must be logged in to react to messages")
    //   return
    // }

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

  // Handle forward message
  const handleForward = () => {
    onForward?.(id)
  }

  // Handle edit message
  const handleEdit = () => {
    if (!isCurrentUser) return
    onEdit?.(id)
  }

  // Handle delete message
  const handleDelete = async () => {
    // if (!isCurrentUser && !session?.user?.role?.includes("admin")) {
    //   notification.error("You can only delete your own messages")
    //   return
    // }

    try {
      await deleteMutation({
        resource: "messages",
        id,
      })

      // notification.success("Message deleted successfully")
    } catch (error) {
      // notification.error("Failed to delete message")
      console.error(error)
    }
  }

  // Format the timestamp
  const formattedTime =
    typeof timestamp === "string" ? formatMessageTime(new Date(timestamp)) : formatMessageTime(timestamp)

  // Format the full timestamp for tooltip
  const fullTimestamp =
    typeof timestamp === "string" ? new Date(timestamp).toLocaleString() : timestamp.toLocaleString()

  // Determine if message has text content
  const hasTextContent = content && content.trim().length > 0

  // Group attachments by type
  const imageAttachments = attachments.filter((att) => att.type.startsWith("image/"))
  const videoAttachments = attachments.filter((att) => att.type.startsWith("video/"))
  const audioAttachments = attachments.filter((att) => att.type.startsWith("audio/"))
  const fileAttachments = attachments.filter(
    (att) => !att.type.startsWith("image/") && !att.type.startsWith("video/") && !att.type.startsWith("audio/"),
  )

  // Render attachment preview based on type
  const renderAttachments = () => {
    if (attachments.length === 0) return null

    return (
      <div className="mt-2 space-y-2">
        {/* Image grid */}
        {imageAttachments.length > 0 && (
          <div
            className={cn(
              "grid gap-2",
              imageAttachments.length === 1
                ? "grid-cols-1"
                : imageAttachments.length === 2
                  ? "grid-cols-2"
                  : imageAttachments.length >= 3
                    ? "grid-cols-3"
                    : "",
            )}
          >
            {imageAttachments.map((attachment) => (
              <Dialog key={attachment.id}>
                <DialogTrigger asChild>
                  <div className="cursor-pointer relative group overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={attachment.url || "/placeholder.svg"}
                      alt={attachment.name}
                      className="w-full h-auto object-cover aspect-square"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <ExternalLink className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>{attachment.name}</DialogTitle>
                  </DialogHeader>
                  <div className="flex justify-center">
                    <img
                      src={attachment.url || "/placeholder.svg"}
                      alt={attachment.name}
                      className="max-h-[70vh] w-auto object-contain"
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button variant="outline" size="sm" onClick={() => window.open(attachment.url, "_blank")}>
                      Open in new tab
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        const a = document.createElement("a")
                        a.href = attachment.url
                        a.download = attachment.name
                        document.body.appendChild(a)
                        a.click()
                        document.body.removeChild(a)
                      }}
                    >
                      Download
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}

        {/* Video attachments */}
        {videoAttachments.map((attachment) => (
          <div key={attachment.id} className="rounded-md overflow-hidden border border-gray-200">
            <video controls className="w-full max-h-[300px]" src={attachment.url}>
              Your browser does not support the video tag.
            </video>
            <div className="p-2 bg-gray-50 flex justify-between items-center">
              <span className="text-sm truncate">{attachment.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const a = document.createElement("a")
                  a.href = attachment.url
                  a.download = attachment.name
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                }}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {/* Audio attachments */}
        {audioAttachments.map((attachment) => (
          <div key={attachment.id} className="rounded-md overflow-hidden border border-gray-200">
            <audio controls className="w-full" src={attachment.url}>
              Your browser does not support the audio tag.
            </audio>
            <div className="p-2 bg-gray-50 flex justify-between items-center">
              <span className="text-sm truncate">{attachment.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const a = document.createElement("a")
                  a.href = attachment.url
                  a.download = attachment.name
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                }}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {/* File attachments */}
        {fileAttachments.map((attachment) => (
          <div
            key={attachment.id}
            className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md border border-gray-200"
          >
            <FileText className="h-5 w-5 text-gray-500" />
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">{attachment.name}</p>
              <p className="text-xs text-gray-500">{(attachment.size / 1024).toFixed(1)} KB</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const a = document.createElement("a")
                a.href = attachment.url
                a.download = attachment.name
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
              }}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn("group flex items-start gap-3 py-2", isCurrentUser && "justify-end")}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {!isCurrentUser && (
        <div className="relative flex-shrink-0">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={sender.avatar || `/placeholder.svg?height=32&width=32&query=${sender.name.charAt(0)}`}
              alt={sender.name}
            />
            <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
          </Avatar>

          {sender.status && (
            <StatusIndicator
              status={sender.status}
              className="absolute -bottom-0.5 -right-0.5 border border-white"
              size="xs"
            />
          )}
        </div>
      )}

      <div className={cn("flex flex-col max-w-[70%]", isCurrentUser && "items-end")}>
        {/* Sender name and timestamp */}
        {!isCurrentUser && (
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium">{sender.name}</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-xs text-gray-500">{formattedTime}</p>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs">{fullTimestamp}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        <div
          className={cn(
            "relative rounded-lg p-3 shadow-sm",
            isCurrentUser ? "bg-[#fff9e5]" : "bg-white",
            !hasTextContent && !replyTo && !forwardedFrom && "p-0 bg-transparent shadow-none",
          )}
        >
          {/* Reply reference */}
          {replyTo && (
            <div className="mb-2 p-2 bg-gray-50 rounded-md text-sm border-l-2 border-gray-300">
              <p className="font-medium text-xs text-gray-600">Reply to {replyTo.sender.name}:</p>
              <p className="text-gray-500 line-clamp-2 text-xs">{replyTo.content}</p>
            </div>
          )}

          {/* Forwarded message reference */}
          {forwardedFrom && (
            <div className="mb-2 p-2 bg-gray-50 rounded-md text-sm border-l-2 border-gray-300">
              <p className="font-medium text-xs text-gray-600">Forwarded from {forwardedFrom.sender.name}</p>
            </div>
          )}

          {/* Message content */}
          {hasTextContent && <div className="whitespace-pre-wrap break-words">{content}</div>}

          {/* Attachments */}
          {renderAttachments()}

          {/* Edited indicator */}
          {edited && <p className="text-xs text-gray-500 mt-1">(edited)</p>}

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
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={handleForward}>
                <Forward className="h-3.5 w-3.5 text-gray-500" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                    <MoreHorizontal className="h-3.5 w-3.5 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isCurrentUser ? "start" : "end"} className="w-40">
                  <DropdownMenuItem onClick={() => navigator.clipboard.writeText(content)}>Copy text</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleForward}>Forward</DropdownMenuItem>
                  {isCurrentUser && (
                    <DropdownMenuItem onClick={handleEdit}>
                      <Edit className="h-3.5 w-3.5 mr-2" />
                      Edit message
                    </DropdownMenuItem>
                  )}
                  {/* {(isCurrentUser || session?.user?.role?.includes("admin")) && (
                    <DropdownMenuItem onClick={handleDelete} className="text-red-500">
                      <Trash className="h-3.5 w-3.5 mr-2" />
                      Delete message
                    </DropdownMenuItem>
                  )} */}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Timestamp for current user's messages */}
        {isCurrentUser && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-xs text-gray-500 mt-1">{formattedTime}</p>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">{fullTimestamp}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Reactions */}
        {/* {reactions && reactions.length > 0 && (
          <MessageReactions
            reactions={reactions}
            messageId={id}
            onAddReaction={handleAddReaction}
            onRemoveReaction={handleRemoveReaction}
            currentUserId={session?.user?.id || ""}
          />
        )} */}
      </div>
    </div>
  )
}
