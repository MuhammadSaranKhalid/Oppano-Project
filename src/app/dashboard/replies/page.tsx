import { Suspense } from "react";
import RepliesView from "@/components/replies/replies-view";
import { RepliesViewSkeleton } from "@/components/replies/skeletons/replies-view-skeleton";

export default function RepliesPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <h2 className="text-lg font-medium">Replies</h2>
        <p className="text-sm text-muted-foreground">
          Conversations and messages that mention you
        </p>
      </div>
      <Suspense fallback={<RepliesViewSkeleton />}>
        <RepliesView />
      </Suspense>
    </div>
  );
}
