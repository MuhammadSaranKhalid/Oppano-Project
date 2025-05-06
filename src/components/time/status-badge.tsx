import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "idle" | "running" | "paused" | "break" | "stopped";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      className={cn(
        "px-3 py-1 text-sm",
        status === "running" &&
          "bg-green-100 text-green-800 hover:bg-green-100",
        status === "paused" && "bg-amber-100 text-amber-800 hover:bg-amber-100",
        status === "break" && "bg-blue-100 text-blue-800 hover:bg-blue-100",
        status === "stopped" && "bg-red-100 text-red-800 hover:bg-red-100",
        status === "idle" && "bg-gray-100 text-gray-800 hover:bg-gray-100",
        className
      )}
    >
      {status === "running" && "Working"}
      {status === "paused" && "Paused"}
      {status === "break" && "On Break"}
      {status === "stopped" && "Stopped"}
      {status === "idle" && "Not Started"}
    </Badge>
  );
}
