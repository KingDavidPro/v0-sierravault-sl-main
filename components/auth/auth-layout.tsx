import type { ReactNode } from "react"
import Link from "next/link"
import { Shield } from "lucide-react"

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
  leftContent?: ReactNode
  showLogo?: boolean
  isGovPortal?: boolean
}

export function AuthLayout({
  children,
  title,
  subtitle,
  leftContent,
  showLogo = true,
  isGovPortal = false,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#061b2e] via-[#0A2A43] to-[#0D1B2A] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background network nodes */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-2 h-2 bg-[#2DC5A0] rounded-full animate-pulse" />
        <div className="absolute top-40 right-32 w-1.5 h-1.5 bg-[#2DC5A0] rounded-full animate-pulse delay-150" />
        <div className="absolute bottom-32 left-40 w-2 h-2 bg-[#2DC5A0] rounded-full animate-pulse delay-300" />
        <div className="absolute bottom-20 right-20 w-1.5 h-1.5 bg-[#2DC5A0] rounded-full animate-pulse delay-500" />
      </div>

      {/* Main container */}
      <div className="w-full max-w-5xl relative z-10">
        <div className="flex flex-col lg:flex-row bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/10">
          {/* Left panel - Branding */}
          <div className="lg:w-2/5 bg-gradient-to-br from-[#0A2A43] to-[#061b2e] p-8 lg:p-12 text-white relative">
            {/* Teal accent bar */}
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#2DC5A0] to-transparent" />

            {showLogo && (
              <Link href="/" className="inline-flex items-center gap-2 mb-8">
                <Shield className="w-8 h-8 text-[#2DC5A0]" />
                <span className="text-2xl font-bold">
                  Sierra<span className="text-[#2DC5A0]">Vault</span>
                </span>
              </Link>
            )}

            <div className="mt-12">
              <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">{title}</h1>
              {subtitle && <p className="text-white/70 text-lg mb-8 leading-relaxed">{subtitle}</p>}

              {leftContent || (
                <div className="space-y-4 mt-12">
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2DC5A0] mt-2" />
                    <p className="text-sm text-white/80">256-bit encryption</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2DC5A0] mt-2" />
                    <p className="text-sm text-white/80">Blockchain verification</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2DC5A0] mt-2" />
                    <p className="text-sm text-white/80">Government certified</p>
                  </div>
                  {!isGovPortal && (
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#2DC5A0] mt-2" />
                      <p className="text-sm text-white/80">NIN optional - add later</p>
                    </div>
                  )}
                </div>
              )}

              {isGovPortal && (
                <div className="mt-12 flex gap-3">
                  <Link
                    href="/"
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
                  >
                    Main Site
                  </Link>
                  <Link
                    href="/gov/help"
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
                  >
                    Get Help
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right panel - Form */}
          <div className="lg:w-3/5 p-8 lg:p-12 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
