"use client"

import { type InputHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: LucideIcon
  error?: string
  optional?: boolean
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, icon: Icon, error, optional, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
          {label} {optional && <span className="text-gray-400 text-xs">(Optional)</span>}
        </label>
        <div className="relative">
          {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />}
          <input
            ref={ref}
            className={cn(
              "w-full h-12 rounded-lg border border-gray-300 bg-white px-4 text-gray-900 placeholder:text-gray-400 focus:border-[#2DC5A0] focus:ring-2 focus:ring-[#2DC5A0]/20 outline-none transition-all",
              Icon && "pl-11",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              className,
            )}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    )
  },
)

AuthInput.displayName = "AuthInput"
