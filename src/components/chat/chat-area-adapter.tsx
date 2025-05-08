
"use client";

import { useEffect, useState } from "react";
import { useChatStore } from "@/store/chat-store";
import { useChatApi } from "@/hooks/use-chat-api";
import { useRealTime } from "@/hooks/use-real-time";
import { ChatArea } from "./chat-area";
import type { Message, User } from "@/interfaces";
import { getCurrentUser } from "@/lib/supabase-client";
import { supabaseBrowserClient } from "@utils/supabase/client";

interface ChatAreaAdapterProps {
  conversationId: string;
}

export function ChatAreaAdapter({ conversationId }: ChatAreaAdapterProps) {
  const {
    conversations,
    messages,
    currentUser,
    setCurrentUser,
    participants,
    selectConversation,
    isLoadingMessages,
    addMessage,
    updateMessage,
    typingUsers,
  } = useChatStore();

  const { sendMessage, fetchMessages, fetchParticipants } = useChatApi();
  const { subscribeToMessages, subscribeToTyping, subscribeToReactions } =
    useRealTime();
  const [typingUserObjects, setTypingUserObjects] = useState<User[]>([]);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  // Fetch current user from Supabase Auth
  useEffect(() => {
    async function fetchCurrentUser() {
      setIsLoadingUser(true);
      try {
        const authUser = await getCurrentUser();

        console.log("AuthUser : ", authUser);

        if (authUser && authUser.id) {
          // If we have an authenticated user, fetch their full profile from the database
          // const response = await fetch(`/api/users/${authUser.id}`);
          // if (response.ok) {
          //   const userData = await response.json();
          //   console.log("RESPONSE : ", userData);
          const { data, error } = await supabaseBrowserClient
            .from("users")
            .select("*")
            .eq("id", authUser.id)
            .single();
          console.log("DAtA : ", data);
          if (data) {
            setCurrentUser(data as User);
          }
          // } else {
          //   console.error("Failed to fetch user data");
          // }
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      } finally {
        setIsLoadingUser(false);
      }
    }

    if (!currentUser) {
      fetchCurrentUser();
    }
  }, [currentUser, setCurrentUser]);

  // Set the selected conversation
  useEffect(() => {
    selectConversation(conversationId);
  }, [conversationId, selectConversation]);

  // Fetch messages and participants when conversation changes
  useEffect(() => {
    fetchMessages(conversationId);
    fetchParticipants(conversationId);
  }, [conversationId, fetchMessages, fetchParticipants]);

  // Subscribe to real-time updates
  useEffect(() => {
    // Subscribe to new messages
    const messageUnsubscribe = subscribeToMessages(
      conversationId,
      (newMessage: Message) => {
        if (newMessage.sender_id !== currentUser?.id) {
          addMessage(conversationId, newMessage);
        }
      }
    );

    // Subscribe to typing indicators
    const typingUnsubscribe = subscribeToTyping(conversationId);

    // Subscribe to reaction changes
    const reactionUnsubscribe = subscribeToReactions(
      conversationId,
      async (messageId: string) => {
        // Refresh the specific message when reactions change
        const { data, error } = await fetch(`/api/messages/${messageId}`).then(
          (res) => res.json()
        );

        if (!error && data) {
          updateMessage(conversationId, data as Message);
        }
      }
    );

    return () => {
      messageUnsubscribe();
      typingUnsubscribe();
      reactionUnsubscribe();
    };
  }, [
    conversationId,
    currentUser,
    subscribeToMessages,
    subscribeToTyping,
    subscribeToReactions,
    addMessage,
    updateMessage,
  ]);

  // Get typing user objects from participant list
  useEffect(() => {
    const typingUserIds = typingUsers[conversationId] || [];
    const conversationParticipants = participants[conversationId] || [];

    const typingUsersFiltered = conversationParticipants
      .filter(
        (p) =>
          typingUserIds.includes(p.user_id) && p.user_id !== currentUser?.id
      )
      .map((p) => p.user)
      .filter(Boolean) as User[];

    setTypingUserObjects(typingUsersFiltered);
  }, [conversationId, participants, typingUsers, currentUser]);

  // Make sure we have the selected conversation
  const selectedConversation = conversations.find(
    (c) => c.id === conversationId
  );
  const conversationParticipants = participants[conversationId] || [];

  const handleSendMessage = async (
    content: string,
    parentMessageId?: string
  ) => {
    if (!currentUser || !content.trim()) return;

    try {
      // Change this line to pass an empty array as the attachments parameter
      const newMessage = await sendMessage(
        conversationId,
        content,
        [],
        parentMessageId
      );
      if (newMessage) {
        addMessage(conversationId, newMessage);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Show loading state if we're still loading the user
  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading user data...
      </div>
    );
  }

  return (
    <ChatArea
      conversationId={conversationId}
      currentUser={currentUser}
      selectedConversation={selectedConversation}
      messages={messages[conversationId] || []}
      participants={conversationParticipants}
      isLoading={isLoadingMessages}
      onSendMessage={handleSendMessage}
      typingUsers={typingUserObjects}
    />
  );
}
