"use client"

import { create } from "zustand"
import { ConversationType, UserStatus } from "@/types"

// Mock data for the store
const mockUser = {
  id: "user-1",
  username: "Cristal Parker",
  email: "cristal@example.com",
  avatar: "/abstract-geometric-shapes.png",
  role: "Graphics Designer",
  plan: "Starter",
  status: UserStatus.ONLINE,
  statusMessage: "Working on designs",
  lastActive: new Date().toISOString(),
}

const mockUsers = [
  {
    id: "user-2",
    username: "Bill Kuphal",
    email: "bill@example.com",
    avatar: "/stylized-bk-logo.png",
    status: UserStatus.ONLINE,
    statusMessage: "Online for 10 mins",
    role: "Jr. Designer",
    pronouns: "He/his/him",
    startDate: "Dec 6, 2022",
    linkedin: "My LinkedIn profile",
    lastActive: new Date().toISOString(),
  },
  {
    id: "user-3",
    username: "David Smith",
    email: "david@example.com",
    avatar: "/abstract-ds.png",
    status: UserStatus.AWAY,
    statusMessage: "In a meeting",
    lastActive: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
  },
  {
    id: "user-4",
    username: "Sarah Johnson",
    email: "sarah@example.com",
    avatar: "/stylized-letters-sj.png",
    status: UserStatus.DO_NOT_DISTURB,
    statusMessage: "Focused work - please do not disturb",
    lastActive: new Date(Date.now() - 5 * 60000).toISOString(), // 5 minutes ago
  },
  {
    id: "user-5",
    username: "Michael Brown",
    email: "michael@example.com",
    avatar: "/monogram-mb.png",
    status: UserStatus.AWAY,
    statusMessage: "At lunch, back in 30",
    lastActive: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
  },
  {
    id: "user-6",
    username: "Emily Davis",
    email: "emily@example.com",
    avatar: "/ed-initials-abstract.png",
    status: UserStatus.OFFLINE,
    statusMessage: "",
    lastActive: new Date(Date.now() - 24 * 60 * 60000).toISOString(), // 1 day ago
  },
]

const mockConversations = [
  {
    id: "channel-1",
    type: ConversationType.CHANNEL,
    title: "general",
    participants: [],
    lastMessage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPinned: true, // Pinned channel
  },
  {
    id: "channel-2",
    type: ConversationType.CHANNEL,
    title: "design_team",
    participants: [],
    lastMessage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPinned: false,
  },
  {
    id: "channel-3",
    type: ConversationType.CHANNEL,
    title: "marketing_team",
    participants: [],
    lastMessage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPinned: false,
  },
  {
    id: "dm-1",
    type: ConversationType.PRIVATE,
    title: null,
    participants: [
      {
        userId: "user-1",
        role: "member",
        user: mockUser,
      },
      {
        userId: "user-3",
        role: "member",
        user: mockUsers[1],
      },
    ],
    lastMessage: "Next time it's my turn!",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPinned: false,
  },
  {
    id: "dm-2",
    type: ConversationType.PRIVATE,
    title: null,
    participants: [
      {
        userId: "user-1",
        role: "member",
        user: mockUser,
      },
      {
        userId: "user-2",
        role: "member",
        user: mockUsers[0],
      },
    ],
    lastMessage: "The weather will be perfect for the...",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPinned: false,
  },
  {
    id: "dm-3",
    type: ConversationType.PRIVATE,
    title: null,
    participants: [
      {
        userId: "user-1",
        role: "member",
        user: mockUser,
      },
      {
        userId: "user-3",
        role: "member",
        user: mockUsers[1],
      },
    ],
    lastMessage: "Here're my latest drone shots",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPinned: false,
  },
]

