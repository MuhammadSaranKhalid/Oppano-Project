// "use client"

// import { useEffect, useRef, useState } from "react"
// import { useRouter } from "next/navigation"
// import { useChatStore } from "@/store/chat-store"
// import { MessageCircle, Search, Phone, Video, Info } from "lucide-react"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { useToast } from "@/components/ui/use-toast"
// import { Button } from "@/components/ui/button"
// import { UserProfile } from "./user-profile"
// import { cn } from "@/lib/utils"
// import { EnhancedChatInput } from "@/components/chat/enhanced-chat-input"
// import { MessageSearch } from "./message-search"
// import { MessageItem } from "./message-item"
// import type { UserStatus } from "@/types"
// import { StatusIndicator } from "@/components/ui/status-indicator"
// import { TypingIndicator } from "@/components/chat/typing-indicator"
// import { ChatAreaSkeleton } from "@/components/chat/skeletons/chat-area-skeleton"

// interface ChatAreaProps {
//   conversationId?: string
// }

// interface Message {
//   id: string
//   content: string
//   senderId: string
//   createdAt: string
//   reactions?: { emoji: string; count: number; userIds: string[] }[]
// }

// export default function ChatArea({ conversationId }: ChatAreaProps) {
//   const router = useRouter()
//   const { toast } = useToast()
//   const messagesEndRef = useRef<HTMLDivElement>(null)
//   const [showProfile, setShowProfile] = useState(false)
//   const [showSearch, setShowSearch] = useState(false)
//   const [isScrolledUp, setIsScrolledUp] = useState(false)
//   const [newMessageCount, setNewMessageCount] = useState(0)
//   const chatContainerRef = useRef<HTMLDivElement>(null)
//   const {
//     selectedConversation,
//     conversations,
//     selectConversation,
//     currentUser,
//     error,
//     setupChatListener,
//     getTypingUsers,
//     users,
//   } = useChatStore()
//   const [messages, setMessages] = useState<Message[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const inputRef = useRef<HTMLDivElement>(null)

//   // Get typing users for the current conversation
//   const typingUsers = selectedConversation ? getTypingUsers(selectedConversation.id) : []

//   // If a conversationId is provided, select that conversation
//   useEffect(() => {
//     if (conversationId && (!selectedConversation || selectedConversation.id !== conversationId)) {
//       const conversation = conversations.find((c) => c.id === conversationId)
//       if (conversation) {
//         selectConversation(conversationId)
//       } else if (!isLoading && conversations.length > 0) {
//         // If the conversation doesn't exist and we've loaded conversations, show error
//         toast({
//           title: "Conversation not found",
//           description: "The conversation you're looking for doesn't exist or has been deleted.",
//           variant: "destructive",
//         })
//         router.push("/replies")
//       }
//     }
//   }, [conversationId, selectedConversation, conversations, selectConversation, isLoading, router, toast])

//   // Generate mock messages for any conversation
//   const generateMockMessages = (conversationId: string) => {
//     // Get the other user in the conversation
//     const otherUser = selectedConversation?.participants?.find((p) => p.userId !== currentUser?.id)?.user

//     // If no other user is found, use a default
//     const otherUserId = otherUser?.id || "user-2"
//     const otherUserName = otherUser?.username || "User"
//     const otherUserAvatar = otherUser?.avatar || "/placeholder.svg"

