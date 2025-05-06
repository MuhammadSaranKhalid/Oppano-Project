import { Conversation, ConversationType } from "@types"
import { supabaseBrowserClient as supabase } from "@utils/supabase/client"

// File bucket name
export const FILE_BUCKET = "oppano"

// // User interface
// export interface User {
//     id: string
//     email: string
//     full_name: string
//     avatar_url?: string
//     job_title?: string
//     plan?: string
//   }

//   // Time session interface
//   export interface TimeSession {
//     id: string
//     user_id: string
//     start_time: string
//     end_time?: string | null
//     duration_seconds: number
//     total_break_time: number // This is correct
//     status: "ACTIVE" | "COMPLETED" | "INTERRUPTED"
//     created_at: string
//     updated_at?: string
//   }

//   // Time break interface
//   export interface TimeBreak {
//     id: string
//     session_id: string
//     start_time: string
//     end_time?: string | null
//     duration_seconds: number
//     created_at: string
//     updated_at?: string
//   }

//   // File interface
//   export interface FileItem {
//     id: string
//     name: string
//     original_name: string
//     mime_type: string
//     extension: string | null
//     size: number
//     url: string
//     thumbnail_url: string | null
//     organization_id: string
//     uploader_id: string
//     visibility: "PUBLIC" | "ORGANIZATION" | "PRIVATE"
//     metadata: any | null
//     uploaded_at: string
//     updated_at: string
//     users?: {
//       username: string | null
//     } | null
//   }

//   // Get current user
//   export async function getCurrentUser(): Promise<User | null> {
//     const { data } = await supabase.auth.getSession()

//     if (!data.session?.user) {
//       return null
//     }

//     const user = data.session.user

//     // Get additional user data from profiles table if needed
//     const { data: profileData } = await supabase
//       .from("profiles")
//       .select("full_name, avatar_url, job_title, plan")
//       .eq("id", user.id)
//       .single()

//     return {
//       id: user.id,
//       email: user.email || "",
//       full_name: profileData?.full_name || user.user_metadata?.full_name || "User",
//       avatar_url: profileData?.avatar_url || user.user_metadata?.avatar_url,
//       job_title: profileData?.job_title,
//       plan: profileData?.plan,
//     }
//   }

//   // Get current user's organization
//   export async function getCurrentOrganization() {
//     const user = await getCurrentUser()
//     if (!user) return null

//     const { data } = await supabase.from("organization_users").select("organization_id").eq("user_id", user.id).single()

//     return data?.organization_id
//   }

//   // Create a new time session
//   export async function createTimeSession(userId: string): Promise<TimeSession | null> {
//     const { data, error } = await supabase
//       .from("time_sessions")
//       .insert({
//         user_id: userId,
//         status: "ACTIVE",
//         total_break_time: 0, // This is correct
//       })
//       .select()
//       .single()

//     if (error) {
//       console.error("Error creating time session:", error)
//       throw error
//     }

//     return data
//   }

//   // End a time session
//   export async function endTimeSession(sessionId: string, durationSeconds: number): Promise<TimeSession | null> {
//     const { data, error } = await supabase
//       .from("time_sessions")
//       .update({
//         end_time: new Date().toISOString(),
//         duration_seconds: durationSeconds,
//         status: "COMPLETED",
//       })
//       .eq("id", sessionId)
//       .select()
//       .single()

//     if (error) {
//       console.error("Error ending time session:", error)
//       throw error
//     }

//     return data
//   }

//   // Create a new break
//   export async function createTimeBreak(sessionId: string): Promise<TimeBreak | null> {
//     const { data, error } = await supabase
//       .from("time_breaks")
//       .insert({
//         session_id: sessionId,
//       })
//       .select()
//       .single()

//     if (error) {
//       console.error("Error creating time break:", error)
//       throw error
//     }

//     return data
//   }

//   // End a break
//   export async function endTimeBreak(breakId: string, durationSeconds: number): Promise<TimeBreak | null> {
//     const { data, error } = await supabase
//       .from("time_breaks")
//       .update({
//         end_time: new Date().toISOString(),
//         duration_seconds: durationSeconds,
//       })
//       .eq("id", breakId)
//       .select()
//       .single()

//     if (error) {
//       console.error("Error ending time break:", error)
//       throw error
//     }

//     return data
//   }

//   // Check if file is previewable
//   export function isPreviewable(mimeType: string): boolean {
//     // Image types
//     if (mimeType.startsWith("image/")) {
//       return true
//     }

//     // PDF
//     if (mimeType === "application/pdf") {
//       return true
//     }

//     // Text files
//     if (mimeType.startsWith("text/")) {
//       return true
//     }

//     // Video files
//     if (mimeType.startsWith("video/")) {
//       return true
//     }

//     // Audio files
//     if (mimeType.startsWith("audio/")) {
//       return true
//     }

//     return false
//   }

//   // Get file icon based on mime type
//   export function getFileIcon(mimeType: string): string {
//     if (mimeType.startsWith("image/")) {
//       return "image"
//     } else if (mimeType === "application/pdf") {
//       return "file-text"
//     } else if (mimeType.startsWith("text/")) {
//       return "file-text"
//     } else if (mimeType.startsWith("video/")) {
//       return "video"
//     } else if (mimeType.startsWith("audio/")) {
//       return "music"
//     } else if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) {
//       return "table"
//     } else if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) {
//       return "presentation"
//     } else if (mimeType.includes("document") || mimeType.includes("word")) {
//       return "file-text"
//     } else {
//       return "file"
//     }
//   }

