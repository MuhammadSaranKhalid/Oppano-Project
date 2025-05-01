"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  { day: "Feb 10", hours: 8 },
  { day: "Feb 11", hours: 7 },
  { day: "Feb 12", hours: 4 },
  { day: "Feb 13", hours: 7 },
  { day: "Feb 14", hours: 8 },
  { day: "Feb 15", hours: 6 },
  { day: "Feb 16", hours: 4 },
]

export function DailyHoursChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="day" axisLine={false} tickLine={false} />
        <YAxis axisLine={false} tickLine={false} domain={[0, 8]} ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8]} />
        <Bar dataKey="hours" fill="#ff6a00" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
