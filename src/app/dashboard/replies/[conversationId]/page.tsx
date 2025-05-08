// "use client"

// import { Suspense } from "react"
// import ChatArea from "@/components/chat/chat-area"
// import { ChatAreaSkeleton } from "@/components/chat/skeletons/chat-area-skeleton"

// export default function ConversationPage({ params }: { params: { conversationId: string } }) {
//   console.log("CONVERSATION ID : ", params)
//   return (
//     <Suspense fallback={<ChatAreaSkeleton />}>
//       <ChatArea conversationId={params.conversationId} />
//     </Suspense>
//   )
// }

"use client";

import { useParams } from "next/navigation";
import { ChatAreaAdapter } from "@/components/chat/chat-area-adapter";

export default function ChatPage() {
  const params = useParams();
  const conversationId = params.conversationId as string;
  console.log("CONVERSATION ID : ", conversationId);
  // if (!conversationId) {
  //   return (
  //     <div className="flex h-full items-center justify-center">
  //       <p className="text-muted-foreground">No conversation selected</p>
  //     </div>
  //   );
  // }

  return <ChatAreaAdapter conversationId={conversationId} />;
}
