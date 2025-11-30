/**
 * SierraVault Government Portal - Mock API Layer
 *
 * TODO: Replace these mock functions with real API calls
 *
 * SUPABASE INTEGRATION:
 * - Import createServerClient from @supabase/ssr
 * - Use SUPABASE_SERVICE_ROLE_KEY for admin operations
 * - Enable RLS policies on: gov_agencies, gov_officers, gov_documents, gov_audit_logs
 *
 * SOLANA INTEGRATION:
 * - Toggle BLOCKCHAIN_MODE below from 'mock' to 'real'
 * - Configure anchor program at /lib/solana-config.ts
 * - Set NEXT_PUBLIC_SOLANA_RPC_URL environment variable
 *
 * LLM INTEGRATION:
 * - Add AI analysis calls where marked with // TODO: LLM
 * - Use for: document OCR verification, fraud detection, citizen query chatbot
 */

import {
  mockAgencies,
  mockOfficers,
  mockPendingDocs,
  mockAuditLogs,
  mockRolePermissions,
  type GovOfficer,
  type PendingDocument,
  type AuditLogEntry,
  type Agency,
  type GovRole,
  type RolePermission,
} from "./gov-mock-data"

// Configuration
export const BLOCKCHAIN_MODE: "mock" | "real" = "mock"

// Simulated delay for realistic UX
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Login attempt tracking (in production, store in Redis/database)
const loginAttempts: Record<string, { count: number; lastAttempt: Date }> = {}

// ============================================
// AUTHENTICATION APIs
// ============================================

export interface LoginResponse {
  success: boolean
  sendOtp?: boolean
  sessionTempId?: string
  error?: string
  attemptsRemaining?: number
  requiresUnlock?: boolean
  lastLogin?: string
  lastLoginIp?: string
}

export async function govAuthLogin(params: {
  agencyId: string
  staffId: string
  password: string
}): Promise<LoginResponse> {
  await delay(800)

  const attemptKey = `${params.agencyId}_${params.staffId}`
  const attempts = loginAttempts[attemptKey] || { count: 0, lastAttempt: new Date() }

  // Check if locked out
  if (attempts.count >= 5) {
    const timeSinceLast = Date.now() - attempts.lastAttempt.getTime()
    if (timeSinceLast < 30 * 60 * 1000) {
      // 30 minute lockout
      return {
        success: false,
        error: "Account locked due to too many failed attempts",
        requiresUnlock: true,
        attemptsRemaining: 0,
      }
    } else {
      // Reset after lockout period
      loginAttempts[attemptKey] = { count: 0, lastAttempt: new Date() }
    }
  }

  // Find officer by ID pattern (mock validation)
  const officer = mockOfficers.find((o) => o.id === params.staffId && o.agencyId === params.agencyId)

  // Mock password validation (in production, use bcrypt comparison)
  const validPassword = params.password === "demo123" || params.password.length >= 8

  if (!officer || !validPassword) {
    attempts.count++
    attempts.lastAttempt = new Date()
    loginAttempts[attemptKey] = attempts

    return {
      success: false,
      error: "Invalid credentials",
      attemptsRemaining: 5 - attempts.count,
    }
  }

  if (officer.status === "suspended") {
    return {
      success: false,
      error: "Account suspended. Contact your administrator.",
    }
  }

  // Reset attempts on success
  loginAttempts[attemptKey] = { count: 0, lastAttempt: new Date() }

  // Generate temporary session for 2FA
  const sessionTempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // TODO: In production, send real OTP via email/SMS
  // await sendOtpToUser(officer.email, officer.phone)
  console.log("[Mock] OTP sent to:", officer.email, "- Code: 123456")

  return {
    success: true,
    sendOtp: true,
    sessionTempId,
    lastLogin: officer.lastLogin,
    lastLoginIp: officer.lastLoginIp,
  }
}

export interface VerifyOtpResponse {
  success: boolean
  token?: string
  officer?: GovOfficer
  agency?: Agency
  error?: string
  suspiciousLocation?: boolean
}

