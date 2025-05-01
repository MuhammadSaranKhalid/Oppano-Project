"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Paperclip, Smile, Send, Mic, ImageIcon, FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { EmojiPicker } from "@/components/chat/emoji-picker"
import { useChatStore } from "@/store/chat-store"
import { useDebounce } from "use-debounce"

export interface Attachment {
  name: string
  size: number
  type: "image" | "video" | "audio" | "file"
  previewUrl: string | null
  uploading: boolean
  progress: number
}

interface EnhancedChatInputProps {
  conversationId: string
  onSendMessage: (message: string, attachments: Attachment[]) => void
}

export function EnhancedChatInput({ conversationId, onSendMessage }: EnhancedChatInputProps) {
  const [message, setMessage] = useState("")
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isComposing, setIsComposing] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { currentUser, setUserTyping } = useChatStore()
  const [debouncedMessage] = useDebounce(message, 500)
  const [attachments, setAttachments] = useState<Attachment[]>([])

  // Handle typing indicator
  useEffect(() => {
    if (!currentUser?.id) return

    // If there's content, set typing to true
    if (message.trim().length > 0 && !isComposing) {
      setIsComposing(true)
      setUserTyping(conversationId, currentUser.id, true)
    }

    // If message is empty, set typing to false
    if (message.trim().length === 0 && isComposing) {
      setIsComposing(false)
      setUserTyping(conversationId, currentUser.id, false)
    }

    // Set up a timer to clear typing status after 3 seconds of no changes
    const typingTimer = setTimeout(() => {
      if (isComposing) {
        setIsComposing(false)
        setUserTyping(conversationId, currentUser.id, false)
      }
    }, 3000)

    return () => clearTimeout(typingTimer)
  }, [debouncedMessage, currentUser, conversationId, setUserTyping, isComposing])

  // Clear typing status when unmounting
  useEffect(() => {
    return () => {
      if (currentUser?.id && isComposing) {
        setUserTyping(conversationId, currentUser.id, false)
      }
    }
  }, [conversationId, currentUser, setUserTyping, isComposing])

  const handleSendMessage = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message.trim(), attachments)
      setMessage("")
      setAttachments([])
      // Clear typing status when sending a message
      if (currentUser?.id) {
        setUserTyping(conversationId, currentUser.id, false)
        setIsComposing(false)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Check if it's an IME composition
    if (e.nativeEvent.isComposing) return

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji)
    setIsEmojiPickerOpen(false)
    inputRef.current?.focus()
  }

  const handleAttachmentSelect = (type: string) => {
    console.log(`Attachment type selected: ${type}`)
    setIsAttachmentMenuOpen(false)
    // Here you would implement file selection logic
  }

  const handleRecordToggle = () => {
    setIsRecording(!isRecording)
    // Here you would implement voice recording logic
  }

  const adjustTextareaHeight = () => {
    const textarea = inputRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [message])

  return (
    <div className="border-t p-4">
      <div className="relative flex items-end rounded-lg border bg-background p-2">
        <Popover open={isAttachmentMenuOpen} onOpenChange={setIsAttachmentMenuOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" aria-label="Attach file">
              <Paperclip className="h-5 w-5 text-gray-500" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" align="start" side="top">
            <div className="grid gap-1">
              <Button
                variant="ghost"
                className="flex w-full justify-start gap-2 px-2 py-1 text-sm"
                onClick={() => handleAttachmentSelect("image")}
              >
                <ImageIcon className="h-4 w-4" />
                <span>Image</span>
              </Button>
              <Button
                variant="ghost"
                className="flex w-full justify-start gap-2 px-2 py-1 text-sm"
                onClick={() => handleAttachmentSelect("document")}
              >
                <FileText className="h-4 w-4" />
                <span>Document</span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <div className="relative flex-1 overflow-hidden">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
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
          <Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" aria-label="Add emoji">
                <Smile className="h-5 w-5 text-gray-500" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <EmojiPicker onEmojiSelect={handleEmojiSelect} />
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 rounded-full ${isRecording ? "bg-red-100 text-red-500" : ""}`}
            onClick={handleRecordToggle}
            aria-label={isRecording ? "Stop recording" : "Record voice message"}
          >
            <Mic className="h-5 w-5 text-gray-500" />
          </Button>

          <Button
            variant="primary"
            size="icon"
            className="h-8 w-8 rounded-full bg-gray-900 text-white hover:bg-gray-700"
            onClick={handleSendMessage}
            disabled={!message.trim() && attachments.length === 0}
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
