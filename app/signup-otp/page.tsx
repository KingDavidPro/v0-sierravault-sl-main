"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Phone, RefreshCw, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { verifyOTP } from "@/lib/auth-mock"

export default function SignupOTPPage() {
  const router = useRouter()
  const [otp, setOtp] = useState(["", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(300) // 5 minutes
  const [canResend, setCanResend] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [phone, setPhone] = useState("+232 76 *** **67")
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Get phone from session storage
    const signupData = sessionStorage.getItem("signupData")
    if (signupData) {
      const data = JSON.parse(signupData)
      if (data.phone) setPhone(data.phone)
    }
  }, [])

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1)
    }

    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError(null)

    // Auto-focus next input
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
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split("").concat(["", "", "", ""]).slice(0, 4)
      setOtp(newOtp)
      if (newOtp.join("").length === 4) {
        handleVerify(newOtp.join(""))
      }
    }
  }

  const handleVerify = async (otpValue: string) => {
    setIsLoading(true)
    setError(null)

    const result = await verifyOTP(otpValue)

    if (result.success) {
      sessionStorage.removeItem("signupData")
      router.push("/login")
    } else {
      setError(result.error || "Invalid OTP")
      setOtp(["", "", "", ""])
      inputRefs.current[0]?.focus()
    }

    setIsLoading(false)
  }

  const handleResend = async () => {
    setIsResending(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsResending(false)
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
          <line x1="20%" y1="30%" x2="40%" y2="50%" />
          <line x1="60%" y1="20%" x2="80%" y2="40%" />
        </g>
        <g>
          <circle cx="20%" cy="30%" r="5" fill="url(#nodeGlow)" className="animate-pulse" />
          <circle
            cx="80%"
            cy="40%"
            r="5"
            fill="url(#nodeGlow)"
            className="animate-pulse"
            style={{ animationDelay: "0.5s" }}
          />
        </g>
      </svg>

      {/* Main card */}
      <div className="relative w-full max-w-md">
        {/* Back button */}
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to registration
        </Link>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#2DC5A0]/10">
              <Phone className="h-8 w-8 text-[#2DC5A0]" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Verify Your Phone</h1>
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

          {/* OTP Input */}
          <div className="flex justify-center gap-3 mb-8" onPaste={handlePaste}>
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
                className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-800 focus:border-[#2DC5A0] focus:ring-2 focus:ring-[#2DC5A0]/20 focus:outline-none transition-all disabled:opacity-50"
              />
            ))}
          </div>

          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-gray-500 mb-6">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Verifying...</span>
            </div>
          )}

          {/* Resend */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Didn't receive the code?</p>
            {canResend ? (
              <Button
                variant="ghost"
                className="text-[#2DC5A0] hover:text-[#25a386]"
                onClick={handleResend}
                disabled={isResending}
              >
                {isResending ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Resending...
                  </>
                ) : (
                  "Resend code"
                )}
              </Button>
            ) : (
              <p className="text-sm text-gray-500">
                Resend code in <span className="text-[#2DC5A0] font-medium">{formatCountdown(countdown)}</span>
              </p>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">The code expires in 10 minutes. Check your SMS inbox.</p>
      </div>
    </div>
  )
}
