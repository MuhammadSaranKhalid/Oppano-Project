"use client"

import { useState, useEffect, useRef } from "react"
import { useList, useCreate, useDelete } from "@refinedev/core"
// import { useNotification } from "@/providers/notification-provider"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { EnhancedMessageItem } from "./enhanced-message-item"
import { EnhancedMessageForm } from "./enhanced-message-form"
// import { useSupabase } from "@/providers/supabase-provider"
// import { useSession } from "@/providers/supabase-provider"
import { ArrowDown } from "lucide-react"
import { supabaseBrowserClient } from "@utils/supabase/client"
import { useSession } from "@supabase/auth-helpers-react"

interface EnhancedMessageListProps {
  conversationId: string
  conversationType: "CHANNEL" | "GROUP" | "DIRECT"
}

/**
 * EnhancedMessageList component
 * Advanced message list with support for replies, forwarding, and file attachments
 */
export function EnhancedMessageList({ conversationId, conversationType }: EnhancedMessageListProps) {
  const [messages, setMessages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [replyTo, setReplyTo] = useState<any>(null)
  const [editMessage, setEditMessage] = useState<any>(null)
  const [forwardMessage, setForwardMessage] = useState<any>(null)
  const [isForwardDialogOpen, setIsForwardDialogOpen] = useState(false)
  const [newMessageCount, setNewMessageCount] = useState(0)
  const [isScrolledUp, setIsScrolledUp] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  // const notification = useNotification()
  // const supabase = useSupabase()
  const session = useSession()
  
  // Use Refine hooks for data operations
  const { mutate: createReaction } = useCreate()
  const { mutate: deleteReaction } = useDelete()

  // Fetch messages using Refine's useList hook
  const {
    data,
    isLoading: listLoading,
    isError,
  } = useList({
    resource: "messages",
    pagination: {
      current: 1,
      pageSize: 50,
    },
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
    // Include related data
    meta: {
      select: `
        *,
        user:userId(*),
        attachments(*),
        replyTo:replyToId(*, user:userId(*)),
        forwardedFrom:forwardedFromId(*, user:userId(*)),
        reactions(*)
      `,
    },
  })

  // Update local state when data changes
  useEffect(() => {
    if (data?.data) {
      setMessages(data.data)
      setIsLoading(false)
    }
  }, [data])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (!isScrolledUp) {
      scrollToBottom()
    } else if (messages.length > 0) {
      setNewMessageCount(prev => prev + 1)
    }
  }, [messages.length])

  // Set up scroll event listener
  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return
    
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50
      setIsScrolledUp(!isAtBottom)
      
      if (isAtBottom) {
        setNewMessageCount(0)
      }
    }
    
    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  // Set up real-time subscription for new messages
  useEffect(() => {
    // Subscribe to new messages
    const subscription = supabaseBrowserClient
      .channel(`messages-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `conversationId=eq.${conversationId}`,
        },
        async (payload) => {
          // Fetch the complete message with relations
          if (payload.eventType === "INSERT") {
            const { data: newMessage } = await supabaseBrowserClient
              .from("messages")
              .select(`
                *,
                user:userId(*),
                attachments(*),
                replyTo:replyToId(*, user:userId(*)),
                forwardedFrom:forwardedFromId(*, user:userId(*)),
                reactions(*)
              `)
              .eq("id", payload.new.id)
              .single()

            if (newMessage) {
              setMessages((prev) => [...prev, newMessage])
            }
          } else if (payload.eventType === "UPDATE") {
            const { data: updatedMessage } = await supabaseBrowserClient
              .from("messages")
              .select(`
                *,
                user:userId(*),
                attachments(*),
                replyTo:replyToId(*, user:userId(*)),
                forwardedFrom:forwardedFromId(*, user:userId(*)),
                reactions(*)
              `)
              .eq("id", payload.new.id)
              .single()

            if (updatedMessage) {
              setMessages((prev) => prev.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg)))
            }
          } else if (payload.eventType === "DELETE") {
            setMessages((prev) => prev.filter((msg) => msg.id !== payload.old.id))
          }
        },
      )
      .subscribe()

    // Cleanup subscription on unmount
    return () => {
      supabaseBrowserClient.removeChannel(subscription)
    }
  }, [supabaseBrowserClient, conversationId])

  // Subscribe to reactions
  useEffect(() => {
    const subscription = supabaseBrowserClient
      .channel(`reactions-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reactions",
        },
        async (payload) => {
          if (payload.eventType === "INSERT" || payload.eventType === "DELETE") {
            // Refresh the message that has the reaction change
            const messageId = (payload.new as { messageId?: string })?.messageId || (payload.old as { messageId?: string })?.messageId
            
            if (messageId) {
              const { data: updatedMessage } = await supabaseBrowserClient
                .from("messages")
                .select(`
                  *,
                  user:userId(*),
                  attachments(*),
                  replyTo:replyToId(*, user:userId(*)),
                  forwardedFrom:forwardedFromId(*, user:userId(*)),
                  reactions(*)
                `)
                .eq("id", messageId)
                .single()

              if (updatedMessage) {
                setMessages((prev) => prev.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg)))
              }
            }
          }
        },
      )
      .subscribe()

    return () => {
      supabaseBrowserClient.removeChannel(subscription)
    }
  }, [supabaseBrowserClient, conversationId])

  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    setNewMessageCount(0)
  }

  // Handle adding a reaction
  const handleAddReaction = async (messageId: string, emoji: string) => {
    if (!session) {
      // notification.error("You must be logged in to react to messages")
      return
    }
    
    try {
      await createReaction({
        resource: "reactions",
        values: {
          messageId,
          userId: session.user.id,
          emoji,
          createdAt: new Date().toISOString()
        }
      })
    } catch (error) {
      // notification.error("Failed to add reaction")
      console.error(error)
    }
  }

  // Handle removing a reaction
  const handleRemoveReaction = async (messageId: string, emoji: string) => {
    if (!session) return
    
    try {
      // Find the reaction ID first
      const { data: reaction } = await supabaseBrowserClient
        .from("reactions")
        .select("id")
        .eq("messageId", messageId)
        .eq("userId", session.user.id)
        .eq("emoji", emoji)
        .single()
        
      if (reaction) {
        await deleteReaction({
          resource: "reactions",
          id: reaction.id
        })
      }
    } catch (error) {
      // notification.error("Failed to remove reaction")
      console.error(error)
    }
  }

  // Handle reply to message
  const handleReply = (messageId: string) => {
    const messageToReply = messages.find(msg => msg.id === messageId)
    if (messageToReply) {
      setReplyTo(messageToReply)
      setEditMessage(null)
      setForwardMessage(null)
    }
  }

  // Handle forward message
  const handleForward = (messageId: string) => {
    const messageToForward = messages.find(msg => msg.id === messageId)
    if (messageToForward) {
      setForwardMessage(messageToForward)
      setIsForwardDialogOpen(true)
      setReplyTo(null)
      setEditMessage(null)
    }
  }

  // Handle edit message
  const handleEdit = (messageId: string) => {
    const messageToEdit = messages.find(msg => msg.id === messageId)
    if (messageToEdit && messageToEdit.userId === session?.user?.id) {
      setEditMessage(messageToEdit)
      setReplyTo(null)
      setForwardMessage(null)
    }
  }

  // Handle forward to conversation
  const handleForwardToConversation = (targetConversationId: string) => {
    if (!forwardMessage) return
    
    // Create a new message in the target conversation
    createReaction({
      resource: "messages",
      values: {
        content: forwardMessage.content,
        conversationId: targetConversationId,
        userId: session?.user?.id,
        forwardedFromId: forwardMessage.id,
        createdAt: new Date().toISOString()
      }
    }, {
      onSuccess: () => {
        // notification.success("Message forwarded successfully")
        setForwardMessage(null)
      },
      onError: () => {
        // notification.error("Failed to forward message")
      }
    })
  }

  // Handle cancel action
  const handleCancel = () => {
    setReplyTo(null)
    setEditMessage(null)
    setForwardMessage(null)
  }

  // Show loading state
  if (isLoading || listLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  // Show error state
  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Error loading messages</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4"
        ref={messagesContainerRef}
      >
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            // Format reactions data
            const formattedReactions = message.reactions?.map((reaction: any) => ({
              id: reaction.id,
              emoji: reaction.emoji,
              count: 1, // We'll count them in the reduce function
              users: [{
                id: reaction.userId,
                name: "User", // This would be populated in a real app
                avatar: null
              }]
            })) || []
            
            // Group reactions by emoji
            const groupedReactions = formattedReactions.reduce((acc: any[], reaction: any) => {
              const existingReaction = acc.find(r => r.emoji === reaction.emoji)
              if (existingReaction) {
                existingReaction.count += 1
                existingReaction.users.push(...reaction.users)
                return acc
              }
              return [...acc, reaction]
            }, [])
            
            return (
              <EnhancedMessageItem
                key={message.id}
                id={message.id}
                content={message.content}
                timestamp={message.createdAt}
                sender={{
                  id: message.user?.id || "",
                  name: message.user?.name || message.user?.email || "Unknown User",
                  avatar: message.user?.avatar,
                  status: message.user?.status
                }}
                isCurrentUser={message.userId === session?.user?.id}
                attachments={message.attachments}
                reactions={groupedReactions}
                replyTo={message.replyTo ? {
                  id: message.replyTo.id,
                  content: message.replyTo.content,
                  sender: {
                    name: message.replyTo.user?.name || message.replyTo.user?.email || "Unknown User"
                  }
                } : undefined}
                forwardedFrom={message.forwardedFrom ? {
                  id: message.forwardedFrom.id,
                  content: message.forwardedFrom.content,
                  sender: {
                    name: message.forwardedFrom.user?.name || message.forwardedFrom.user?.email || "Unknown User"
                  }
                } : undefined}
                edited={message.edited}
                onReactionAdd={handleAddReaction}
                onReactionRemove={handleRemoveReaction}
                onReply={handleReply}
                onForward={handleForward}
                onEdit={handleEdit}
                conversationId={conversationId}
              />
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* New messages indicator */}
      {newMessageCount > 0 && (
        <Button
          className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-full shadow-md flex items-center gap-2"
          onClick={scrollToBottom}
          size="sm"
        >
          <span>
            {newMessageCount} new message{newMessageCount > 1 ? "s" : ""}
          </span>
          <ArrowDown className="h-4 w-4" />
        </Button>
      )}

      {/* Message form */}
      <div className="p-4 border-t bg-white">
        {replyTo && (
          <div className="mb-2 p-2 bg-muted rounded-md flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Replying to {replyTo.user?.name || "message"}:</p>
              <p className="text-xs text-gray-500 line-clamp-1">{replyTo.content}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        )}

        {editMessage && (
          <div className="mb-2 p-2 bg-muted rounded-md flex justify-between items-center">
            <p className="text-sm font-medium">Editing message</p>
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        )}

        <EnhancedMessageForm
          conversationId={conversationId}
          replyToId={replyTo?.id}
          editMessageId={editMessage?.id}
          initialContent={editMessage?.content}
          onSuccess={handleCancel}
        />
      </div>
    </div>
  )
}
