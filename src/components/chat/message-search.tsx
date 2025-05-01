"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X, ArrowUp, ArrowDown, Calendar, Filter, User, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { useChatStore } from "@/store/chat-store"

interface MessageSearchProps {
  isOpen: boolean
  onClose: () => void
  conversationId?: string
}

export interface SearchResult {
  id: string
  conversationId: string
  conversationName: string
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  timestamp: string
  matches: { text: string; index: number }[]
}

interface RecentSearch {
  query: string
  timestamp: number
}

export function MessageSearch({ isOpen, onClose, conversationId }: MessageSearchProps) {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1)
  const [showFilters, setShowFilters] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showUserFilter, setShowUserFilter] = useState(false)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [filters, setFilters] = useState({
    images: false,
    files: false,
    links: false,
    mentions: false,
  })
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)
  const resultsContainerRef = useRef<HTMLDivElement>(null)
  const { fetchUsers } = useChatStore()
  const [users, setUsers] = useState<any[]>([])

  // Add these new states for recent searches
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])
  const [showRecentSearches, setShowRecentSearches] = useState(false)

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches")
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches))
      } catch (e) {
        console.error("Failed to parse recent searches", e)
        setRecentSearches([])
      }
    }
  }, [])

  // Save recent searches to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches))
  }, [recentSearches])

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  // Fetch users for user filter
  useEffect(() => {
    const loadUsers = async () => {
      const fetchedUsers = await fetchUsers()
      setUsers(fetchedUsers)
    }
    loadUsers()
  }, [fetchUsers])

  // Handle search
  const handleSearch = () => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setIsSearching(true)
    setShowRecentSearches(false)

    // Add the search to recent searches
    addToRecentSearches(query.trim())

    // Simulate API call delay
    setTimeout(() => {
      // Generate mock search results
      const mockResults = generateMockSearchResults(query, conversationId)
      setResults(mockResults)
      setIsSearching(false)
      setSelectedResultIndex(mockResults.length > 0 ? 0 : -1)
    }, 800)
  }

  // Add a search query to recent searches
  const addToRecentSearches = (searchQuery: string) => {
    // Don't add empty queries or duplicates
    if (!searchQuery.trim() || recentSearches.some((search) => search.query === searchQuery)) {
      return
    }

    // Add new search to the beginning of the array and limit to 10 items
    const newRecentSearches = [
      { query: searchQuery, timestamp: Date.now() },
      ...recentSearches.filter((search) => search.query !== searchQuery),
    ].slice(0, 10)

    setRecentSearches(newRecentSearches)
  }

  // Remove a search from recent searches
  const removeRecentSearch = (searchQuery: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the parent click handler
    setRecentSearches(recentSearches.filter((search) => search.query !== searchQuery))
  }

  // Clear all recent searches
  const clearAllRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the parent click handler
    setRecentSearches([])
    setShowRecentSearches(false)
  }

  // Select a recent search
  const selectRecentSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    setShowRecentSearches(false)

    // Focus the input after selecting a recent search
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }

    // Automatically perform the search
    setTimeout(() => handleSearch(), 0)
  }

  // Format timestamp for recent searches
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
      return "Today"
    } else if (diffInDays === 1) {
      return "Yesterday"
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  // Rest of the component remains the same...

  // Generate mock search results
  const generateMockSearchResults = (searchQuery: string, specificConversationId?: string): SearchResult[] => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.toLowerCase()
    const mockMessages = [
      {
        id: "msg-1",
        conversationId: "dm-2",
        conversationName: "Bill Kuphal",
        senderId: "user-2",
        senderName: "Bill Kuphal",
        senderAvatar: "/stylized-bk-logo.png",
        content: "Who was that philosopher you shared with me recently?",
        timestamp: "2:14 PM",
      },
      {
        id: "msg-2",
        conversationId: "dm-2",
        conversationName: "Bill Kuphal",
        senderId: "user-1",
        senderName: "Cristal Parker",
        senderAvatar: "/abstract-geometric-shapes.png",
        content: "Roland Barthes",
        timestamp: "2:16 PM",
      },
      {
        id: "msg-3",
        conversationId: "dm-2",
        conversationName: "Bill Kuphal",
        senderId: "user-2",
        senderName: "Bill Kuphal",
        senderAvatar: "/stylized-bk-logo.png",
        content: "That's him!",
        timestamp: "2:16 PM",
      },
      {
        id: "msg-4",
        conversationId: "dm-2",
        conversationName: "Bill Kuphal",
        senderId: "user-2",
        senderName: "Bill Kuphal",
        senderAvatar: "/stylized-bk-logo.png",
        content: "What was his vision statement?",
        timestamp: "2:18 PM",
      },
      {
        id: "msg-5",
        conversationId: "dm-2",
        conversationName: "Bill Kuphal",
        senderId: "user-1",
        senderName: "Cristal Parker",
        senderAvatar: "/abstract-geometric-shapes.png",
        content:
          'Roland Barthes: "Ultimately in order to see a photograph well, it is best to look away or close your eyes."',
        timestamp: "2:20 PM",
      },
      {
        id: "msg-6",
        conversationId: "dm-2",
        conversationName: "Bill Kuphal",
        senderId: "user-1",
        senderName: "Cristal Parker",
        senderAvatar: "/abstract-geometric-shapes.png",
        content: "Aerial photograph from the Helsinki urban environment division.",
        timestamp: "2:20 PM",
        hasImage: true,
      },
      {
        id: "msg-7",
        conversationId: "dm-2",
        conversationName: "Bill Kuphal",
        senderId: "user-2",
        senderName: "Bill Kuphal",
        senderAvatar: "/stylized-bk-logo.png",
        content: "Aerial photograph from the Helsinki urban environment division",
        timestamp: "2:22 PM",
      },
      {
        id: "msg-8",
        conversationId: "dm-2",
        conversationName: "Bill Kuphal",
        senderId: "user-2",
        senderName: "Bill Kuphal",
        senderAvatar: "/stylized-bk-logo.png",
        content: "Check this https://dribbble.com",
        timestamp: "2:22 PM",
        hasLink: true,
      },
      {
        id: "msg-9",
        conversationId: "channel-1",
        conversationName: "general",
        senderId: "user-3",
        senderName: "David Smith",
        senderAvatar: "/abstract-ds.png",
        content: "Has anyone seen the latest design updates from @Cristal Parker? They look amazing!",
        timestamp: "Yesterday",
        hasMention: true,
      },
      {
        id: "msg-10",
        conversationId: "channel-2",
        conversationName: "design_team",
        senderId: "user-4",
        senderName: "Sarah Johnson",
        senderAvatar: "/stylized-letters-sj.png",
        content: "I've uploaded the new design files to the shared folder. Let me know what you think!",
        timestamp: "2 days ago",
        hasFile: true,
      },
      {
        id: "msg-11",
        conversationId: "channel-3",
        conversationName: "marketing_team",
        senderId: "user-5",
        senderName: "Michael Brown",
        senderAvatar: "/monogram-mb.png",
        content:
          "The Helsinki project is coming along nicely. We should have the first draft of the marketing materials ready by next week.",
        timestamp: "3 days ago",
      },
      {
        id: "msg-12",
        conversationId: "dm-3",
        conversationName: "David Smith",
        senderId: "user-3",
        senderName: "David Smith",
        senderAvatar: "/abstract-ds.png",
        content: "Here're my latest drone shots of Helsinki. What do you think?",
        timestamp: "Last week",
        hasImage: true,
      },
    ]

    // Filter messages based on search query and conversation ID
    const filteredMessages = mockMessages.filter((message) => {
      // Filter by conversation if specified
      if (specificConversationId && message.conversationId !== specificConversationId) {
        return false
      }

      // Filter by content
      if (message.content.toLowerCase().includes(query)) {
        return true
      }

      // Filter by sender name
      if (message.senderName.toLowerCase().includes(query)) {
        return true
      }

      // Filter by conversation name
      if (message.conversationName.toLowerCase().includes(query)) {
        return true
      }

      return false
    })

    // Apply additional filters
    const filteredByType = filteredMessages.filter((message) => {
      if (!filters.images && !filters.files && !filters.links && !filters.mentions) {
        return true
      }

      if (filters.images && message.hasImage) return true
      if (filters.files && message.hasFile) return true
      if (filters.links && message.hasLink) return true
      if (filters.mentions && message.hasMention) return true

      return false
    })

    // Apply user filter
    const filteredByUser =
      selectedUsers.length > 0
        ? filteredByType.filter((message) => selectedUsers.includes(message.senderId))
        : filteredByType

    // Apply date filter (simplified for demo)
    const filteredByDate = dateRange.from
      ? filteredByUser.filter((message) => {
          // In a real app, you would convert the timestamp to a Date and compare
          // For this demo, we'll just return true
          return true
        })
      : filteredByUser

    // Find matches in content
    return filteredByDate.map((message) => {
      const content = message.content.toLowerCase()
      const matches: { text: string; index: number }[] = []

      let index = content.indexOf(query)
      while (index !== -1) {
        matches.push({
          text: message.content.substring(index, index + query.length),
          index,
        })
        index = content.indexOf(query, index + 1)
      }

      return {
        ...message,
        matches,
      }
    })
  }

  // Navigate to previous result
  const goToPreviousResult = () => {
    if (results.length === 0) return

    setSelectedResultIndex((prev) => {
      if (prev <= 0) return results.length - 1
      return prev - 1
    })
  }

  // Navigate to next result
  const goToNextResult = () => {
    if (results.length === 0) return

    setSelectedResultIndex((prev) => {
      if (prev >= results.length - 1) return 0
      return prev + 1
    })
  }

  // Scroll selected result into view
  useEffect(() => {
    if (selectedResultIndex >= 0 && resultsContainerRef.current) {
      const selectedElement = resultsContainerRef.current.querySelector(`[data-result-index="${selectedResultIndex}"]`)
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: "smooth", block: "nearest" })
      }
    }
  }, [selectedResultIndex])

  // Update the handleKeyDown function to handle Escape key for recent searches dropdown
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSearch()
    } else if (e.key === "Escape") {
      if (showRecentSearches) {
        setShowRecentSearches(false)
      } else {
        onClose()
      }
    } else if (e.key === "ArrowUp" && results.length > 0) {
      e.preventDefault()
      goToPreviousResult()
    } else if (e.key === "ArrowDown" && results.length > 0) {
      e.preventDefault()
      goToNextResult()
    }
  }

  // Add this function to handle input focus
  const handleInputFocus = () => {
    if (query.trim() === "" && recentSearches.length > 0) {
      setShowRecentSearches(true)
    }
  }

  // Add this function to handle clicks outside the recent searches dropdown
  const handleClickOutside = (e: MouseEvent) => {
    if (showRecentSearches && searchInputRef.current && !searchInputRef.current.contains(e.target as Node)) {
      setShowRecentSearches(false)
    }
  }

  // Add effect to handle clicks outside the recent searches dropdown
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showRecentSearches])

  // Toggle user selection
  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId)
      } else {
        return [...prev, userId]
      }
    })
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      images: false,
      files: false,
      links: false,
      mentions: false,
    })
    setDateRange({ from: undefined, to: undefined })
    setSelectedUsers([])
  }

  // Highlight matched text in content
  const highlightMatches = (content: string, matches: { text: string; index: number }[]) => {
    if (matches.length === 0) return content

    const result = []
    let lastIndex = 0

    matches.forEach((match) => {
      // Add text before match
      if (match.index > lastIndex) {
        result.push(content.substring(lastIndex, match.index))
      }

      // Add highlighted match
      result.push(
        <span key={`match-${match.index}`} className="bg-yellow-200 font-medium">
          {match.text}
        </span>,
      )

      lastIndex = match.index + match.text.length
    })

    // Add remaining text
    if (lastIndex < content.length) {
      result.push(content.substring(lastIndex))
    }

    return result
  }

  if (!isOpen) return null

  // Update the search input in the render section to include the recent searches dropdown
  // Replace the existing search input section with this:
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-16 px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden">
        {/* Search header */}
        <div className="p-4 border-b flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              ref={searchInputRef}
              placeholder="Search messages..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                if (e.target.value.trim() === "") {
                  setShowRecentSearches(true)
                } else {
                  setShowRecentSearches(false)
                }
              }}
              onFocus={handleInputFocus}
              onKeyDown={handleKeyDown}
              className="pl-9 pr-20"
            />
            {query && (
              <button
                className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => {
                  setQuery("")
                  setShowRecentSearches(true)
                  if (searchInputRef.current) {
                    searchInputRef.current.focus()
                  }
                }}
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-7 text-xs"
              onClick={handleSearch}
            >
              Search
            </Button>

            {/* Recent searches dropdown */}
            {showRecentSearches && recentSearches.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border z-10">
                <div className="p-2 border-b flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Recent Searches</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={clearAllRecentSearches}>
                    Clear All
                  </Button>
                </div>
                <ul className="max-h-60 overflow-y-auto py-1">
                  {recentSearches.map((search) => (
                    <li
                      key={`${search.query}-${search.timestamp}`}
                      className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                      onClick={() => selectRecentSearch(search.query)}
                    >
                      <div className="flex items-center gap-2">
                        <Search className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-sm">{search.query}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{formatTimestamp(search.timestamp)}</span>
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          onClick={(e) => removeRecentSearch(search.query, e)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Popover open={showFilters} onOpenChange={setShowFilters}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    "h-9 w-9",
                    (filters.images || filters.files || filters.links || filters.mentions) && "bg-gray-100",
                  )}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="end">
                <div className="space-y-4">
                  <h3 className="font-medium">Filter by type</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="filter-images"
                        checked={filters.images}
                        onCheckedChange={(checked) => setFilters({ ...filters, images: checked as boolean })}
                      />
                      <label htmlFor="filter-images" className="text-sm">
                        Images
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="filter-files"
                        checked={filters.files}
                        onCheckedChange={(checked) => setFilters({ ...filters, files: checked as boolean })}
                      />
                      <label htmlFor="filter-files" className="text-sm">
                        Files
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="filter-links"
                        checked={filters.links}
                        onCheckedChange={(checked) => setFilters({ ...filters, links: checked as boolean })}
                      />
                      <label htmlFor="filter-links" className="text-sm">
                        Links
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="filter-mentions"
                        checked={filters.mentions}
                        onCheckedChange={(checked) => setFilters({ ...filters, mentions: checked as boolean })}
                      />
                      <label htmlFor="filter-mentions" className="text-sm">
                        Mentions
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                      Clear
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn("h-9 w-9", (dateRange.from || dateRange.to) && "bg-gray-100")}
                >
                  <Calendar className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  initialFocus
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            <Popover open={showUserFilter} onOpenChange={setShowUserFilter}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn("h-9 w-9", selectedUsers.length > 0 && "bg-gray-100")}
                >
                  <User className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="end">
                <div className="space-y-4">
                  <h3 className="font-medium">Filter by user</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center gap-2">
                        <Checkbox
                          id={`user-${user.id}`}
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => toggleUserSelection(user.id)}
                        />
                        <label htmlFor={`user-${user.id}`} className="flex items-center gap-2 text-sm">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                            <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {user.username}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => setSelectedUsers([])}>
                      Clear
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Button variant="outline" size="icon" className="h-9 w-9" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search results */}
        <div className="flex-1 overflow-y-auto p-4" ref={resultsContainerRef}>
          {isSearching ? (
            <div className="flex flex-col items-center justify-center h-40">
              <Spinner size={32} />
              <p className="mt-4 text-sm text-gray-500">Searching messages...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {results.length} result{results.length !== 1 ? "s" : ""} found
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={goToPreviousResult}
                    disabled={results.length === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    {selectedResultIndex + 1} of {results.length}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={goToNextResult}
                    disabled={results.length === 0}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Active filters */}
              {(filters.images ||
                filters.files ||
                filters.links ||
                filters.mentions ||
                selectedUsers.length > 0 ||
                dateRange.from) && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {filters.images && (
                    <Badge variant="outline" className="bg-gray-100">
                      Images
                      <button
                        className="ml-1 text-gray-400 hover:text-gray-600"
                        onClick={() => setFilters({ ...filters, images: false })}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {filters.files && (
                    <Badge variant="outline" className="bg-gray-100">
                      Files
                      <button
                        className="ml-1 text-gray-400 hover:text-gray-600"
                        onClick={() => setFilters({ ...filters, files: false })}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {filters.links && (
                    <Badge variant="outline" className="bg-gray-100">
                      Links
                      <button
                        className="ml-1 text-gray-400 hover:text-gray-600"
                        onClick={() => setFilters({ ...filters, links: false })}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {filters.mentions && (
                    <Badge variant="outline" className="bg-gray-100">
                      Mentions
                      <button
                        className="ml-1 text-gray-400 hover:text-gray-600"
                        onClick={() => setFilters({ ...filters, mentions: false })}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {dateRange.from && (
                    <Badge variant="outline" className="bg-gray-100">
                      Date: {dateRange.from.toLocaleDateString()}
                      {dateRange.to && ` - ${dateRange.to.toLocaleDateString()}`}
                      <button
                        className="ml-1 text-gray-400 hover:text-gray-600"
                        onClick={() => setDateRange({ from: undefined, to: undefined })}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {selectedUsers.length > 0 && (
                    <Badge variant="outline" className="bg-gray-100">
                      {selectedUsers.length} user{selectedUsers.length !== 1 ? "s" : ""}
                      <button className="ml-1 text-gray-400 hover:text-gray-600" onClick={() => setSelectedUsers([])}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={clearFilters}>
                    Clear all
                  </Button>
                </div>
              )}

              <div className="space-y-4">
                {results.map((result, index) => (
                  <div
                    key={result.id}
                    data-result-index={index}
                    className={cn(
                      "border rounded-lg p-4 transition-colors",
                      selectedResultIndex === index ? "bg-[#fff9e5] border-[#ff6a00]" : "hover:bg-gray-50",
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={result.senderAvatar || "/placeholder.svg"} alt={result.senderName} />
                          <AvatarFallback>{result.senderName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{result.senderName}</span>
                        <span className="text-xs text-gray-500">
                          in {result.conversationName} • {result.timestamp}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => {
                          // In a real app, this would navigate to the message in the conversation
                          console.log(`Navigate to message ${result.id} in conversation ${result.conversationId}`)
                          onClose()
                        }}
                      >
                        Jump to message
                      </Button>
                    </div>
                    <p className="text-sm">{highlightMatches(result.content, result.matches)}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : query ? (
            <div className="flex flex-col items-center justify-center h-40">
              <Search className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-gray-500">No results found for "{query}"</p>
              <p className="text-sm text-gray-400 mt-1">Try different keywords or filters</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40">
              <Search className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-gray-500">Search for messages</p>
              <p className="text-sm text-gray-400 mt-1">Type keywords to find messages</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
