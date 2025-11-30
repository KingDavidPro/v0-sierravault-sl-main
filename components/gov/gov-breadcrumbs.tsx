"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"

const routeLabels: Record<string, string> = {
  gov: "Government Portal",
  dashboard: "Dashboard",
  pending: "Pending Verifications",
  issue: "Issue Document",
  users: "Users & Agencies",
  roles: "Roles & Permissions",
  audit: "Audit Logs",
  settings: "Settings",
  help: "Help & Training",
  login: "Login",
  "verify-otp": "Verify OTP",
}

export function GovBreadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length <= 1) return null

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
      <Link href="/gov/dashboard" className="flex items-center gap-1 text-white/50 hover:text-white transition-colors">
        <Home className="w-4 h-4" />
      </Link>

      {segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/")
        const isLast = index === segments.length - 1
        const label = routeLabels[segment] || segment

        return (
          <div key={href} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-white/30" />
            {isLast ? (
              <span className="text-white font-medium">{label}</span>
            ) : (
              <Link href={href} className="text-white/50 hover:text-white transition-colors">
                {label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
