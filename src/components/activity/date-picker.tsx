"use client";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { addDays, format } from "date-fns";
import { X } from "lucide-react";

interface DatePickerProps {
  dateRange: { from: Date | undefined; to: Date | undefined };
  onDateRangeChange: (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => void;
  onClose: () => void;
}

export function DatePicker({
  dateRange,
  onDateRangeChange,
  onClose,
}: DatePickerProps) {
  const today = new Date();

  const presets = [
    {
      name: "Today",
      range: { from: today, to: today },
    },
    {
      name: "Yesterday",
      range: { from: addDays(today, -1), to: addDays(today, -1) },
    },
    {
      name: "Last 7 days",
      range: { from: addDays(today, -6), to: today },
    },
    {
      name: "Last 30 days",
      range: { from: addDays(today, -29), to: today },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Filter by date</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {presets.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                size="sm"
                onClick={() => onDateRangeChange(preset.range)}
                className={
                  dateRange.from === preset.range.from &&
                  dateRange.to === preset.range.to
                    ? "border-[#ff6a00] bg-[#fff9e5] text-[#ff6a00]"
                    : ""
                }
              >
                {preset.name}
              </Button>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm mb-2">
            <div>
              <span className="text-gray-500">From: </span>
              <span className="font-medium">
                {dateRange.from ? format(dateRange.from, "PPP") : "Select date"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">To: </span>
              <span className="font-medium">
                {dateRange.to ? format(dateRange.to, "PPP") : "Select date"}
              </span>
            </div>
          </div>
        </div>

        <div className="border rounded-md">
          <Calendar
            mode="range"
            selected={{
              from: dateRange.from,
              to: dateRange.to,
            }}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                onDateRangeChange(range as any);
              }
            }}
            numberOfMonths={1}
            defaultMonth={dateRange.from}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => onDateRangeChange({ from: undefined, to: undefined })}
        >
          Clear
        </Button>
        <Button
          onClick={onClose}
          className="bg-[#ff6a00] hover:bg-[#ff6a00]/90"
        >
          Apply
        </Button>
      </div>
    </div>
  );
}