const mockLatestMessages = {
  "channel-1": {
    id: "msg-1",
    content: "Welcome to the general channel!",
    senderId: "user-2",
    sender: {
      id: "user-2",
      username: "Bill Kuphal",
      status: UserStatus.ONLINE,
    },
    conversationId: "channel-1",
    messageType: "TEXT",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
}

const mockUnreadCounts = {
  "dm-3": 80,
  "channel-2": 5,
}

// Define typing users structure
interface TypingUser {
  userId: string
  timestamp: number
}

// Define the store type
interface ChatStore {
  currentUser: typeof mockUser | null
  conversations: typeof mockConversations
  selectedConversation: (typeof mockConversations)[0] | null
  latestMessages: typeof mockLatestMessages
  unreadCounts: typeof mockUnreadCounts
  isLoading: boolean
  isLoadingChannels: boolean
  isLoadingDirectMessages: boolean
  activeSection: string
  error: string | null
  users: typeof mockUsers
  typingUsers: Record<string, TypingUser[]> // Conversation ID -> array of typing users

  // Actions
  fetchCurrentUser: () => Promise<void>
  fetchConversations: () => Promise<void>
  fetchUsers: () => Promise<typeof mockUsers>
  setupChatListener: (conversation: any) => void
  selectConversation: (conversationId: string) => void
  createChannel: (channelData: { name: string; isPrivate: boolean }) => Promise<void>
  createDirectMessage: (users: any[]) => Promise<void>
  setActiveSection: (section: string) => void
  pinChannel: (channelId: string) => void
  unpinChannel: (channelId: string) => void
  clearError: () => void
  updateUserStatus: (status: UserStatus, statusMessage?: string) => void
  getUserById: (userId: string) => typeof mockUser | (typeof mockUsers)[0] | null
  setUserTyping: (conversationId: string, userId: string, isTyping: boolean) => void
  getTypingUsers: (conversationId: string) => Array<typeof mockUser | (typeof mockUsers)[0]>
}

// Create the store
export const useChatStore = create<ChatStore>((set, get) => ({
  currentUser: null,
  conversations: [],
  selectedConversation: null,
  latestMessages: mockLatestMessages,
  unreadCounts: mockUnreadCounts,
  isLoading: false,
  isLoadingChannels: false,
  isLoadingDirectMessages: false,
  activeSection: "replies", // Default to replies section
  error: null,
  users: [],
  typingUsers: {},

  fetchCurrentUser: async () => {
    try {
      // Simulate API call
      set({ isLoading: true, error: null })
      await new Promise((resolve) => setTimeout(resolve, 500))
      set({ currentUser: mockUser, isLoading: false })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to fetch user data",
      })
    }
  },

  fetchConversations: async () => {
    try {
      // Simulate API call
      set({ isLoadingChannels: true, isLoadingDirectMessages: true, error: null })
      await new Promise((resolve) => setTimeout(resolve, 800))
      set({
        conversations: mockConversations,
        latestMessages: mockLatestMessages,
        unreadCounts: mockUnreadCounts,
        isLoadingChannels: false,
        isLoadingDirectMessages: false,
        // Select Bill Kuphal's conversation by default (as shown in the Figma)
        selectedConversation: mockConversations.find((c) => c.id === "dm-2"),
        users: mockUsers,
      })
    } catch (error) {
      set({
        isLoadingChannels: false,
        isLoadingDirectMessages: false,
        error: error instanceof Error ? error.message : "Failed to fetch conversations",
      })
    }
  },

  fetchUsers: async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Filter out the current user
      const filteredUsers = mockUsers.filter((user) => user.id !== get().currentUser?.id)
      set({ users: filteredUsers })

      return filteredUsers
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch users",
      })
      return []
    }
  },

  setupChatListener: (conversation) => {
    // In a real app, this would set up a real-time listener
    console.log("Setting up chat listener for:", conversation?.id)
  },

  selectConversation: (conversationId) => {
    try {
      const conversation = get().conversations.find((c) => c.id === conversationId)
      if (conversation) {
        set({
          selectedConversation: conversation,
          // When selecting a conversation, ensure we're in the replies section
          activeSection: "replies",
        })

        // Clear unread count for this conversation
        const updatedUnreadCounts = { ...get().unreadCounts }
        delete updatedUnreadCounts[conversationId]
        set({ unreadCounts: updatedUnreadCounts })
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to select conversation",
      })
    }
  },

  createChannel: async (channelData) => {
    try {
      // Simulate API call
      set({ isLoadingChannels: true, error: null })

      // Validate channel name
      if (!channelData.name || channelData.name.trim() === "") {
        throw new Error("Channel name cannot be empty")
      }

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate a unique ID for the new channel
      const channelId = `channel-${Date.now()}`

      // Create the new channel object
      const newChannel = {
        id: channelId,
        type: ConversationType.CHANNEL,
        title: channelData.name + (channelData.isPrivate ? "_team" : ""),
        participants: [],
        lastMessage: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPinned: false, // New channels are not pinned by default
      }

      // Add the new channel to the conversations list
      const updatedConversations = [...get().conversations, newChannel]

      // Update the store
      set({
        conversations: updatedConversations,
        isLoadingChannels: false,
        // Select the newly created channel
        selectedConversation: newChannel,
        // Ensure we're in the replies section
        activeSection: "replies",
      })

      return Promise.resolve()
    } catch (error) {
      set({
        isLoadingChannels: false,
        error: error instanceof Error ? error.message : "Failed to create channel",
      })
      return Promise.reject(error)
    }
  },

  createDirectMessage: async (users) => {
    try {
      // Simulate API call
      set({ isLoadingDirectMessages: true, error: null })

      // Validate users
      if (!users || users.length === 0) {
        throw new Error("At least one user must be selected")
      }

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate a unique ID for the new conversation
      const conversationId = `dm-${Date.now()}`

      // Get the current user
      const currentUser = get().currentUser

      // Create participants array with current user and selected users
      const participants = [
        {
          userId: currentUser?.id || "",
          role: "member",
          user: currentUser,
        },
        ...users.map((user) => ({
          userId: user.id,
          role: "member",
          user,
        })),
      ]

      // Determine if this is a group chat
      const isGroup = users.length > 1

      // Create the new conversation object
      const newConversation = {
        id: conversationId,
        type: isGroup ? ConversationType.GROUP : ConversationType.PRIVATE,
        title: isGroup ? `Group with ${users.map((u) => u.username).join(", ")}` : null,
        participants,
        lastMessage: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPinned: false,
      }

      // Add the new conversation to the conversations list
      const updatedConversations = [...get().conversations, newConversation]

      // Update the store
      set({
        conversations: updatedConversations,
        isLoadingDirectMessages: false,
        // Select the newly created conversation
        selectedConversation: newConversation,
        // Ensure we're in the replies section
        activeSection: "replies",
      })

      return Promise.resolve()
    } catch (error) {
      set({
        isLoadingDirectMessages: false,
        error: error instanceof Error ? error.message : "Failed to create direct message",
      })
      return Promise.reject(error)
    }
  },

  setActiveSection: (section) => {
    set({ activeSection: section })
  },

  pinChannel: (channelId) => {
    try {
      const updatedConversations = get().conversations.map((conversation) => {
        if (conversation.id === channelId) {
          return { ...conversation, isPinned: true }
        }
        return conversation
      })

      set({ conversations: updatedConversations })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to pin channel",
      })
    }
  },

  unpinChannel: (channelId) => {
    try {
      const updatedConversations = get().conversations.map((conversation) => {
        if (conversation.id === channelId) {
          return { ...conversation, isPinned: false }
        }
        return conversation
      })

      set({ conversations: updatedConversations })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to unpin channel",
      })
    }
  },

  clearError: () => {
    set({ error: null })
  },

  updateUserStatus: (status, statusMessage) => {
    try {
      const currentUser = get().currentUser
      if (currentUser) {
        set({
          currentUser: {
            ...currentUser,
            status,
            statusMessage: statusMessage || currentUser.statusMessage,
            lastActive: new Date().toISOString(),
          },
        })
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update status",
      })
    }
  },

  getUserById: (userId) => {
    if (userId === get().currentUser?.id) {
      return get().currentUser
    }
    return get().users.find((user) => user.id === userId) || null
  },

  // Set a user as typing in a conversation
  setUserTyping: (conversationId, userId, isTyping) => {
    try {
      const currentTypingUsers = get().typingUsers[conversationId] || []
      const now = Date.now()

      if (isTyping) {
        // Add or update the user's typing status
        const existingIndex = currentTypingUsers.findIndex((tu) => tu.userId === userId)

        if (existingIndex >= 0) {
          // Update existing typing status
          const updatedTypingUsers = [...currentTypingUsers]
          updatedTypingUsers[existingIndex] = { userId, timestamp: now }

          set({
            typingUsers: {
              ...get().typingUsers,
              [conversationId]: updatedTypingUsers,
            },
          })
        } else {
          // Add new typing status
          set({
            typingUsers: {
              ...get().typingUsers,
              [conversationId]: [...currentTypingUsers, { userId, timestamp: now }],
            },
          })
        }
      } else {
        // Remove the user from typing status
        const updatedTypingUsers = currentTypingUsers.filter((tu) => tu.userId !== userId)

        set({
          typingUsers: {
            ...get().typingUsers,
            [conversationId]: updatedTypingUsers,
          },
        })
      }
    } catch (error) {
      console.error("Failed to update typing status:", error)
    }
  },

  // Get users who are currently typing in a conversation
  getTypingUsers: (conversationId) => {
    const currentUser = get().currentUser
    if (!currentUser) return []

    const typingUsers = get().typingUsers[conversationId] || []
    const now = Date.now()

    // Filter out typing statuses older than 5 seconds and the current user
    const recentTypingUsers = typingUsers.filter((tu) => tu.userId !== currentUser.id && now - tu.timestamp < 5000)

    // Clean up old typing statuses
    if (recentTypingUsers.length !== typingUsers.length) {
      set({
        typingUsers: {
          ...get().typingUsers,
          [conversationId]: recentTypingUsers,
        },
      })
    }

    // Get the full user objects for the typing users
    return recentTypingUsers.map((tu) => get().getUserById(tu.userId)).filter(Boolean) as Array<typeof mockUser | (typeof mockUsers)[0]>
  },
}))
