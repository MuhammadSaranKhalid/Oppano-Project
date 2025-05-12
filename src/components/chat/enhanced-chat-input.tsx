"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Paperclip, Smile, Send, Mic, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useChatStore } from "@/store/chat-store";
import { useChatApi } from "@/hooks/use-chat-api";
import { useFileUpload } from "@/hooks/use-file-upload";
import { FileVisibility } from "@/interfaces";
import { Progress } from "@/components/ui/progress";
import type { Message } from "@/interfaces";

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: "image" | "video" | "audio" | "file";
  previewUrl: string | null;
  uploading: boolean;
  progress: number;
  file?: File;
}

interface EnhancedChatInputProps {
  conversationId: string;
  onSendMessage: (message: string, attachments: Attachment[]) => Promise<void>;
  inputRef?: React.RefObject<HTMLDivElement>;
  currentUserId: string;
  organizationId: string;
  replyToMessage?: Message | null;
  onCancelReply?: () => void;
}

export function EnhancedChatInput({
  conversationId,
  onSendMessage,
  inputRef: externalInputRef,
  currentUserId,
  organizationId,
  replyToMessage,
  onCancelReply,
}: EnhancedChatInputProps) {
  const { updateTypingStatus, saveDraft } = useChatApi();
  const { uploadFile, getUploadProgress } = useFileUpload();
  const {
    drafts,
    setDraft,
    replyingToMessage,
    setReplyingToMessage,
    editingMessage,
    setEditingMessage,
  } = useChatStore();

  const [message, setMessage] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const internalDivRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(currentUserId);

  // Use the external ref if provided, otherwise use internal ref
  const divRef = externalInputRef || internalDivRef;

  // Set initial message content from draft or editing message
  useEffect(() => {
    if (editingMessage) {
      setMessage(editingMessage.content || "");
      textareaRef.current?.focus();
    } else if (conversationId && drafts[conversationId]) {
      setMessage(drafts[conversationId]);
    } else {
      setMessage("");
    }
  }, [conversationId, editingMessage, drafts]);

  // Handle typing indicator
  useEffect(() => {
    if (!currentUser) return;

    let typingTimeout: NodeJS.Timeout;

    const handleTypingStatus = async () => {
      if (message.trim()) {
        // Set typing status to true when there's content
        await updateTypingStatus(conversationId, true);

        // Clear any existing timeout
        if (typingTimeout) clearTimeout(typingTimeout);

        // Set a timeout to clear typing status after 3 seconds of no changes
        typingTimeout = setTimeout(async () => {
          await updateTypingStatus(conversationId, false);
        }, 3000);
      } else {
        // Clear typing status when message is empty
        await updateTypingStatus(conversationId, false);
      }
    };

    // Debounce the typing status updates
    const debounceTimeout = setTimeout(() => {
      handleTypingStatus();
    }, 300);

    return () => {
      clearTimeout(debounceTimeout);
      clearTimeout(typingTimeout);

      // Clear typing status when component unmounts
      if (currentUser) {
        updateTypingStatus(conversationId, false).catch(console.error);
      }
    };
  }, [message, conversationId, currentUser, updateTypingStatus]);

  // Save draft when typing
  useEffect(() => {
    if (!conversationId || editingMessage) return;

    const draftTimeout = setTimeout(() => {
      if (message.trim()) {
        setDraft(conversationId, message);
        saveDraft(conversationId, message);
      }
    }, 1000);

    return () => clearTimeout(draftTimeout);
  }, [message, conversationId, editingMessage, setDraft, saveDraft]);

  // Clear typing status when unmounting
  useEffect(() => {
    return () => {
      if (isComposing) {
        updateTypingStatus(conversationId, false);
      }
    };
  }, [conversationId, currentUserId, isComposing, updateTypingStatus]);

  // Initialize file upload component
  // useEffect(() => {
  //   const initializeFileUpload = async () => {
  //     try {
  //       // Import the function dynamically to avoid server-side issues
  //       const { ensureStorageBucket } = await import("@/lib/supabase");

  //       // Ensure the storage bucket exists - use "oppano" as the bucket name
  //       await ensureStorageBucket("oppano");
  //       console.log("File upload initialized successfully with bucket: oppano");
  //     } catch (error) {
  //       console.error("Error initializing file upload:", error);
  //     }
  //   };

  //   initializeFileUpload();
  // }, []);

  const handleSendMessage = async () => {
    // FIXED: Allow sending if there's either text content OR attachments
    if (message.trim() || attachments.length > 0) {
      try {
        console.log("Sending message with content:", message);
        console.log("Sending attachments:", attachments);

        await onSendMessage(message.trim(), attachments);
        setMessage("");
        setAttachments([]);

        // Reset textarea height
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }

        // Clear typing status when sending a message
        updateTypingStatus(conversationId, false);
        setIsComposing(false);

        // Clear reply and edit states
        setReplyingToMessage(null);
        setEditingMessage(null);

        // Clear draft
        setDraft(conversationId, "");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Check if it's an IME composition
    if (e.nativeEvent.isComposing) return;

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    setIsEmojiPickerOpen(false);
    textareaRef.current?.focus();
  };

  const handleImageSelect = () => {
    console.log("Opening image file dialog");
    // Close the popover first
    setIsAttachmentMenuOpen(false);
    // Use setTimeout to ensure the popover is closed before opening the file dialog
    setTimeout(() => {
      if (imageInputRef.current) {
        imageInputRef.current.click();
      } else {
        console.error("Image input ref is null");
      }
    }, 100);
  };

  const handleDocumentSelect = () => {
    console.log("Opening document file dialog");
    // Close the popover first
    setIsAttachmentMenuOpen(false);
    // Use setTimeout to ensure the popover is closed before opening the file dialog
    setTimeout(() => {
      if (documentInputRef.current) {
        documentInputRef.current.click();
      } else {
        console.error("Document input ref is null");
      }
    }, 100);
  };

  // Direct file selection without popover
  const handleDirectFileSelect = () => {
    console.log("Opening direct file dialog");
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.error("File input ref is null");
    }
  };

  const processFiles = async (files: FileList | null, fileType?: string) => {
    if (!files || files.length === 0) return;

    console.log("Files selected:", files.length);
    const newAttachments: Attachment[] = [];

    for (const file of Array.from(files)) {
      console.log("Processing file:", file.name, file.type, file.size);

      const type: any = fileType
        ? fileType
        : file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
        ? "video"
        : file.type.startsWith("audio/")
        ? "audio"
        : "file"; // Ensure "file" is a valid fallback

      // Create object URL for preview
      const previewUrl = type === "image" ? URL.createObjectURL(file) : null;

      const attachment: Attachment = {
        id: Math.random().toString(36).substring(2),
        name: file.name,
        size: file.size,
        type,
        previewUrl,
        uploading: true,
        progress: 0,
        file,
      };

      newAttachments.push(attachment);
      console.log("Created attachment:", attachment);

      try {
        // Upload file to Supabase
        console.log("Uploading file to Supabase:", file.name);
        const uploadedFile = await uploadFile(file, {
          organizationId,
          userId: currentUserId,
          visibility: FileVisibility.ORGANIZATION,
        });

        if (uploadedFile) {
          console.log("File uploaded successfully:", uploadedFile);
          // Update attachment with file info
          attachment.id = uploadedFile.id;
          attachment.uploading = false;
          attachment.progress = 100;
        } else {
          console.error("File upload returned null");
          attachment.uploading = false;
          attachment.progress = 0;
        }
      } catch (error) {
        console.error("Error in file upload:", error);
        attachment.uploading = false;
        attachment.progress = 0;
      }
    }

    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await processFiles(e.target.files);
    // Reset file input
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await processFiles(e.target.files, "image");
    // Reset file input
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleDocumentChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    await processFiles(e.target.files, "file");
    // Reset file input
    if (e.target) {
      e.target.value = "";
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => {
      const updated = prev.filter((attachment) => attachment.id !== id);
      // Revoke object URLs to prevent memory leaks
      const attachment = prev.find((a) => a.id === id);
      if (attachment?.previewUrl) {
        URL.revokeObjectURL(attachment.previewUrl);
      }
      return updated;
    });
  };

  const handleRecordToggle = () => {
    setIsRecording(!isRecording);
    // Here you would implement voice recording logic
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  // Mock EmojiPicker component
  const EmojiPicker = ({ onSelect }: { onSelect: (emoji: string) => void }) => {
    const commonEmojis = [
      "😊",
      "👍",
      "❤️",
      "🎉",
      "🔥",
      "😂",
      "🙏",
      "✨",
      "🤔",
      "😍",
      "👏",
      "🥳",
    ];

    return (
      <div
        className="p-3 max-h-[300px] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={(e) => e.stopPropagation()}
      >
        <div className="mb-2 text-sm font-medium">Frequently used</div>
        <div className="grid grid-cols-6 gap-2">
          {commonEmojis.map((emoji) => (
            <button
              key={`emoji-picker-${emoji}`}
              className="flex h-9 w-9 items-center justify-center rounded-md text-xl hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(emoji);
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // useEffect(() => {
  //   if (replyToMessage) {
  //     textareaRef.current?.focus();
  //   }
  // }, [replyToMessage]);

  // Set reply state from prop
  useEffect(() => {
    if (replyToMessage) {
      setReplyingToMessage(replyToMessage);
      textareaRef.current?.focus();
    }
  }, [replyToMessage, setReplyingToMessage]);

  return (
    <div className="border-t p-4">
      {/* Reply indicator */}
      {/* {replyToMessage && ( */}
      {(replyToMessage || replyingToMessage) && (
        <div className="flex items-center justify-between mb-2 p-2 bg-gray-50 rounded-md">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">
              {/* Replying to{" "}
              <span className="font-medium">
                {replyToMessage.sender?.username || "Unknown"}
              </span>
            </span> */}
              Replying to{" "}
              <span className="font-medium">
                {(replyToMessage || replyingToMessage)?.sender?.username ||
                  "Unknown"}
              </span>
            </span>
            {/* <span className="text-sm truncate">{replyToMessage.content}</span> */}
            <span className="text-sm truncate">
              {(replyToMessage || replyingToMessage)?.content}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancelReply}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Edit indicator */}
      {editingMessage && (
        <div className="flex items-center justify-between mb-2 p-2 bg-gray-50 rounded-md">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Editing message</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditingMessage(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {attachments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="group relative overflow-hidden rounded-md border border-gray-200 bg-gray-50"
            >
              {attachment.type === "image" && attachment.previewUrl ? (
                <div className="relative h-20 w-20">
                  <img
                    src={attachment.previewUrl || "/placeholder.svg"}
                    alt={attachment.name}
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={() => removeAttachment(attachment.id)}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white opacity-100 transition-opacity group-hover:opacity-100"
                    aria-label="Remove attachment"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  {attachment.uploading && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/30 p-1">
                      <Progress
                        value={attachment.progress}
                        className="h-1 w-full"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-16 items-center gap-2 px-3 py-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                    {attachment.type === "video" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-500"
                      >
                        <polygon points="23 7 16 12 23 17 23 7"></polygon>
                        <rect
                          x="1"
                          y="5"
                          width="15"
                          height="14"
                          rx="2"
                          ry="2"
                        ></rect>
                      </svg>
                    ) : attachment.type === "audio" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-500"
                      >
                        <path d="M9 18V5l12-2v13"></path>
                        <circle cx="6" cy="18" r="3"></circle>
                        <circle cx="18" cy="16" r="3"></circle>
                      </svg>
                    ) : (
                      <FileText className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">
                      {attachment.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(attachment.size / 1024).toFixed(1)} KB
                    </p>
                    {attachment.uploading && (
                      <Progress
                        value={attachment.progress}
                        className="h-1 w-full mt-1"
                      />
                    )}
                  </div>
                  <button
                    onClick={() => removeAttachment(attachment.id)}
                    className="ml-1 flex h-6 w-6 items-center justify-center rounded-full hover:bg-gray-200"
                    aria-label="Remove attachment"
                  >
                    <X className="h-3 w-3 text-gray-500" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="relative flex items-end rounded-lg border bg-background p-2">
        {/* Direct attachment button (no popover) */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          aria-label="Attach file"
          onClick={handleDirectFileSelect}
        >
          <Paperclip className="h-5 w-5 text-gray-500" />
        </Button>

        <div className="relative flex-1 overflow-hidden">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              editingMessage ? "Edit your message..." : "Type a message..."
            }
            className="max-h-[120px] min-h-[40px] w-full resize-none bg-transparent px-3 py-2 outline-none"
            rows={1}
          />
          {message && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full"
              onClick={() => setMessage("")}
              aria-label="Clear message"
            >
              <X className="h-4 w-4 text-gray-400" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Popover
            open={isEmojiPickerOpen}
            onOpenChange={(open) => {
              if (open !== isEmojiPickerOpen) {
                setIsEmojiPickerOpen(open);
              }
            }}
          >
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                aria-label="Add emoji"
                onClick={(e) => e.stopPropagation()}
              >
                <Smile className="h-5 w-5 text-gray-500" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-0"
              align="end"
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={(e) => e.stopPropagation()}
              onMouseLeave={(e) => e.stopPropagation()}
            >
              <EmojiPicker onSelect={handleEmojiSelect} />
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 rounded-full ${
              isRecording ? "bg-red-100 text-red-500" : ""
            }`}
            onClick={handleRecordToggle}
            aria-label={isRecording ? "Stop recording" : "Record voice message"}
          >
            <Mic className="h-5 w-5 text-gray-500" />
          </Button>

          <Button
            size="icon"
            className="h-8 w-8 rounded-full bg-[#ff6a00] text-white hover:bg-[#ff8c40]"
            onClick={handleSendMessage}
            // FIXED: Enable the button if there's either text content OR attachments
            disabled={!message.trim() && attachments.length === 0}
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Hidden file inputs */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,video/*,audio/*,.doc,.docx,.pdf,.txt,.csv,.xls,.xlsx"
          onChange={handleFileChange}
          onClick={(e) => e.stopPropagation()}
        />

        <input
          type="file"
          ref={imageInputRef}
          className="hidden"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          onClick={(e) => e.stopPropagation()}
        />

        <input
          type="file"
          ref={documentInputRef}
          className="hidden"
          multiple
          accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,.doc,.docx,.pdf,.txt,.csv,.xls,.xlsx"
          onChange={handleDocumentChange}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}
