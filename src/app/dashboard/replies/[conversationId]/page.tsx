"use client";

import { useParams } from "next/navigation";
import { ChatAreaAdapter } from "@/components/chat/chat-area-adapter";

export default function ChatPage() {
  const params = useParams();
  const conversationId = params.conversationId as string;

  return <ChatAreaAdapter conversationId={conversationId} />;
}
