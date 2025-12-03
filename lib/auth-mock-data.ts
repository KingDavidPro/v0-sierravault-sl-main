// Mock user data for authentication (no Supabase)
export interface MockUser {
  id: string
  name: string
  email: string
  phone: string
  password: string
  nin?: string
  dob?: string
  govId?: string
}

export interface MockGovUser {
  id: string
  name: string
  govNin: string
  accessCode: string
  password: string
  role: string
  agency: string
  email: string
}

// Mock regular users
export const mockUsers: MockUser[] = [
  {
    id: "user_001",
    name: "David Conteh",
    email: "david@example.com",
    phone: "+232761234567",
    password: "password123",
    nin: "SL-19900101-001",
    dob: "1990-01-01",
  },
  {
    id: "user_002",
    name: "Fatmata Koroma",
    email: "fatmata@example.com",
    phone: "+232762345678",
    password: "password123",
    nin: "SL-19850505-112",
    dob: "1985-05-05",
  },
  {
    id: "user_003",
    name: "Tommy Sesay",
    email: "tommy@example.com",
    phone: "+232763456789",
    password: "password123",
  },
  // Demo user for testing
  {
    id: "demo_user",
    name: "Demo User",
    email: "demo@example.com",
    phone: "+232761234567",
    password: "password123",
    nin: "SL-19950303-999",
  },
]

// Mock government users
export const mockGovUsers: MockGovUser[] = [
  {
    id: "gov_001",
    name: "Ayesha K. Bangura",
    govNin: "GOV-202511-445",
    accessCode: "SV-GOV-2025",
    password: "demo123",
    role: "GOV_ADMIN",
    agency: "agency_moi",
    email: "ayesha.b@moi.gov.sl",
  },
  {
    id: "gov_002",
    name: "Tommy Sesay",
    govNin: "GOV-202511-446",
    accessCode: "SV-GOV-2025",
    password: "demo123",
    role: "GOV_ISSUER",
    agency: "agency_land",
    email: "tommy.s@land.gov.sl",
  },
  {
    id: "gov_003",
    name: "Mariama Johnson",
    govNin: "GOV-202511-447",
    accessCode: "SV-GOV-2025",
    password: "demo123",
    role: "GOV_SUPERVISOR",
    agency: "agency_moi",
    email: "mariama.j@moi.gov.sl",
  },
]
