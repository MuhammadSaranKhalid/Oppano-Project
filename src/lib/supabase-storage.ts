import { v4 as uuidv4 } from "uuid"
// import type { FileVisibility } from "@/types/supabase"
import { supabaseBrowserClient as supabase } from "@utils/supabase/client"
import { getCurrentUser, getCurrentUserOrganization } from "./supabase-client"

// Storage bucket name
export const FILE_BUCKET = "files"

// File metadata interface
export interface FileMetadata {
    id: string
    name: string
    original_name: string
    mime_type: string
    extension?: string | null
    size: number
    url: string
    thumbnail_url?: string | null
    organization_id: string
    uploader_id: string
    visibility: any
    metadata?: any
    uploaded_at?: string
    updated_at?: string
    user_profiles?: {
        username?: string
        profile_picture?: string
    }
}

/**
 * Upload a file to Supabase storage
 */
export async function uploadFile(
    file: File,
    options?: {
        visibility?: any
        metadata?: any
        fileId?: string
        path?: string
    }
): Promise<FileMetadata> {
    const {
        visibility = "ORGANIZATION",
        metadata = {},
        fileId = uuidv4(),
        path = ""
    } = options || {}

    // Get current user and organization
    const user = await getCurrentUser()
    const organization = await getCurrentUserOrganization()

    if (!user) {
        throw new Error("User not authenticated")
    }

    if (!organization) {
        throw new Error("User not associated with any organization")
    }

    // Create storage path
    const storagePath = path
        ? `${organization.id}/${path}/${fileId}-${file.name}`
        : `${organization.id}/${fileId}-${file.name}`

    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
        .from(FILE_BUCKET)
        .upload(storagePath, file, {
            cacheControl: "3600",
            upsert: false
        })

    if (error) throw error

    // Get public URL
    const { data: urlData } = supabase.storage
        .from(FILE_BUCKET)
        .getPublicUrl(storagePath)

    // Create thumbnail for images if needed
    let thumbnailUrl = null
    if (file.type.startsWith("image/")) {
        // For simplicity, we're just using the same image as thumbnail
        // In a production app, you'd resize the image
        const thumbnailPath = `${organization.id}/thumbnails/${fileId}-${file.name}`

        try {
            await supabase.storage
                .from(FILE_BUCKET)
                .upload(thumbnailPath, file, {
                    cacheControl: "3600",
                    upsert: false
                })

            const { data: thumbUrlData } = supabase.storage
                .from(FILE_BUCKET)
                .getPublicUrl(thumbnailPath)

            thumbnailUrl = thumbUrlData.publicUrl
        } catch (err) {
            console.error("Error creating thumbnail:", err)
            // Continue without thumbnail if it fails
        }
    }

    // Save file metadata to database
    const fileData: FileMetadata = {
        id: fileId,
        name: file.name,
        original_name: file.name,
        mime_type: file.type,
        extension: file.name.split(".").pop() || null,
        size: file.size,
        url: urlData.publicUrl,
        thumbnail_url: thumbnailUrl,
        organization_id: organization.id,
        uploader_id: user.id,
        visibility,
        metadata
    }

    // Insert file metadata into database
    const { data: insertedData, error: dbError } = await supabase
        .from("files")
        .insert(fileData)
        .select()
        .single()

    if (dbError) throw dbError

    return fileData
}

/**
 * Delete a file
 */
export async function deleteFile(fileId: string): Promise<void> {
    // Get file metadata
    const { data: fileData, error: fetchError } = await supabase
        .from("files")
        .select("*")
        .eq("id", fileId)
        .single()

    if (fetchError) throw fetchError

    // Extract storage path from URL
    const urlParts = fileData.url.split("/")
    const storagePath = urlParts.slice(urlParts.indexOf(FILE_BUCKET) + 1).join("/")

    // Delete from storage
    const { error: storageError } = await supabase.storage
        .from(FILE_BUCKET)
        .remove([storagePath])

    if (storageError) throw storageError

    // Delete thumbnail if it exists
    if (fileData.thumbnail_url) {
        const thumbUrlParts = fileData.thumbnail_url.split("/")
        const thumbnailPath = thumbUrlParts.slice(thumbUrlParts.indexOf(FILE_BUCKET) + 1).join("/")

        try {
            await supabase.storage
                .from(FILE_BUCKET)
                .remove([thumbnailPath])
        } catch (err) {
            console.error("Error deleting thumbnail:", err)
            // Continue even if thumbnail deletion fails
        }
    }

    // Delete from database
    const { error: dbError } = await supabase
        .from("files")
        .delete()
        .eq("id", fileId)

    if (dbError) throw dbError
}

/**
 * Get files for an organization
 */
export async function getOrganizationFiles(
    options?: {
        searchQuery?: string
        sortBy?: string
        sortOrder?: 'asc' | 'desc'
        limit?: number
        page?: number
    }
): Promise<FileMetadata[]> {
    const {
        searchQuery,
        sortBy = "uploaded_at",
        sortOrder = "desc",
        limit = 100,
        page = 1
    } = options || {}

    // Get current organization
    const organization = await getCurrentUserOrganization()

    if (!organization) {
        throw new Error("User not associated with any organization")
    }

    let query = supabase
        .from("files")
        .select("*, user_profiles:users(username, profile_picture)")
        .eq("organization_id", organization.id)

    // Apply search filter if provided
    if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`)
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === "asc" })

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error } = await query

    if (error) throw error

    return data || []
}