export async function govAuthVerifyOtp(params: {
  sessionTempId: string
  otp: string
  currentIp?: string
}): Promise<VerifyOtpResponse> {
  await delay(600)

  // Mock OTP validation (in production, verify against stored OTP)
  const validOtp = params.otp === "123456"

  if (!validOtp) {
    return {
      success: false,
      error: "Invalid verification code",
    }
  }

  // Mock: Get officer from session (in production, decode sessionTempId)
  const officer = mockOfficers[0] // Default to first officer for demo
  const agency = mockAgencies.find((a) => a.id === officer.agencyId)

  // Check for suspicious location (mock check)
  const knownIps = ["196.216.45.123", "196.216.45.200", "196.216.45.150", "196.216.45.175"]
  const suspiciousLocation = params.currentIp ? !knownIps.includes(params.currentIp) : false

  // Generate session token (in production, use JWT)
  const token = `gov_token_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`

  return {
    success: true,
    token,
    officer,
    agency,
    suspiciousLocation,
  }
}

export async function govAuthResendOtp(sessionTempId: string): Promise<{ success: boolean }> {
  await delay(500)
  console.log("[Mock] OTP resent - Code: 123456")
  return { success: true }
}

// ============================================
// DOCUMENT APIs
// ============================================

export interface GetPendingDocsParams {
  agencyId?: string
  docType?: string
  status?: string
  aiScoreMin?: number
  aiScoreMax?: number
  dateFrom?: string
  dateTo?: string
  search?: string
}

export async function govApiGetPendingDocs(params: GetPendingDocsParams): Promise<PendingDocument[]> {
  await delay(500)

  let docs = [...mockPendingDocs]

  if (params.docType) {
    docs = docs.filter((d) => d.docType === params.docType)
  }

  if (params.status) {
    docs = docs.filter((d) => d.status === params.status)
  }

  if (params.aiScoreMin !== undefined) {
    docs = docs.filter((d) => d.aiScore >= params.aiScoreMin!)
  }

  if (params.aiScoreMax !== undefined) {
    docs = docs.filter((d) => d.aiScore <= params.aiScoreMax!)
  }

  if (params.search) {
    const searchLower = params.search.toLowerCase()
    docs = docs.filter(
      (d) => d.citizenName.toLowerCase().includes(searchLower) || d.nin.toLowerCase().includes(searchLower),
    )
  }

  return docs
}

export async function govApiGetDocumentById(docId: string): Promise<PendingDocument | null> {
  await delay(300)
  return mockPendingDocs.find((d) => d.id === docId) || null
}

export interface ApproveDocResponse {
  success: boolean
  txId?: string
  onChainHash?: string
  error?: string
}

export async function govApiApproveDoc(params: {
  docId: string
  approverId: string
  note: string
}): Promise<ApproveDocResponse> {
  await delay(1200)

  // TODO: In production:
  // 1. Update document status in Supabase
  // 2. If BLOCKCHAIN_MODE === 'real', call Solana program to record approval
  // 3. Create audit log entry

  const mockTxId = `TX_SOL_${Date.now()}_${Math.random().toString(36).substr(2, 8).toUpperCase()}`
  const mockHash = `0x${Math.random().toString(16).substr(2, 40)}`

  console.log("[Mock] Document approved:", params.docId, "TX:", mockTxId)

  return {
    success: true,
    txId: mockTxId,
    onChainHash: mockHash,
  }
}

export async function govApiRejectDoc(params: {
  docId: string
  rejectorId: string
  reason: string
}): Promise<{ success: boolean; error?: string }> {
  await delay(800)

  console.log("[Mock] Document rejected:", params.docId, "Reason:", params.reason)

  return { success: true }
}

export async function govApiRequestMoreInfo(params: {
  docId: string
  requesterId: string
  message: string
}): Promise<{ success: boolean }> {
  await delay(600)

  // TODO: Send notification to citizen
  console.log("[Mock] More info requested for:", params.docId)

  return { success: true }
}

// ============================================
// DOCUMENT ISSUANCE APIs
// ============================================

