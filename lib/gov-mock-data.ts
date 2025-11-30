/**
 * SierraVault Government Portal - Mock Data
 *
 * README: Swapping Mocks for Real Endpoints
 * =========================================
 * 1. SUPABASE: Replace mock functions in gov-api-mock.ts with Supabase client calls
 *    - Set SUPABASE_SERVICE_ROLE_KEY for admin operations
 *    - Enable Row Level Security (RLS) policies for gov tables
 *    - Tables needed: gov_agencies, gov_officers, gov_documents, gov_audit_logs
 *
 * 2. SOLANA: Toggle BLOCKCHAIN_MODE in gov-api-mock.ts from 'mock' to 'real'
 *    - Set NEXT_PUBLIC_SOLANA_RPC_URL environment variable
 *    - Configure anchor program ID for document signing
 *    - See /lib/solana-config.ts for wallet setup
 *
 * 3. LLM: Add your AI provider key for document analysis
 *    - Set OPENAI_API_KEY or similar for OCR/analysis features
 */

export type GovRole = "GOV_ADMIN" | "GOV_ISSUER" | "GOV_SUPERVISOR" | "GOV_AUDITOR" | "GOV_READONLY"

export interface Agency {
  id: string
  name: string
  code: string
  parentAgencyId?: string
  createdAt: string
}

export interface GovOfficer {
  id: string
  name: string
  email: string
  phone: string
  role: GovRole
  agencyId: string
  status: "active" | "suspended" | "pending_invite"
  lastLogin?: string
  lastLoginIp?: string
  createdAt: string
  requires2FA: boolean
}

export interface PendingDocument {
  id: string
  docType: string
  citizenName: string
  nin: string
  uploadDate: string
  aiScore: number
  onChainHash?: string
  txId?: string
  status: "pending" | "needs_review" | "approved" | "rejected"
  ocrText?: string
  imageUrl?: string
  comments: DocumentComment[]
  submittedBy?: string
}

export interface DocumentComment {
  id: string
  authorId: string
  authorName: string
  text: string
  timestamp: string
}

export interface AuditLogEntry {
  id: string
  actorId: string
  actorName: string
  actorRole: GovRole
  action: string
  targetDocId?: string
  targetUserId?: string
  timestamp: string
  ip: string
  details: Record<string, unknown>
  agencyId: string
}

export interface RolePermission {
  roleId: GovRole
  permissions: {
    canViewPending: boolean
    canApprove: boolean
    canReject: boolean
    canIssue: boolean
    canManageUsers: boolean
    canManageRoles: boolean
    canViewAudit: boolean
    canExportData: boolean
    canManageSettings: boolean
  }
}

// Mock Data
export const mockAgencies: Agency[] = [
  {
    id: "agency_moi",
    name: "Ministry of Internal Affairs",
    code: "MOI",
    createdAt: "2024-01-15",
  },
  {
    id: "agency_land",
    name: "Land Registry",
    code: "LAND",
    createdAt: "2024-01-15",
  },
  {
    id: "agency_health",
    name: "Ministry of Health",
    code: "MOH",
    createdAt: "2024-02-01",
  },
  {
    id: "agency_edu",
    name: "Ministry of Education",
    code: "EDU",
    createdAt: "2024-02-15",
  },
]

export const mockOfficers: GovOfficer[] = [
  {
    id: "gov_001",
    name: "Ayesha K. Bangura",
    role: "GOV_ADMIN",
    agencyId: "agency_moi",
    email: "ayesha.b@moi.gov.sl",
    phone: "+232-76-123456",
    status: "active",
    lastLogin: "2025-11-29T14:30:00Z",
    lastLoginIp: "196.216.45.123",
    createdAt: "2024-01-20",
    requires2FA: true,
  },
  {
    id: "gov_002",
    name: "Tommy Sesay",
    role: "GOV_ISSUER",
    agencyId: "agency_land",
    email: "tommy.s@land.gov.sl",
    phone: "+232-77-654321",
    status: "active",
    lastLogin: "2025-11-28T09:15:00Z",
    lastLoginIp: "196.216.45.200",
    createdAt: "2024-02-10",
    requires2FA: true,
  },
  {
    id: "gov_003",
    name: "Mariama Conteh",
    role: "GOV_SUPERVISOR",
    agencyId: "agency_moi",
    email: "mariama.c@moi.gov.sl",
    phone: "+232-78-111222",
    status: "active",
    lastLogin: "2025-11-29T10:00:00Z",
    lastLoginIp: "196.216.45.150",
    createdAt: "2024-03-05",
    requires2FA: true,
  },
  {
    id: "gov_004",
    name: "Ibrahim Kamara",
    role: "GOV_AUDITOR",
    agencyId: "agency_moi",
    email: "ibrahim.k@moi.gov.sl",
    phone: "+232-76-333444",
    status: "active",
    lastLogin: "2025-11-27T16:45:00Z",
    lastLoginIp: "196.216.45.175",
    createdAt: "2024-03-20",
    requires2FA: true,
  },
  {
    id: "gov_005",
    name: "Fatmata Jalloh",
    role: "GOV_READONLY",
    agencyId: "agency_health",
    email: "fatmata.j@health.gov.sl",
    phone: "+232-77-555666",
    status: "suspended",
    createdAt: "2024-04-01",
    requires2FA: false,
  },
]

