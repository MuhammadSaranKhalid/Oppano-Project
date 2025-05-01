import { UserStatus } from "@/types"
import { cn } from "@/lib/utils"

interface StatusIndicatorProps {
  status: UserStatus
  className?: string
  size?: "xs" | "sm" | "md" | "lg"
  showStatusRing?: boolean
}

export function StatusIndicator({ status, className, size = "md", showStatusRing = false }: StatusIndicatorProps) {
  const sizeClasses = {
    xs: "w-1.5 h-1.5",
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
  }

  const ringClasses = {
    xs: "ring-[1px] ring-offset-[1px]",
    sm: "ring-[1.5px] ring-offset-[1px]",
    md: "ring-[1.5px] ring-offset-[1.5px]",
    lg: "ring-2 ring-offset-2",
  }

  const statusColors = {
    [UserStatus.ONLINE]: "bg-green-500",
    [UserStatus.OFFLINE]: "bg-gray-400",
    [UserStatus.AWAY]: "bg-yellow-500",
    [UserStatus.DO_NOT_DISTURB]: "bg-red-500",
    [UserStatus.INVISIBLE]: "bg-gray-400",
  }

  return (
    <span
      className={cn(
        "block rounded-full",
        sizeClasses[size],
        statusColors[status],
        showStatusRing && ringClasses[size],
        showStatusRing && "ring-white ring-offset-background",
        className,
      )}
      aria-label={`Status: ${status.toLowerCase()}`}
      title={status.toLowerCase()}
    />
  )
}
