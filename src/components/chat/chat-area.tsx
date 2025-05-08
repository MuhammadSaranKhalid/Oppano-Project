"use client";

import { useState, useRef } from "react";
import { ConversationHeader } from "./conversation-header";
import { MessageList } from "./message-list";
import { EnhancedChatInput, type Attachment } from "./enhanced-chat-input";
import { ConversationInfo } from "./conversation-info";
import { ChatAreaSkeleton } from "./chat-area-skeleton";
import type {
  Conversation,
  ConversationParticipant,
  Message,
  User,
} from "@/interfaces";

interface ChatAreaProps {
  conversationId: string;
  selectedConversation?: Conversation;
  messages: Message[];
  participants: ConversationParticipant[];
  currentUser?: User | null;
  isLoading: boolean;
  onSendMessage: (content: string, parentMessageId?: string) => Promise<void>;
  typingUsers?: User[];
}

export function ChatArea({
  conversationId,
  selectedConversation,
  messages,
  participants,
  currentUser,
  isLoading,
  onSendMessage,
  typingUsers = [],
}: ChatAreaProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const emptyStateRef = useRef<HTMLDivElement>(null);

  console.log("ChatArea - selectedConversation:", selectedConversation);
  console.log("ChatArea - participants:", participants);

  // Get organization ID with fallback
  const getOrganizationId = () => {
    return selectedConversation?.organization_id || "default-org";
  };

  const handleInfoToggle = () => {
    setShowInfo(!showInfo);
  };

  const handleReplySelect = (message: Message) => {
    setReplyingTo(message);
    // Focus the input after selecting a message to reply to
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleSendMessageWrapper = async (
    content: string,
    attachments: Attachment[] = []
  ) => {
    try {
      if (!content.trim() && attachments.length === 0) return;

      // If replying to a message, pass the parent message ID
      await onSendMessage(content, replyingTo?.id);

      // Clear the replying state after sending
      setReplyingTo(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle edit message
  const handleEditMessage = (message: Message) => {
    // Implement edit message functionality
    console.log("Edit message:", message);
  };

  // Handle delete message
  const handleDeleteMessage = (messageId: string) => {
    // Implement delete message functionality
    console.log("Delete message:", messageId);
  };

  // Show loading skeleton
  if (isLoading) {
    return <ChatAreaSkeleton />;
  }

  // Ensure we always have a conversation object to work with
  const effectiveConversation = selectedConversation || {
    id: conversationId,
    organization_id: "default-org",
    type: "CHANNEL",
    title: "Conversation",
    description: "Loading conversation details...",
    is_archived: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Show empty state if no conversation is selected
  if (!conversationId) {
    return (
      <div
        className="flex flex-col items-center justify-center h-full bg-gray-50 p-8"
        ref={emptyStateRef}
      >
        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-500"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No conversation selected
        </h3>
        <p className="text-gray-500 text-center max-w-md mb-6">
          Select a conversation to start chatting or create a new one to connect
          with your team.
        </p>
      </div>
    );
  }

  // Always render the header, even if there are no messages
  return (
    <div className="flex flex-col h-full">
      {/* Always render the header */}
      <ConversationHeader
        conversation={effectiveConversation as Conversation}
        participants={participants}
        onInfoClick={handleInfoToggle}
      />

      <div className="flex h-full">
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {messages.length === 0 ? (
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col items-center justify-center h-full p-8">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-500"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  No messages yet
                </h3>
                <p className="text-gray-500 text-center max-w-md mb-6">
                  Be the first to send a message in this conversation!
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto bg-white">
              <MessageList
                messages={messages}
                currentUser={currentUser}
                conversationId={conversationId}
                onReplySelect={handleReplySelect}
                // onEditMessage={handleEditMessage}
                // onDeleteMessage={handleDeleteMessage}
                typingUsers={typingUsers}
              />
            </div>
          )}

          {currentUser && (
            <EnhancedChatInput
              conversationId={conversationId}
              onSendMessage={handleSendMessageWrapper}
              inputRef={inputRef}
              currentUserId={currentUser.id}
              organizationId={getOrganizationId()}
            />
          )}
        </div>

        {showInfo && (
          <div className="w-80 border-l h-full">
            <ConversationInfo
              conversation={effectiveConversation as Conversation}
              participants={participants}
              onClose={() => setShowInfo(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
