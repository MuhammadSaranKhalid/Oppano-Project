import { Skeleton } from "@/components/ui/skeleton"

export function ChatAreaSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Header skeleton */}
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Skeleton className="h-8 w-8 rounded-full mr-3" />
          <div>
            <Skeleton className="h-5 w-32 mb-1" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      {/* Messages skeleton */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`flex items-start gap-3 ${i % 2 === 0 ? "" : "justify-end"}`}>
              {i % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full mt-1" />}
              <div className={`flex flex-col ${i % 2 !== 0 ? "items-end" : ""}`}>
                <Skeleton className={`h-24 w-64 rounded-lg ${i % 2 !== 0 ? "bg-[#fff9e5]" : "bg-white"}`} />
                <Skeleton className="h-3 w-16 mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input skeleton */}
      <div className="border-t p-4 bg-white">
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  )
}
