import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

type SpinnerProps = {
  size?: "sm" | "md" | "lg"
  className?: string
}

/**
 * Spinner component
 * Displays a loading spinner with customizable size
 */
export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return <Loader2 className={cn("animate-spin text-muted-foreground", sizeClasses[size], className)} />
}
