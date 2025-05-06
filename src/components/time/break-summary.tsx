import { formatDuration } from "@lib/time-utils";

interface BreakItem {
  start: string;
  end: string | null;
  duration: number;
}

interface BreakSummaryProps {
  breaks: BreakItem[];
}

export function BreakSummary({ breaks }: BreakSummaryProps) {
  if (breaks.length === 0) return null;

  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-md">
      <h3 className="text-sm font-medium text-blue-800 mb-2">Break Summary</h3>
      <div className="space-y-2">
        {breaks.map((breakItem, index) => (
          <div key={index} className="flex justify-between text-sm">
            <div>
              {breakItem.start} - {breakItem.end || "Ongoing"}
            </div>
            <div className="font-medium">
              {breakItem.end
                ? formatDuration(breakItem.duration * 1000)
                : "In progress"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
