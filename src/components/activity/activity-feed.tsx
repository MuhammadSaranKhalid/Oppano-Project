"use client"

import { useState, useEffect, useCallback } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, MessageSquare, FileText, Bell, Calendar, Users, Clock } from "lucide-react"
import { ActivityItem } from "./activity-item"
import { EmptyState } from "../shared/empty-state"
import { Spinner } from "@/components/ui/spinner"
import { DatePicker } from "./date-picker"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { LoadingSpinner } from "../shared/loading-spinner"
import { EndOfFeed } from "../shared/end-of-feed"

// Mock data generator for activity feed
const generateMockActivities = (page: number, limit: number) => {
  // Base mock data
  const baseMockActivities = [
    {
      id: "activity-1",
      type: "message",
      user: {
        id: "user-2",
        name: "Bill Kuphal",
        avatar: "/stylized-bk-logo.png",
      },
      content: "sent a message in #design_team",
      detail: "Can you review the latest mockups I've uploaded?",
      timestamp: "2 hours ago",
      conversationId: "channel-2",
    },
    {
      id: "activity-2",
      type: "file",
      user: {
        id: "user-3",
        name: "David Smith",
        avatar: "/abstract-ds.png",
      },
      content: "uploaded a file in #marketing_team",
      detail: "Campaign_Visuals_v2.pdf",
      timestamp: "Yesterday",
      conversationId: "channel-3",
    },
    {
      id: "activity-3",
      type: "mention",
      user: {
        id: "user-4",
        name: "Sarah Johnson",
        avatar: "/stylized-letters-sj.png",
      },
      content: "mentioned you in #general",
      detail: "@Cristal Parker Can you share your thoughts on this design approach?",
      timestamp: "2 days ago",
      conversationId: "channel-1",
    },
    {
      id: "activity-4",
      type: "reaction",
      user: {
        id: "user-5",
        name: "Michael Brown",
        avatar: "/monogram-mb.png",
      },
      content: "reacted to your message with 👍",
      detail: "Great presentation yesterday! The team loved it.",
      timestamp: "3 days ago",
      conversationId: "dm-5",
    },
    {
      id: "activity-5",
      type: "channel",
      user: {
        id: "user-2",
        name: "Bill Kuphal",
        avatar: "/stylized-bk-logo.png",
      },
      content: "created a new channel",
      detail: "#project_helsinki",
      timestamp: "1 week ago",
      conversationId: "channel-4",
    },
    {
      id: "activity-6",
      type: "join",
      user: {
        id: "user-6",
        name: "Emily Davis",
        avatar: "/ed-initials-abstract.png",
      },
      content: "joined the workspace",
      detail: "Welcome Emily to the team!",
      timestamp: "2 weeks ago",
      conversationId: null,
    },
  ]

  // Generate additional mock data for pagination
  const generateActivity = (index: number) => {
    const activityTypes = ["message", "file", "mention", "reaction", "channel", "join"]
    const type = activityTypes[Math.floor(Math.random() * activityTypes.length)]
    const senderIndex = Math.floor(Math.random() * 5) + 1
    const timeframes = ["3 hours ago", "5 hours ago", "Yesterday", "2 days ago", "Last week"]
    const timeframeIndex = Math.floor(Math.random() * timeframes.length)

    let content = ""
    let detail = ""
    let conversationId = null

    switch (type) {
      case "message":
        content = "sent a message in #design_team"
        detail = "Here's the update on the project status. Let me know if you need more details."
        conversationId = "channel-2"
        break
      case "file":
        content = "uploaded a file in #marketing_team"
        detail = `Project_Update_${Math.floor(Math.random() * 10)}.pdf`
        conversationId = "channel-3"
        break
      case "mention":
        content = "mentioned you in #general"
        detail = "@Cristal Parker Can you provide feedback on this approach?"
        conversationId = "channel-1"
        break
      case "reaction":
        content = "reacted to your message with 👍"
        detail = "Thanks for the update! This looks great."
        conversationId = "dm-5"
        break
      case "channel":
        content = "created a new channel"
        detail = `#project_${Math.floor(Math.random() * 100)}`
        conversationId = `channel-${Math.floor(Math.random() * 10)}`
        break
      case "join":
        content = "joined the workspace"
        detail = "Welcome to the team!"
        conversationId = null
        break
    }

    return {
      id: `activity-${page * limit + index + 7}`,
      type,
      user: {
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
      content,
      detail,
      timestamp: timeframes[timeframeIndex],
      conversationId,
    }
  }

  // For the first page, return the base mock data
  if (page === 1) {
    return Promise.resolve(baseMockActivities)
  }

  // For subsequent pages, generate new mock data
  const newActivities = Array(limit)
    .fill(null)
    .map((_, index) => generateActivity(index))

  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // After page 5, return empty array to indicate end of data
      if (page > 5) {
        resolve([])
      } else {
        resolve(newActivities)
      }
    }, 1000)
  })
}

