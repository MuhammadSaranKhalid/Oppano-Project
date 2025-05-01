import { TimeTrackingDashboard } from "@/components/time/time-tracking-dashboard"

export default function TimePage() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <h2 className="text-lg font-medium">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Employees overall work activity shown here</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <TimeTrackingDashboard />
      </div>
    </div>
  )
}
