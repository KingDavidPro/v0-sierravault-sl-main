// Mock authentication data and service (NO SUPABASE - CLIENT-SIDE ONLY)
// TODO: Replace with real backend API calls

export interface MockUser {
  id: string
  email: string
  phone: string
  nin?: string
  password: string
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  role: "user" | "government"
}

export interface MockGovUser {
  id: string
  govNIN: string
  accessCode: string
  password: string
  staffId: string
  agency: string
  role: "government"
}

// Mock user database
export const mockUsers: MockUser[] = [
  {
    id: "user_001",
    email: "david@example.com",
    phone: "+232761234567",
    nin: "SL-19900101-001",
    password: "password123",
    firstName: "David",
    lastName: "Conteh",
    role: "user",
  },
  {
    id: "user_002",
    email: "fatmata@example.com",
    phone: "+232771234568",
    nin: "SL-19920303-002",
    password: "password123",
    firstName: "Fatmata",
    lastName: "Sesay",
    role: "user",
  },
]

// Mock government users database
export const mockGovUsers: MockGovUser[] = [
  {
    id: "gov_001",
    govNIN: "GOV-202511-445",
    accessCode: "SV-GOV-2025",
    password: "securepass",
    staffId: "gov_001",
    agency: "agency_moi",
    role: "government",
  },
  {
    id: "gov_002",
    govNIN: "GOV-202511-446",
    accessCode: "SV-GOV-2025",
    password: "securepass",
    staffId: "gov_002",
    agency: "agency_land",
    role: "government",
  },
]

// Mock login attempt tracking (in-memory for demo)
const loginAttempts = new Map<string, { count: number; lockUntil?: number }>()

export class MockAuthService {
  // User login
  static async loginUser(
    emailOrPhone: string,
    password: string,
    nin?: string,
  ): Promise<{ success: boolean; user?: MockUser; error?: string }> {
    const now = Date.now()
    const attempts = loginAttempts.get(emailOrPhone) || { count: 0 }

    // Check if locked
    if (attempts.lockUntil && attempts.lockUntil > now) {
      const minutesLeft = Math.ceil((attempts.lockUntil - now) / 60000)
      return {
        success: false,
        error:
          minutesLeft > 60
            ? "Too many failed attempts. Please try again after 24 hours."
            : `Too many attempts. Try again in ${minutesLeft} minutes.`,
      }
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Find user
    const user = mockUsers.find(
      (u) => (u.email === emailOrPhone || u.phone === emailOrPhone) && u.password === password,
    )

    if (!user) {
      // Increment attempts
      attempts.count++

      if (attempts.count >= 3 && attempts.count < 5) {
        // 5 minute lockout
        attempts.lockUntil = now + 5 * 60 * 1000
        loginAttempts.set(emailOrPhone, attempts)
        return { success: false, error: "Too many attempts. Try again in 5 minutes." }
      } else if (attempts.count >= 5) {
        // 24 hour lockout
        attempts.lockUntil = now + 24 * 60 * 60 * 1000
        loginAttempts.set(emailOrPhone, attempts)
        return { success: false, error: "Invalid login credentials. Please try again after 24 hours." }
      }

      loginAttempts.set(emailOrPhone, attempts)
      return { success: false, error: "Invalid email/phone or password" }
    }

    // Reset attempts on success
    loginAttempts.delete(emailOrPhone)

    // Store in localStorage (mock session)
    if (typeof window !== "undefined") {
      localStorage.setItem("mock_user", JSON.stringify(user))
      localStorage.setItem("mock_token", `mock_token_${user.id}_${Date.now()}`)
    }

    return { success: true, user }
  }

  // Government login
  static async loginGov(
    agency: string,
    staffId: string,
    password: string,
  ): Promise<{ success: boolean; user?: MockGovUser; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 800))

    const user = mockGovUsers.find((u) => u.staffId === staffId && u.password === password && u.agency === agency)

    if (!user) {
      return { success: false, error: "Invalid credentials" }
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("mock_gov_user", JSON.stringify(user))
      localStorage.setItem("mock_token", `mock_gov_token_${user.id}_${Date.now()}`)
    }

    return { success: true, user }
  }

  // Register new user
  static async registerUser(data: Omit<MockUser, "id" | "role">): Promise<{ success: boolean; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const exists = mockUsers.find((u) => u.email === data.email || u.phone === data.phone)
    if (exists) {
      return { success: false, error: "Account already exists with this email or phone" }
    }

    // Add to mock database
    const newUser: MockUser = {
      ...data,
      id: `user_${Date.now()}`,
      role: "user",
    }
    mockUsers.push(newUser)

    return { success: true }
  }

  // Send OTP (mock)
  static async sendOTP(emailOrPhone: string): Promise<{ success: boolean; otp?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    // Mock OTP: always "123456" for demo
    return { success: true, otp: "123456" }
  }

  // Verify OTP (mock)
  static async verifyOTP(emailOrPhone: string, otp: string): Promise<{ success: boolean; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 800))
    if (otp === "123456") {
      return { success: true }
    }
    return { success: false, error: "Invalid OTP" }
  }

  // Reset password
  static async resetPassword(emailOrPhone: string, newPassword: string): Promise<{ success: boolean }> {
    await new Promise((resolve) => setTimeout(resolve, 800))
    const user = mockUsers.find((u) => u.email === emailOrPhone || u.phone === emailOrPhone)
    if (user) {
      user.password = newPassword
    }
    return { success: true }
  }

  // Get current user
  static getCurrentUser(): MockUser | MockGovUser | null {
    if (typeof window === "undefined") return null
    const userStr = localStorage.getItem("mock_user") || localStorage.getItem("mock_gov_user")
    return userStr ? JSON.parse(userStr) : null
  }

  // Logout
  static logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("mock_user")
      localStorage.removeItem("mock_gov_user")
      localStorage.removeItem("mock_token")
    }
  }
}
