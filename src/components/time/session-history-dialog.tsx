"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDuration } from "@lib/time-utils";
import { formatDate } from "@lib/utils";
import { History, Clock } from "lucide-react";

interface TimerSession {
  id: string;
  date: string;
  startTime: string;
  endTime: string | null;
  duration: number;
  breaks: { start: string; end: string; duration: number }[];
}

interface SessionHistoryDialogProps {
  sessions: TimerSession[];
}

export function SessionHistoryDialog({ sessions }: SessionHistoryDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <History className="h-4 w-4" />
          Session History
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Time Tracking Sessions</DialogTitle>
          <DialogDescription>
            View your recent time tracking sessions and their durations.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] rounded-md border p-4">
          {sessions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Breaks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>{formatDate(session.date)}</TableCell>
                    <TableCell>{session.startTime}</TableCell>
                    <TableCell>{session.endTime || "Active"}</TableCell>
                    <TableCell>
                      {formatDuration(session.duration * 1000)}
                    </TableCell>
                    <TableCell>
                      {session.breaks.length > 0 ? (
                        <div className="text-xs">
                          {session.breaks.length} break
                          {session.breaks.length > 1 ? "s" : ""}
                          <span className="text-gray-500 ml-1">
                            (
                            {formatDuration(
                              session.breaks.reduce(
                                (acc, b) => acc + b.duration,
                                0
                              ) * 1000
                            )}
                            )
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">None</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <Clock className="h-12 w-12 text-gray-400 mb-2" />
              <h3 className="text-lg font-medium">No sessions yet</h3>
              <p className="text-sm text-gray-500">
                Start tracking your time to see your sessions here.
              </p>
            </div>
          )}
        </ScrollArea>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