//     // Generate different messages based on conversation type
//     if (conversationId.startsWith("dm-")) {
//       return [
//         {
//           id: `msg-${Date.now()}-1`,
//           content: `Hi there! How can I help you today?`,
//           senderId: otherUserId,
//           createdAt: new Date(Date.now() - 3600000).toISOString(),
//         },
//         {
//           id: `msg-${Date.now()}-2`,
//           content: "I'm working on the new project. Do you have any updates?",
//           senderId: currentUser?.id || "user-1",
//           createdAt: new Date(Date.now() - 3500000).toISOString(),
//         },
//         {
//           id: `msg-${Date.now()}-3`,
//           content: "Yes, I've completed the initial designs. Let me share them with you.",
//           senderId: otherUserId,
//           createdAt: new Date(Date.now() - 3400000).toISOString(),
//         },
//         {
//           id: `msg-${Date.now()}-4`,
//           content: "Here's the latest mockup:",
//           senderId: otherUserId,
//           createdAt: new Date(Date.now() - 3300000).toISOString(),
//         },
//         {
//           id: `msg-${Date.now()}-5`,
//           content: "![Design Mockup](/helsinki-aerial-urban.png)",
//           senderId: otherUserId,
//           createdAt: new Date(Date.now() - 3200000).toISOString(),
//         },
//         {
//           id: `msg-${Date.now()}-6`,
//           content: "This looks great! I especially like the color scheme.",
//           senderId: currentUser?.id || "user-1",
//           createdAt: new Date(Date.now() - 3100000).toISOString(),
//         },
//       ]
//     } else if (conversationId.startsWith("channel-")) {
//       // For channels, create messages from multiple users
//       return [
//         {
//           id: `msg-${Date.now()}-1`,
//           content: `Welcome to the ${selectedConversation?.title || "channel"}!`,
//           senderId: "user-2", // Bill Kuphal
//           createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
//         },
//         {
//           id: `msg-${Date.now()}-2`,
//           content: "Has everyone seen the latest project requirements?",
//           senderId: "user-3", // David Smith
//           createdAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
//         },
//         {
//           id: `msg-${Date.now()}-3`,
//           content: "Yes, I've reviewed them. We should discuss the timeline.",
//           senderId: currentUser?.id || "user-1",
//           createdAt: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
//         },
//         {
//           id: `msg-${Date.now()}-4`,
//           content: "I agree. Let's schedule a meeting for tomorrow.",
//           senderId: "user-4", // Sarah Johnson
//           createdAt: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
//         },
//         {
//           id: `msg-${Date.now()}-5`,
//           content: "Sounds good to me. I'll send out a calendar invite.",
//           senderId: "user-2", // Bill Kuphal
//           createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
//         },
//       ]
//     }

//     // Default messages if no specific type is matched
//     return [
//       {
//         id: `msg-${Date.now()}-1`,
//         content: "Hello! This is a new conversation.",
//         senderId: otherUserId,
//         createdAt: new Date(Date.now() - 3600000).toISOString(),
//       },
//       {
//         id: `msg-${Date.now()}-2`,
//         content: "Hi there! How are you?",
//         senderId: currentUser?.id || "user-1",
//         createdAt: new Date(Date.now() - 3500000).toISOString(),
//       },
//     ]
//   }

//   useEffect(() => {
//     if (selectedConversation) {
//       setIsLoading(true)
//       // Simulate API call to fetch messages
//       setTimeout(() => {
//         const mockMessages = generateMockMessages(selectedConversation.id)
//         setMessages(mockMessages)
//         setIsLoading(false)
//         setupChatListener(selectedConversation)
//       }, 1000)
//     }
//   }, [selectedConversation, setupChatListener])

//   // Scroll to bottom of messages when new messages arrive
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [messages])

//   // Handle errors
//   useEffect(() => {
//     if (error) {
//       toast({
//         title: "Error",
//         description: error,
//         variant: "destructive",
//       })
//     }
//   }, [error, toast])

//   const handleSendMessage = (content: string, attachments: any) => {
//     if (!content.trim() || !selectedConversation) return

//     const newMessage = {
//       id: `msg-${Date.now()}`,
//       content,
//       senderId: currentUser?.id || "user-1", // Current user ID
//       createdAt: new Date().toISOString(),
//     }

//     setMessages((prevMessages) => [...prevMessages, newMessage])
//   }

//   // Handle adding a reaction to a message
//   const handleAddReaction = (messageId: string, emoji: string) => {
//     setMessages((prevMessages) =>
//       prevMessages.map((message) => {
//         if (message.id === messageId) {
//           // Check if this emoji reaction already exists
//           const existingReactionIndex = message.reactions?.findIndex((r) => r.emoji === emoji) ?? -1

//           if (existingReactionIndex >= 0) {
//             // Add current user to existing reaction
//             const updatedReactions = [...message.reactions!]
//             const reaction = updatedReactions[existingReactionIndex]

//             // Check if user already reacted
//             const userAlreadyReacted = reaction.userIds.some((u) => u === currentUser?.id || "user-1")

//             if (!userAlreadyReacted) {
//               updatedReactions[existingReactionIndex] = {
//                 ...reaction,
//                 count: reaction.count + 1,
//                 userIds: [...reaction.userIds, currentUser?.id || "user-1"],
//               }
//             }

