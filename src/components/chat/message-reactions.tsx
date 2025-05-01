"use client"

import { useState } from "react"
import { Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export type Reaction = {
  emoji: string
  count: number
  users: Array<{
    id: string
    username: string
    avatar?: string
  }>
}

interface MessageReactionsProps {
  reactions: Reaction[]
  messageId: string
  onAddReaction: (messageId: string, emoji: string) => void
  onRemoveReaction: (messageId: string, emoji: string) => void
  currentUserId: string
}

const COMMON_EMOJIS = ["👍", "❤️", "😂", "🎉", "🙏", "👀", "🔥", "✅"]

export function MessageReactions({
  reactions,
  messageId,
  onAddReaction,
  onRemoveReaction,
  currentUserId,
}: MessageReactionsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleEmojiClick = (emoji: string) => {
    // Check if the current user has already reacted with this emoji
    const existingReaction = reactions.find((r) => r.emoji === emoji)
    const hasUserReacted = existingReaction?.users.some((u) => u.id === currentUserId)

    if (hasUserReacted) {
      onRemoveReaction(messageId, emoji)
    } else {
      onAddReaction(messageId, emoji)
    }
    setIsOpen(false)
  }

  // Check if a reaction has been made by the current user
  const hasUserReacted = (reaction: Reaction) => {
    return reaction.users.some((user) => user.id === currentUserId)
  }

  return (
    <div className="flex items-center gap-1 mt-1">
      {reactions.map((reaction) => (
        <TooltipProvider key={reaction.emoji} delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border",
                  hasUserReacted(reaction)
                    ? "bg-[#fff3d9] border-[#ffdfaa] text-[#ff6a00]"
                    : "bg-white border-gray-200 hover:bg-gray-50",
                )}
                onClick={() => handleEmojiClick(reaction.emoji)}
                aria-label={`${reaction.emoji} reaction (${reaction.count})`}
              >
                <span>{reaction.emoji}</span>
                <span>{reaction.count}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              {reaction.users.map((user) => user.username).join(", ")}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full hover:bg-gray-100"
            aria-label="Add reaction"
          >
            <Smile className="h-4 w-4 text-gray-500" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="flex gap-1">
            {COMMON_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                className="p-1.5 hover:bg-gray-100 rounded-md"
                onClick={() => handleEmojiClick(emoji)}
                aria-label={`Add ${emoji} reaction`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
