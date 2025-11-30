"use client"

import { useState, useEffect } from "react"
import { Save, Loader2, Check, X, Info } from "lucide-react"
import { GovPageHeader } from "@/components/gov/gov-page-header"
import { GovRoleBadge } from "@/components/gov/gov-role-badge"
import { useToast } from "@/components/gov/gov-toast"
import { govApiGetRolePermissions, govApiUpdateRolePermissions } from "@/lib/gov-api-mock"
import { roleLabels, type GovRole, type RolePermission } from "@/lib/gov-mock-data"
import { cn } from "@/lib/utils"

const permissionLabels: Record<keyof RolePermission["permissions"], { label: string; description: string }> = {
  canViewPending: { label: "View Pending", description: "View pending document verifications" },
  canApprove: { label: "Approve", description: "Approve submitted documents" },
  canReject: { label: "Reject", description: "Reject submitted documents" },
  canIssue: { label: "Issue", description: "Issue new certified documents" },
  canManageUsers: { label: "Manage Users", description: "Create, edit, and suspend officers" },
  canManageRoles: { label: "Manage Roles", description: "Edit role permissions" },
  canViewAudit: { label: "View Audit", description: "Access audit logs and reports" },
  canExportData: { label: "Export Data", description: "Export data and generate reports" },
  canManageSettings: { label: "Settings", description: "Configure system settings" },
}

const permissionKeys = Object.keys(permissionLabels) as Array<keyof RolePermission["permissions"]>
const roles: GovRole[] = ["GOV_ADMIN", "GOV_SUPERVISOR", "GOV_ISSUER", "GOV_AUDITOR", "GOV_READONLY"]

export default function GovRolesPage() {
  const { showToast } = useToast()

  const [permissions, setPermissions] = useState<RolePermission[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    async function loadPermissions() {
      try {
        const data = await govApiGetRolePermissions()
        setPermissions(data)
      } finally {
        setLoading(false)
      }
    }
    loadPermissions()
  }, [])

  const handleToggle = (roleId: GovRole, permKey: keyof RolePermission["permissions"]) => {
    // Don't allow editing GOV_ADMIN permissions
    if (roleId === "GOV_ADMIN") return

    setPermissions((prev) =>
      prev.map((rp) => {
        if (rp.roleId === roleId) {
          return {
            ...rp,
            permissions: {
              ...rp.permissions,
              [permKey]: !rp.permissions[permKey],
            },
          }
        }
        return rp
      }),
    )
    setHasChanges(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Save each role's permissions
      for (const rp of permissions) {
        if (rp.roleId !== "GOV_ADMIN") {
          await govApiUpdateRolePermissions(rp.roleId, rp.permissions)
        }
      }
      showToast("success", "Permissions Saved", "Role permissions have been updated")
      setHasChanges(false)
    } catch (error) {
      showToast("error", "Save Failed", "Could not update permissions")
    } finally {
      setSaving(false)
    }
  }

  const getPermissionValue = (roleId: GovRole, permKey: keyof RolePermission["permissions"]) => {
    const rp = permissions.find((p) => p.roleId === roleId)
    return rp?.permissions[permKey] ?? false
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-[#2DC5A0] animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <GovPageHeader
        title="Roles & Permissions"
        description="Configure access controls for each role"
        actions={
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className={cn(
              "flex items-center gap-2 px-4 py-2 font-semibold rounded-lg transition-colors",
              hasChanges
                ? "bg-[#2DC5A0] hover:bg-[#2DC5A0]/90 text-[#0A2A43]"
                : "bg-white/10 text-white/50 cursor-not-allowed",
            )}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        }
      />

      {/* Info Banner */}
      <div className="mb-6 flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
        <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-blue-400">
            <strong>Administrator</strong> permissions cannot be modified. All other roles can be customized.
          </p>
        </div>
      </div>

      {/* RBAC Matrix */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-4 text-left text-sm font-medium text-white sticky left-0 bg-[#0A2A43] z-10">
                  Permission
                </th>
                {roles.map((role) => (
                  <th key={role} className="p-4 text-center min-w-[120px]">
                    <GovRoleBadge role={role} size="sm" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {permissionKeys.map((permKey) => (
                <tr key={permKey} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 sticky left-0 bg-[#061620] z-10">
                    <div>
                      <p className="font-medium text-white text-sm">{permissionLabels[permKey].label}</p>
                      <p className="text-xs text-white/50">{permissionLabels[permKey].description}</p>
                    </div>
                  </td>
                  {roles.map((role) => {
                    const isEnabled = getPermissionValue(role, permKey)
                    const isAdmin = role === "GOV_ADMIN"

                    return (
                      <td key={role} className="p-4 text-center">
                        <button
                          onClick={() => handleToggle(role, permKey)}
                          disabled={isAdmin}
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                            isAdmin && "cursor-not-allowed",
                            isEnabled
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-white/5 text-white/30 border border-white/10 hover:bg-white/10",
                          )}
                          aria-label={`${isEnabled ? "Disable" : "Enable"} ${permissionLabels[permKey].label} for ${roleLabels[role]}`}
                        >
                          {isEnabled ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center gap-6 text-sm text-white/60">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <Check className="w-4 h-4 text-emerald-400" />
          </div>
          <span>Enabled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-white/5 border border-white/10 flex items-center justify-center">
            <X className="w-4 h-4 text-white/30" />
          </div>
          <span>Disabled</span>
        </div>
      </div>
    </div>
  )
}
