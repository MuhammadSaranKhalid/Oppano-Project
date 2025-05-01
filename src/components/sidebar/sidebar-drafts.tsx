"use client"

import { FileText } from "lucide-react"

export function SidebarDrafts() {
  return (
    <div className="flex flex-col items-center justify-center h-64 px-4 py-6 text-center text-muted-foreground">
      <FileText className="h-12 w-12 mb-4 text-muted-foreground/50" />
      <h3 className="text-sm font-medium mb-2">No Drafts</h3>
      <p className="text-xs">Your draft messages will appear here for easy access</p>
    </div>
  )
}
