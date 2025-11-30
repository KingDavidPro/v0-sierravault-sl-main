"use client"

import { useState } from "react"
import { GovPageHeader } from "@/components/gov/gov-page-header"
import { GovBreadcrumbs } from "@/components/gov/gov-breadcrumbs"
import { useGovToast } from "@/components/gov/gov-toast"
import { Shield, Globe, Link2, Save, Plus, Trash2, AlertTriangle, CheckCircle2, Info, Lock, Wallet } from "lucide-react"

export default function SettingsPage() {
  const { showToast } = useGovToast()
  const [saving, setSaving] = useState(false)

  // 2FA Policy
  const [twoFaRequired, setTwoFaRequired] = useState(true)
  const [twoFaMethod, setTwoFaMethod] = useState<"email" | "sms" | "both">("email")

  // IP Allowlist
  const [ipAllowlist, setIpAllowlist] = useState(["192.168.1.0/24", "10.0.0.0/8", "172.16.0.0/12"])
  const [newIp, setNewIp] = useState("")

  // Blockchain Mode
  const [blockchainMode, setBlockchainMode] = useState<"mock" | "devnet" | "mainnet">("mock")

  // Session Settings
  const [sessionTimeout, setSessionTimeout] = useState(30)
  const [maxConcurrentSessions, setMaxConcurrentSessions] = useState(1)

  const addIp = () => {
    if (newIp && !ipAllowlist.includes(newIp)) {
      setIpAllowlist([...ipAllowlist, newIp])
      setNewIp("")
    }
  }

  const removeIp = (ip: string) => {
    setIpAllowlist(ipAllowlist.filter((i) => i !== ip))
  }

  const handleSave = async () => {
    setSaving(true)
    // TODO: Implement actual settings save via Supabase
    // const { error } = await supabase.from('gov_settings').upsert({...})
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
    showToast("success", "Settings saved successfully")
  }

  return (
    <div className="space-y-6">
      <GovBreadcrumbs items={[{ label: "Dashboard", href: "/gov/dashboard" }, { label: "Settings" }]} />

      <GovPageHeader
        title="Security & Settings"
        description="Configure authentication, network security, and blockchain integration"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 2FA Policy */}
        <div className="bg-[#0d3654]/50 backdrop-blur-sm border border-[#2DC5A0]/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#2DC5A0]/10 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#2DC5A0]" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-400">Configure 2FA requirements</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#0A2A43]/50 rounded-lg">
              <div>
                <p className="font-medium text-white">Require 2FA for all officers</p>
                <p className="text-sm text-gray-400">Mandatory verification on login</p>
              </div>
              <button
                onClick={() => setTwoFaRequired(!twoFaRequired)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  twoFaRequired ? "bg-[#2DC5A0]" : "bg-gray-600"
                }`}
                role="switch"
                aria-checked={twoFaRequired}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    twoFaRequired ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Verification Method</label>
              <select
                value={twoFaMethod}
                onChange={(e) => setTwoFaMethod(e.target.value as typeof twoFaMethod)}
                className="w-full px-4 py-2.5 bg-[#0A2A43]/50 border border-[#2DC5A0]/20 rounded-lg text-white focus:outline-none focus:border-[#2DC5A0]/50"
              >
                <option value="email">Email Only</option>
                <option value="sms">SMS Only</option>
                <option value="both">Email + SMS (Higher Security)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Session Settings */}
        <div className="bg-[#0d3654]/50 backdrop-blur-sm border border-[#2DC5A0]/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Session Security</h3>
              <p className="text-sm text-gray-400">Control session behavior</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Session Timeout (minutes)</label>
              <input
                type="number"
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(Number.parseInt(e.target.value) || 30)}
                min={5}
                max={120}
                className="w-full px-4 py-2.5 bg-[#0A2A43]/50 border border-[#2DC5A0]/20 rounded-lg text-white focus:outline-none focus:border-[#2DC5A0]/50"
              />
              <p className="text-xs text-gray-500 mt-1">Inactive sessions will be logged out automatically</p>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Max Concurrent Sessions</label>
              <select
                value={maxConcurrentSessions}
                onChange={(e) => setMaxConcurrentSessions(Number.parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-[#0A2A43]/50 border border-[#2DC5A0]/20 rounded-lg text-white focus:outline-none focus:border-[#2DC5A0]/50"
              >
                <option value={1}>1 (Most Secure)</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={5}>5</option>
              </select>
            </div>
          </div>
        </div>

        {/* IP Allowlist */}
        <div className="bg-[#0d3654]/50 backdrop-blur-sm border border-[#2DC5A0]/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">IP Allowlist</h3>
              <p className="text-sm text-gray-400">Restrict access by IP address</p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Add New IP */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newIp}
                onChange={(e) => setNewIp(e.target.value)}
                placeholder="Enter IP or CIDR (e.g., 192.168.1.0/24)"
                className="flex-1 px-4 py-2.5 bg-[#0A2A43]/50 border border-[#2DC5A0]/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#2DC5A0]/50"
              />
              <button
                onClick={addIp}
                disabled={!newIp}
                className="px-4 py-2.5 bg-[#2DC5A0] text-[#0A2A43] font-medium rounded-lg hover:bg-[#2DC5A0]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* IP List */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {ipAllowlist.map((ip) => (
                <div
                  key={ip}
                  className="flex items-center justify-between px-4 py-2.5 bg-[#0A2A43]/50 rounded-lg group"
                >
                  <code className="text-sm text-gray-300">{ip}</code>
                  <button
                    onClick={() => removeIp(ip)}
                    className="p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    aria-label={`Remove ${ip}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Empty list allows all IPs (not recommended for production)
            </p>
          </div>
        </div>

        {/* Blockchain Mode */}
        <div className="bg-[#0d3654]/50 backdrop-blur-sm border border-[#2DC5A0]/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Link2 className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Blockchain Configuration</h3>
              <p className="text-sm text-gray-400">Solana network settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "mock", label: "Mock", desc: "Local testing" },
                { value: "devnet", label: "Devnet", desc: "Test network" },
                { value: "mainnet", label: "Mainnet", desc: "Production" },
              ].map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => setBlockchainMode(mode.value as typeof blockchainMode)}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    blockchainMode === mode.value
                      ? "bg-[#2DC5A0]/10 border-[#2DC5A0] text-[#2DC5A0]"
                      : "bg-[#0A2A43]/50 border-[#2DC5A0]/20 text-gray-400 hover:border-[#2DC5A0]/40"
                  }`}
                >
                  <p className="font-medium">{mode.label}</p>
                  <p className="text-xs opacity-70">{mode.desc}</p>
                </button>
              ))}
            </div>

            {blockchainMode === "mainnet" && (
              <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-amber-400 font-medium">Production Mode Warning</p>
                  <p className="text-xs text-amber-400/70">
                    All transactions will be recorded on Solana mainnet with real fees.
                  </p>
                </div>
              </div>
            )}

            {blockchainMode === "mock" && (
              <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-400 font-medium">Mock Mode Active</p>
                  <p className="text-xs text-blue-400/70">
                    Transactions are simulated locally. No blockchain interaction.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Signing Keys */}
        <div className="bg-[#0d3654]/50 backdrop-blur-sm border border-[#2DC5A0]/20 rounded-xl p-6 lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Signing Keys Management</h3>
              <p className="text-sm text-gray-400">Configure blockchain signing authority</p>
            </div>
          </div>

          <div className="bg-[#0A2A43]/50 rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <p className="text-sm font-medium">Secure Key Storage Required</p>
            </div>

            <div className="text-sm text-gray-400 space-y-2">
              <p>For production deployment, configure your signing keys securely:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>
                  Generate a Solana keypair using <code className="text-[#2DC5A0]">solana-keygen</code>
                </li>
                <li>Store the private key in a secure vault (AWS KMS, HashiCorp Vault)</li>
                <li>
                  Add the environment variable <code className="text-[#2DC5A0]">SOLANA_SIGNING_KEY</code>
                </li>
                <li>
                  Configure the Anchor program ID in <code className="text-[#2DC5A0]">lib/solana-config.ts</code>
                </li>
              </ol>
            </div>

            <div className="pt-4 border-t border-[#2DC5A0]/10">
              <p className="text-xs text-gray-500 mb-2">Current Configuration:</p>
              <div className="flex items-center gap-2">
                {blockchainMode === "mock" ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-emerald-400">Mock mode - no signing key required</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-amber-400">
                      {/* TODO: Check if SOLANA_SIGNING_KEY exists */}
                      Signing key not configured
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-[#2DC5A0] text-[#0A2A43] font-semibold rounded-lg hover:bg-[#2DC5A0]/90 disabled:opacity-50 transition-colors"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-[#0A2A43]/30 border-t-[#0A2A43] rounded-full animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          <span>{saving ? "Saving..." : "Save Settings"}</span>
        </button>
      </div>
    </div>
  )
}
