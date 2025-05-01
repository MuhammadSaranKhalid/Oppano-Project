"use client"

import { supabaseBrowserClient } from "@/utils/supabase/client"
import type { Database } from "@/types/supabase"
import type { AuthError as SupabaseAuthError } from "@supabase/supabase-js"

// Enhanced error types for better error handling
export type AuthError = {
  name: string
  message: string
  code?: string
  status?: number
  hint?: string
  field?: string // Added field to indicate which form field has an error
}

export type LoginCredentials = {
  email: string
  password: string
}

export type SignUpCredentials = LoginCredentials & {
  name?: string
}

// Account status types for better user feedback
export type AccountStatus = {
  exists: boolean
  verified: boolean
}

// Cache for email status to prevent rate limiting
const emailStatusCache: Record<string, { status: AccountStatus; timestamp: number }> = {}
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

// Map Supabase error codes to user-friendly messages
const getErrorMessage = (error: SupabaseAuthError, isSignup = false): AuthError => {
  // Common error codes
  const errorMap: Record<string, AuthError> = {
    // Signup-specific errors
    "23505": {
      name: "EmailAlreadyExists",
      message: "This email address is already registered. Please use a different email or try logging in.",
      code: "23505",
      field: "email",
    },
    invalid_email: {
      name: "InvalidEmail",
      message: "Please enter a valid email address (e.g., name@example.com).",
      code: "invalid_email",
      field: "email",
    },
    weak_password: {
      name: "WeakPassword",
      message: "Your password doesn't meet the security requirements. Please create a stronger password.",
      code: "weak_password",
      field: "password",
      hint: "Include uppercase, lowercase, numbers, and special characters.",
    },

    // Login-specific errors
    invalid_credentials: {
      name: "InvalidCredentials",
      message: "The email or password you entered is incorrect. Please try again.",
      code: "invalid_credentials",
    },
    user_not_found: {
      name: "UserNotFound",
      message: isSignup
        ? "Unable to create account. Please try again with different credentials."
        : "We couldn't find an account with this email. Please check your email or sign up.",
      code: "user_not_found",
    },
    too_many_attempts: {
      name: "TooManyAttempts",
      message: "Too many login attempts. Please try again later or reset your password.",
      code: "too_many_attempts",
    },
    email_not_confirmed: {
      name: "EmailNotConfirmed",
      message: "Please verify your email address before logging in. Check your inbox for a confirmation link.",
      code: "email_not_confirmed",
    },
    rate_limit_exceeded: {
      name: "RateLimitExceeded",
      message: "Too many requests. Please try again in a minute.",
      code: "rate_limit_exceeded",
    },
  }

  // Check if we have a specific error message for this error code
  if (error.code && errorMap[error.code]) {
    return errorMap[error.code]
  }

  // Check for specific error messages in the error message string
  if (error.message.includes("already registered") || error.message.includes("already in use")) {
    return errorMap["23505"]
  }

  if (error.message.includes("Invalid email")) {
    return errorMap["invalid_email"]
  }

  if (error.message.includes("Password should be")) {
    return {
      name: "WeakPassword",
      message: "Your password doesn't meet the security requirements.",
      code: "weak_password",
      field: "password",
      hint: error.message,
    }
  }

  if (error.message.includes("Invalid login credentials")) {
    return errorMap["invalid_credentials"]
  }

  if (error.message.includes("Email not confirmed")) {
    return errorMap["email_not_confirmed"]
  }

  if (error.message.includes("Too many requests") || error.message.includes("For security purposes")) {
    return errorMap["rate_limit_exceeded"]
  }

  // Default error message - generic for security
  return {
    name: error.name,
    message: isSignup
      ? "There was a problem creating your account. Please check your information and try again."
      : "An unexpected error occurred. Please try again.",
    code: error.code,
  }
}

// Track login attempts to prevent brute force attacks
const loginAttempts: Record<string, { count: number; lastAttempt: number }> = {}

export const signIn = async ({ email, password }: LoginCredentials) => {
  const supabase = supabaseBrowserClient()

  // Check for too many login attempts
  const userAttempts = loginAttempts[email] || { count: 0, lastAttempt: 0 }
  const now = Date.now()

  // Reset attempts if last attempt was more than 15 minutes ago
  if (now - userAttempts.lastAttempt > 15 * 60 * 1000) {
    userAttempts.count = 0
  }

  // Check if user has too many attempts
  if (userAttempts.count >= 5) {
    const timeLeft = Math.ceil((15 * 60 * 1000 - (now - userAttempts.lastAttempt)) / 60000)
    throw {
      name: "TooManyAttempts",
      message: `Too many login attempts. Please try again in ${timeLeft} minutes or reset your password.`,
      code: "too_many_attempts",
    }
  }

  // Update login attempts
  loginAttempts[email] = {
    count: userAttempts.count + 1,
    lastAttempt: now,
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }

    // Reset login attempts on successful login
    loginAttempts[email] = { count: 0, lastAttempt: now }

    return data
  } catch (error: any) {
    // Handle Supabase auth errors
    if (error.name === "AuthApiError" || error.name === "AuthError") {
      throw getErrorMessage(error)
    }

    // Handle other errors
    throw {
      name: error.name || "Error",
      message: error.message || "An unexpected error occurred. Please try again.",
    }
  }
}

