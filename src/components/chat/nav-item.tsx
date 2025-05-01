"use client"

import { MessageSquareReply, Activity, FileText, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItemProps {
  icon: "replies" | "activity" | "drafts" | "more"
  label: string
  isActive?: boolean
  onClick?: () => void
}

export default function NavItem({ icon, label, isActive = false, onClick }: NavItemProps) {
  const getIcon = () => {
    switch (icon) {
      case "replies":
        return <MessageSquareReply className="h-4 w-4" />
      case "activity":
        return <Activity className="h-4 w-4" />
      case "drafts":
        return <FileText className="h-4 w-4" />
      case "more":
        return <MoreHorizontal className="h-4 w-4" />
    }
  }

  return (
    <button
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm",
        isActive ? "bg-[#fff9e5] text-[#ff6a00]" : "text-muted-foreground hover:bg-muted",
      )}
      onClick={onClick}
    >
      {getIcon()}
      {label}
    </button>
  )
}
