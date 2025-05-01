"use client"

import { cn } from "@/lib/utils"

interface MarkdownPreviewProps {
  content: string
  className?: string
}

export function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  // Simple markdown to HTML conversion
  // In a real app, you'd use a proper markdown parser like marked.js
  const html = content
    // Bold
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    // Italic
    .replace(/_(.*?)_/g, "<em>$1</em>")
    // Lists
    .replace(/^\s*•\s+(.*?)$/gm, "<li>$1</li>")
    .replace(/^\s*(\d+)\.\s+(.*?)$/gm, "<li>$1. $2</li>")
    // Links
    .replace(/\[(.*?)\]$$(.*?)$$/g, '<a href="$2" class="text-blue-500 underline">$1</a>')
    // Code
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
    // Line breaks
    .replace(/\n/g, "<br />")

  // Wrap lists in ul/ol
  const wrappedHtml = html
    .replace(/(<li>\d+\..+?<\/li>)+/g, '<ol class="list-decimal ml-5">$&</ol>')
    .replace(/(<li>.+?<\/li>)+/g, '<ul class="list-disc ml-5">$&</ul>')

  return (
    <div className={cn("prose prose-sm max-w-none", className)} dangerouslySetInnerHTML={{ __html: wrappedHtml }} />
  )
}
