"use client"

import { useRouter, usePathname } from "next/navigation"
import { useChatStore } from "@/store/chat-store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { UserStatus } from "@/types"

interface DirectMessageItemProps {
  conversation: any
  onClick?: () => void
}

export function DirectMessageItem({ conversation, onClick }: DirectMessageItemProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { selectConversation, currentUser, unreadCounts } = useChatStore()

  // Find the other participant (not the current user)
  const otherParticipant = conversation.participants.find((p: any) => p.userId !== currentUser?.id)?.user

  if (!otherParticipant) return null

  const isActive = pathname === `/replies/${conversation.id}`
  const hasUnread = unreadCounts[conversation.id] && unreadCounts[conversation.id] > 0

  const handleClick = () => {
    selectConversation(conversation.id)
    router.push(`/replies/${conversation.id}`)
    if (onClick) onClick()
  }

  // Format the status message based on status
  const getStatusText = () => {
    if (!otherParticipant.status) return ""

    switch (otherParticipant.status) {
      case UserStatus.ONLINE:
        return otherParticipant.statusMessage || "Online"
      case UserStatus.AWAY:
        return otherParticipant.statusMessage || "Away"
      case UserStatus.DO_NOT_DISTURB:
        return otherParticipant.statusMessage || "Do not disturb"
      case UserStatus.OFFLINE:
        if (otherParticipant.lastActive) {
          const lastActive = new Date(otherParticipant.lastActive)
          const now = new Date()
          const diffHours = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60))

          if (diffHours < 1) {
            return "Last seen recently"
          } else if (diffHours < 24) {
            return `Last seen ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
          } else {
            const diffDays = Math.floor(diffHours / 24)
            return `Last seen ${diffDays} day${diffDays > 1 ? "s" : ""} ago`
          }
        }
        return "Offline"
      default:
        return ""
    }
  }

  return (
    <button
      className={cn(
        "flex w-full items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors relative",
        isActive ? "bg-[#fff9e5] text-[#ff6a00] font-medium" : "text-gray-700 hover:bg-gray-100",
        hasUnread && "font-medium",
      )}
      onClick={handleClick}
    >
      <div className="relative">
        <Avatar className="h-6 w-6">
          <AvatarImage
            src={
              otherParticipant.avatar ||
              `/placeholder.svg?height=24&width=24&query=portrait of ${otherParticipant.username}`
            }
            alt={otherParticipant.username}
          />
          <AvatarFallback>{otherParticipant.username?.charAt(0)}</AvatarFallback>
        </Avatar>

        {otherParticipant.status && (
          <StatusIndicator
            status={otherParticipant.status}
            className="absolute -bottom-0.5 -right-0.5 border border-white"
            size="xs"
          />
        )}
      </div>

      <div className="flex flex-col items-start overflow-hidden">
        <span className="truncate w-full text-left">{otherParticipant.username}</span>
        {otherParticipant.status && (
          <span className={cn("text-xs truncate w-full text-left", isActive ? "text-[#ff6a00]/80" : "text-gray-500")}>
            {getStatusText()}
          </span>
        )}
      </div>

      {hasUnread && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff6a00] px-1.5 text-xs font-medium text-white">
          {unreadCounts[conversation.id]}
        </span>
      )}
    </button>
  )
}
