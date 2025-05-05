// "use client"

// import type React from "react"
// import { Group, Avatar, Text, Menu, ActionIcon, Loader, Badge } from "@mantine/core"
// import { IconDotsVertical, IconUserPlus, IconTrash, IconInfoCircle } from "@tabler/icons-react"
// import { useDelete, useNavigation } from "@refinedev/core"
// import { useNotification } from "@refinedev/core"

// interface ConversationHeaderProps {
//   conversation: any
//   loading: boolean
//   currentUserId?: string
// }

// export const ConversationHeader: React.FC<ConversationHeaderProps> = ({ conversation, loading, currentUserId }) => {
//   const { show } = useNotification()
//   const { mutate: deleteConversation } = useDelete()
//   const { edit, list } = useNavigation()

//   if (loading || !conversation) {
//     return (
//       <div className="p-4 border-b border-gray-200 flex items-center">
//         <Loader size="sm" />
//         <Text ml="md">Loading conversation...</Text>
//       </div>
//     )
//   }

//   // Get conversation display name
//   const getConversationName = () => {
//     if (conversation.title) return conversation.title

//     // For direct messages, show the other participant's name
//     if (conversation.type === "DIRECT") {
//       const otherParticipant = conversation.participants.find((p: any) => p.userId !== currentUserId)
//       return otherParticipant?.user.name || "Unknown User"
//     }

//     // For group chats without a title, list participants
//     const participantNames = conversation.participants
//       .filter((p: any) => p.userId !== currentUserId)
//       .map((p: any) => p.user.name)
//       .slice(0, 3)
//       .join(", ")

//     const remainingCount = conversation.participants.length - 3
//     return `${participantNames}${remainingCount > 0 ? ` and ${remainingCount} more` : ""}`
//   }

//   // Get avatar for conversation
//   const getConversationAvatar = () => {
//     if (conversation.type === "DIRECT") {
//       const otherParticipant = conversation.participants.find((p: any) => p.userId !== currentUserId)
//       return otherParticipant?.user.avatar
//     }

//     // For groups, we could use a default group avatar or first letter of the title
//     return null
//   }

//   // Get online status
//   const getOnlineStatus = () => {
//     if (conversation.type === "DIRECT") {
//       const otherParticipant = conversation.participants.find((p: any) => p.userId !== currentUserId)
//       return otherParticipant?.user.status === "ONLINE"
//     }
//     return false
//   }

//   // Handle conversation deletion
//   const handleDelete = () => {
//     deleteConversation(
//       {
//         resource: "conversations",
//         id: conversation.id,
//       },
//       {
//         onSuccess: () => {
//           show({
//             type: "success",
//             message: "Conversation deleted successfully",
//           })
//           list({ resource: "conversations" })
//         },
//         onError: (error) => {
//           show({
//             type: "error",
//             message: "Failed to delete conversation",
//             description: error?.message,
//           })
//         },
//       },
//     )
//   }

//   // Handle adding participants
//   const handleAddParticipants = () => {
//     edit({
//       resource: "conversations",
//       id: conversation.id,
//       action: "edit",
//     })
//   }

//   return (
//     <div className="p-4 border-b border-gray-200">
//       <Group position="apart">
//         <Group>
//           <div className="relative">
//             <Avatar src={getConversationAvatar()} radius="xl" size="md">
//               {getConversationName().charAt(0)}
//             </Avatar>

//             {getOnlineStatus() && (
//               <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//             )}
//           </div>

//           <div>
//             <Group spacing="xs">
//               <Text weight={500}>{getConversationName()}</Text>
//               {conversation.type === "GROUP" && (
//                 <Badge size="xs" variant="outline">
//                   Group
//                 </Badge>
//               )}
//             </Group>

//             <Text size="xs" color="dimmed">
//               {conversation.participants.length} participants
//             </Text>
//           </div>
//         </Group>

//         <Menu position="bottom-end">
//           <Menu.Target>
//             <ActionIcon>
//               <IconDotsVertical size={18} />
//             </ActionIcon>
//           </Menu.Target>

//           <Menu.Dropdown>
//             <Menu.Item icon={<IconInfoCircle size={16} />}>View details</Menu.Item>

//             <Menu.Item icon={<IconUserPlus size={16} />} onClick={handleAddParticipants}>
//               Add participants
//             </Menu.Item>

