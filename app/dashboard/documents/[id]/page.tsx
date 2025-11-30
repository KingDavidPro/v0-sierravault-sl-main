"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download, Share2, Trash2, FileText, Calendar, User, Shield, Copy, Check, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BlockchainBadge } from "@/components/blockchain-badge"
import { StatusBadge } from "@/components/status-badge"
import { getDocumentById, formatDate } from "@/lib/mock-data"

export default function DocumentViewPage() {
  const params = useParams()
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  const document = getDocumentById(params.id as string)

  if (!document) {
    return (
      <div className="p-4 lg:p-8 flex items-center justify-center min-h-[50vh]">
        <Card className="border-border bg-card p-8 text-center max-w-md">
          <h2 className="text-xl font-bold text-foreground mb-2">Document Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The document you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/dashboard/documents">
            <Button className="bg-teal text-navy-dark hover:bg-teal-light">Back to Documents</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const handleCopyHash = () => {
    navigator.clipboard.writeText(document.onChainHash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const verificationLink = `https://sierravault.sl/verify/${document.docId}`

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Go back</span>
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{document.docType}</h1>
          <p className="text-sm text-muted-foreground">Uploaded {formatDate(document.uploadDate)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-border text-foreground gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download</span>
          </Button>
          <Button className="bg-teal text-navy-dark hover:bg-teal-light gap-2" onClick={() => setShowShareModal(true)}>
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Document Preview */}
        <div className="lg:col-span-2">
          <Card className="border-border bg-card overflow-hidden">
            <div className="aspect-[4/3] bg-navy flex items-center justify-center">
              <div className="text-center p-8">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-teal/10">
                  <FileText className="h-10 w-10 text-teal" />
                </div>
                <p className="text-muted-foreground">Document Preview</p>
                <p className="text-sm text-muted-foreground mt-1">{document.fileSize}</p>
              </div>
            </div>

            {/* OCR Text */}
            <div className="p-6 border-t border-border">
              <h3 className="text-sm font-semibold text-foreground mb-2">Extracted Text (OCR)</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{document.ocrText}</p>
            </div>
          </Card>
        </div>

        {/* Document Details */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card className="border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Status</h3>
            <div className="flex items-center gap-3">
              <StatusBadge status={document.status} />
              <span className="text-sm text-muted-foreground">
                {document.status === "verified" ? "This document has been verified" : "Verification pending"}
              </span>
            </div>
          </Card>

          {/* Details Card */}
          <Card className="border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Details</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Document Type</p>
                  <p className="text-sm text-foreground">{document.docType}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Owner</p>
                  <p className="text-sm text-foreground">{document.ownerName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Upload Date</p>
                  <p className="text-sm text-foreground">{formatDate(document.uploadDate)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Issuer</p>
                  <p className="text-sm text-foreground capitalize">{document.issuer}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* AI Score Card */}
          <Card className="border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">AI Authenticity Score</h3>
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-secondary"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${document.aiScore * 100}, 100`}
                    className="text-teal"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-teal">
                  {Math.round(document.aiScore * 100)}%
                </span>
              </div>
              <div>
                <p className="text-sm text-foreground font-medium">High Confidence</p>
                <p className="text-xs text-muted-foreground">AI analysis complete</p>
              </div>
            </div>
          </Card>

          {/* Blockchain Card */}
          <Card className="border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Blockchain Record</h3>
            <BlockchainBadge txId={document.txId} hash={document.onChainHash} showFullHash />
            <button
              onClick={handleCopyHash}
              className="mt-3 flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-teal" />
                  <span className="text-teal">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy full hash</span>
                </>
              )}
            </button>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/30 bg-destructive/5 p-4">
            <h3 className="text-sm font-semibold text-destructive mb-2">Danger Zone</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Deleting a document will remove it from your vault. The blockchain record will remain.
            </p>
            <Button
              variant="outline"
              className="w-full border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Document
            </Button>
          </Card>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/80 backdrop-blur-sm">
          <Card className="border-border bg-card p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-foreground mb-2">Share Document</h2>
            <p className="text-sm text-muted-foreground mb-4">Generate a verification link that expires in 7 days.</p>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary mb-4">
              <Link2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-foreground truncate flex-1">{verificationLink}</span>
              <Button
                size="sm"
                variant="ghost"
                className="text-teal hover:text-teal-light"
                onClick={() => {
                  navigator.clipboard.writeText(verificationLink)
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-border bg-transparent"
                onClick={() => setShowShareModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-teal text-navy-dark hover:bg-teal-light"
                onClick={() => {
                  navigator.clipboard.writeText(verificationLink)
                  setShowShareModal(false)
                }}
              >
                Copy Link
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
