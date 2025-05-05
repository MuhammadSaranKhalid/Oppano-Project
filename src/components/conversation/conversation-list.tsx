"use client"

import { useState, useEffect } from "react"
import { useList } from "@refinedev/core"
// import { useNotification } from "@/providers/notification-provider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Plus, Edit, Trash, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

/**
 * ConversationList component
 * Displays a list of conversations with options to create, edit, and delete
 */
export function ConversationList() {
  const [conversations, setConversations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  // const notification = useNotification()
  const router = useRouter()

  // Fetch conversations using Refine's useList hook
  const {
    data,
    isLoading: listLoading,
    isError,
  } = useList({
    resource: "conversations",
    pagination: {
      current: 1,
      pageSize: 10,
    },
    // Include related data
    meta: {
      select: "*, organization:organizationId(*), participants:conversationParticipants(*)",
    },
  })

  // Update local state when data changes
  useEffect(() => {
    if (data?.data) {
      setConversations(data.data)
      setIsLoading(false)
    }
  }, [data])

  // Handle conversation deletion
  const handleDelete = async (id: string) => {
    try {
      // Use Refine's delete mutation
      const response = await fetch(`/api/conversations/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete conversation")
      }

      // Update the local state
      setConversations(conversations.filter((conv) => conv.id !== id))
      // notification.success("Conversation deleted successfully")
    } catch (error) {
      // notification.error("Failed to delete conversation")
      console.error(error)
    }
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
        <p className="text-red-500">Error loading conversations</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Conversations</h2>
        <Button onClick={() => router.push("/dashboard/conversations/create")}>
          <Plus className="mr-2 h-4 w-4" /> Create Conversation
        </Button>
      </div>

      {conversations.length === 0 ? (
        <div className="flex justify-center items-center h-64 border rounded-lg">
          <div className="text-center">
            <p className="text-gray-500 mb-4">No conversations found</p>
            <Button onClick={() => router.push("/dashboard/conversations/create")}>
              <Plus className="mr-2 h-4 w-4" /> Create Conversation
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {conversations.map((conversation) => (
            <Card key={conversation.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="truncate">{conversation.name}</CardTitle>
                  <Badge variant={conversation.type === "CHANNEL" ? "default" : "secondary"}>{conversation.type}</Badge>
                </div>
                <CardDescription>
                  {conversation.organization?.name || "No organization"} • {formatDate(conversation.createdAt)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {conversation.description || "No description provided"}
                </p>
                <div className="mt-2">
                  <p className="text-xs text-gray-500">{conversation.participants?.length || 0} participants</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/conversations/show/${conversation.id}`}>
                    <MessageSquare className="mr-2 h-4 w-4" /> View
                  </Link>
                </Button>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/dashboard/conversations/edit/${conversation.id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(conversation.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
