// Enums matching the database schema
export enum OrgMemberRole {
    OWNER = "OWNER",
    ADMIN = "ADMIN",
    MEMBER = "MEMBER",
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

export enum MessageType {
    TEXT = "TEXT",
    IMAGE = "IMAGE",
    FILE = "FILE",
    VIDEO = "VIDEO",
    AUDIO = "AUDIO",
    SYSTEM = "SYSTEM",
}

export enum MessageStatus {
    SENT = "SENT",
    DELIVERED = "DELIVERED",
    READ = "READ",
}

export enum UserStatus {
    ONLINE = "ONLINE",
    OFFLINE = "OFFLINE",
    AWAY = "AWAY",
    DO_NOT_DISTURB = "DO_NOT_DISTURB",
}

export enum FileVisibility {
    PUBLIC = "PUBLIC",
    ORGANIZATION = "ORGANIZATION",
    PRIVATE = "PRIVATE",
}

// Interfaces matching the database schema
export interface User {
    id: string
    username: string
    email: string
    profile_picture?: string
    phone?: string
    bio?: string
    status: UserStatus
    status_message?: string
    last_active: string
    created_at: string
    updated_at: string
}

export interface Organization {
    id: string
    name: string
    domain?: string
    logo_url?: string
    description?: string
    created_at: string
    updated_at: string
}

export interface OrganizationUser {
    id: string
    organization_id: string
    user_id: string
    role: OrgMemberRole
    display_name?: string
    joined_at: string
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
    typing_at?: string
    user?: User
}

export interface Message {
    id: string
    conversation_id: string
    sender_id?: string
    content?: string
    message_type: MessageType
    parent_message_id?: string
    forwarded_from_message_id?: string
    created_at: string
    updated_at?: string
    status: MessageStatus
    is_edited: boolean
    is_deleted: boolean
    sender?: User
    reactions?: Reaction[]
    attachments?: MessageAttachment[]
}

export interface File {
    id: string
    organization_id: string
    uploader_id: string
    name: string
    original_name: string
    mime_type: string
    extension?: string
    size: number
    url: string
    thumbnail_url?: string
    visibility: FileVisibility
    metadata?: any
    uploaded_at: string
    updated_at: string
}

export interface MessageAttachment {
    id: string
    message_id: string
    file_id: string
    caption?: string
    created_at: string
    file?: File
}

export interface Reaction {
    id: string
    message_id: string
    user_id: string
    emoji: string
    created_at: string
    user?: User
}

export interface MessageReadStatus {
    id: string
    message_id: string
    user_id: string
    read_at: string
}

export interface Draft {
    id: string
    conversation_id: string
    user_id: string
    content: string
    created_at: string
    updated_at: string
}

export interface PinnedConversation {
    id: string
    conversation_id: string
    user_id: string
    pinned_at: string
}
