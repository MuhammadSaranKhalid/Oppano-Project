"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Filter, MessageSquare, AtSign, Bell } from "lucide-react"
import { ReplyItem } from "./reply-item"
import { EmptyState } from "../shared/empty-state"
import { Spinner } from "@/components/ui/spinner"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { LoadingSpinner } from "../shared/loading-spinner"
import { EndOfFeed } from "../shared/end-of-feed"

// Mock data generator for replies
const generateMockReplies = (page: number, limit: number) => {
  // Base mock data
  const baseMockReplies = [
    {
      id: "reply-1",
      conversationName: "design_team",
      isChannel: true,
      sender: {
        id: "user-2",
        name: "Bill Kuphal",
        avatar: "/stylized-bk-logo.png",
      },
      content:
        "@Cristal Parker Can you review the latest mockups I've uploaded? I need your feedback on the color scheme and typography choices.",
      timestamp: "2 hours ago",
      isUnread: true,
    },
    {
      id: "reply-2",
      conversationName: "marketing_team",
      isChannel: true,
      sender: {
        id: "user-3",
        name: "David Smith",
        avatar: "/abstract-ds.png",
      },
      content:
        "@Cristal Parker I've incorporated your suggestions into the campaign visuals. Let me know if this aligns with what you had in mind.",
      timestamp: "Yesterday",
      isUnread: true,
    },
    {
      id: "reply-3",
      conversationName: "Bill Kuphal",
      isChannel: false,
      sender: {
        id: "user-2",
        name: "Bill Kuphal",
        avatar: "/stylized-bk-logo.png",
      },
      content:
        "Hey @Cristal, I wanted to follow up on our discussion about the Helsinki project. Have you had a chance to look at those aerial photographs?",
      timestamp: "2 days ago",
      isUnread: false,
    },
    {
      id: "reply-4",
      conversationName: "general",
      isChannel: true,
      sender: {
        id: "user-5",
        name: "Michael Brown",
        avatar: "/monogram-mb.png",
      },
      content:
        "@Cristal Parker Just wanted to let you know that the team loved your presentation yesterday! Great job!",
      timestamp: "3 days ago",
      isUnread: false,
    },
    {
      id: "reply-5",
      conversationName: "Sarah Johnson",
      isChannel: false,
      sender: {
        id: "user-4",
        name: "Sarah Johnson",
        avatar: "/stylized-letters-sj.png",
      },
      content:
        "Thanks for mentioning me in your report @Cristal. I appreciate the recognition for the work we did together on the project.",
      timestamp: "1 week ago",
      isUnread: false,
    },
  ]

  // Generate additional mock data for pagination
  const generateReply = (index: number) => {
    const isUnread = Math.random() > 0.7
    const isChannel = Math.random() > 0.5
    const senderIndex = Math.floor(Math.random() * 5) + 1
    const timeframes = ["3 hours ago", "5 hours ago", "Yesterday", "2 days ago", "Last week"]
    const timeframeIndex = Math.floor(Math.random() * timeframes.length)

    return {
      id: `reply-${page * limit + index + 6}`,
      conversationName: isChannel
        ? ["general", "design_team", "marketing_team", "project_helsinki"][Math.floor(Math.random() * 4)]
        : ["Bill Kuphal", "Sarah Johnson", "David Smith", "Michael Brown", "Emily Davis"][
            Math.floor(Math.random() * 5)
          ],
      isChannel,
      sender: {
        id: `user-${senderIndex}`,
        name: ["Bill Kuphal", "Sarah Johnson", "David Smith", "Michael Brown", "Emily Davis"][senderIndex - 1],
        avatar: [
          "/stylized-bk-logo.png",
          "/stylized-letters-sj.png",
          "/abstract-ds.png",
          "/monogram-mb.png",
          "/ed-initials-abstract.png",
        ][senderIndex - 1],
      },
      content: `@Cristal Parker ${isChannel ? "This is a message in the channel about " : ""}${
        [
          "the design project",
          "our marketing campaign",
          "the upcoming presentation",
          "the team meeting",
          "the client feedback",
        ][Math.floor(Math.random() * 5)]
      }. Let me know your thoughts!`,
      timestamp: timeframes[timeframeIndex],
      isUnread,
    }
  }

  // For the first page, return the base mock data
  if (page === 1) {
    return Promise.resolve(baseMockReplies)
  }

  // For subsequent pages, generate new mock data
  const newReplies = Array(limit)
    .fill(null)
    .map((_, index) => generateReply(index))

  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // After page 5, return empty array to indicate end of data
      if (page > 5) {
        resolve([])
      } else {
        resolve(newReplies)
      }
    }, 1000)
  })
}

