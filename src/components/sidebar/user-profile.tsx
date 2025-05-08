"use client"

import { useState } from "react"
import { LogOut, Settings, User, HelpCircle, ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useChatStore } from "@/store/chat-store"
import { Badge } from "@/components/ui/badge"

export function UserProfile() {
  const { currentUser } = useChatStore()
  const [isOpen, setIsOpen] = useState(false)

  if (!currentUser) {
    return (
      <div className="flex items-center gap-2 p-2 rounded-md animate-pulse">
        <div className="h-8 w-8 rounded-full bg-gray-200"></div>
        <div className="flex-1">
          <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
          <div className="h-3 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    // In a real app, this would handle logout logic
    console.log("Logging out...")
    // You could redirect to login page or clear auth state
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="flex w-full items-center gap-2 rounded-md p-2 text-sm hover:bg-gray-100 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="User profile menu"
        >
          <div className="relative">
            <Avatar className="h-8 w-8 border border-gray-200">
              <AvatarImage
                src={
                   `/placeholder.svg?height=32&width=32&query=${currentUser.username.charAt(0)}`
                }
              />
              <AvatarFallback>{currentUser.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <Badge className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-green-500 p-0" />
          </div>
          <div className="flex-1 overflow-hidden text-left">
            <p className="truncate font-medium">{currentUser.username}</p>
            <p className="text-xs text-gray-500">Active</p>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg z-50" forceMount>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
