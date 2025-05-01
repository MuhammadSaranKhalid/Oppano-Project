import { Skeleton } from "@/components/ui/skeleton"

export function DraftsListSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        {/* Search and filter skeleton */}
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-10 flex-1 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>

        {/* Drafts list skeleton */}
        <div className="space-y-3">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-36 w-full rounded-lg" />
            ))}
        </div>
      </div>
    </div>
  )
}
