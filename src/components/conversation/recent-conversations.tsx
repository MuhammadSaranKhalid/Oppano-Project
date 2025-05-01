"use client"

import { useList } from "@refinedev/core"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare, Users, Hash } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface RecentConversationsProps {
  userId: string
}

export function RecentConversations({ userId }: RecentConversationsProps) {
  const router = useRouter()

  // Fetch conversations where the user is a participant
  const { data, isLoading } = useList({
    resource: "ConversationParticipant",
    filters: [
      {
        field: "userId",
        operator: "eq",
        value: userId,
      },
      {
        field: "isActive",
        operator: "eq",
        value: true,
      },
    ],
    sorters: [
      {
        field: "conversation.updatedAt",
        order: "desc",
      },
    ],
    pagination: {
      pageSize: 5,
    },
    meta: {
      select: "*, conversation:Conversation(*)",
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!data?.data.length) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">No conversations found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {data.data.map((participant) => {
        const conversation = participant.conversation

        // Determine the icon based on conversation type
        const getIcon = () => {
          switch (conversation.type) {
            case "PRIVATE":
              return <MessageSquare className="h-5 w-5" />
            case "GROUP":
              return <Users className="h-5 w-5" />
            case "CHANNEL":
              return <Hash className="h-5 w-5" />
            default:
              return <MessageSquare className="h-5 w-5" />
          }
        }

        return (
          <div
            key={conversation.id}
            className="flex items-center space-x-4 p-3 rounded-md hover:bg-accent cursor-pointer"
            onClick={() => router.push(`/dashboard/conversations/show/${conversation.id}`)}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">{getIcon()}</div>
            <div className="flex-1 space-y-1">
              <p className="font-medium leading-none">{conversation.title || "Untitled Conversation"}</p>
              <p className="text-sm text-muted-foreground">
                {conversation.type === "CHANNEL"
                  ? "Channel"
                  : conversation.type === "GROUP"
                    ? "Group"
                    : "Direct Message"}
              </p>
            </div>
            {conversation.updatedAt && (
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
