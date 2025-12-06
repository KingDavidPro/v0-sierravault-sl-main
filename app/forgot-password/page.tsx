"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Shield,
  ArrowLeft,
  Mail,
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
import { useToast } from "@/lib/use-toast"

export default function ForgotPasswordClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [mode, setMode] = useState<"email" | "sms">("email")
  const [token, setToken] = useState<string | null>(null)

  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<"request" | "reset">("request")
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    const t = searchParams.get("token")
    if (t) {
      setToken(t)
      setStep("reset")
    }
  }, [searchParams])

  const handleRequestReset = async () => {
    try {
      setIsLoading(true)

      if (mode === "email" && !email) {
        toast({
          title: "Email Required",
          description: "Please enter your email address.",
          variant: "destructive",
        })
        return
      }

      if (mode === "sms" && !phone) {
        toast({
          title: "Phone Required",
          description: "Please enter your phone number.",
          variant: "destructive",
        })
        return
      }

      await new Promise((resolve) => setTimeout(resolve, 1500))
      setVerified(true)

      toast({
        title: "Verification Sent",
        description:
            mode === "email"
                ? "A password reset link has been sent to your email."
                : "A verification code has been sent to your phone.",
      })
    } catch {
      toast({
        title: "Request Failed",
        description: "Unable to process your request. Try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async () => {
    try {
      setIsLoading(true)

      if (!password || !confirmPassword) {
        toast({
          title: "Missing Fields",
          description: "Please enter and confirm your new password.",
          variant: "destructive",
        })
        return
      }

      if (password !== confirmPassword) {
        toast({
          title: "Password Mismatch",
          description: "Both passwords must match.",
          variant: "destructive",
        })
        return
      }

      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Password Reset Successful",
        description: "You can now log in with your new password.",
        variant: "default",
      })

      router.push("/login")
    } catch {
      toast({
        title: "Reset Failed",
        description: "Unable to reset password. Try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg border">
          <Link href="/login" className="flex items-center text-sm text-gray-500 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>

          <div className="flex flex-col items-center mb-6">
            <Shield className="w-12 h-12 text-blue-600 mb-2" />
            <h1 className="text-xl font-bold text-gray-900">Forgot Password</h1>
            <p className="text-center text-gray-500 text-sm mt-1">
              {step === "request"
                  ? "Choose a method to receive your password reset instructions."
                  : "Enter your new password to complete the reset."}
            </p>
          </div>

          {step === "request" && (
              <>
                <div className="flex justify-center gap-4 mb-6">
                  <button
                      onClick={() => setMode("email")}
                      className={`px-4 py-2 rounded-md text-sm flex items-center gap-2 border ${
                          mode === "email" ? "bg-blue-600 text-white" : "bg-white"
                      }`}
                  >
                    <Mail className="w-4 h-4" /> Email
                  </button>

                  <button
                      onClick={() => setMode("sms")}
                      className={`px-4 py-2 rounded-md text-sm flex items-center gap-2 border ${
                          mode === "sms" ? "bg-blue-600 text-white" : "bg-white"
                      }`}
                  >
                    <Phone className="w-4 h-4" /> SMS
                  </button>
                </div>

                {mode === "email" && (
                    <div className="mb-4">
                      <Label>Email</Label>
                      <Input
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                )}

                {mode === "sms" && (
                    <div className="mb-4">
                      <Label>Phone Number</Label>
                      <Input
                          type="text"
                          placeholder="Enter your phone number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                )}

                <Button
                    onClick={handleRequestReset}
                    disabled={isLoading}
                    className="w-full mt-2"
                >
                  {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                      "Send Reset Instructions"
                  )}
                </Button>

                {verified && (
                    <p className="text-green-600 text-sm flex items-center mt-3">
                      <CheckCircle className="w-4 h-4 mr-1" /> Verification sent!
                    </p>
                )}
              </>
          )}

          {step === "reset" && (
              <>
                <div className="mb-4">
                  <Label>New Password</Label>
                  <div className="relative">
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-2"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                      ) : (
                          <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <Label>Confirm Password</Label>
                  <Input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <Button
                    onClick={handleResetPassword}
                    disabled={isLoading}
                    className="w-full"
                >
                  {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                      "Reset Password"
                  )}
                </Button>
              </>
          )}
        </div>
      </div>
  )
}
