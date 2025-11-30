"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Shield, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/features", label: "Features" },
  { href: "/verify", label: "Verify Document" },
]

interface NavbarProps {
  isLoggedIn?: boolean
  userName?: string
}

export function Navbar({ isLoggedIn = false, userName }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A2A43]/90 backdrop-blur-md border-b border-white/5">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal shadow-lg shadow-teal/20">
            <Shield className="h-5 w-5 text-[#0A2A43]" />
          </div>
          <span className="text-xl font-bold text-white">
            Sierra<span className="text-teal">Vault</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-300 transition-colors hover:text-teal"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden lg:flex lg:items-center lg:gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-gray-300 hover:text-teal hover:bg-transparent">
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-2 rounded-full bg-[#0D1B2A] px-3 py-1.5 border border-white/10">
                <div className="h-7 w-7 rounded-full bg-teal flex items-center justify-center">
                  <span className="text-xs font-semibold text-[#0A2A43]">{userName?.charAt(0) || "U"}</span>
                </div>
                <span className="text-sm font-medium text-white">{userName}</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-gray-300 hover:text-teal hover:bg-transparent">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-teal text-[#0A2A43] hover:bg-teal-light font-semibold shadow-lg shadow-teal/20">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden rounded-md p-2 text-gray-300 hover:bg-white/10"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">Toggle menu</span>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 bg-[#0D1B2A]/95 backdrop-blur-md",
          mobileMenuOpen ? "max-h-96" : "max-h-0",
        )}
      >
        <div className="space-y-1 px-4 pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-lg px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/10 hover:text-teal"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 space-y-2">
            {isLoggedIn ? (
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-teal text-[#0A2A43] hover:bg-teal-light font-semibold">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white bg-transparent hover:bg-white/10"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-teal text-[#0A2A43] hover:bg-teal-light font-semibold">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
