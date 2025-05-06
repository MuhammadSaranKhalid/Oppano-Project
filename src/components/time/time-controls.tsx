"use client";

import { Button } from "@/components/ui/button";
import { Coffee, Pause, Play, StopCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeControlsProps {
  status: "idle" | "running" | "paused" | "break" | "stopped";
  onStart: () => void;
  onPause: () => void;
  onBreak: () => void;
  onStop: () => void;
}

export function TimeControls({
  status,
  onStart,
  onPause,
  onBreak,
  onStop,
}: TimeControlsProps) {
  const getActionButtonText = () => {
    switch (status) {
      case "idle":
        return "Clock In";
      case "running":
        return "Pause";
      case "paused":
        return "Resume";
      case "break":
        return "End Break";
      case "stopped":
        return "Start New Session";
      default:
        return "Clock In";
    }
  };

  const getActionButtonHandler = () => {
    switch (status) {
      case "idle":
      case "stopped":
      case "paused":
      case "break":
        return onStart;
      case "running":
        return onPause;
      default:
        return onStart;
    }
  };

  const getActionButtonIcon = () => {
    switch (status) {
      case "idle":
      case "stopped":
      case "paused":
      case "break":
        return <Play className="h-4 w-4 mr-2" />;
      case "running":
        return <Pause className="h-4 w-4 mr-2" />;
      default:
        return <Play className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      <Button
        className={cn(
          "flex items-center justify-center gap-2",
          status === "running"
            ? "bg-amber-500 hover:bg-amber-600"
            : "bg-green-500 hover:bg-green-600"
        )}
        onClick={getActionButtonHandler()}
      >
        {getActionButtonIcon()}
        {getActionButtonText()}
      </Button>

      <Button
        className={cn(
          "flex items-center justify-center gap-2",
          "bg-blue-500 hover:bg-blue-600"
        )}
        disabled={status !== "running"}
        onClick={onBreak}
      >
        <Coffee className="h-4 w-4 mr-2" />
        Take Break
      </Button>

      <Button
        className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600"
        disabled={status === "idle" || status === "stopped"}
        onClick={onStop}
      >
        <StopCircle className="h-4 w-4 mr-2" />
        Check Out
      </Button>
    </div>
  );
}
