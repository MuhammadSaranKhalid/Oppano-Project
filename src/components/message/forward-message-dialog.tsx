"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useList } from "@refinedev/core"
// import { useNotification } from "@/providers/notification-provider"
import { Spinner } from "@/components/ui/spinner"
import { Check, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface ForwardMessageDialogProps {
  isOpen: boolean
  onClose: () => void
  onForward: (conversationId: string) => void
  currentConversationId: string
}

/**
 * ForwardMessageDialog component
 * Dialog for selecting a conversation to forward a message to
 */
export function ForwardMessageDialog({ isOpen, onClose, onForward, currentConversationId }: ForwardMessageDialogProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  // const notification = useNotification()

  // Fetch conversations using Refine's useList hook
  const { data, isLoading, isError } = useList({
    resource: "conversations",
    pagination: {
      current: 1,
      pageSize: 50,
    },
    filters: [
      {
        field: "id",
        operator: "ne",
        value: currentConversationId,
      },
    ],
    meta: {
      select: "*, participants:conversationParticipants(*, user:userId(*))",
    },
  })

  // Reset selected conversation when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSelectedConversationId(null)
    }
  }, [isOpen])

  // Filter conversations based on search query
  const filteredConversations =
    data?.data?.filter((conversation) => {
      if (!searchQuery) return true

      const query = searchQuery.toLowerCase()

      // Search in conversation name
      if (conversation.name?.toLowerCase().includes(query)) return true

      // Search in participant names
      if (
        conversation.participants?.some(
          (p) => p.user?.name?.toLowerCase().includes(query) || p.user?.email?.toLowerCase().includes(query),
        )
      )
        return true

      return false
    }) || []

  // Handle forward action
  const handleForward = () => {
    if (!selectedConversationId) {
      // notification.error("Please select a conversation")
      return
    }

    onForward(selectedConversationId)
    onClose()
  }

  // Get conversation display name
  const getConversationDisplayName = (conversation: any) => {
    if (conversation.type === "CHANNEL") {
      return `# ${conversation.name}`
    }

    if (conversation.type === "GROUP") {
      return conversation.name
    }

    // For direct messages, show the other user's name
    const otherParticipant = conversation.participants?.[0]?.user
    return otherParticipant?.name || otherParticipant?.email || "Unknown User"
  }

  // Get conversation avatar
  const getConversationAvatar = (conversation: any) => {
    if (conversation.type === "DIRECT") {
      const otherParticipant = conversation.participants?.[0]?.user
      return otherParticipant?.avatar || null
    }

    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Forward message</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search conversations..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : isError ? (
            <div className="text-center py-8 text-red-500">Error loading conversations</div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No conversations found</div>
          ) : (
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-1">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 cursor-pointer",
                      selectedConversationId === String(conversation.id) ? "bg-gray-100" : "hover:bg-gray-50",
                    )}
                    onClick={() => setSelectedConversationId(String(conversation.id))}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={getConversationAvatar(conversation) || "/placeholder.svg"}
                        alt={getConversationDisplayName(conversation)}
                      />
                      <AvatarFallback>{getConversationDisplayName(conversation).charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{getConversationDisplayName(conversation)}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {conversation.type === "CHANNEL"
                          ? "Channel"
                          : conversation.type === "GROUP"
                            ? "Group"
                            : "Direct Message"}
                      </p>
                    </div>
                    {selectedConversationId === String(conversation.id) && <Check className="h-4 w-4 text-green-500" />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleForward} disabled={!selectedConversationId}>
            Forward
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
