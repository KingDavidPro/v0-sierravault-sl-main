import type { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  change?: string
  trend?: "up" | "down" | "neutral"
  className?: string
}

export function StatsCard({ icon: Icon, label, value, change, trend = "neutral", className }: StatsCardProps) {
  return (
    <Card className={cn("border-border bg-card p-4", className)}>
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal/10">
          <Icon className="h-5 w-5 text-teal" />
        </div>
        {change && (
          <span
            className={cn(
              "text-xs font-medium",
              trend === "up" && "text-teal",
              trend === "down" && "text-destructive",
              trend === "neutral" && "text-muted-foreground",
            )}
          >
            {change}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </Card>
  )
}
