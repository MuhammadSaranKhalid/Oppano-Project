"use client";

import type React from "react";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
// import { useNotification } from "@/providers/notification-provider"
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useCreate, useUpdate } from "@refinedev/core";
import { Paperclip, Send } from "lucide-react";
// import { useSupabase } from "@/providers/supabase-provider"
// import { useSession } from "@/providers/supabase-provider"
import { supabaseBrowserClient } from "@utils/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

// Define the form schema using zod
const formSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
});

type MessageFormProps = {
  conversationId: string;
  replyToId?: string;
  editMessageId?: string;
  initialContent?: string;
  onSuccess?: () => void;
};

/**
 * MessageForm component
 * Form for creating or editing a message
 */
export function MessageForm({
  conversationId,
  replyToId,
  editMessageId,
  initialContent = "",
  onSuccess,
}: MessageFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // const notification = useNotification()
  // const supabase = useSupabase()
  const session = useSession();

  // Initialize the form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: initialContent,
    },
  });

  // Get Refine mutations for create and update
  const { mutate: createMutation } = useCreate();
  const { mutate: updateMutation } = useUpdate();

  // Handle file selection
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...newFiles]);
    }
  };

  // Remove an attachment
  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Upload attachments to Supabase storage
  const uploadAttachments = async (messageId: string) => {
    const uploadedAttachments = [];

    for (const file of attachments) {
      const fileName = `${Date.now()}_${file.name}`;
      const { data: fileData, error: uploadError } =
        await supabaseBrowserClient.storage
          .from("attachments")
          .upload(fileName, file);

      if (uploadError) {
        // notification.error(`Failed to upload ${file.name}`)
        console.error(uploadError);
        continue;
      }

      // Get the public URL for the uploaded file
      const { data: urlData } = supabaseBrowserClient.storage
        .from("attachments")
        .getPublicUrl(fileName);

      // Create the attachment record
      const { data: attachmentData, error: attachmentError } =
        await supabaseBrowserClient
          .from("attachments")
          .insert({
            name: file.name,
            type: file.type,
            size: file.size,
            url: urlData.publicUrl,
            messageId,
          })
          .select()
          .single();

      if (attachmentError) {
        // notification.error(`Failed to save attachment ${file.name}`)
        console.error(attachmentError);
        continue;
      }

      uploadedAttachments.push(attachmentData);
    }

    return uploadedAttachments;
  };

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!session) {
      // notification.error("You must be logged in to send messages")
      return;
    }

    setIsLoading(true);
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
            },
          },
          {
            onSuccess: () => {
              form.reset({ content: "" });
              setAttachments([]);
              if (onSuccess) onSuccess();
            },
            onError: (error) => {
              // notification.error("Failed to update message")
              console.error(error);
            },
          }
        );
      } else {
        // Create new message
        const messageData = {
          content: values.content,
          conversationId,
          userId: session.user.id,
          replyToId: replyToId || null,
        };

        createMutation(
          {
            resource: "messages",
            values: messageData,
          },
          {
            onSuccess: async (data) => {
              const messageId = data?.data?.id;

              // Upload attachments if there are any
              if (attachments.length > 0 && messageId) {
                await uploadAttachments(String(messageId));
              }

              form.reset({ content: "" });
              setAttachments([]);
              if (onSuccess) onSuccess();
            },
            onError: (error) => {
              // notification.error("Failed to send message")
              console.error(error);
            },
          }
        );
      }
    } catch (error) {
      // notification.error("An error occurred")
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Display selected attachments */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center bg-muted p-1 rounded-md text-xs"
                >
                  <span className="truncate max-w-[150px]">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 ml-1"
                    onClick={() => removeAttachment(index)}
                  >
                    &times;
                  </Button>
                </div>
              ))}
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
                      placeholder="Type your message..."
                      className="resize-none min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleFileSelect}
                disabled={isLoading}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  "Sending..."
                ) : editMessageId ? (
                  "Update"
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