export const signUp = async ({ email, password, name }: SignUpCredentials) => {
  const supabase = supabaseBrowserClient()

  try {
    // Attempt to sign up directly - this is the most efficient approach
    // If the email exists, Supabase will return an error
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    console.log("Data : ", data)

    if (error) {
      // If the error indicates the email already exists
      if (error.message.includes("already registered") || error.message.includes("already in use")) {
        // Try to determine if the account is verified by attempting a sign-in
        // with an invalid password (this is more reliable than checking email status)
        try {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password: "ThisIsAnInvalidPasswordForCheckingVerificationStatus",
          })

          if (signInError) {
            // If the error mentions "email not confirmed", the account exists but is not verified
            if (signInError.message.includes("Email not confirmed")) {
              return {
                user: null,
                session: null,
                emailStatus: { exists: true, verified: false },
              }
            }

            // If the error is about invalid credentials, the account exists and is verified
            if (signInError.message.includes("Invalid login credentials")) {
              return {
                user: null,
                session: null,
                emailStatus: { exists: true, verified: true },
              }
            }
          }
        } catch (signInCheckError) {
          console.error("Error checking verification status:", signInCheckError)
        }

        // Default case - we assume the account exists but can't determine verification status
        return {
          user: null,
          session: null,
          emailStatus: { exists: true, verified: true },
        }
      }

      // For other errors, throw them to be handled by the caller
      throw error
    }

    // Only update profile if we have a user and a name
    if (data?.user?.id && name) {
      try {
        await supabase.from("profiles").update({ full_name: name }).eq("id", data.user.id)
      } catch (profileError) {
        console.error("Error updating profile:", profileError)
        // We don't throw here because the signup was successful
        // This is just an enhancement to add the name to the profile
      }
    }

    return {
      ...data,
      emailStatus: { exists: false, verified: false },
    }
  } catch (error: any) {
    // Handle rate limiting errors specifically
    if (error.message && error.message.includes("For security purposes")) {
      throw {
        name: "RateLimitExceeded",
        message: "We're processing too many requests right now. Please try again in a minute.",
        code: "rate_limit_exceeded",
      }
    }

    // Handle Supabase auth errors
    if (error.name === "AuthApiError" || error.name === "AuthError") {
      const enhancedError = getErrorMessage(error, true)
      throw enhancedError
    }

    // Handle other errors
    throw {
      name: error.name || "Error",
      message: error.message || "There was a problem creating your account. Please try again.",
    }
  }
}

// Rest of the auth.ts file remains the same...
export const signOut = async () => {
  const supabase = supabaseBrowserClient()

  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw error
    }
  } catch (error: any) {
    throw {
      name: error.name || "Error",
      message: error.message || "Failed to sign out. Please try again.",
    }
  }
}

export const getCurrentUser = async () => {
  const supabase = supabaseBrowserClient()

  try {
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      return null
    }

    return data?.user || null
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export const getProfile = async () => {
  const supabase = supabaseBrowserClient()

  try {
    const { data: userData } = await supabase.auth.getUser()

    if (!userData?.user) {
      return null
    }

    const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", userData.user.id).single()

    if (error) {
      return null
    }

    return profile
  } catch (error) {
    console.error("Error getting profile:", error)
    return null
  }
}

export const updateProfile = async (profileData: Partial<Database["public"]["Tables"]["profiles"]["Update"]>) => {
  const supabase = supabaseBrowserClient()

  try {
    const { data: userData } = await supabase.auth.getUser()

    if (!userData?.user) {
      throw new Error("User not authenticated")
    }

    const { data, error } = await supabase
      .from("profiles")
      .update(profileData)
      .eq("id", userData.user.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error: any) {
    throw {
      name: error.name || "Error",
      message: error.message || "Failed to update profile. Please try again.",
    }
  }
}

export const resetPassword = async (email: string) => {
  const supabase = supabaseBrowserClient()

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      throw error
    }

    return true
  } catch (error: any) {
    // Handle Supabase auth errors
    if (error.name === "AuthApiError" || error.name === "AuthError") {
      // Don't expose whether an email exists or not for security reasons
      // Just return success even if the email doesn't exist
      if (error.message.includes("user not found")) {
        return true
      }
      throw getErrorMessage(error)
    }

    throw {
      name: error.name || "Error",
      message: error.message || "Failed to send password reset email. Please try again.",
    }
  }
}

export const updatePassword = async (password: string) => {
  const supabase = supabaseBrowserClient()

  try {
    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      throw error
    }

    return true
  } catch (error: any) {
    // Handle Supabase auth errors
    if (error.name === "AuthApiError" || error.name === "AuthError") {
      throw getErrorMessage(error)
    }

    throw {
      name: error.name || "Error",
      message: error.message || "Failed to update password. Please try again.",
    }
  }
}
