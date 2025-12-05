import Link from "next/link"
import { FileText, CheckCircle, Lock, Share2, ExternalLink } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface DocumentCardProps {
  document: {
    docId: string
    docType: string
    uploadDate: string | Date
    url: string
    mimeType: string
    status?: "pending" | "verified" | "rejected"
    visibility?: "private" | "shared"
    txId?: string
    onChainHash?: string
    aiScore?: number
  }
}

export function DocumentCard({ document }: DocumentCardProps) {
  const formattedDate = new Date(document.uploadDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })

  const aiPercent = document.aiScore ? Math.round(document.aiScore * 100) : 0

  return (
      <Card className="relative border-border bg-card p-4 hover:shadow-lg transition-shadow">
        {/* Top: Type & Date */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal/10">
              <FileText className="h-6 w-6 text-teal" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">{document.docType}</h3>
              <p className="text-xs text-muted-foreground">Uploaded {formattedDate}</p>
            </div>
          </div>

          {/* Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/documents/${document.docId}`} className="flex items-center gap-2">
                  <FileText className="h-4 w-4" /> View Document
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(document.url)}
                  className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" /> Copy URL
              </DropdownMenuItem>
              {document.txId && (
                  <DropdownMenuItem asChild>
                    <Link
                        href={`https://explorer.solana.com/tx/${document.txId}`}
                        target="_blank"
                        className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" /> View on Blockchain
                    </Link>
                  </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-2 mb-3">
          {document.status === "verified" && (
              <span className="flex items-center gap-1 rounded-full bg-teal/10 px-2 py-1 text-xs text-teal font-medium">
            <CheckCircle className="h-3 w-3" /> Verified
          </span>
          )}
          {document.status === "pending" && (
              <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-600 font-medium">Pending</span>
          )}
          {document.visibility === "private" && (
              <span className="flex items-center gap-1 rounded-full bg-muted/10 px-2 py-1 text-xs font-medium">
            <Lock className="h-3 w-3" /> Private
          </span>
          )}
          {document.visibility === "shared" && (
              <span className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600">
            <Share2 className="h-3 w-3" /> Shared
          </span>
          )}
        </div>

        {/* AI Authenticity */}
        {document.aiScore !== undefined && (
            <div className="mb-3">
              <p className="text-xs text-muted-foreground mb-1">AI Authenticity Score</p>
              <div className="h-2 w-full rounded-full bg-muted/20">
                <div
                    className="h-2 rounded-full bg-teal transition-all"
                    style={{ width: `${aiPercent}%` }}
                ></div>
              </div>
            </div>
        )}

        {/* On-chain info */}
        {document.onChainHash && (
            <div className="mt-2 rounded-lg bg-purple-100 p-2 text-xs text-purple-700 break-all">
              <p className="font-medium">On-chain: {document.txId || "TX_DEMO_2025..."}</p>
              <p>Hash: {document.onChainHash}</p>
            </div>
        )}
      </Card>
  )
}
