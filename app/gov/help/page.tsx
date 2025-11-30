"use client"

import { useState } from "react"
import { GovPageHeader } from "@/components/gov/gov-page-header"
import { GovBreadcrumbs } from "@/components/gov/gov-breadcrumbs"
import { GovVaultBadge } from "@/components/gov/gov-vault-badge"
import {
  BookOpen,
  CheckCircle2,
  FileCheck,
  FileText,
  Link2,
  Play,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  Shield,
  Users,
  Settings,
} from "lucide-react"

const guides = [
  {
    id: "approve",
    title: "How to Approve Documents",
    icon: FileCheck,
    color: "text-emerald-400 bg-emerald-500/10",
    steps: [
      "Navigate to Pending Documents from the sidebar",
      "Review the document details, AI confidence score, and OCR text",
      "If AI score is below 0.6, carefully verify all document details manually",
      'Click "Approve" and enter a required audit note explaining your decision',
      "Confirm the action - the document will be signed on blockchain",
      "The citizen will be notified and can now access the verified document",
    ],
  },
  {
    id: "issue",
    title: "How to Issue New Documents",
    icon: FileText,
    color: "text-blue-400 bg-blue-500/10",
    steps: [
      "Navigate to Issue Document from the sidebar",
      "Select the document type (Birth Certificate, Land Title, etc.)",
      "Enter the citizen's NIN to auto-populate their details",
      "Fill in the required certificate information",
      "Optionally attach supporting files",
      'Click "Issue & Sign on Chain" and confirm the blockchain transaction',
      "The document is now immutably recorded and verifiable",
    ],
  },
  {
    id: "verify",
    title: "How to Verify On-Chain",
    icon: Link2,
    color: "text-purple-400 bg-purple-500/10",
    steps: [
      "Each approved/issued document has a blockchain transaction ID (TX)",
      "Click the TX badge to view on Solana Explorer",
      "The transaction contains: document hash, issuer, timestamp, and signature",
      "Third parties can verify authenticity by comparing document hash",
      "Use the public verification portal to validate any SierraVault document",
    ],
  },
  {
    id: "users",
    title: "Managing Agency Users",
    icon: Users,
    color: "text-amber-400 bg-amber-500/10",
    steps: [
      "Navigate to Users & Agencies from the sidebar",
      'Click "Invite Officer" to add a new government user',
      "Assign appropriate role: Admin, Issuer, Supervisor, or Auditor",
      "The invitee receives a secure signup link via email",
      "They must complete 2FA setup on first login",
      "Suspend or modify users as needed from the user list",
    ],
  },
  {
    id: "security",
    title: "Security Best Practices",
    icon: Shield,
    color: "text-red-400 bg-red-500/10",
    steps: [
      "Always log out when leaving your workstation",
      "Never share your 2FA codes with anyone",
      "Report suspicious login attempts immediately",
      "Use a unique, strong password for your government account",
      "Review your activity in Audit Logs periodically",
      "Contact IT if you suspect your account is compromised",
    ],
  },
]

const quickLinks = [
  { label: "Pending Documents", href: "/gov/pending", icon: FileCheck },
  { label: "Issue Document", href: "/gov/issue", icon: FileText },
  { label: "User Management", href: "/gov/users", icon: Users },
  { label: "Settings", href: "/gov/settings", icon: Settings },
]

export default function HelpPage() {
  const [expandedGuide, setExpandedGuide] = useState<string | null>("approve")

  return (
    <div className="space-y-6">
      <GovBreadcrumbs items={[{ label: "Dashboard", href: "/gov/dashboard" }, { label: "Help & Training" }]} />

      <GovPageHeader
        title="Help & Training"
        description="Step-by-step guides for using the SierraVault Government Portal"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Vault Animation Hero */}
          <div className="bg-gradient-to-br from-[#0d3654] to-[#0A2A43] border border-[#2DC5A0]/20 rounded-xl p-6 flex items-center gap-6">
            <div className="flex-shrink-0">
              <GovVaultBadge size="lg" animate />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Welcome to SierraVault Training</h2>
              <p className="text-gray-400 mb-4">
                Learn how to efficiently process, verify, and issue government documents using our secure
                blockchain-backed platform.
              </p>
              <a
                href="/gov/pending?demo=true"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#2DC5A0] text-[#0A2A43] font-medium rounded-lg hover:bg-[#2DC5A0]/90 transition-colors"
              >
                <Play className="w-4 h-4" />
                Practice Sandbox
              </a>
            </div>
          </div>

          {/* Step-by-Step Guides */}
          <div className="space-y-3">
            {guides.map((guide) => {
              const Icon = guide.icon
              const isExpanded = expandedGuide === guide.id

              return (
                <div
                  key={guide.id}
                  className="bg-[#0d3654]/50 backdrop-blur-sm border border-[#2DC5A0]/20 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedGuide(isExpanded ? null : guide.id)}
                    className="w-full flex items-center gap-4 p-4 text-left hover:bg-[#0A2A43]/30 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${guide.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="flex-1 font-medium text-white">{guide.title}</span>
                    <ChevronRight
                      className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4">
                      <div className="pl-14 space-y-3">
                        {guide.steps.map((step, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-[#2DC5A0]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-medium text-[#2DC5A0]">{index + 1}</span>
                            </div>
                            <p className="text-sm text-gray-300">{step}</p>
                          </div>
                        ))}

                        <div className="pt-3 mt-3 border-t border-[#2DC5A0]/10">
                          <div className="flex items-center gap-2 text-[#2DC5A0]">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-sm font-medium">Guide Complete</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick Links */}
          <div className="bg-[#0d3654]/50 backdrop-blur-sm border border-[#2DC5A0]/20 rounded-xl p-4">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#2DC5A0]" />
              Quick Navigation
            </h3>
            <div className="space-y-2">
              {quickLinks.map((link) => {
                const Icon = link.icon
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#0A2A43]/50 transition-colors group"
                  >
                    <Icon className="w-4 h-4 text-gray-400 group-hover:text-[#2DC5A0] transition-colors" />
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-gray-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* External Resources */}
          <div className="bg-[#0d3654]/50 backdrop-blur-sm border border-[#2DC5A0]/20 rounded-xl p-4">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-[#2DC5A0]" />
              External Resources
            </h3>
            <div className="space-y-2">
              <a
                href="https://explorer.solana.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#0A2A43]/50 transition-colors group"
              >
                <Link2 className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">Solana Explorer</span>
                <ExternalLink className="w-3 h-3 text-gray-500 ml-auto" />
              </a>
              <a
                href="#"
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#0A2A43]/50 transition-colors group"
              >
                <FileText className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">API Documentation</span>
                <ExternalLink className="w-3 h-3 text-gray-500 ml-auto" />
              </a>
              <a
                href="#"
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#0A2A43]/50 transition-colors group"
              >
                <Shield className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">Security Guidelines</span>
                <ExternalLink className="w-3 h-3 text-gray-500 ml-auto" />
              </a>
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-gradient-to-br from-[#2DC5A0]/10 to-transparent border border-[#2DC5A0]/20 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#2DC5A0]/10 rounded-lg flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-[#2DC5A0]" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Need Help?</h3>
                <p className="text-xs text-gray-400">Contact IT Support</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-3">
              For technical issues or access problems, contact the IT helpdesk.
            </p>
            <a
              href="mailto:it-support@gov.sl"
              className="block w-full py-2.5 text-center bg-[#0A2A43]/50 border border-[#2DC5A0]/20 text-[#2DC5A0] font-medium rounded-lg hover:bg-[#0A2A43] transition-colors"
            >
              it-support@gov.sl
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