//             return {
//               ...message,
//               reactions: updatedReactions,
//             }
//           } else {
//             // Create new reaction
//             return {
//               ...message,
//               reactions: [
//                 ...(message.reactions || []),
//                 {
//                   emoji,
//                   count: 1,
//                   userIds: [currentUser?.id || "user-1"],
//                 },
//               ],
//             }
//           }
//         }
//         return message
//       }),
//     )

//     // Show toast for demo purposes
//     toast({
//       title: "Reaction added",
//       description: `You reacted with ${emoji}`,
//       duration: 2000,
//     })
//   }

//   // Handle removing a reaction from a message
//   const handleRemoveReaction = (messageId: string, emoji: string) => {
//     setMessages((prevMessages) =>
//       prevMessages.map((message) => {
//         if (message.id === messageId) {
//           // Find the reaction
//           const existingReactionIndex = message.reactions?.findIndex((r) => r.emoji === emoji) ?? -1

//           if (existingReactionIndex >= 0) {
//             const reaction = message.reactions![existingReactionIndex]

//             // Remove current user from users
//             const updatedUsers = reaction.userIds.filter((u) => u !== (currentUser?.id || "user-1"))

//             // If no users left, remove the reaction entirely
//             if (updatedUsers.length === 0) {
//               return {
//                 ...message,
//                 reactions: message.reactions!.filter((_, i) => i !== existingReactionIndex),
//               }
//             }

//             // Otherwise update the reaction with reduced count
//             const updatedReactions = [...message.reactions!]
//             updatedReactions[existingReactionIndex] = {
//               ...reaction,
//               count: reaction.count - 1,
//               userIds: updatedUsers,
//             }

//             return {
//               ...message,
//               reactions: updatedReactions,
//             }
//           }
//         }
//         return message
//       }),
//     )
//   }

//   // Handle reply to message
//   const handleReplyToMessage = (messageId: string) => {
//     // Find the message to reply to
//     const messageToReply = messages.find((msg) => msg.id === messageId)

//     if (!messageToReply) return

//     // In a real app, this would set up a reply to the message
//     // For now, we'll just focus the input and add a quote of the message
//     if (inputRef.current) {
//       const quotedText = `> ${messageToReply.content}\n\n`
//       inputRef.current.innerText = quotedText
//       inputRef.current.focus()
//     }

//     // Show toast for demo purposes
//     toast({
//       title: "Reply started",
//       description: "You are now replying to a message",
//       duration: 2000,
//     })
//   }

//   // Scroll to bottom button handler
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//     setNewMessageCount(0)
//   }

//   if (!selectedConversation) {
//     return (
//       <div className="flex h-full items-center justify-center">
//         <p className="text-gray-500">Select a conversation to start chatting</p>
//       </div>
//     )
//   }

//   if (isLoading) {
//     return <ChatAreaSkeleton />
//   }

//   // Find the other user in a direct message conversation
//   const otherUser =
//     selectedConversation.type === "PRIVATE"
//       ? selectedConversation.participants.find((p) => p.userId !== currentUser?.id)?.user
//       : null

//   const conversationName =
//     selectedConversation.type === "CHANNEL" ? `# ${selectedConversation.title}` : otherUser?.username || "Conversation"

