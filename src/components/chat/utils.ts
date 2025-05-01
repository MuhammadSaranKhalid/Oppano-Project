import type { Message } from "@/types"

// Format message time
export function formatMessageTime(dateString?: Date | string): string {
  if (!dateString) return ""

  const date = new Date(dateString)
  const now = new Date()

  // Same day, just show time
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Within the last week, show day name
  const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (daysDiff < 7) {
    return date.toLocaleDateString([], { weekday: "short" })
  }

  // Otherwise show date MM/DD/YY format
  return date.toLocaleDateString([], {
    month: "numeric",
    day: "numeric",
    year: "2-digit",
  })
}

// Format message preview
export function formatMessagePreview(message: Message): string {
  if (!message) return "No messages yet"

  if (message.messageType === "TEXT") {
    return (message?.content?.length ?? 0) > 30 ? message?.content?.substring(0, 30) + "..." : message.content || ""
  } else if (message.messageType === "IMAGE") {
    return "Sent an image"
  } else if (message.messageType === "FILE") {
    return "Sent a file"
  } else if (message.messageType === "VIDEO") {
    return "Sent a video"
  } else if (message.messageType === "AUDIO") {
    return "Sent an audio message"
  }

  return ""
}

// Get conversation label
export function getConversationLabel(
  conversation: any,
  currentUserId: string,
): {
  isGeneral: boolean
  isSelfChat: boolean
  displayName: string
} {
  // For channels:
  const isGeneral = conversation.type === "CHANNEL" && conversation.title?.toLowerCase() === "general"

  // For your own "notes to self" conversation:
  const isSelfChat = conversation.type === "PRIVATE" && conversation.title?.toLowerCase() === "self chat"

  // Default to conversation.title
  let displayName = conversation.title || "Untitled"

  if (conversation.type === "PRIVATE" && !isSelfChat) {
    // For a private chat, show the other user's name
    const otherParticipant = conversation.participants?.find((p: any) => p.userId !== currentUserId)
    // Use the other participant's username if it exists
    if (otherParticipant?.user?.username) {
      displayName = otherParticipant.user.username
    }
  }

  // If it's # General
  if (isGeneral) {
    displayName = "# General"
  } else if (isSelfChat) {
    displayName = "Notes to self"
  } else if (conversation.type === "CHANNEL") {
    displayName = "# " + displayName
  }

  return { isGeneral, isSelfChat, displayName }
}

// Export formatTime
export const formatTime = formatMessageTime
