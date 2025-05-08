"use client";

import { useEffect, useRef } from "react";
import { Message } from "./message";
import type { Message as MessageType, User } from "@/interfaces";
import { TypingIndicator } from "./typing-indicator";

interface MessageListProps {
  messages: MessageType[];
  currentUser?: User | null;
  conversationId: string;
  onReplySelect?: (message: MessageType) => void;
  typingUsers?: User[];
}

export function MessageList({
  messages,
  currentUser,
  conversationId,
  onReplySelect,
  typingUsers = [],
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Group messages by sender and time
  const groupMessages = (messages: MessageType[]) => {
    const groups: MessageType[][] = [];

    messages.forEach((message, index) => {
      // Start a new group if:
      // 1. This is the first message
      // 2. The sender is different from the previous message
      // 3. The time difference is more than 5 minutes
      if (
        index === 0 ||
        message.sender_id !== messages[index - 1].sender_id ||
        new Date(message.created_at).getTime() -
          new Date(messages[index - 1].created_at).getTime() >
          5 * 60 * 1000
      ) {
        groups.push([message]);
      } else {
        // Add to the last group
        groups[groups.length - 1].push(message);
      }
    });

    return groups;
  };

  const messageGroups = groupMessages(messages);

  return (
    <div className="p-4 space-y-6">
      {messageGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="space-y-1">
          {group.map((message, messageIndex) => (
            <Message
              key={message.id}
              message={message}
              isFirstInGroup={messageIndex === 0}
              isCurrentUser={message.sender_id === currentUser?.id}
              onReplyClick={() => onReplySelect?.(message)}
            />
          ))}
        </div>
      ))}

      {typingUsers.length > 0 && (
        <TypingIndicator
          conversationId={conversationId}
          typingUsers={typingUsers}
        />
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
