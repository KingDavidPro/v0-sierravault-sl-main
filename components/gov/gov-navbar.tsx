"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Bell, Search, User, ChevronDown } from "lucide-react"
import { GovRoleBadge } from "./gov-role-badge"
import { GovSearchBar } from "./gov-search-bar"
import type { GovOfficer, Agency } from "@/lib/gov-mock-data"

interface GovNavbarProps {
  officer?: GovOfficer
  agency?: Agency
}

export function GovNavbar({ officer, agency }: GovNavbarProps) {
  const [showSearch, setShowSearch] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [notifications] = useState(2) // Mock notification count
  const menuRef = useRef<HTMLDivElement>(null)

  // Keyboard shortcut: "/" to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return

      if (e.key === "/") {
        e.preventDefault()
        setShowSearch(true)
      }
      if (e.key === "Escape") {
        setShowSearch(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 md:px-6 bg-[#0A2A43]/95 backdrop-blur-xl border-b border-white/10">
        {/* Left: Tagline */}
        <div className="hidden md:block">
          <p className="text-xs text-white/50 italic">"Your life documents. Always safe. Always verifiable."</p>
        </div>

        {/* Mobile: Logo */}
        <div className="md:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#2DC5A0]/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-[#2DC5A0]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
            </svg>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Search Button */}
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors"
            aria-label="Search (Press /)"
          >
            <Search className="w-4 h-4" />
            <span className="hidden md:inline text-sm">Search NIN...</span>
            <kbd className="hidden lg:inline-flex px-1.5 py-0.5 text-[10px] font-mono bg-white/10 rounded">/</kbd>
          </button>

          {/* Notifications */}
          <button
            className="relative p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            aria-label={`${notifications} notifications`}
          >
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white">
                {notifications}
              </span>
            )}
          </button>

          {/* User Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-expanded={showUserMenu}
              aria-haspopup="true"
            >
              <div className="w-8 h-8 rounded-full bg-[#2DC5A0]/20 flex items-center justify-center">
                <User className="w-4 h-4 text-[#2DC5A0]" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-white leading-none">{officer?.name || "Gov Officer"}</p>
                <p className="text-xs text-white/50 mt-0.5">{agency?.code || "---"}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-white/50 hidden md:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-[#0A2A43] border border-white/10 rounded-xl shadow-xl overflow-hidden">
                <div className="p-4 border-b border-white/10">
                  <p className="font-medium text-white">{officer?.name}</p>
                  <p className="text-sm text-white/50">{officer?.email}</p>
                  <div className="mt-2">
                    <GovRoleBadge role={officer?.role || "GOV_READONLY"} />
                  </div>
                </div>
                <div className="p-2">
                  <Link
                    href="/gov/settings"
                    className="block px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    Account Settings
                  </Link>
                  <Link
                    href="/gov/help"
                    className="block px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    Help & Support
                  </Link>
                  <hr className="my-2 border-white/10" />
                  <Link
                    href="/gov/login"
                    className="block px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    Sign Out
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Search Modal */}
      {showSearch && <GovSearchBar onClose={() => setShowSearch(false)} />}
    </>
  )
}
