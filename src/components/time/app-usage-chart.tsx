"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "Loopz", value: 18.6, color: "#ff6a00" },
  { name: "Photoshop", value: 21.7, color: "#7db755" },
  { name: "Instagram", value: 9.6, color: "#00f264" },
  { name: "Facebook", value: 9.3, color: "#7fa0ef" },
  { name: "Word", value: 17.7, color: "#5687f2" },
  { name: "Excel", value: 23.2, color: "#821bf8" },
]

export function AppUsageChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value}%`, "Usage"]} contentStyle={{ borderRadius: "8px" }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
