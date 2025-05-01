"use client"

import { useList, useOne, useCreate, useUpdate, useDelete } from "@refinedev/core"
import { useState } from "react"
import { useNotification } from "@/providers/notification-provider"

/**
 * Custom hook for managing messages
 * Provides CRUD operations for messages using Refine hooks
 */
export function useMessages() {
  const [isLoading, setIsLoading] = useState(false)
  const notification = useNotification()
  const { mutate: createMutate } = useCreate()
  const { mutate: updateMutate } = useUpdate()
  const { mutate: deleteMutate } = useDelete()
  const [messagesData, setMessagesData] = useState<{
    messages: any[]
    total: number
    isLoading: boolean
    isError: boolean
  }>({ messages: [], total: 0, isLoading: false, isError: false })

  /**
   * Fetch a list of messages with optional filtering and pagination
   * @param params - Optional parameters for filtering and pagination
   * @returns List of messages and metadata
   */
  const getMessages = (params?: {
    page?: number
    pageSize?: number
    filters?: any[]
    sorters?: any[]
    conversationId?: string
  }) => {
    // If conversationId is provided, add it to filters
    const messageFilters = params?.filters || []
    if (params?.conversationId) {
      messageFilters.push({
        field: "conversationId",
        operator: "eq",
        value: params.conversationId,
      })
    }

    const { data, isLoading, isError } = useList({
      resource: "messages",
      pagination: {
        current: params?.page || 1,
        pageSize: params?.pageSize || 20,
      },
      filters: messageFilters,
      sorters: params?.sorters || [{ field: "createdAt", order: "desc" }],
    })

    setMessagesData({
      messages: data?.data || [],
      total: data?.total || 0,
      isLoading,
      isError,
    })

    return {
      messages: messagesData?.messages || [],
      total: messagesData?.total || 0,
      isLoading: messagesData?.isLoading,
      isError: messagesData?.isError,
    }
  }

  /**
   * Fetch a single message by ID
   * @param id - The message ID
   * @returns The message data
   */
  const getMessage = (id: string) => {
    const { data, isLoading, isError } = useOne({
      resource: "messages",
      id,
    })

    return {
      message: data?.data,
      isLoading,
      isError,
    }
  }

  /**
   * Create a new message
   * @param messageData - The message data to create
   * @returns Promise resolving to the created message
   */
  const createMessage = async (messageData: any) => {
    setIsLoading(true)
    try {
      const { data } = await createMutate({
        resource: "messages",
        values: messageData,
      })

      setIsLoading(false)
      return data?.data
    } catch (error) {
      notification.error("Failed to send message")
      setIsLoading(false)
      throw error
    }
  }

  /**
   * Update an existing message
   * @param id - The message ID
   * @param messageData - The updated message data
   * @returns Promise resolving to the updated message
   */
  const updateMessage = async (id: string, messageData: any) => {
    setIsLoading(true)
    try {
      const { data } = await updateMutate({
        resource: "messages",
        id,
        values: messageData,
      })

      setIsLoading(false)
      return data?.data
    } catch (error) {
      notification.error("Failed to update message")
      setIsLoading(false)
      throw error
    }
  }

  /**
   * Delete a message
   * @param id - The message ID
   * @returns Promise resolving when the message is deleted
   */
  const deleteMessage = async (id: string) => {
    setIsLoading(true)
    try {
      await deleteMutate({
        resource: "messages",
        id,
      })

      notification.success("Message deleted successfully")
      setIsLoading(false)
    } catch (error) {
      notification.error("Failed to delete message")
      setIsLoading(false)
      throw error
    }
  }

  return {
    getMessages,
    getMessage,
    createMessage,
    updateMessage,
    deleteMessage,
    isLoading,
  }
}
