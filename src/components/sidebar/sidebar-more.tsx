"use client"

import { Settings, Users, Bookmark, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SidebarMore() {
  const moreItems = [
    { label: "Settings & Administration", icon: Settings },
    { label: "People & User Groups", icon: Users },
    { label: "Bookmarks", icon: Bookmark },
    { label: "Help", icon: HelpCircle },
  ]

  return (
    <div className="px-2 py-3">
      <h3 className="px-3 text-xs font-medium text-muted-foreground mb-2">More Options</h3>
      <div className="space-y-1">
        {moreItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
