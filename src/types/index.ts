// Define the basic types needed for the chat application

export enum ConversationType {
  CHANNEL = "CHANNEL",
  PRIVATE = "PRIVATE",
  GROUP = "GROUP",
}

export enum UserStatus {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
  AWAY = "AWAY",
  DO_NOT_DISTURB = "DO_NOT_DISTURB",
  INVISIBLE = "INVISIBLE",
}

export interface User {
  id: string
  username: string
  email?: string
  avatar?: string | null
  status?: UserStatus
  statusMessage?: string
  lastActive?: string
}

export interface Participant {
  userId: string
  role: string
  user: User
}

export interface Conversation {
  id: string
  type: ConversationType
  title: string | null
  participants: Participant[]
  lastMessage?: string | null
  createdAt: string
  updatedAt: string
  isPinned?: boolean
}

export interface Message {
  id: string
  content: string
  senderId: string
  sender?: {
    id: string
    username: string
    status?: UserStatus
  }
  conversationId: string
  messageType: "TEXT" | "IMAGE" | "FILE" | "VIDEO" | "AUDIO"
  createdAt: string
}
