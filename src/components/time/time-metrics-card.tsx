interface TimeMetricsCardProps {
  title: string
  value: string
  valueSize?: "normal" | "large"
  valueColor?: string
}

export function TimeMetricsCard({
  title,
  value,
  valueSize = "normal",
  valueColor = "text-foreground",
}: TimeMetricsCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="mb-2 text-sm font-medium text-muted-foreground">{title}</h3>
      <p className={`font-medium ${valueColor} ${valueSize === "large" ? "text-3xl" : "text-xl"}`}>{value}</p>
    </div>
  )
}