//   // Upload a file to Supabase
//   export async function uploadFile(file: File): Promise<FileItem> {
//     const user = await getCurrentUser()
//     const orgId = await getCurrentOrganization()

//     if (!user || !orgId) {
//       throw new Error("User not authenticated or not in an organization")
//     }

//     // Create a unique file name
//     const fileId = crypto.randomUUID()
//     const fileName = `${orgId}/${fileId}-${file.name}`

//     // Upload to Supabase Storage
//     const { error: uploadError } = await supabase.storage.from(FILE_BUCKET).upload(fileName, file)

//     if (uploadError) throw uploadError

//     // Get the public URL
//     const { data: urlData } = supabase.storage.from(FILE_BUCKET).getPublicUrl(fileName)

//     // Create thumbnail for images
//     let thumbnailUrl = null
//     if (file.type.startsWith("image/")) {
//       // For simplicity, we're using the same image as thumbnail
//       // In a production app, you'd resize the image
//       const thumbnailPath = `${orgId}/thumbnails/${fileId}-${file.name}`

//       try {
//         await supabase.storage.from(FILE_BUCKET).upload(thumbnailPath, file)
//         const { data: thumbUrlData } = supabase.storage.from(FILE_BUCKET).getPublicUrl(thumbnailPath)
//         thumbnailUrl = thumbUrlData.publicUrl
//       } catch (err) {
//         console.error("Error creating thumbnail:", err)
//         // Continue without thumbnail if it fails
//       }
//     }

//     // Save file metadata to database
//     const fileData = {
//       id: fileId,
//       organization_id: orgId,
//       uploader_id: user.id,
//       name: file.name,
//       original_name: file.name,
//       mime_type: file.type,
//       extension: file.name.split(".").pop() || null,
//       size: file.size,
//       url: urlData.publicUrl,
//       thumbnail_url: thumbnailUrl,
//       visibility: "ORGANIZATION" as const,
//     }

//     const { data, error: dbError } = await supabase.from("files").insert(fileData).select().single()

//     if (dbError) throw dbError

//     return data
//   }

//   // Get files for current organization
//   export async function getFiles(): Promise<FileItem[]> {
//     const orgId = await getCurrentOrganization()
//     if (!orgId) throw new Error("User not in an organization")

//     const { data, error } = await supabase
//       .from("files")
//       .select("*, users(username)")
//       .eq("organization_id", orgId)
//       .order("uploaded_at", { ascending: false })

//     if (error) throw error
//     return data || []
//   }

//   // Delete a file
//   export async function deleteFile(id: string): Promise<void> {
//     const { data } = await supabase.from("files").select("url").eq("id", id).single()

//     if (data?.url) {
//       // Extract path from URL
//       const path = data.url.split("/").slice(4).join("/")

//       // Delete from storage
//       await supabase.storage.from(FILE_BUCKET).remove([path])
//     }

//     // Delete from database
//     const { error } = await supabase.from("files").delete().eq("id", id)

//     if (error) throw error
//   }


// // User interface
// export interface User {
//     id: string
//     username: string
//     email: string
//     profile_picture: string | null
//     status: string
//     status_message: string | null
//     last_active: string | null
// }

// // Time session interface
// export interface TimeSession {
//     id: string
//     user_id: string
//     start_time: string
//     end_time?: string | null
//     duration_seconds: number
//     total_break_time: number // This is correct
//     status: "ACTIVE" | "COMPLETED" | "INTERRUPTED"
//     created_at: string
//     updated_at?: string
// }

// // Time break interface
// export interface TimeBreak {
//     id: string
//     session_id: string
//     start_time: string
//     end_time?: string | null
//     duration_seconds: number
//     created_at: string
//     updated_at?: string
// }

// // File interface
// export interface FileItem {
//     id: string
//     name: string
//     original_name: string
//     mime_type: string
//     extension: string | null
//     size: number
//     url: string
//     thumbnail_url: string | null
//     organization_id: string
//     uploader_id: string
//     visibility: "PUBLIC" | "ORGANIZATION" | "PRIVATE"
//     metadata: any | null
//     uploaded_at: string
//     updated_at: string
//     users?: {
//         username: string | null
//     } | null
// }

// // Get current user
// export async function getCurrentUser(): Promise<User | null> {
//     const { data: session } = await supabase.auth.getSession()

//     if (!session.session?.user) {
//         return null
//     }

//     const { data: userData, error } = await supabase.from("users").select("*").eq("id", session.session.user.id).single()

//     if (error || !userData) {
//         console.error("Error fetching user data:", error)
//         return null
//     }

//     return {
//         id: userData.id,
//         username: userData.username,
//         email: userData.email,
//         profile_picture: userData.profile_picture,
//         status: userData.status,
//         status_message: userData.status_message,
//         last_active: userData.last_active,
//     }
// }

// // Get current user's organization
// export async function getCurrentOrganization() {
//     const user = await getCurrentUser()
//     if (!user) return null

//     const { data, error } = await supabase
//         .from("organization_users")
//         .select("organization_id")
//         .eq("user_id", user.id)
//         .single()

//     if (error || !data) {
//         console.error("Error fetching organization:", error)
//         return null
//     }

//     return data.organization_id
// }

// // Get all conversations for the current user
// export async function getConversations(): Promise<Conversation[]> {
//     const user = await getCurrentUser()
//     if (!user) return []

