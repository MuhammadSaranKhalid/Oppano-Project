import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import type { Conversation, ConversationParticipant, Message, User, Reaction } from "@/interfaces"
import { UserStatus } from "@/interfaces"

interface ChatState {
  // Current user
  currentUser: User | null
  setCurrentUser: (user: User) => void

  // Conversations
  conversations: Conversation[]
  setConversations: (conversations: Conversation[]) => void
  addConversation: (conversation: Conversation) => void
  updateConversation: (conversation: Conversation) => void

  // Selected conversation
  selectedConversationId: string | null
  selectConversation: (id: string | null) => void

  // Conversation participants
  participants: Record<string, ConversationParticipant[]>
  setParticipants: (conversationId: string, participants: ConversationParticipant[]) => void

  // Messages
  messages: Record<string, Message[]>
  setMessages: (conversationId: string, messages: Message[]) => void
  addMessage: (conversationId: string, message: Message) => void
  updateMessage: (conversationId: string, message: Message) => void

  // Reactions
  addReaction: (conversationId: string, messageId: string, reaction: Reaction) => void
  removeReaction: (conversationId: string, messageId: string, reactionId: string) => void

  // Typing indicators
  typingUsers: Record<string, string[]>
  setTypingUser: (conversationId: string, userId: string, isTyping: boolean) => void

  // Drafts
  drafts: Record<string, string>
  setDraft: (conversationId: string, content: string) => void

  // Pinned conversations
  pinnedConversations: string[]
  setPinnedConversations: (conversationIds: string[]) => void
  pinConversation: (conversationId: string) => void
  unpinConversation: (conversationId: string) => void

  // Loading states
  isLoadingConversations: boolean
  setIsLoadingConversations: (isLoading: boolean) => void
  isLoadingMessages: boolean
  setIsLoadingMessages: (isLoading: boolean) => void

  // Reply state
  replyingToMessage: Message | null
  setReplyingToMessage: (message: Message | null) => void

  // Editing state
  editingMessage: Message | null
  setEditingMessage: (message: Message | null) => void

  // Unread counts
  unreadCounts: Record<string, number>
  setUnreadCount: (conversationId: string, count: number) => void
  clearUnreadCount: (conversationId: string) => void

  // Clear all state
  clearState: () => void
}

export const useChatStore = create<ChatState>()(
  devtools(
    persist(
      (set) => ({
        // Current user
        currentUser: null,
        setCurrentUser: (user) => set({ currentUser: user }),

        // Conversations
        conversations: [],
        setConversations: (conversations) => set({ conversations }),
        addConversation: (conversation) =>
          set((state) => ({
            conversations: [...state.conversations, conversation],
          })),
        updateConversation: (conversation) =>
          set((state) => ({
            conversations: state.conversations.map((c) => (c.id === conversation.id ? conversation : c)),
          })),

        // Selected conversation
        selectedConversationId: null,
        selectConversation: (id) => set({ selectedConversationId: id }),

        // Conversation participants
        participants: {},
        setParticipants: (conversationId, participants) =>
          set((state) => ({
            participants: {
              ...state.participants,
              [conversationId]: participants,
            },
          })),

        // Messages
        messages: {},
        setMessages: (conversationId, messages) =>
          set((state) => ({
            messages: {
              ...state.messages,
              [conversationId]: messages,
            },
          })),
        addMessage: (conversationId, message) =>
          set((state) => {
            const conversationMessages = state.messages[conversationId] || []
            return {
              messages: {
                ...state.messages,
                [conversationId]: [...conversationMessages, message],
              },
            }
          }),
        updateMessage: (conversationId, message) =>
          set((state) => {
            const conversationMessages = state.messages[conversationId] || []
            return {
              messages: {
                ...state.messages,
                [conversationId]: conversationMessages.map((m) => (m.id === message.id ? message : m)),
              },
            }
          }),

        // Reactions
        addReaction: (conversationId, messageId, reaction) =>
          set((state) => {
            const conversationMessages = state.messages[conversationId] || []
            return {
              messages: {
                ...state.messages,
                [conversationId]: conversationMessages.map((message) => {
                  if (message.id === messageId) {
                    const reactions = message.reactions || []
                    return {
                      ...message,
                      reactions: [...reactions, reaction],
                    }
                  }
                  return message
                }),
              },
            }
          }),
        removeReaction: (conversationId, messageId, reactionId) =>
          set((state) => {
            const conversationMessages = state.messages[conversationId] || []
            return {
              messages: {
                ...state.messages,
                [conversationId]: conversationMessages.map((message) => {
                  if (message.id === messageId && message.reactions) {
                    return {
                      ...message,
                      reactions: message.reactions.filter((r) => r.id !== reactionId),
                    }
                  }
                  return message
                }),
              },
            }
          }),

        // Typing indicators
        typingUsers: {},
        setTypingUser: (conversationId, userId, isTyping) =>
          set((state) => {
            const typingUsersInConversation = state.typingUsers[conversationId] || []

            if (isTyping && !typingUsersInConversation.includes(userId)) {
              return {
                typingUsers: {
                  ...state.typingUsers,
                  [conversationId]: [...typingUsersInConversation, userId],
                },
              }
            } else if (!isTyping && typingUsersInConversation.includes(userId)) {
              return {
                typingUsers: {
                  ...state.typingUsers,
                  [conversationId]: typingUsersInConversation.filter((id) => id !== userId),
                },
              }
            }

            return state
          }),

        // Drafts
        drafts: {},
        setDraft: (conversationId, content) =>
          set((state) => ({
            drafts: {
              ...state.drafts,
              [conversationId]: content,
            },
          })),

        // Pinned conversations
        pinnedConversations: [],
        setPinnedConversations: (conversationIds) => set({ pinnedConversations: conversationIds }),
        pinConversation: (conversationId) =>
          set((state) => ({
            pinnedConversations: [...state.pinnedConversations, conversationId],
          })),
        unpinConversation: (conversationId) =>
          set((state) => ({
            pinnedConversations: state.pinnedConversations.filter((id) => id !== conversationId),
          })),

        // Loading states
        isLoadingConversations: false,
        setIsLoadingConversations: (isLoading) => set({ isLoadingConversations: isLoading }),
        isLoadingMessages: false,
        setIsLoadingMessages: (isLoading) => set({ isLoadingMessages: isLoading }),

        // Reply state
        replyingToMessage: null,
        setReplyingToMessage: (message) => set({ replyingToMessage: message }),

        // Editing state
        editingMessage: null,
        setEditingMessage: (message) => set({ editingMessage: message }),

        // Unread counts
        unreadCounts: {},
        setUnreadCount: (conversationId, count) =>
          set((state) => ({
            unreadCounts: {
              ...state.unreadCounts,
              [conversationId]: count,
            },
          })),
        clearUnreadCount: (conversationId) =>
          set((state) => {
            const { [conversationId]: _, ...rest } = state.unreadCounts
            return { unreadCounts: rest }
          }),

        // Clear all state
        clearState: () =>
          set({
            selectedConversationId: null,
            messages: {},
            participants: {},
            typingUsers: {},
            replyingToMessage: null,
            editingMessage: null,
          }),
      }),
      {
        name: "chat-storage",
        partialize: (state) => ({
          currentUser: state.currentUser,
          selectedConversationId: state.selectedConversationId,
          pinnedConversations: state.pinnedConversations,
          drafts: state.drafts,
        }),
      },
    ),
  ),
)
