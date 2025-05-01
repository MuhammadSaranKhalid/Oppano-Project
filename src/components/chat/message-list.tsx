// "use client"

// import type React from "react"
// import { useEffect } from "react"
// import { useList } from "@refinedev/core"
// import { Text, Avatar, Paper, Loader, Badge } from "@mantine/core"
// import { formatDistanceToNow } from "date-fns"

// interface MessageListProps {
//   conversationId: string
//   currentUserId?: string
// }

// export const MessageList: React.FC<MessageListProps> = ({ conversationId, currentUserId }) => {
//   // Fetch messages for the selected conversation
//   const { data, isLoading, refetch } = useList({
//     resource: "messages",
//     filters: [
//       {
//         field: "conversationId",
//         operator: "eq",
//         value: conversationId,
//       },
//     ],
//     sorters: [
//       {
//         field: "createdAt",
//         order: "asc",
//       },
//     ],
//     pagination: {
//       mode: "off",
//     },
//     meta: {
//       select: "*, user:userId(*), attachments(*)",
//     },
//   })

//   // Refetch messages when conversation changes
//   useEffect(() => {
//     refetch()
//   }, [conversationId, refetch])

//   if (isLoading) {
//     return (
//       <div className="flex justify-center p-4">
//         <Loader />
//       </div>
//     )
//   }

//   if (!data?.data || data.data.length === 0) {
//     return (
//       <div className="flex justify-center p-4">
//         <Text color="dimmed">No messages yet. Start the conversation!</Text>
//       </div>
//     )
//   }

//   // Group messages by date
//   const groupedMessages: { [date: string]: any[] } = {}

//   data.data.forEach((message) => {
//     const date = new Date(message.createdAt).toLocaleDateString()
//     if (!groupedMessages[date]) {
//       groupedMessages[date] = []
//     }
//     groupedMessages[date].push(message)
//   })

//   return (
//     <div className="space-y-6">
//       {Object.entries(groupedMessages).map(([date, messages]) => (
//         <div key={date}>
//           <div className="flex justify-center mb-4">
//             <Badge variant="outline">{date}</Badge>
//           </div>

//           <div className="space-y-4">
//             {messages.map((message) => {
//               const isCurrentUser = message.userId === currentUserId

//               return (
//                 <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
//                   <div
//                     className={`flex ${isCurrentUser ? "flex-row-reverse" : "flex-row"} items-end gap-2 max-w-[80%]`}
//                   >
//                     {!isCurrentUser && (
//                       <Avatar src={message.user?.avatar} radius="xl" size="sm">
//                         {message.user?.name?.charAt(0) || "U"}
//                       </Avatar>
//                     )}

//                     <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}>
//                       {!isCurrentUser && (
//                         <Text size="xs" color="dimmed" mb={1}>
//                           {message.user?.name || "Unknown User"}
//                         </Text>
//                       )}

//                       <Paper
//                         p="sm"
//                         radius="md"
//                         className={`${isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"}`}
//                       >
//                         <Text size="sm">{message.content}</Text>

//                         {/* Render attachments if any */}
//                         {message.attachments && message.attachments.length > 0 && (
//                           <div className="mt-2 space-y-2">
//                             {message.attachments.map((attachment: any) => {
//                               // Handle different attachment types
//                               if (attachment.type.startsWith("image/")) {
//                                 return (
//                                   <div key={attachment.id} className="rounded overflow-hidden">
//                                     <img
//                                       src={attachment.url || "/placeholder.svg"}
//                                       alt={attachment.name}
//                                       className="max-w-full max-h-60 object-contain"
//                                     />
//                                   </div>
//                                 )
//                               }

//                               return (
//                                 <div
//                                   key={attachment.id}
//                                   className="flex items-center gap-2 p-2 bg-white bg-opacity-10 rounded"
//                                 >
//                                   <Text size="xs">
//                                     {attachment.name} ({Math.round(attachment.size / 1024)} KB)
//                                   </Text>
//                                   <a
//                                     href={attachment.url}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="text-xs underline"
//                                   >
//                                     Download
//                                   </a>
//                                 </div>
//                               )
//                             })}
//                           </div>
//                         )}
//                       </Paper>

