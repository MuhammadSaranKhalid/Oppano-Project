"use client"

import { useEffect } from "react"
import { useChatStore } from "@/store/chat-store"
// import ConversationList from "@/components/chat/conversation-list"

export function SidebarConversations() {
  // const { fetchCurrentUser, fetchConversations } = useChatStore()

  // useEffect(() => {
  //   fetchCurrentUser()
  //   fetchConversations()
  // }, [fetchCurrentUser, fetchConversations])

  return (
    <div className="flex-1 overflow-y-auto">
      {/* <ConversationList /> */}
    </div>
  )
}
