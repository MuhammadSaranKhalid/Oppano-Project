"use client"

import { useEffect, useState } from "react"
import { useChatStore } from "@/store/chat-store"
import { UserStatus } from "@/types"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function StatusUpdateToast() {
  const { users } = useChatStore()
  const { toast } = useToast()
  const [lastStatusUpdates, setLastStatusUpdates] = useState<Record<string, UserStatus>>({})

  useEffect(() => {
    // Check for status changes
    users.forEach((user) => {
      if (user.status && (!lastStatusUpdates[user.id] || lastStatusUpdates[user.id] !== user.status)) {
        // Only show toast for users coming online or going offline
        if (
          (user.status === UserStatus.ONLINE && lastStatusUpdates[user.id] !== UserStatus.ONLINE) ||
          (user.status === UserStatus.OFFLINE && lastStatusUpdates[user.id] !== UserStatus.OFFLINE)
        ) {
          toast({
            title: user.status === UserStatus.ONLINE ? "User came online" : "User went offline",
            description: (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={user.avatar || `/placeholder.svg?height=24&width=24&query=portrait of ${user.username}`}
                    alt={user.username}
                  />
                  <AvatarFallback>{user.username?.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{user.username} is now </span>
                <div className="flex items-center">
                  <StatusIndicator status={user.status} size="xs" className="mr-1" />
                  <span>{user.status.toLowerCase()}</span>
                </div>
              </div>
            ),
            duration: 3000,
          })
        }

        // Update the last known status
        setLastStatusUpdates((prev) => ({
          ...prev,
          [user.id]: user.status as UserStatus,
        }))
      }
    })
  }, [users, toast, lastStatusUpdates])

  return null
}
