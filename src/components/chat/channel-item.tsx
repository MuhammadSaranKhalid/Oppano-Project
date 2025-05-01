"use client"

import { memo } from "react"
import { Hash, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatMessagePreview, formatTime } from "./utils"

export interface ChannelItemProps {
  name: string
  conversationId: string
  isPrivate?: boolean
  isActive?: boolean
  latestMessage?: any
  unreadCount?: number
  onClick: (id: string) => void
}

const ChannelItem = memo(function ChannelItem({
  name,
  conversationId,
  isPrivate = false,
  isActive = false,
  latestMessage,
  unreadCount = 0,
  onClick,
}: ChannelItemProps) {
  const status = latestMessage ? formatMessagePreview(latestMessage) : "No messages yet"
  const time = latestMessage ? formatTime(latestMessage.createdAt) : ""

  return (
    <button
      className={cn("flex w-full items-center gap-2 px-3 py-1.5 text-sm", isActive ? "bg-[#fff9e5]" : "hover:bg-muted")}
      onClick={() => onClick(conversationId)}
      aria-selected={isActive}
    >
      <div className="flex h-4 w-4 items-center justify-center text-muted-foreground">
        {isPrivate ? <Lock className="h-3 w-3" /> : <Hash className="h-3 w-3" />}
      </div>
      <div className="flex flex-1 flex-col items-start overflow-hidden">
        <span className={cn("truncate", isActive && "font-medium")}>{name}</span>
        {latestMessage && <span className="text-xs text-muted-foreground truncate">{status}</span>}
      </div>
      {unreadCount > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff6a00] px-1 text-xs text-white">
          {unreadCount}
        </span>
      )}
    </button>
  )
})

export default ChannelItem
