// "use client"

// import type React from "react"
// import { useState } from "react"
// import { Card, Text, Avatar, Group, TextInput, Badge, Loader, Button, ActionIcon } from "@mantine/core"
// import { IconSearch, IconPlus, IconX } from "@tabler/icons-react"
// import { formatDistanceToNow } from "date-fns"

// interface Participant {
//   userId: string
//   role: string
//   user: {
//     id: string
//     name: string
//     email: string
//     avatar?: string
//   }
// }

// interface Conversation {
//   id: string
//   title?: string
//   type: "DIRECT" | "GROUP"
//   lastMessage?: string
//   lastMessageAt?: string
//   unreadCount?: number
//   participants: Participant[]
// }

// interface ChatSidebarProps {
//   conversations: Conversation[]
//   loading: boolean
//   selectedId: string | null
//   onSelect: (id: string) => void
//   onCreateNew: () => void
//   currentUserId?: string
// }

// export const ChatSidebar: React.FC<ChatSidebarProps> = ({
//   conversations,
//   loading,
//   selectedId,
//   onSelect,
//   onCreateNew,
//   currentUserId,
// }) => {
//   const [searchQuery, setSearchQuery] = useState("")

//   // Filter conversations based on search query
//   const filteredConversations = conversations.filter((conversation) => {
//     if (!searchQuery) return true

//     // Search in conversation title
//     if (conversation.title?.toLowerCase().includes(searchQuery.toLowerCase())) {
//       return true
//     }

//     // Search in participant names
//     return conversation.participants.some((participant) =>
//       participant.user.name.toLowerCase().includes(searchQuery.toLowerCase()),
//     )
//   })

//   // Get conversation display name
//   const getConversationName = (conversation: Conversation) => {
//     if (conversation.title) return conversation.title

//     // For direct messages, show the other participant's name
//     if (conversation.type === "DIRECT") {
//       const otherParticipant = conversation.participants.find((p) => p.userId !== currentUserId)
//       return otherParticipant?.user.name || "Unknown User"
//     }

//     // For group chats without a title, list participants
//     const participantNames = conversation.participants
//       .filter((p) => p.userId !== currentUserId)
//       .map((p) => p.user.name)
//       .slice(0, 3)
//       .join(", ")

//     const remainingCount = conversation.participants.length - 3
//     return `${participantNames}${remainingCount > 0 ? ` and ${remainingCount} more` : ""}`
//   }

//   // Get avatar for conversation
//   const getConversationAvatar = (conversation: Conversation) => {
//     if (conversation.type === "DIRECT") {
//       const otherParticipant = conversation.participants.find((p) => p.userId !== currentUserId)
//       return otherParticipant?.user.avatar
//     }

//     // For groups, we could use a default group avatar or first letter of the title
//     return null
//   }

//   return (
//     <div className="flex flex-col h-full">
//       <div className="p-4 border-b border-gray-200">
//         <Group position="apart" mb="md">
//           <Text weight={600} size="lg">
//             Conversations
//           </Text>
//           <ActionIcon onClick={onCreateNew} color="blue">
//             <IconPlus size={18} />
//           </ActionIcon>
//         </Group>

