"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Shield, Loader2, AlertTriangle, RefreshCw, MapPin, ArrowLeft } from "lucide-react"
import { govAuthVerifyOtp, govAuthResendOtp } from "@/lib/gov-api-mock"
import { GovVaultBadge } from "@/components/gov/gov-vault-badge"

export default function GovVerifyOtpPage() {
  const router = useRouter()
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState("")
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [showSuspiciousModal, setShowSuspiciousModal] = useState(false)
  const [staffId, setStaffId] = useState("")
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Get staff ID from session
    const storedStaffId = sessionStorage.getItem("gov_staff_id")
    if (storedStaffId) {
      setStaffId(storedStaffId)
    }

    // Focus first input
    inputRefs.current[0]?.focus()
  }, [])

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError("")

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when complete
    if (value && index === 5) {
      const completeOtp = newOtp.join("")
      if (completeOtp.length === 6) {
        handleVerify(completeOtp)
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
    const pastedData = e.clipboardData.getData("text").slice(0, 6)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    pastedData.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char
    })
    setOtp(newOtp)

    if (pastedData.length === 6) {
      handleVerify(pastedData)
    }
  }

  const handleVerify = async (otpCode?: string) => {
    const code = otpCode || otp.join("")
    if (code.length !== 6) {
      setError("Please enter all 6 digits")
      return
    }

    setLoading(true)
    setError("")

    try {
      const sessionTempId = sessionStorage.getItem("gov_temp_session") || ""

      const response = await govAuthVerifyOtp({
        sessionTempId,
        otp: code,
        currentIp: "196.216.45.123", // Mock IP - in production, get from server
      })

      if (response.success) {
        // Store session token
        sessionStorage.setItem("gov_token", response.token || "")
        sessionStorage.setItem("gov_officer", JSON.stringify(response.officer))
        sessionStorage.setItem("gov_agency", JSON.stringify(response.agency))

        if (response.suspiciousLocation) {
          setShowSuspiciousModal(true)
        } else {
          router.push("/gov/dashboard")
        }
      } else {
        setError(response.error || "Verification failed")
        setOtp(["", "", "", "", "", ""])
        inputRefs.current[0]?.focus()
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return

    setResending(true)
    setError("")

    try {
      const sessionTempId = sessionStorage.getItem("gov_temp_session") || ""
      await govAuthResendOtp(sessionTempId)
      setCountdown(60)
      setCanResend(false)
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    } catch (err) {
      setError("Failed to resend code")
    } finally {
      setResending(false)
    }
  }

  const handleContinueAnyway = () => {
    setShowSuspiciousModal(false)
    router.push("/gov/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#061620] to-[#0A2A43]">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2DC5A0]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#2DC5A0]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back Link */}
        <Link
          href="/gov/login"
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Link>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <GovVaultBadge size="lg" />
            </div>
            <h1 className="text-2xl font-bold text-white">Verify Your Identity</h1>
            <p className="text-white/60 mt-2">Enter the 6-digit code sent to your registered email/phone</p>
            {staffId && <p className="text-sm text-[#2DC5A0] mt-2">Verifying: {staffId}</p>}
          </div>

          {/* Demo Notice */}
          <div className="mb-6 p-3 bg-[#2DC5A0]/10 border border-[#2DC5A0]/30 rounded-xl">
            <p className="text-sm text-[#2DC5A0] text-center">
              Demo: Use code <span className="font-mono font-bold">123456</span>
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* OTP Input */}
          <div className="flex justify-center gap-2 md:gap-3 mb-8" onPaste={handlePaste}>
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
                disabled={loading}
                className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-[#2DC5A0] focus:ring-2 focus:ring-[#2DC5A0]/50 disabled:opacity-50 transition-all"
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            onClick={() => handleVerify()}
            disabled={loading || otp.some((d) => !d)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#2DC5A0] hover:bg-[#2DC5A0]/90 text-[#0A2A43] font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                Verify & Continue
              </>
            )}
          </button>

          {/* Resend */}
          <div className="mt-6 text-center">
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={resending}
                className="inline-flex items-center gap-2 text-sm text-[#2DC5A0] hover:text-[#2DC5A0]/80 transition-colors disabled:opacity-50"
              >
                {resending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Resend Code
              </button>
            ) : (
              <p className="text-sm text-white/60">
                Resend code in <span className="text-white font-semibold">{countdown}s</span>
              </p>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <p className="text-center text-xs text-white/40 mt-6">
          This verification ensures secure access to government systems.
          <br />
          All login attempts are logged for security compliance.
        </p>
      </div>

      {/* Suspicious Location Modal */}
      {showSuspiciousModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-[#0A2A43] border border-amber-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Unusual Location Detected</h3>
                <p className="text-sm text-white/60">Additional verification may be required</p>
              </div>
            </div>

            <p className="text-sm text-white/70 mb-6">
              We detected a sign-in attempt from an unrecognized location or device. For your security, please confirm
              this is you.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSuspiciousModal(false)
                  router.push("/gov/login")
                }}
                className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Not Me - Sign Out
              </button>
              <button
                onClick={handleContinueAnyway}
                className="flex-1 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors"
              >
                Yes, It's Me
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