export const mockPendingDocs: PendingDocument[] = [
  {
    id: "pd_1001",
    docType: "Birth Certificate",
    citizenName: "David Conteh",
    nin: "SL-19900101-001",
    uploadDate: "2025-11-10",
    aiScore: 0.92,
    onChainHash: "0xccc333...fff",
    txId: "TX_DEMO_20251110_01",
    status: "pending",
    ocrText:
      "REPUBLIC OF SIERRA LEONE\nBIRTH CERTIFICATE\nName: David Conteh\nDate of Birth: January 1, 1990\nPlace of Birth: Freetown\nFather: Mohamed Conteh\nMother: Aminata Sesay",
    imageUrl: "/birth-certificate-document.png",
    comments: [],
  },
  {
    id: "pd_1002",
    docType: "Land Title",
    citizenName: "Fatmata Koroma",
    nin: "SL-19850505-112",
    uploadDate: "2025-11-08",
    aiScore: 0.55,
    onChainHash: "0xzzz999...aaa",
    txId: "",
    status: "needs_review",
    ocrText:
      "LAND REGISTRY OF SIERRA LEONE\nTITLE DEED\nOwner: Fatmata Koroma\nPlot No: FT-2024-0892\nLocation: Wellington, Freetown\nArea: 500 sqm\n[Some text unclear - requires manual verification]",
    imageUrl: "/land-title-deed-document.jpg",
    comments: [
      {
        id: "cmt_001",
        authorId: "gov_002",
        authorName: "Tommy Sesay",
        text: "AI flagged potential inconsistency in property boundaries. Please verify manually.",
        timestamp: "2025-11-09T11:30:00Z",
      },
    ],
  },
  {
    id: "pd_1003",
    docType: "National ID",
    citizenName: "Mohamed Bangura",
    nin: "SL-19780315-045",
    uploadDate: "2025-11-12",
    aiScore: 0.88,
    status: "pending",
    ocrText:
      "REPUBLIC OF SIERRA LEONE\nNATIONAL IDENTIFICATION CARD\nName: Mohamed Bangura\nNIN: SL-19780315-045\nDate of Birth: March 15, 1978",
    imageUrl: "/national-id-card-document.jpg",
    comments: [],
  },
  {
    id: "pd_1004",
    docType: "Marriage Certificate",
    citizenName: "Aminata & John Kamara",
    nin: "SL-19951220-089",
    uploadDate: "2025-11-11",
    aiScore: 0.78,
    status: "pending",
    ocrText:
      "MARRIAGE CERTIFICATE\nThis is to certify that Aminata Sesay and John Kamara were joined in matrimony on December 20, 2020...",
    imageUrl: "/marriage-certificate-document.jpg",
    comments: [],
  },
  {
    id: "pd_1005",
    docType: "Death Certificate",
    citizenName: "Estate of Samuel Cole",
    nin: "SL-19450610-002",
    uploadDate: "2025-11-09",
    aiScore: 0.45,
    status: "needs_review",
    ocrText:
      "DEATH CERTIFICATE\n[Document partially damaged]\nName: Samuel Cole\nDate of Death: [unclear]\nCause: [unclear]",
    imageUrl: "/death-certificate-document-worn.jpg",
    comments: [
      {
        id: "cmt_002",
        authorId: "gov_001",
        authorName: "Ayesha K. Bangura",
        text: "Document appears damaged. Request clearer scan from applicant.",
        timestamp: "2025-11-10T09:00:00Z",
      },
    ],
  },
]

