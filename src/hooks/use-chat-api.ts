// "use client"

// import { useCallback } from "react"
// // import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
// import { useChatStore } from "@/store/chat-store"
// import {
//     type Conversation,
//     type ConversationParticipant,
//     type Message,
//     type Reaction,
//     MessageType,
//     MessageStatus,
// } from "@/interfaces"
// import type { Attachment } from "@/components/chat/enhanced-chat-input"
// import { supabaseBrowserClient as supabase } from "@utils/supabase/client"

// export function useChatApi() {
//     const {
//         currentUser,
//         setConversations,
//         addConversation,
//         updateConversation,
//         setParticipants,
//         setMessages,
//         addMessage,
//         updateMessage,
//         addReaction,
//         removeReaction,
//         setPinnedConversations,
//         setIsLoadingConversations,
//         setIsLoadingMessages,
//         setUnreadCount,
//         clearUnreadCount,
//     } = useChatStore()

//     // const supabase = createClientComponentClient()

//     // Fetch all conversations for the current user
//     const fetchConversations = useCallback(async () => {
//         if (!currentUser) return

//         setIsLoadingConversations(true)

//         try {
//             // Fetch conversations where the current user is a participant
//             const { data: participantsData, error: participantsError } = await supabase
//                 .from("conversation_participants")
//                 .select("conversation_id")
//                 .eq("user_id", currentUser.id)
//                 .eq("is_active", true)

//             if (participantsError) {
//                 throw participantsError
//             }

//             if (!participantsData || participantsData.length === 0) {
//                 setConversations([])
//                 setIsLoadingConversations(false)
//                 return
//             }

//             const conversationIds = participantsData.map((p) => p.conversation_id)

//             // Fetch conversation details
//             const { data: conversationsData, error: conversationsError } = await supabase
//                 .from("conversations")
//                 .select("*")
//                 .in("id", conversationIds)
//                 .order("updated_at", { ascending: false })

//             if (conversationsError) {
//                 throw conversationsError
//             }

//             // Fetch pinned conversations
//             const { data: pinnedData, error: pinnedError } = await supabase
//                 .from("pinned_conversations")
//                 .select("conversation_id")
//                 .eq("user_id", currentUser.id)

//             if (pinnedError) {
//                 console.error("Error fetching pinned conversations:", pinnedError)
//             }

//             // Fetch unread message counts
//             const { data: unreadData, error: unreadError } = await supabase.rpc("get_unread_message_counts", {
//                 user_id: currentUser.id,
//             })

//             if (unreadError) {
//                 console.error("Error fetching unread counts:", unreadError)
//             }

//             // Set conversations in store
//             if (conversationsData) {
//                 setConversations(conversationsData as Conversation[])
//             }

//             // Set pinned conversations in store
//             if (pinnedData) {
//                 const pinnedIds = pinnedData.map((p) => p.conversation_id)
//                 setPinnedConversations(pinnedIds)
//             }

//             // // Set unread counts in store
//             if (unreadData) {
//                 unreadData.forEach((item: { conversation_id: string; count: number }) => {
//                     setUnreadCount(item.conversation_id, item.count)
//                 })
//             }
//         } catch (error) {
//             console.error("Error fetching conversations:", error)
//         } finally {
//             setIsLoadingConversations(false)
//         }
//     }, [currentUser, supabase, setConversations, setPinnedConversations, setIsLoadingConversations, setUnreadCount])

//     // Fetch participants for a conversation
//     const fetchParticipants = useCallback(
//         async (conversationId: string) => {
//             try {
//                 const { data, error } = await supabase
//                     .from("conversation_participants")
//                     .select(
//                         `
//             *,
//             user:users(*)
//           `,
//                     )
//                     .eq("conversation_id", conversationId)
//                     .eq("is_active", true)

//                 if (error) {
//                     throw error
//                 }

//                 if (data) {
//                     setParticipants(conversationId, data as unknown as ConversationParticipant[])
//                 }
//             } catch (error) {
//                 console.error("Error fetching participants:", error)
//             }
//         },
//         [supabase, setParticipants],
//     )

//     // Fetch messages for a conversation
//     const fetchMessages = useCallback(
//         async (conversationId: string) => {
//             setIsLoadingMessages(true)

//             try {
//                 const { data, error } = await supabase
//                     .from("messages")
//                     .select(
//                         `
//           *,
//           sender:users(*),
//           reactions(*),
//           attachments:message_attachments(
//             *,
//             file:files(*)
//           )
//         `,
//                     )
//                     .eq("conversation_id", conversationId)
//                     .eq("is_deleted", false)
//                     .order("created_at", { ascending: true })

//                 if (error) {
//                     throw error
//                 }

//                 if (data) {
//                     setMessages(conversationId, data as unknown as Message[])
//                     clearUnreadCount(conversationId)

//                     // Mark messages as read
//                     if (currentUser) {
//                         // Get the last message
//                         const lastMessage = data[data.length - 1]
//                         if (lastMessage) {
//                             await markMessageAsRead(lastMessage.id)
//                         }
//                     }
//                 }
//             } catch (error) {
//                 console.error("Error fetching messages:", error)
//             } finally {
//                 setIsLoadingMessages(false)
//             }
//         },
//         [supabase, setMessages, setIsLoadingMessages, clearUnreadCount, currentUser],
//     )

