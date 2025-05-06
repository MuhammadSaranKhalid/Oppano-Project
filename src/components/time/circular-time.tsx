"use client";

import { cn } from "@/lib/utils";

interface CircularTimerProps {
  time: string;
  progress: number;
  state: "idle" | "running" | "paused" | "break" | "stopped";
  pulseWhenRunning?: boolean;
}

export function CircularTimer({
  time,
  progress,
  state,
  pulseWhenRunning = true,
}: CircularTimerProps) {
  const circumference = 2 * Math.PI * 45; // 45 is the radius of the circle
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
        />

        {/* Progress circle */}
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke={
            state === "running"
              ? "#10b981"
              : state === "paused"
              ? "#f59e0b"
              : state === "break"
              ? "#3b82f6"
              : state === "stopped"
              ? "#ef4444"
              : "#9ca3af"
          }
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn(
            "transition-all duration-500",
            state === "running" && pulseWhenRunning && "animate-pulse"
          )}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold tabular-nums">{time}</div>
        <div className="text-xs text-gray-500 mt-1">
          {state === "running" && "Working"}
          {state === "paused" && "Paused"}
          {state === "break" && "On Break"}
          {state === "stopped" && "Stopped"}
          {state === "idle" && "Not Started"}
        </div>
      </div>
    </div>
  );
}
