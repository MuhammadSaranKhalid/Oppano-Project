"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { getConversations, getCurrentUser } from "@/lib/supabase";
import { type Conversation, ConversationType, type User } from "@/types";

interface DirectMessageListProps {
  searchQuery?: string;
}

export function DirectMessageList({
  searchQuery = "",
}: DirectMessageListProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  // Extract conversationId from pathname if it exists
  const pathConversationId = pathname.match(/\/replies\/([^/]+)/)?.[1];

  useEffect(() => {
    if (pathConversationId) {
      setSelectedConversationId(pathConversationId);
    }
  }, [pathConversationId]);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const user = await getCurrentUser();
        setCurrentUser(user as any);

        const allConversations = await getConversations();
        setConversations(allConversations);
      } catch (error) {
        console.error("Error loading conversations:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Filter direct messages based on search query
  const directMessages = conversations
    .filter(
      (c) =>
        c.type === ConversationType.PRIVATE || c.type === ConversationType.GROUP
    )
    .filter((c) => {
      if (searchQuery === "") return true;

      // For direct messages, search in participant usernames
      const otherParticipants = c.participants.filter(
        (p) => p.user_id !== currentUser?.id
      );

      if (otherParticipants.length > 0) {
        return otherParticipants.some((p) =>
          p.user.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // For group chats, search in the title
      if (c.title) {
        return c.title.toLowerCase().includes(searchQuery.toLowerCase());
      }

      return false;
    });

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    router.push(`/dashboard/replies/${conversationId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Spinner size="md" />
      </div>
    );
  }

  if (directMessages.length === 0 && searchQuery) {
    return (
      <div className="px-3 py-4 text-center text-sm text-gray-500">
        No conversations matching "{searchQuery}"
      </div>
    );
  }

  if (directMessages.length === 0) {
    return (
      <div className="px-3 py-4 text-center text-sm text-gray-500">
        No direct messages. Start a conversation with the + button.
      </div>
    );
  }

  return (
    <div className="px-3">
      {directMessages.map((dm) => {
        const isCurrentUser = dm.participants.some(
          (p) => p.user_id === currentUser?.id && dm.participants.length === 1
        );

        const otherParticipants = dm.participants.filter(
          (p) => p.user_id !== currentUser?.id
        );

        let displayName = "Unknown User";
        let avatarUrl = "";

        if (isCurrentUser) {
          displayName = `${currentUser?.username || "You"} (You)`;
          avatarUrl = currentUser?.profile_picture || "";
        } else if (otherParticipants.length === 1) {
          // Direct message
          displayName = otherParticipants[0].user.username;
          avatarUrl = otherParticipants[0].user.profile_picture || "";
        } else if (dm.title) {
          // Group chat with title
          displayName = dm.title;
        } else if (otherParticipants.length > 0) {
          // Group chat without title, use participant names
          displayName = otherParticipants
            .map((p) => p.user.username)
            .slice(0, 3)
            .join(", ");

          if (otherParticipants.length > 3) {
            displayName += ` +${otherParticipants.length - 3} more`;
          }
        }

        const unreadCount = dm.unread_count || 0;

        return (
          <button
            key={dm.id}
            className={cn(
              "flex w-full items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
              dm.id === selectedConversationId
                ? "bg-[#fff9e5] text-[#ff6a00] font-medium"
                : "text-gray-700 hover:bg-gray-100"
            )}
            onClick={() => handleSelectConversation(dm.id)}
          >
            <Avatar className="h-8 w-8 rounded-full border border-gray-200">
              <AvatarImage
                src={
                  avatarUrl ||
                  `/placeholder.svg?height=32&width=32&query=avatar ${displayName.charAt(
                    0
                  )}`
                }
              />
              <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden text-left">
              <div className="flex items-center">
                <span className="truncate">{displayName}</span>
                {isCurrentUser && (
                  <span className="ml-1 text-xs text-gray-500">(You)</span>
                )}
              </div>
              {dm.last_message && (
                <p className="text-xs text-gray-500 truncate">
                  {dm.last_message.sender?.username === currentUser?.username
                    ? "You: "
                    : `${dm.last_message.sender?.username}: `}
                  {dm.last_message.content}
                </p>
              )}
            </div>
            {unreadCount > 0 && (
              <Badge className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff6a00] px-1 text-xs text-white border-none">
                {unreadCount}
              </Badge>
            )}
          </button>
        );
      })}
    </div>
  );
}
