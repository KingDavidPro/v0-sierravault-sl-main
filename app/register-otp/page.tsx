"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Shield, Phone, ArrowLeft, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function RegisterOTPPage() {
  const router = useRouter()
  const [otp, setOtp] = useState(["", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(300) // 5 minutes
  const [canResend, setCanResend] = useState(false)
  const [phone, setPhone] = useState("")
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Get registration data from sessionStorage
    const data = sessionStorage.getItem("registerData")
    if (data) {
      const parsed = JSON.parse(data)
      setPhone(parsed.phone || "+232 XX XXX XXXX")
    }
  }, [])

  // Countdown timer
  useEffect(() => {
    if (countdown > 0 && !success) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      setCanResend(true)
    }
  }, [countdown, success])

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

    // Auto-submit when complete
    if (value && index === 3) {
      const fullOtp = newOtp.join("")
      if (fullOtp.length === 4) {
        handleVerify(fullOtp)
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 4)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    for (let i = 0; i < pastedData.length && i < 4; i++) {
      newOtp[i] = pastedData[i]
    }
    setOtp(newOtp)

    if (pastedData.length === 4) {
      handleVerify(pastedData)
    }
  }

  const handleVerify = async (otpValue: string) => {
    setIsLoading(true)
    setError(null)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock validation - "1234" is correct
    if (otpValue === "1234") {
      setSuccess(true)
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } else {
      setError("Invalid OTP. Please enter the correct code.")
      setOtp(["", "", "", ""])
      inputRefs.current[0]?.focus()
    }

    setIsLoading(false)
  }

  const handleResend = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    setCountdown(300)
    setCanResend(false)
    setError(null)
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
          href="/register"
          className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to registration
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

          {success ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#2DC5A0]/10">
                <CheckCircle className="h-8 w-8 text-[#2DC5A0]" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Account Created!</h1>
              <p className="mt-2 text-gray-500">Your account has been successfully created.</p>
              <p className="mt-1 text-sm text-gray-400">Redirecting to login...</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#2DC5A0]/10">
                  <Phone className="h-7 w-7 text-[#2DC5A0]" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Verify Phone</h1>
                <p className="mt-2 text-gray-500">
                  Enter the 4-digit code sent to <span className="font-medium text-gray-700">{phone}</span>
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              )}

              <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
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
                    className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-800 focus:border-[#2DC5A0] focus:ring-2 focus:ring-[#2DC5A0]/20 focus:outline-none disabled:opacity-50"
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
        </div>
      </div>
    </div>
  )
}
