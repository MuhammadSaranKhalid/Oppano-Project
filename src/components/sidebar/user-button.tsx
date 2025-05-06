"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useChatStore } from "@/store/chat-store"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { UserStatus } from "@/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings, User, HelpCircle } from "lucide-react"

export function UserButton() {
  const { currentUser, fetchCurrentUser, updateUserStatus } = useChatStore()
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const loadUser = async () => {
      await fetchCurrentUser()
      setIsLoading(false)
    }
    loadUser()
  }, [fetchCurrentUser])

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 p-3">
        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    )
  }

  if (!currentUser) return null

  const handleLogout = () => {
    // In a real app, this would handle logout logic
    console.log("Logging out...")
    // You could redirect to login page or clear auth state
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-3 p-3 w-full hover:bg-gray-100 rounded-lg transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="User menu"
        >
          <div className="relative">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={currentUser.avatar || "/placeholder.svg?height=32&width=32&query=portrait"}
                alt={currentUser.username}
              />
              <AvatarFallback>{currentUser.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <StatusIndicator
              status={currentUser.status || UserStatus.ONLINE}
              className="absolute -bottom-0.5 -right-0.5 border border-white"
              size="xs"
            />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">{currentUser.username}</span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              {currentUser.statusMessage || currentUser.status?.toLowerCase() || "online"}
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 z-50 bg-white border border-gray-200 shadow-lg" forceMount>
        <DropdownMenuLabel>Set status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => updateUserStatus(UserStatus.ONLINE)} className="cursor-pointer">
          <StatusIndicator status={UserStatus.ONLINE} className="mr-2" size="sm" />
          <span>Online</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateUserStatus(UserStatus.AWAY)} className="cursor-pointer">
          <StatusIndicator status={UserStatus.AWAY} className="mr-2" size="sm" />
          <span>Away</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateUserStatus(UserStatus.DO_NOT_DISTURB)} className="cursor-pointer">
          <StatusIndicator status={UserStatus.DO_NOT_DISTURB} className="mr-2" size="sm" />
          <span>Do not disturb</span>
        </DropdownMenuItem>
        {/* <DropdownMenuItem onClick={() => updateUserStatus(UserStatus.INVISIBLE)} className="cursor-pointer">
          <StatusIndicator status={UserStatus.INVISIBLE} className="mr-2" size="sm" />
          <span>Invisible</span>
        </DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Edit profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Preferences</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
