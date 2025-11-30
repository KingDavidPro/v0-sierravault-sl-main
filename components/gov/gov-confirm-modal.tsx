"use client"

import { useState } from "react"
import { X, AlertTriangle, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface GovConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (note: string) => Promise<void>
  title: string
  description: string
  type: "approve" | "reject" | "warning" | "danger"
  requireNote?: boolean
  notePlaceholder?: string
  confirmLabel?: string
  cancelLabel?: string
}

export function GovConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  type,
  requireNote = true,
  notePlaceholder = "Enter audit note (required)...",
  confirmLabel,
  cancelLabel = "Cancel",
}: GovConfirmModalProps) {
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!isOpen) return null

  const handleConfirm = async () => {
    if (requireNote && !note.trim()) {
      setError("Audit note is required")
      return
    }

    setLoading(true)
    setError("")

    try {
      await onConfirm(note)
      setNote("")
      onClose()
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const typeConfig = {
    approve: {
      icon: CheckCircle,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/20",
      buttonColor: "bg-emerald-600 hover:bg-emerald-700",
      defaultLabel: "Approve",
    },
    reject: {
      icon: XCircle,
      iconColor: "text-red-400",
      iconBg: "bg-red-500/20",
      buttonColor: "bg-red-600 hover:bg-red-700",
      defaultLabel: "Reject",
    },
    warning: {
      icon: AlertTriangle,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/20",
      buttonColor: "bg-amber-600 hover:bg-amber-700",
      defaultLabel: "Confirm",
    },
    danger: {
      icon: AlertTriangle,
      iconColor: "text-red-400",
      iconBg: "bg-red-500/20",
      buttonColor: "bg-red-600 hover:bg-red-700",
      defaultLabel: "Delete",
    },
  }

  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#0A2A43] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-start gap-4 p-6 border-b border-white/10">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", config.iconBg)}>
            <Icon className={cn("w-6 h-6", config.iconColor)} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm text-white/60 mt-1">{description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <label className="block text-sm font-medium text-white/80 mb-2">
            Audit Note {requireNote && <span className="text-red-400">*</span>}
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={notePlaceholder}
            rows={3}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#2DC5A0]/50 focus:ring-1 focus:ring-[#2DC5A0]/50 resize-none"
            aria-required={requireNote}
          />
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10 bg-white/5">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || (requireNote && !note.trim())}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
              config.buttonColor,
            )}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmLabel || config.defaultLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
