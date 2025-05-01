"use client"

import { useList, useOne, useMutationMode, useCreate, useUpdate, useDelete } from "@refinedev/core"
import { useState } from "react"
import { useNotification } from "@/providers/notification-provider"

/**
 * Custom hook for managing conversations
 * Provides CRUD operations for conversations using Refine hooks
 */
export function useConversations() {
  const [isLoading, setIsLoading] = useState(false)
  const notification = useNotification()
  const { mutationMode } = useMutationMode()

  /**
   * Fetch a list of conversations with optional filtering and pagination
   * @param params - Optional parameters for filtering and pagination
   * @returns List of conversations and metadata
   */
  const {
    data: conversationsData,
    isLoading: listIsLoading,
    isError: listIsError,
    refetch,
  } = useList({
    resource: "conversations",
    pagination: {
      mode: "off",
    },
  })

  const getConversations = (params?: {
    page?: number
    pageSize?: number
    filters?: any[]
    sorters?: any[]
  }) => {
    const page = params?.page || 1
    const pageSize = params?.pageSize || 10
    const filters = params?.filters
    const sorters = params?.sorters

    const paginatedConversations = conversationsData?.data?.slice((page - 1) * pageSize, page * pageSize) || []

    return {
      conversations: paginatedConversations,
      total: conversationsData?.total || 0,
      isLoading: listIsLoading,
      isError: listIsError,
    }
  }

  /**
   * Fetch a single conversation by ID
   * @param id - The conversation ID
   * @returns The conversation data
   */
  const getConversation = (id: string) => {
    const { data, isLoading, isError } = useOne({
      resource: "conversations",
      id,
    })

    return {
      conversation: data?.data,
      isLoading,
      isError,
    }
  }

  const { mutate: createMutate, isLoading: createIsLoading } = useCreate()

  /**
   * Create a new conversation
   * @param conversationData - The conversation data to create
   * @returns Promise resolving to the created conversation
   */
  const createConversation = async (conversationData: any) => {
    setIsLoading(true)
    try {
      const data = await createMutate({
        resource: "conversations",
        values: conversationData,
        mutationMode,
        onSuccess: () => {
          notification.success("Conversation created successfully")
          refetch()
        },
        onError: () => {
          notification.error("Failed to create conversation")
        },
      })

      setIsLoading(false)
      return data
    } catch (error) {
      notification.error("Failed to create conversation")
      setIsLoading(false)
      throw error
    }
  }

  const { mutate: updateMutate, isLoading: updateIsLoading } = useUpdate()

  /**
   * Update an existing conversation
   * @param id - The conversation ID
   * @param conversationData - The updated conversation data
   * @returns Promise resolving to the updated conversation
   */
  const updateConversation = async (id: string, conversationData: any) => {
    setIsLoading(true)
    try {
      const data = await updateMutate({
        resource: "conversations",
        id,
        values: conversationData,
        mutationMode,
        onSuccess: () => {
          notification.success("Conversation updated successfully")
          refetch()
        },
        onError: () => {
          notification.error("Failed to update conversation")
        },
      })

      notification.success("Conversation updated successfully")
      setIsLoading(false)
      return data
    } catch (error) {
      notification.error("Failed to update conversation")
      setIsLoading(false)
      throw error
    }
  }

  const { mutate: deleteMutate, isLoading: deleteIsLoading } = useDelete()

  /**
   * Delete a conversation
   * @param id - The conversation ID
   * @returns Promise resolving when the conversation is deleted
   */
  const deleteConversation = async (id: string) => {
    setIsLoading(true)
    try {
      await deleteMutate({
        resource: "conversations",
        id,
        mutationMode,
        onSuccess: () => {
          notification.success("Conversation deleted successfully")
          refetch()
        },
        onError: () => {
          notification.error("Failed to delete conversation")
        },
      })

      notification.success("Conversation deleted successfully")
      setIsLoading(false)
    } catch (error) {
      notification.error("Failed to delete conversation")
      setIsLoading(false)
      throw error
    }
  }

  return {
    getConversations,
    getConversation,
    createConversation,
    updateConversation,
    deleteConversation,
    isLoading,
    createIsLoading,
    updateIsLoading,
    deleteIsLoading,
  }
}
