"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X, Bell, Pin, Star, Flag, Archive, Trash2 } from "lucide-react";
import type { Conversation, ConversationParticipant } from "@/interfaces";
import { ConversationType, UserStatus } from "@/interfaces";

interface ConversationInfoProps {
  conversation: Conversation;
  participants: ConversationParticipant[];
  onClose: () => void;
}

export function ConversationInfo({
  conversation,
  participants,
  onClose,
}: ConversationInfoProps) {
  // Get status indicator color based on user status
  const getStatusColor = (status?: UserStatus) => {
    switch (status) {
      case UserStatus.ONLINE:
        return "bg-green-500";
      case UserStatus.AWAY:
        return "bg-yellow-500";
      case UserStatus.DO_NOT_DISTURB:
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-medium">Conversation Info</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 border-b">
        <div className="flex flex-col items-center">
          <Avatar className="h-20 w-20 mb-4">
            <AvatarImage
              src={conversation.avatar_url || "/placeholder.svg"}
              alt={conversation.title || "Conversation"}
            />
            <AvatarFallback>
              {(conversation.title || "C").charAt(0)}
            </AvatarFallback>
          </Avatar>

          <h2 className="text-xl font-medium">
            {conversation.type === ConversationType.CHANNEL
              ? `# ${conversation.title}`
              : conversation.title}
          </h2>

          {conversation.description && (
            <p className="text-sm text-gray-500 mt-1 text-center">
              {conversation.description}
            </p>
          )}

          <div className="flex items-center gap-2 mt-4">
            <Button variant="outline" size="sm" className="rounded-full">
              <Bell className="h-4 w-4 mr-2" />
              Mute
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <Pin className="h-4 w-4 mr-2" />
              Pin
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 border-b">
        <h4 className="font-medium mb-3">Members ({participants.length})</h4>
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="relative">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage
                      src={
                        participant.user?.profile_picture || "/placeholder.svg"
                      }
                      alt={participant.user?.username || "User"}
                    />
                    <AvatarFallback>
                      {(participant.user?.username || "U").charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={`absolute bottom-0 right-1 h-2.5 w-2.5 rounded-full ${getStatusColor(
                      participant.user?.status
                    )} ring-1 ring-white`}
                  ></span>
                </div>
                <div>
                  <p className="font-medium">
                    {participant.user?.username || "Unknown User"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {participant.user?.status_message || "No status"}
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-500 capitalize">
                {participant.role.toLowerCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto p-4 border-t">
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-600"
          >
            <Star className="h-4 w-4 mr-2" />
            Add to favorites
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-600"
          >
            <Flag className="h-4 w-4 mr-2" />
            Report conversation
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-600"
          >
            <Archive className="h-4 w-4 mr-2" />
            Archive conversation
          </Button>
          <Button variant="ghost" className="w-full justify-start text-red-500">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete conversation
          </Button>
        </div>
      </div>
    </div>
  );
}