//   return (
//     <div className="flex h-full relative">
//       {/* Main chat area - dynamically adjusts width based on profile visibility */}
//       <div
//         className={cn("flex flex-col w-full transition-all duration-300 ease-in-out", showProfile && "md:pr-[320px]")}
//       >
//         {/* Chat header */}
//         <div className="border-b p-4 flex items-center justify-between">
//           <div className="flex items-center">
//             {selectedConversation.type === "PRIVATE" && (
//               <Avatar className="h-8 w-8 mr-3 cursor-pointer" onClick={() => setShowProfile(!showProfile)}>
//                 <AvatarImage
//                   src={otherUser?.avatar || `/placeholder.svg?height=32&width=32&query=${conversationName.charAt(0)}`}
//                   alt={conversationName}
//                 />
//                 <AvatarFallback>{conversationName.charAt(0)}</AvatarFallback>
//               </Avatar>
//             )}
//             <div>
//               <h2 className="text-lg font-medium cursor-pointer" onClick={() => setShowProfile(!showProfile)}>
//                 {conversationName}
//               </h2>
//               {selectedConversation.type === "PRIVATE" && otherUser && (
//                 <p className="text-sm text-gray-500">
//                   {otherUser.statusMessage || "Online for 10 mins"}
//                   {/* Display user status */}
//                   {otherUser.status && (
//                     <StatusIndicator
//                       status={otherUser.status as UserStatus}
//                       className="ml-2 inline-block align-middle"
//                     />
//                   )}
//                 </p>
//               )}
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <Button
//               variant="ghost"
//               size="icon"
//               className="rounded-full"
//               onClick={() => setShowSearch(true)}
//               aria-label="Search"
//             >
//               <Search className="h-5 w-5 text-gray-500" />
//             </Button>
//             <Button variant="ghost" size="icon" className="rounded-full" aria-label="Call">
//               <Phone className="h-5 w-5 text-gray-500" />
//             </Button>
//             <Button variant="ghost" size="icon" className="rounded-full" aria-label="Video call">
//               <Video className="h-5 w-5 text-gray-500" />
//             </Button>
//             <Button
//               variant="ghost"
//               size="icon"
//               className={cn("rounded-full", showProfile && "text-[#ff6a00]")}
//               onClick={() => setShowProfile(!showProfile)}
//               aria-label="Info"
//               aria-pressed={showProfile}
//             >
//               <Info className="h-5 w-5" />
//             </Button>
//           </div>
//         </div>

//         {/* Chat messages */}
//         <div className="flex-1 overflow-y-auto p-4 bg-gray-50" ref={chatContainerRef}>
//           <div className="space-y-4">
//             {messages.length > 0 ? (
//               messages.map((message) => {
//                 // Find the sender information
//                 const sender =
//                   message.senderId === currentUser?.id
//                     ? currentUser
//                     : users.find((u) => u.id === message.senderId) || { id: message.senderId, username: "Unknown User" }

//                 // Format the timestamp
//                 const messageDate = new Date(message.createdAt)
//                 const formattedTime = messageDate.toLocaleTimeString([], {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })

//                 // Check if message contains an image
//                 const hasImage = message.content.includes("![") && message.content.includes("](")
//                 let content = message.content
//                 let attachmentPreview = null

//                 if (hasImage) {
//                   // Extract image URL from markdown format ![alt](url)
//                   const match = message.content.match(/!\[.*?\]$$(.*?)$$/)
//                   if (match && match[1]) {
//                     attachmentPreview = match[1]
//                     // Remove the image markdown from content
//                     content = message.content.replace(/!\[.*?\]$$(.*?)$$/, "").trim()
//                   }
//                 }

//                 return (
//                   <MessageItem
//                     key={message.id}
//                     id={message.id}
//                     content={content}
//                     timestamp={formattedTime}
//                     sender={{
//                       id: sender.id,
//                       name: sender.username || "Unknown",
//                       // avatar: sender.avatar,
//                       // status: sender.status,
//                     }}
//                     isCurrentUser={message.senderId === currentUser?.id}
//                     hasAttachment={hasImage}
//                     attachmentType={hasImage ? "image" : undefined}
//                     // attachmentPreview={attachmentPreview}
//                     reactions={
//                       message.reactions?.map((r) => ({
//                         emoji: r.emoji,
//                         count: r.count,
//                         users: r.userIds.map((id) => {
//                           const user = id === currentUser?.id ? currentUser : users.find((u) => u.id === id)
//                           return {
//                             id,
//                             username: user?.username || "Unknown",
//                             avatar: user?.avatar,
//                           }
//                         }),
//                       })) || []
//                     }
//                     onReactionAdd={handleAddReaction}
//                     onReactionRemove={handleRemoveReaction}
//                     onReply={handleReplyToMessage}
//                   />
//                 )
//               })
//             ) : (
//               <div className="flex flex-col items-center justify-center py-12">
//                 <div className="bg-white rounded-full p-4 mb-4">
//                   <MessageCircle className="h-8 w-8 text-gray-400" />
//                 </div>
//                 <h3 className="text-lg font-medium mb-2">No messages yet</h3>
//                 <p className="text-gray-500 text-center max-w-md">Start the conversation by sending a message below.</p>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>
//         </div>

//         {/* Typing indicator */}
//         {selectedConversation && typingUsers.length > 0 && (
//           <div className="px-4 py-2 bg-white border-t">
//             <TypingIndicator conversationId={selectedConversation.id} />
//           </div>
//         )}

