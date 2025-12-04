"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Shield, Eye, EyeOff, Lock, Mail, Phone, CreditCard, AlertTriangle, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/lib/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.identifier || !formData.password) {
      showToast("error", "Validation Error", "Please enter your identifier and password.")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: formData.identifier,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        showToast("error", "Login Failed", data.error || "Invalid login credentials.")
        setIsLoading(false)
        return
      }

      // Store token and user data
      if (data.token) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
      }

      showToast("success", "Login Successful", "Welcome back!")
      
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } catch (error) {
      showToast("error", "Login Failed", "An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

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
          <div className="relative lg:w-1/2 p-8 lg:p-12 bg-gradient-to-br from-[#0A2A43] to-[#0D1B2A] flex flex-col justify-center min-h-[300px] lg:min-h-[600px]">
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
                <Link href="/register">
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

              {/* AI Voice Button */}
              <div className="mt-8">
                <Button
                  type="button"
                  variant="outline"
                  className="border-[#2DC5A0]/50 text-[#2DC5A0] hover:bg-[#2DC5A0]/10 bg-transparent gap-2"
                  onClick={() => alert("AI Voice Assistant coming soon! Support for Krio & English.")}
                >
                  <Mic className="h-4 w-4" />
                  AI Voice (Krio/English)
                </Button>
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
              <p className="text-gray-500 text-center mb-6">Sign in to your account</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Identifier (Email, Phone, or NIN) */}
                <div className="space-y-1">
                  <Label htmlFor="identifier" className="text-gray-700 text-sm">
                    Email, Phone, or NIN
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="identifier"
                      type="text"
                      placeholder="your.email@example.com, +232 76 123 4567, or NIN"
                      className="pl-11 h-12 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 rounded-lg focus:border-[#2DC5A0] focus:ring-[#2DC5A0]"
                      value={formData.identifier}
                      onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <Label htmlFor="password" className="text-gray-700 text-sm">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-11 pr-11 h-12 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 rounded-lg focus:border-[#2DC5A0] focus:ring-[#2DC5A0]"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-[#2DC5A0] to-[#25a386] text-white hover:from-[#25a386] hover:to-[#2DC5A0] font-semibold rounded-lg shadow-lg shadow-[#2DC5A0]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-6 text-center space-y-3">
                <p className="text-sm text-gray-600">
                  <Link href="/forgot-password" className="text-[#2DC5A0] hover:text-[#25a386] transition-colors">
                    Forgot password? Retrieve using email or phone
                  </Link>
                </p>
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-[#2DC5A0] hover:text-[#25a386] font-medium transition-colors">
                    Register
                  </Link>
                </p>
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