//     // Send a message
//     const sendMessage = useCallback(
//         async (
//             conversationId: string,
//             content: string,
//             attachments: Attachment[] = [],
//             parentMessageId?: string,
//         ): Promise<Message | null> => {
//             if (!currentUser) return null

//             try {
//                 // Determine message type based on attachments
//                 let messageType = MessageType.TEXT
//                 if (attachments.length > 0) {
//                     const firstAttachment = attachments[0]
//                     if (firstAttachment.type === "image") {
//                         messageType = MessageType.IMAGE
//                     } else if (firstAttachment.type === "video") {
//                         messageType = MessageType.VIDEO
//                     } else if (firstAttachment.type === "audio") {
//                         messageType = MessageType.AUDIO
//                     } else {
//                         messageType = MessageType.FILE
//                     }
//                 }

//                 // Create the message
//                 const { data, error } = await supabase
//                     .from("messages")
//                     .insert({
//                         conversation_id: conversationId,
//                         sender_id: currentUser.id,
//                         content,
//                         message_type: messageType,
//                         parent_message_id: parentMessageId,
//                         created_at: new Date().toISOString(),
//                         status: MessageStatus.SENT,
//                         is_edited: false,
//                         is_deleted: false,
//                     })
//                     .select()
//                     .single()

//                 if (error) {
//                     throw error
//                 }

//                 if (data) {
//                     // Create message attachments if any
//                     if (attachments.length > 0) {
//                         for (const attachment of attachments) {
//                             await supabase.from("message_attachments").insert({
//                                 message_id: data.id,
//                                 file_id: attachment.id,
//                                 created_at: new Date().toISOString(),
//                             })
//                         }
//                     }

//                     // Update conversation's last_message_id and updated_at
//                     await supabase
//                         .from("conversations")
//                         .update({
//                             last_message_id: data.id,
//                             updated_at: new Date().toISOString(),
//                         })
//                         .eq("id", conversationId)

//                     // Fetch the complete message with sender info
//                     const { data: completeMessage, error: fetchError } = await supabase
//                         .from("messages")
//                         .select(
//                             `
//               *,
//               sender:users(*),
//               attachments:message_attachments(
//                 *,
//                 file:files(*)
//               )
//             `,
//                         )
//                         .eq("id", data.id)
//                         .single()

//                     if (fetchError) {
//                         console.error("Error fetching complete message:", fetchError)
//                         return data as unknown as Message
//                     }

//                     return completeMessage as unknown as Message
//                 }
//             } catch (error) {
//                 console.error("Error sending message:", error)
//             }

//             return null
//         },
//         [currentUser, supabase],
//     )

//     // Edit a message
//     const editMessage = useCallback(
//         async (messageId: string, content: string): Promise<Message | null> => {
//             if (!currentUser) return null

//             try {
//                 // First, check if the message belongs to the current user
//                 const { data: messageData, error: messageError } = await supabase
//                     .from("messages")
//                     .select("*")
//                     .eq("id", messageId)
//                     .eq("sender_id", currentUser.id)
//                     .single()

//                 if (messageError) {
//                     throw new Error("Message not found or you don't have permission to edit it")
//                 }

//                 // Update the message
//                 const { data, error } = await supabase
//                     .from("messages")
//                     .update({
//                         content,
//                         is_edited: true,
//                         updated_at: new Date().toISOString(),
//                     })
//                     .eq("id", messageId)
//                     .select()
//                     .single()

//                 if (error) {
//                     throw error
//                 }

//                 // Fetch the complete message with sender info
//                 const { data: completeMessage, error: fetchError } = await supabase
//                     .from("messages")
//                     .select(
//                         `
//             *,
//             sender:users(*),
//             reactions(*),
//             attachments:message_attachments(
//               *,
//               file:files(*)
//             )
//           `,
//                     )
//                     .eq("id", messageId)
//                     .single()

//                 if (fetchError) {
//                     console.error("Error fetching complete message:", fetchError)
//                     return data as unknown as Message
//                 }

//                 return completeMessage as unknown as Message
//             } catch (error) {
//                 console.error("Error editing message:", error)
//                 return null
//             }
//         },
//         [currentUser, supabase],
//     )

//     // React to a message
//     const reactToMessage = useCallback(
//         async (messageId: string, emoji: string): Promise<Reaction | null> => {
//             if (!currentUser) return null

//             try {
//                 const { data, error } = await supabase
//                     .from("reactions")
//                     .insert({
//                         message_id: messageId,
//                         user_id: currentUser.id,
//                         emoji,
//                         created_at: new Date().toISOString(),
//                     })
//                     .select()
//                     .single()

//                 if (error) {
//                     throw error
//                 }

//                 if (data) {
//                     return data as unknown as Reaction
//                 }
//             } catch (error) {
//                 console.error("Error adding reaction:", error)
//             }

//             return null
//         },
//         [currentUser, supabase],
//     )

