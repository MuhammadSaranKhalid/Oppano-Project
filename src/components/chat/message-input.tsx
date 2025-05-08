
"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, Smile, X, Send } from "lucide-react";
import { useChatStore } from "@/store/chat-store";
import type { Message } from "@/interfaces";

interface MessageInputProps {
  onSendMessage: (content: string, parentMessageId?: string) => void;
  replyToMessage: Message | null;
  onCancelReply: () => void;
  conversationId: string;
}

export function MessageInput({
  onSendMessage,
  replyToMessage,
  onCancelReply,
  conversationId,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { currentUser, setTypingUser, setDraft, drafts } = useChatStore();

  // Load draft message if exists
  useEffect(() => {
    const draft = drafts[conversationId];
    if (draft) {
      setMessage(draft);
    }
  }, [conversationId, drafts]);

  // Save draft when message changes
  useEffect(() => {
    if (message.trim()) {
      setDraft(conversationId, message);
    }
  }, [message, conversationId, setDraft]);

  // Handle typing indicator
  useEffect(() => {
    if (!currentUser) return;

    let typingTimeout: NodeJS.Timeout;

    if (message.trim()) {
      setTypingUser(conversationId, currentUser.id, true);

      typingTimeout = setTimeout(() => {
        setTypingUser(conversationId, currentUser.id, false);
      }, 3000);
    } else {
      setTypingUser(conversationId, currentUser.id, false);
    }

    return () => {
      clearTimeout(typingTimeout);
      if (currentUser) {
        setTypingUser(conversationId, currentUser.id, false);
      }
    };
  }, [message, conversationId, currentUser, setTypingUser]);

  // Focus input when replying
  useEffect(() => {
    if (replyToMessage && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [replyToMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (message.trim()) {
      onSendMessage(message, replyToMessage?.id);
      setMessage("");
      setDraft(conversationId, "");
    }
  };

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  return (
    <div className="border-t p-4 bg-white">
      {/* Reply indicator */}
      {replyToMessage && (
        <div className="flex items-center justify-between mb-2 p-2 bg-gray-50 rounded-md">
          <div className="flex items-center">
            <div className="w-1 h-10 bg-gray-300 rounded-full mr-2"></div>
            <div>
              <p className="text-sm text-gray-500">
                Replying to{" "}
                <span className="font-medium">
                  {replyToMessage.sender?.username || "Unknown"}
                </span>
              </p>
              <p className="text-sm text-gray-700 truncate">
                {replyToMessage.content}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancelReply}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <Paperclip className="h-5 w-5 text-gray-500" />
        </Button>

        <div className="flex-1 border rounded-lg overflow-hidden">
          <textarea
            ref={textareaRef}
            className="p-3 min-h-[40px] max-h-[120px] w-full resize-none focus:outline-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (message.trim()) {
                  handleSubmit(e);
                }
              }
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <Smile className="h-5 w-5 text-gray-500" />
          </Button>

          <Button
            type="submit"
            disabled={!message.trim()}
            className="rounded-full bg-[#ff6a00] hover:bg-[#e05e00] text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
