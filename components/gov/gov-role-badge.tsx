import type React from "react"
import { cn } from "@/lib/utils"
import { roleLabels, roleColors, type GovRole } from "@/lib/gov-mock-data"
import { Shield, Edit, Eye, Search, Settings } from "lucide-react"

interface GovRoleBadgeProps {
  role: GovRole
  size?: "sm" | "md"
}

const roleIcons: Record<GovRole, React.ComponentType<{ className?: string }>> = {
  GOV_ADMIN: Settings,
  GOV_ISSUER: Edit,
  GOV_SUPERVISOR: Shield,
  GOV_AUDITOR: Search,
  GOV_READONLY: Eye,
}

export function GovRoleBadge({ role, size = "sm" }: GovRoleBadgeProps) {
  const Icon = roleIcons[role]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-full border font-medium",
        roleColors[role],
        size === "sm" ? "text-xs" : "text-sm",
      )}
    >
      <Icon className={cn(size === "sm" ? "w-3 h-3" : "w-4 h-4")} />
      {roleLabels[role]}
    </span>
  )
}
