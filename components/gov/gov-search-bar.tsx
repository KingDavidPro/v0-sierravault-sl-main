"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X, FileText, User, Loader2 } from "lucide-react"
import { govApiLookupCitizen } from "@/lib/gov-api-mock"

interface GovSearchBarProps {
  onClose: () => void
}

export function GovSearchBar({ onClose }: GovSearchBarProps) {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    found: boolean
    name?: string
    dateOfBirth?: string
    address?: string
  } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    setResult(null)

    try {
      const res = await govApiLookupCitizen(query.trim())
      setResult(res)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
    if (e.key === "Escape") {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-[#0A2A43] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-white/10">
          <Search className="w-5 h-5 text-white/50" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search by NIN (e.g., SL-19900101-001)"
            className="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none text-lg"
            aria-label="Search NIN"
          />
          {loading && <Loader2 className="w-5 h-5 text-[#2DC5A0] animate-spin" />}
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="p-4">
          {!result && !loading && (
            <div className="text-center py-8 text-white/50">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Enter a National Identification Number to search</p>
              <p className="text-sm mt-1">Press Enter to search, Esc to close</p>
            </div>
          )}

          {result && !result.found && (
            <div className="text-center py-8 text-white/50">
              <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No citizen found with NIN: {query}</p>
              <p className="text-sm mt-1">Please verify the NIN and try again</p>
            </div>
          )}

          {result && result.found && (
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="w-12 h-12 rounded-full bg-[#2DC5A0]/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-[#2DC5A0]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white">{result.name}</h4>
                  <p className="text-sm text-white/50 mt-1">NIN: {query}</p>
                  <p className="text-sm text-white/50">DOB: {result.dateOfBirth}</p>
                  <p className="text-sm text-white/50">{result.address}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2DC5A0] hover:bg-[#2DC5A0]/90 text-[#0A2A43] font-semibold rounded-lg transition-colors">
                  <FileText className="w-4 h-4" />
                  View Documents
                </button>
                <button className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                  Issue New
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
