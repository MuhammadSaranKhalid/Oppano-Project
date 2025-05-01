import { Suspense } from "react"
import DraftsList from "@/components/drafts/drafts-list"
import { DraftsListSkeleton } from "@/components/drafts/skeletons/drafts-list-skeleton"

export default function DraftsPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <h2 className="text-lg font-medium">Drafts</h2>
        <p className="text-sm text-muted-foreground">Your saved message drafts</p>
      </div>
      <Suspense fallback={<DraftsListSkeleton />}>
        <DraftsList />
      </Suspense>
    </div>
  )
}
