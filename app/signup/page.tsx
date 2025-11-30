"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Shield, Eye, EyeOff, Lock, Calendar, CreditCard, AlertTriangle, Info, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { validateSignup } from "@/lib/auth-mock"

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    nin: "",
    personalId: "",
    surname: "",
    name: "",
    middleName: "",
    dob: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState<{ message: string; type: string } | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError({ message: "Passwords do not match.", type: "mismatch" })
      return
    }

    setIsLoading(true)

    const result = await validateSignup({
      nin: formData.nin,
      personalId: formData.personalId,
      surname: formData.surname,
      name: formData.name,
      middleName: formData.middleName,
      dob: formData.dob,
    })

    if (result.success) {
      setSuccess(`An OTP code has been sent to the phone number registered with your NIN (${result.phone})`)
      // Store signup data in sessionStorage for OTP page
      sessionStorage.setItem("signupData", JSON.stringify({ ...formData, phone: result.phone }))
      setTimeout(() => {
        router.push("/signup-otp")
      }, 2000)
    } else {
      setError({ message: result.error || "Signup failed", type: result.errorType || "unknown" })
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 py-12">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A2A43] via-[#0D1B2A] to-[#061b2e]" />

      {/* Network pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2DC5A0" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#2DC5A0" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g stroke="#2DC5A0" strokeWidth="0.5" strokeOpacity="0.3">
          <line x1="10%" y1="20%" x2="30%" y2="40%" />
          <line x1="30%" y1="40%" x2="20%" y2="70%" />
          <line x1="70%" y1="15%" x2="85%" y2="35%" />
          <line x1="85%" y1="35%" x2="75%" y2="60%" />
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
        </g>
      </svg>

      {/* Main card */}
      <div className="relative w-full max-w-4xl">
        <div className="flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl">
          {/* Left Panel */}
          <div className="relative lg:w-2/5 p-8 lg:p-10 bg-gradient-to-br from-[#0A2A43] to-[#0D1B2A] flex flex-col justify-center min-h-[200px] lg:min-h-[700px]">
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

              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                Create Your
                <br />
                <span className="text-[#2DC5A0]">Secure Vault</span>
              </h1>

              <p className="text-gray-300 text-sm lg:text-base leading-relaxed mb-6">
                Join thousands of Sierra Leoneans protecting their vital documents with blockchain-backed security.
              </p>

              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#2DC5A0]" />
                  <span>256-bit encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#2DC5A0]" />
                  <span>Blockchain verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#2DC5A0]" />
                  <span>Government certified</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block absolute top-0 right-0 w-16 h-full">
              <div className="absolute inset-0 bg-gradient-to-b from-[#2DC5A0] via-[#2DC5A0] to-white transform skew-x-[-6deg] translate-x-8" />
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="lg:w-3/5 p-6 lg:p-10 bg-white flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Sign Up</h2>
              <p className="text-gray-500 text-center mb-6">Create your secure account</p>

              {/* Error Message */}
              {error && (
                <div
                  className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                    error.type === "exists"
                      ? "bg-blue-50 border border-blue-200"
                      : "bg-amber-50 border border-amber-200"
                  }`}
                >
                  {error.type === "exists" ? (
                    <Info className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0 text-amber-500" />
                  )}
                  <div>
                    <p
                      className={`text-sm font-medium ${error.type === "exists" ? "text-blue-800" : "text-amber-800"}`}
                    >
                      {error.message}
                    </p>
                    {error.type === "exists" && (
                      <Link href="/login" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
                        Go to login →
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-green-500" />
                  <p className="text-sm font-medium text-green-800">{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* NIN */}
                <div className="space-y-1">
                  <Label htmlFor="nin" className="text-gray-700 text-sm">
                    National Identification Number (NIN)
                  </Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="nin"
                      type="text"
                      placeholder="SL-19900101-001"
                      className="pl-10 h-11 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 rounded-lg focus:border-[#2DC5A0] focus:ring-[#2DC5A0]"
                      value={formData.nin}
                      onChange={(e) => setFormData({ ...formData, nin: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Personal ID */}
                <div className="space-y-1">
                  <Label htmlFor="personalId" className="text-gray-700 text-sm">
                    Personal ID Number
                  </Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="personalId"
                      type="text"
                      placeholder="PID-001234"
                      className="pl-10 h-11 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 rounded-lg focus:border-[#2DC5A0] focus:ring-[#2DC5A0]"
                      value={formData.personalId}
                      onChange={(e) => setFormData({ ...formData, personalId: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Name fields - 3 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="surname" className="text-gray-700 text-sm">
                      Surname
                    </Label>
                    <Input
                      id="surname"
                      type="text"
                      placeholder="Conteh"
                      className="h-11 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 rounded-lg focus:border-[#2DC5A0] focus:ring-[#2DC5A0]"
                      value={formData.surname}
                      onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="name" className="text-gray-700 text-sm">
                      First Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="David"
                      className="h-11 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 rounded-lg focus:border-[#2DC5A0] focus:ring-[#2DC5A0]"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="middleName" className="text-gray-700 text-sm">
                      Middle Name
                    </Label>
                    <Input
                      id="middleName"
                      type="text"
                      placeholder="Koroma"
                      className="h-11 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 rounded-lg focus:border-[#2DC5A0] focus:ring-[#2DC5A0]"
                      value={formData.middleName}
                      onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="space-y-1">
                  <Label htmlFor="dob" className="text-gray-700 text-sm">
                    Date of Birth
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="dob"
                      type="date"
                      className="pl-10 h-11 bg-gray-50 border-gray-200 text-gray-800 rounded-lg focus:border-[#2DC5A0] focus:ring-[#2DC5A0]"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Password fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="password" className="text-gray-700 text-sm">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create password"
                        className="pl-10 pr-10 h-11 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 rounded-lg focus:border-[#2DC5A0] focus:ring-[#2DC5A0]"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                  <div className="space-y-1">
                    <Label htmlFor="confirmPassword" className="text-gray-700 text-sm">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        className="pl-10 h-11 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 rounded-lg focus:border-[#2DC5A0] focus:ring-[#2DC5A0]"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-[#2DC5A0] to-[#25a386] text-white hover:from-[#25a386] hover:to-[#2DC5A0] font-semibold rounded-lg shadow-lg shadow-[#2DC5A0]/30 transition-all duration-300 mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-[#2DC5A0] hover:text-[#25a386] font-medium">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