export interface IssueDocumentParams {
  docType: string
  citizenNin: string
  citizenName: string
  issueDate: string
  certificateNo: string
  attachmentUrl?: string
  issuerId: string
  agencyId: string
}

export interface IssueDocResponse {
  success: boolean
  docId?: string
  txId?: string
  onChainHash?: string
  error?: string
}

export async function govApiIssueDocument(params: IssueDocumentParams): Promise<IssueDocResponse> {
  await delay(1500)

  // TODO: In production:
  // 1. Validate citizen NIN exists
  // 2. Create document record in Supabase
  // 3. If BLOCKCHAIN_MODE === 'real', call Solana program to mint document NFT
  // 4. Create audit log entry

  const mockDocId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
  const mockTxId = `TX_SOL_${Date.now()}_${Math.random().toString(36).substr(2, 8).toUpperCase()}`
  const mockHash = `0x${Math.random().toString(16).substr(2, 40)}`

  console.log("[Mock] Document issued:", mockDocId, "TX:", mockTxId)

  return {
    success: true,
    docId: mockDocId,
    txId: mockTxId,
    onChainHash: mockHash,
  }
}

export async function govApiSaveDraft(
  params: Partial<IssueDocumentParams>,
): Promise<{ success: boolean; draftId: string }> {
  await delay(400)

  const draftId = `draft_${Date.now()}`
  console.log("[Mock] Draft saved:", draftId)

  return { success: true, draftId }
}

export async function govApiLookupCitizen(nin: string): Promise<{
  found: boolean
  name?: string
  dateOfBirth?: string
  address?: string
}> {
  await delay(500)

  // Mock citizen lookup
  if (nin.startsWith("SL-")) {
    return {
      found: true,
      name: "Sample Citizen",
      dateOfBirth: "1990-01-15",
      address: "Freetown, Sierra Leone",
    }
  }

  return { found: false }
}

// ============================================
// USER MANAGEMENT APIs
// ============================================

export async function govApiListOfficers(agencyId?: string): Promise<GovOfficer[]> {
  await delay(400)

  if (agencyId) {
    return mockOfficers.filter((o) => o.agencyId === agencyId)
  }

  return mockOfficers
}

export async function govApiGetOfficer(officerId: string): Promise<GovOfficer | null> {
  await delay(300)
  return mockOfficers.find((o) => o.id === officerId) || null
}

export async function govApiCreateOfficer(params: {
  name: string
  email: string
  phone: string
  role: GovRole
  agencyId: string
}): Promise<{ success: boolean; officer?: GovOfficer; error?: string }> {
  await delay(800)

  const newOfficer: GovOfficer = {
    id: `gov_${Date.now()}`,
    ...params,
    status: "pending_invite",
    createdAt: new Date().toISOString(),
    requires2FA: true,
  }

  // TODO: Send invite email with setup link
  console.log("[Mock] Officer created:", newOfficer.id, "- Invite sent to:", params.email)

  return { success: true, officer: newOfficer }
}

export async function govApiUpdateOfficer(
  officerId: string,
  updates: Partial<GovOfficer>,
): Promise<{ success: boolean; error?: string }> {
  await delay(600)

  console.log("[Mock] Officer updated:", officerId, updates)

  return { success: true }
}

export async function govApiSuspendOfficer(officerId: string, reason: string): Promise<{ success: boolean }> {
  await delay(500)

  console.log("[Mock] Officer suspended:", officerId, "Reason:", reason)

  return { success: true }
}

// ============================================
// AGENCY APIs
// ============================================

export async function govApiListAgencies(): Promise<Agency[]> {
  await delay(300)
  return mockAgencies
}

// ============================================
// ROLE & PERMISSION APIs
// ============================================

export async function govApiGetRolePermissions(): Promise<RolePermission[]> {
  await delay(300)
  return mockRolePermissions
}

export async function govApiUpdateRolePermissions(
  roleId: GovRole,
  permissions: RolePermission["permissions"],
): Promise<{ success: boolean }> {
  await delay(600)

  console.log("[Mock] Role permissions updated:", roleId, permissions)

  return { success: true }
}

