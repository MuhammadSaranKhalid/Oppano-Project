"use client"

import { memo, useState } from "react"
import { ChevronDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Spinner } from "@/components/ui/spinner"
import DirectMessageItem from "./direct-message-item"
import { getConversationLabel } from "./utils"
import { useChatStore } from "@/store/chat-store"

export interface DirectMessageSectionProps {
  directMessages: any[]
  selectedConversationId?: string
  latestMessages: Record<string, any>
  unreadCounts: Record<string, number>
  onSelectConversation: (id: string) => void
  isLoading: boolean
}

const DirectMessageSection = memo(function DirectMessageSection({
  directMessages,
  selectedConversationId,
  latestMessages,
  unreadCounts,
  onSelectConversation,
  isLoading,
}: DirectMessageSectionProps) {
  const { currentUser } = useChatStore()
  const [isOpen, setIsOpen] = useState(true)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-4">
      <div className="flex items-center justify-between py-1 px-3">
        <CollapsibleTrigger className="flex items-center gap-1 text-sm font-medium">
          <ChevronDown className="h-4 w-4" />
          <span>Direct Messages</span>
        </CollapsibleTrigger>
        <Button variant="ghost" size="icon" className="h-5 w-5 rounded-sm text-white bg-[#ff6a00]">
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      <CollapsibleContent>
        <div className="mt-1 space-y-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <Spinner size={32} />
            </div>
          ) : directMessages.length > 0 ? (
            directMessages.map((dm) => {
              const { isSelfChat, displayName } = getConversationLabel(dm, currentUser?.id ?? "")
              const latestMessage = latestMessages[dm.id]
              const unreadCount = unreadCounts[dm.id] || 0

              return (
                <DirectMessageItem
                  key={dm.id}
                  name={displayName}
                  conversationId={dm.id}
                  isYou={isSelfChat}
                  isActive={dm.id === selectedConversationId}
                  latestMessage={latestMessage}
                  unreadCount={unreadCount}
                  onClick={onSelectConversation}
                />
              )
            })
          ) : (
            <div className="text-xs text-muted-foreground p-2">No direct messages</div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
})

export default DirectMessageSection
