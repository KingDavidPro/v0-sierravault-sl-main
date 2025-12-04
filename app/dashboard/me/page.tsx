import { FileText, Upload, Share2, Shield, Plus, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StatsCard } from "@/components/stats-card"
import { DocumentCard } from "@/components/document-card"
import { currentUser, getUserDocuments, formatDate } from "@/lib/mock-data"

export default function DashboardPage() {
  const userDocuments = getUserDocuments(currentUser.id)
  const recentDocuments = userDocuments.slice(0, 3)

  const stats = {
    totalDocuments: userDocuments.length,
    verifiedDocuments: userDocuments.filter((d) => d.status === "verified").length,
    sharedDocuments: userDocuments.filter((d) => d.visibility === "shared").length,
    storageUsed: "14.1 MB",
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
          Welcome back, {currentUser.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-muted-foreground">Your vault is secure. Here&apos;s an overview of your documents.</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={FileText}
          label="Total Documents"
          value={stats.totalDocuments}
          change="+2 this month"
          trend="up"
        />
        <StatsCard icon={Shield} label="Verified" value={stats.verifiedDocuments} change="100%" trend="up" />
        <StatsCard icon={Share2} label="Shared" value={stats.sharedDocuments} change="1 active link" trend="neutral" />
        <StatsCard icon={Upload} label="Storage Used" value={stats.storageUsed} change="of 1 GB" trend="neutral" />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/dashboard/upload">
            <Card className="group border-border bg-card p-4 hover:border-teal/30 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal/10 group-hover:bg-teal/20 transition-colors">
                  <Plus className="h-6 w-6 text-teal" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Upload Document</h3>
                  <p className="text-sm text-muted-foreground">Secure a new document</p>
                </div>
              </div>
            </Card>
          </Link>
          <Link href="/verify">
            <Card className="group border-border bg-card p-4 hover:border-teal/30 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-flag-blue/10 group-hover:bg-flag-blue/20 transition-colors">
                  <Shield className="h-6 w-6 text-flag-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Verify Document</h3>
                  <p className="text-sm text-muted-foreground">Check authenticity</p>
                </div>
              </div>
            </Card>
          </Link>
          <Link href="/dashboard/documents">
            <Card className="group border-border bg-card p-4 hover:border-teal/30 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-flag-green/10 group-hover:bg-flag-green/20 transition-colors">
                  <FileText className="h-6 w-6 text-flag-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">View All</h3>
                  <p className="text-sm text-muted-foreground">Browse your vault</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent Documents */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Recent Documents</h2>
          <Link href="/dashboard/documents">
            <Button variant="ghost" className="text-teal hover:text-teal-light gap-1">
              View all
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentDocuments.map((doc) => (
            <DocumentCard key={doc.docId} document={doc} />
          ))}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
        <Card className="border-border bg-card p-4">
          <div className="space-y-4">
            {userDocuments.slice(0, 4).map((doc, index) => (
              <div key={doc.docId} className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal/10 flex-shrink-0">
                  <FileText className="h-4 w-4 text-teal" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{doc.docType}</span> was uploaded and verified
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDate(doc.uploadDate)}</p>
                </div>
                {index === 0 && <span className="text-xs text-teal bg-teal/10 px-2 py-0.5 rounded-full">New</span>}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
