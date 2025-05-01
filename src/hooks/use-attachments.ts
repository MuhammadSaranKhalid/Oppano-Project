"use client"

import { useList, useOne, useMutationMode, useNotification, useSupabase } from "@refinedev/core"
import { useState } from "react"

/**
 * Custom hook for managing attachments
 * Provides CRUD operations for attachments using Refine hooks and Supabase storage
 */
export function useAttachments() {
  const [isLoading, setIsLoading] = useState(false)
  const notification = useNotification()
  const supabase = useSupabase()
  const { mutationMode } = useMutationMode()
  const live = mutationMode === "live"

  /**
   * Fetch a list of attachments with optional filtering and pagination
   * @param params - Optional parameters for filtering and pagination
   * @returns List of attachments and metadata
   */
  const getAttachments = (params?: {
    page?: number
    pageSize?: number
    filters?: any[]
    sorters?: any[]
    messageId?: string
  }) => {
    // If messageId is provided, add it to filters
    const attachmentFilters = params?.filters || []
    if (params?.messageId) {
      attachmentFilters.push({
        field: "messageId",
        operator: "eq",
        value: params.messageId,
      })
    }

    const { data, isLoading, isError } = useList({
      resource: "attachments",
      pagination: {
        current: params?.page || 1,
        pageSize: params?.pageSize || 10,
      },
      filters: attachmentFilters,
      sorters: params?.sorters,
      queryOptions: {
        enabled: !live,
      },
      liveOptions: {
        enabled: live,
      },
    })

    return {
      attachments: data?.data || [],
      total: data?.total || 0,
      isLoading,
      isError,
    }
  }

  /**
   * Fetch a single attachment by ID
   * @param id - The attachment ID
   * @returns The attachment data
   */
  const getAttachment = (id: string) => {
    const { data, isLoading, isError } = useOne({
      resource: "attachments",
      id,
    })

    return {
      attachment: data?.data,
      isLoading,
      isError,
    }
  }

  /**
   * Upload a file to Supabase storage and create an attachment record
   * @param file - The file to upload
   * @param messageId - The ID of the message this attachment belongs to
   * @returns Promise resolving to the created attachment
   */
  const uploadAttachment = async (file: File, messageId: string) => {
    setIsLoading(true)
    try {
      // Upload the file to Supabase storage
      const fileName = `${Date.now()}_${file.name}`
      const { data: fileData, error: uploadError } = await supabase.storage.from("attachments").upload(fileName, file)

      if (uploadError) {
        throw uploadError
      }

      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage.from("attachments").getPublicUrl(fileName)

      // Create the attachment record
      const attachmentData = {
        name: file.name,
        type: file.type,
        size: file.size,
        url: urlData.publicUrl,
        messageId,
      }

      const { error } = await supabase.from("attachments").insert(attachmentData)

      if (error) {
        throw error
      }

      notification.success("File uploaded successfully")
      setIsLoading(false)
      return attachmentData
    } catch (error: any) {
      notification.error(error.message || "Failed to upload file")
      setIsLoading(false)
      throw error
    }
  }

  /**
   * Delete an attachment and remove the file from storage
   * @param id - The attachment ID
   * @param fileName - The name of the file in storage
   * @returns Promise resolving when the attachment is deleted
   */
  const deleteAttachment = async (id: string, fileName: string) => {
    setIsLoading(true)
    try {
      // Delete the file from storage
      const { error: storageError } = await supabase.storage.from("attachments").remove([fileName])

      if (storageError) {
        throw storageError
      }

      // Delete the attachment record
      const { error } = await supabase.from("attachments").delete().eq("id", id)

      if (error) {
        throw error
      }

      notification.success("Attachment deleted successfully")
      setIsLoading(false)
    } catch (error: any) {
      notification.error(error.message || "Failed to delete attachment")
      setIsLoading(false)
      throw error
    }
  }

  return {
    getAttachments,
    getAttachment,
    uploadAttachment,
    deleteAttachment,
    isLoading,
  }
}
