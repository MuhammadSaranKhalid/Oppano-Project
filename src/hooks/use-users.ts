"use client"

import { useList, useOne } from "@refinedev/core"
import { useState } from "react"
import { useNotification } from "@/providers/notification-provider"
import { useSupabase } from "@/providers/supabase-provider"

/**
 * Custom hook for managing users
 * Provides operations for users using Refine hooks and Supabase auth
 */
export function useUsers(params?: {
  page?: number
  pageSize?: number
  filters?: any[]
  sorters?: any[]
}) {
  const [isLoading, setIsLoading] = useState(false)
  const notification = useNotification()
  const supabase = useSupabase()

  const {
    data,
    isLoading: listIsLoading,
    isError,
  } = useList({
    resource: "users",
    pagination: {
      current: params?.page || 1,
      pageSize: params?.pageSize || 10,
    },
    filters: params?.filters,
    sorters: params?.sorters,
  })

  /**
   * Fetch a list of users with optional filtering and pagination
   * @param params - Optional parameters for filtering and pagination
   * @returns List of users and metadata
   */
  const getUsers = () => {
    return {
      users: data?.data || [],
      total: data?.total || 0,
      isLoading: listIsLoading,
      isError,
    }
  }

  /**
   * Fetch a single user by ID
   * @param id - The user ID
   * @returns The user data
   */
  const getUser = (id: string) => {
    const { data, isLoading, isError } = useOne({
      resource: "users",
      id,
    })

    return {
      user: data?.data,
      isLoading,
      isError,
    }
  }

  /**
   * Register a new user
   * @param email - User email
   * @param password - User password
   * @param userData - Additional user data
   * @returns Promise resolving to the created user
   */
  const registerUser = async (email: string, password: string, userData: any) => {
    setIsLoading(true)
    try {
      // Register the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            avatarUrl: userData.avatarUrl,
          },
        },
      })

      if (authError) {
        throw authError
      }

      notification.success("User registered successfully")
      setIsLoading(false)
      return authData.user
    } catch (error: any) {
      notification.error(error.message || "Failed to register user")
      setIsLoading(false)
      throw error
    }
  }

  /**
   * Login a user
   * @param email - User email
   * @param password - User password
   * @returns Promise resolving to the logged in user
   */
  const loginUser = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      notification.success("Logged in successfully")
      setIsLoading(false)
      return data.user
    } catch (error: any) {
      notification.error(error.message || "Failed to login")
      setIsLoading(false)
      throw error
    }
  }

  /**
   * Logout the current user
   */
  const logoutUser = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        throw error
      }

      notification.success("Logged out successfully")
      setIsLoading(false)
    } catch (error: any) {
      notification.error(error.message || "Failed to logout")
      setIsLoading(false)
      throw error
    }
  }

  /**
   * Update user profile
   * @param userData - The updated user data
   * @returns Promise resolving to the updated user
   */
  const updateUserProfile = async (userData: any) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: userData,
      })

      if (error) {
        throw error
      }

      notification.success("Profile updated successfully")
      setIsLoading(false)
      return data.user
    } catch (error: any) {
      notification.error(error.message || "Failed to update profile")
      setIsLoading(false)
      throw error
    }
  }

  return {
    getUsers,
    getUser,
    registerUser,
    loginUser,
    logoutUser,
    updateUserProfile,
    isLoading,
  }
}
