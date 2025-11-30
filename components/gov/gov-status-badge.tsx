import type React from "react"
import { cn } from "@/lib/utils"
import { Clock, CheckCircle, XCircle, AlertTriangle, HelpCircle } from "lucide-react"

type Status = "pending" | "needs_review" | "approved" | "rejected" | "active" | "suspended" | "pending_invite"

interface GovStatusBadgeProps {
  status: Status
}

const statusConfig: Record<
  Status,
  { label: string; className: string; icon: React.ComponentType<{ className?: string }> }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    icon: Clock,
  },
  needs_review: {
    label: "Needs Review",
    className: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    icon: AlertTriangle,
  },
  approved: {
    label: "Approved",
    className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    icon: CheckCircle,
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-500/20 text-red-400 border-red-500/30",
    icon: XCircle,
  },
  active: {
    label: "Active",
    className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    icon: CheckCircle,
  },
  suspended: {
    label: "Suspended",
    className: "bg-red-500/20 text-red-400 border-red-500/30",
    icon: XCircle,
  },
  pending_invite: {
    label: "Invite Pending",
    className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: HelpCircle,
  },
}

export function GovStatusBadge({ status }: GovStatusBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full border",
        config.className,
      )}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  )
}