//                       <Text size="xs" color="dimmed" mt={1}>
//                         {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
//                       </Text>
//                     </div>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         </div>
//       ))}
//     </div>
//   )
// }

"use client";

import { useEffect } from "react";
import { useList } from "@refinedev/core";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

/**
 * Props for the MessageList component
 */
interface MessageListProps {
  conversationId: string;
  currentUserId?: string;
}

/**
 * MessageList Component
 *
 * This component displays a list of messages for a conversation.
 * It groups messages by date and displays them in chronological order.
 * Refactored from Mantine to use Shadcn UI components.
 */
export const MessageList = ({
  conversationId,
  currentUserId,
}: MessageListProps) => {
  // Fetch messages for the selected conversation
  const { data, isLoading, refetch } = useList({
    resource: "messages",
    filters: [
      {
        field: "conversationId",
        operator: "eq",
        value: conversationId,
      },
    ],
    sorters: [
      {
        field: "createdAt",
        order: "asc",
      },
    ],
    pagination: {
      mode: "off",
    },
    meta: {
      select: "*, user:userId(*), attachments(*)",
    },
  });

  // Refetch messages when conversation changes
  useEffect(() => {
    refetch();
  }, [conversationId, refetch]);

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="flex justify-center p-4">
        <p className="text-sm text-gray-500">
          No messages yet. Start the conversation!
        </p>
      </div>
    );
  }

  // Group messages by date
  const groupedMessages: { [date: string]: any[] } = {};

  data.data.forEach((message) => {
    const date = new Date(message.createdAt).toLocaleDateString();
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 p-4">
        {Object.entries(groupedMessages).map(([date, messages]) => (
          <div key={date}>
            <div className="flex justify-center mb-4">
              <Badge variant="outline">{date}</Badge>
            </div>

            <div className="space-y-4">
              {messages.map((message) => {
                const isCurrentUser = message.userId === currentUserId;

                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      isCurrentUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex ${
                        isCurrentUser ? "flex-row-reverse" : "flex-row"
                      } items-end gap-2 max-w-[80%]`}
                    >
                      {!isCurrentUser && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={message.user?.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {message.user?.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div
                        className={`flex flex-col ${
                          isCurrentUser ? "items-end" : "items-start"
                        }`}
                      >
                        {!isCurrentUser && (
                          <p className="text-xs text-gray-500 mb-1">
                            {message.user?.name || "Unknown User"}
                          </p>
                        )}

                        <Card
                          className={`p-3 ${
                            isCurrentUser
                              ? "bg-blue-500 text-white border-blue-500"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>

                          {/* Render attachments if any */}
                          {message.attachments &&
                            message.attachments.length > 0 && (
                              <div className="mt-2 space-y-2">
                                {message.attachments.map((attachment: any) => {
                                  // Handle different attachment types
                                  if (attachment.type.startsWith("image/")) {
                                    return (
                                      <div
                                        key={attachment.id}
                                        className="rounded overflow-hidden"
                                      >
                                        <img
                                          src={
                                            attachment.url || "/placeholder.svg"
                                          }
                                          alt={attachment.name}
                                          className="max-w-full max-h-60 object-contain"
                                        />
                                      </div>
                                    );
                                  }

                                  return (
                                    <div
                                      key={attachment.id}
                                      className="flex items-center gap-2 p-2 bg-white bg-opacity-10 rounded"
                                    >
                                      <p className="text-xs">
                                        {attachment.name} (
                                        {Math.round(attachment.size / 1024)} KB)
                                      </p>
                                      <a
                                        href={attachment.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs underline"
                                      >
                                        Download
                                      </a>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                        </Card>

                        <p className="text-xs text-gray-500 mt-1">
                          {formatDistanceToNow(new Date(message.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
