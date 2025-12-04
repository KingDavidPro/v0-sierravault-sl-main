"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Shield,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
  Calendar,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  Info,
  Mic,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/lib/use-toast"

export default function RegisterPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    telephone: "",
    password: "",
    confirmPassword: "",
    // Optional NIN fields
    nin: "",
    surname: "",
    dob: "",
    dateOfExpiry: "",
    personalIdNumber: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.email || !formData.telephone || !formData.password) {
      showToast("error", "Validation Error", "Email, telephone and password are required.")
      return
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      showToast("error", "Password Mismatch", "Passwords do not match.")
      return
    }

    // Validate password strength
    if (formData.password.length < 8) {
      showToast("error", "Password Too Short", "Password must be at least 8 characters.")
      return
    }

    // If NIN is provided, validate all NIN fields are present
    if (formData.nin) {
      if (!formData.surname || !formData.dob || !formData.dateOfExpiry || !formData.personalIdNumber) {
        showToast("error", "NIN Verification Required", "Complete NIN verification details are required when NIN is provided.")
        return
      }
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          telephone: formData.telephone,
          nin: formData.nin || undefined,
          surname: formData.surname || undefined,
          dob: formData.dob || undefined,
          dateOfExpiry: formData.dateOfExpiry || undefined,
          personalIdNumber: formData.personalIdNumber || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        showToast("error", "Registration Failed", data.error || "An error occurred during registration.")
        setIsLoading(false)
        return
      }

      // Store token and user data
      if (data.token) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
      }

      showToast("success", "Registration Successful", "Your account has been created successfully.")
      
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } catch (error) {
      showToast("error", "Registration Failed", "An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 py-8">
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
      <div className="relative w-full max-w-5xl">
        <div className="flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl">
          {/* Left Panel */}
          <div className="relative lg:w-2/5 p-8 lg:p-10 bg-gradient-to-br from-[#0A2A43] to-[#0D1B2A] flex flex-col justify-center min-h-[200px] lg:min-h-[750px]">
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
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#2DC5A0]" />
                  <span>NIN optional - add later</span>
                </div>
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
                <p className="text-xs text-gray-400 mt-2">Need help? Use voice assistance</p>
              </div>
            </div>

            <div className="hidden lg:block absolute top-0 right-0 w-16 h-full">
              <div className="absolute inset-0 bg-gradient-to-b from-[#2DC5A0] via-[#2DC5A0] to-white transform skew-x-[-6deg] translate-x-8" />
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="lg:w-3/5 p-6 lg:p-10 bg-white flex flex-col justify-center overflow-y-auto max-h-[90vh] lg:max-h-none">
            <div className="max-w-md mx-auto w-full">
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Register</h2>
              <p className="text-gray-500 text-center mb-6">Create your secure account</p>


              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Required Fields Section */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-px flex-1 bg-gray-200" />
                    <span className="text-xs font-medium text-gray-500 uppercase">Required</span>
                    <div className="h-px flex-1 bg-gray-200" />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-gray-700 text-sm">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      className="pl-10 h-11 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 rounded-lg focus:border-[#2DC5A0] focus:ring-[#2DC5A0]"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <Label htmlFor="telephone" className="text-gray-700 text-sm">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="telephone"
                      type="tel"
                      placeholder="+232 76 123 4567"
                      className="pl-10 h-11 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 rounded-lg focus:border-[#2DC5A0] focus:ring-[#2DC5A0]"
                      value={formData.telephone}
                      onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Password fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="password" className="text-gray-700 text-sm">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Min 8 characters"
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
                      Confirm Password <span className="text-red-500">*</span>
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

                {/* Optional Fields Section */}
                <div className="space-y-1 pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-px flex-1 bg-gray-200" />
                    <span className="text-xs font-medium text-gray-400 uppercase">Optional</span>
                    <div className="h-px flex-1 bg-gray-200" />
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Adding NIN later will sync your government documents automatically.
                  </p>
                </div>

                {/* NIN (Optional) */}
                <div className="space-y-1">
                  <Label htmlFor="nin" className="text-gray-700 text-sm">
                    NIN <span className="text-gray-400 text-xs">(Optional)</span>
                  </Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="nin"
                      type="text"
                      placeholder="1RB9DEWZ"
                      className="pl-10 h-11 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 rounded-lg focus:border-[#2DC5A0] focus:ring-[#2DC5A0]"
                      value={formData.nin}
                      onChange={(e) => setFormData({ ...formData, nin: e.target.value })}
                    />
                  </div>
                  {formData.nin && (
                    <p className="text-xs text-amber-600 mt-1">
                      If NIN is provided, all verification fields below are required.
                    </p>
                  )}
                </div>

                {/* NIN Verification Fields (shown when NIN is provided) */}
                {formData.nin && (
                  <>
                    <div className="space-y-1">
                      <Label htmlFor="surname" className="text-gray-700 text-sm">
                        Surname <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          id="surname"
                          type="text"
                          placeholder="Conteh"
                          className="pl-10 h-11 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 rounded-lg focus:border-[#2DC5A0] focus:ring-[#2DC5A0]"
                          value={formData.surname}
                          onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                          required={!!formData.nin}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="dob" className="text-gray-700 text-sm">
                          Date of Birth <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <Input
                            id="dob"
                            type="date"
                            className="pl-10 h-11 bg-gray-50 border-gray-200 text-gray-800 rounded-lg focus:border-[#2DC5A0] focus:ring-[#2DC5A0]"
                            value={formData.dob}
                            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                            required={!!formData.nin}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="dateOfExpiry" className="text-gray-700 text-sm">
                          Date of Expiry <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <Input
                            id="dateOfExpiry"
                            type="date"
                            className="pl-10 h-11 bg-gray-50 border-gray-200 text-gray-800 rounded-lg focus:border-[#2DC5A0] focus:ring-[#2DC5A0]"
                            value={formData.dateOfExpiry}
                            onChange={(e) => setFormData({ ...formData, dateOfExpiry: e.target.value })}
                            required={!!formData.nin}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="personalIdNumber" className="text-gray-700 text-sm">
                        Personal ID Number <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          id="personalIdNumber"
                          type="text"
                          placeholder="PID123456"
                          className="pl-10 h-11 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 rounded-lg focus:border-[#2DC5A0] focus:ring-[#2DC5A0]"
                          value={formData.personalIdNumber}
                          onChange={(e) => setFormData({ ...formData, personalIdNumber: e.target.value })}
                          required={!!formData.nin}
                        />
                      </div>
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-[#2DC5A0] to-[#25a386] text-white hover:from-[#25a386] hover:to-[#2DC5A0] font-semibold rounded-lg shadow-lg shadow-[#2DC5A0]/30 transition-all duration-300 mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
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
