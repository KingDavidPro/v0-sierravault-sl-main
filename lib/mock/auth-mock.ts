// Mock authentication data - NO SUPABASE, NO EXTERNAL DB
// TODO: Replace with actual Supabase queries when backend is ready

export interface MockUser {
  id: string
  email: string
  phone: string
  nin?: string
  password: string
  firstName: string
  lastName: string
  dob?: string
  govId?: string
}

export interface MockGovUser {
  id: string
  govNIN: string
  accessCode: string
  password: string
  agencyId: string
  staffId: string
  role: string
}

export const mockUsers: MockUser[] = [
  {
    id: "user_001",
    email: "david@example.com",
    phone: "+232761234567",
    nin: "SL-19900101-001",
    password: "password123",
    firstName: "David",
    lastName: "Conteh",
    dob: "1990-01-01",
  },
  {
    id: "user_002",
    email: "fatmata@example.com",
    phone: "+232771234567",
    password: "password123",
    firstName: "Fatmata",
    lastName: "Koroma",
  },
]

export const mockGovUsers: MockGovUser[] = [
  {
    id: "gov_001",
    govNIN: "GOV-202511-445",
    accessCode: "SV-GOV-2025",
    password: "securepass",
    agencyId: "agency_moi",
    staffId: "GOV001",
    role: "GOV_ADMIN",
  },
  {
    id: "gov_002",
    govNIN: "GOV-202511-446",
    accessCode: "SV-GOV-2025",
    password: "securepass",
    agencyId: "agency_land",
    staffId: "GOV002",
    role: "GOV_ISSUER",
  },
]

export const mockAgencies = [
  { id: "agency_moi", name: "Ministry of Internal Affairs", code: "MOI" },
  { id: "agency_land", name: "Land Registry", code: "LAND" },
  { id: "agency_health", name: "Ministry of Health", code: "HEALTH" },
]

// Mock validation functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?232[0-9]{8,9}$/
  return phoneRegex.test(phone.replace(/\s/g, ""))
}

export const mockLogin = async (
  emailOrPhone: string,
  password: string,
  nin?: string,
): Promise<{ success: boolean; user?: MockUser; error?: string }> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = mockUsers.find((u) => (u.email === emailOrPhone || u.phone === emailOrPhone) && u.password === password)

  if (!user) {
    return { success: false, error: "Invalid credentials" }
  }

  if (nin && user.nin !== nin) {
    return { success: false, error: "NIN does not match account" }
  }

  return { success: true, user }
}

export const mockGovLogin = async (
  agencyId: string,
  staffId: string,
  password: string,
): Promise<{ success: boolean; user?: MockGovUser; error?: string }> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = mockGovUsers.find((u) => u.agencyId === agencyId && u.staffId === staffId && u.password === password)

  if (!user) {
    return { success: false, error: "Invalid government credentials" }
  }

  return { success: true, user }
}

export const mockRegister = async (
  data: Partial<MockUser>,
): Promise<{ success: boolean; user?: MockUser; error?: string }> => {
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Check if user already exists
  const exists = mockUsers.some((u) => u.email === data.email || u.phone === data.phone)

  if (exists) {
    return {
      success: false,
      error: "Account already exists with this email or phone",
    }
  }

  const newUser: MockUser = {
    id: `user_${Date.now()}`,
    email: data.email!,
    phone: data.phone!,
    password: data.password!,
    firstName: data.firstName!,
    lastName: data.lastName!,
    nin: data.nin,
    dob: data.dob,
    govId: data.govId,
  }

  mockUsers.push(newUser)

  return { success: true, user: newUser }
}

export const mockSendOTP = async (emailOrPhone: string): Promise<{ success: boolean; otp?: string }> => {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  // In production, this would send real OTP via SMS/Email
  // For mock, always return success with OTP "1234"
  console.log("[v0] Mock OTP sent to:", emailOrPhone, "OTP: 1234")
  return { success: true, otp: "1234" }
}

export const mockVerifyOTP = async (emailOrPhone: string, otp: string): Promise<{ success: boolean }> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  // Mock: accept "1234" or "123456" as valid OTPs
  return { success: otp === "1234" || otp === "123456" }
}

export const mockResetPassword = async (
  emailOrPhone: string,
  newPassword: string,
): Promise<{ success: boolean; error?: string }> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = mockUsers.find((u) => u.email === emailOrPhone || u.phone === emailOrPhone)

  if (!user) {
    return { success: false, error: "User not found" }
  }

  user.password = newPassword
  return { success: true }
}
