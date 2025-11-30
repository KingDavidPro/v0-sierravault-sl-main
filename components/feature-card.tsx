import type { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  className?: string
}

export function FeatureCard({ icon: Icon, title, description, className }: FeatureCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-white/10 bg-[#0D1B2A]/80 backdrop-blur-sm p-6 transition-all duration-300 rounded-xl",
        "hover:border-teal/40 hover:shadow-xl hover:shadow-teal/10 hover:-translate-y-1",
        className,
      )}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Glow effect */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-teal/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <div className="relative">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-teal/10 border border-teal/20 transition-all group-hover:bg-teal/20 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-teal/20">
          <Icon className="h-7 w-7 text-teal" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
      </div>
    </Card>
  )
}
