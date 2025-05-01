import { Skeleton } from "@/components/ui/skeleton"

export function ConversationItemSkeleton() {
  return (
    <div className="flex w-full items-center gap-2 px-3 py-2 text-sm">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex flex-1 flex-col items-start gap-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  )
}
