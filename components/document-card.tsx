import Link from "next/link"
import { FileText, Eye, Share2, Lock, MoreVertical, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BlockchainBadge } from "@/components/blockchain-badge"
import { StatusBadge } from "@/components/status-badge"
import { formatDate, type Document } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface DocumentCardProps {
  document: Document
  variant?: "default" | "compact"
}

export function DocumentCard({ document, variant = "default" }: DocumentCardProps) {
  const isCompact = variant === "compact"

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-border bg-card transition-all hover:border-teal/30 hover:shadow-lg hover:shadow-teal/5",
        isCompact ? "p-3" : "p-4",
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex items-center justify-center rounded-lg bg-teal/10",
              isCompact ? "h-10 w-10" : "h-12 w-12",
            )}
          >
            <FileText className={cn("text-teal", isCompact ? "h-5 w-5" : "h-6 w-6")} />
          </div>
          <div>
            <h3 className={cn("font-semibold text-foreground", isCompact ? "text-sm" : "text-base")}>
              {document.docType}
            </h3>
            <p className="text-xs text-muted-foreground">Uploaded {formatDate(document.uploadDate)}</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/documents/${document.docId}`} className="flex items-center gap-2">
                <Eye className="h-4 w-4" /> View Document
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <Share2 className="h-4 w-4" /> Share Link
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" /> View on Blockchain
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Status badges */}
      <div className={cn("flex flex-wrap items-center gap-2", isCompact ? "mt-3" : "mt-4")}>
        <StatusBadge status={document.status} />
        <div className="flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs">
          {document.visibility === "private" ? (
            <>
              <Lock className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Private</span>
            </>
          ) : (
            <>
              <Share2 className="h-3 w-3 text-flag-blue" />
              <span className="text-flag-blue">Shared</span>
            </>
          )}
        </div>
      </div>

      {/* AI Score */}
      {!isCompact && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">AI Authenticity Score</span>
            <span className="font-medium text-teal">{Math.round(document.aiScore * 100)}%</span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-teal transition-all"
              style={{ width: `${document.aiScore * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Blockchain Badge */}
      <div className={cn(isCompact ? "mt-3" : "mt-4")}>
        <BlockchainBadge txId={document.txId} hash={document.onChainHash} size={isCompact ? "sm" : "md"} />
      </div>
    </Card>
  )
}