//         {/* New messages indicator */}
//         {newMessageCount > 0 && (
//           <button
//             className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-[#ff6a00] text-white px-4 py-2 rounded-full shadow-md flex items-center gap-2"
//             onClick={scrollToBottom}
//             aria-label={`${newMessageCount} new messages. Click to scroll to bottom.`}
//           >
//             <span>
//               {newMessageCount} new message{newMessageCount > 1 ? "s" : ""}
//             </span>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="16"
//               height="16"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <polyline points="6 9 12 15 18 9"></polyline>
//             </svg>
//           </button>
//         )}

//         {/* Enhanced message input */}
//         <div className="border-t p-4 bg-white">
//           <EnhancedChatInput
//             conversationId={selectedConversation.id}
//             onSendMessage={handleSendMessage}
//             // inputRef={inputRef}
//           />
//         </div>
//       </div>

//       {/* User profile sidebar - positioned absolutely on mobile, relatively on desktop */}
//       <UserProfile user={otherUser} isOpen={showProfile} onClose={() => setShowProfile(false)} />

//       {/* Message search modal */}
//       <MessageSearch
//         isOpen={showSearch}
//         onClose={() => setShowSearch(false)}
//         conversationId={selectedConversation.id}
//       />
//     </div>
//   )
// }

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/store/chat-store";
import { MessageCircle, Search, Phone, Video, Info } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { UserProfile } from "./user-profile";
import { cn } from "@/lib/utils";
import { EnhancedChatInput } from "@/components/chat/enhanced-chat-input";
import { MessageSearch } from "./message-search";
import { MessageItem } from "./message-item";
import type { UserStatus } from "@/types";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { ChatAreaSkeleton } from "@/components/chat/skeletons/chat-area-skeleton";
import {
  getMessages,
  sendMessage,
  addMessageReaction,
  removeMessageReaction,
  markMessagesAsRead,
  subscribeToMessages,
  type Message as DbMessage,
} from "@/lib/supabase";

interface ChatAreaProps {
  conversationId?: string;
}

// Interface for our component's message format
interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  reactions?: { emoji: string; count: number; userIds: string[] }[];
  type?: "TEXT" | "IMAGE" | "FILE" | "SYSTEM";
  metadata?: any;
}

// Convert DB message to component message format
function convertDbMessageToMessage(dbMessage: DbMessage): Message {
  // Process reactions to group by emoji
  const reactionsMap = new Map<string, { count: number; userIds: string[] }>();

  if (dbMessage.reactions && dbMessage.reactions.length > 0) {
    dbMessage.reactions.forEach((reaction) => {
      const existing = reactionsMap.get(reaction.emoji);
      if (existing) {
        existing.count++;
        existing.userIds.push(reaction.user_id);
      } else {
        reactionsMap.set(reaction.emoji, {
          count: 1,
          userIds: [reaction.user_id],
        });
      }
    });
  }

  const reactions = Array.from(reactionsMap.entries()).map(([emoji, data]) => ({
    emoji,
    count: data.count,
    userIds: data.userIds,
  }));

  return {
    id: dbMessage.id,
    content: dbMessage.content,
    senderId: dbMessage.sender_id,
    createdAt: dbMessage.created_at,
    reactions: reactions.length > 0 ? reactions : undefined,
    type: dbMessage.type,
    metadata: dbMessage.metadata,
  };
}

