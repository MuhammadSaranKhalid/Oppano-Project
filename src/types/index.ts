// // Define the basic types needed for the chat application

// export enum ConversationType {
//   CHANNEL = "CHANNEL",
//   PRIVATE = "PRIVATE",
//   GROUP = "GROUP",
// }

// export enum UserStatus {
//   ONLINE = "ONLINE",
//   OFFLINE = "OFFLINE",
//   AWAY = "AWAY",
//   DO_NOT_DISTURB = "DO_NOT_DISTURB",
//   INVISIBLE = "INVISIBLE",
// }

// export interface User {
//   id: string
//   username: string
//   email?: string
//   avatar?: string | null
//   status?: UserStatus
//   statusMessage?: string
//   lastActive?: string
// }

// export interface Participant {
//   userId: string
//   role: string
//   user: User
// }

// export interface Conversation {
//   id: string
//   type: ConversationType
//   title: string | null
//   participants: Participant[]
//   lastMessage?: string | null
//   createdAt: string
//   updatedAt: string
//   isPinned?: boolean
// }

// export interface Message {
//   id: string
//   content: string
//   senderId: string
//   sender?: {
//     id: string
//     username: string
//     status?: UserStatus
//   }
//   conversationId: string
//   messageType: "TEXT" | "IMAGE" | "FILE" | "VIDEO" | "AUDIO"
//   createdAt: string
// }


export enum UserStatus {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
  AWAY = "AWAY",
  DO_NOT_DISTURB = "DO_NOT_DISTURB",
}

export enum ConversationType {
  PRIVATE = "PRIVATE",
  GROUP = "GROUP",
  CHANNEL = "CHANNEL",
}

export enum ConversationParticipantRole {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export interface User {
  id: string
  username: string
  email: string
  profile_picture?: string
  status: UserStatus
  status_message?: string
  last_active: string
}

export interface Organization {
  id: string
  name: string
  domain?: string
  logo_url?: string
}

export interface ConversationParticipant {
  id: string
  conversation_id: string
  user_id: string
  role: ConversationParticipantRole
  joined_at: string
  last_read_message_id?: string
  notification_muted: boolean
  is_active: boolean
  user: User
}

export interface Conversation {
  id: string
  organization_id: string
  type: ConversationType
  title?: string
  description?: string
  avatar_url?: string
  is_archived: boolean
  last_message_id?: string
  created_at: string
  updated_at: string
  participants: ConversationParticipant[]
  last_message?: {
    content: string
    created_at: string
    sender: {
      username: string
    }
  }
  unread_count?: number
  is_pinned?: boolean
}
