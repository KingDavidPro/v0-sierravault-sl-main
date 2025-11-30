# SierraVault Government Authentication & Admin Portal

> "Your life documents. Always safe. Always verifiable."

## Quick Start

Navigate to `/gov/login` to access the Government Portal.

### Demo Credentials
- **Agency:** Ministry of Internal Affairs (MOI)
- **Staff ID:** GOV001
- **Password:** admin123
- **OTP:** 123456 (mock mode)

---

## Swapping Mocks for Real Endpoints

### Supabase Integration

1. **Update `lib/gov-api-mock.ts`** - Replace mock functions with Supabase queries:

\`\`\`typescript
// Example: Replace govApi.getPendingDocs
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for admin operations
)

export async function getPendingDocs(filters: PendingDocsFilters) {
  const { data, error } = await supabase
    .from('documents')
    .select('*, citizens(*)')
    .eq('status', 'pending')
    .eq('agency_id', filters.agencyId)
  
  if (error) throw error
  return data
}
\`\`\`

2. **Row-Level Security (RLS)** - Enable RLS on all government tables:
\`\`\`sql
-- Example policy for documents table
CREATE POLICY "Government officers can view their agency documents"
ON documents FOR SELECT
USING (agency_id = auth.jwt() -> 'app_metadata' ->> 'agency_id');
\`\`\`

### Solana Blockchain Integration

1. **Update `lib/gov-api-mock.ts`** - Toggle blockchain mode:
\`\`\`typescript
// In settings page, change blockchainMode from 'mock' to 'devnet' or 'mainnet'
\`\`\`

2. **Configure Environment Variables:**
\`\`\`env
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_SIGNING_KEY=<your-base58-encoded-private-key>
\`\`\`

3. **Anchor Program** - Deploy the SierraVault program and update:
\`\`\`typescript
// lib/solana-config.ts
export const PROGRAM_ID = new PublicKey('<your-program-id>')
\`\`\`

### LLM Integration for Document Analysis

Add chatbot escalation in `components/gov/document-preview-modal.tsx`:
\`\`\`typescript
// TODO: Add LLM integration
import { generateText } from 'ai'

async function explainDocument(doc: PendingDoc) {
  const { text } = await generateText({
    model: 'openai/gpt-4o',
    prompt: `Summarize this document verification request: ${JSON.stringify(doc)}`
  })
  return text
}
\`\`\`

---

## File Structure

\`\`\`
app/gov/
├── login/page.tsx        # Government login
├── verify-otp/page.tsx   # 2FA verification
├── dashboard/page.tsx    # Main dashboard
├── pending/page.tsx      # Document verification queue
├── issue/page.tsx        # Issue new documents
├── users/page.tsx        # Agency & user management
├── roles/page.tsx        # RBAC permission editor
├── audit/page.tsx        # Audit logs
├── settings/page.tsx     # Security settings
├── help/page.tsx         # Help & training
└── layout.tsx            # Shared layout

components/gov/
├── gov-sidebar.tsx       # Collapsible navigation
├── gov-navbar.tsx        # Top bar with user info
├── gov-search-bar.tsx    # NIN citizen lookup
├── gov-stats-card.tsx    # Dashboard stat cards
├── gov-confirm-modal.tsx # Confirmation dialogs
├── gov-toast.tsx         # Toast notifications
└── ...

lib/
├── gov-mock-data.ts      # Mock agencies, officers, docs
└── gov-api-mock.ts       # Mock API functions
\`\`\`

---

## Admin Demo Script (3 Steps for Judges)

### Step 1: Login as Government Officer
1. Go to `/gov/login`
2. Select "Ministry of Internal Affairs" agency
3. Enter Staff ID: `GOV001`, Password: `admin123`
4. On OTP screen, enter: `123456`
5. Observe: Dashboard with stats, pending verifications, and audit feed

### Step 2: Approve a Pending Document
1. Click "Pending Documents" in sidebar or dashboard quick action
2. Find "David Conteh - Birth Certificate" (AI Score: 0.92)
3. Click the row to open the preview panel
4. Review OCR text and blockchain badge
5. Click "Approve", enter audit note: "Verified against source records"
6. Confirm the action
7. Observe: Success toast with Transaction ID badge

### Step 3: Issue a New Document
1. Navigate to "Issue Document" from sidebar
2. Select "Birth Certificate" as document type
3. Enter NIN: `SL-19900101-001` (auto-populates citizen details)
4. Fill certificate number: `BC-2025-00123`
5. Click "Issue & Sign on Chain"
6. Review the confirmation modal showing blockchain details
7. Confirm issuance
8. Observe: Success screen with TX badge and blockchain hash

---

## Keyboard Shortcuts

- `/` - Focus search bar
- `g + d` - Go to Dashboard
- `Esc` - Close modals

---

## Security Features

- Login attempt tracking (lockout after 5 failures)
- 2FA required for all government officers
- Suspicious location detection modal
- Audit trail for all actions
- IP allowlist configuration
- Session timeout controls
- Risk alerts for low AI confidence scores (<0.6)

---

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation support
- High contrast color ratios (WCAG AA compliant)
- Screen reader friendly table structures
- Focus management in modals
- Skeleton loaders for async content

---

Built with Next.js 15, React, Tailwind CSS, and the Sierra Leone design system.
