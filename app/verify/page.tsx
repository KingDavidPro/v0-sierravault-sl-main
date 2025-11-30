"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Shield, Search, CheckCircle, XCircle, FileText, Calendar, User, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { BlockchainBadge } from "@/components/blockchain-badge"
import { StatusBadge } from "@/components/status-badge"
import { getDocumentById, formatDate } from "@/lib/mock-data"
import { ChatWidget } from "@/components/chatbot/chat-widget"

type VerifyState = "idle" | "searching" | "found" | "not-found"

export default function VerifyPage() {
  const [verifyState, setVerifyState] = useState<VerifyState>("idle")
  const [searchInput, setSearchInput] = useState("")
  const [verifiedDoc, setVerifiedDoc] = useState<ReturnType<typeof getDocumentById>>(undefined)

  const handleVerify = async () => {
    if (!searchInput.trim()) return

    setVerifyState("searching")

    // Simulate search delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Try to find document by ID or transaction ID
    const doc = getDocumentById(searchInput) || getDocumentById("doc_1001") // Demo fallback

    if (searchInput.includes("doc_") || searchInput.includes("TX_DEMO") || searchInput.includes("0x")) {
      setVerifiedDoc(doc)
      setVerifyState("found")
    } else {
      setVerifyState("not-found")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-navy py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal/10">
              <Shield className="h-8 w-8 text-teal" />
            </div>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Verify a Document</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Check the authenticity of any SierraVault document using its ID, transaction hash, or verification link.
            </p>
          </div>
        </section>

        {/* Verification Form */}
        <section className="bg-navy-dark py-12">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <Card className="border-border bg-card p-6 sm:p-8">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleVerify()
                }}
                className="space-y-4"
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter document ID, TX hash, or verification code..."
                    className="h-14 pl-12 pr-4 bg-secondary border-border text-lg"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 bg-teal text-navy-dark hover:bg-teal-light text-lg"
                  disabled={verifyState === "searching"}
                >
                  {verifyState === "searching" ? "Verifying..." : "Verify Document"}
                </Button>
              </form>

              {/* Demo hint */}
              <p className="mt-4 text-xs text-muted-foreground text-center">
                Try: <code className="bg-secondary px-1.5 py-0.5 rounded">doc_1001</code> or{" "}
                <code className="bg-secondary px-1.5 py-0.5 rounded">TX_DEMO_20250915_01</code>
              </p>
            </Card>

            {/* Results */}
            {verifyState === "found" && verifiedDoc && (
              <Card className="mt-6 border-teal/30 bg-card p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal/10">
                    <CheckCircle className="h-6 w-6 text-teal" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Document Verified</h2>
                    <p className="text-sm text-muted-foreground">This document is authentic and unaltered</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Document Info */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Document Type</p>
                        <p className="text-sm font-medium text-foreground">{verifiedDoc.docType}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Owner</p>
                        <p className="text-sm font-medium text-foreground">{verifiedDoc.ownerName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Secured On</p>
                        <p className="text-sm font-medium text-foreground">{formatDate(verifiedDoc.uploadDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Issuer</p>
                        <p className="text-sm font-medium text-foreground capitalize">{verifiedDoc.issuer}</p>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <StatusBadge status={verifiedDoc.status} />
                    <span className="text-sm text-muted-foreground">
                      AI Score: <span className="text-teal font-medium">{Math.round(verifiedDoc.aiScore * 100)}%</span>
                    </span>
                  </div>

                  {/* Blockchain */}
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">Blockchain Record</p>
                    <BlockchainBadge txId={verifiedDoc.txId} hash={verifiedDoc.onChainHash} showFullHash />
                  </div>
                </div>
              </Card>
            )}

            {verifyState === "not-found" && (
              <Card className="mt-6 border-destructive/30 bg-card p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                    <XCircle className="h-6 w-6 text-destructive" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Document Not Found</h2>
                    <p className="text-sm text-muted-foreground">We couldn&apos;t verify this document</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">Possible reasons:</p>
                    <ul className="mt-1 list-disc list-inside space-y-1">
                      <li>The document ID or hash may be incorrect</li>
                      <li>The document may not exist in our system</li>
                      <li>The verification link may have expired</li>
                    </ul>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </section>

        {/* How it works */}
        <section className="bg-navy py-12 lg:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">How Verification Works</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal/10">
                  <span className="text-lg font-bold text-teal">1</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Enter Details</h3>
                <p className="text-sm text-muted-foreground">
                  Paste the document ID, transaction hash, or scan the QR code
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal/10">
                  <span className="text-lg font-bold text-teal">2</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Blockchain Check</h3>
                <p className="text-sm text-muted-foreground">
                  We verify the document hash against the Solana blockchain record
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal/10">
                  <span className="text-lg font-bold text-teal">3</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Get Results</h3>
                <p className="text-sm text-muted-foreground">
                  Instantly see if the document is authentic and unaltered
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  )
}
