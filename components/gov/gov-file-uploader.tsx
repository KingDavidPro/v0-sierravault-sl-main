"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Upload, X, File } from "lucide-react"
import { cn } from "@/lib/utils"

interface GovFileUploaderProps {
  onFileSelect: (file: File) => void
  accept?: string
  maxSize?: number // in MB
  className?: string
}

export function GovFileUploader({
  onFileSelect,
  accept = "image/*,.pdf",
  maxSize = 10,
  className,
}: GovFileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    (file: File) => {
      setError("")

      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        setError(`File size must be less than ${maxSize}MB`)
        return
      }

      setSelectedFile(file)
      onFileSelect(file)

      // Generate preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => setPreview(e.target?.result as string)
        reader.readAsDataURL(file)
      } else {
        setPreview(null)
      }
    },
    [maxSize, onFileSelect],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleRemove = () => {
    setSelectedFile(null)
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="sr-only"
        aria-label="Upload file"
      />

      {!selectedFile ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all",
            isDragging ? "border-[#2DC5A0] bg-[#2DC5A0]/10" : "border-white/20 hover:border-white/40 hover:bg-white/5",
          )}
        >
          <Upload className={cn("w-10 h-10 mb-3 transition-colors", isDragging ? "text-[#2DC5A0]" : "text-white/50")} />
          <p className="text-sm font-medium text-white mb-1">Drop file here or click to upload</p>
          <p className="text-xs text-white/50">Supports images and PDF, max {maxSize}MB</p>
        </div>
      ) : (
        <div className="relative flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
          {preview ? (
            <img src={preview || "/placeholder.svg"} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
          ) : (
            <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center">
              <File className="w-8 h-8 text-white/50" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{selectedFile.name}</p>
            <p className="text-xs text-white/50">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <button
            onClick={handleRemove}
            className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            aria-label="Remove file"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  )
}
