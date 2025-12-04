"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Shield, ArrowLeft, Mail, Phone, Lock, Eye, EyeOff, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/lib/use-toast"

type Step = "identifier" | "validate" | "password" | "success"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showToast } = useToast()
  const [step, setStep] = useState<Step>("identifier")
  const [isLoading, setIsLoading] = useState(false)
  const [identifier, setIdentifier] = useState("")
  const [token, setToken] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Check if token is in URL (from reset link)
  useEffect(() => {
    const tokenParam = searchParams.get("token")
    if (tokenParam) {
      setToken(tokenParam)
      setStep("validate")
      // Auto-validate token
      const validateToken = async () => {
        setIsLoading(true)
        try {
          const response = await fetch("/api/auth/reset-validate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: tokenParam }),
          })

          const data = await response.json()

          if (!response.ok || !data.valid) {
            showToast("error", "Invalid Token", data.error || "Invalid or expired token.")
            setStep("identifier")
            setIsLoading(false)
            return
          }

          setStep("password")
          showToast("success", "Token Valid", "You can now set your new password.")
        } catch (error) {
          showToast("error", "Validation Failed", "An unexpected error occurred. Please try again.")
          setStep("identifier")
        } finally {
          setIsLoading(false)
        }
      }
      validateToken()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  // Step 1: Request reset token
  const handleIdentifierSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!identifier) {
      showToast("error", "Validation Error", "Please enter your email, phone, or NIN.")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/reset-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier }),
      })

      const data = await response.json()

      if (!response.ok) {
        showToast("error", "Request Failed", data.error || "An error occurred.")
        setIsLoading(false)
        return
      }

      showToast("success", "Reset Link Sent", data.message || "If an account exists, a reset link has been sent.")
      // Note: In production, user would receive link via email/SMS
      // For demo, we'll show a message
    } catch (error) {
      showToast("error", "Request Failed", "An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Step 2: Validate token
  const handleValidateToken = async (tokenToValidate?: string) => {
    const tokenValue = tokenToValidate || token
    if (!tokenValue) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/reset-validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: tokenValue }),
      })

      const data = await response.json()

      if (!response.ok || !data.valid) {
        showToast("error", "Invalid Token", data.error || "Invalid or expired token.")
        setStep("identifier")
        setIsLoading(false)
        return
      }

      setStep("password")
      showToast("success", "Token Valid", "You can now set your new password.")
    } catch (error) {
      showToast("error", "Validation Failed", "An unexpected error occurred. Please try again.")
      setStep("identifier")
    } finally {
      setIsLoading(false)
    }
  }

  // Step 3: Reset Password
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      showToast("error", "Missing Token", "Reset token is required.")
      return
    }

    if (password !== confirmPassword) {
      showToast("error", "Password Mismatch", "Passwords do not match.")
      return
    }

    if (password.length < 8) {
      showToast("error", "Password Too Short", "Password must be at least 8 characters.")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/reset-final", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword: password }),
      })

      const data = await response.json()

      if (!response.ok) {
        showToast("error", "Reset Failed", data.error || "An error occurred while resetting your password.")
        setIsLoading(false)
        return
      }

      showToast("success", "Password Reset", data.message || "Password updated successfully.")
      setStep("success")
    } catch (error) {
      showToast("error", "Reset Failed", "An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A2A43] via-[#0D1B2A] to-[#061b2e]" />

      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2DC5A0" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#2DC5A0" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g stroke="#2DC5A0" strokeWidth="0.5" strokeOpacity="0.3">
          <line x1="15%" y1="25%" x2="35%" y2="45%" />
          <line x1="65%" y1="55%" x2="85%" y2="35%" />
        </g>
        <g>
          <circle cx="15%" cy="25%" r="5" fill="url(#nodeGlow)" className="animate-pulse" />
          <circle
            cx="85%"
            cy="35%"
            r="5"
            fill="url(#nodeGlow)"
            className="animate-pulse"
            style={{ animationDelay: "0.5s" }}
          />
        </g>
      </svg>

      <div className="relative w-full max-w-md">
        {/* Back button */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2DC5A0]">
              <Shield className="h-5 w-5 text-[#0A2A43]" />
            </div>
            <span className="text-xl font-bold text-gray-800">
              Sierra<span className="text-[#2DC5A0]">Vault</span>
            </span>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {["identifier", "validate", "password"].map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === s || (step === "success" && i === 2)
                      ? "bg-[#2DC5A0] text-white"
                      : ["validate", "password", "success"].indexOf(step) > i
                        ? "bg-[#2DC5A0]/20 text-[#2DC5A0]"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {["validate", "password", "success"].indexOf(step) > i ? <CheckCircle className="h-4 w-4" /> : i + 1}
                </div>
                {i < 2 && (
                  <div
                    className={`w-8 h-0.5 ${
                      ["validate", "password", "success"].indexOf(step) > i ? "bg-[#2DC5A0]" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Request Reset */}
          {step === "identifier" && (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Forgot Password?</h1>
                <p className="mt-2 text-gray-500">Enter your email, phone, or NIN to reset your password</p>
              </div>

              <form onSubmit={handleIdentifierSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="identifier" className="text-gray-700">
                    Email, Phone, or NIN
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="identifier"
                      type="text"
                      placeholder="your.email@example.com, +232 76 123 4567, or NIN"
                      className="pl-10 h-12 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 rounded-lg focus:border-[#2DC5A0] focus:ring-[#2DC5A0]"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-[#2DC5A0] to-[#25a386] text-white hover:from-[#25a386] hover:to-[#2DC5A0] font-semibold rounded-lg shadow-lg shadow-[#2DC5A0]/30"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </>
          )}

          {/* Step 2: Validate Token (usually auto-handled from URL) */}
          {step === "validate" && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#2DC5A0]/10">
                <Lock className="h-7 w-7 text-[#2DC5A0]" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Validating Token</h1>
              <p className="mt-2 text-gray-500">Please wait while we validate your reset token...</p>
            </div>
          )}

          {/* Step 3: New Password */}
          {step === "password" && (
            <>
              <div className="text-center mb-6">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#2DC5A0]/10">
                  <Lock className="h-7 w-7 text-[#2DC5A0]" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Create New Password</h1>
                <p className="mt-2 text-gray-500">Enter your new password below</p>
              </div>

              {!token && (
                <div className="mb-6 p-4 rounded-lg bg-amber-50 border border-amber-200 flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                  <p className="text-sm font-medium text-amber-800">
                    No reset token found. Please use the reset link sent to your email/phone.
                  </p>
                </div>
              )}

              <form onSubmit={handlePasswordReset} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="pl-10 pr-10 h-12 bg-gray-50 border-gray-200 text-gray-800 rounded-lg focus:border-[#2DC5A0] focus:ring-[#2DC5A0]"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="pl-10 h-12 bg-gray-50 border-gray-200 text-gray-800 rounded-lg focus:border-[#2DC5A0] focus:ring-[#2DC5A0]"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-[#2DC5A0] to-[#25a386] text-white hover:from-[#25a386] hover:to-[#2DC5A0] font-semibold rounded-lg shadow-lg shadow-[#2DC5A0]/30"
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            </>
          )}

          {/* Success */}
          {step === "success" && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#2DC5A0]/10">
                <CheckCircle className="h-8 w-8 text-[#2DC5A0]" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Password Reset!</h1>
              <p className="mt-2 text-gray-500">Your password has been successfully reset.</p>
              <Link href="/login">
                <Button className="mt-6 bg-gradient-to-r from-[#2DC5A0] to-[#25a386] text-white hover:from-[#25a386] hover:to-[#2DC5A0] font-semibold rounded-lg">
                  Return to Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