//     // Get all conversations where the user is a participant
//     const { data: participantData, error: participantError } = await supabase
//         .from("conversation_participants")
//         .select(`
//         conversation_id,
//         is_active,
//         conversations:conversation_id (
//           id,
//           organization_id,
//           type,
//           title,
//           description,
//           avatar_url,
//           is_archived,
//           last_message_id,
//           created_at,
//           updated_at
//         )
//       `)
//         .eq("user_id", user.id)
//         .eq("is_active", true)

//     if (participantError || !participantData) {
//         console.error("Error fetching conversations:", participantError)
//         return []
//     }

//     // Extract conversation IDs
//     const conversationIds = participantData.filter((p) => p.conversations).map((p) => p.conversations.id)

//     if (conversationIds.length === 0) {
//         return []
//     }

//     // Get all participants for these conversations
//     const { data: allParticipants, error: participantsError } = await supabase
//         .from("conversation_participants")
//         .select(`
//         id,
//         conversation_id,
//         user_id,
//         role,
//         joined_at,
//         last_read_message_id,
//         notification_muted,
//         is_active,
//         users:user_id (
//           id,
//           username,
//           email,
//           profile_picture,
//           status,
//           status_message,
//           last_active
//         )
//       `)
//         .in("conversation_id", conversationIds)
//         .eq("is_active", true)

//     if (participantsError || !allParticipants) {
//         console.error("Error fetching participants:", participantsError)
//         return []
//     }

//     // Get last messages for these conversations
//     const { data: lastMessages, error: messagesError } = await supabase
//         .from("messages")
//         .select(`
//         id,
//         conversation_id,
//         content,
//         created_at,
//         sender:sender_id (
//           username
//         )
//       `)
//         .in(
//             "id",
//             participantData
//                 .filter((p) => p.conversations && p.conversations.last_message_id)
//                 .map((p) => p.conversations.last_message_id),
//         )

//     if (messagesError) {
//         console.error("Error fetching last messages:", messagesError)
//     }

//     // Get unread counts
//     const { data: unreadCounts, error: unreadError } = await supabase.rpc("get_unread_counts_by_conversation", {
//         user_id_param: user.id,
//     })

//     if (unreadError) {
//         console.error("Error fetching unread counts:", unreadError)
//     }

//     // Get pinned conversations
//     const { data: pinnedConversations, error: pinnedError } = await supabase
//         .from("pinned_conversations")
//         .select("conversation_id")
//         .eq("user_id", user.id)

//     if (pinnedError) {
//         console.error("Error fetching pinned conversations:", pinnedError)
//     }

//     // Build the conversations with all related data
//     const conversations = participantData
//         .filter((p) => p.conversations)
//         .map((p) => {
//             const conversation = p.conversations

//             // Get participants for this conversation
//             const participants = allParticipants
//                 .filter((participant) => participant.conversation_id === conversation.id)
//                 .map((participant) => ({
//                     id: participant.id,
//                     conversation_id: participant.conversation_id,
//                     user_id: participant.user_id,
//                     role: participant.role,
//                     joined_at: participant.joined_at,
//                     last_read_message_id: participant.last_read_message_id,
//                     notification_muted: participant.notification_muted,
//                     is_active: participant.is_active,
//                     user: participant.users,
//                 }))

//             // Get last message for this conversation
//             const lastMessage = lastMessages?.find((msg) => msg.id === conversation.last_message_id)

//             // Get unread count for this conversation
//             const unreadCount = unreadCounts?.find((count) => count.conversation_id === conversation.id)?.count || 0

//             // Check if conversation is pinned
//             const isPinned = pinnedConversations?.some((pinned) => pinned.conversation_id === conversation.id) || false

//             return {
//                 ...conversation,
//                 participants,
//                 last_message: lastMessage
//                     ? {
//                         content: lastMessage.content,
//                         created_at: lastMessage.created_at,
//                         sender: lastMessage.sender,
//                     }
//                     : undefined,
//                 unread_count: unreadCount,
//                 is_pinned: isPinned,
//             }
//         })

//     return conversations
// }

// // Function to check if a user is typing in a conversation
// export async function setUserTyping(conversationId: string, isTyping: boolean): Promise<void> {
//     const user = await getCurrentUser()
//     if (!user) return

//     const typingAt = isTyping ? new Date().toISOString() : null

//     await supabase
//         .from("conversation_participants")
//         .update({ typing_at: typingAt })
//         .eq("conversation_id", conversationId)
//         .eq("user_id", user.id)
// }

// // Function to get users who are currently typing in a conversation
// export async function getTypingUsers(conversationId: string): Promise<User[]> {
//     const user = await getCurrentUser()
//     if (!user) return []

//     const fiveSecondsAgo = new Date(Date.now() - 5000).toISOString()

//     const { data, error } = await supabase
//         .from("conversation_participants")
//         .select(`
//         users:user_id (
//           id,
//           username,
//           email,
//           profile_picture,
//           status,
//           status_message,
//           last_active
//         )
//       `)
//         .eq("conversation_id", conversationId)
//         .neq("user_id", user.id)
//         .gt("typing_at", fiveSecondsAgo)

//     if (error || !data) {
//         console.error("Error fetching typing users:", error)
//         return []
//     }

//     return data.map((item) => item.users)
// }

// // Function to pin/unpin a conversation
// export async function togglePinConversation(conversationId: string, isPinned: boolean): Promise<void> {
//     const user = await getCurrentUser()
//     if (!user) return

//     if (isPinned) {
//         // Pin the conversation
//         await supabase.from("pinned_conversations").upsert({
//             conversation_id: conversationId,
//             user_id: user.id,
//         })
//     } else {
//         // Unpin the conversation
//         await supabase.from("pinned_conversations").delete().eq("conversation_id", conversationId).eq("user_id", user.id)
//     }
// }

