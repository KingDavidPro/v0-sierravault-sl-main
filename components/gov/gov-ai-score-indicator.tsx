import { cn } from "@/lib/utils"
import { AlertTriangle, CheckCircle, HelpCircle } from "lucide-react"

interface GovAiScoreIndicatorProps {
  score: number
  showLabel?: boolean
  size?: "sm" | "md"
}

export function GovAiScoreIndicator({ score, showLabel = true, size = "md" }: GovAiScoreIndicatorProps) {
  const percentage = Math.round(score * 100)

  const getConfig = () => {
    if (score >= 0.8) {
      return {
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/20",
        borderColor: "border-emerald-500/30",
        icon: CheckCircle,
        label: "High Confidence",
      }
    }
    if (score >= 0.6) {
      return {
        color: "text-amber-400",
        bgColor: "bg-amber-500/20",
        borderColor: "border-amber-500/30",
        icon: HelpCircle,
        label: "Review Needed",
      }
    }
    return {
      color: "text-red-400",
      bgColor: "bg-red-500/20",
      borderColor: "border-red-500/30",
      icon: AlertTriangle,
      label: "Low Confidence",
    }
  }

  const config = getConfig()
  const Icon = config.icon

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn("flex items-center gap-1.5 px-2 py-1 rounded-full border", config.bgColor, config.borderColor)}
      >
        <Icon className={cn(config.color, size === "sm" ? "w-3 h-3" : "w-4 h-4")} />
        <span className={cn("font-semibold", config.color, size === "sm" ? "text-xs" : "text-sm")}>{percentage}%</span>
      </div>
      {showLabel && <span className={cn("text-white/60", size === "sm" ? "text-xs" : "text-sm")}>{config.label}</span>}
    </div>
  )
}
