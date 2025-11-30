"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Shield, Eye, EyeOff, Lock, User, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { login } from "@/lib/auth-mock"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    nin: "",
    password: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [lockoutMinutes, setLockoutMinutes] = useState<number | null>(null)
  const [countdown, setCountdown] = useState<number>(0)
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null)

  // Countdown timer for lockout
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && lockoutMinutes) {
      setLockoutMinutes(null)
      setError(null)
    }
  }, [countdown, lockoutMinutes])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const result = await login(formData.nin, formData.password)

    if (result.success) {
      // Success toast would be shown here
      router.push("/dashboard")
    } else {
      setError(result.error || "Login failed")
      if (result.lockoutMinutes) {
        setLockoutMinutes(result.lockoutMinutes)
        setCountdown(result.lockoutMinutes * 60)
      }
      if (result.attemptsRemaining !== undefined) {
        setAttemptsRemaining(result.attemptsRemaining)
      }
    }

    setIsLoading(false)
  }

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (mins >= 60) {
      const hours = Math.floor(mins / 60)
      const remainingMins = mins % 60
      return `${hours}h ${remainingMins}m`
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const isLocked = countdown > 0

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Background with network pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A2A43] via-[#0D1B2A] to-[#061b2e]" />

      {/* Animated network nodes background */}
      <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2DC5A0" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#2DC5A0" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g stroke="#2DC5A0" strokeWidth="0.5" strokeOpacity="0.3">
          <line x1="10%" y1="20%" x2="30%" y2="40%" />
          <line x1="30%" y1="40%" x2="20%" y2="70%" />
          <line x1="20%" y1="70%" x2="40%" y2="85%" />
          <line x1="70%" y1="15%" x2="85%" y2="35%" />
          <line x1="85%" y1="35%" x2="75%" y2="60%" />
          <line x1="75%" y1="60%" x2="90%" y2="80%" />
          <line x1="30%" y1="40%" x2="70%" y2="15%" />
          <line x1="20%" y1="70%" x2="75%" y2="60%" />
          <line x1="50%" y1="50%" x2="30%" y2="40%" />
          <line x1="50%" y1="50%" x2="75%" y2="60%" />
        </g>
        <g>
          <circle cx="10%" cy="20%" r="4" fill="url(#nodeGlow)" className="animate-pulse" />
          <circle
            cx="30%"
            cy="40%"
            r="6"
            fill="url(#nodeGlow)"
            className="animate-pulse"
            style={{ animationDelay: "0.5s" }}
          />
          <circle
            cx="20%"
            cy="70%"
            r="5"
            fill="url(#nodeGlow)"
            className="animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <circle
            cx="40%"
            cy="85%"
            r="4"
            fill="url(#nodeGlow)"
            className="animate-pulse"
            style={{ animationDelay: "1.5s" }}
          />
          <circle
            cx="70%"
            cy="15%"
            r="5"
            fill="url(#nodeGlow)"
            className="animate-pulse"
            style={{ animationDelay: "0.3s" }}
          />
          <circle
            cx="85%"
            cy="35%"
            r="4"
            fill="url(#nodeGlow)"
            className="animate-pulse"
            style={{ animationDelay: "0.8s" }}
          />
          <circle
            cx="75%"
            cy="60%"
            r="6"
            fill="url(#nodeGlow)"
            className="animate-pulse"
            style={{ animationDelay: "1.2s" }}
          />
          <circle
            cx="90%"
            cy="80%"
            r="4"
            fill="url(#nodeGlow)"
            className="animate-pulse"
            style={{ animationDelay: "0.6s" }}
          />
          <circle cx="50%" cy="50%" r="8" fill="url(#nodeGlow)" className="animate-pulse" />
        </g>
      </svg>

      {/* Main card container */}
      <div className="relative w-full max-w-4xl">
        <div className="flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl">
          {/* Left Panel - Navy with branding */}
          <div className="relative lg:w-1/2 p-8 lg:p-12 bg-gradient-to-br from-[#0A2A43] to-[#0D1B2A] flex flex-col justify-center min-h-[300px] lg:min-h-[500px]">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, #2DC5A0 1px, transparent 0)`,
                backgroundSize: "40px 40px",
              }}
            />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2DC5A0] shadow-lg shadow-[#2DC5A0]/20">
                  <Shield className="h-6 w-6 text-[#0A2A43]" />
                </div>
                <span className="text-2xl font-bold text-white">
                  Sierra<span className="text-[#2DC5A0]">Vault</span>
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Welcome to
                <br />
                <span className="text-[#2DC5A0]">Sierra Vault</span>
              </h1>

              <p className="text-gray-300 text-base lg:text-lg leading-relaxed mb-8 max-w-md">
                Your secure community for digital document management and verification
              </p>

              <div className="flex gap-3">
                <Link href="/signup">
                  <Button
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 bg-transparent px-6"
                  >
                    Sign up
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 bg-transparent px-6"
                  >
                    Sign in
                  </Button>
                </Link>
              </div>
            </div>

            {/* Diagonal accent */}
            <div className="hidden lg:block absolute top-0 right-0 w-16 h-full">
              <div className="absolute inset-0 bg-gradient-to-b from-[#2DC5A0] via-[#2DC5A0] to-white transform skew-x-[-6deg] translate-x-8" />
            </div>
          </div>

          {/* Right Panel - White form */}
          <div className="lg:w-1/2 p-8 lg:p-12 bg-white flex flex-col justify-center">
            <div className="max-w-sm mx-auto w-full">
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Login</h2>
              <p className="text-gray-500 text-center mb-8">Sign in to your account</p>

              {/* Error/Lockout Message */}
              {error && (
                <div
                  className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                    lockoutMinutes && lockoutMinutes >= 60
                      ? "bg-red-50 border border-red-200"
                      : lockoutMinutes
                        ? "bg-amber-50 border border-amber-200"
                        : "bg-red-50 border border-red-200"
                  }`}
                >
                  <AlertTriangle
                    className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                      lockoutMinutes && lockoutMinutes >= 60
                        ? "text-red-500"
                        : lockoutMinutes
                          ? "text-amber-500"
                          : "text-red-500"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        lockoutMinutes && lockoutMinutes >= 60
                          ? "text-red-800"
                          : lockoutMinutes
                            ? "text-amber-800"
                            : "text-red-800"
                      }`}
                    >
                      {error}
                    </p>
                    {isLocked && (
                      <p className="text-sm mt-1 text-gray-600">
                        Time remaining: <span className="font-mono font-bold">{formatCountdown(countdown)}</span>
                      </p>
                    )}
                    {attemptsRemaining !== null && attemptsRemaining > 0 && !isLocked && (
                      <p className="text-sm mt-1 text-gray-600">
                        {attemptsRemaining} attempt{attemptsRemaining !== 1 ? "s" : ""} remaining
                      </p>
                    )}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="NIN (e.g., SL-19900101-001)"
                    className="pl-11 h-12 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 rounded-lg focus:border-[#2DC5A0] focus:ring-[#2DC5A0]"
                    value={formData.nin}
                    onChange={(e) => setFormData({ ...formData, nin: e.target.value })}
                    disabled={isLocked}
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="pl-11 pr-11 h-12 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 rounded-lg focus:border-[#2DC5A0] focus:ring-[#2DC5A0]"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={isLocked}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-[#2DC5A0] to-[#25a386] text-white hover:from-[#25a386] hover:to-[#2DC5A0] font-semibold rounded-lg shadow-lg shadow-[#2DC5A0]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || isLocked}
                >
                  {isLoading ? "Signing In..." : isLocked ? "Account Locked" : "Sign In"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-500 text-sm mb-4">or continue with</p>
                <div className="flex justify-center gap-4">
                  <button className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center hover:opacity-90 transition-opacity">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </button>
                  <button className="w-10 h-10 rounded-full bg-[#1DA1F2] flex items-center justify-center hover:opacity-90 transition-opacity">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-4 text-sm">
                <Link href="/forgot-password" className="text-[#2DC5A0] hover:text-[#25a386] transition-colors">
                  Forgot password?
                </Link>
                <Link href="/signup" className="text-[#2DC5A0] hover:text-[#25a386] transition-colors">
                  Don't have an account? Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative sparkle */}
      <div className="absolute bottom-8 right-8 text-[#2DC5A0] opacity-50">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </div>
    </div>
  )
}
