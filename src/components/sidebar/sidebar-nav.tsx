"use client"

import { MessageCircle, Activity, FileText, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { SidebarTab } from "./index"

interface SidebarNavProps {
  activeTab: SidebarTab
  onTabChange: (tab: SidebarTab) => void
}

export function SidebarNav({ activeTab, onTabChange }: SidebarNavProps) {
  const navItems = [
    {
      id: "messages" as SidebarTab,
      label: "Messages",
      icon: MessageCircle,
    },
    {
      id: "activity" as SidebarTab,
      label: "Activity",
      icon: Activity,
    },
    {
      id: "drafts" as SidebarTab,
      label: "Drafts",
      icon: FileText,
    },
    {
      id: "more" as SidebarTab,
      label: "More",
      icon: MoreHorizontal,
    },
  ]

  return (
    <div className="px-2 py-1">
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            className={cn(
              "justify-start gap-2 px-3 py-2 text-sm font-medium",
              activeTab === item.id ? "bg-[#fff9e5] text-[#ff6a00]" : "text-muted-foreground hover:bg-muted",
            )}
            onClick={() => onTabChange(item.id)}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>
    </div>
  )
}