//             <Menu.Item icon={<IconTrash size={16} />} color="red" onClick={handleDelete}>
//               Delete conversation
//             </Menu.Item>
//           </Menu.Dropdown>
//         </Menu>
//       </Group>
//     </div>
//   )
// }

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDelete, useNavigation, useNotification } from "@refinedev/core";
import { MoreVertical, UserPlus, Trash, Info } from "lucide-react";

/**
 * Props for the ConversationHeader component
 */
interface ConversationHeaderProps {
  conversation: any;
  loading: boolean;
  currentUserId?: string;
}

/**
 * ConversationHeader Component
 *
 * This component displays the header of a conversation, including the title,
 * avatar, and actions menu. Refactored from Mantine to use Shadcn UI components.
 */
export const ConversationHeader = ({
  conversation,
  loading,
  currentUserId,
}: ConversationHeaderProps) => {
  // const { show } = useNotification();
  const { mutate: deleteConversation } = useDelete();
  const { edit, list } = useNavigation();

  if (loading || !conversation) {
    return (
      <div className="p-4 border-b border-gray-200 flex items-center">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
        <p className="ml-3 text-sm">Loading conversation...</p>
      </div>
    );
  }

  // Get conversation display name
  const getConversationName = () => {
    if (conversation.title) return conversation.title;

    // For direct messages, show the other participant's name
    if (conversation.type === "DIRECT") {
      const otherParticipant = conversation.participants.find(
        (p: any) => p.userId !== currentUserId
      );
      return otherParticipant?.user.name || "Unknown User";
    }

    // For group chats without a title, list participants
    const participantNames = conversation.participants
      .filter((p: any) => p.userId !== currentUserId)
      .map((p: any) => p.user.name)
      .slice(0, 3)
      .join(", ");

    const remainingCount = conversation.participants.length - 3;
    return `${participantNames}${
      remainingCount > 0 ? ` and ${remainingCount} more` : ""
    }`;
  };

  // Get avatar for conversation
  const getConversationAvatar = () => {
    if (conversation.type === "DIRECT") {
      const otherParticipant = conversation.participants.find(
        (p: any) => p.userId !== currentUserId
      );
      return otherParticipant?.user.avatar;
    }

    // For groups, we could use a default group avatar or first letter of the title
    return null;
  };

  // Get online status
  const getOnlineStatus = () => {
    if (conversation.type === "DIRECT") {
      const otherParticipant = conversation.participants.find(
        (p: any) => p.userId !== currentUserId
      );
      return otherParticipant?.user.status === "ONLINE";
    }
    return false;
  };

  // Handle conversation deletion
  const handleDelete = () => {
    deleteConversation(
      {
        resource: "conversations",
        id: conversation.id,
      },
      {
        onSuccess: () => {
          // show({
          //   type: "success",
          //   message: "Conversation deleted successfully",
          // });
          // list({ resource: "conversations" });
        },
        onError: (error) => {
          // show({
          //   type: "error",
          //   message: "Failed to delete conversation",
          //   description: error?.message,
          // });
        },
      }
    );
  };

  // Handle adding participants
  const handleAddParticipants = () => {
    // edit({
    //   resource: "conversations",
    //   id: conversation.id,
    //   action: "edit",
    // });
  };

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="relative">
            {/* Avatar component from Shadcn */}
            <Avatar>
              <AvatarImage
                src={getConversationAvatar() || "/placeholder.svg"}
              />
              <AvatarFallback>{getConversationName().charAt(0)}</AvatarFallback>
            </Avatar>

            {/* Online status indicator */}
            {getOnlineStatus() && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>

          <div className="ml-3">
            <div className="flex items-center space-x-2">
              <h2 className="font-medium">{getConversationName()}</h2>
              {conversation.type === "GROUP" && (
                <Badge variant="outline" className="text-xs">
                  Group
                </Badge>
              )}
            </div>

            <p className="text-xs text-gray-500">
              {conversation.participants.length} participants
            </p>
          </div>
        </div>

        {/* Dropdown menu using Shadcn DropdownMenu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="flex items-center">
              <Info className="mr-2 h-4 w-4" />
              <span>View details</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center"
              onClick={handleAddParticipants}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Add participants</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center text-red-600"
              onClick={handleDelete}
            >
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete conversation</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
