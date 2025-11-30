"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Filter, RefreshCw, FileText, ChevronDown, X, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { GovPageHeader } from "@/components/gov/gov-page-header"
import { GovStatusBadge } from "@/components/gov/gov-status-badge"
import { GovAiScoreIndicator } from "@/components/gov/gov-ai-score-indicator"
import { GovSkeletonTable } from "@/components/gov/gov-skeleton-table"
import { GovDocumentPreviewModal } from "@/components/gov/gov-document-preview-modal"
import { GovConfirmModal } from "@/components/gov/gov-confirm-modal"
import { useToast } from "@/components/gov/gov-toast"
import { govApiGetPendingDocs, govApiApproveDoc, govApiRejectDoc, govApiRequestMoreInfo } from "@/lib/gov-api-mock"
import { docTypes, type PendingDocument } from "@/lib/gov-mock-data"
import { cn } from "@/lib/utils"

export default function GovPendingPage() {
  const searchParams = useSearchParams()
  const { showToast } = useToast()

  const [documents, setDocuments] = useState<PendingDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<PendingDocument | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [docTypeFilter, setDocTypeFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "")
  const [aiScoreFilter, setAiScoreFilter] = useState("")

  // Quick action modals
  const [quickApproveDoc, setQuickApproveDoc] = useState<PendingDocument | null>(null)
  const [quickRejectDoc, setQuickRejectDoc] = useState<PendingDocument | null>(null)

  const loadDocuments = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true)
      else setLoading(true)

      try {
        const docs = await govApiGetPendingDocs({
          docType: docTypeFilter || undefined,
          status: statusFilter || undefined,
          aiScoreMax: aiScoreFilter === "low" ? 0.6 : undefined,
          aiScoreMin: aiScoreFilter === "high" ? 0.8 : undefined,
          search: searchQuery || undefined,
        })
        setDocuments(docs)
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [docTypeFilter, statusFilter, aiScoreFilter, searchQuery],
  )

  useEffect(() => {
    loadDocuments()
  }, [loadDocuments])

  // Check for docId in URL to auto-open preview
  useEffect(() => {
    const docId = searchParams.get("docId")
    if (docId && documents.length > 0) {
      const doc = documents.find((d) => d.id === docId)
      if (doc) setSelectedDoc(doc)
    }
  }, [searchParams, documents])

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const handleApprove = async (docId: string, note: string) => {
    try {
      const result = await govApiApproveDoc({
        docId,
        approverId: "gov_001", // Mock - in production, get from session
        note,
      })

      if (result.success) {
        showToast("success", "Document Approved", `Transaction ID: ${result.txId}`)
        setSelectedDoc(null)
        loadDocuments(true)
      }
    } catch (error) {
      showToast("error", "Approval Failed", "Please try again")
    }
  }

  const handleReject = async (docId: string, reason: string) => {
    try {
      const result = await govApiRejectDoc({
        docId,
        rejectorId: "gov_001",
        reason,
      })

      if (result.success) {
        showToast("success", "Document Rejected", "Citizen will be notified")
        setSelectedDoc(null)
        loadDocuments(true)
      }
    } catch (error) {
      showToast("error", "Rejection Failed", "Please try again")
    }
  }

  const handleRequestInfo = async (docId: string, message: string) => {
    try {
      const result = await govApiRequestMoreInfo({
        docId,
        requesterId: "gov_001",
        message,
      })

      if (result.success) {
        showToast("info", "Request Sent", "Citizen will receive your message")
      }
    } catch (error) {
      showToast("error", "Request Failed", "Please try again")
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setDocTypeFilter("")
    setStatusFilter("")
    setAiScoreFilter("")
  }

  const hasActiveFilters = searchQuery || docTypeFilter || statusFilter || aiScoreFilter

  return (
    <div>
      <GovPageHeader
        title="Pending Verifications"
        description="Review and verify submitted documents"
        actions={
          <button
            onClick={() => loadDocuments(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
            Refresh
          </button>
        }
      />

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or NIN..."
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#2DC5A0]/50 focus:ring-1 focus:ring-[#2DC5A0]/50 transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 border rounded-xl transition-colors",
              showFilters || hasActiveFilters
                ? "bg-[#2DC5A0]/20 border-[#2DC5A0]/50 text-[#2DC5A0]"
                : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10",
            )}
          >
            <Filter className="w-5 h-5" />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="w-5 h-5 bg-[#2DC5A0] text-[#0A2A43] text-xs font-bold rounded-full flex items-center justify-center">
                {[docTypeFilter, statusFilter, aiScoreFilter].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Document Type */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Document Type</label>
                <div className="relative">
                  <select
                    value={docTypeFilter}
                    onChange={(e) => setDocTypeFilter(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white appearance-none focus:outline-none focus:border-[#2DC5A0]/50"
                  >
                    <option value="" className="bg-[#0A2A43]">
                      All Types
                    </option>
                    {docTypes.map((type) => (
                      <option key={type} value={type} className="bg-[#0A2A43]">
                        {type}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Status</label>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white appearance-none focus:outline-none focus:border-[#2DC5A0]/50"
                  >
                    <option value="" className="bg-[#0A2A43]">
                      All Statuses
                    </option>
                    <option value="pending" className="bg-[#0A2A43]">
                      Pending
                    </option>
                    <option value="needs_review" className="bg-[#0A2A43]">
                      Needs Review
                    </option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                </div>
              </div>

              {/* AI Score */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">AI Confidence</label>
                <div className="relative">
                  <select
                    value={aiScoreFilter}
                    onChange={(e) => setAiScoreFilter(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white appearance-none focus:outline-none focus:border-[#2DC5A0]/50"
                  >
                    <option value="" className="bg-[#0A2A43]">
                      All Scores
                    </option>
                    <option value="high" className="bg-[#0A2A43]">
                      High (&gt;80%)
                    </option>
                    <option value="low" className="bg-[#0A2A43]">
                      Low (&lt;60%)
                    </option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                </div>
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Documents Table */}
      {loading ? (
        <GovSkeletonTable rows={5} columns={6} />
      ) : documents.length === 0 ? (
        <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
          <FileText className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No documents found</h3>
          <p className="text-white/60 mb-4">
            {hasActiveFilters
              ? "Try adjusting your filters to see more results"
              : "There are no pending documents to review"}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-white/60 border-b border-white/10">
                <th className="pb-4 pl-4 font-medium">Document</th>
                <th className="pb-4 font-medium hidden md:table-cell">Citizen</th>
                <th className="pb-4 font-medium hidden lg:table-cell">NIN</th>
                <th className="pb-4 font-medium hidden sm:table-cell">Submitted</th>
                <th className="pb-4 font-medium">AI Score</th>
                <th className="pb-4 font-medium">Status</th>
                <th className="pb-4 pr-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {documents.map((doc) => (
                <tr
                  key={doc.id}
                  className="hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => setSelectedDoc(doc)}
                >
                  <td className="py-4 pl-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-white/60" />
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">{doc.docType}</p>
                        <p className="text-xs text-white/50 md:hidden">{doc.citizenName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 hidden md:table-cell">
                    <p className="text-white">{doc.citizenName}</p>
                  </td>
                  <td className="py-4 hidden lg:table-cell">
                    <code className="text-xs font-mono text-white/70 bg-white/10 px-2 py-1 rounded">{doc.nin}</code>
                  </td>
                  <td className="py-4 hidden sm:table-cell">
                    <p className="text-sm text-white/70">{formatDate(doc.uploadDate)}</p>
                  </td>
                  <td className="py-4">
                    <GovAiScoreIndicator score={doc.aiScore} showLabel={false} size="sm" />
                  </td>
                  <td className="py-4">
                    <GovStatusBadge status={doc.status} />
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setQuickRejectDoc(doc)}
                        className="p-2 rounded-lg hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors"
                        aria-label="Reject"
                        title="Reject"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setQuickApproveDoc(doc)}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          doc.aiScore < 0.6
                            ? "hover:bg-amber-500/20 text-amber-400"
                            : "hover:bg-emerald-500/20 text-white/50 hover:text-emerald-400",
                        )}
                        aria-label="Approve"
                        title={doc.aiScore < 0.6 ? "Approve (Low AI Score - Review Carefully)" : "Approve"}
                      >
                        {doc.aiScore < 0.6 ? (
                          <AlertTriangle className="w-5 h-5" />
                        ) : (
                          <CheckCircle className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Results Count */}
      {!loading && documents.length > 0 && (
        <div className="mt-4 text-sm text-white/50">
          Showing {documents.length} document{documents.length !== 1 ? "s" : ""}
        </div>
      )}

      {/* Document Preview Modal */}
      <GovDocumentPreviewModal
        isOpen={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        document={selectedDoc}
        onApprove={handleApprove}
        onReject={handleReject}
        onRequestInfo={handleRequestInfo}
      />

      {/* Quick Approve Modal */}
      {quickApproveDoc && (
        <GovConfirmModal
          isOpen={true}
          onClose={() => setQuickApproveDoc(null)}
          onConfirm={async (note) => {
            await handleApprove(quickApproveDoc.id, note)
            setQuickApproveDoc(null)
          }}
          title="Approve Document"
          description={`Approve ${quickApproveDoc.docType} for ${quickApproveDoc.citizenName}?`}
          type={quickApproveDoc.aiScore < 0.6 ? "warning" : "approve"}
          notePlaceholder="Enter verification notes..."
        />
      )}

      {/* Quick Reject Modal */}
      {quickRejectDoc && (
        <GovConfirmModal
          isOpen={true}
          onClose={() => setQuickRejectDoc(null)}
          onConfirm={async (reason) => {
            await handleReject(quickRejectDoc.id, reason)
            setQuickRejectDoc(null)
          }}
          title="Reject Document"
          description={`Reject ${quickRejectDoc.docType} for ${quickRejectDoc.citizenName}?`}
          type="reject"
          notePlaceholder="Enter rejection reason..."
        />
      )}
    </div>
  )
}
