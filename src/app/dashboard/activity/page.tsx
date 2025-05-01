import { Suspense } from "react"
import ActivityFeed from "@/components/activity/activity-feed"
import { ActivityFeedSkeleton } from "@/components/activity/skeletons/activity-feed-skeleton"

export default function ActivityPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <h2 className="text-lg font-medium">Activity</h2>
        <p className="text-sm text-muted-foreground">Recent activity across your workspace</p>
      </div>
      <Suspense fallback={<ActivityFeedSkeleton />}>
        <ActivityFeed />
      </Suspense>
    </div>
  )
}
