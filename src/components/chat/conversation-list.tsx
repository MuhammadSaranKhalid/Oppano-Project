"use client"

import { memo } from "react"
import { useChatStore } from "@/store/chat-store"
import { ConversationType } from "@/types"
import ChannelSection from "./channel-section"
import DirectMessageSection from "./direct-message-section"

const ConversationList = memo(function ConversationList() {
  const {
    conversations,
    selectedConversation,
    latestMessages,
    unreadCounts,
    selectConversation,
    isLoadingChannels,
    isLoadingDirectMessages,
    currentUser,
  } = useChatStore()

  // Group conversations by type
  const channels = conversations.filter((c) => c.type === ConversationType.CHANNEL)

  const directMessages = conversations.filter(
    (c) => c.type === ConversationType.PRIVATE || c.type === ConversationType.GROUP,
  )

  return (
    <div className="space-y-0">
      <ChannelSection
        channels={channels}
        selectedConversationId={selectedConversation?.id}
        latestMessages={latestMessages}
        unreadCounts={unreadCounts}
        onSelectConversation={selectConversation}
        isLoading={isLoadingChannels}
      />

      <DirectMessageSection
        directMessages={directMessages}
        selectedConversationId={selectedConversation?.id}
        latestMessages={latestMessages}
        unreadCounts={unreadCounts}
        onSelectConversation={selectConversation}
        isLoading={isLoadingDirectMessages}
      />
    </div>
  )
})

export default ConversationList
