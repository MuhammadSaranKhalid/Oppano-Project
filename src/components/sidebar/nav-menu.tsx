"use client"

import { useRouter } from "next/navigation"
import { MessageSquareReply, Activity, FileText, Clock, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { useChatStore } from "@/store/chat-store"

export function NavMenu() {
  const router = useRouter()
  const { activeSection } = useChatStore()

  const navItems = [
    {
      id: "replies",
      label: "Replies",
      icon: MessageSquareReply,
      section: "replies",
      path: "/dashboard/replies",
    },
    {
      id: "time",
      label: "Time",
      icon: Clock,
      section: "time",
      path: "/dashboard/time",
    },
    {
      id: "activity",
      label: "Activity",
      icon: Activity,
      section: "activity",
      path: "/dashboard/activity",
    },
    {
      id: "drafts",
      label: "Drafts",
      icon: FileText,
      section: "drafts",
      path: "/dashboard/drafts",
    },
    {
      id: "more",
      label: "More",
      icon: MoreHorizontal,
      section: "more",
      path: "/dashboard/more",
    },
  ]

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <div className="px-3 py-2">
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors",
              activeSection === item.section
                ? "bg-[#fff9e5] text-[#ff6a00] font-medium"
                : "text-gray-600 hover:bg-gray-100",
            )}
            onClick={() => handleNavigation(item.path)}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