//         <TextInput
//           placeholder="Search conversations..."
//           icon={<IconSearch size={16} />}
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           rightSection={
//             searchQuery ? (
//               <ActionIcon onClick={() => setSearchQuery("")}>
//                 <IconX size={16} />
//               </ActionIcon>
//             ) : null
//           }
//         />
//       </div>

//       <div className="flex-1 overflow-y-auto">
//         {loading ? (
//           <div className="flex justify-center p-4">
//             <Loader />
//           </div>
//         ) : filteredConversations.length === 0 ? (
//           <div className="p-4 text-center">
//             <Text color="dimmed">No conversations found</Text>
//             <Button variant="light" mt="md" onClick={onCreateNew}>
//               Start a new conversation
//             </Button>
//           </div>
//         ) : (
//           filteredConversations.map((conversation) => (
//             <Card
//               key={conversation.id}
//               p="sm"
//               className={`mb-1 cursor-pointer hover:bg-gray-50 ${selectedId === conversation.id ? "bg-blue-50" : ""}`}
//               onClick={() => onSelect(conversation.id)}
//             >
//               <Group position="apart" noWrap>
//                 <Group noWrap>
//                   <Avatar src={getConversationAvatar(conversation)} radius="xl" size="md">
//                     {getConversationName(conversation).charAt(0)}
//                   </Avatar>

//                   <div style={{ minWidth: 0 }}>
//                     <Text weight={500} lineClamp={1}>
//                       {getConversationName(conversation)}
//                     </Text>

//                     {conversation.lastMessage && (
//                       <Text size="xs" color="dimmed" lineClamp={1}>
//                         {conversation.lastMessage}
//                       </Text>
//                     )}
//                   </div>
//                 </Group>

//                 <div className="flex flex-col items-end">
//                   {conversation.lastMessageAt && (
//                     <Text size="xs" color="dimmed">
//                       {formatDistanceToNow(new Date(conversation.lastMessageAt), { addSuffix: true })}
//                     </Text>
//                   )}

//                   {conversation.unreadCount && conversation.unreadCount > 0 && (
//                     <Badge size="sm" variant="filled">
//                       {conversation.unreadCount}
//                     </Badge>
//                   )}
//                 </div>
//               </Group>
//             </Card>
//           ))
//         )}
//       </div>
//     </div>
//   )
// }

"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

/**
 * Participant interface representing a user in a conversation
 */
interface Participant {
  userId: string;
  role: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

/**
 * Conversation interface representing a chat conversation
 */
interface Conversation {
  id: string;
  title?: string;
  type: "DIRECT" | "GROUP";
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount?: number;
  participants: Participant[];
}

/**
 * Props for the ChatSidebar component
 */
interface ChatSidebarProps {
  conversations: Conversation[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreateNew: () => void;
  currentUserId?: string;
}

/**
 * ChatSidebar Component
 *
 * This component displays a sidebar with a list of conversations.
 * It allows users to search, select, and create new conversations.
 * Refactored from Mantine to use Shadcn UI components.
 */
export const ChatSidebar = ({
  conversations,
  loading,
  selectedId,
  onSelect,
  onCreateNew,
  currentUserId,
}: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conversation) => {
    if (!searchQuery) return true;

    // Search in conversation title
    if (conversation.title?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return true;
    }

    // Search in participant names
    return conversation.participants.some((participant) =>
      participant.user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Get conversation display name
  const getConversationName = (conversation: Conversation) => {
    if (conversation.title) return conversation.title;

    // For direct messages, show the other participant's name
    if (conversation.type === "DIRECT") {
      const otherParticipant = conversation.participants.find(
        (p) => p.userId !== currentUserId
      );
      return otherParticipant?.user.name || "Unknown User";
    }

    // For group chats without a title, list participants
    const participantNames = conversation.participants
      .filter((p) => p.userId !== currentUserId)
      .map((p) => p.user.name)
      .slice(0, 3)
      .join(", ");

    const remainingCount = conversation.participants.length - 3;
    return `${participantNames}${
      remainingCount > 0 ? ` and ${remainingCount} more` : ""
    }`;
  };

  // Get avatar for conversation
  const getConversationAvatar = (conversation: Conversation) => {
    if (conversation.type === "DIRECT") {
      const otherParticipant = conversation.participants.find(
        (p) => p.userId !== currentUserId
      );
      return otherParticipant?.user.avatar;
    }

    // For groups, we could use a default group avatar or first letter of the title
    return null;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Conversations</h2>
          {/* Using Shadcn Button with Lucide icon for creating new conversation */}
          <Button variant="ghost" size="icon" onClick={onCreateNew}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Search input with icon using Shadcn Input component */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Conversation list with scroll area */}
      <ScrollArea className="flex-1">
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-sm text-gray-500">No conversations found</p>
            <Button variant="outline" className="mt-4" onClick={onCreateNew}>
              Start a new conversation
            </Button>
          </div>
        ) : (
          <div className="p-1">
            {filteredConversations.map((conversation) => (
              <Card
                key={conversation.id}
                className={`mb-1 p-3 cursor-pointer hover:bg-gray-50 ${
                  selectedId === conversation.id ? "bg-blue-50" : ""
                }`}
                onClick={() => onSelect(conversation.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    {/* Avatar component from Shadcn */}
                    <Avatar>
                      <AvatarImage
                        src={
                          getConversationAvatar(conversation) ||
                          "/placeholder.svg"
                        }
                      />
                      <AvatarFallback>
                        {getConversationName(conversation).charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <p className="font-medium truncate">
                        {getConversationName(conversation)}
                      </p>

                      {conversation.lastMessage && (
                        <p className="text-xs text-gray-500 truncate">
                          {conversation.lastMessage}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    {conversation.lastMessageAt && (
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(
                          new Date(conversation.lastMessageAt),
                          { addSuffix: true }
                        )}
                      </p>
                    )}

                    {conversation.unreadCount &&
                      conversation.unreadCount > 0 && (
                        <Badge variant="default" className="mt-1">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