// // Function to create a direct message
// export async function createDirectMessage(userIds: string[]): Promise<string | null> {
//     const user = await getCurrentUser()
//     if (!user) return null

//     const orgId = await getCurrentOrganization()
//     if (!orgId) return null

//     // Start a transaction
//     const { data: conversation, error: conversationError } = await supabase
//         .from("conversations")
//         .insert({
//             organization_id: orgId,
//             type: userIds.length > 1 ? ConversationType.GROUP : ConversationType.PRIVATE,
//             title: userIds.length > 1 ? "Group Chat" : null,
//         })
//         .select()
//         .single()

//     if (conversationError || !conversation) {
//         console.error("Error creating conversation:", conversationError)
//         return null
//     }

//     // Add all participants including the current user
//     const participants = [user.id, ...userIds].map((userId) => ({
//         conversation_id: conversation.id,
//         user_id: userId,
//         role: userId === user.id ? "OWNER" : "MEMBER",
//     }))

//     const { error: participantsError } = await supabase.from("conversation_participants").insert(participants)

//     if (participantsError) {
//         console.error("Error adding participants:", participantsError)
//         return null
//     }

//     return conversation.id
// }

// // Function to create a channel
// export async function createChannel(name: string, isPrivate: boolean): Promise<string | null> {
//     const user = await getCurrentUser()
//     if (!user) return null

//     const orgId = await getCurrentOrganization()
//     if (!orgId) return null

//     // Create the channel
//     const { data: conversation, error: conversationError } = await supabase
//         .from("conversations")
//         .insert({
//             organization_id: orgId,
//             type: ConversationType.CHANNEL,
//             title: name,
//             description: `${isPrivate ? "Private" : "Public"} channel created by ${user.username}`,
//         })
//         .select()
//         .single()

//     if (conversationError || !conversation) {
//         console.error("Error creating channel:", conversationError)
//         return null
//     }

//     // Add the creator as an owner
//     const { error: participantError } = await supabase.from("conversation_participants").insert({
//         conversation_id: conversation.id,
//         user_id: user.id,
//         role: "OWNER",
//     })

//     if (participantError) {
//         console.error("Error adding participant:", participantError)
//         return null
//     }

//     return conversation.id
// }

// // Create a new time session
// export async function createTimeSession(userId: string): Promise<TimeSession | null> {
//     const { data, error } = await supabase
//         .from("time_sessions")
//         .insert({
//             user_id: userId,
//             status: "ACTIVE",
//             total_break_time: 0, // This is correct
//         })
//         .select()
//         .single()

//     if (error) {
//         console.error("Error creating time session:", error)
//         throw error
//     }

//     return data
// }

// // End a time session
// export async function endTimeSession(sessionId: string, durationSeconds: number): Promise<TimeSession | null> {
//     const { data, error } = await supabase
//         .from("time_sessions")
//         .update({
//             end_time: new Date().toISOString(),
//             duration_seconds: durationSeconds,
//             status: "COMPLETED",
//         })
//         .eq("id", sessionId)
//         .select()
//         .single()

//     if (error) {
//         console.error("Error ending time session:", error)
//         throw error
//     }

//     return data
// }

// // Create a new break
// export async function createTimeBreak(sessionId: string): Promise<TimeBreak | null> {
//     const { data, error } = await supabase
//         .from("time_breaks")
//         .insert({
//             session_id: sessionId,
//         })
//         .select()
//         .single()

//     if (error) {
//         console.error("Error creating time break:", error)
//         throw error
//     }

//     return data
// }

// // End a break
// export async function endTimeBreak(breakId: string, durationSeconds: number): Promise<TimeBreak | null> {
//     const { data, error } = await supabase
//         .from("time_breaks")
//         .update({
//             end_time: new Date().toISOString(),
//             duration_seconds: durationSeconds,
//         })
//         .eq("id", breakId)
//         .select()
//         .single()

//     if (error) {
//         console.error("Error ending time break:", error)
//         throw error
//     }

//     return data
// }

// // Check if file is previewable
// export function isPreviewable(mimeType: string): boolean {
//     // Image types
//     if (mimeType.startsWith("image/")) {
//         return true
//     }

//     // PDF
//     if (mimeType === "application/pdf") {
//         return true
//     }

//     // Text files
//     if (mimeType.startsWith("text/")) {
//         return true
//     }

//     // Video files
//     if (mimeType.startsWith("video/")) {
//         return true
//     }

//     // Audio files
//     if (mimeType.startsWith("audio/")) {
//         return true
//     }

//     return false
// }

// // Get file icon based on mime type
// export function getFileIcon(mimeType: string): string {
//     if (mimeType.startsWith("image/")) {
//         return "image"
//     } else if (mimeType === "application/pdf") {
//         return "file-text"
//     } else if (mimeType.startsWith("text/")) {
//         return "file-text"
//     } else if (mimeType.startsWith("video/")) {
//         return "video"
//     } else if (mimeType.startsWith("audio/")) {
//         return "music"
//     } else if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) {
//         return "table"
//     } else if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) {
//         return "presentation"
//     } else if (mimeType.includes("document") || mimeType.includes("word")) {
//         return "file-text"
//     } else {
//         return "file"
//     }
// }

// // Upload a file to Supabase
// export async function uploadFile(file: File): Promise<FileItem> {
//     const user = await getCurrentUser()
//     const orgId = await getCurrentOrganization()

