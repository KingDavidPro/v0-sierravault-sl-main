"use client"

import type { ButtonHTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  loading?: boolean
  variant?: "primary" | "secondary" | "outline"
}

export function AuthButton({ children, loading, variant = "primary", className, disabled, ...props }: AuthButtonProps) {
  const variants = {
    primary: "bg-[#2DC5A0] hover:bg-[#25a88a] text-white shadow-lg shadow-[#2DC5A0]/30",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900",
    outline: "border-2 border-gray-300 hover:border-[#2DC5A0] hover:bg-[#2DC5A0]/5 text-gray-700",
  }

  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "w-full h-12 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
        variants[variant],
        className,
      )}
      {...props}
    >
      {loading && <Loader2 className="h-5 w-5 animate-spin" />}
      {children}
    </button>
  )
}