export default function RepliesView() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [initialLoading, setInitialLoading] = useState(true)
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")

  const {
    data: replies,
    isLoading,
    hasMore,
    loadingRef,
    loadMore,
    reset,
  } = useInfiniteScroll<any>({
    threshold: 300,
    itemsPerPage: 10,
  })

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Reset when tab or search query changes
  useEffect(() => {
    reset([])
    // Simulate initial loading
    setInitialLoading(true)
    const timer = setTimeout(() => {
      setInitialLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [activeTab, debouncedSearchQuery, reset])

  // Load initial data
  useEffect(() => {
    if (!initialLoading) {
      const fetchData = async () => {
        await loadMore(async (page, limit) => {
          const data = await generateMockReplies(page, limit)
          return filterReplies(data as any[])
        })
      }
      fetchData()
    }
  }, [initialLoading, loadMore, activeTab, debouncedSearchQuery])

  // Set up event listener for loading more data
  useEffect(() => {
    const handleLoadMore = async () => {
      await loadMore(async (page, limit) => {
        const data = await generateMockReplies(page, limit)
        return filterReplies(data as any[])
      })
    }

    window.addEventListener("load-more", handleLoadMore)
    return () => {
      window.removeEventListener("load-more", handleLoadMore)
    }
  }, [loadMore, activeTab, debouncedSearchQuery])

  // Filter replies based on active tab and search query
  const filterReplies = useCallback(
    (data: any[]) => {
      return data.filter((reply) => {
        const matchesSearch =
          debouncedSearchQuery === "" ||
          reply.content.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          reply.conversationName.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          reply.sender.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())

        if (activeTab === "all") return matchesSearch
        if (activeTab === "unread") return reply.isUnread && matchesSearch
        if (activeTab === "mentions") return reply.content.includes("@Cristal") && matchesSearch

        return matchesSearch
      })
    },
    [activeTab, debouncedSearchQuery],
  )

  const handleReplyClick = (reply: any) => {
    // Navigate to the conversation
    router.push(`/replies/${reply.id}`)
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" />
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
              placeholder="Search replies"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>All</span>
            </TabsTrigger>
            <TabsTrigger value="mentions" className="flex items-center gap-2">
              <AtSign className="h-4 w-4" />
              <span>Mentions</span>
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>Unread</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Replies list */}
        <div className="space-y-3">
          {replies.length > 0 ? (
            <>
              {replies.map((reply) => (
                <ReplyItem key={reply.id} reply={reply} onClick={() => handleReplyClick(reply)} />
              ))}

              {/* Loading indicator */}
              <div ref={loadingRef}>
                {isLoading && <LoadingSpinner message="Loading more replies..." />}
                {!hasMore && !isLoading && <EndOfFeed message="You've reached the end of your replies" />}
              </div>
            </>
          ) : (
            <EmptyState
              icon={<MessageSquare className="h-12 w-12 text-muted-foreground/50" />}
              title="No replies found"
              description={
                debouncedSearchQuery
                  ? "Try adjusting your search or filters"
                  : activeTab === "unread"
                    ? "You've read all your replies"
                    : activeTab === "mentions"
                      ? "No mentions found"
                      : "No replies yet"
              }
            />
          )}
        </div>
      </div>
    </div>
  )
}
