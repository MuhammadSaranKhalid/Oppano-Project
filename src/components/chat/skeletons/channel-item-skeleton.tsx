import { Skeleton } from "@/components/ui/skeleton"
import { Hash } from "lucide-react"

export function ChannelItemSkeleton() {
  return (
    <div className="flex w-full items-center gap-2 px-3 py-1.5 text-sm">
      <div className="flex h-4 w-4 items-center justify-center text-muted-foreground">
        <Hash className="h-3 w-3" />
      </div>
      <div className="flex flex-1 flex-col items-start gap-1">
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  )
}
