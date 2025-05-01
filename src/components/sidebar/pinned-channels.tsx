"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useChatStore } from "@/store/chat-store"
import { ConversationType } from "@/types"
import { Hash, Lock, MoreHorizontal, Pin } from "lucide-react"
import { cn } from "@/lib/utils"
import { ChannelContextMenu } from "./channel-context-menu"
import { Badge } from "@/components/ui/badge"

export function PinnedChannels({ searchQuery = "" }: { searchQuery?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const { conversations, selectConversation, unpinChannel, unreadCounts } = useChatStore()

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

  // Extract conversationId from pathname if it exists
  const pathConversationId = pathname.match(/\/replies\/([^/]+)/)?.[1]

  // Filter pinned channels based on search query
  const pinnedChannels = conversations
    .filter((c) => c.type === ConversationType.CHANNEL && c.isPinned)
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

  const handleQuickUnpin = (e: React.MouseEvent, channelId: string) => {
    e.preventDefault()
    e.stopPropagation()
    unpinChannel(channelId)
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
      const channelElements = Array.from(document.querySelectorAll('[data-pinned-channel-item="true"]'))
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

  if (pinnedChannels.length === 0) {
    return null
  }

  return (
    <div className="mb-2">
      <h3 className="px-6 mb-1 text-xs font-semibold text-gray-500 uppercase">Pinned</h3>
      <div className="pl-6 pr-3">
        {pinnedChannels.map((channel) => {
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
                data-pinned-channel-item="true"
                data-channel-id={channel.id}
                tabIndex={0}
                role="button"
                aria-label={`Pinned channel ${channel.title}`}
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
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded-full"
                  onClick={(e) => handleQuickUnpin(e, channel.id)}
                  title="Unpin channel"
                  aria-label="Unpin channel"
                >
                  <Pin className="h-3 w-3 text-gray-500" />
                </button>
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
    </div>
  )
}
