"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useNotification } from "@/providers/notification-provider"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { useCreate, useUpdate } from "@refinedev/core"
import { Paperclip, Send, X, ImageIcon, FileText, Mic, Video } from "lucide-react"
import { useSupabase } from "@/providers/supabase-provider"
import { useSession } from "@/providers/supabase-provider"
import { Progress } from "@/components/ui/progress"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Define the form schema using zod
const formSchema = z.object({
  content: z.string().min(1, "Message cannot be empty").or(z.string().optional()),
})

type FileUpload = {
  file: File
  progress: number
  preview?: string
  uploading: boolean
  error?: string
}

type EnhancedMessageFormProps = {
  conversationId: string
  replyToId?: string
  forwardedMessageId?: string
  editMessageId?: string
  initialContent?: string
  onSuccess?: () => void
  onCancel?: () => void
}

/**
 * EnhancedMessageForm component
 * Advanced form for creating or editing a message with file uploads, replies, and forwarding
 */
export function EnhancedMessageForm({
  conversationId,
  replyToId,
  forwardedMessageId,
  editMessageId,
  initialContent = "",
  onSuccess,
  onCancel,
}: EnhancedMessageFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [fileUploads, setFileUploads] = useState<FileUpload[]>([])
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)
  const notification = useNotification()
  const supabase = useSupabase()
  const session = useSession()

  // Initialize the form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: initialContent,
    },
  })

  // Get Refine mutations for create and update
  const { mutate: createMutation } = useCreate()
  const { mutate: updateMutation } = useUpdate()
  const { mutate: forwardMutation } = useCreate()

  // Handle file selection based on type
  const handleFileSelect = (type: "file" | "image" | "video" | "audio") => {
    setIsAttachmentMenuOpen(false)

    switch (type) {
      case "image":
        imageInputRef.current?.click()
        break
      case "video":
        videoInputRef.current?.click()
        break
      case "audio":
        audioInputRef.current?.click()
        break
      default:
        fileInputRef.current?.click()
    }
  }

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)

      // Create file upload objects with previews for images
      const newFileUploads = newFiles.map((file) => {
        const fileUpload: FileUpload = {
          file,
          progress: 0,
          uploading: false,
        }

        // Generate preview for images
        if (file.type.startsWith("image/")) {
          fileUpload.preview = URL.createObjectURL(file)
        }

        return fileUpload
      })

      setFileUploads((prev) => [...prev, ...newFileUploads])
    }

    // Reset the input value so the same file can be selected again
    e.target.value = ""
  }

  // Remove a file upload
  const removeFileUpload = (index: number) => {
    setFileUploads((prev) => {
      const newUploads = [...prev]
      // Revoke object URL if it exists to prevent memory leaks
      if (newUploads[index].preview) {
        URL.revokeObjectURL(newUploads[index].preview!)
      }
      newUploads.splice(index, 1)
      return newUploads
    })
  }

  // Upload files to Supabase storage
  const uploadFiles = async (messageId: string) => {
    const uploadPromises = fileUploads.map(async (fileUpload, index) => {
      try {
        // Update progress state
        setFileUploads((prev) => {
          const newUploads = [...prev]
          newUploads[index] = { ...newUploads[index], uploading: true }
          return newUploads
        })

        const file = fileUpload.file
        const fileExt = file.name.split(".").pop()
        const fileName = `${messageId}/${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `messages/${fileName}`

        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("attachments")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
            onUploadProgress: (progress) => {
              const percent = Math.round((progress.loaded / progress.total) * 100)
              setFileUploads((prev) => {
                const newUploads = [...prev]
                newUploads[index] = { ...newUploads[index], progress: percent }
                return newUploads
              })
            },
          })

        if (uploadError) {
          throw uploadError
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage.from("attachments").getPublicUrl(filePath)

        // Create attachment record in database
        const { data: attachmentData, error: attachmentError } = await supabase
          .from("attachments")
          .insert({
            messageId,
            name: file.name,
            size: file.size,
            type: file.type,
            url: publicUrlData.publicUrl,
            path: filePath,
          })
          .select()
          .single()

        if (attachmentError) {
          throw attachmentError
        }

        // Update progress state to complete
        setFileUploads((prev) => {
          const newUploads = [...prev]
          newUploads[index] = {
            ...newUploads[index],
            uploading: false,
            progress: 100,
          }
          return newUploads
        })

        return attachmentData
      } catch (error) {
        console.error("Upload error:", error)

        // Update state to show error
        setFileUploads((prev) => {
          const newUploads = [...prev]
          newUploads[index] = {
            ...newUploads[index],
            uploading: false,
            error: "Upload failed",
          }
          return newUploads
        })

        notification.error(`Failed to upload ${fileUpload.file.name}`)
        return null
      }
    })

    return Promise.all(uploadPromises)
  }

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!session) {
      notification.error("You must be logged in to send messages")
      return
    }

    // Validate that either content or files are provided
    if (!values.content && fileUploads.length === 0 && !forwardedMessageId) {
      notification.error("Please enter a message or attach a file")
      return
    }

    setIsLoading(true)
    try {
      if (editMessageId) {
        // Update existing message
        updateMutation(
          {
            resource: "messages",
            id: editMessageId,
            values: {
              content: values.content,
              edited: true,
              updatedAt: new Date().toISOString(),
            },
          },
          {
            onSuccess: async (data) => {
              // Upload any new files if present
              if (fileUploads.length > 0) {
                await uploadFiles(editMessageId)
              }

              form.reset({ content: "" })
              setFileUploads([])
              if (onSuccess) onSuccess()
              notification.success("Message updated successfully")
            },
            onError: (error) => {
              notification.error("Failed to update message")
              console.error(error)
            },
          },
        )
      } else if (forwardedMessageId) {
        // Forward an existing message to this conversation
        const { data: originalMessage, error } = await supabase
          .from("messages")
          .select("*, user:userId(*), attachments(*)")
          .eq("id", forwardedMessageId)
          .single()

        if (error || !originalMessage) {
          notification.error("Failed to forward message")
          setIsLoading(false)
          return
        }

        // Create new message with forwarded content
        const forwardedContent = values.content
          ? `${values.content}\n\n--- Forwarded message ---\n${originalMessage.content}`
          : `--- Forwarded message from ${originalMessage.user?.name || "User"} ---\n${originalMessage.content}`

        createMutation(
          {
            resource: "messages",
            values: {
              content: forwardedContent,
              conversationId,
              userId: session.user.id,
              forwardedFromId: forwardedMessageId,
              createdAt: new Date().toISOString(),
            },
          },
          {
            onSuccess: async (data) => {
              const newMessageId = data?.data?.id

              // If original message had attachments, duplicate them
              if (originalMessage.attachments && originalMessage.attachments.length > 0 && newMessageId) {
                const attachmentPromises = originalMessage.attachments.map(async (attachment: any) => {
                  // Create new attachment record linking to same file
                  await supabase.from("attachments").insert({
                    messageId: newMessageId,
                    name: attachment.name,
                    size: attachment.size,
                    type: attachment.type,
                    url: attachment.url,
                    path: attachment.path,
                  })
                })

                await Promise.all(attachmentPromises)
              }

              form.reset({ content: "" })
              if (onSuccess) onSuccess()
              notification.success("Message forwarded successfully")
            },
            onError: (error) => {
              notification.error("Failed to forward message")
              console.error(error)
            },
          },
        )
      } else {
        // Create new message
        createMutation(
          {
            resource: "messages",
            values: {
              content: values.content || "",
              conversationId,
              userId: session.user.id,
              replyToId: replyToId || null,
              createdAt: new Date().toISOString(),
            },
          },
          {
            onSuccess: async (data) => {
              const messageId = data?.data?.id

              // Upload files if there are any
              if (fileUploads.length > 0 && messageId) {
                await uploadFiles(messageId)
              }

              form.reset({ content: "" })
              setFileUploads([])
              if (onSuccess) onSuccess()
              notification.success("Message sent successfully")
            },
            onError: (error) => {
              notification.error("Failed to send message")
              console.error(error)
            },
          },
        )
      }
    } catch (error) {
      notification.error("An error occurred")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Render file preview based on type
  const renderFilePreview = (fileUpload: FileUpload, index: number) => {
    const { file, progress, preview, uploading, error } = fileUpload
    const fileType = file.type.split("/")[0]

    return (
      <div
        key={index}
        className={cn(
          "relative group border rounded-md overflow-hidden",
          error ? "border-red-300 bg-red-50" : "border-gray-200",
        )}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/50 text-white opacity-80 hover:opacity-100 z-10"
          onClick={() => removeFileUpload(index)}
        >
          <X className="h-3 w-3" />
        </Button>

        {fileType === "image" && preview ? (
          <div className="relative w-24 h-24">
            <img src={preview || "/placeholder.svg"} alt={file.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="flex items-center p-2 gap-2 w-full max-w-[200px]">
            {fileType === "video" ? (
              <Video className="h-5 w-5 text-blue-500" />
            ) : fileType === "audio" ? (
              <Mic className="h-5 w-5 text-green-500" />
            ) : (
              <FileText className="h-5 w-5 text-gray-500" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs truncate">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
        )}

        {uploading && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/20 px-2 py-1">
            <Progress value={progress} className="h-1" />
          </div>
        )}

        {error && (
          <div className="absolute bottom-0 left-0 right-0 bg-red-500 px-2 py-1">
            <p className="text-xs text-white truncate">Upload failed</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Display file previews */}
          {fileUploads.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {fileUploads.map((fileUpload, index) => renderFilePreview(fileUpload, index))}
            </div>
          )}

          <div className="flex items-end gap-2">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Textarea
                      placeholder={fileUploads.length > 0 ? "Add a caption (optional)..." : "Type your message..."}
                      className="resize-none min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              {/* Hidden file inputs */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileChange(e, "file")}
                className="hidden"
                multiple
              />
              <input
                type="file"
                ref={imageInputRef}
                onChange={(e) => handleFileChange(e, "image")}
                className="hidden"
                accept="image/*"
                multiple
              />
              <input
                type="file"
                ref={videoInputRef}
                onChange={(e) => handleFileChange(e, "video")}
                className="hidden"
                accept="video/*"
                multiple
              />
              <input
                type="file"
                ref={audioInputRef}
                onChange={(e) => handleFileChange(e, "audio")}
                className="hidden"
                accept="audio/*"
                multiple
              />

              {/* Attachment menu */}
              <Popover open={isAttachmentMenuOpen} onOpenChange={setIsAttachmentMenuOpen}>
                <PopoverTrigger asChild>
                  <Button type="button" variant="outline" size="icon" disabled={isLoading}>
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48" align="end">
                  <div className="grid gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex w-full justify-start gap-2 px-2 py-1.5 text-sm"
                      onClick={() => handleFileSelect("image")}
                    >
                      <ImageIcon className="h-4 w-4" />
                      <span>Image</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex w-full justify-start gap-2 px-2 py-1.5 text-sm"
                      onClick={() => handleFileSelect("video")}
                    >
                      <Video className="h-4 w-4" />
                      <span>Video</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex w-full justify-start gap-2 px-2 py-1.5 text-sm"
                      onClick={() => handleFileSelect("audio")}
                    >
                      <Mic className="h-4 w-4" />
                      <span>Audio</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex w-full justify-start gap-2 px-2 py-1.5 text-sm"
                      onClick={() => handleFileSelect("file")}
                    >
                      <FileText className="h-4 w-4" />
                      <span>Document</span>
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Cancel button for edit/reply/forward mode */}
              {(editMessageId || replyToId || forwardedMessageId) && (
                <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
                  Cancel
                </Button>
              )}

              {/* Send button */}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Sending..." : editMessageId ? "Update" : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
