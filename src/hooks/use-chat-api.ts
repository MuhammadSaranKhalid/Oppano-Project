"use client"

import { useCallback } from "react"
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useChatStore } from "@/store/chat-store"
import {
    type Conversation,
    type ConversationParticipant,
    type Message,
    type Reaction,
    MessageType,
    MessageStatus,
} from "@/interfaces"
import type { Attachment } from "@/components/chat/enhanced-chat-input"
import { supabaseBrowserClient as supabase } from "@utils/supabase/client"

export function useChatApi() {
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

    // const supabase = createClientComponentClient()

    // Fetch all conversations for the current user
    const fetchConversations = useCallback(async () => {
        if (!currentUser) return

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
            if (pinnedData) {
                const pinnedIds = pinnedData.map((p) => p.conversation_id)
                setPinnedConversations(pinnedIds)
            }

            // // Set unread counts in store
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
            if (!currentUser) return null

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
            if (!currentUser) return null

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
            if (!currentUser) return null

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
            if (!currentUser) return false

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
            if (!currentUser) return false

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
            if (!currentUser || !content.trim()) return false

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

    return {
        fetchConversations,
        fetchParticipants,
        fetchMessages,
        sendMessage,
        editMessage,
        reactToMessage,
        removeReactionFromMessage,
        markMessageAsRead,
        updateTypingStatus,
        saveDraft,
    }
}
