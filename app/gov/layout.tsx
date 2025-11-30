"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { GovSidebar } from "@/components/gov/gov-sidebar"
import { GovNavbar } from "@/components/gov/gov-navbar"
import { GovToastProvider } from "@/components/gov/gov-toast"
import type { GovOfficer, Agency } from "@/lib/gov-mock-data"
import { mockOfficers, mockAgencies } from "@/lib/gov-mock-data"

// Pages that don't use the dashboard layout
const authPages = ["/gov/login", "/gov/verify-otp"]

export default function GovLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAuthPage = authPages.includes(pathname)
  const [officer, setOfficer] = useState<GovOfficer | undefined>()
  const [agency, setAgency] = useState<Agency | undefined>()

  useEffect(() => {
    // Load officer data from session (mock for demo)
    // In production, decode JWT token or fetch from API
    const storedOfficer = sessionStorage.getItem("gov_officer")
    const storedAgency = sessionStorage.getItem("gov_agency")

    if (storedOfficer) {
      setOfficer(JSON.parse(storedOfficer))
    } else {
      // Default to first officer for demo
      setOfficer(mockOfficers[0])
    }

    if (storedAgency) {
      setAgency(JSON.parse(storedAgency))
    } else {
      // Default to first agency for demo
      setAgency(mockAgencies[0])
    }
  }, [])

  // Auth pages render without sidebar/navbar
  if (isAuthPage) {
    return <GovToastProvider>{children}</GovToastProvider>
  }

  // Dashboard layout with sidebar and navbar
  return (
    <GovToastProvider>
      <div className="flex h-screen bg-[#061620] overflow-hidden">
        {/* Sidebar */}
        <GovSidebar className="hidden md:flex" />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Navbar */}
          <GovNavbar officer={officer} agency={agency} />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </GovToastProvider>
  )
}
