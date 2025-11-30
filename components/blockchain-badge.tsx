import { ExternalLink, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface BlockchainBadgeProps {
  txId: string
  hash: string
  size?: "sm" | "md"
  showFullHash?: boolean
}

export function BlockchainBadge({ txId, hash, size = "md", showFullHash = false }: BlockchainBadgeProps) {
  const truncatedHash = showFullHash ? hash : `${hash.slice(0, 8)}...${hash.slice(-6)}`
  const truncatedTxId = `${txId.slice(0, 12)}...`

  // TODO: Replace with actual Solana explorer URL
  // Solana RPC: process.env.NEXT_PUBLIC_SOLANA_RPC_URL
  const explorerUrl = `https://explorer.solana.com/tx/${txId}?cluster=devnet`

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border border-solana/30 bg-solana/10",
        size === "sm" ? "px-2 py-1" : "px-3 py-2",
      )}
    >
      <CheckCircle className={cn("text-teal", size === "sm" ? "h-3 w-3" : "h-4 w-4")} />
      <div className="flex flex-col">
        <span className={cn("font-mono text-solana", size === "sm" ? "text-[10px]" : "text-xs")}>
          On-chain: {truncatedTxId}
        </span>
        <span className={cn("font-mono text-muted-foreground", size === "sm" ? "text-[9px]" : "text-[10px]")}>
          Hash: {truncatedHash}
        </span>
      </div>
      <a
        href={explorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-auto text-muted-foreground transition-colors hover:text-solana"
        aria-label="View on Solana Explorer"
      >
        <ExternalLink className={cn(size === "sm" ? "h-3 w-3" : "h-4 w-4")} />
      </a>
    </div>
  )
}
