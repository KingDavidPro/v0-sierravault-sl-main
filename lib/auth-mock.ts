// =====================================================
// SierraVault Auth Mock API
// =====================================================
// TODO: Replace these mock functions with actual Supabase auth
// import { createBrowserClient } from '@supabase/ssr'
// const supabase = createBrowserClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// )
// =====================================================

// Mock citizen database
const mockCitizens = [
  {
    nin: "SL-19900101-001",
    personalId: "PID-001234",
    surname: "Conteh",
    name: "David",
    middleName: "Koroma",
    dob: "1990-01-01",
    phone: "+232761234567",
    password: "Password123",
  },
  {
    nin: "SL-19850505-112",
    personalId: "PID-005678",
    surname: "Koroma",
    name: "Fatmata",
    middleName: "Bangura",
    dob: "1985-05-05",
    phone: "+232769876543",
    password: "Password456",
  },
]

// Login attempt tracking (in real app, store in Redis/Supabase)
const loginAttempts: Record<string, { count: number; lastAttempt: number; lockedUntil: number | null }> = {}

export interface LoginResult {
  success: boolean
  error?: string
  lockoutMinutes?: number
  attemptsRemaining?: number
}

export interface SignupData {
  nin: string
  personalId: string
  surname: string
  name: string
  middleName: string
  dob: string
}

export interface SignupResult {
  success: boolean
  error?: string
  errorType?: "exists" | "mismatch" | "unknown"
  phone?: string
}

export interface OTPResult {
  success: boolean
  error?: string
}

export interface ForgotPasswordResult {
  success: boolean
  error?: string
  phone?: string
}

// Login function with attempt tracking and timeout logic
export async function login(nin: string, password: string): Promise<LoginResult> {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const now = Date.now()
  const attempts = loginAttempts[nin] || { count: 0, lastAttempt: 0, lockedUntil: null }

  // Check if account is locked
  if (attempts.lockedUntil && now < attempts.lockedUntil) {
    const remainingMs = attempts.lockedUntil - now
    const remainingMins = Math.ceil(remainingMs / 60000)
    const remainingHours = Math.ceil(remainingMs / 3600000)

    if (remainingMs > 3600000) {
      return {
        success: false,
        error: `Account locked. Please try again after ${remainingHours} hours.`,
        lockoutMinutes: remainingHours * 60,
      }
    }
    return {
      success: false,
      error: `Too many invalid attempts. Please try again after ${remainingMins} minutes.`,
      lockoutMinutes: remainingMins,
    }
  }

  // Find citizen
  const citizen = mockCitizens.find((c) => c.nin === nin)

  if (!citizen || citizen.password !== password) {
    attempts.count += 1
    attempts.lastAttempt = now

    // After 3 failed attempts: 5 min lockout
    if (attempts.count >= 3 && attempts.count < 4) {
      attempts.lockedUntil = now + 5 * 60 * 1000 // 5 minutes
      loginAttempts[nin] = attempts
      return {
        success: false,
        error: "Too many invalid attempts. Please try again after 5 minutes.",
        lockoutMinutes: 5,
      }
    }

    // After 4+ failed attempts: 24 hour lockout
    if (attempts.count >= 4) {
      attempts.lockedUntil = now + 24 * 60 * 60 * 1000 // 24 hours
      loginAttempts[nin] = attempts
      return {
        success: false,
        error:
          "Invalid login credentials. Your account has been locked for 24 hours for security. Please contact support or try again later.",
        lockoutMinutes: 24 * 60,
      }
    }

    loginAttempts[nin] = attempts
    return {
      success: false,
      error: "Invalid NIN or password.",
      attemptsRemaining: 3 - attempts.count,
    }
  }

  // Success - reset attempts
  delete loginAttempts[nin]
  return { success: true }
}

// Signup validation
export async function validateSignup(data: SignupData): Promise<SignupResult> {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Check if account already exists
  const existingCitizen = mockCitizens.find((c) => c.nin === data.nin)
  if (existingCitizen && existingCitizen.personalId === data.personalId) {
    return {
      success: false,
      error: "Account already exists with this NIN. Please sign in.",
      errorType: "exists",
    }
  }

  // In real implementation, validate against government NIN database
  // Mock validation: check if NIN format is correct
  const ninPattern = /^SL-\d{8}-\d{3}$/
  if (!ninPattern.test(data.nin)) {
    return {
      success: false,
      error: "Information does not match. Please ensure all information entered is correct.",
      errorType: "mismatch",
    }
  }

  // Success - return phone number for OTP
  return {
    success: true,
    phone: "+232 76 *** **67", // Masked phone from NIN registry
  }
}

// Verify OTP
export async function verifyOTP(otp: string, expectedOtp = "1234"): Promise<OTPResult> {
  await new Promise((resolve) => setTimeout(resolve, 800))

  if (otp === expectedOtp) {
    return { success: true }
  }

  return {
    success: false,
    error: "Invalid OTP. Please enter the correct code.",
  }
}

// Forgot password - Step 1: Validate NIN
export async function forgotPasswordValidateNIN(nin: string): Promise<ForgotPasswordResult> {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const citizen = mockCitizens.find((c) => c.nin === nin)
  if (!citizen) {
    return {
      success: false,
      error: "NIN not found. Please check and try again.",
    }
  }

  return {
    success: true,
    phone: "+232 76 *** **" + citizen.phone.slice(-2), // Masked phone
  }
}

// Reset password
export async function resetPassword(nin: string, newPassword: string): Promise<OTPResult> {
  await new Promise((resolve) => setTimeout(resolve, 800))

  // In real app, update password in Supabase
  return { success: true }
}

// Clear lockout (for testing/admin)
export function clearLockout(nin: string): void {
  delete loginAttempts[nin]
}
