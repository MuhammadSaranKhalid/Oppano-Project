import { Skeleton } from "@/components/ui/skeleton";

export function ChatAreaSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Header skeleton */}
      <div className="border-b p-3 flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-3 w-[100px]" />
        </div>
      </div>

      {/* Messages skeleton */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`flex ${
                i % 2 === 0 ? "flex-row" : "flex-row-reverse"
              } gap-2 max-w-[80%]`}
            >
              {i % 2 === 0 && (
                <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
              )}
              <div>
                <div
                  className={`rounded-lg p-3 ${
                    i % 2 === 0 ? "rounded-tl-none" : "rounded-tr-none"
                  }`}
                >
                  <Skeleton
                    className={`h-4 ${i % 2 === 0 ? "w-[200px]" : "w-[150px]"}`}
                  />
                  <div className="mt-2">
                    <Skeleton
                      className={`h-3 ${
                        i % 2 === 0 ? "w-[180px]" : "w-[130px]"
                      }`}
                    />
                  </div>
                </div>
                <Skeleton className="h-2 w-[70px] mt-1" />
              </div>
              {i % 2 !== 0 && (
                <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input skeleton */}
      <div className="border-t p-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 flex-1 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}
