"use client"

import { useCallback } from "react"
import { useChatStore } from "@/store/chat-store"
import { supabaseBrowserClient as supabase } from "@utils/supabase/client"
import type { Message } from "@/interfaces"

export function useRealTime() {
    const { setTypingUser } = useChatStore()

    /**
     * Subscribe to new messages in a conversation
     */
    const subscribeToMessages = useCallback(
        (conversationId: string, onNewMessage: (message: Message) => void) => {
            const channel = supabase
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
                        // When a new message is inserted, fetch the complete message with relations
                        const fetchCompleteMessage = async () => {
                            const { data, error } = await supabase
                                .from("messages")
                                .select(
                                    `
                  *,
                  sender:users(*),
                  reactions(*),
                  attachments:message_attachments(*)
                `,
                                )
                                .eq("id", payload.new.id)
                                .single()

                            if (!error && data) {
                                onNewMessage(data as unknown as Message)
                            }
                        }

                        fetchCompleteMessage()
                    },
                )
                .on(
                    "postgres_changes",
                    {
                        event: "UPDATE",
                        schema: "public",
                        table: "messages",
                        filter: `conversation_id=eq.${conversationId}`,
                    },
                    (payload) => {
                        // When a message is updated, fetch the complete message with relations
                        const fetchCompleteMessage = async () => {
                            const { data, error } = await supabase
                                .from("messages")
                                .select(
                                    `
                  *,
                  sender:users(*),
                  reactions(*),
                  attachments:message_attachments(*)
                `,
                                )
                                .eq("id", payload.new.id)
                                .single()

                            if (!error && data) {
                                onNewMessage(data as unknown as Message)
                            }
                        }

                        fetchCompleteMessage()
                    },
                )
                .subscribe()

            // Return unsubscribe function
            return () => {
                supabase.removeChannel(channel)
            }
        },
        [supabase],
    )

    /**
     * Subscribe to typing indicators in a conversation
     */
    const subscribeToTyping = useCallback(
        (conversationId: string) => {
            const channel = supabase
                .channel(`typing:${conversationId}`)
                .on(
                    "postgres_changes",
                    {
                        event: "UPDATE",
                        schema: "public",
                        table: "conversation_participants",
                        filter: `conversation_id=eq.${conversationId}`,
                    },
                    (payload) => {
                        if (payload.new && payload.old) {
                            // Check if typing_at field changed
                            if (payload.new.typing_at !== payload.old.typing_at) {
                                const isTyping = !!payload.new.typing_at
                                setTypingUser(conversationId, payload.new.user_id, isTyping)
                            }
                        }
                    },
                )
                .subscribe()

            // Return unsubscribe function
            return () => {
                supabase.removeChannel(channel)
            }
        },
        [supabase, setTypingUser],
    )

    /**
     * Subscribe to reactions in a conversation
     */
    const subscribeToReactions = useCallback(
        (conversationId: string, onReactionChange: (messageId: string) => void) => {
            const channel = supabase
                .channel(`reactions:${conversationId}`)
                .on(
                    "postgres_changes",
                    {
                        event: "*", // INSERT, UPDATE, or DELETE
                        schema: "public",
                        table: "reactions",
                        filter: `message_id=in.(select id from messages where conversation_id='${conversationId}')`,
                    },
                    (payload) => {
                        // When a reaction changes, notify with the message ID
                        if (payload.new) {
                            // onReactionChange(payload.new?.message_id)
                        } else if (payload.old) {
                            // onReactionChange(payload.old?.message_id)
                        }
                    },
                )
                .subscribe()

            // Return unsubscribe function
            return () => {
                supabase.removeChannel(channel)
            }
        },
        [supabase],
    )

    /**
     * Subscribe to read status changes in a conversation
     */
    const subscribeToReadStatus = useCallback(
        (conversationId: string, onReadStatusChange: (messageId: string) => void) => {
            const channel = supabase
                .channel(`read_status:${conversationId}`)
                .on(
                    "postgres_changes",
                    {
                        event: "INSERT",
                        schema: "public",
                        table: "message_read_status",
                        filter: `message_id=in.(select id from messages where conversation_id='${conversationId}')`,
                    },
                    (payload) => {
                        // When a read status is inserted, notify with the message ID
                        if (payload.new) {
                            onReadStatusChange(payload.new.message_id)
                        }
                    },
                )
                .subscribe()

            // Return unsubscribe function
            return () => {
                supabase.removeChannel(channel)
            }
        },
        [supabase],
    )

    return {
        subscribeToMessages,
        subscribeToTyping,
        subscribeToReactions,
        subscribeToReadStatus,
    }
}
