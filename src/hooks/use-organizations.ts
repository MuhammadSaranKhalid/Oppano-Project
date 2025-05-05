"use client"

import { useList, useOne, useCreate, useUpdate, useDelete } from "@refinedev/core"
import { useState } from "react"
// import { useNotification } from "@/providers/notification-provider"

/**
 * Custom hook for managing organizations
 * Provides CRUD operations for organizations using Refine hooks
 */
export function useOrganizations() {
  const [isLoading, setIsLoading] = useState(false)
  // const notification = useNotification()

  const { mutate: createMutate } = useCreate()
  const { mutate: updateMutate } = useUpdate()
  const { mutate: deleteMutate } = useDelete()

  const {
    data: listResult,
    isLoading: listIsLoading,
    isError: listIsError,
  } = useList({
    resource: "organizations",
    pagination: {
      mode: "off",
    },
  })

  /**
   * Fetch a list of organizations with optional filtering and pagination
   * @param params - Optional parameters for filtering and pagination
   * @returns List of organizations and metadata
   */
  const getOrganizations = (params?: {
    page?: number
    pageSize?: number
    filters?: any[]
    sorters?: any[]
  }) => {
    const current = 1
    const pageSize = 10

    const { data, isLoading, isError } = useList({
      resource: "organizations",
      pagination: {
        current: params?.page || current || 1,
        pageSize: params?.pageSize || pageSize || 10,
      },
      // filters: params?.filters || filters,
      // sorters: params?.sorters || sorters,
    })

    return {
      organizations: data?.data || [],
      total: data?.total || 0,
      isLoading,
      isError,
    }
  }

  /**
   * Fetch a single organization by ID
   * @param id - The organization ID
   * @returns The organization data
   */
  const getOrganization = (id: string) => {
    const { data, isLoading, isError } = useOne({
      resource: "organizations",
      id,
    })

    return {
      organization: data?.data,
      isLoading,
      isError,
    }
  }

  /**
   * Create a new organization
   * @param organizationData - The organization data to create
   * @returns Promise resolving to the created organization
   */
  const createOrganization = async (organizationData: any) => {
    setIsLoading(true)
    try {
      const data = await createMutate({
        resource: "organizations",
        values: organizationData,
      })

      // notification.success("Organization created successfully")
      setIsLoading(false)
      return data
    } catch (error: any) {
      // notification.error("Failed to create organization")
      setIsLoading(false)
      throw error
    }
  }

  /**
   * Update an existing organization
   * @param id - The organization ID
   * @param organizationData - The updated organization data
   * @returns Promise resolving to the updated organization
   */
  const updateOrganization = async (id: string, organizationData: any) => {
    setIsLoading(true)
    try {
      const data = await updateMutate({
        resource: "organizations",
        id,
        values: organizationData,
      })

      // notification.success("Organization updated successfully")
      setIsLoading(false)
      return data
    } catch (error: any) {
      // notification.error("Failed to update organization")
      setIsLoading(false)
      throw error
    }
  }

  /**
   * Delete an organization
   * @param id - The organization ID
   * @returns Promise resolving when the organization is deleted
   */
  const deleteOrganization = async (id: string) => {
    setIsLoading(true)
    try {
      await deleteMutate({
        resource: "organizations",
        id,
      })

      // notification.success("Organization deleted successfully")
      setIsLoading(false)
    } catch (error: any) {
      // notification.error("Failed to delete organization")
      setIsLoading(false)
      throw error
    }
  }

  return {
    getOrganizations,
    getOrganization,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    isLoading,
  }
}
