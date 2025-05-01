"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, FileText, Edit } from "lucide-react"
import { DraftItem } from "./draft-item"
import { EmptyState } from "../shared/empty-state"
import { Spinner } from "@/components/ui/spinner"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { LoadingSpinner } from "../shared/loading-spinner"
import { EndOfFeed } from "../shared/end-of-feed"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Mock data generator for drafts
const generateMockDrafts = (page: number, limit: number) => {
  // Base mock data
  const baseMockDrafts = [
    {
      id: "draft-1",
      conversationName: "design_team",
      isChannel: true,
      content:
        "I've been working on the new design system and wanted to share some initial thoughts. The color palette I'm considering is...",
      timestamp: "2 hours ago",
      lastEdited: "10 minutes ago",
    },
    {
      id: "draft-2",
      conversationName: "Bill Kuphal",
      isChannel: false,
      content:
        "Regarding the Helsinki project, I think we should focus on the following aspects:\n\n1. Urban integration\n2. Sustainable materials\n3. Local cultural elements",
      timestamp: "Yesterday",
      lastEdited: "Yesterday",
    },
    {
      id: "draft-3",
      conversationName: "marketing_team",
      isChannel: true,
      content: "Here's the draft for the social media campaign I mentioned earlier. The key messaging points are...",
      timestamp: "3 days ago",
      lastEdited: "2 days ago",
    },
  ]

  // Generate additional mock data for pagination
  const generateDraft = (index: number) => {
    const isChannel = Math.random() > 0.5
    const timeframes = ["3 hours ago", "5 hours ago", "Yesterday", "2 days ago", "Last week"]
    const timeframeIndex = Math.floor(Math.random() * timeframes.length)
    const editedTimeframeIndex = Math.floor(Math.random() * Math.min(timeframeIndex + 1, timeframes.length))

    const draftContents = [
      "Here are my thoughts on the project timeline. I think we should consider extending the deadline for the following reasons...",
      "I've been reviewing the client feedback and I think we should address these key points in our next meeting:\n\n1. User interface improvements\n2. Performance optimizations\n3. Additional feature requests",
      "For the upcoming presentation, I'd like to highlight our team's achievements this quarter. Some notable points include...",
      "Regarding the budget allocation for Q3, I believe we should prioritize the following areas:\n\n- Marketing campaigns\n- Product development\n- Team expansion",
      "I've been thinking about our approach to the new market segment. Here's a draft strategy that we could discuss in our next meeting.",
    ]

    return {
      id: `draft-${page * limit + index + 4}`,
      conversationName: isChannel
        ? ["general", "design_team", "marketing_team", "project_helsinki"][Math.floor(Math.random() * 4)]
        : ["Bill Kuphal", "Sarah Johnson", "David Smith", "Michael Brown", "Emily Davis"][
            Math.floor(Math.random() * 5)
          ],
      isChannel,
      content: draftContents[Math.floor(Math.random() * draftContents.length)],
      timestamp: timeframes[timeframeIndex],
      lastEdited: timeframes[editedTimeframeIndex],
    }
  }

  // For the first page, return the base mock data
  if (page === 1) {
    return Promise.resolve(baseMockDrafts)
  }

  // For subsequent pages, generate new mock data
  const newDrafts = Array(limit)
    .fill(null)
    .map((_, index) => generateDraft(index))

  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // After page 4, return empty array to indicate end of data
      if (page > 4) {
        resolve([])
      } else {
        resolve(newDrafts)
      }
    }, 1000)
  })
}

export default function DraftsList() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [initialLoading, setInitialLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedDraft, setSelectedDraft] = useState<string | null>(null)
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")

  const {
    data: drafts,
    isLoading,
    hasMore,
    loadingRef,
    loadMore,
    reset,
    setData,
  } = useInfiniteScroll<any>({
    threshold: 300,
    itemsPerPage: 8,
  })

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Reset when search query changes
  useEffect(() => {
    reset([])
    // Simulate initial loading
    setInitialLoading(true)
    const timer = setTimeout(() => {
      setInitialLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [debouncedSearchQuery, reset])

  // Load initial data
  useEffect(() => {
    if (!initialLoading) {
      const fetchData = async () => {
        await loadMore(async (page, limit) => {
          const data = await generateMockDrafts(page, limit)
          return filterDrafts(data)
        })
      }
      fetchData()
    }
  }, [initialLoading, loadMore, debouncedSearchQuery])

  // Set up event listener for loading more data
  useEffect(() => {
    const handleLoadMore = async () => {
      await loadMore(async (page, limit) => {
        const data = await generateMockDrafts(page, limit)
        return filterDrafts(data)
      })
    }

    window.addEventListener("load-more", handleLoadMore)
    return () => {
      window.removeEventListener("load-more", handleLoadMore)
    }
  }, [loadMore, debouncedSearchQuery])

  // Filter drafts based on search query
  const filterDrafts = useCallback(
    (data: any[]) => {
      return data.filter((draft) => {
        return (
          debouncedSearchQuery === "" ||
          draft.content.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          draft.conversationName.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        )
      })
    },
    [debouncedSearchQuery],
  )

  const handleEditDraft = (draftId: string) => {
    // Navigate to edit draft page or open edit modal
    console.log("Edit draft:", draftId)
  }

  const handleSendDraft = (draftId: string) => {
    // Send draft and navigate to conversation
    console.log("Send draft:", draftId)

    // Remove from drafts
    setData(drafts.filter((draft) => draft.id !== draftId))
  }

  const handleDeleteClick = (draftId: string) => {
    setSelectedDraft(draftId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedDraft) {
      setData(drafts.filter((draft) => draft.id !== selectedDraft))
    }
    setDeleteDialogOpen(false)
    setSelectedDraft(null)
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size={32} />
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        {/* Search and filter */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search drafts"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Drafts list */}
        <div className="space-y-3">
          {drafts.length > 0 ? (
            <>
              {drafts.map((draft) => (
                <DraftItem
                  key={draft.id}
                  draft={draft}
                  onEdit={() => handleEditDraft(draft.id)}
                  onSend={() => handleSendDraft(draft.id)}
                  onDelete={() => handleDeleteClick(draft.id)}
                />
              ))}

              {/* Loading indicator */}
              <div ref={loadingRef}>
                {isLoading && <LoadingSpinner message="Loading more drafts..." />}
                {!hasMore && !isLoading && <EndOfFeed message="You've reached the end of your drafts" />}
              </div>
            </>
          ) : (
            <EmptyState
              icon={<FileText className="h-12 w-12 text-muted-foreground/50" />}
              title="No drafts found"
              description={searchQuery ? "Try adjusting your search" : "You don't have any saved drafts"}
              action={
                !searchQuery ? (
                  <Button className="mt-4 bg-[#ff6a00] hover:bg-[#ff6a00]/90">
                    <Edit className="h-4 w-4 mr-2" />
                    Create Draft
                  </Button>
                ) : undefined
              }
            />
          )}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Draft</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this draft? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
