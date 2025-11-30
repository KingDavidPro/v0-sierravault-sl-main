"use client"

import { useEffect, useState } from "react"
import { Shield, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

interface VaultAnimationProps {
  isOpen?: boolean
  size?: "sm" | "md" | "lg"
}

export function VaultAnimation({ isOpen = false, size = "lg" }: VaultAnimationProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const sizeClasses = {
    sm: "h-32 w-32",
    md: "h-48 w-48",
    lg: "h-64 w-64",
  }

  return (
    <div className={cn("relative", sizeClasses[size])}>
      {/* Outer glow rings */}
      <div className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-teal/20" />
      <div
        className="absolute inset-2 animate-pulse-ring rounded-full border border-teal/30"
        style={{ animationDelay: "0.5s" }}
      />

      {/* Main vault body */}
      <div
        className={cn(
          "relative h-full w-full rounded-2xl border-2 border-teal/50 bg-gradient-to-br from-navy-light to-navy-dark shadow-xl animate-vault-glow",
          "flex items-center justify-center",
        )}
      >
        {/* Vault door effect */}
        <div
          className={cn(
            "absolute inset-4 rounded-xl border border-teal/30 bg-navy/50",
            "flex items-center justify-center",
            mounted && isOpen && "animate-vault-open origin-left",
          )}
        >
          {/* Inner details */}
          <div className="relative">
            {/* Shield icon */}
            <Shield
              className={cn(
                "text-teal transition-all duration-500",
                size === "lg" ? "h-16 w-16" : size === "md" ? "h-12 w-12" : "h-8 w-8",
                isOpen && "scale-110",
              )}
            />
            {/* Lock indicator */}
            <div
              className={cn(
                "absolute -bottom-2 -right-2 flex items-center justify-center rounded-full bg-navy border border-teal/50",
                size === "lg" ? "h-8 w-8" : size === "md" ? "h-6 w-6" : "h-5 w-5",
              )}
            >
              <Lock className={cn("text-teal", size === "lg" ? "h-4 w-4" : "h-3 w-3")} />
            </div>
          </div>
        </div>

        {/* Corner accents */}
        <div className="absolute top-2 left-2 h-4 w-4 border-l-2 border-t-2 border-teal/50 rounded-tl" />
        <div className="absolute top-2 right-2 h-4 w-4 border-r-2 border-t-2 border-teal/50 rounded-tr" />
        <div className="absolute bottom-2 left-2 h-4 w-4 border-l-2 border-b-2 border-teal/50 rounded-bl" />
        <div className="absolute bottom-2 right-2 h-4 w-4 border-r-2 border-b-2 border-teal/50 rounded-br" />
      </div>

      {/* Encryption badge */}
      <div className="absolute -top-2 -right-2 flex items-center gap-1 rounded-full bg-teal px-2 py-1 text-[10px] font-semibold text-navy-dark shadow-lg">
        <Lock className="h-3 w-3" />
        <span>256-bit Encrypted</span>
      </div>
    </div>
  )
}
