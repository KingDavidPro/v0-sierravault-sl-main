"use client"

import { useState } from "react"
import Image from "next/image"
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MessageSquare,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { GovStatusBadge } from "./gov-status-badge"
import { GovConfirmModal } from "./gov-confirm-modal"
import type { PendingDocument } from "@/lib/gov-mock-data"

interface GovDocumentPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  document: PendingDocument | null
  onApprove?: (docId: string, note: string) => Promise<void>
  onReject?: (docId: string, reason: string) => Promise<void>
  onRequestInfo?: (docId: string, message: string) => Promise<void>
}

export function GovDocumentPreviewModal({
  isOpen,
  onClose,
  document,
  onApprove,
  onReject,
  onRequestInfo,
}: GovDocumentPreviewModalProps) {
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [activeTab, setActiveTab] = useState<"preview" | "ocr" | "comments">("preview")
  const [newComment, setNewComment] = useState("")
  const [submittingComment, setSubmittingComment] = useState(false)

  if (!isOpen || !document) return null

  const isLowScore = document.aiScore < 0.6
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const handleZoomIn = () => setZoom((z) => Math.min(z + 25, 200))
  const handleZoomOut = () => setZoom((z) => Math.max(z - 25, 50))
  const handleRotate = () => setRotation((r) => (r + 90) % 360)

  const handleApprove = async (note: string) => {
    if (onApprove) {
      await onApprove(document.id, note)
    }
  }

  const handleReject = async (reason: string) => {
    if (onReject) {
      await onReject(document.id, reason)
    }
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !onRequestInfo) return

    setSubmittingComment(true)
    try {
      await onRequestInfo(document.id, newComment)
      setNewComment("")
    } finally {
      setSubmittingComment(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

        {/* Modal */}
        <div className="relative flex w-full max-w-6xl mx-auto my-4 bg-[#0A2A43] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          {/* Left: Image Preview */}
          <div className="flex-1 flex flex-col min-w-0 border-r border-white/10">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="font-semibold text-white truncate">{document.docType}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleZoomOut}
                  className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-sm text-white/60 w-12 text-center">{zoom}%</span>
                <button
                  onClick={handleZoomIn}
                  className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={handleRotate}
                  className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                  aria-label="Rotate"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Image Area */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/20">
              <div
                style={{
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                  transition: "transform 0.2s ease",
                }}
              >
                <Image
                  src={document.imageUrl || "/placeholder.svg?height=600&width=400&query=document"}
                  alt={`${document.docType} for ${document.citizenName}`}
                  width={400}
                  height={600}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Right: Details Panel */}
          <div className="w-96 flex flex-col flex-shrink-0">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h4 className="font-semibold text-white">Document Details</h4>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Details */}
            <div className="p-4 space-y-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Status</span>
                <GovStatusBadge status={document.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Citizen Name</span>
                <span className="text-sm font-medium text-white">{document.citizenName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">NIN</span>
                <span className="text-sm font-mono text-white/80">{document.nin}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Submitted</span>
                <span className="text-sm text-white/80">{formatDate(document.uploadDate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">AI Score</span>
                <span className={cn("text-sm font-semibold", isLowScore ? "text-red-400" : "text-emerald-400")}>
                  {(document.aiScore * 100).toFixed(0)}%
                </span>
              </div>
              {document.onChainHash && (
                <div className="pt-2 border-t border-white/10">
                  <p className="text-xs text-white/60 mb-1">Blockchain Hash</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs font-mono text-[#2DC5A0] truncate">{document.onChainHash}</code>
                    <a
                      href={`https://explorer.solana.com/tx/${document.txId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-white/50 hover:text-[#2DC5A0] transition-colors"
                      aria-label="View on Solana Explorer"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10">
              {(["preview", "ocr", "comments"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex-1 px-4 py-3 text-sm font-medium transition-colors",
                    activeTab === tab ? "text-[#2DC5A0] border-b-2 border-[#2DC5A0]" : "text-white/60 hover:text-white",
                  )}
                >
                  {tab === "preview" && "Info"}
                  {tab === "ocr" && "OCR Text"}
                  {tab === "comments" && `Comments (${document.comments.length})`}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === "preview" && (
                <div className="space-y-3">
                  {isLowScore && (
                    <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                      <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-400">Low AI Confidence</p>
                        <p className="text-xs text-red-400/80 mt-1">
                          AI flagged potential issues. Manual verification required.
                        </p>
                      </div>
                    </div>
                  )}
                  <p className="text-sm text-white/60">
                    Review the document image and OCR text before approving or rejecting.
                  </p>
                </div>
              )}

              {activeTab === "ocr" && (
                <pre className="text-sm text-white/80 whitespace-pre-wrap font-mono bg-white/5 p-3 rounded-lg">
                  {document.ocrText || "No OCR text available"}
                </pre>
              )}

              {activeTab === "comments" && (
                <div className="space-y-4">
                  {document.comments.length === 0 ? (
                    <p className="text-sm text-white/50 text-center py-4">No comments yet</p>
                  ) : (
                    document.comments.map((comment) => (
                      <div key={comment.id} className="p-3 bg-white/5 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-white">{comment.authorName}</span>
                          <span className="text-xs text-white/50">{formatDate(comment.timestamp)}</span>
                        </div>
                        <p className="text-sm text-white/70">{comment.text}</p>
                      </div>
                    ))
                  )}
                  <div className="pt-4 border-t border-white/10">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Request more information..."
                      rows={2}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#2DC5A0]/50 resize-none"
                    />
                    <button
                      onClick={handleSubmitComment}
                      disabled={!newComment.trim() || submittingComment}
                      className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      {submittingComment && <Loader2 className="w-4 h-4 animate-spin" />}
                      <MessageSquare className="w-4 h-4" />
                      Request Info
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-white/10 space-y-2">
              {isLowScore && (
                <p className="text-xs text-amber-400 flex items-center gap-1 mb-2">
                  <AlertTriangle className="w-3 h-3" />
                  Caution: Low AI score detected
                </p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
                <button
                  onClick={() => setShowApproveModal(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      <GovConfirmModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onConfirm={handleApprove}
        title="Approve Document"
        description={`Approve ${document.docType} for ${document.citizenName}? This action will be recorded on the blockchain.`}
        type="approve"
        notePlaceholder="Enter verification notes (e.g., 'All details verified against database')..."
      />

      {/* Reject Modal */}
      <GovConfirmModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleReject}
        title="Reject Document"
        description={`Reject ${document.docType} for ${document.citizenName}? The citizen will be notified.`}
        type="reject"
        notePlaceholder="Enter rejection reason (required)..."
      />
    </>
  )
}
