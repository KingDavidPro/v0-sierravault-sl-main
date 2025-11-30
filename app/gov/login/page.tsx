"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Shield, Loader2, AlertTriangle, HelpCircle, ChevronDown, User, Lock } from "lucide-react"
import { govAuthLogin } from "@/lib/gov-api-mock"
import { mockAgencies } from "@/lib/gov-mock-data"

export default function GovLoginPage() {
  const router = useRouter()
  const [agencyId, setAgencyId] = useState("")
  const [staffId, setStaffId] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null)
  const [isLocked, setIsLocked] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!agencyId || !staffId || !password) {
      setError("All fields are required")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await govAuthLogin({
        agencyId,
        staffId,
        password,
      })

      if (response.success && response.sendOtp) {
        sessionStorage.setItem("gov_temp_session", response.sessionTempId || "")
        sessionStorage.setItem("gov_staff_id", staffId)
        router.push("/gov/verify-otp")
      } else {
        setError(response.error || "Login failed")
        if (response.attemptsRemaining !== undefined) {
          setAttemptsRemaining(response.attemptsRemaining)
        }
        if (response.requiresUnlock) {
          setIsLocked(true)
        }
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A2A43] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Network Pattern */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2DC5A0" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#2DC5A0" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Network Lines */}
          <g stroke="#2DC5A0" strokeWidth="0.5" opacity="0.3">
            <line x1="100" y1="200" x2="300" y2="150" />
            <line x1="300" y1="150" x2="500" y2="250" />
            <line x1="500" y1="250" x2="700" y2="100" />
            <line x1="700" y1="100" x2="900" y2="200" />
            <line x1="150" y1="400" x2="350" y2="350" />
            <line x1="350" y1="350" x2="550" y2="450" />
            <line x1="550" y1="450" x2="750" y2="300" />
            <line x1="200" y1="600" x2="400" y2="550" />
            <line x1="400" y1="550" x2="600" y2="650" />
            <line x1="600" y1="650" x2="800" y2="500" />
            <line x1="100" y1="800" x2="300" y2="750" />
            <line x1="300" y1="750" x2="500" y2="850" />
            <line x1="500" y1="850" x2="700" y2="700" />
            <line x1="700" y1="700" x2="900" y2="800" />
            {/* Cross connections */}
            <line x1="300" y1="150" x2="350" y2="350" />
            <line x1="500" y1="250" x2="550" y2="450" />
            <line x1="700" y1="100" x2="750" y2="300" />
            <line x1="350" y1="350" x2="400" y2="550" />
            <line x1="550" y1="450" x2="600" y2="650" />
            <line x1="400" y1="550" x2="500" y2="850" />
            <line x1="600" y1="650" x2="700" y2="700" />
          </g>
          {/* Network Nodes */}
          <g fill="url(#nodeGlow)">
            <circle cx="100" cy="200" r="8" />
            <circle cx="300" cy="150" r="6" />
            <circle cx="500" cy="250" r="10" />
            <circle cx="700" cy="100" r="7" />
            <circle cx="900" cy="200" r="5" />
            <circle cx="150" cy="400" r="6" />
            <circle cx="350" cy="350" r="9" />
            <circle cx="550" cy="450" r="7" />
            <circle cx="750" cy="300" r="8" />
            <circle cx="200" cy="600" r="5" />
            <circle cx="400" cy="550" r="8" />
            <circle cx="600" cy="650" r="6" />
            <circle cx="800" cy="500" r="9" />
            <circle cx="100" cy="800" r="7" />
            <circle cx="300" cy="750" r="6" />
            <circle cx="500" cy="850" r="8" />
            <circle cx="700" cy="700" r="5" />
            <circle cx="900" cy="800" r="7" />
          </g>
        </svg>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#2DC5A0]/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#0d3a5c]/50 rounded-full blur-[150px]" />

      {/* Main Card Container */}
      <div className="relative z-10 w-full max-w-[900px] flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl">
        {/* Left Panel - Welcome Section */}
        <div className="relative lg:w-[45%] bg-gradient-to-br from-[#0A2A43] to-[#0d3a5c] p-8 lg:p-10 flex flex-col justify-center">
          {/* Diagonal Accent - Hidden on mobile, shown on lg */}
          <div className="hidden lg:block absolute top-0 right-0 w-16 h-full">
            <svg className="h-full w-full" viewBox="0 0 100 400" preserveAspectRatio="none">
              <polygon points="100,0 100,400 0,400" fill="#ffffff" />
              <polygon points="85,0 100,0 100,400 70,400" fill="#2DC5A0" />
            </svg>
          </div>

          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#2DC5A0]/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#2DC5A0]" />
            </div>
            <div>
              <span className="text-white font-bold text-lg">Sierra</span>
              <span className="text-[#2DC5A0] font-bold text-lg">Vault</span>
            </div>
          </div>

          {/* Welcome Text */}
          <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
            Welcome to
            <br />
            <span className="text-[#2DC5A0]">Sierra Vault</span>
          </h1>

          <p className="text-white/60 text-sm lg:text-base mb-8 max-w-xs">
            Your secure government portal for digital document management and verification
          </p>

          {/* Sierra Leone Flag Accent */}
          <div className="flex gap-1 h-2 w-24 rounded-full overflow-hidden mb-6">
            <div className="flex-1 bg-[#1EB53A]" />
            <div className="flex-1 bg-white" />
            <div className="flex-1 bg-[#0072C6]" />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link
              href="/"
              className="px-5 py-2.5 border border-white/30 text-white text-sm font-medium rounded-lg hover:bg-white/10 transition-colors"
            >
              Main Site
            </Link>
            <Link
              href="/gov/help"
              className="px-5 py-2.5 border border-white/30 text-white text-sm font-medium rounded-lg hover:bg-white/10 transition-colors"
            >
              Get Help
            </Link>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="lg:w-[55%] bg-white p-8 lg:p-10">
          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#0A2A43]">Government Login</h2>
            <p className="text-gray-500 text-sm mt-1">Sign in to your government account</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-600">{error}</p>
                {attemptsRemaining !== null && attemptsRemaining > 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    {attemptsRemaining} attempt{attemptsRemaining !== 1 ? "s" : ""} remaining
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Locked Alert */}
          {isLocked && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <Shield className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-600">Account Locked</p>
                <p className="text-xs text-amber-500 mt-1">Too many failed attempts. Contact IT support.</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Agency Select */}
            <div>
              <label htmlFor="agency" className="block text-sm font-medium text-gray-700 mb-2">
                Agency
              </label>
              <div className="relative">
                <select
                  id="agency"
                  value={agencyId}
                  onChange={(e) => setAgencyId(e.target.value)}
                  disabled={isLocked || loading}
                  className="w-full px-4 py-3 pl-11 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 appearance-none focus:outline-none focus:border-[#2DC5A0] focus:ring-2 focus:ring-[#2DC5A0]/20 disabled:opacity-50 transition-all"
                  aria-required="true"
                >
                  <option value="">Select your agency...</option>
                  {mockAgencies.map((agency) => (
                    <option key={agency.id} value={agency.id}>
                      {agency.name} ({agency.code})
                    </option>
                  ))}
                </select>
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Staff ID Input */}
            <div>
              <label htmlFor="staffId" className="block text-sm font-medium text-gray-700 mb-2">
                Staff ID
              </label>
              <div className="relative">
                <input
                  id="staffId"
                  type="text"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  placeholder="Enter your staff ID"
                  disabled={isLocked || loading}
                  className="w-full px-4 py-3 pl-11 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#2DC5A0] focus:ring-2 focus:ring-[#2DC5A0]/20 disabled:opacity-50 transition-all"
                  aria-required="true"
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <p className="mt-1 text-xs text-gray-400">Demo: gov_001, gov_002, gov_003</p>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLocked || loading}
                  className="w-full px-4 py-3 pl-11 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#2DC5A0] focus:ring-2 focus:ring-[#2DC5A0]/20 disabled:opacity-50 transition-all"
                  aria-required="true"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-400">Demo: demo123</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLocked || loading || !agencyId || !staffId || !password}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-[#2DC5A0] to-[#25a88a] hover:from-[#25a88a] hover:to-[#1e9277] text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#2DC5A0]/25"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Help Link */}
          <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-center gap-2">
            <HelpCircle className="w-4 h-4 text-gray-400" />
            <Link
              href="/gov/help"
              className="text-sm text-[#2DC5A0] hover:text-[#25a88a] font-medium transition-colors"
            >
              Need help? Contact IT Support
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Sparkle */}
      <div className="absolute bottom-6 right-6">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white/20">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="currentColor" />
        </svg>
      </div>
    </div>
  )
}