//     if (!user || !orgId) {
//         throw new Error("User not authenticated or not in an organization")
//     }

//     // Create a unique file name
//     const fileId = crypto.randomUUID()
//     const fileName = `${orgId}/${fileId}-${file.name}`

//     // Upload to Supabase Storage
//     const { error: uploadError } = await supabase.storage.from(FILE_BUCKET).upload(fileName, file)

//     if (uploadError) throw uploadError

//     // Get the public URL
//     const { data: urlData } = supabase.storage.from(FILE_BUCKET).getPublicUrl(fileName)

//     // Create thumbnail for images
//     let thumbnailUrl = null
//     if (file.type.startsWith("image/")) {
//         // For simplicity, we're using the same image as thumbnail
//         // In a production app, you'd resize the image
//         const thumbnailPath = `${orgId}/thumbnails/${fileId}-${file.name}`

//         try {
//             await supabase.storage.from(FILE_BUCKET).upload(thumbnailPath, file)
//             const { data: thumbUrlData } = supabase.storage.from(FILE_BUCKET).getPublicUrl(thumbnailPath)
//             thumbnailUrl = thumbUrlData.publicUrl
//         } catch (err) {
//             console.error("Error creating thumbnail:", err)
//             // Continue without thumbnail if it fails
//         }
//     }

//     // Save file metadata to database
//     const fileData = {
//         id: fileId,
//         organization_id: orgId,
//         uploader_id: user.id,
//         name: file.name,
//         original_name: file.name,
//         mime_type: file.type,
//         extension: file.name.split(".").pop() || null,
//         size: file.size,
//         url: urlData.publicUrl,
//         thumbnail_url: thumbnailUrl,
//         visibility: "ORGANIZATION" as const,
//     }

//     const { data, error: dbError } = await supabase.from("files").insert(fileData).select().single()

//     if (dbError) throw dbError

//     return data
// }

// // Get files for current organization
// export async function getFiles(): Promise<FileItem[]> {
//     const orgId = await getCurrentOrganization()
//     if (!orgId) throw new Error("User not in an organization")

//     const { data, error } = await supabase
//         .from("files")
//         .select("*, users(username)")
//         .eq("organization_id", orgId)
//         .order("uploaded_at", { ascending: false })

//     if (error) throw error
//     return data || []
// }

// // Delete a file
// export async function deleteFile(id: string): Promise<void> {
//     const { data } = await supabase.from("files").select("url").eq("id", id).single()

//     if (data?.url) {
//         // Extract path from URL
//         const path = data.url.split("/").slice(4).join("/")

//         // Delete from storage
//         await supabase.storage.from(FILE_BUCKET).remove([path])
//     }

//     // Delete from database
//     const { error } = await supabase.from("files").delete().eq("id", id)

//     if (error) throw error
// }


// User interface
export interface User {
    id: string
    username: string
    email: string
    profile_picture: string | null
    status: string
    status_message: string | null
    last_active: string | null
}

// Time session interface
export interface TimeSession {
    id: string
    user_id: string
    start_time: string
    end_time?: string | null
    duration_seconds: number
    total_break_time: number // This is correct
    status: "ACTIVE" | "COMPLETED" | "INTERRUPTED"
    created_at: string
    updated_at?: string
}

// Time break interface
export interface TimeBreak {
    id: string
    session_id: string
    start_time: string
    end_time?: string | null
    duration_seconds: number
    created_at: string
    updated_at?: string
}

// File interface
export interface FileItem {
    id: string
    name: string
    original_name: string
    mime_type: string
    extension: string | null
    size: number
    url: string
    thumbnail_url: string | null
    organization_id: string
    uploader_id: string
    visibility: "PUBLIC" | "ORGANIZATION" | "PRIVATE"
    metadata: any | null
    uploaded_at: string
    updated_at: string
    users?: {
        username: string | null
    } | null
}

// Message interface
export interface Message {
    id: string
    conversation_id: string
    sender_id: string
    content: string
    type: "TEXT" | "IMAGE" | "FILE" | "SYSTEM"
    metadata: any | null
    created_at: string
    updated_at: string
    sender?: {
        username: string
        profile_picture: string | null
    }
    reactions?: MessageReaction[]
}

// Message reaction interface
export interface MessageReaction {
    id: string
    message_id: string
    user_id: string
    emoji: string
    created_at: string
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
    const { data: session } = await supabase.auth.getSession()

    if (!session.session?.user) {
        return null
    }

    const { data: userData, error } = await supabase.from("users").select("*").eq("id", session.session.user.id).single()

    if (error || !userData) {
        console.error("Error fetching user data:", error)
        return null
    }

    return {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        profile_picture: userData.profile_picture,
        status: userData.status,
        status_message: userData.status_message,
        last_active: userData.last_active,
    }
}

// Get current user's organization
export async function getCurrentOrganization() {
    const user = await getCurrentUser()
    if (!user) return null

    const { data, error } = await supabase
        .from("organization_users")
        .select("organization_id")
        .eq("user_id", user.id)
        .single()

    if (error || !data) {
        console.error("Error fetching organization:", error)
        return null
    }

    return data.organization_id
}

