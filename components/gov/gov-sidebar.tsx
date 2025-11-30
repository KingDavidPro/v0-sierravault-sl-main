"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileCheck,
  FilePlus,
  Users,
  Shield,
  ScrollText,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react"
import { GovVaultBadge } from "./gov-vault-badge"

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  shortcut?: string
}

const navItems: NavItem[] = [
  { href: "/gov/dashboard", label: "Dashboard", icon: LayoutDashboard, shortcut: "g+d" },
  { href: "/gov/pending", label: "Pending Verifications", icon: FileCheck },
  { href: "/gov/issue", label: "Issue Document", icon: FilePlus },
  { href: "/gov/users", label: "Users & Agencies", icon: Users },
  { href: "/gov/roles", label: "Roles & Permissions", icon: Shield },
  { href: "/gov/audit", label: "Audit Logs", icon: ScrollText },
  { href: "/gov/settings", label: "Settings", icon: Settings },
  { href: "/gov/help", label: "Help & Training", icon: HelpCircle },
]

interface GovSidebarProps {
  className?: string
}

export function GovSidebar({ className }: GovSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  // Keyboard shortcut: g+d for dashboard
  useEffect(() => {
    let lastKey = ""
    let lastKeyTime = 0

    const handleKeyDown = (e: KeyboardEvent) => {
      const now = Date.now()
      const target = e.target as HTMLElement

      // Ignore if typing in input
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return

      if (e.key === "g" && now - lastKeyTime < 500 && lastKey === "g") {
        // Already pressed 'g', wait for next key
      } else if (lastKey === "g" && e.key === "d" && now - lastKeyTime < 500) {
        window.location.href = "/gov/dashboard"
      }

      lastKey = e.key
      lastKeyTime = now
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-[#0A2A43]/95 backdrop-blur-xl border-r border-white/10 transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <GovVaultBadge size="sm" />
            <span className="font-semibold text-white text-sm">Gov Portal</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-[#2DC5A0]/20 text-[#2DC5A0] border border-[#2DC5A0]/30"
                  : "text-white/70 hover:bg-white/10 hover:text-white",
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-[#2DC5A0]")} />
              {!collapsed && (
                <>
                  <span className="flex-1 text-sm font-medium">{item.label}</span>
                  {item.shortcut && (
                    <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-white/10 rounded text-white/50">
                      {item.shortcut}
                    </kbd>
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-white/10">
        <Link
          href="/gov/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-red-500/20 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
        </Link>
      </div>
    </aside>
  )
}
