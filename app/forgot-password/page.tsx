"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Shield,
  ArrowLeft,
  CreditCard,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { forgotPasswordValidateNIN, verifyOTP, resetPassword } from "@/lib/auth-mock"

type Step = "nin" | "otp" | "password" | "success"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("nin")
  const [isLoading, setIsLoading] = useState(false)
  const [nin, setNin] = useState("")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState(["", "", "", ""])
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(300)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Countdown timer for OTP
  useEffect(() => {
    if (step === "otp" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      setCanResend(true)
    }
  }, [countdown, step])

  // Step 1: Validate NIN
  const handleNINSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const result = await forgotPasswordValidateNIN(nin)

    if (result.success) {
      setPhone(result.phone || "")
      setStep("otp")
      setCountdown(300)
    } else {
      setError(result.error || "NIN validation failed")
    }

    setIsLoading(false)
  }

  // OTP handling
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1)
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError(null)

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }

    if (value && index === 3) {
      const fullOtp = newOtp.join("")
      if (fullOtp.length === 4) {
        handleOTPVerify(fullOtp)
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Step 2: Verify OTP
  const handleOTPVerify = async (otpValue: string) => {
    setIsLoading(true)
    setError(null)

    const result = await verifyOTP(otpValue)

    if (result.success) {
      setStep("password")
    } else {
      setError(result.error || "Invalid OTP. Please enter the correct code.")
      setOtp(["", "", "", ""])
      inputRefs.current[0]?.focus()
    }

    setIsLoading(false)
  }

  // Step 3: Reset Password
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setIsLoading(true)

    const result = await resetPassword(nin, password)

    if (result.success) {
      setStep("success")
    } else {
      setError(result.error || "Password reset failed")
    }

    setIsLoading(false)
  }

  const handleResend = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    setCountdown(300)
    setCanResend(false)
  }

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
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
            {["nin", "otp", "password"].map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === s || (step === "success" && i === 2)
                      ? "bg-[#2DC5A0] text-white"
                      : ["otp", "password", "success"].indexOf(step) > i
                        ? "bg-[#2DC5A0]/20 text-[#2DC5A0]"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {["otp", "password", "success"].indexOf(step) > i ? <CheckCircle className="h-4 w-4" /> : i + 1}
                </div>
                {i < 2 && (
                  <div
                    className={`w-8 h-0.5 ${
                      ["otp", "password", "success"].indexOf(step) > i ? "bg-[#2DC5A0]" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          {/* Step 1: NIN */}
          {step === "nin" && (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Forgot Password?</h1>
                <p className="mt-2 text-gray-500">Enter your NIN to reset your password</p>
              </div>

              <form onSubmit={handleNINSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="nin" className="text-gray-700">
                    National Identification Number
                  </Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="nin"
                      type="text"
                      placeholder="SL-19900101-001"
                      className="pl-10 h-12 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 rounded-lg focus:border-[#2DC5A0] focus:ring-[#2DC5A0]"
                      value={nin}
                      onChange={(e) => setNin(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-[#2DC5A0] to-[#25a386] text-white hover:from-[#25a386] hover:to-[#2DC5A0] font-semibold rounded-lg shadow-lg shadow-[#2DC5A0]/30"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Continue"}
                </Button>
              </form>
            </>
          )}

          {/* Step 2: OTP */}
          {step === "otp" && (
            <>
              <div className="text-center mb-6">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#2DC5A0]/10">
                  <Phone className="h-7 w-7 text-[#2DC5A0]" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Verify OTP</h1>
                <p className="mt-2 text-gray-500">
                  Enter the 4-digit code sent to <span className="font-medium text-gray-700">{phone}</span>
                </p>
              </div>

              <div className="flex justify-center gap-3 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={isLoading}
                    className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-800 focus:border-[#2DC5A0] focus:ring-2 focus:ring-[#2DC5A0]/20 focus:outline-none"
                  />
                ))}
              </div>

              {isLoading && (
                <div className="flex items-center justify-center gap-2 text-gray-500 mb-4">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Verifying...</span>
                </div>
              )}

              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Didn't receive the code?</p>
                {canResend ? (
                  <Button variant="ghost" className="text-[#2DC5A0]" onClick={handleResend} disabled={isLoading}>
                    Resend code
                  </Button>
                ) : (
                  <p className="text-sm text-gray-500">
                    Resend in <span className="text-[#2DC5A0] font-medium">{formatCountdown(countdown)}</span>
                  </p>
                )}
              </div>
            </>
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
