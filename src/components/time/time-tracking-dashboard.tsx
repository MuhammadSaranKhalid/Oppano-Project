"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { TimeMetricsCard } from "./time-metrics-card"
import { DailyHoursChart } from "./daily-hours-chart"
import { AppUsageChart } from "./app-usage-chart"
import { MonthCalendar } from "./month-calendar"

export function TimeTrackingDashboard() {
  const [currentMonth, setCurrentMonth] = useState("February 2024")

  return (
    <div className="space-y-6">
      {/* User Profile Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/abstract-geometric-shapes.png" alt="Cristal Parker" />
            <AvatarFallback>CP</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-medium">Cristal Parker</h3>
            <div className="text-sm text-muted-foreground">
              <span>Graphics Designer</span>
              <span className="mx-2">•</span>
              <span>Starter</span>
            </div>
          </div>
        </div>
        <Button variant="outline" className="h-9">
          View Profile
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <TimeMetricsCard title="Total Hours Worked Today" value="002:25:33" valueSize="large" />
        <TimeMetricsCard title="Avg Activity Today" value="52%" valueSize="large" valueColor="text-[#ff6a00]" />
        <TimeMetricsCard title="Total Hrs Worked Past 7 Days" value="022:25:33" valueSize="large" />
        <TimeMetricsCard title="Avg Activity Past 7 Days" value="41%" valueSize="large" valueColor="text-[#ff6a00]" />
      </div>

      {/* Daily Hours Chart */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="mb-4 text-lg font-medium">Total Hours Worked Per Day</h3>
        <div className="h-64">
          <DailyHoursChart />
        </div>
      </div>

      {/* App Usage and Calendar */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-medium">Avg Daily Usage of Apps</h3>
          <div className="h-64">
            <AppUsageChart />
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium">{currentMonth}</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <MonthCalendar />
        </div>
      </div>
    </div>
  )
}