//     // Remove a reaction from a message
//     const removeReactionFromMessage = useCallback(
//         async (messageId: string, reactionId: string): Promise<boolean> => {
//             try {
//                 const { error } = await supabase.from("reactions").delete().eq("id", reactionId)

//                 if (error) {
//                     throw error
//                 }

//                 return true
//             } catch (error) {
//                 console.error("Error removing reaction:", error)
//                 return false
//             }
//         },
//         [supabase],
//     )

//     // Mark a message as read
//     const markMessageAsRead = useCallback(
//         async (messageId: string): Promise<boolean> => {
//             if (!currentUser) return false

//             try {
//                 // Check if already marked as read
//                 const { data: existingData, error: checkError } = await supabase
//                     .from("message_read_status")
//                     .select("*")
//                     .eq("message_id", messageId)
//                     .eq("user_id", currentUser.id)
//                     .maybeSingle()

//                 if (checkError) {
//                     throw checkError
//                 }

//                 // If not already marked as read, insert new read status
//                 if (!existingData) {
//                     const { error } = await supabase.from("message_read_status").insert({
//                         message_id: messageId,
//                         user_id: currentUser.id,
//                         read_at: new Date().toISOString(),
//                     })

//                     if (error) {
//                         throw error
//                     }
//                 }

//                 return true
//             } catch (error) {
//                 console.error("Error marking message as read:", error)
//                 return false
//             }
//         },
//         [currentUser, supabase],
//     )

//     // Update typing status
//     const updateTypingStatus = useCallback(
//         async (conversationId: string, isTyping: boolean): Promise<boolean> => {
//             if (!currentUser) return false

//             try {
//                 // Find the participant record
//                 const { data, error } = await supabase
//                     .from("conversation_participants")
//                     .select("id")
//                     .eq("conversation_id", conversationId)
//                     .eq("user_id", currentUser.id)
//                     .single()

//                 if (error) {
//                     throw error
//                 }

//                 if (data) {
//                     // Update typing status
//                     const { error: updateError } = await supabase
//                         .from("conversation_participants")
//                         .update({
//                             typing_at: isTyping ? new Date().toISOString() : null,
//                         })
//                         .eq("id", data.id)

//                     if (updateError) {
//                         throw updateError
//                     }

//                     return true
//                 }
//             } catch (error) {
//                 console.error("Error updating typing status:", error)
//             }

//             return false
//         },
//         [currentUser, supabase],
//     )

//     // Save draft
//     const saveDraft = useCallback(
//         async (conversationId: string, content: string): Promise<boolean> => {
//             if (!currentUser || !content.trim()) return false

//             try {
//                 // Check if a draft already exists
//                 const { data: existingDraft, error: checkError } = await supabase
//                     .from("drafts")
//                     .select("id")
//                     .eq("conversation_id", conversationId)
//                     .eq("user_id", currentUser.id)
//                     .maybeSingle()

//                 if (checkError) {
//                     throw checkError
//                 }

//                 if (existingDraft) {
//                     // Update existing draft
//                     const { error } = await supabase
//                         .from("drafts")
//                         .update({
//                             content,
//                             updated_at: new Date().toISOString(),
//                         })
//                         .eq("id", existingDraft.id)

//                     if (error) {
//                         throw error
//                     }
//                 } else {
//                     // Create new draft
//                     const { error } = await supabase.from("drafts").insert({
//                         conversation_id: conversationId,
//                         user_id: currentUser.id,
//                         content,
//                         created_at: new Date().toISOString(),
//                         updated_at: new Date().toISOString(),
//                     })

//                     if (error) {
//                         throw error
//                     }
//                 }

//                 return true
//             } catch (error) {
//                 console.error("Error saving draft:", error)
//                 return false
//             }
//         },
//         [currentUser, supabase],
//     )



//     return {
//         fetchConversations,
//         fetchParticipants,
//         fetchMessages,
//         sendMessage,
//         editMessage,
//         reactToMessage,
//         removeReactionFromMessage,
//         markMessageAsRead,
//         updateTypingStatus,
//         saveDraft,
//     }
// }

"use client"

import { useCallback } from "react"
// import { useSupabase } from "@/providers/supabase-provider"
import { supabaseBrowserClient as supabase } from "@utils/supabase/client"
import { useChatStore } from "@/store/chat-store"
import {
    type Conversation,
    type ConversationParticipant,
    type Message,
    type Reaction,
    MessageType,
    MessageStatus,
    User,
} from "@/interfaces"
import type { Attachment } from "@/components/chat/enhanced-chat-input"
import { useRouter } from "next/navigation"

