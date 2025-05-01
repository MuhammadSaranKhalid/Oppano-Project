"use client"

import React from "react"

export function MonthCalendar() {
  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

  // February 2024 dates
  const dates = [
    [29, 30, 31, 1, 2, 3, 4],
    [5, 6, 7, 8, 9, 10, 11],
    [12, 13, 14, 15, 16, 17, 18],
    [19, 20, 21, 22, 23, 24, 25],
    [26, 27, 28, 29, 1, 2, 3],
  ]

  // Current date is Feb 15, 2024
  const currentDate = 15

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((day) => (
          <div key={day} className="py-1 text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}

        {dates.map((week, weekIndex) => (
          <React.Fragment key={`week-${weekIndex}`}>
            {week.map((date, dateIndex) => {
              const isCurrentMonth = date >= 1 && date <= 29
              const isCurrentDate = date === currentDate && isCurrentMonth
              const isWeekend = dateIndex >= 5

              return (
                <div
                  key={`date-${weekIndex}-${dateIndex}`}
                  className={`flex h-8 items-center justify-center rounded-full text-sm ${
                    isCurrentDate
                      ? "bg-[#ff6a00] text-white"
                      : isCurrentMonth
                        ? isWeekend
                          ? "text-muted-foreground"
                          : "text-foreground"
                        : "text-muted-foreground/50"
                  }`}
                >
                  {date}
                </div>
              )
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