// Get all conversations for the current user
export async function getConversations(): Promise<Conversation[]> {
    const user = await getCurrentUser()
    if (!user) return []

    // Get all conversations where the user is a participant
    const { data: participantData, error: participantError } = await supabase
        .from("conversation_participants")
        .select(`
        conversation_id,
        is_active,
        conversations:conversation_id (
          id,
          organization_id,
          type,
          title,
          description,
          avatar_url,
          is_archived,
          last_message_id,
          created_at,
          updated_at
        )
      `)
        .eq("user_id", user.id)
        .eq("is_active", true)

    if (participantError || !participantData) {
        console.error("Error fetching conversations:", participantError)
        return []
    }

    // Extract conversation IDs
    const conversationIds = participantData.filter((p) => p.conversations).map((p: any) => p.conversations.id)

    if (conversationIds.length === 0) {
        return []
    }

    // Get all participants for these conversations
    const { data: allParticipants, error: participantsError } = await supabase
        .from("conversation_participants")
        .select(`
        id,
        conversation_id,
        user_id,
        role,
        joined_at,
        last_read_message_id,
        notification_muted,
        is_active,
        users:user_id (
          id,
          username,
          email,
          profile_picture,
          status,
          status_message,
          last_active
        )
      `)
        .in("conversation_id", conversationIds)
        .eq("is_active", true)

    if (participantsError || !allParticipants) {
        console.error("Error fetching participants:", participantsError)
        return []
    }

    // Get last messages for these conversations
    const { data: lastMessages, error: messagesError } = await supabase
        .from("messages")
        .select(`
        id,
        conversation_id,
        content,
        created_at,
        sender:sender_id (
          username
        )
      `)
        .in(
            "id",
            participantData
                .filter((p: any) => p.conversations && p.conversations.last_message_id)
                .map((p: any) => p.conversations.last_message_id),
        )

    if (messagesError) {
        console.error("Error fetching last messages:", messagesError)
    }

    // Get unread counts
    const { data: unreadCounts, error: unreadError } = await supabase.rpc("get_unread_counts_by_conversation", {
        user_id_param: user.id,
    })

    if (unreadError) {
        console.error("Error fetching unread counts:", unreadError)
    }

    // Get pinned conversations
    const { data: pinnedConversations, error: pinnedError } = await supabase
        .from("pinned_conversations")
        .select("conversation_id")
        .eq("user_id", user.id)

    if (pinnedError) {
        console.error("Error fetching pinned conversations:", pinnedError)
    }

    // Build the conversations with all related data
    const conversations = participantData
        .filter((p) => p.conversations)
        .map((p: any) => {
            const conversation = p.conversations

            // Get participants for this conversation
            const participants = allParticipants
                .filter((participant: any) => participant.conversation_id === conversation.id)
                .map((participant) => ({
                    id: participant.id,
                    conversation_id: participant.conversation_id,
                    user_id: participant.user_id,
                    role: participant.role,
                    joined_at: participant.joined_at,
                    last_read_message_id: participant.last_read_message_id,
                    notification_muted: participant.notification_muted,
                    is_active: participant.is_active,
                    user: participant.users,
                }))

            // Get last message for this conversation
            const lastMessage = lastMessages?.find((msg: any) => msg.id === conversation.last_message_id)

            // Get unread count for this conversation
            const unreadCount = unreadCounts?.find((count: any) => count.conversation_id === conversation.id)?.count || 0

            // Check if conversation is pinned
            const isPinned = pinnedConversations?.some((pinned: any) => pinned.conversation_id === conversation.id) || false

            return {
                ...conversation,
                participants,
                last_message: lastMessage
                    ? {
                        content: lastMessage.content,
                        created_at: lastMessage.created_at,
                        sender: lastMessage.sender,
                    }
                    : undefined,
                unread_count: unreadCount,
                is_pinned: isPinned,
            }
        })

    return conversations
}

// Function to check if a user is typing in a conversation
export async function setUserTyping(conversationId: string, isTyping: boolean): Promise<void> {
    const user = await getCurrentUser()
    if (!user) return

    const typingAt = isTyping ? new Date().toISOString() : null

    await supabase
        .from("conversation_participants")
        .update({ typing_at: typingAt })
        .eq("conversation_id", conversationId)
        .eq("user_id", user.id)
}

// Function to get users who are currently typing in a conversation
export async function getTypingUsers(conversationId: string): Promise<User[]> {
    const user = await getCurrentUser()
    if (!user) return []

    const fiveSecondsAgo = new Date(Date.now() - 5000).toISOString()

    const { data, error } = await supabase
        .from("conversation_participants")
        .select(`
        users:user_id (
          id,
          username,
          email,
          profile_picture,
          status,
          status_message,
          last_active
        )
      `)
        .eq("conversation_id", conversationId)
        .neq("user_id", user.id)
        .gt("typing_at", fiveSecondsAgo)

    if (error || !data) {
        console.error("Error fetching typing users:", error)
        return []
    }

    return data.map((item: any) => item.users)
}

// Function to pin/unpin a conversation
export async function togglePinConversation(conversationId: string, isPinned: boolean): Promise<void> {
    const user = await getCurrentUser()
    if (!user) return

    if (isPinned) {
        // Pin the conversation
        await supabase.from("pinned_conversations").upsert({
            conversation_id: conversationId,
            user_id: user.id,
        })
    } else {
        // Unpin the conversation
        await supabase.from("pinned_conversations").delete().eq("conversation_id", conversationId).eq("user_id", user.id)
    }
}

