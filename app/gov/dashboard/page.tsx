"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  FileCheck,
  FilePlus,
  Search,
  UserPlus,
  Clock,
  FileText,
  Users,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Loader2,
} from "lucide-react"
import { GovPageHeader } from "@/components/gov/gov-page-header"
import { GovStatsCard } from "@/components/gov/gov-stats-card"
import { GovAiScoreIndicator } from "@/components/gov/gov-ai-score-indicator"
import { govApiGetDashboardStats, govApiGetAuditLogs, govApiGetPendingDocs } from "@/lib/gov-api-mock"
import type { DashboardStats, AuditLogEntry, PendingDocument } from "@/lib/gov-api-mock"

export default function GovDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<AuditLogEntry[]>([])
  const [urgentDocs, setUrgentDocs] = useState<PendingDocument[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, logsData, docsData] = await Promise.all([
          govApiGetDashboardStats(),
          govApiGetAuditLogs({}),
          govApiGetPendingDocs({ status: "needs_review" }),
        ])
        setStats(statsData)
        setRecentActivity(logsData.slice(0, 5))
        setUrgentDocs(docsData.slice(0, 3))
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatRelativeTime = (date: string) => {
    const now = new Date()
    const then = new Date(date)
    const diffMs = now.getTime() - then.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  const getActionColor = (action: string) => {
    if (action.includes("APPROVED")) return "text-emerald-400"
    if (action.includes("REJECTED")) return "text-red-400"
    if (action.includes("ISSUED")) return "text-blue-400"
    if (action.includes("LOGIN")) return "text-amber-400"
    return "text-white/70"
  }

  const quickActions = [
    { href: "/gov/issue", label: "Issue Document", icon: FilePlus, color: "bg-[#2DC5A0]" },
    { href: "/gov/pending", label: "Review Pending", icon: FileCheck, color: "bg-amber-500" },
    { href: "/gov/pending?search=", label: "Search by NIN", icon: Search, color: "bg-blue-500" },
    { href: "/gov/users?action=create", label: "Create User", icon: UserPlus, color: "bg-purple-500" },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#2DC5A0] animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <GovPageHeader
        title="Dashboard"
        description="Welcome back. Here's an overview of your document management system."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <GovStatsCard
          title="Pending Verifications"
          value={stats?.pendingVerifications || 0}
          icon={Clock}
          href="/gov/pending"
          change={stats?.pendingVerifications && stats.pendingVerifications > 3 ? "+2 today" : undefined}
          changeType="neutral"
        />
        <GovStatsCard
          title="Documents Issued (30d)"
          value={stats?.documentsIssuedLast30d || 0}
          icon={FileText}
          href="/gov/audit?action=DOCUMENT_ISSUED"
          change="+12% vs last month"
          changeType="positive"
        />
        <GovStatsCard title="Active Officers" value={stats?.activeOfficers || 0} icon={Users} href="/gov/users" />
        <GovStatsCard
          title="Audit Alerts"
          value={stats?.auditAlerts || 0}
          icon={AlertTriangle}
          href="/gov/audit"
          change={stats?.auditAlerts && stats.auditAlerts > 0 ? "Requires attention" : undefined}
          changeType={stats?.auditAlerts && stats.auditAlerts > 0 ? "negative" : "neutral"}
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex flex-col items-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#2DC5A0]/30 rounded-xl transition-all group"
            >
              <div
                className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-white text-center">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent Documents */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Requires Attention
            </h2>
            <Link
              href="/gov/pending?status=needs_review"
              className="text-sm text-[#2DC5A0] hover:text-[#2DC5A0]/80 flex items-center gap-1 transition-colors"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="divide-y divide-white/10">
            {urgentDocs.length === 0 ? (
              <div className="p-8 text-center text-white/50">
                <FileCheck className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p>No documents requiring urgent review</p>
              </div>
            ) : (
              urgentDocs.map((doc) => (
                <Link
                  key={doc.id}
                  href={`/gov/pending?docId=${doc.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-white/60" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{doc.citizenName}</p>
                    <p className="text-sm text-white/50">{doc.docType}</p>
                  </div>
                  <div className="text-right">
                    <GovAiScoreIndicator score={doc.aiScore} showLabel={false} size="sm" />
                    <p className="text-xs text-white/40 mt-1">{formatRelativeTime(doc.uploadDate)}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
            <Link
              href="/gov/audit"
              className="text-sm text-[#2DC5A0] hover:text-[#2DC5A0]/80 flex items-center gap-1 transition-colors"
            >
              View Audit Log <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="divide-y divide-white/10">
            {recentActivity.length === 0 ? (
              <div className="p-8 text-center text-white/50">
                <Clock className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p>No recent activity</p>
              </div>
            ) : (
              recentActivity.map((log) => (
                <div key={log.id} className="p-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">
                        <span className="font-medium">{log.actorName}</span>
                        <span className={`ml-2 ${getActionColor(log.action)}`}>{log.action.replace(/_/g, " ")}</span>
                      </p>
                      {log.targetDocId && (
                        <p className="text-xs text-white/50 mt-1 truncate">Document: {log.targetDocId}</p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-white/50">{formatRelativeTime(log.timestamp)}</p>
                      <p className="text-xs text-white/30 mt-0.5">{log.ip}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Blockchain Status */}
      <div className="mt-6 p-4 bg-[#2DC5A0]/10 border border-[#2DC5A0]/30 rounded-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-[#2DC5A0] rounded-full animate-pulse" />
            <span className="text-sm text-white">
              <span className="font-medium">Blockchain Status:</span> Connected to Solana (Mock Mode)
            </span>
          </div>
          <a
            href="https://explorer.solana.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-[#2DC5A0] hover:text-[#2DC5A0]/80 transition-colors"
          >
            View Explorer <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  )
}
