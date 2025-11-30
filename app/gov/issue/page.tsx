"use client"

import { useState } from "react"
import { FilePlus, Search, Loader2, CheckCircle, ExternalLink, Save, AlertTriangle, ChevronDown } from "lucide-react"
import { GovPageHeader } from "@/components/gov/gov-page-header"
import { GovFileUploader } from "@/components/gov/gov-file-uploader"
import { GovVaultBadge } from "@/components/gov/gov-vault-badge"
import { useToast } from "@/components/gov/gov-toast"
import { govApiIssueDocument, govApiSaveDraft, govApiLookupCitizen } from "@/lib/gov-api-mock"
import { docTypes, type DocType } from "@/lib/gov-mock-data"
import { cn } from "@/lib/utils"

interface CitizenInfo {
  found: boolean
  name?: string
  dateOfBirth?: string
  address?: string
}

export default function GovIssuePage() {
  const { showToast } = useToast()

  const [docType, setDocType] = useState<DocType | "">("")
  const [nin, setNin] = useState("")
  const [citizenInfo, setCitizenInfo] = useState<CitizenInfo | null>(null)
  const [lookingUp, setLookingUp] = useState(false)
  const [citizenName, setCitizenName] = useState("")
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0])
  const [certificateNo, setCertificateNo] = useState("")
  const [attachment, setAttachment] = useState<File | null>(null)

  const [issuing, setIssuing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [issuedResult, setIssuedResult] = useState<{ docId: string; txId: string; onChainHash: string } | null>(null)

  const handleLookupCitizen = async () => {
    if (!nin.trim()) return

    setLookingUp(true)
    setCitizenInfo(null)

    try {
      const result = await govApiLookupCitizen(nin)
      setCitizenInfo(result)
      if (result.found && result.name) {
        setCitizenName(result.name)
      }
    } finally {
      setLookingUp(false)
    }
  }

  const handleSaveDraft = async () => {
    setSaving(true)
    try {
      const result = await govApiSaveDraft({
        docType: docType || undefined,
        citizenNin: nin,
        citizenName,
        issueDate,
        certificateNo,
      })
      if (result.success) {
        showToast("success", "Draft Saved", `Draft ID: ${result.draftId}`)
      }
    } catch (error) {
      showToast("error", "Save Failed", "Could not save draft")
    } finally {
      setSaving(false)
    }
  }

  const handleIssue = async () => {
    if (!docType || !nin || !citizenName || !certificateNo) {
      showToast("error", "Validation Error", "Please fill all required fields")
      return
    }

    setIssuing(true)
    try {
      const result = await govApiIssueDocument({
        docType,
        citizenNin: nin,
        citizenName,
        issueDate,
        certificateNo,
        attachmentUrl: attachment ? URL.createObjectURL(attachment) : undefined,
        issuerId: "gov_001", // Mock - in production, get from session
        agencyId: "agency_moi",
      })

      if (result.success) {
        setIssuedResult({
          docId: result.docId || "",
          txId: result.txId || "",
          onChainHash: result.onChainHash || "",
        })
        setShowConfirmModal(false)
      }
    } catch (error) {
      showToast("error", "Issuance Failed", "Please try again")
    } finally {
      setIssuing(false)
    }
  }

  const generateCertificateNo = () => {
    const prefix = docType ? docType.substring(0, 2).toUpperCase() : "XX"
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")
    setCertificateNo(`${prefix}-${year}-${random}`)
  }

  const resetForm = () => {
    setDocType("")
    setNin("")
    setCitizenInfo(null)
    setCitizenName("")
    setIssueDate(new Date().toISOString().split("T")[0])
    setCertificateNo("")
    setAttachment(null)
    setIssuedResult(null)
  }

  const isFormValid = docType && nin && citizenName && certificateNo

  // Success State
  if (issuedResult) {
    return (
      <div>
        <GovPageHeader title="Issue New Document" description="Create and sign certified documents on the blockchain" />

        <div className="max-w-2xl mx-auto">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Document Issued Successfully</h2>
            <p className="text-white/60 mb-8">The document has been signed and recorded on the blockchain</p>

            <div className="bg-white/5 rounded-xl p-6 text-left space-y-4 mb-8">
              <div>
                <p className="text-sm text-white/60">Document ID</p>
                <p className="font-mono text-white">{issuedResult.docId}</p>
              </div>
              <div>
                <p className="text-sm text-white/60">Transaction ID</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-[#2DC5A0] truncate">{issuedResult.txId}</p>
                  <a
                    href={`https://explorer.solana.com/tx/${issuedResult.txId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-[#2DC5A0] transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
              <div>
                <p className="text-sm text-white/60">On-Chain Hash</p>
                <p className="font-mono text-white/70 text-sm truncate">{issuedResult.onChainHash}</p>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={resetForm}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors"
              >
                Issue Another
              </button>
              <a
                href="/gov/pending"
                className="px-6 py-3 bg-[#2DC5A0] hover:bg-[#2DC5A0]/90 text-[#0A2A43] font-semibold rounded-xl transition-colors"
              >
                View Documents
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <GovPageHeader title="Issue New Document" description="Create and sign certified documents on the blockchain" />

      <div className="max-w-2xl mx-auto">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault()
              setShowConfirmModal(true)
            }}
          >
            {/* Document Type */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Document Type <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as DocType)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:border-[#2DC5A0]/50 focus:ring-1 focus:ring-[#2DC5A0]/50"
                  required
                >
                  <option value="" className="bg-[#0A2A43]">
                    Select document type...
                  </option>
                  {docTypes.map((type) => (
                    <option key={type} value={type} className="bg-[#0A2A43]">
                      {type}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
              </div>
            </div>

            {/* Citizen NIN Lookup */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Citizen NIN <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nin}
                  onChange={(e) => setNin(e.target.value)}
                  placeholder="SL-YYYYMMDD-XXX"
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#2DC5A0]/50 focus:ring-1 focus:ring-[#2DC5A0]/50"
                  required
                />
                <button
                  type="button"
                  onClick={handleLookupCitizen}
                  disabled={lookingUp || !nin.trim()}
                  className="flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors disabled:opacity-50"
                >
                  {lookingUp ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                  Lookup
                </button>
              </div>

              {/* Citizen Info */}
              {citizenInfo && (
                <div
                  className={cn(
                    "mt-3 p-3 rounded-lg border",
                    citizenInfo.found ? "bg-emerald-500/10 border-emerald-500/30" : "bg-red-500/10 border-red-500/30",
                  )}
                >
                  {citizenInfo.found ? (
                    <div className="text-sm">
                      <p className="font-medium text-emerald-400">Citizen Found</p>
                      <p className="text-white/70 mt-1">{citizenInfo.name}</p>
                      <p className="text-white/50 text-xs">DOB: {citizenInfo.dateOfBirth}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-red-400">No citizen found with this NIN</p>
                  )}
                </div>
              )}
            </div>

            {/* Citizen Name */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Citizen Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                placeholder="Full legal name"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#2DC5A0]/50 focus:ring-1 focus:ring-[#2DC5A0]/50"
                required
              />
            </div>

            {/* Issue Date */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Issue Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#2DC5A0]/50 focus:ring-1 focus:ring-[#2DC5A0]/50"
                required
              />
            </div>

            {/* Certificate Number */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Certificate Number <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={certificateNo}
                  onChange={(e) => setCertificateNo(e.target.value)}
                  placeholder="XX-YYYY-0000"
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#2DC5A0]/50 focus:ring-1 focus:ring-[#2DC5A0]/50 font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={generateCertificateNo}
                  className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors text-sm"
                >
                  Generate
                </button>
              </div>
            </div>

            {/* File Attachment */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Attachment (Optional)</label>
              <GovFileUploader onFileSelect={setAttachment} accept="image/*,.pdf" maxSize={10} />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save Draft
              </button>
              <button
                type="submit"
                disabled={!isFormValid}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#2DC5A0] hover:bg-[#2DC5A0]/90 text-[#0A2A43] font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FilePlus className="w-5 h-5" />
                Issue & Sign on Chain
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowConfirmModal(false)} />

          <div className="relative w-full max-w-md bg-[#0A2A43] border border-white/10 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <GovVaultBadge size="md" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Confirm Document Issuance</h3>
                  <p className="text-sm text-white/60">This action will be recorded on-chain</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="bg-white/5 rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-white/60">Document Type</span>
                  <span className="text-sm font-medium text-white">{docType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/60">Citizen</span>
                  <span className="text-sm font-medium text-white">{citizenName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/60">NIN</span>
                  <span className="text-sm font-mono text-white/80">{nin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/60">Certificate No.</span>
                  <span className="text-sm font-mono text-white/80">{certificateNo}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-400">Blockchain Transaction</p>
                  <p className="text-amber-400/80 mt-1">
                    This document will be permanently recorded on Solana. Network fee: ~0.001 SOL (Mock Mode)
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-white/10 bg-white/5">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleIssue}
                disabled={issuing}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2DC5A0] hover:bg-[#2DC5A0]/90 text-[#0A2A43] font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {issuing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Confirm & Sign
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
