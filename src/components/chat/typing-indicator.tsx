"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useChatStore } from "@/store/chat-store"

interface TypingIndicatorProps {
  conversationId: string
}

export function TypingIndicator({ conversationId }: TypingIndicatorProps) {
  const { getTypingUsers } = useChatStore()
  const typingUsers = getTypingUsers(conversationId)

  if (typingUsers.length === 0) {
    return null
  }

  if (typingUsers.length === 1) {
    const user = typingUsers[0]
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Avatar className="h-6 w-6">
          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
          <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
        </Avatar>
        <span>{user.username} is typing</span>
        <span className="flex gap-0.5">
          <span className="animate-bounce delay-0">.</span>
          <span className="animate-bounce delay-150">.</span>
          <span className="animate-bounce delay-300">.</span>
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <div className="flex -space-x-2">
        {typingUsers.slice(0, 3).map((user) => (
          <Avatar key={user.id} className="h-6 w-6 border-2 border-white">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
            <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
          </Avatar>
        ))}
      </div>
      <span>
        {typingUsers.length === 2
          ? `${typingUsers[0].username} and ${typingUsers[1].username} are typing`
          : `${typingUsers.length} people are typing`}
      </span>
      <span className="flex gap-0.5">
        <span className="animate-bounce delay-0">.</span>
        <span className="animate-bounce delay-150">.</span>
        <span className="animate-bounce delay-300">.</span>
      </span>
    </div>
  )
}
