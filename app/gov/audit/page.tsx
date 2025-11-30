"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { GovPageHeader } from "@/components/gov/gov-page-header"
import { GovBreadcrumbs } from "@/components/gov/gov-breadcrumbs"
import {
  Search,
  Download,
  Filter,
  Calendar,
  ChevronDown,
  Eye,
  FileText,
  UserCheck,
  UserX,
  Shield,
  LogIn,
  Settings,
  X,
  Clock,
  MapPin,
  Monitor,
} from "lucide-react"
import { govApi, type AuditLog } from "@/lib/gov-api-mock"

const actionIcons: Record<string, React.ReactNode> = {
  LOGIN: <LogIn className="w-4 h-4" />,
  LOGOUT: <LogIn className="w-4 h-4 rotate-180" />,
  APPROVE_DOC: <UserCheck className="w-4 h-4" />,
  REJECT_DOC: <UserX className="w-4 h-4" />,
  ISSUE_DOC: <FileText className="w-4 h-4" />,
  VIEW_DOC: <Eye className="w-4 h-4" />,
  UPDATE_SETTINGS: <Settings className="w-4 h-4" />,
  CREATE_USER: <Shield className="w-4 h-4" />,
}

const actionColors: Record<string, string> = {
  LOGIN: "text-blue-400 bg-blue-500/10",
  LOGOUT: "text-gray-400 bg-gray-500/10",
  APPROVE_DOC: "text-emerald-400 bg-emerald-500/10",
  REJECT_DOC: "text-red-400 bg-red-500/10",
  ISSUE_DOC: "text-teal-400 bg-teal-500/10",
  VIEW_DOC: "text-purple-400 bg-purple-500/10",
  UPDATE_SETTINGS: "text-amber-400 bg-amber-500/10",
  CREATE_USER: "text-indigo-400 bg-indigo-500/10",
}

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState<string>("all")
  const [dateRange, setDateRange] = useState({ from: "", to: "" })
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadLogs()
  }, [actionFilter, dateRange])

  const loadLogs = async () => {
    setLoading(true)
    const result = await govApi.auditLogs({
      agencyId: "agency_moi",
      action: actionFilter !== "all" ? actionFilter : undefined,
      dateFrom: dateRange.from || undefined,
      dateTo: dateRange.to || undefined,
    })
    setLogs(result)
    setLoading(false)
  }

  const filteredLogs = logs.filter(
    (log) =>
      log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const exportCSV = () => {
    const headers = ["Timestamp", "Actor", "Action", "Target", "IP Address", "Details"]
    const rows = filteredLogs.map((log) => [
      log.timestamp,
      log.actorName,
      log.action,
      log.targetDocId || "-",
      log.ipAddress,
      log.details,
    ])

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatTimestamp = (ts: string) => {
    const date = new Date(ts)
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    }
  }

  return (
    <div className="space-y-6">
      <GovBreadcrumbs items={[{ label: "Dashboard", href: "/gov/dashboard" }, { label: "Audit Logs" }]} />

      <GovPageHeader
        title="Audit Logs & Compliance"
        description="Chronological activity log for compliance and security monitoring"
      />

      {/* Filters Bar */}
      <div className="bg-[#0d3654]/50 backdrop-blur-sm border border-[#2DC5A0]/20 rounded-xl p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by actor, action, or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#0A2A43]/50 border border-[#2DC5A0]/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#2DC5A0]/50"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#0A2A43]/50 border border-[#2DC5A0]/20 rounded-lg text-gray-300 hover:border-[#2DC5A0]/50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>

            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#2DC5A0] text-[#0A2A43] font-medium rounded-lg hover:bg-[#2DC5A0]/90 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-[#2DC5A0]/10 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Action Type</label>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="w-full px-3 py-2 bg-[#0A2A43]/50 border border-[#2DC5A0]/20 rounded-lg text-white focus:outline-none focus:border-[#2DC5A0]/50"
              >
                <option value="all">All Actions</option>
                <option value="LOGIN">Login</option>
                <option value="LOGOUT">Logout</option>
                <option value="APPROVE_DOC">Approve Document</option>
                <option value="REJECT_DOC">Reject Document</option>
                <option value="ISSUE_DOC">Issue Document</option>
                <option value="VIEW_DOC">View Document</option>
                <option value="UPDATE_SETTINGS">Update Settings</option>
                <option value="CREATE_USER">Create User</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">From Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 bg-[#0A2A43]/50 border border-[#2DC5A0]/20 rounded-lg text-white focus:outline-none focus:border-[#2DC5A0]/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">To Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 bg-[#0A2A43]/50 border border-[#2DC5A0]/20 rounded-lg text-white focus:outline-none focus:border-[#2DC5A0]/50"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Logs Table */}
      <div className="bg-[#0d3654]/50 backdrop-blur-sm border border-[#2DC5A0]/20 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 bg-[#0A2A43]/50 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[#0A2A43]/50 rounded w-1/3" />
                  <div className="h-3 bg-[#0A2A43]/50 rounded w-2/3" />
                </div>
                <div className="h-4 bg-[#0A2A43]/50 rounded w-24" />
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-[#2DC5A0]/10">
            {filteredLogs.map((log) => {
              const { date, time } = formatTimestamp(log.timestamp)
              return (
                <div
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="flex items-center gap-4 p-4 hover:bg-[#0A2A43]/30 cursor-pointer transition-colors"
                >
                  {/* Action Icon */}
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${actionColors[log.action] || "text-gray-400 bg-gray-500/10"}`}
                  >
                    {actionIcons[log.action] || <FileText className="w-4 h-4" />}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{log.actorName}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-[#2DC5A0]">{log.action.replace("_", " ")}</span>
                    </div>
                    <p className="text-sm text-gray-400 truncate">{log.details}</p>
                  </div>

                  {/* Timestamp */}
                  <div className="text-right hidden sm:block">
                    <p className="text-sm text-white">{date}</p>
                    <p className="text-xs text-gray-400">{time}</p>
                  </div>

                  {/* View Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedLog(log)
                    }}
                    className="p-2 text-gray-400 hover:text-[#2DC5A0] transition-colors"
                    aria-label="View details"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              )
            })}

            {filteredLogs.length === 0 && (
              <div className="p-12 text-center">
                <FileText className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400">No audit logs found matching your criteria</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d3654] border border-[#2DC5A0]/20 rounded-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-4 border-b border-[#2DC5A0]/10">
              <h3 className="text-lg font-semibold text-white">Audit Log Details</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Action Badge */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${actionColors[selectedLog.action] || "text-gray-400 bg-gray-500/10"}`}
                >
                  {actionIcons[selectedLog.action] || <FileText className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-medium text-white">{selectedLog.action.replace("_", " ")}</p>
                  <p className="text-sm text-gray-400">by {selectedLog.actorName}</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="bg-[#0A2A43]/50 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400">Timestamp</p>
                    <p className="text-white">{new Date(selectedLog.timestamp).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400">IP Address</p>
                    <p className="text-white font-mono text-sm">{selectedLog.ipAddress}</p>
                  </div>
                </div>

                {selectedLog.targetDocId && (
                  <div className="flex items-start gap-3">
                    <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400">Target Document</p>
                      <p className="text-white font-mono text-sm">{selectedLog.targetDocId}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Monitor className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400">Details</p>
                    <p className="text-white">{selectedLog.details}</p>
                  </div>
                </div>
              </div>

              {/* Raw Payload */}
              <div>
                <p className="text-sm text-gray-400 mb-2">Raw Event Payload</p>
                <pre className="bg-[#0A2A43] rounded-lg p-3 text-xs text-gray-300 overflow-x-auto">
                  {JSON.stringify(selectedLog, null, 2)}
                </pre>
              </div>
            </div>

            <div className="p-4 border-t border-[#2DC5A0]/10">
              <button
                onClick={() => setSelectedLog(null)}
                className="w-full py-2.5 bg-[#0A2A43]/50 border border-[#2DC5A0]/20 text-white rounded-lg hover:border-[#2DC5A0]/50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
