"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface GovVaultBadgeProps {
  size?: "sm" | "md" | "lg"
  animate?: boolean
}

export function GovVaultBadge({ size = "md", animate = true }: GovVaultBadgeProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setIsOpen(true), 500)
      return () => clearTimeout(timer)
    }
  }, [animate])

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-20 h-20",
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#2DC5A0]/20 to-[#0A2A43] border border-[#2DC5A0]/30",
        sizeClasses[size],
      )}
      role="img"
      aria-label="SierraVault security badge"
    >
      {/* Shield Icon */}
      <svg
        viewBox="0 0 24 24"
        className={cn(
          "text-[#2DC5A0] transition-transform duration-500",
          size === "sm" && "w-5 h-5",
          size === "md" && "w-7 h-7",
          size === "lg" && "w-12 h-12",
          isOpen && "scale-110",
        )}
        fill="currentColor"
      >
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
      </svg>

      {/* Animated Ring */}
      {animate && (
        <div
          className={cn(
            "absolute inset-0 rounded-xl border-2 border-[#2DC5A0]/50 transition-all duration-700",
            isOpen ? "scale-125 opacity-0" : "scale-100 opacity-100",
          )}
        />
      )}

      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-xl bg-[#2DC5A0]/10 blur-xl -z-10" />
    </div>
  )
}
