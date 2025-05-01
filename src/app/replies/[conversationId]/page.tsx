import { Suspense } from "react"
import ChatArea from "@/components/chat/chat-area"
import { ChatAreaSkeleton } from "@/components/chat/skeletons/chat-area-skeleton"

export default function ConversationPage({ params }: { params: { conversationId: string } }) {
  return (
    <Suspense fallback={<ChatAreaSkeleton />}>
      <ChatArea conversationId={params.conversationId} />
    </Suspense>
  )
}