export const mockAuditLogs: AuditLogEntry[] = [
  {
    id: "audit_001",
    actorId: "gov_001",
    actorName: "Ayesha K. Bangura",
    actorRole: "GOV_ADMIN",
    action: "LOGIN",
    timestamp: "2025-11-29T14:30:00Z",
    ip: "196.216.45.123",
    details: { method: "2FA", success: true },
    agencyId: "agency_moi",
  },
  {
    id: "audit_002",
    actorId: "gov_002",
    actorName: "Tommy Sesay",
    actorRole: "GOV_ISSUER",
    action: "DOCUMENT_APPROVED",
    targetDocId: "pd_1001",
    timestamp: "2025-11-29T10:15:00Z",
    ip: "196.216.45.200",
    details: {
      docType: "Birth Certificate",
      citizenNin: "SL-19900101-001",
      note: "All details verified against database",
    },
    agencyId: "agency_land",
  },
  {
    id: "audit_003",
    actorId: "gov_003",
    actorName: "Mariama Conteh",
    actorRole: "GOV_SUPERVISOR",
    action: "DOCUMENT_REJECTED",
    targetDocId: "pd_1005",
    timestamp: "2025-11-28T16:00:00Z",
    ip: "196.216.45.150",
    details: { docType: "Death Certificate", reason: "Document quality insufficient", citizenNin: "SL-19450610-002" },
    agencyId: "agency_moi",
  },
  {
    id: "audit_004",
    actorId: "gov_001",
    actorName: "Ayesha K. Bangura",
    actorRole: "GOV_ADMIN",
    action: "USER_CREATED",
    targetUserId: "gov_005",
    timestamp: "2025-11-27T11:00:00Z",
    ip: "196.216.45.123",
    details: { newUserEmail: "fatmata.j@health.gov.sl", role: "GOV_READONLY" },
    agencyId: "agency_moi",
  },
  {
    id: "audit_005",
    actorId: "gov_004",
    actorName: "Ibrahim Kamara",
    actorRole: "GOV_AUDITOR",
    action: "AUDIT_EXPORT",
    timestamp: "2025-11-26T09:30:00Z",
    ip: "196.216.45.175",
    details: { exportFormat: "CSV", dateRange: "2025-11-01 to 2025-11-26", recordCount: 156 },
    agencyId: "agency_moi",
  },
  {
    id: "audit_006",
    actorId: "gov_002",
    actorName: "Tommy Sesay",
    actorRole: "GOV_ISSUER",
    action: "DOCUMENT_ISSUED",
    targetDocId: "doc_new_001",
    timestamp: "2025-11-25T14:20:00Z",
    ip: "196.216.45.200",
    details: {
      docType: "Land Title",
      citizenNin: "SL-19880722-033",
      certificateNo: "LT-2025-0445",
      txId: "TX_SOL_20251125_01",
    },
    agencyId: "agency_land",
  },
]

export const mockRolePermissions: RolePermission[] = [
  {
    roleId: "GOV_ADMIN",
    permissions: {
      canViewPending: true,
      canApprove: true,
      canReject: true,
      canIssue: true,
      canManageUsers: true,
      canManageRoles: true,
      canViewAudit: true,
      canExportData: true,
      canManageSettings: true,
    },
  },
  {
    roleId: "GOV_SUPERVISOR",
    permissions: {
      canViewPending: true,
      canApprove: true,
      canReject: true,
      canIssue: true,
      canManageUsers: false,
      canManageRoles: false,
      canViewAudit: true,
      canExportData: true,
      canManageSettings: false,
    },
  },
  {
    roleId: "GOV_ISSUER",
    permissions: {
      canViewPending: true,
      canApprove: true,
      canReject: true,
      canIssue: true,
      canManageUsers: false,
      canManageRoles: false,
      canViewAudit: false,
      canExportData: false,
      canManageSettings: false,
    },
  },
  {
    roleId: "GOV_AUDITOR",
    permissions: {
      canViewPending: true,
      canApprove: false,
      canReject: false,
      canIssue: false,
      canManageUsers: false,
      canManageRoles: false,
      canViewAudit: true,
      canExportData: true,
      canManageSettings: false,
    },
  },
  {
    roleId: "GOV_READONLY",
    permissions: {
      canViewPending: true,
      canApprove: false,
      canReject: false,
      canIssue: false,
      canManageUsers: false,
      canManageRoles: false,
      canViewAudit: false,
      canExportData: false,
      canManageSettings: false,
    },
  },
]

export const docTypes = [
  "Birth Certificate",
  "Death Certificate",
  "Marriage Certificate",
  "National ID",
  "Land Title",
  "Business License",
  "Educational Certificate",
  "Passport",
  "Driving License",
] as const

export type DocType = (typeof docTypes)[number]

export const roleLabels: Record<GovRole, string> = {
  GOV_ADMIN: "Administrator",
  GOV_ISSUER: "Document Issuer",
  GOV_SUPERVISOR: "Supervisor",
  GOV_AUDITOR: "Auditor",
  GOV_READONLY: "Read Only",
}

export const roleColors: Record<GovRole, string> = {
  GOV_ADMIN: "bg-red-500/20 text-red-400 border-red-500/30",
  GOV_ISSUER: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  GOV_SUPERVISOR: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  GOV_AUDITOR: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  GOV_READONLY: "bg-gray-500/20 text-gray-400 border-gray-500/30",
}