export function useChatApi() {
    const router = useRouter()

    const {
        currentUser,
        setConversations,
        addConversation,
        updateConversation,
        setParticipants,
        setMessages,
        addMessage,
        updateMessage,
        addReaction,
        removeReaction,
        setPinnedConversations,
        setIsLoadingConversations,
        setIsLoadingMessages,
        setUnreadCount,
        clearUnreadCount,
    } = useChatStore()

    //   const { supabase } = useSupabase()

    // Fetch all conversations for the current user
    const fetchConversations = useCallback(async () => {
        if (!currentUser || !supabase) return

        setIsLoadingConversations(true)

        try {
            // Fetch conversations where the current user is a participant
            const { data: participantsData, error: participantsError } = await supabase
                .from("conversation_participants")
                .select("conversation_id")
                .eq("user_id", currentUser.id)
                .eq("is_active", true)

            if (participantsError) {
                throw participantsError
            }

            if (!participantsData || participantsData.length === 0) {
                setConversations([])
                setIsLoadingConversations(false)
                return
            }

            const conversationIds = participantsData.map((p) => p.conversation_id)

            // Fetch conversation details
            const { data: conversationsData, error: conversationsError } = await supabase
                .from("conversations")
                .select("*")
                .in("id", conversationIds)
                .order("updated_at", { ascending: false })

            if (conversationsError) {
                throw conversationsError
            }

            // Fetch pinned conversations
            const { data: pinnedData, error: pinnedError } = await supabase
                .from("pinned_conversations")
                .select("conversation_id")
                .eq("user_id", currentUser.id)

            if (pinnedError) {
                console.error("Error fetching pinned conversations:", pinnedError)
            }

            // Fetch unread message counts
            const { data: unreadData, error: unreadError } = await supabase.rpc("get_unread_message_counts", {
                user_id: currentUser.id,
            })

            if (unreadError) {
                console.error("Error fetching unread counts:", unreadError)
            }

            // Set conversations in store
            if (conversationsData) {
                setConversations(conversationsData as Conversation[])
            }

            // Set pinned conversations in store
            // if (pinnedData) {
            //     const pinnedIds = pinnedData.map((p) => p.conversation_id)
            //     setPinnedConversations(pinnedIds)
            // }
            // Set pinned conversations in store
            if (pinnedData) {
                const pinnedIds = pinnedData.map((p) => p.conversation_id)
                setPinnedConversations(pinnedIds)
            } else {
                // Reset pinned conversations if none found
                setPinnedConversations([])
            }

            // Set unread counts in store
            if (unreadData) {
                unreadData.forEach((item: { conversation_id: string; count: number }) => {
                    setUnreadCount(item.conversation_id, item.count)
                })
            }
        } catch (error) {
            console.error("Error fetching conversations:", error)
        } finally {
            setIsLoadingConversations(false)
        }
    }, [currentUser, supabase, setConversations, setPinnedConversations, setIsLoadingConversations, setUnreadCount])

    // Fetch participants for a conversation
    const fetchParticipants = useCallback(
        async (conversationId: string) => {
            if (!supabase) return

            try {
                const { data, error } = await supabase
                    .from("conversation_participants")
                    .select(
                        `
                        *,
                        user:users(*)
                        `,
                    )
                    .eq("conversation_id", conversationId)
                    .eq("is_active", true)

                if (error) {
                    throw error
                }

                if (data) {
                    setParticipants(conversationId, data as unknown as ConversationParticipant[])
                }
            } catch (error) {
                console.error("Error fetching participants:", error)
            }
        },
        [supabase, setParticipants],
    )

    // Fetch messages for a conversation
    const fetchMessages = useCallback(
        async (conversationId: string) => {
            if (!supabase) return

            setIsLoadingMessages(true)

            try {
                const { data, error } = await supabase
                    .from("messages")
                    .select(
                        `
                        *,
                        sender:users(*),
                        reactions(*),
                        attachments:message_attachments(
                            *,
                            file:files(*)
                        )
                        `,
                    )
                    .eq("conversation_id", conversationId)
                    .eq("is_deleted", false)
                    .order("created_at", { ascending: true })

                if (error) {
                    throw error
                }

                if (data) {
                    setMessages(conversationId, data as unknown as Message[])
                    clearUnreadCount(conversationId)

                    // Mark messages as read
                    if (currentUser) {
                        // Get the last message
                        const lastMessage = data[data.length - 1]
                        if (lastMessage) {
                            await markMessageAsRead(lastMessage.id)
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching messages:", error)
            } finally {
                setIsLoadingMessages(false)
            }
        },
        [supabase, setMessages, setIsLoadingMessages, clearUnreadCount, currentUser],
    )

    // Send a message
    const sendMessage = useCallback(
        async (
            conversationId: string,
            content: string,
            attachments: Attachment[] = [],
            parentMessageId?: string,
        ): Promise<Message | null> => {
            if (!currentUser || !supabase) return null

            try {
                // Determine message type based on attachments
                let messageType = MessageType.TEXT
                if (attachments.length > 0) {
                    const firstAttachment = attachments[0]
                    if (firstAttachment.type === "image") {
                        messageType = MessageType.IMAGE
                    } else if (firstAttachment.type === "video") {
                        messageType = MessageType.VIDEO
                    } else if (firstAttachment.type === "audio") {
                        messageType = MessageType.AUDIO
                    } else {
                        messageType = MessageType.FILE
                    }
                }

                // Create the message
                const { data, error } = await supabase
                    .from("messages")
                    .insert({
                        conversation_id: conversationId,
                        sender_id: currentUser.id,
                        content,
                        message_type: messageType,
                        parent_message_id: parentMessageId,
                        created_at: new Date().toISOString(),
                        status: MessageStatus.SENT,
                        is_edited: false,
                        is_deleted: false,
                    })
                    .select()
                    .single()

                if (error) {
                    throw error
                }

                if (data) {
                    // Create message attachments if any
                    if (attachments.length > 0) {
                        for (const attachment of attachments) {
                            await supabase.from("message_attachments").insert({
                                message_id: data.id,
                                file_id: attachment.id,
                                created_at: new Date().toISOString(),
                            })
                        }
                    }

                    // Update conversation's last_message_id and updated_at
                    await supabase
                        .from("conversations")
                        .update({
                            last_message_id: data.id,
                            updated_at: new Date().toISOString(),
                        })
                        .eq("id", conversationId)

                    // Fetch the complete message with sender info
                    const { data: completeMessage, error: fetchError } = await supabase
                        .from("messages")
                        .select(
                            `
                            *,
                            sender:users(*),
                            attachments:message_attachments(
                                *,
                                file:files(*)
                            )
                            `,
                        )
                        .eq("id", data.id)
                        .single()

                    if (fetchError) {
                        console.error("Error fetching complete message:", fetchError)
                        return data as unknown as Message
                    }

                    return completeMessage as unknown as Message
                }
            } catch (error) {
                console.error("Error sending message:", error)
            }

            return null
        },
        [currentUser, supabase],
    )

    // Edit a message
    const editMessage = useCallback(
        async (messageId: string, content: string): Promise<Message | null> => {
            if (!currentUser || !supabase) return null

            try {
                // First, check if the message belongs to the current user
                const { data: messageData, error: messageError } = await supabase
                    .from("messages")
                    .select("*")
                    .eq("id", messageId)
                    .eq("sender_id", currentUser.id)
                    .single()

                if (messageError) {
                    throw new Error("Message not found or you don't have permission to edit it")
                }

                // Update the message
                const { data, error } = await supabase
                    .from("messages")
                    .update({
                        content,
                        is_edited: true,
                        updated_at: new Date().toISOString(),
                    })
                    .eq("id", messageId)
                    .select()
                    .single()

                if (error) {
                    throw error
                }

                // Fetch the complete message with sender info
                const { data: completeMessage, error: fetchError } = await supabase
                    .from("messages")
                    .select(
                        `
                        *,
                        sender:users(*),
                        reactions(*),
                        attachments:message_attachments(
                            *,
                            file:files(*)
                        )
                        `,
                    )
                    .eq("id", messageId)
                    .single()

                if (fetchError) {
                    console.error("Error fetching complete message:", fetchError)
                    return data as unknown as Message
                }

                return completeMessage as unknown as Message
            } catch (error) {
                console.error("Error editing message:", error)
                return null
            }
        },
        [currentUser, supabase],
    )

    // React to a message
    const reactToMessage = useCallback(
        async (messageId: string, emoji: string): Promise<Reaction | null> => {
            if (!currentUser || !supabase) return null

            try {
                const { data, error } = await supabase
                    .from("reactions")
                    .insert({
                        message_id: messageId,
                        user_id: currentUser.id,
                        emoji,
                        created_at: new Date().toISOString(),
                    })
                    .select()
                    .single()

                if (error) {
                    throw error
                }

                if (data) {
                    return data as unknown as Reaction
                }
            } catch (error) {
                console.error("Error adding reaction:", error)
            }

            return null
        },
        [currentUser, supabase],
    )

    // Remove a reaction from a message
    const removeReactionFromMessage = useCallback(
        async (messageId: string, reactionId: string): Promise<boolean> => {
            if (!supabase) return false

            try {
                const { error } = await supabase.from("reactions").delete().eq("id", reactionId)

                if (error) {
                    throw error
                }

                return true
            } catch (error) {
                console.error("Error removing reaction:", error)
                return false
            }
        },
        [supabase],
    )

    // Mark a message as read
    const markMessageAsRead = useCallback(
        async (messageId: string): Promise<boolean> => {
            if (!currentUser || !supabase) return false

            try {
                // Check if already marked as read
                const { data: existingData, error: checkError } = await supabase
                    .from("message_read_status")
                    .select("*")
                    .eq("message_id", messageId)
                    .eq("user_id", currentUser.id)
                    .maybeSingle()

                if (checkError) {
                    throw checkError
                }

                // If not already marked as read, insert new read status
                if (!existingData) {
                    const { error } = await supabase.from("message_read_status").insert({
                        message_id: messageId,
                        user_id: currentUser.id,
                        read_at: new Date().toISOString(),
                    })

                    if (error) {
                        throw error
                    }
                }

                return true
            } catch (error) {
                console.error("Error marking message as read:", error)
                return false
            }
        },
        [currentUser, supabase],
    )

    // Update typing status
    const updateTypingStatus = useCallback(
        async (conversationId: string, isTyping: boolean): Promise<boolean> => {
            if (!currentUser || !supabase) return false

            try {
                // Find the participant record
                const { data, error } = await supabase
                    .from("conversation_participants")
                    .select("id")
                    .eq("conversation_id", conversationId)
                    .eq("user_id", currentUser.id)
                    .single()

                if (error) {
                    throw error
                }

                if (data) {
                    // Update typing status
                    const { error: updateError } = await supabase
                        .from("conversation_participants")
                        .update({
                            typing_at: isTyping ? new Date().toISOString() : null,
                        })
                        .eq("id", data.id)

                    if (updateError) {
                        throw updateError
                    }

                    return true
                }
            } catch (error) {
                console.error("Error updating typing status:", error)
            }

            return false
        },
        [currentUser, supabase],
    )

    // Save draft
    const saveDraft = useCallback(
        async (conversationId: string, content: string): Promise<boolean> => {
            if (!currentUser || !supabase || !content.trim()) return false

            try {
                // Check if a draft already exists
                const { data: existingDraft, error: checkError } = await supabase
                    .from("drafts")
                    .select("id")
                    .eq("conversation_id", conversationId)
                    .eq("user_id", currentUser.id)
                    .maybeSingle()

                if (checkError) {
                    throw checkError
                }

                if (existingDraft) {
                    // Update existing draft
                    const { error } = await supabase
                        .from("drafts")
                        .update({
                            content,
                            updated_at: new Date().toISOString(),
                        })
                        .eq("id", existingDraft.id)

                    if (error) {
                        throw error
                    }
                } else {
                    // Create new draft
                    const { error } = await supabase.from("drafts").insert({
                        conversation_id: conversationId,
                        user_id: currentUser.id,
                        content,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    })

                    if (error) {
                        throw error
                    }
                }

                return true
            } catch (error) {
                console.error("Error saving draft:", error)
                return false
            }
        },
        [currentUser, supabase],
    )

    // Create a channel
    const createChannel = useCallback(
        async (channelData: { name: string; isPrivate: boolean }): Promise<Conversation | null> => {
            if (!currentUser || !supabase) return null

            try {
                // Get the organization ID
                const { data: orgUser, error: orgError } = await supabase
                    .from("organization_users")
                    .select("organization_id")
                    .eq("user_id", currentUser.id)
                    .single()

                if (orgError) {
                    throw new Error("Failed to get organization")
                }

                const organizationId = orgUser.organization_id

                // Create the conversation (channel)
                const { data: conversation, error: convError } = await supabase
                    .from("conversations")
                    .insert({
                        organization_id: organizationId,
                        type: "CHANNEL",
                        title: channelData.name,
                        is_archived: false,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    })
                    .select()
                    .single()

                if (convError) {
                    throw new Error("Failed to create channel")
                }

                // Add the creator as a participant with OWNER role
                const { error: partError } = await supabase.from("conversation_participants").insert({
                    conversation_id: conversation.id,
                    user_id: currentUser.id,
                    role: "OWNER",
                    joined_at: new Date().toISOString(),
                    is_active: true,
                })

                if (partError) {
                    throw new Error("Failed to add participant")
                }

                // Create a system message
                const { error: msgError } = await supabase.from("messages").insert({
                    conversation_id: conversation.id,
                    sender_id: currentUser.id,
                    content: `Channel #${channelData.name} created by ${currentUser.username}`,
                    message_type: "TEXT",
                    created_at: new Date().toISOString(),
                    status: "SENT",
                    is_edited: false,
                    is_deleted: false,
                })

                if (msgError) {
                    console.error("Error creating system message:", msgError)
                }

                // Add the channel to the store
                const newChannel = {
                    ...conversation,
                    is_private: channelData.isPrivate,
                } as Conversation

                // addConversation(newChannel)
                await fetchConversations()
                // Navigate to the new channel
                router.push(`/dashboard/replies/${conversation.id}`)

                return newChannel
            } catch (error) {
                console.error("Error in createChannel:", error)
                return null
            }
        },
        [currentUser, supabase, addConversation],
    )

    // Create a direct message
    const createDirectMessage = useCallback(
        async (users: any[]): Promise<Conversation | null> => {
            if (!currentUser || !supabase) return null

            try {
                // Get the organization ID
                const { data: orgUser, error: orgError } = await supabase
                    .from("organization_users")
                    .select("organization_id")
                    .eq("user_id", currentUser.id)
                    .single()

                if (orgError) {
                    throw new Error("Failed to get organization")
                }

                const organizationId = orgUser.organization_id

                // Determine if this is a private or group conversation
                const isGroup = users.length > 1
                const type = isGroup ? "GROUP" : "PRIVATE"

                // For private conversations, check if a conversation already exists
                if (!isGroup) {
                    const otherUserId = users[0].id

                    // Check if a direct message already exists between these two users
                    const { data: existingConvs, error: existingError } = await supabase
                        .from("conversation_participants")
                        .select(`
                            conversation_id,
                            conversations:conversation_id(
                                id, type, title, avatar_url
                            )
                        `)
                        .eq("user_id", currentUser.id)
                        .eq("is_active", true)

                    if (!existingError && existingConvs && existingConvs.length > 0) {
                        // Get all conversation IDs the current user is part of
                        const currentUserConvIds = existingConvs.map((c) => c.conversation_id)

                        // Find conversations where the other user is also a participant
                        const { data: sharedConvs, error: sharedError } = await supabase
                            .from("conversation_participants")
                            .select("conversation_id, conversations:conversation_id(id, type)")
                            .eq("user_id", otherUserId)
                            .eq("is_active", true)
                            .in("conversation_id", currentUserConvIds)

                        if (!sharedError && sharedConvs && sharedConvs.length > 0) {
                            // Find a private conversation between these two users
                            const existingDM = sharedConvs.find((c: any) => c.conversations && c.conversations.type === "PRIVATE")

                            if (existingDM && existingDM.conversations) {
                                // Return the existing conversation
                                const { data: fullConv, error: fullConvError } = await supabase
                                    .from("conversations")
                                    .select("*")
                                    .eq("id", (existingDM as any).conversations.id)
                                    .single()

                                if (!fullConvError && fullConv) {
                                    return fullConv as Conversation
                                }
                            }
                        }
                    }
                }

                // Create a new conversation
                const title = isGroup ? users.map((u) => u.username).join(", ") : users[0].username

                const { data: conversation, error: convError } = await supabase
                    .from("conversations")
                    .insert({
                        organization_id: organizationId,
                        type,
                        title,
                        is_archived: false,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    })
                    .select()
                    .single()

                if (convError) {
                    throw new Error("Failed to create conversation")
                }

                // Add all users as participants
                const participants = [
                    // Add current user
                    {
                        conversation_id: conversation.id,
                        user_id: currentUser.id,
                        role: "OWNER",
                        joined_at: new Date().toISOString(),
                        is_active: true,
                    },
                    // Add selected users
                    ...users.map((user) => ({
                        conversation_id: conversation.id,
                        user_id: user.id,
                        role: "MEMBER",
                        joined_at: new Date().toISOString(),
                        is_active: true,
                    })),
                ]

                const { error: partError } = await supabase.from("conversation_participants").insert(participants)

                if (partError) {
                    throw new Error("Failed to add participants")
                }

                // Create a system message
                let systemMessage = ""
                if (isGroup) {
                    systemMessage = `Group conversation created by ${currentUser.username}`
                } else {
                    systemMessage = `Conversation started with ${users[0].username}`
                }

                const { error: msgError } = await supabase.from("messages").insert({
                    conversation_id: conversation.id,
                    sender_id: currentUser.id,
                    content: systemMessage,
                    message_type: "TEXT",
                    created_at: new Date().toISOString(),
                    status: "SENT",
                    is_edited: false,
                    is_deleted: false,
                })

                if (msgError) {
                    console.error("Error creating system message:", msgError)
                }

                // Add the conversation to the store
                const newConversation = {
                    ...conversation,
                    participants: participants.map((p) => ({ user_id: p.user_id, role: p.role })),
                } as Conversation

                // addConversation(newConversation)

                return newConversation
            } catch (error) {
                console.error("Error in createDirectMessage:", error)
                return null
            }
        },
        [currentUser, supabase, addConversation],
    )

    // Pin a conversation
    const pinConversation = useCallback(
        async (conversationId: string): Promise<boolean> => {
            if (!currentUser || !supabase) return false

            try {
                const { error } = await supabase.from("pinned_conversations").insert({
                    conversation_id: conversationId,
                    user_id: currentUser.id,
                    pinned_at: new Date().toISOString(),
                })

                if (error) {
                    throw error
                }

                // Update the store
                // setPinnedConversations([...(currentUser.pinnedConversationIds || []), conversationId])

                return true
            } catch (error) {
                console.error("Error pinning conversation:", error)
                return false
            }
        },
        [currentUser, supabase, setPinnedConversations],
    )

    // Unpin a conversation
    const unpinConversation = useCallback(
        async (conversationId: string): Promise<boolean> => {
            if (!currentUser || !supabase) return false

            try {
                const { error } = await supabase
                    .from("pinned_conversations")
                    .delete()
                    .eq("conversation_id", conversationId)
                    .eq("user_id", currentUser.id)

                if (error) {
                    throw error
                }

                // Update the store
                // const pinnedIds = currentUser.pinnedConversationIds || []
                // setPinnedConversations(pinnedIds.filter((id) => id !== conversationId))

                return true
            } catch (error) {
                console.error("Error unpinning conversation:", error)
                return false
            }
        },
        [currentUser, supabase, setPinnedConversations],
    )

    // Fetch users from the same organization for direct messages
    const fetchUsers = useCallback(async (): Promise<User[]> => {
        if (!supabase || !currentUser) return []

        try {
            // First, get the user's organization
            const { data: orgUser, error: orgError } = await supabase
                .from("organization_users")
                .select("organization_id")
                .eq("user_id", currentUser.id)
                .single()

            if (orgError) {
                console.error("Error fetching user's organization:", orgError)
                return []
            }

            if (!orgUser) {
                return []
            }

            // Then, get all users from the same organization
            const { data, error } = await supabase
                .from("users")
                .select(`
              *,
              organization_users!inner(organization_id)
            `)
                .eq("organization_users.organization_id", orgUser.organization_id)
                .neq("id", currentUser.id) // Exclude the current user
                .order("username")

            if (error) {
                throw error
            }

            return data as User[]
        } catch (error) {
            console.error("Error fetching users:", error)
            return []
        }
    }, [supabase, currentUser])

    // Add user to channel
    const addUserToChannel = useCallback(
        async (channelId: string, userId: string): Promise<boolean> => {
            if (!currentUser || !supabase) return false

            try {
                // Check if the current user has permission to add users (must be OWNER or ADMIN)
                const { data: currentParticipant, error: permissionError } = await supabase
                    .from("conversation_participants")
                    .select("role")
                    .eq("conversation_id", channelId)
                    .eq("user_id", currentUser.id)
                    .single()

                if (permissionError) {
                    throw new Error("You don't have permission to add users to this channel")
                }

                if (!currentParticipant || (currentParticipant.role !== "OWNER" && currentParticipant.role !== "ADMIN")) {
                    throw new Error("Only channel owners and admins can add users")
                }

                // Check if the user is already a participant
                const { data: existingParticipant, error: checkError } = await supabase
                    .from("conversation_participants")
                    .select("id, is_active")
                    .eq("conversation_id", channelId)
                    .eq("user_id", userId)
                    .maybeSingle()

                if (checkError && checkError.code !== "PGRST116") {
                    throw checkError
                }

                // Get user information for the system message
                const { data: userData, error: userError } = await supabase
                    .from("users")
                    .select("username")
                    .eq("id", userId)
                    .single()

                if (userError) {
                    throw new Error("User not found")
                }

                if (existingParticipant) {
                    // If user exists but is inactive, reactivate them
                    if (!existingParticipant.is_active) {
                        const { error: updateError } = await supabase
                            .from("conversation_participants")
                            .update({
                                is_active: true,
                                joined_at: new Date().toISOString(),
                            })
                            .eq("id", existingParticipant.id)

                        if (updateError) {
                            throw updateError
                        }
                    } else {
                        // User is already an active participant
                        return true
                    }
                } else {
                    // Add the user as a new participant
                    const { error: addError } = await supabase.from("conversation_participants").insert({
                        conversation_id: channelId,
                        user_id: userId,
                        role: "MEMBER",
                        joined_at: new Date().toISOString(),
                        is_active: true,
                    })

                    if (addError) {
                        throw addError
                    }
                }

                // Create a system message about the user being added
                const { error: msgError } = await supabase.from("messages").insert({
                    conversation_id: channelId,
                    sender_id: currentUser.id,
                    content: `${userData.username} was added to the channel by ${currentUser.username}`,
                    message_type: "TEXT",
                    created_at: new Date().toISOString(),
                    status: "SENT",
                    is_edited: false,
                    is_deleted: false,
                })

                if (msgError) {
                    console.error("Error creating system message:", msgError)
                }

                // Update the conversation's updated_at timestamp
                await supabase
                    .from("conversations")
                    .update({
                        updated_at: new Date().toISOString(),
                    })
                    .eq("id", channelId)

                return true
            } catch (error) {
                console.error("Error adding user to channel:", error)
                return false
            }
        },
        [currentUser, supabase],
    )


    // Fetch users who are not already in a specific channel
    const fetchUsersNotInChannel = useCallback(
        async (channelId: string): Promise<User[]> => {
            if (!supabase || !currentUser) return []

            try {
                // First, get the user's organization
                const { data: orgUser, error: orgError } = await supabase
                    .from("organization_users")
                    .select("organization_id")
                    .eq("user_id", currentUser.id)
                    .single()

                if (orgError) {
                    console.error("Error fetching user's organization:", orgError)
                    return []
                }

                if (!orgUser) {
                    return []
                }

                // Get all users who are already in the channel
                const { data: existingParticipants, error: participantsError } = await supabase
                    .from("conversation_participants")
                    .select("user_id")
                    .eq("conversation_id", channelId)
                    .eq("is_active", true)

                if (participantsError) {
                    console.error("Error fetching channel participants:", participantsError)
                    return []
                }

                // Extract user IDs of existing participants
                const existingUserIds = existingParticipants.map((p) => p.user_id)

                // Then, get all users from the same organization who are not already in the channel
                const { data, error } = await supabase
                    .from("users")
                    .select(`
            *,
            organization_users!inner(organization_id)
          `)
                    .eq("organization_users.organization_id", orgUser.organization_id)
                    .not("id", "in", `(${existingUserIds.join(",")})`) // Exclude existing participants
                    .order("username")

                if (error) {
                    throw error
                }

                return data as User[]
            } catch (error) {
                console.error("Error fetching users not in channel:", error)
                return []
            }
        },
        [supabase, currentUser],
    )

    return {
        fetchConversations,
        fetchParticipants,
        fetchMessages,
        fetchUsers,
        sendMessage,
        editMessage,
        reactToMessage,
        removeReactionFromMessage,
        markMessageAsRead,
        updateTypingStatus,
        saveDraft,
        createChannel,
        createDirectMessage,
        pinConversation,
        unpinConversation,
        addUserToChannel,
        fetchUsersNotInChannel
    }
}
