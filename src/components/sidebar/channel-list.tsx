"use client"

import type React from "react"

import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useChatStore } from "@/store/chat-store"
import { ConversationType } from "@/types"
import { Hash, Lock, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"
import { ChannelContextMenu } from "./channel-context-menu"
import { Badge } from "@/components/ui/badge"

interface ChannelListProps {
  searchQuery?: string
}

export function ChannelList({ searchQuery = "" }: ChannelListProps) {
  const router = useRouter()
  const pathname = usePathname()
  const {
    fetchConversations,
    conversations,
    selectedConversation,
    selectConversation,
    isLoadingChannels,
    unreadCounts,
  } = useChatStore()

  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean
    channelId: string | null
    anchorRect: DOMRect | null
  }>({
    isOpen: false,
    channelId: null,
    anchorRect: null,
  })

  // Keep track of button refs
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchData = useCallback(() => {
    fetchConversations()
  }, [fetchConversations])

  useEffect(() => {
    fetchData()
  }, [fetchData])

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

  // Filter channels based on search query and exclude pinned channels
  const channels = conversations
    .filter((c) => c.type === ConversationType.CHANNEL)
    .filter((c) => !c.isPinned) // Exclude pinned channels
    .filter((c) => searchQuery === "" || c.title?.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleSelectChannel = (channelId: string) => {
    selectConversation(channelId)
    router.push(`/replies/${channelId}`)
  }

  const handleContextMenu = (e: React.MouseEvent, channelId: string) => {
    e.preventDefault()
    e.stopPropagation()

    const buttonElement = buttonRefs.current.get(channelId)

    if (buttonElement) {
      const rect = buttonElement.getBoundingClientRect()

      setContextMenu({
        isOpen: true,
        channelId,
        anchorRect: rect,
      })
    }
  }

  const closeContextMenu = () => {
    setContextMenu({
      isOpen: false,
      channelId: null,
      anchorRect: null,
    })
  }

  // Save button ref
  const setButtonRef = (channelId: string, element: HTMLButtonElement | null) => {
    if (element) {
      buttonRefs.current.set(channelId, element)
    } else {
      buttonRefs.current.delete(channelId)
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, channelId: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleSelectChannel(channelId)
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      const channelElements = Array.from(document.querySelectorAll('[data-channel-item="true"]'))
      const currentIndex = channelElements.findIndex((el) => el.getAttribute("data-channel-id") === channelId)

      if (currentIndex !== -1) {
        const nextIndex =
          e.key === "ArrowDown"
            ? (currentIndex + 1) % channelElements.length
            : (currentIndex - 1 + channelElements.length) % channelElements.length

        const nextElement = channelElements[nextIndex] as HTMLElement
        nextElement?.focus()
      }
    }
  }

  if (isLoadingChannels) {
    return (
      <div className="flex items-center justify-center py-4">
        <Spinner size={20} />
      </div>
    )
  }

  if (channels.length === 0 && searchQuery) {
    return <div className="px-3 py-4 text-center text-sm text-gray-500">No channels matching "{searchQuery}"</div>
  }

  if (channels.length === 0 && conversations.filter((c) => c.type === ConversationType.CHANNEL).length === 0) {
    return (
      <div className="px-3 py-4 text-center text-sm text-gray-500">
        No channels available. Create one with the + button.
      </div>
    )
  }

  if (
    channels.length === 0 &&
    conversations.filter((c) => c.type === ConversationType.CHANNEL && c.isPinned).length > 0
  ) {
    return <div className="px-3 py-4 text-center text-sm text-gray-500">All channels are pinned above.</div>
  }

  return (
    <div className="pl-6 pr-3">
      {channels.map((channel) => {
        const hasUnread = unreadCounts[channel.id] && unreadCounts[channel.id] > 0

        return (
          <div key={channel.id} className="relative group">
            <button
              className={cn(
                "flex w-full items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors",
                channel.id === pathConversationId
                  ? "bg-[#fff9e5] text-[#ff6a00] font-medium"
                  : "text-gray-700 hover:bg-gray-100",
                hasUnread && "font-medium",
              )}
              onClick={() => handleSelectChannel(channel.id)}
              onKeyDown={(e) => handleKeyDown(e, channel.id)}
              data-channel-item="true"
              data-channel-id={channel.id}
              tabIndex={0}
              role="button"
              aria-label={`Channel ${channel.title}`}
            >
              <div className="flex h-4 w-4 items-center justify-center text-gray-500">
                {channel.title?.includes("team") ? <Lock className="h-3 w-3" /> : <Hash className="h-3 w-3" />}
              </div>
              <span className="truncate flex-1">{channel.title}</span>

              {hasUnread && (
                <Badge variant="default" className="bg-[#ff6a00] hover:bg-[#ff6a00] text-white text-xs">
                  {unreadCounts[channel.id]}
                </Badge>
              )}

              <button
                ref={(el) => setButtonRef(channel.id, el)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded-full"
                onClick={(e) => handleContextMenu(e, channel.id)}
                aria-label="Channel options"
              >
                <MoreHorizontal className="h-3 w-3 text-gray-500" />
              </button>
            </button>

            {contextMenu.isOpen && contextMenu.channelId === channel.id && (
              <ChannelContextMenu
                channel={channel}
                isOpen={contextMenu.isOpen}
                onClose={closeContextMenu}
                anchorRect={contextMenu.anchorRect}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
