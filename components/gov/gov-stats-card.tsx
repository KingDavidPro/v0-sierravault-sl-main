import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface GovStatsCardProps {
  title: string
  value: number | string
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: LucideIcon
  href?: string
}

export function GovStatsCard({ title, value, change, changeType = "neutral", icon: Icon, href }: GovStatsCardProps) {
  const Wrapper = href ? "a" : "div"

  return (
    <Wrapper
      href={href}
      className={cn(
        "relative overflow-hidden p-5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl",
        href && "hover:bg-white/10 hover:border-[#2DC5A0]/30 transition-all cursor-pointer group",
      )}
    >
      {/* Background Icon */}
      <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon className="w-24 h-24" />
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/60 text-sm font-medium">{title}</span>
          <div className="w-10 h-10 rounded-xl bg-[#2DC5A0]/20 flex items-center justify-center">
            <Icon className="w-5 h-5 text-[#2DC5A0]" />
          </div>
        </div>

        <div className="flex items-end justify-between">
          <span className="text-3xl font-bold text-white">{value}</span>
          {change && (
            <span
              className={cn(
                "text-xs font-medium px-2 py-1 rounded-full",
                changeType === "positive" && "bg-emerald-500/20 text-emerald-400",
                changeType === "negative" && "bg-red-500/20 text-red-400",
                changeType === "neutral" && "bg-white/10 text-white/60",
              )}
            >
              {change}
            </span>
          )}
        </div>
      </div>
    </Wrapper>
  )
}
