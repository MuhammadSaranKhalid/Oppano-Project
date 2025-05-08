"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Search,
  Phone,
  Video,
  MoreVertical,
  Info,
  Users,
  Bell,
  BellOff,
} from "lucide-react";
import type { Conversation, ConversationParticipant } from "@/interfaces";
import { ConversationType } from "@/interfaces";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ConversationHeaderProps {
  conversation?: Conversation;
  participants?: ConversationParticipant[];
  onInfoClick: () => void;
}

export function ConversationHeader({
  conversation,
  participants = [],
  onInfoClick,
}: ConversationHeaderProps) {
  // Ensure we have a valid conversation object
  const safeConversation = conversation || {
    id: "unknown",
    type: "CHANNEL",
    title: "Loading...",
  };

  // For private conversations, get the other user
  const otherParticipant =
    safeConversation.type === ConversationType.PRIVATE
      ? participants.find((p) => p.user)
      : null;

  const otherUser = otherParticipant?.user;

  // Get conversation name with fallback
  const conversationName =
    safeConversation.type === ConversationType.PRIVATE
      ? otherUser?.username || "Direct Message"
      : safeConversation.title || "Unnamed Conversation";

  // Get avatar URL
  const avatarUrl =
    safeConversation.type === ConversationType.PRIVATE
      ? otherUser?.profile_picture
      : (safeConversation as any)?.avatar_url;

  // Get participant count for group conversations
  const participantCount = participants.length;

  // Get online status for private conversations
  const isOnline =
    safeConversation.type === ConversationType.PRIVATE &&
    otherUser?.status === "ONLINE";

  // Add this console log to debug
  console.log("ConversationHeader - Rendering with:", {
    conversation: safeConversation,
    participants,
    conversationName,
  });

  return (
    <div className="border-b p-3 flex items-center justify-between bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="h-10 w-10 border border-gray-200">
            <AvatarImage
              src={
                avatarUrl || "/placeholder.svg?height=40&width=40&query=avatar"
              }
              alt={conversationName}
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white">
              {conversationName?.charAt(0).toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          {isOnline && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
          )}
        </div>
        <div>
          <h2 className="text-base font-semibold">
            {safeConversation.type === ConversationType.CHANNEL
              ? `# ${conversationName}`
              : conversationName}
          </h2>
          {safeConversation.type !== ConversationType.PRIVATE ? (
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Users className="h-3 w-3" /> {participantCount} Members
            </p>
          ) : (
            <p className="text-xs text-gray-500">
              {isOnline ? "Online" : "Offline"}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
          <Search className="h-4.5 w-4.5 text-gray-600" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
          <Phone className="h-4.5 w-4.5 text-gray-600" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
          <Video className="h-4.5 w-4.5 text-gray-600" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-9 w-9"
            >
              <MoreVertical className="h-4.5 w-4.5 text-gray-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem className="gap-2" onClick={onInfoClick}>
              <Info className="h-4 w-4" /> Conversation info
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Bell className="h-4 w-4" /> Notification settings
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <BellOff className="h-4 w-4" /> Mute conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
