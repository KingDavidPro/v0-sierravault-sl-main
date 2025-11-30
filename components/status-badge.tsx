import { CheckCircle, Clock, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "verified" | "pending" | "rejected"
  size?: "sm" | "md"
}

const statusConfig = {
  verified: {
    icon: CheckCircle,
    label: "Verified",
    className: "bg-teal/10 text-teal border-teal/30",
  },
  pending: {
    icon: Clock,
    label: "Pending",
    className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  },
  rejected: {
    icon: XCircle,
    label: "Rejected",
    className: "bg-destructive/10 text-destructive border-destructive/30",
  },
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border",
        config.className,
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
      )}
    >
      <Icon className={cn(size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3")} />
      <span className="font-medium">{config.label}</span>
    </div>
  )
}
