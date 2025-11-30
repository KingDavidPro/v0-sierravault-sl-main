"use client"

import { useState, useEffect } from "react"
import {
  UserPlus,
  Building2,
  Search,
  Mail,
  Phone,
  MoreVertical,
  Edit,
  Trash2,
  ShieldOff,
  ChevronDown,
  X,
  Loader2,
} from "lucide-react"
import { GovPageHeader } from "@/components/gov/gov-page-header"
import { GovRoleBadge } from "@/components/gov/gov-role-badge"
import { GovStatusBadge } from "@/components/gov/gov-status-badge"
import { GovSkeletonTable } from "@/components/gov/gov-skeleton-table"
import { GovConfirmModal } from "@/components/gov/gov-confirm-modal"
import { useToast } from "@/components/gov/gov-toast"
import { govApiListOfficers, govApiListAgencies, govApiCreateOfficer, govApiSuspendOfficer } from "@/lib/gov-api-mock"
import { type GovOfficer, type Agency, type GovRole, roleLabels } from "@/lib/gov-mock-data"
import { cn } from "@/lib/utils"

const roles: GovRole[] = ["GOV_ADMIN", "GOV_ISSUER", "GOV_SUPERVISOR", "GOV_AUDITOR", "GOV_READONLY"]

export default function GovUsersPage() {
  const { showToast } = useToast()

  const [officers, setOfficers] = useState<GovOfficer[]>([])
  const [agencies, setAgencies] = useState<Agency[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [agencyFilter, setAgencyFilter] = useState("")

  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviting, setInviting] = useState(false)
  const [newOfficer, setNewOfficer] = useState({
    name: "",
    email: "",
    phone: "",
    role: "GOV_READONLY" as GovRole,
    agencyId: "",
  })

  const [suspendingOfficer, setSuspendingOfficer] = useState<GovOfficer | null>(null)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const [officersData, agenciesData] = await Promise.all([govApiListOfficers(), govApiListAgencies()])
        setOfficers(officersData)
        setAgencies(agenciesData)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredOfficers = officers.filter((officer) => {
    const matchesSearch =
      !searchQuery ||
      officer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      officer.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAgency = !agencyFilter || officer.agencyId === agencyFilter
    return matchesSearch && matchesAgency
  })

  const getAgencyName = (agencyId: string) => {
    const agency = agencies.find((a) => a.id === agencyId)
    return agency?.name || agencyId
  }

  const getAgencyCode = (agencyId: string) => {
    const agency = agencies.find((a) => a.id === agencyId)
    return agency?.code || "---"
  }

  const handleInvite = async () => {
    if (!newOfficer.name || !newOfficer.email || !newOfficer.agencyId) {
      showToast("error", "Validation Error", "Please fill all required fields")
      return
    }

    setInviting(true)
    try {
      const result = await govApiCreateOfficer(newOfficer)
      if (result.success && result.officer) {
        setOfficers((prev) => [...prev, result.officer!])
        showToast("success", "Invitation Sent", `Invite sent to ${newOfficer.email}`)
        setShowInviteModal(false)
        setNewOfficer({ name: "", email: "", phone: "", role: "GOV_READONLY", agencyId: "" })
      }
    } catch (error) {
      showToast("error", "Invitation Failed", "Could not send invitation")
    } finally {
      setInviting(false)
    }
  }

  const handleSuspend = async (note: string) => {
    if (!suspendingOfficer) return

    try {
      const result = await govApiSuspendOfficer(suspendingOfficer.id, note)
      if (result.success) {
        setOfficers((prev) =>
          prev.map((o) => (o.id === suspendingOfficer.id ? { ...o, status: "suspended" as const } : o)),
        )
        showToast("success", "User Suspended", `${suspendingOfficer.name} has been suspended`)
      }
    } catch (error) {
      showToast("error", "Suspension Failed", "Could not suspend user")
    }
    setSuspendingOfficer(null)
  }

  return (
    <div>
      <GovPageHeader
        title="Users & Agencies"
        description="Manage government officers and agency access"
        actions={
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#2DC5A0] hover:bg-[#2DC5A0]/90 text-[#0A2A43] font-semibold rounded-lg transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Invite User
          </button>
        }
      />

      {/* Agencies Overview */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#2DC5A0]" />
          Agencies
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {agencies.map((agency) => {
            const agencyOfficers = officers.filter((o) => o.agencyId === agency.id)
            const activeCount = agencyOfficers.filter((o) => o.status === "active").length

            return (
              <button
                key={agency.id}
                onClick={() => setAgencyFilter(agencyFilter === agency.id ? "" : agency.id)}
                className={cn(
                  "p-4 rounded-xl border text-left transition-all",
                  agencyFilter === agency.id
                    ? "bg-[#2DC5A0]/20 border-[#2DC5A0]/50"
                    : "bg-white/5 border-white/10 hover:bg-white/10",
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-[#2DC5A0]">{agency.code}</span>
                  <span className="text-xs text-white/50">{activeCount} active</span>
                </div>
                <p className="font-medium text-white text-sm truncate">{agency.name}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#2DC5A0]/50"
          />
        </div>
        {agencyFilter && (
          <button
            onClick={() => setAgencyFilter("")}
            className="flex items-center gap-2 px-4 py-3 bg-[#2DC5A0]/20 border border-[#2DC5A0]/50 text-[#2DC5A0] rounded-xl"
          >
            {getAgencyCode(agencyFilter)}
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Officers Table */}
      {loading ? (
        <GovSkeletonTable rows={5} columns={6} />
      ) : filteredOfficers.length === 0 ? (
        <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
          <UserPlus className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No officers found</h3>
          <p className="text-white/60 mb-4">
            {searchQuery || agencyFilter ? "Try adjusting your search" : "Start by inviting your first team member"}
          </p>
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2 bg-[#2DC5A0] text-[#0A2A43] font-semibold rounded-lg"
          >
            Invite User
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-white/60 border-b border-white/10">
                <th className="pb-4 pl-4 font-medium">Officer</th>
                <th className="pb-4 font-medium hidden md:table-cell">Agency</th>
                <th className="pb-4 font-medium hidden lg:table-cell">Contact</th>
                <th className="pb-4 font-medium">Role</th>
                <th className="pb-4 font-medium">Status</th>
                <th className="pb-4 pr-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredOfficers.map((officer) => (
                <tr key={officer.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 pl-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#2DC5A0]/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-[#2DC5A0] font-semibold">
                          {officer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{officer.name}</p>
                        <p className="text-xs text-white/50 md:hidden">{getAgencyCode(officer.agencyId)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 hidden md:table-cell">
                    <p className="text-sm text-white/70">{getAgencyName(officer.agencyId)}</p>
                  </td>
                  <td className="py-4 hidden lg:table-cell">
                    <div className="space-y-1">
                      <p className="text-sm text-white/70 flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {officer.email}
                      </p>
                      {officer.phone && (
                        <p className="text-xs text-white/50 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {officer.phone}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-4">
                    <GovRoleBadge role={officer.role} />
                  </td>
                  <td className="py-4">
                    <GovStatusBadge status={officer.status} />
                  </td>
                  <td className="py-4 pr-4">
                    <div className="relative flex justify-end">
                      <button
                        onClick={() => setActiveMenu(activeMenu === officer.id ? null : officer.id)}
                        className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {activeMenu === officer.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                          <div className="absolute right-0 top-full mt-1 w-48 bg-[#0A2A43] border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden">
                            <button
                              onClick={() => {
                                setActiveMenu(null)
                                // TODO: Open edit modal
                              }}
                              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                              Edit User
                            </button>
                            {officer.status === "active" && (
                              <button
                                onClick={() => {
                                  setActiveMenu(null)
                                  setSuspendingOfficer(officer)
                                }}
                                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-amber-400 hover:bg-amber-500/20 transition-colors"
                              >
                                <ShieldOff className="w-4 h-4" />
                                Suspend User
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setActiveMenu(null)
                                // TODO: Confirm delete
                              }}
                              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/20 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove User
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowInviteModal(false)} />

          <div className="relative w-full max-w-md bg-[#0A2A43] border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">Invite New Officer</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={newOfficer.name}
                  onChange={(e) => setNewOfficer((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="John Kamara"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#2DC5A0]/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={newOfficer.email}
                  onChange={(e) => setNewOfficer((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="john.k@agency.gov.sl"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#2DC5A0]/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Phone</label>
                <input
                  type="tel"
                  value={newOfficer.phone}
                  onChange={(e) => setNewOfficer((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="+232-XX-XXXXXX"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#2DC5A0]/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Agency <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    value={newOfficer.agencyId}
                    onChange={(e) => setNewOfficer((prev) => ({ ...prev, agencyId: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:border-[#2DC5A0]/50"
                  >
                    <option value="" className="bg-[#0A2A43]">
                      Select agency...
                    </option>
                    {agencies.map((agency) => (
                      <option key={agency.id} value={agency.id} className="bg-[#0A2A43]">
                        {agency.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Role <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    value={newOfficer.role}
                    onChange={(e) => setNewOfficer((prev) => ({ ...prev, role: e.target.value as GovRole }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:border-[#2DC5A0]/50"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role} className="bg-[#0A2A43]">
                        {roleLabels[role]}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
                </div>
              </div>

              <div className="pt-2 p-3 bg-[#2DC5A0]/10 border border-[#2DC5A0]/30 rounded-xl">
                <p className="text-sm text-[#2DC5A0]">
                  An invitation email will be sent with a secure setup link. The user will be required to enable 2FA on
                  first login.
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-white/10 bg-white/5">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleInvite}
                disabled={inviting || !newOfficer.name || !newOfficer.email || !newOfficer.agencyId}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2DC5A0] hover:bg-[#2DC5A0]/90 text-[#0A2A43] font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {inviting && <Loader2 className="w-4 h-4 animate-spin" />}
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Modal */}
      {suspendingOfficer && (
        <GovConfirmModal
          isOpen={true}
          onClose={() => setSuspendingOfficer(null)}
          onConfirm={handleSuspend}
          title="Suspend User"
          description={`Suspend ${suspendingOfficer.name}? They will lose access to all government portal features.`}
          type="warning"
          notePlaceholder="Enter reason for suspension..."
          confirmLabel="Suspend User"
        />
      )}
    </div>
  )
}
