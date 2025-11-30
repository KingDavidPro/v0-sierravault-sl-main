// =============================================================================
// SIERRAVAULT MOCK DATA
// =============================================================================
// TODO: Replace with Supabase queries
// Supabase URL: process.env.NEXT_PUBLIC_SUPABASE_URL
// Supabase Anon Key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// =============================================================================

export interface User {
  id: string
  name: string
  email: string
  nin: string
  walletPubKey: string
  avatar?: string
  createdAt: string
}

export interface Document {
  docId: string
  userId: string
  docType: string
  ownerName: string
  uploadDate: string
  ocrText: string
  aiScore: number
  onChainHash: string
  txId: string
  visibility: "private" | "shared" | "public"
  issuer: "government" | "user"
  status: "verified" | "pending" | "rejected"
  fileSize: string
  thumbnail?: string
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export interface VerificationRequest {
  id: string
  docId: string
  requestedBy: string
  requestDate: string
  status: "pending" | "approved" | "rejected"
  docType: string
  ownerName: string
}

// Mock Users
export const users: User[] = [
  {
    id: "user_001",
    name: "David Conteh",
    email: "david@example.com",
    nin: "SL-19900101-001",
    walletPubKey: "DemoWalletPubKey1ABC123XYZ789",
    avatar: "/professional-african-man-portrait.png",
    createdAt: "2024-06-15",
  },
  {
    id: "user_002",
    name: "Aminata Kamara",
    email: "aminata@example.com",
    nin: "SL-19850315-042",
    walletPubKey: "DemoWalletPubKey2DEF456UVW012",
    createdAt: "2024-08-20",
  },
]

// Mock Documents
export const documents: Document[] = [
  {
    docId: "doc_1001",
    userId: "user_001",
    docType: "Birth Certificate",
    ownerName: "David Conteh",
    uploadDate: "2025-09-15",
    ocrText:
      "David Alieu Conteh, born 01 Jan 1990, Freetown, Sierra Leone. Father: Mohamed Conteh. Mother: Fatmata Conteh.",
    aiScore: 0.98,
    onChainHash: "0xabc123def456789abcdef0123456789abcdef01",
    txId: "TX_DEMO_20250915_01",
    visibility: "private",
    issuer: "government",
    status: "verified",
    fileSize: "2.4 MB",
  },
  {
    docId: "doc_1002",
    userId: "user_001",
    docType: "Diploma",
    ownerName: "David Conteh",
    uploadDate: "2025-10-01",
    ocrText:
      "Diploma in Procurement and Supply Chain Management, Fourah Bay College, University of Sierra Leone. Awarded with Distinction.",
    aiScore: 0.95,
    onChainHash: "0xbbb222eee555888bbbccc111222333444555666",
    txId: "TX_DEMO_20251001_01",
    visibility: "private",
    issuer: "government",
    status: "verified",
    fileSize: "3.1 MB",
  },
  {
    docId: "doc_1003",
    userId: "user_001",
    docType: "Land Title",
    ownerName: "David Conteh",
    uploadDate: "2025-11-01",
    ocrText:
      "Land plot 45, Freetown, Western Area. Size: 0.5 acres. Registered Owner: David Alieu Conteh. Registry Number: FT-2025-4521.",
    aiScore: 0.92,
    onChainHash: "0xccc333fff999ccc333fff999000111222333444",
    txId: "TX_DEMO_20251101_01",
    visibility: "shared",
    issuer: "government",
    status: "verified",
    fileSize: "4.7 MB",
  },
  {
    docId: "doc_1004",
    userId: "user_001",
    docType: "NIN Certificate",
    ownerName: "David Conteh",
    uploadDate: "2025-07-05",
    ocrText: "National Identity Number: SL-19900101-001. Full Name: David Alieu Conteh. Date of Birth: 01/01/1990.",
    aiScore: 0.99,
    onChainHash: "0xddd444ggg777ddd444ggg777888999aaabbbccc",
    txId: "TX_DEMO_20250705_01",
    visibility: "private",
    issuer: "government",
    status: "verified",
    fileSize: "1.8 MB",
  },
  {
    docId: "doc_1005",
    userId: "user_001",
    docType: "Marriage Certificate",
    ownerName: "David Conteh",
    uploadDate: "2024-12-20",
    ocrText:
      "Marriage Certificate between David Alieu Conteh and Mariama Sesay. Date of Marriage: December 15, 2024. Registered at Freetown Central Registry.",
    aiScore: 0.9,
    onChainHash: "0xeee555hhh888eee555hhh888999000111222333",
    txId: "TX_DEMO_20241220_01",
    visibility: "private",
    issuer: "government",
    status: "verified",
    fileSize: "2.1 MB",
  },
]

// Mock Chat Messages (sample conversation)
export const sampleChatMessages: ChatMessage[] = [
  {
    id: "msg_001",
    role: "assistant",
    content:
      "Welcome to SierraVault! I'm your AI assistant. How can I help you today? You can ask me to upload documents, verify them, search your vault, or explain how blockchain verification works.",
    timestamp: "2025-11-01T10:00:00Z",
  },
  {
    id: "msg_002",
    role: "user",
    content: "How does blockchain verification work?",
    timestamp: "2025-11-01T10:01:00Z",
  },
  {
    id: "msg_003",
    role: "assistant",
    content:
      "Great question! When you upload a document, we create a unique digital fingerprint (called a hash) of your file. This hash is then stored on the Solana blockchain - think of it as a permanent, tamper-proof receipt. Anyone can verify your document by checking if its hash matches what's stored on the blockchain. The document itself stays private and encrypted in your vault.",
    timestamp: "2025-11-01T10:01:30Z",
  },
]

// Mock Verification Requests (for Admin)
export const verificationRequests: VerificationRequest[] = [
  {
    id: "ver_001",
    docId: "doc_2001",
    requestedBy: "Aminata Kamara",
    requestDate: "2025-11-28",
    status: "pending",
    docType: "Academic Transcript",
    ownerName: "Aminata Kamara",
  },
  {
    id: "ver_002",
    docId: "doc_2002",
    requestedBy: "Mohamed Bangura",
    requestDate: "2025-11-27",
    status: "pending",
    docType: "Professional License",
    ownerName: "Mohamed Bangura",
  },
  {
    id: "ver_003",
    docId: "doc_2003",
    requestedBy: "Isatu Koroma",
    requestDate: "2025-11-26",
    status: "pending",
    docType: "Birth Certificate",
    ownerName: "Isatu Koroma",
  },
]

// Helper function to format dates
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

// Helper to get document by ID
export function getDocumentById(docId: string): Document | undefined {
  return documents.find((doc) => doc.docId === docId)
}

// Helper to get user documents
export function getUserDocuments(userId: string): Document[] {
  return documents.filter((doc) => doc.userId === userId)
}

// Helper to search documents
export function searchDocuments(userId: string, query: string): Document[] {
  const lowercaseQuery = query.toLowerCase()
  return documents.filter(
    (doc) =>
      doc.userId === userId &&
      (doc.docType.toLowerCase().includes(lowercaseQuery) ||
        doc.ocrText.toLowerCase().includes(lowercaseQuery) ||
        doc.ownerName.toLowerCase().includes(lowercaseQuery)),
  )
}

// Current logged-in user (for demo)
export const currentUser = users[0]
