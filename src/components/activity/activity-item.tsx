"use client"

import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, MessageSquare, FileText, AtSign, ThumbsUp, Hash, UserPlus, ExternalLink } from "lucide-react"

interface ActivityItemProps {
  activity: {
    id: string
    type: "message" | "file" | "mention" | "reaction" | "channel" | "join"
    user: {
      id: string
      name: string
      avatar: string
    }
    content: string
    detail: string
    timestamp: string
    conversationId: string | null
  }
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const router = useRouter()

  // Get the appropriate icon based on activity type
  const getActivityIcon = () => {
    switch (activity.type) {
      case "message":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "file":
        return <FileText className="h-4 w-4 text-green-500" />
      case "mention":
        return <AtSign className="h-4 w-4 text-[#ff6a00]" />
      case "reaction":
        return <ThumbsUp className="h-4 w-4 text-purple-500" />
      case "channel":
        return <Hash className="h-4 w-4 text-gray-500" />
      case "join":
        return <UserPlus className="h-4 w-4 text-teal-500" />
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />
    }
  }

  // Function to highlight mentions in the detail
  const highlightMentions = (content: string) => {
    const parts = content.split(/(@\w+)/g)
    return parts.map((part, index) => {
      if (part.startsWith("@")) {
        return (
          <span key={index} className="text-[#ff6a00] font-medium">
            {part}
          </span>
        )
      }
      return part
    })
  }

  const handleClick = () => {
    if (activity.conversationId) {
      router.push(`/replies/${activity.conversationId}`)
    }
  }

  return (
    <div
      className={`border rounded-lg p-4 hover:bg-gray-50 transition-colors ${activity.conversationId ? "cursor-pointer" : ""}`}
      onClick={activity.conversationId ? handleClick : undefined}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 p-1 rounded-md">{getActivityIcon()}</div>
          <span className="text-xs text-gray-500">{activity.timestamp}</span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
          <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-1 mb-1">
            <span className="font-medium">{activity.user.name}</span>
            <span className="text-sm text-gray-600">{activity.content}</span>
          </div>
          <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded-md">
            {activity.type === "mention" ? (
              highlightMentions(activity.detail)
            ) : activity.type === "file" ? (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span>{activity.detail}</span>
              </div>
            ) : activity.type === "channel" ? (
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-gray-500" />
                <span>{activity.detail}</span>
              </div>
            ) : (
              activity.detail
            )}
          </div>

          {activity.conversationId && (
            <div className="mt-2 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-gray-500 hover:text-[#ff6a00]"
                onClick={(e) => {
                  e.stopPropagation()
                  handleClick()
                }}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View in conversation
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
