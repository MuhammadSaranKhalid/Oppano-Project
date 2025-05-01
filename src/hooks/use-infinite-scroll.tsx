"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface UseInfiniteScrollOptions {
  threshold?: number // Distance from bottom (in px) to trigger loading more
  initialPage?: number
  itemsPerPage?: number
}

export function useInfiniteScroll<T>({
  threshold = 200,
  initialPage = 1,
  itemsPerPage = 10,
}: UseInfiniteScrollOptions = {}) {
  const [data, setData] = useState<T[]>([])
  const [page, setPage] = useState(initialPage)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement | null>(null)

  // Function to load more data
  const loadMore = useCallback(
    async (fetchFn: (page: number, limit: number) => Promise<T[]>) => {
      if (isLoading || !hasMore) return

      setIsLoading(true)
      setError(null)

      try {
        const newItems = await fetchFn(page, itemsPerPage)

        if (newItems.length === 0) {
          setHasMore(false)
        } else {
          setData((prevData) => [...prevData, ...newItems])
          setPage((prevPage) => prevPage + 1)
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred while fetching data"))
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, hasMore, page, itemsPerPage],
  )

  // Reset function for when filters change
  const reset = useCallback(
    (newData: T[] = []) => {
      setData(newData)
      setPage(initialPage)
      setHasMore(true)
      setError(null)
    },
    [initialPage],
  )

  // Set up intersection observer
  useEffect(() => {
    if (!loadingRef.current) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && hasMore && !isLoading) {
          // This will trigger the loadMore function in the component
          const event = new CustomEvent("load-more")
          window.dispatchEvent(event)
        }
      },
      {
        root: null,
        rootMargin: `0px 0px ${threshold}px 0px`,
        threshold: 0.1,
      },
    )

    observerRef.current.observe(loadingRef.current)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, isLoading, threshold])

  return {
    data,
    isLoading,
    hasMore,
    error,
    loadingRef,
    loadMore,
    reset,
    setData,
  }
}
