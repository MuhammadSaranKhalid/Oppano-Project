"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useChatStore } from "@/store/chat-store"
import { ConversationType } from "@/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"

interface DirectMessageListProps {
  searchQuery?: string
}

export function DirectMessageList({ searchQuery = "" }: DirectMessageListProps) {
  const router = useRouter()
  const pathname = usePathname()
  const {
    fetchCurrentUser,
    fetchConversations,
    conversations,
    selectedConversation,
    selectConversation,
    unreadCounts,
    currentUser,
    isLoadingDirectMessages,
  } = useChatStore()

  useEffect(() => {
    fetchCurrentUser()
    fetchConversations()
  }, [fetchCurrentUser, fetchConversations])

  // Extract conversationId from pathname if it exists
  const pathConversationId = pathname.match(/\/replies\/([^/]+)/)?.[1]

  // If there's a conversation ID in the URL, select it
  useEffect(() => {
    if (pathConversationId && pathConversationId !== selectedConversation?.id) {
      const conversation = conversations.find((c) => c.id === pathConversationId)
      if (conversation) {
        selectConversation(pathConversationId)
      }
    }
  }, [pathConversationId, conversations, selectConversation, selectedConversation?.id])

  // Filter direct messages based on search query
  const directMessages = conversations
    .filter((c) => c.type === ConversationType.PRIVATE || c.type === ConversationType.GROUP)
    .filter((c) => {
      if (searchQuery === "") return true

      // For direct messages, search in participant usernames
      const otherParticipant = c.participants.find((p) => p.userId !== currentUser?.id)
      if (otherParticipant) {
        return otherParticipant.user.username.toLowerCase().includes(searchQuery.toLowerCase())
      }

      // For group chats, search in the title
      if (c.title) {
        return c.title.toLowerCase().includes(searchQuery.toLowerCase())
      }

      return false
    })

  const handleSelectConversation = (conversationId: string) => {
    selectConversation(conversationId)
    router.push(`/replies/${conversationId}`)
  }

  if (isLoadingDirectMessages) {
    return (
      <div className="flex items-center justify-center py-4">
        <Spinner size={20} />
      </div>
    )
  }

  if (directMessages.length === 0 && searchQuery) {
    return <div className="px-3 py-4 text-center text-sm text-gray-500">No conversations matching "{searchQuery}"</div>
  }

  if (directMessages.length === 0) {
    return (
      <div className="px-3 py-4 text-center text-sm text-gray-500">
        No direct messages. Start a conversation with the + button.
      </div>
    )
  }

  return (
    <div className="px-3">
      {directMessages.map((dm) => {
        const isCurrentUser = dm.participants.some((p) => p.userId === currentUser?.id && dm.participants.length === 1)

        const otherUser = dm.participants.find((p) => p.userId !== currentUser?.id)?.user

        const displayName = isCurrentUser ? `${currentUser?.username} (You)` : otherUser?.username || "Unknown User"

        const unreadCount = unreadCounts[dm.id] || 0

        return (
          <button
            key={dm.id}
            className={cn(
              "flex w-full items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
              dm.id === pathConversationId
                ? "bg-[#fff9e5] text-[#ff6a00] font-medium"
                : "text-gray-700 hover:bg-gray-100",
            )}
            onClick={() => handleSelectConversation(dm.id)}
          >
            <Avatar className="h-8 w-8 rounded-full border border-gray-200">
              <AvatarImage
                src={otherUser?.avatar || `/placeholder.svg?height=32&width=32&query=avatar ${displayName.charAt(0)}`}
              />
              <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden text-left">
              <div className="flex items-center">
                <span className="truncate">{displayName}</span>
                {isCurrentUser && <span className="ml-1 text-xs text-gray-500">(You)</span>}
              </div>
              {dm.lastMessage && <p className="text-xs text-gray-500 truncate">{dm.lastMessage}</p>}
            </div>
            {unreadCount > 0 && (
              <Badge className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff6a00] px-1 text-xs text-white border-none">
                {unreadCount}
              </Badge>
            )}
          </button>
        )
      })}
    </div>
  )
}
