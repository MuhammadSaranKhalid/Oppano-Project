"use client"

import { useState, useEffect, useRef } from "react"
import { useList } from "@refinedev/core"
// import { useNotification } from "@/providers/notification-provider"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { formatDateTime } from "@/lib/utils"
import { Trash, Reply, Edit, FileText, ImageIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageForm } from "@/components/message/message-form"
import { supabaseBrowserClient } from "@utils/supabase/client"
// import { useSupabase } from "@/providers/supabase-provider"

type MessageListProps = {
  conversationId: string
}

/**
 * MessageList component
 * Displays a list of messages for a conversation with real-time updates
 */
export function MessageList({ conversationId }: MessageListProps) {
  const [messages, setMessages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [replyTo, setReplyTo] = useState<any>(null)
  const [editMessage, setEditMessage] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  // const notification = useNotification()
  const router = useRouter()
  // const supabase = useSupabase()

  // Fetch messages using Refine's useList hook
  const {
    data,
    isLoading: listLoading,
    isError,
  } = useList({
    resource: "messages",
    pagination: {
      current: 1,
      pageSize: 100,
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
      select: "*, user:userId(*), attachments(*), replyTo:replyToId(*)",
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Set up real-time subscription for new messages
  useEffect(() => {
    // Subscribe to new messages
    const subscription = supabaseBrowserClient
      .channel("messages")
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
              .select("*, user:userId(*), attachments(*), replyTo:replyToId(*)")
              .eq("id", payload.new.id)
              .single()

            if (newMessage) {
              setMessages((prev) => [...prev, newMessage])
            }
          } else if (payload.eventType === "UPDATE") {
            const { data: updatedMessage } = await supabaseBrowserClient
              .from("messages")
              .select("*, user:userId(*), attachments(*), replyTo:replyToId(*)")
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

  // Handle message deletion
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete message")
      }

      // notification.success("Message deleted successfully")
    } catch (error) {
      // notification.error("Failed to delete message")
      console.error(error)
    }
  }

  // Handle reply to message
  const handleReply = (message: any) => {
    setReplyTo(message)
    setEditMessage(null)
  }

  // Handle edit message
  const handleEdit = (message: any) => {
    setEditMessage(message)
    setReplyTo(null)
  }

  // Cancel reply or edit
  const handleCancel = () => {
    setReplyTo(null)
    setEditMessage(null)
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

  // Render attachment preview based on type
  const renderAttachment = (attachment: any) => {
    const fileType = attachment.type.split("/")[0]

    switch (fileType) {
      case "image":
        return (
          <div key={attachment.id} className="relative group">
            <ImageIcon className="h-4 w-4 absolute top-2 right-2 bg-black/50 p-0.5 rounded-full" />
            <img
              src={attachment.url || "/placeholder.svg"}
              alt={attachment.name}
              className="max-w-xs rounded-md border"
            />
          </div>
        )
      default:
        return (
          <div key={attachment.id} className="flex items-center space-x-2 p-2 bg-muted rounded-md">
            <FileText className="h-4 w-4" />
            <a
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline"
            >
              {attachment.name}
            </a>
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <Card key={message.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src={message.user?.avatarUrl || "/placeholder.svg"} alt={message.user?.name} />
                    <AvatarFallback>
                      {message.user?.name?.charAt(0) || message.user?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{message.user?.name || message.user?.email || "Unknown User"}</p>
                        <p className="text-xs text-gray-500">{formatDateTime(message.createdAt)}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleReply(message)}>
                          <Reply className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(message)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(message.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {message.replyTo && (
                      <div className="mt-2 p-2 bg-muted rounded-md text-sm">
                        <p className="font-medium text-xs">Reply to {message.replyTo.user?.name || "message"}:</p>
                        <p className="text-gray-500 line-clamp-2">{message.replyTo.content}</p>
                      </div>
                    )}

                    <div className="mt-2">
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>

                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.attachments.map((attachment: any) => renderAttachment(attachment))}
                      </div>
                    )}

                    {message.edited && <p className="text-xs text-gray-500 mt-1">(edited)</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
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

        <MessageForm
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
