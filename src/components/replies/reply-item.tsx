"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Hash } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReplyItemProps {
  reply: {
    id: string
    conversationName: string
    isChannel: boolean
    sender: {
      id: string
      name: string
      avatar: string
    }
    content: string
    timestamp: string
    isUnread: boolean
  }
  onClick: () => void
}

export function ReplyItem({ reply, onClick }: ReplyItemProps) {
  // Function to highlight mentions in the content
  const highlightMentions = (content: string) => {
    const parts = content.split(/(@\w+)/g)
    return parts.map((part, index) => {
      if (part.startsWith("@")) {
        return (
          <span key={index} className="text-[#ff6a00] font-medium">
            {part}
          </span>
        )
      }
      return part
    })
  }

  return (
    <div
      className={cn(
        "border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer",
        reply.isUnread && "border-l-4 border-l-[#ff6a00]",
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {reply.isChannel ? (
            <div className="flex items-center gap-1 text-gray-600">
              <Hash className="h-4 w-4" />
              <span className="font-medium">{reply.conversationName}</span>
            </div>
          ) : (
            <span className="font-medium">{reply.conversationName}</span>
          )}
          <span className="text-xs text-gray-500">{reply.timestamp}</span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={reply.sender.avatar || "/placeholder.svg"} alt={reply.sender.name} />
          <AvatarFallback>{reply.sender.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{reply.sender.name}</span>
          </div>
          <p className="text-sm text-gray-700">{highlightMentions(reply.content)}</p>
        </div>
      </div>
    </div>
  )
}
