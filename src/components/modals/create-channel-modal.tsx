// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Hash, Lock } from "lucide-react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { useChatStore } from "@/store/chat-store"

// interface CreateChannelModalProps {
//   isOpen: boolean
//   onClose: () => void
// }

// export function CreateChannelModal({ isOpen, onClose }: CreateChannelModalProps) {
//   // const { createChannel } = useChatStore()
//   const [channelName, setChannelName] = useState("")
//   const [channelType, setChannelType] = useState<"public" | "private">("public")
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [error, setError] = useState("")

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError("")

//     // Validate channel name
//     if (!channelName.trim()) {
//       setError("Channel name is required")
//       return
//     }

//     // Check if channel name contains only allowed characters
//     if (!/^[a-z0-9_-]+$/.test(channelName)) {
//       setError("Channel names can only contain lowercase letters, numbers, hyphens, and underscores")
//       return
//     }

//     setIsSubmitting(true)

//     try {
//       // Create the channel
//       // await createChannel({
//       //   name: channelName,
//       //   isPrivate: channelType === "private",
//       // })

//       // Reset form and close modal
//       setChannelName("")
//       setChannelType("public")
//       onClose()
//     } catch (err) {
//       setError("Failed to create channel. Please try again.")
//       console.error(err)
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Create a channel</DialogTitle>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-4 py-4">
//           <div className="space-y-2">
//             <Label htmlFor="channel-name">Channel name</Label>
//             <div className="relative">
//               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
//                 <Hash className="h-4 w-4" />
//               </span>
//               <Input
//                 id="channel-name"
//                 value={channelName}
//                 onChange={(e) => setChannelName(e.target.value.toLowerCase())}
//                 className="pl-9"
//                 placeholder="e.g. marketing"
//                 maxLength={80}
//               />
//             </div>
//             {error && <p className="text-sm text-red-500">{error}</p>}
//           </div>

//           <div className="space-y-2">
//             <Label>Channel type</Label>
//             <RadioGroup value={channelType} onValueChange={(value) => setChannelType(value as "public" | "private")}>
//               <div className="flex items-start space-x-3 rounded-md border p-3">
//                 <RadioGroupItem value="public" id="public" className="mt-1" />
//                 <div className="space-y-1">
//                   <div className="flex items-center">
//                     <Label htmlFor="public" className="font-medium flex items-center">
//                       <Hash className="h-4 w-4 mr-2" />
//                       Public
//                     </Label>
//                   </div>
//                   <p className="text-sm text-gray-500">Anyone in the workspace can view and join this channel.</p>
//                 </div>
//               </div>

//               <div className="flex items-start space-x-3 rounded-md border p-3">
//                 <RadioGroupItem value="private" id="private" className="mt-1" />
//                 <div className="space-y-1">
//                   <div className="flex items-center">
//                     <Label htmlFor="private" className="font-medium flex items-center">
//                       <Lock className="h-4 w-4 mr-2" />
//                       Private
//                     </Label>
//                   </div>
//                   <p className="text-sm text-gray-500">Only invited people can view and join this channel.</p>
//                 </div>
//               </div>
//             </RadioGroup>
//           </div>

//           <DialogFooter>
//             <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
//               Cancel
//             </Button>
//             <Button type="submit" disabled={isSubmitting}>
//               {isSubmitting ? "Creating..." : "Create Channel"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }


"use client"

import type React from "react"

import { useState } from "react"
import { Hash, Lock } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useChatApi } from "@/hooks/use-chat-api"
import { useToast } from "@/hooks/use-toast"
import { Spinner } from "@/components/ui/spinner"

interface CreateChannelModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateChannelModal({ isOpen, onClose }: CreateChannelModalProps) {
  const { createChannel } = useChatApi()
  const { toast } = useToast()
  const [channelName, setChannelName] = useState("")
  const [channelType, setChannelType] = useState<"public" | "private">("public")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate channel name
    if (!channelName.trim()) {
      setError("Channel name is required")
      return
    }

    // Check if channel name contains only allowed characters
    if (!/^[a-z0-9_-]+$/.test(channelName)) {
      setError("Channel names can only contain lowercase letters, numbers, hyphens, and underscores")
      return
    }

    setIsSubmitting(true)

    try {
      // Create the channel using the API hook
      const newChannel = await createChannel({
        name: channelName,
        isPrivate: channelType === "private",
      })

      if (newChannel) {
        toast({
          title: "Channel created",
          description: `#${channelName} has been created successfully.`,
        })

        // Reset form and close modal
        setChannelName("")
        setChannelType("public")
        onClose()
      } else {
        throw new Error("Failed to create channel")
      }
    } catch (err) {
      console.error("Error creating channel:", err)
      setError("Failed to create channel. Please try again.")

      toast({
        title: "Error",
        description: "Failed to create channel. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a channel</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="channel-name">Channel name</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <Hash className="h-4 w-4" />
              </span>
              <Input
                id="channel-name"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value.toLowerCase())}
                className="pl-9"
                placeholder="e.g. marketing"
                maxLength={80}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <div className="space-y-2">
            <Label>Channel type</Label>
            <RadioGroup value={channelType} onValueChange={(value) => setChannelType(value as "public" | "private")}>
              <div className="flex items-start space-x-3 rounded-md border p-3">
                <RadioGroupItem value="public" id="public" className="mt-1" />
                <div className="space-y-1">
                  <div className="flex items-center">
                    <Label htmlFor="public" className="font-medium flex items-center">
                      <Hash className="h-4 w-4 mr-2" />
                      Public
                    </Label>
                  </div>
                  <p className="text-sm text-gray-500">Anyone in the workspace can view and join this channel.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 rounded-md border p-3">
                <RadioGroupItem value="private" id="private" className="mt-1" />
                <div className="space-y-1">
                  <div className="flex items-center">
                    <Label htmlFor="private" className="font-medium flex items-center">
                      <Lock className="h-4 w-4 mr-2" />
                      Private
                    </Label>
                  </div>
                  <p className="text-sm text-gray-500">Only invited people can view and join this channel.</p>
                </div>
              </div>
            </RadioGroup>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Creating...
                </>
              ) : (
                "Create Channel"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
