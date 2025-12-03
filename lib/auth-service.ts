import { mockUsers, mockGovUsers } from "./auth-mock-data"

export interface AuthResponse {
  success: boolean
  error?: string
  user?: any
  requiresOtp?: boolean
  sessionId?: string
}

// Track login attempts (in-memory for demo)
const loginAttempts: Record<string, { count: number; lockedUntil?: number }> = {}

export const authService = {
  // User Login
  login: async (identifier: string, password: string, nin?: string): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay

    // Check lockout
    const attemptKey = identifier.toLowerCase()
    const attempts = loginAttempts[attemptKey]

    if (attempts?.lockedUntil && Date.now() < attempts.lockedUntil) {
      const remainingMinutes = Math.ceil((attempts.lockedUntil - Date.now()) / 60000)
      return {
        success: false,
        error:
          remainingMinutes > 60
            ? "Account locked for 24 hours due to multiple failed attempts"
            : `Too many attempts. Try again in ${remainingMinutes} minutes.`,
      }
    }

    // Find user by email or phone
    const user = mockUsers.find(
      (u) => (u.email.toLowerCase() === identifier.toLowerCase() || u.phone === identifier) && u.password === password,
    )

    if (user) {
      // Reset attempts on success
      delete loginAttempts[attemptKey]
      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          nin: user.nin,
        },
        requiresOtp: true,
        sessionId: `session_${Date.now()}`,
      }
    }

    // Failed login - track attempts
    if (!attempts) {
      loginAttempts[attemptKey] = { count: 1 }
    } else {
      attempts.count++
    }

    const currentAttempts = loginAttempts[attemptKey].count

    if (currentAttempts >= 4) {
      // 24-hour lockout
      loginAttempts[attemptKey].lockedUntil = Date.now() + 24 * 60 * 60 * 1000
      return {
        success: false,
        error: "Invalid login credentials. Please try again after 24 hours.",
      }
    } else if (currentAttempts === 3) {
      // 5-minute lockout
      loginAttempts[attemptKey].lockedUntil = Date.now() + 5 * 60 * 1000
      return {
        success: false,
        error: "Too many invalid attempts. Please try after 5 minutes.",
      }
    }

    return {
      success: false,
      error: `Invalid credentials. ${3 - currentAttempts} attempt${3 - currentAttempts !== 1 ? "s" : ""} remaining.`,
    }
  },

  // User Registration
  register: async (data: {
    email: string
    phone: string
    fullName: string
    password: string
    nin?: string
    dob?: string
    govId?: string
  }): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user exists
    const exists = mockUsers.find((u) => u.email === data.email || u.phone === data.phone)

    if (exists) {
      return {
        success: false,
        error: "An account already exists with this NIN. Please sign in.",
      }
    }

    // Success - in real app, would create user and send OTP
    return {
      success: true,
      requiresOtp: true,
      sessionId: `register_${Date.now()}`,
    }
  },

  // Verify OTP
  verifyOtp: async (sessionId: string, otp: string): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock: Accept any 4-digit or 6-digit OTP for demo
    if (otp.match(/^\d{4}$/) || otp.match(/^\d{6}$/)) {
      return {
        success: true,
        user: { id: "demo_user", name: "Demo User" },
      }
    }

    return {
      success: false,
      error: "Invalid OTP. Please check and try again.",
    }
  },

  // Forgot Password
  forgotPassword: async (identifier: string): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = mockUsers.find((u) => u.email === identifier || u.phone === identifier)

    if (!user) {
      return {
        success: false,
        error: "No account found with this email/phone.",
      }
    }

    return {
      success: true,
      requiresOtp: true,
      sessionId: `reset_${Date.now()}`,
    }
  },

  // Reset Password
  resetPassword: async (sessionId: string, newPassword: string): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (newPassword.length < 8) {
      return {
        success: false,
        error: "Password must be at least 8 characters.",
      }
    }

    return {
      success: true,
    }
  },

  // Government Login
  govLogin: async (govNin: string, accessCode: string, password: string): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const govUser = mockGovUsers.find(
      (u) => u.govNin === govNin && u.accessCode === accessCode && u.password === password,
    )

    if (govUser) {
      return {
        success: true,
        user: {
          id: govUser.id,
          name: govUser.name,
          role: govUser.role,
          agency: govUser.agency,
        },
        requiresOtp: true,
        sessionId: `gov_session_${Date.now()}`,
      }
    }

    return {
      success: false,
      error: "Invalid government credentials.",
    }
  },
}