export default function ActivityFeed() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [initialLoading, setInitialLoading] = useState(true)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")

  const {
    data: activities,
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

  // Reset when tab, search query, or date range changes
  useEffect(() => {
    reset([])
    // Simulate initial loading
    setInitialLoading(true)
    const timer = setTimeout(() => {
      setInitialLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [activeTab, debouncedSearchQuery, dateRange, reset])

  // Load initial data
  useEffect(() => {
    if (!initialLoading) {
      const fetchData = async () => {
        await loadMore(async (page, limit) => {
          const data = await generateMockActivities(page, limit)
          return filterActivities(data)
        })
      }
      fetchData()
    }
  }, [initialLoading, loadMore, activeTab, debouncedSearchQuery, dateRange])

  // Set up event listener for loading more data
  useEffect(() => {
    const handleLoadMore = async () => {
      await loadMore(async (page, limit) => {
        const data = await generateMockActivities(page, limit)
        return filterActivities(data)
      })
    }

    window.addEventListener("load-more", handleLoadMore)
    return () => {
      window.removeEventListener("load-more", handleLoadMore)
    }
  }, [loadMore, activeTab, debouncedSearchQuery, dateRange])

  // Filter activities based on active tab, search query, and date range
  const filterActivities = useCallback(
    (data: any[]) => {
      return data.filter((activity) => {
        const matchesSearch =
          debouncedSearchQuery === "" ||
          activity.content.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          activity.detail.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          activity.user.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())

        // Filter by tab
        const matchesTab =
          activeTab === "all" ||
          (activeTab === "messages" && activity.type === "message") ||
          (activeTab === "files" && activity.type === "file") ||
          (activeTab === "mentions" && activity.type === "mention")

        // For simplicity, we're not implementing actual date filtering since the timestamps are strings
        // In a real app, you would convert timestamps to Date objects and compare with dateRange

        return matchesSearch && matchesTab
      })
    },
    [activeTab, debouncedSearchQuery, dateRange],
  )

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
              placeholder="Search activity"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowDatePicker(!showDatePicker)}
            className={showDatePicker ? "bg-gray-100" : ""}
          >
            <Calendar className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Date picker */}
        {showDatePicker && (
          <div className="mb-4 p-4 border rounded-lg bg-white">
            <DatePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              onClose={() => setShowDatePicker(false)}
            />
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>All</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Messages</span>
            </TabsTrigger>
            <TabsTrigger value="files" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Files</span>
            </TabsTrigger>
            <TabsTrigger value="mentions" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Mentions</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Activity list */}
        <div className="space-y-3">
          {activities.length > 0 ? (
            <>
              {activities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}

              {/* Loading indicator */}
              <div ref={loadingRef}>
                {isLoading && <LoadingSpinner message="Loading more activities..." />}
                {!hasMore && !isLoading && <EndOfFeed message="You've reached the end of your activity feed" />}
              </div>
            </>
          ) : (
            <EmptyState
              icon={<Clock className="h-12 w-12 text-muted-foreground/50" />}
              title="No activity found"
              description={
                debouncedSearchQuery
                  ? "Try adjusting your search or filters"
                  : activeTab === "messages"
                    ? "No message activity found"
                    : activeTab === "files"
                      ? "No file activity found"
                      : activeTab === "mentions"
                        ? "No mentions found"
                        : "No activity yet"
              }
            />
          )}
        </div>
      </div>
    </div>
  )
}
