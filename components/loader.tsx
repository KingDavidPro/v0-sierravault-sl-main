import { cn } from "@/lib/utils"

interface LoaderProps {
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

export function Loader({ size = "md", text, className }: LoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  }

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div className={cn("animate-spin rounded-full border-teal border-t-transparent", sizeClasses[size])} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  )
}

interface AILoaderProps {
  stage?: "scanning" | "analyzing" | "encrypting" | "storing"
  progress?: number
}

export function AILoader({ stage = "scanning", progress = 0 }: AILoaderProps) {
  const stages = {
    scanning: { label: "Scanning document...", icon: "scan" },
    analyzing: { label: "AI analyzing authenticity...", icon: "brain" },
    encrypting: { label: "Encrypting with 256-bit AES...", icon: "lock" },
    storing: { label: "Storing on blockchain...", icon: "chain" },
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="relative">
        <div className="h-20 w-20 rounded-full border-4 border-secondary">
          <div
            className="absolute inset-0 rounded-full border-4 border-teal border-t-transparent animate-spin"
            style={{ animationDuration: "1.5s" }}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-teal">{Math.round(progress)}%</span>
        </div>
      </div>
      <p className="text-sm font-medium text-foreground">{stages[stage].label}</p>
      <div className="w-full max-w-xs">
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-teal transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  )
}
