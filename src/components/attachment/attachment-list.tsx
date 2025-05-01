"use client"

import { useState, useEffect } from "react"
import { useList } from "@refinedev/core"
import { useNotification } from "@/providers/notification-provider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { formatDateTime } from "@/lib/utils"
import { Download, Eye, FileText, ImageIcon, Trash, Video, File } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/providers/supabase-provider"

/**
 * AttachmentList component
 * Displays a list of attachments with options to view, download, and delete
 */
export function AttachmentList() {
  const [attachments, setAttachments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const notification = useNotification()
  const router = useRouter()
  const supabase = useSupabase()

  // Fetch attachments using Refine's useList hook
  const {
    data,
    isLoading: listLoading,
    isError,
  } = useList({
    resource: "attachments",
    pagination: {
      current: 1,
      pageSize: 20,
    },
    sorters: [
      {
        field: "createdAt",
        order: "desc",
      },
    ],
    // Include related data
    meta: {
      select: "*, message:messageId(*)",
    },
  })

  // Update local state when data changes
  useEffect(() => {
    if (data?.data) {
      setAttachments(data.data)
      setIsLoading(false)
    }
  }, [data])

  // Handle attachment deletion
  const handleDelete = async (id: string, fileName: string) => {
    try {
      // Delete the file from storage
      const { error: storageError } = await supabase.storage.from("attachments").remove([fileName])

      if (storageError) {
        throw storageError
      }

      // Delete the attachment record
      const response = await fetch(`/api/attachments/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete attachment")
      }

      // Update the local state
      setAttachments(attachments.filter((attachment) => attachment.id !== id))
      notification.success("Attachment deleted successfully")
    } catch (error) {
      notification.error("Failed to delete attachment")
      console.error(error)
    }
  }

  // Get file icon based on type
  const getFileIcon = (type: string) => {
    const fileType = type.split("/")[0]

    switch (fileType) {
      case "image":
        return <ImageIcon className="h-6 w-6" />
      case "video":
        return <Video className="h-6 w-6" />
      case "text":
      case "application":
        if (type.includes("pdf")) {
          return <FileText className="h-6 w-6" />
        }
        return <File className="h-6 w-6" />
      default:
        return <File className="h-6 w-6" />
    }
  }

  // Show loading state
  if (isLoading || listLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  // Show error state
  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Error loading attachments</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Attachments</h2>
      </div>

      {attachments.length === 0 ? (
        <div className="flex justify-center items-center h-64 border rounded-lg">
          <div className="text-center">
            <p className="text-gray-500 mb-4">No attachments found</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {attachments.map((attachment) => (
            <Card key={attachment.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-4">
                  {getFileIcon(attachment.type)}
                  <div className="flex-1 truncate">
                    <CardTitle className="text-base truncate">{attachment.name}</CardTitle>
                    <CardDescription>Uploaded on {formatDateTime(attachment.createdAt)}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Size: </span>
                    <span>{Math.round(attachment.size / 1024)} KB</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Type: </span>
                    <span>{attachment.type}</span>
                  </div>
                  {attachment.message && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Message: </span>
                      <span className="truncate block">
                        {attachment.message.content.substring(0, 50)}
                        {attachment.message.content.length > 50 ? "..." : ""}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                      <Eye className="mr-2 h-4 w-4" /> View
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={attachment.url} download={attachment.name}>
                      <Download className="mr-2 h-4 w-4" /> Download
                    </a>
                  </Button>
                </div>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(attachment.id, attachment.name)}>
                  <Trash className="mr-2 h-4 w-4" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