// Function to create a direct message
export async function createDirectMessage(userIds: string[]): Promise<string | null> {
    const user = await getCurrentUser()
    if (!user) return null

    const orgId = await getCurrentOrganization()
    if (!orgId) return null

    // Start a transaction
    const { data: conversation, error: conversationError } = await supabase
        .from("conversations")
        .insert({
            organization_id: orgId,
            type: userIds.length > 1 ? ConversationType.GROUP : ConversationType.PRIVATE,
            title: userIds.length > 1 ? "Group Chat" : null,
        })
        .select()
        .single()

    if (conversationError || !conversation) {
        console.error("Error creating conversation:", conversationError)
        return null
    }

    // Add all participants including the current user
    const participants = [user.id, ...userIds].map((userId) => ({
        conversation_id: conversation.id,
        user_id: userId,
        role: userId === user.id ? "OWNER" : "MEMBER",
    }))

    const { error: participantsError } = await supabase.from("conversation_participants").insert(participants)

    if (participantsError) {
        console.error("Error adding participants:", participantsError)
        return null
    }

    return conversation.id
}

// Function to create a channel
export async function createChannel(name: string, isPrivate: boolean): Promise<string | null> {
    const user = await getCurrentUser()
    if (!user) return null

    const orgId = await getCurrentOrganization()
    if (!orgId) return null

    // Create the channel
    const { data: conversation, error: conversationError } = await supabase
        .from("conversations")
        .insert({
            organization_id: orgId,
            type: ConversationType.CHANNEL,
            title: name,
            description: `${isPrivate ? "Private" : "Public"} channel created by ${user.username}`,
        })
        .select()
        .single()

    if (conversationError || !conversation) {
        console.error("Error creating channel:", conversationError)
        return null
    }

    // Add the creator as an owner
    const { error: participantError } = await supabase.from("conversation_participants").insert({
        conversation_id: conversation.id,
        user_id: user.id,
        role: "OWNER",
    })

    if (participantError) {
        console.error("Error adding participant:", participantError)
        return null
    }

    return conversation.id
}

// Create a new time session
export async function createTimeSession(userId: string): Promise<TimeSession | null> {
    const { data, error } = await supabase
        .from("time_sessions")
        .insert({
            user_id: userId,
            status: "ACTIVE",
            total_break_time: 0, // This is correct
        })
        .select()
        .single()

    if (error) {
        console.error("Error creating time session:", error)
        throw error
    }

    return data
}

// End a time session
export async function endTimeSession(sessionId: string, durationSeconds: number): Promise<TimeSession | null> {
    const { data, error } = await supabase
        .from("time_sessions")
        .update({
            end_time: new Date().toISOString(),
            duration_seconds: durationSeconds,
            status: "COMPLETED",
        })
        .eq("id", sessionId)
        .select()
        .single()

    if (error) {
        console.error("Error ending time session:", error)
        throw error
    }

    return data
}

// Create a new break
export async function createTimeBreak(sessionId: string): Promise<TimeBreak | null> {
    const { data, error } = await supabase
        .from("time_breaks")
        .insert({
            session_id: sessionId,
        })
        .select()
        .single()

    if (error) {
        console.error("Error creating time break:", error)
        throw error
    }

    return data
}

// End a break
export async function endTimeBreak(breakId: string, durationSeconds: number): Promise<TimeBreak | null> {
    const { data, error } = await supabase
        .from("time_breaks")
        .update({
            end_time: new Date().toISOString(),
            duration_seconds: durationSeconds,
        })
        .eq("id", breakId)
        .select()
        .single()

    if (error) {
        console.error("Error ending time break:", error)
        throw error
    }

    return data
}

// Check if file is previewable
export function isPreviewable(mimeType: string): boolean {
    // Image types
    if (mimeType.startsWith("image/")) {
        return true
    }

    // PDF
    if (mimeType === "application/pdf") {
        return true
    }

    // Text files
    if (mimeType.startsWith("text/")) {
        return true
    }

    // Video files
    if (mimeType.startsWith("video/")) {
        return true
    }

    // Audio files
    if (mimeType.startsWith("audio/")) {
        return true
    }

    return false
}

// Get file icon based on mime type
export function getFileIcon(mimeType: string): string {
    if (mimeType.startsWith("image/")) {
        return "image"
    } else if (mimeType === "application/pdf") {
        return "file-text"
    } else if (mimeType.startsWith("text/")) {
        return "file-text"
    } else if (mimeType.startsWith("video/")) {
        return "video"
    } else if (mimeType.startsWith("audio/")) {
        return "music"
    } else if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) {
        return "table"
    } else if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) {
        return "presentation"
    } else if (mimeType.includes("document") || mimeType.includes("word")) {
        return "file-text"
    } else {
        return "file"
    }
}

