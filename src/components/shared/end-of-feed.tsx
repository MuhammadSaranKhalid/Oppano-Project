interface EndOfFeedProps {
  message?: string
}

export function EndOfFeed({ message = "You've reached the end" }: EndOfFeedProps) {
  return (
    <div className="py-8 text-center">
      <div className="h-px w-full max-w-md mx-auto bg-gray-200 mb-6"></div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
