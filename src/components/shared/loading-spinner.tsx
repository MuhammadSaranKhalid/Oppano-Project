import { Spinner } from "@/components/ui/spinner"

interface LoadingSpinnerProps {
  message?: string
}

export function LoadingSpinner({ message = "Loading more items..." }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <Spinner size={"md"} />
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
