"use client"

import { useState, useEffect } from "react"
import { X, MessageSquare, Phone, Calendar, BellOff, Clock, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { UserStatus } from "@/types"
import { useChatStore } from "@/store/chat-store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"

interface UserProfileProps {
  user: any
  isOpen: boolean
  onClose: () => void
}

export function UserProfile({ user, isOpen, onClose }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<"about" | "files" | "pins">("about")
  const [customStatus, setCustomStatus] = useState("")
  const [isEditingStatus, setIsEditingStatus] = useState(false)
  const { currentUser, updateUserStatus } = useChatStore()

  const isCurrentUser = user?.id === currentUser?.id

  useEffect(() => {
    if (isCurrentUser && currentUser?.statusMessage) {
      setCustomStatus(currentUser.statusMessage)
    }
  }, [currentUser, isCurrentUser])

  if (!user) return null

  const formatLastActive = (lastActive: string) => {
    if (!lastActive) return "Unknown"

    const lastActiveDate = new Date(lastActive)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60))

    if (diffHours < 1) {
      return "Active recently"
    } else if (diffHours < 24) {
      return `Active ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
    } else {
      const diffDays = Math.floor(diffHours / 24)
      return `Active ${diffDays} day${diffDays > 1 ? "s" : ""} ago`
    }
  }

  const handleStatusChange = (status: UserStatus) => {
    if (isCurrentUser) {
      updateUserStatus(status, customStatus)
    }
  }

  const handleCustomStatusSave = () => {
    if (isCurrentUser && currentUser) {
      updateUserStatus(currentUser.status || UserStatus.ONLINE, customStatus)
      setIsEditingStatus(false)
    }
  }

  return (
    <div
      className={cn(
        "fixed inset-y-0 right-0 z-20 w-[320px] bg-white border-l shadow-lg transform transition-all duration-300 ease-in-out overflow-y-auto",
        isOpen ? "translate-x-0" : "translate-x-full",
        "md:absolute md:inset-y-0 md:right-0 md:h-full md:shadow-none",
        "md:translate-x-0 md:opacity-0 md:pointer-events-none",
        isOpen && "md:opacity-100 md:pointer-events-auto",
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Profile</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Profile content */}
        <div className="flex-1 overflow-y-auto">
          {/* User info */}
          <div className="p-6 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={user.avatar || `/placeholder.svg?height=96&width=96&query=portrait of ${user.username}`}
                  alt={user.username}
                />
                <AvatarFallback>{user.username?.charAt(0)}</AvatarFallback>
              </Avatar>
              {user.status && (
                <StatusIndicator
                  status={user.status}
                  className="absolute bottom-1 right-1 border-2 border-white"
                  size="lg"
                  showStatusRing
                />
              )}
            </div>
            <h3 className="text-xl font-bold">{user.username || "Bill Kuphal"}</h3>
            <p className="text-gray-600 mb-1">{user.role || "Jr. Designer"}</p>
            <p className="text-gray-500 text-sm mb-4">{user.pronouns || "He/his/him"}</p>

            {/* Status */}
            {isCurrentUser ? (
              <div className="w-full mb-6">
                {isEditingStatus ? (
                  <div className="flex flex-col gap-2">
                    <Textarea
                      value={customStatus}
                      onChange={(e) => setCustomStatus(e.target.value)}
                      placeholder="What's your status?"
                      className="text-sm resize-none"
                      maxLength={100}
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setIsEditingStatus(false)}>
                        Cancel
                      </Button>
                      <Button variant="default" size="sm" onClick={handleCustomStatusSave}>
                        <Check className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <StatusIndicator status={currentUser?.status || UserStatus.ONLINE} size="sm" />
                          <span>{currentUser?.status?.toLowerCase() || "online"}</span>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Set your status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleStatusChange(UserStatus.ONLINE)}>
                        <StatusIndicator status={UserStatus.ONLINE} className="mr-2" size="sm" />
                        <span>Online</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(UserStatus.AWAY)}>
                        <StatusIndicator status={UserStatus.AWAY} className="mr-2" size="sm" />
                        <span>Away</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(UserStatus.DO_NOT_DISTURB)}>
                        <StatusIndicator status={UserStatus.DO_NOT_DISTURB} className="mr-2" size="sm" />
                        <span>Do not disturb</span>
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem onClick={() => handleStatusChange(UserStatus.INVISIBLE)}>
                        <StatusIndicator status={UserStatus.INVISIBLE} className="mr-2" size="sm" />
                        <span>Invisible</span>
                      </DropdownMenuItem> */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {!isEditingStatus && (
                  <Button
                    variant="ghost"
                    className="w-full text-sm text-gray-600 hover:text-gray-900"
                    onClick={() => setIsEditingStatus(true)}
                  >
                    {customStatus ? customStatus : "Set a custom status"}
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2 mb-6 w-full">
                <div className="flex items-center gap-2 text-gray-600 mb-1 justify-center">
                  {user.status === UserStatus.DO_NOT_DISTURB ? (
                    <BellOff className="h-4 w-4" />
                  ) : (
                    <StatusIndicator status={user.status || UserStatus.OFFLINE} size="sm" />
                  )}
                  <span className="text-sm">
                    {user.statusMessage ||
                      (user.status === UserStatus.ONLINE
                        ? "Online"
                        : user.status === UserStatus.AWAY
                          ? "Away"
                          : user.status === UserStatus.DO_NOT_DISTURB
                            ? "Do not disturb"
                            : "Offline")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 justify-center">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">
                    {user.lastActive ? formatLastActive(user.lastActive) : "6:20 AM local time"}
                  </span>
                </div>
              </div>
            )}

            {/* Action buttons */}
            {!isCurrentUser && (
              <div className="grid grid-cols-1 gap-3 w-full">
                <Button variant="outline" className="flex items-center justify-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Message
                </Button>
                <Button variant="outline" className="flex items-center justify-center gap-2">
                  <Phone className="h-4 w-4" />
                  Call
                </Button>
                <Button variant="outline" className="flex items-center justify-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule
                </Button>
              </div>
            )}
          </div>

          {/* About section */}
          <div className="px-6 py-4">
            <h4 className="text-lg font-medium mb-4">About me</h4>

            <div className="space-y-4">
              <div>
                <h5 className="text-sm text-gray-500 mb-1">Start Date</h5>
                <p className="text-sm text-[#ff6a00]">{user.startDate || "Dec 6, 2022 (7 months ago)"}</p>
              </div>

              <div>
                <h5 className="text-sm text-gray-500 mb-1">LinkedIn</h5>
                <a href="#" className="text-sm text-[#ff6a00] hover:underline">
                  {user.linkedin || "My LinkedIn profile"}
                </a>
              </div>
            </div>
          </div>

          {/* Shared files section */}
          <div className="px-6 py-4">
            <h4 className="text-lg font-medium mb-4">Shared files</h4>
            <div className="space-y-3">
              <div className="border rounded-lg p-3 flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded">
                  <img
                    src="/document-thumbnail.png"
                    alt="Document thumbnail"
                    className="w-10 h-10 object-cover rounded"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Helsinki-urban-photo.jpg</p>
                  <p className="text-xs text-gray-500">2.4 MB • Yesterday</p>
                </div>
              </div>

              <div className="border rounded-lg p-3 flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded">
                  <img
                    src="/document-thumbnail.png"
                    alt="Document thumbnail"
                    className="w-10 h-10 object-cover rounded"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Project_brief_v2.pdf</p>
                  <p className="text-xs text-gray-500">1.8 MB • Last week</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