export default function ChatArea({ conversationId }: ChatAreaProps) {
  const router = useRouter();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messageSubscriptionRef = useRef<() => void>();

  const {
    selectedConversation,
    conversations,
    selectConversation,
    currentUser,
    error,
    getTypingUsers,
    users,
  } = useChatStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const inputRef = useRef<HTMLDivElement>(null);
  const lastMessageIdRef = useRef<string | null>(null);

  // Get typing users for the current conversation
  const typingUsers = selectedConversation
    ? getTypingUsers(selectedConversation.id)
    : [];

  // If a conversationId is provided, select that conversation
  useEffect(() => {
    if (
      conversationId &&
      (!selectedConversation || selectedConversation.id !== conversationId)
    ) {
      const conversation = conversations.find((c) => c.id === conversationId);
      if (conversation) {
        selectConversation(conversationId);
      } else if (!isLoading && conversations.length > 0) {
        // If the conversation doesn't exist and we've loaded conversations, show error
        toast({
          title: "Conversation not found",
          description:
            "The conversation you're looking for doesn't exist or has been deleted.",
          variant: "destructive",
        });
        router.push("/replies");
      }
    }
  }, [
    conversationId,
    selectedConversation,
    conversations,
    selectConversation,
    isLoading,
    router,
    toast,
  ]);

  // Fetch messages from Supabase
  useEffect(() => {
    async function fetchMessages() {
      if (!selectedConversation) return;

      setIsLoading(true);
      try {
        const dbMessages = await getMessages(selectedConversation.id);
        const formattedMessages = dbMessages.map(convertDbMessageToMessage);
        setMessages(formattedMessages);

        // Mark messages as read
        if (dbMessages.length > 0) {
          const lastMessageId = dbMessages[dbMessages.length - 1].id;
          lastMessageIdRef.current = lastMessageId;
          await markMessagesAsRead(selectedConversation.id, lastMessageId);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast({
          title: "Error",
          description: "Failed to load messages. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchMessages();

    // Set up real-time subscription for new messages
    if (selectedConversation && !messageSubscriptionRef.current) {
      messageSubscriptionRef.current = subscribeToMessages(
        selectedConversation.id,
        (newMessage) => {
          const formattedMessage = convertDbMessageToMessage(newMessage);
          setMessages((prev) => [...prev, formattedMessage]);

          // Mark as read if it's not from the current user
          if (newMessage.sender_id !== currentUser?.id) {
            markMessagesAsRead(selectedConversation.id, newMessage.id).catch(
              (err) => console.error("Error marking message as read:", err)
            );
          }

          lastMessageIdRef.current = newMessage.id;
        }
      );
    }

    // Clean up subscription
    return () => {
      if (messageSubscriptionRef.current) {
        messageSubscriptionRef.current();
        messageSubscriptionRef.current = undefined;
      }
    };
  }, [selectedConversation, toast, currentUser?.id]);

  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Handle sending a message
  const handleSendMessage = useCallback(
    async (content: string, attachments: any) => {
      if (!content.trim() || !selectedConversation) return;

      try {
        await sendMessage(selectedConversation.id, content);
        // The new message will be added via the real-time subscription
      } catch (error) {
        console.error("Error sending message:", error);
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
    },
    [selectedConversation, toast]
  );

  // Handle adding a reaction to a message
  const handleAddReaction = useCallback(
    async (messageId: string, emoji: string) => {
      try {
        await addMessageReaction(messageId, emoji);

        // Optimistically update the UI
        setMessages((prevMessages) =>
          prevMessages.map((message) => {
            if (message.id === messageId) {
              const existingReactionIndex =
                message.reactions?.findIndex((r) => r.emoji === emoji) ?? -1;

              if (existingReactionIndex >= 0 && message.reactions) {
                // Add current user to existing reaction
                const updatedReactions = [...message.reactions];
                const reaction = updatedReactions[existingReactionIndex];

                // Check if user already reacted
                const userAlreadyReacted = reaction.userIds.some(
                  (id) => id === currentUser?.id
                );

                if (!userAlreadyReacted) {
                  updatedReactions[existingReactionIndex] = {
                    ...reaction,
                    count: reaction.count + 1,
                    userIds: [...reaction.userIds, currentUser?.id || ""],
                  };
                }

                return {
                  ...message,
                  reactions: updatedReactions,
                };
              } else {
                // Create new reaction
                return {
                  ...message,
                  reactions: [
                    ...(message.reactions || []),
                    {
                      emoji,
                      count: 1,
                      userIds: [currentUser?.id || ""],
                    },
                  ],
                };
              }
            }
            return message;
          })
        );

        toast({
          title: "Reaction added",
          description: `You reacted with ${emoji}`,
          duration: 2000,
        });
      } catch (error) {
        console.error("Error adding reaction:", error);
        toast({
          title: "Error",
          description: "Failed to add reaction. Please try again.",
          variant: "destructive",
        });
      }
    },
    [currentUser, toast]
  );

  // Handle removing a reaction from a message
  const handleRemoveReaction = useCallback(
    async (messageId: string, emoji: string) => {
      try {
        await removeMessageReaction(messageId, emoji);

        // Optimistically update the UI
        setMessages((prevMessages) =>
          prevMessages.map((message) => {
            if (message.id === messageId && message.reactions) {
              const existingReactionIndex = message.reactions.findIndex(
                (r) => r.emoji === emoji
              );

              if (existingReactionIndex >= 0) {
                const reaction = message.reactions[existingReactionIndex];

                // Remove current user from users
                const updatedUserIds = reaction.userIds.filter(
                  (id) => id !== currentUser?.id
                );

                // If no users left, remove the reaction entirely
                if (updatedUserIds.length === 0) {
                  return {
                    ...message,
                    reactions: message.reactions.filter(
                      (_, i) => i !== existingReactionIndex
                    ),
                  };
                }

                // Otherwise update the reaction with reduced count
                const updatedReactions = [...message.reactions];
                updatedReactions[existingReactionIndex] = {
                  ...reaction,
                  count: reaction.count - 1,
                  userIds: updatedUserIds,
                };

                return {
                  ...message,
                  reactions: updatedReactions,
                };
              }
            }
            return message;
          })
        );
      } catch (error) {
        console.error("Error removing reaction:", error);
        toast({
          title: "Error",
          description: "Failed to remove reaction. Please try again.",
          variant: "destructive",
        });
      }
    },
    [currentUser, toast]
  );

  // Handle reply to message
  const handleReplyToMessage = useCallback(
    (messageId: string) => {
      // Find the message to reply to
      const messageToReply = messages.find((msg) => msg.id === messageId);

      if (!messageToReply) return;

      // In a real app, this would set up a reply to the message
      // For now, we'll just focus the input and add a quote of the message
      if (inputRef.current) {
        const quotedText = `> ${messageToReply.content}\n\n`;
        inputRef.current.innerText = quotedText;
        inputRef.current.focus();
      }

      // Show toast for demo purposes
      toast({
        title: "Reply started",
        description: "You are now replying to a message",
        duration: 2000,
      });
    },
    [messages, toast]
  );

  // Scroll to bottom button handler
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setNewMessageCount(0);
  }, []);

  // Handle scroll events to detect when user scrolls up
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = chatContainer;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setIsScrolledUp(!isAtBottom);

      // Reset new message count when scrolled to bottom
      if (isAtBottom) {
        setNewMessageCount(0);
      }
    };

    chatContainer.addEventListener("scroll", handleScroll);
    return () => chatContainer.removeEventListener("scroll", handleScroll);
  }, []);

  // Update new message count when scrolled up and new messages arrive
  useEffect(() => {
    if (isScrolledUp && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.senderId !== currentUser?.id) {
        setNewMessageCount((prev) => prev + 1);
      }
    }
  }, [messages, isScrolledUp, currentUser?.id]);

  if (!selectedConversation) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">Select a conversation to start chatting</p>
      </div>
    );
  }

  if (isLoading) {
    return <ChatAreaSkeleton />;
  }

  // Find the other user in a direct message conversation
  const otherUser =
    selectedConversation.type === "PRIVATE"
      ? selectedConversation.participants.find(
          (p) => p.userId !== currentUser?.id
        )?.user
      : null;

  const conversationName =
    selectedConversation.type === "CHANNEL"
      ? `# ${selectedConversation.title}`
      : otherUser?.username || "Conversation";

  return (
    <div className="flex h-full relative">
      {/* Main chat area - dynamically adjusts width based on profile visibility */}
      <div
        className={cn(
          "flex flex-col w-full transition-all duration-300 ease-in-out",
          showProfile && "md:pr-[320px]"
        )}
      >
        {/* Chat header */}
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center">
            {selectedConversation.type === "PRIVATE" && (
              <Avatar
                className="h-8 w-8 mr-3 cursor-pointer"
                onClick={() => setShowProfile(!showProfile)}
              >
                <AvatarImage
                  src={
                    otherUser?.avatar ||
                    `/placeholder.svg?height=32&width=32&query=${conversationName.charAt(
                      0
                    )}`
                  }
                  alt={conversationName}
                />
                <AvatarFallback>{conversationName.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div>
              <h2
                className="text-lg font-medium cursor-pointer"
                onClick={() => setShowProfile(!showProfile)}
              >
                {conversationName}
              </h2>
              {selectedConversation.type === "PRIVATE" && otherUser && (
                <p className="text-sm text-gray-500">
                  {otherUser.statusMessage || "Online for 10 mins"}
                  {/* Display user status */}
                  {otherUser.status && (
                    <StatusIndicator
                      status={otherUser.status as UserStatus}
                      className="ml-2 inline-block align-middle"
                    />
                  )}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setShowSearch(true)}
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-gray-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              aria-label="Call"
            >
              <Phone className="h-5 w-5 text-gray-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              aria-label="Video call"
            >
              <Video className="h-5 w-5 text-gray-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn("rounded-full", showProfile && "text-[#ff6a00]")}
              onClick={() => setShowProfile(!showProfile)}
              aria-label="Info"
              aria-pressed={showProfile}
            >
              <Info className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Chat messages */}
        <div
          className="flex-1 overflow-y-auto p-4 bg-gray-50"
          ref={chatContainerRef}
        >
          <div className="space-y-4">
            {messages.length > 0 ? (
              messages.map((message) => {
                // Find the sender information
                const sender =
                  message.senderId === currentUser?.id
                    ? currentUser
                    : users.find((u) => u.id === message.senderId) || {
                        id: message.senderId,
                        username: "Unknown User",
                      };

                // Format the timestamp
                const messageDate = new Date(message.createdAt);
                const formattedTime = messageDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                // Check if message contains an image or is an image type
                const isImageMessage = message.type === "IMAGE";
                const hasMarkdownImage =
                  message.content.includes("![") &&
                  message.content.includes("](");

                let content = message.content;
                let attachmentPreview = null;
                let attachmentType: "image" | "file" | "link" | undefined =
                  undefined;

                if (isImageMessage && message.metadata?.url) {
                  attachmentPreview = message.metadata.url;
                  attachmentType = "image";
                  // For image messages, content might be a caption
                } else if (hasMarkdownImage) {
                  // Extract image URL from markdown format ![alt](url)
                  const match = message.content.match(/!\[.*?\]$$(.*?)$$/);
                  if (match && match[1]) {
                    attachmentPreview = match[1];
                    attachmentType = "image";
                    // Remove the image markdown from content
                    content = message.content
                      .replace(/!\[.*?\]$$(.*?)$$/, "")
                      .trim();
                  }
                }

                return (
                  <MessageItem
                    key={message.id}
                    id={message.id}
                    content={content}
                    timestamp={formattedTime}
                    sender={{
                      id: sender.id,
                      name: sender.username || "Unknown",
                      // avatar: sender.avatar,
                      // status: sender.status as UserStatus,
                    }}
                    isCurrentUser={message.senderId === currentUser?.id}
                    hasAttachment={isImageMessage || hasMarkdownImage}
                    attachmentType={attachmentType}
                    attachmentPreview={attachmentPreview}
                    reactions={
                      message.reactions?.map((r) => ({
                        emoji: r.emoji,
                        count: r.count,
                        users: r.userIds.map((id) => {
                          const user =
                            id === currentUser?.id
                              ? currentUser
                              : users.find((u) => u.id === id);
                          return {
                            id,
                            username: user?.username || "Unknown",
                            avatar: user?.avatar,
                          };
                        }),
                      })) || []
                    }
                    onReactionAdd={handleAddReaction}
                    onReactionRemove={handleRemoveReaction}
                    onReply={handleReplyToMessage}
                  />
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-white rounded-full p-4 mb-4">
                  <MessageCircle className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No messages yet</h3>
                <p className="text-gray-500 text-center max-w-md">
                  Start the conversation by sending a message below.
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Typing indicator */}
        {selectedConversation && typingUsers.length > 0 && (
          <div className="px-4 py-2 bg-white border-t">
            <TypingIndicator conversationId={selectedConversation.id} />
          </div>
        )}

        {/* New messages indicator */}
        {newMessageCount > 0 && (
          <button
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-[#ff6a00] text-white px-4 py-2 rounded-full shadow-md flex items-center gap-2"
            onClick={scrollToBottom}
            aria-label={`${newMessageCount} new messages. Click to scroll to bottom.`}
          >
            <span>
              {newMessageCount} new message{newMessageCount > 1 ? "s" : ""}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        )}

        {/* Enhanced message input */}
        <div className="border-t p-4 bg-white">
          <EnhancedChatInput
            conversationId={selectedConversation.id}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>

      {/* User profile sidebar - positioned absolutely on mobile, relatively on desktop */}
      <UserProfile
        user={otherUser}
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />

      {/* Message search modal */}
      <MessageSearch
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        conversationId={selectedConversation.id}
      />
    </div>
  );
}
