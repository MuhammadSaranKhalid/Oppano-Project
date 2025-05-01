"use client"

import { Activity } from "lucide-react"

export function SidebarActivity() {
  return (
    <div className="flex flex-col items-center justify-center h-64 px-4 py-6 text-center text-muted-foreground">
      <Activity className="h-12 w-12 mb-4 text-muted-foreground/50" />
      <h3 className="text-sm font-medium mb-2">Activity Feed</h3>
      <p className="text-xs">See mentions, reactions, and other activity related to your conversations</p>
    </div>
  )
}
