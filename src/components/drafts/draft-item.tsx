"use client"
import { Button } from "@/components/ui/button"
import { Hash, Edit, Send, Trash2, Clock } from "lucide-react"

interface DraftItemProps {
  draft: {
    id: string
    conversationName: string
    isChannel: boolean
    content: string
    timestamp: string
    lastEdited: string
  }
  onEdit: () => void
  onSend: () => void
  onDelete: () => void
}

export function DraftItem({ draft, onEdit, onSend, onDelete }: DraftItemProps) {
  // Truncate content for preview
  const previewContent = draft.content.length > 150 ? draft.content.substring(0, 150) + "..." : draft.content

  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {draft.isChannel ? (
            <div className="flex items-center gap-1 text-gray-600">
              <Hash className="h-4 w-4" />
              <span className="font-medium">{draft.conversationName}</span>
            </div>
          ) : (
            <span className="font-medium">{draft.conversationName}</span>
          )}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>Last edited {draft.lastEdited}</span>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-sm text-gray-700 whitespace-pre-line">{previewContent}</p>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button size="sm" className="bg-[#ff6a00] hover:bg-[#ff6a00]/90" onClick={onSend}>
          <Send className="h-4 w-4 mr-1" />
          Send
        </Button>
      </div>
    </div>
  )
}
