"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Shield, ArrowLeft, Mail, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { OTPInput } from "@/components/otp-input"

export default function VerifyOTPPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  // TODO: Replace with actual OTP verification
  const handleOTPComplete = async (otp: string) => {
    setIsLoading(true)
    console.log("OTP entered:", otp)

    // Simulate verification
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Demo: redirect to dashboard
    router.push("/dashboard")
  }

  const handleResend = async () => {
    setIsResending(true)

    // Simulate resend
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsResending(false)
    setCountdown(60)
    setCanResend(false)
  }

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      {/* Back button */}
      <div className="p-4">
        <Link
          href="/register"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to registration
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal">
                <Shield className="h-6 w-6 text-navy-dark" />
              </div>
              <span className="text-2xl font-bold text-foreground">
                Sierra<span className="text-teal">Vault</span>
              </span>
            </Link>
          </div>

          {/* OTP Card */}
          <Card className="border-border bg-card p-6 sm:p-8">
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal/10">
                <Mail className="h-8 w-8 text-teal" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Check your email</h1>
              <p className="mt-2 text-muted-foreground">
                We sent a 6-digit code to <span className="text-foreground font-medium">david@example.com</span>
              </p>
            </div>

            <div className="space-y-6">
              <OTPInput length={6} onComplete={handleOTPComplete} disabled={isLoading} />

              {isLoading && <p className="text-center text-sm text-muted-foreground">Verifying...</p>}

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Didn&apos;t receive the code?</p>
                {canResend ? (
                  <Button
                    variant="ghost"
                    className="text-teal hover:text-teal-light"
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
                  <p className="text-sm text-muted-foreground">
                    Resend code in <span className="text-teal font-medium">{countdown}s</span>
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Help text */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Check your spam folder if you don&apos;t see the email.
            <br />
            Need help?{" "}
            <Link href="/contact" className="text-teal hover:underline">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