// ============================================
// AUDIT LOG APIs
// ============================================

export interface AuditLogFilters {
  actorId?: string
  action?: string
  agencyId?: string
  dateFrom?: string
  dateTo?: string
  search?: string
}

export async function govApiGetAuditLogs(filters: AuditLogFilters): Promise<AuditLogEntry[]> {
  await delay(500)

  let logs = [...mockAuditLogs]

  if (filters.actorId) {
    logs = logs.filter((l) => l.actorId === filters.actorId)
  }

  if (filters.action) {
    logs = logs.filter((l) => l.action === filters.action)
  }

  if (filters.agencyId) {
    logs = logs.filter((l) => l.agencyId === filters.agencyId)
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    logs = logs.filter(
      (l) => l.actorName.toLowerCase().includes(searchLower) || l.action.toLowerCase().includes(searchLower),
    )
  }

  // Sort by timestamp descending
  logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return logs
}

export async function govApiExportAuditLogs(filters: AuditLogFilters): Promise<{
  success: boolean
  downloadUrl?: string
}> {
  await delay(1000)

  // TODO: Generate actual CSV file and upload to storage
  console.log("[Mock] Audit logs exported with filters:", filters)

  return {
    success: true,
    downloadUrl: "/mock-audit-export.csv",
  }
}

// ============================================
// SETTINGS APIs
// ============================================

export interface GovSettings {
  require2FA: boolean
  ipAllowlist: string[]
  blockchainMode: "mock" | "real"
  signingKeyConfigured: boolean
}

export async function govApiGetSettings(): Promise<GovSettings> {
  await delay(300)

  return {
    require2FA: true,
    ipAllowlist: ["196.216.45.0/24"],
    blockchainMode: BLOCKCHAIN_MODE,
    signingKeyConfigured: false,
  }
}

export async function govApiUpdateSettings(settings: Partial<GovSettings>): Promise<{ success: boolean }> {
  await delay(500)

  console.log("[Mock] Settings updated:", settings)

  return { success: true }
}

// ============================================
// DASHBOARD STATS APIs
// ============================================

export interface DashboardStats {
  pendingVerifications: number
  documentsIssuedLast30d: number
  activeOfficers: number
  auditAlerts: number
}

export async function govApiGetDashboardStats(agencyId?: string): Promise<DashboardStats> {
  await delay(400)

  return {
    pendingVerifications: mockPendingDocs.filter((d) => d.status === "pending" || d.status === "needs_review").length,
    documentsIssuedLast30d: 47,
    activeOfficers: mockOfficers.filter((o) => o.status === "active").length,
    auditAlerts: 2,
  }
}

export const govAuth = {
  login: govAuthLogin,
  verifyOtp: govAuthVerifyOtp,
  resendOtp: govAuthResendOtp,
}

export const govApi = {
  getPendingDocs: govApiGetPendingDocs,
  getDocumentById: govApiGetDocumentById,
  approveDoc: govApiApproveDoc,
  rejectDoc: govApiRejectDoc,
  requestMoreInfo: govApiRequestMoreInfo,
  issueDocument: govApiIssueDocument,
  saveDraft: govApiSaveDraft,
  lookupCitizen: govApiLookupCitizen,
  listOfficers: govApiListOfficers,
  getOfficer: govApiGetOfficer,
  createOfficer: govApiCreateOfficer,
  updateOfficer: govApiUpdateOfficer,
  suspendOfficer: govApiSuspendOfficer,
  listAgencies: govApiListAgencies,
  getRolePermissions: govApiGetRolePermissions,
  updateRolePermissions: govApiUpdateRolePermissions,
  auditLogs: govApiGetAuditLogs,
  exportAuditLogs: govApiExportAuditLogs,
  getSettings: govApiGetSettings,
  updateSettings: govApiUpdateSettings,
  getDashboardStats: govApiGetDashboardStats,
}

export type { GovOfficer, PendingDocument, Agency, GovRole, RolePermission } from "./gov-mock-data"
export type AuditLog = AuditLogEntry