// Upload a file to Supabase
export async function uploadFile(file: File): Promise<FileItem> {
    const user = await getCurrentUser()
    const orgId = await getCurrentOrganization()

    if (!user || !orgId) {
        throw new Error("User not authenticated or not in an organization")
    }

    // Create a unique file name
    const fileId = crypto.randomUUID()
    const fileName = `${orgId}/${fileId}-${file.name}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage.from(FILE_BUCKET).upload(fileName, file)

    if (uploadError) throw uploadError

    // Get the public URL
    const { data: urlData } = supabase.storage.from(FILE_BUCKET).getPublicUrl(fileName)

    // Create thumbnail for images
    let thumbnailUrl = null
    if (file.type.startsWith("image/")) {
        // For simplicity, we're using the same image as thumbnail
        // In a production app, you'd resize the image
        const thumbnailPath = `${orgId}/thumbnails/${fileId}-${file.name}`

        try {
            await supabase.storage.from(FILE_BUCKET).upload(thumbnailPath, file)
            const { data: thumbUrlData } = supabase.storage.from(FILE_BUCKET).getPublicUrl(thumbnailPath)
            thumbnailUrl = thumbUrlData.publicUrl
        } catch (err) {
            console.error("Error creating thumbnail:", err)
            // Continue without thumbnail if it fails
        }
    }

    // Save file metadata to database
    const fileData = {
        id: fileId,
        organization_id: orgId,
        uploader_id: user.id,
        name: file.name,
        original_name: file.name,
        mime_type: file.type,
        extension: file.name.split(".").pop() || null,
        size: file.size,
        url: urlData.publicUrl,
        thumbnail_url: thumbnailUrl,
        visibility: "ORGANIZATION" as const,
    }

    const { data, error: dbError } = await supabase.from("files").insert(fileData).select().single()

    if (dbError) throw dbError

    return data
}

// Get files for current organization
export async function getFiles(): Promise<FileItem[]> {
    const orgId = await getCurrentOrganization()
    if (!orgId) throw new Error("User not in an organization")

    const { data, error } = await supabase
        .from("files")
        .select("*, users(username)")
        .eq("organization_id", orgId)
        .order("uploaded_at", { ascending: false })

    if (error) throw error
    return data || []
}

// Delete a file
export async function deleteFile(id: string): Promise<void> {
    const { data } = await supabase.from("files").select("url").eq("id", id).single()

    if (data?.url) {
        // Extract path from URL
        const path = data.url.split("/").slice(4).join("/")

        // Delete from storage
        await supabase.storage.from(FILE_BUCKET).remove([path])
    }

    // Delete from database
    const { error } = await supabase.from("files").delete().eq("id", id)

    if (error) throw error
}

// Get messages for a conversation
export async function getMessages(conversationId: string): Promise<Message[]> {
    const { data, error } = await supabase
        .from("messages")
        .select(`
        *,
        sender:sender_id (
          username,
          profile_picture
        ),
        reactions:message_reactions (
          id,
          user_id,
          emoji,
          created_at
        )
      `)
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })

    if (error) {
        console.error("Error fetching messages:", error)
        throw error
    }

    return data || []
}

// Send a message
export async function sendMessage(
    conversationId: string,
    content: string,
    type: "TEXT" | "IMAGE" | "FILE" | "SYSTEM" = "TEXT",
    metadata: any = null,
): Promise<Message> {
    const user = await getCurrentUser()
    if (!user) throw new Error("User not authenticated")

    // Insert the message
    const { data, error } = await supabase
        .from("messages")
        .insert({
            conversation_id: conversationId,
            sender_id: user.id,
            content,
            type,
            metadata,
        })
        .select(`
        *,
        sender:sender_id (
          username,
          profile_picture
        )
      `)
        .single()

    if (error) {
        console.error("Error sending message:", error)
        throw error
    }

    // Update the conversation's last_message_id
    await supabase
        .from("conversations")
        .update({
            last_message_id: data.id,
            updated_at: new Date().toISOString(),
        })
        .eq("id", conversationId)

    // Update the current user's last_read_message_id
    await supabase
        .from("conversation_participants")
        .update({ last_read_message_id: data.id })
        .eq("conversation_id", conversationId)
        .eq("user_id", user.id)

    return data
}

// Add a reaction to a message
export async function addMessageReaction(messageId: string, emoji: string): Promise<void> {
    const user = await getCurrentUser()
    if (!user) throw new Error("User not authenticated")

    // Check if the reaction already exists
    const { data: existingReaction } = await supabase
        .from("message_reactions")
        .select("id")
        .eq("message_id", messageId)
        .eq("user_id", user.id)
        .eq("emoji", emoji)
        .single()

    if (existingReaction) {
        // Reaction already exists, do nothing
        return
    }

    // Add the reaction
    const { error } = await supabase.from("message_reactions").insert({
        message_id: messageId,
        user_id: user.id,
        emoji,
    })

    if (error) {
        console.error("Error adding reaction:", error)
        throw error
    }
}

// Remove a reaction from a message
export async function removeMessageReaction(messageId: string, emoji: string): Promise<void> {
    const user = await getCurrentUser()
    if (!user) throw new Error("User not authenticated")

    const { error } = await supabase
        .from("message_reactions")
        .delete()
        .eq("message_id", messageId)
        .eq("user_id", user.id)
        .eq("emoji", emoji)

    if (error) {
        console.error("Error removing reaction:", error)
        throw error
    }
}

// Mark messages as read
export async function markMessagesAsRead(conversationId: string, messageId: string): Promise<void> {
    const user = await getCurrentUser()
    if (!user) return

    const { error } = await supabase
        .from("conversation_participants")
        .update({ last_read_message_id: messageId })
        .eq("conversation_id", conversationId)
        .eq("user_id", user.id)

    if (error) {
        console.error("Error marking messages as read:", error)
        throw error
    }
}

// Subscribe to new messages in a conversation
export function subscribeToMessages(conversationId: string, callback: (message: Message) => void): () => void {
    const subscription = supabase
        .channel(`messages:${conversationId}`)
        .on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "messages",
                filter: `conversation_id=eq.${conversationId}`,
            },
            (payload) => {
                // Get the full message with sender info
                supabase
                    .from("messages")
                    .select(`
              *,
              sender:sender_id (
                username,
                profile_picture
              )
            `)
                    .eq("id", payload.new.id)
                    .single()
                    .then(({ data }) => {
                        if (data) {
                            callback(data as Message)
                        }
                    })
            },
        )
        .subscribe()

    // Return unsubscribe function
    return () => {
        supabase.removeChannel(subscription)
    }
}
