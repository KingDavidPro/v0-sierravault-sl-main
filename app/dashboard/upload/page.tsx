"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Upload, X, CheckCircle, ArrowLeft, ImageIcon, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AILoader } from "@/components/loader"
import { BlockchainBadge } from "@/components/blockchain-badge"
import { cn } from "@/lib/utils"

type UploadStage = "select" | "preview" | "scanning" | "success"

const documentTypes = [
  "Birth Certificate",
  "Diploma",
  "Land Title",
  "NIN Certificate",
  "Marriage Certificate",
  "Academic Transcript",
  "Professional License",
  "Passport",
  "Driver License",
  "Other",
]

export default function UploadPage() {
  const router = useRouter()
  const [stage, setStage] = useState<UploadStage>("select")
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState("")
  const [scanProgress, setScanProgress] = useState(0)
  const [scanStage, setScanStage] = useState<"scanning" | "analyzing" | "encrypting" | "storing">("scanning")

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files?.[0]) {
      setFile(files[0])
      setStage("preview")
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files?.[0]) {
      setFile(files[0])
      setStage("preview")
    }
  }

  const handleUpload = async () => {
    if (!file || !documentType) return

    setStage("scanning")

    // Simulate scanning stages
    const stages: Array<"scanning" | "analyzing" | "encrypting" | "storing"> = [
      "scanning",
      "analyzing",
      "encrypting",
      "storing",
    ]

    for (let i = 0; i < stages.length; i++) {
      setScanStage(stages[i])
      for (let p = i * 25; p < (i + 1) * 25; p++) {
        await new Promise((resolve) => setTimeout(resolve, 50))
        setScanProgress(p)
      }
    }

    setScanProgress(100)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setStage("success")
  }

  const resetUpload = () => {
    setStage("select")
    setFile(null)
    setDocumentType("")
    setScanProgress(0)
    setScanStage("scanning")
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Go back</span>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Upload Document</h1>
          <p className="text-sm text-muted-foreground">Secure your important documents in your vault</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Stage: File Selection */}
        {stage === "select" && (
          <Card className="border-border bg-card p-8">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={cn(
                "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors",
                dragActive ? "border-teal bg-teal/5" : "border-border hover:border-teal/50",
              )}
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal/10">
                <Upload className="h-8 w-8 text-teal" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Drag and drop your file</h3>
              <p className="text-sm text-muted-foreground mb-4">or click to browse from your device</p>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileSelect}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
              <p className="text-xs text-muted-foreground">Supports PDF, JPG, PNG up to 10MB</p>
            </div>
          </Card>
        )}

        {/* Stage: Preview */}
        {stage === "preview" && file && (
          <Card className="border-border bg-card overflow-hidden">
            {/* Preview */}
            <div className="aspect-[3/2] bg-navy flex items-center justify-center relative">
              <div className="text-center p-8">
                {file.type.startsWith("image/") ? (
                  <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                ) : (
                  <File className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                )}
                <p className="text-foreground font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button
                onClick={resetUpload}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove file</span>
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="documentType">Document Type</Label>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerName">Owner Name</Label>
                <Input
                  id="ownerName"
                  placeholder="e.g., David Conteh"
                  className="bg-secondary border-border"
                  defaultValue="David Conteh"
                />
              </div>

              <Button
                onClick={handleUpload}
                disabled={!documentType}
                className="w-full bg-teal text-navy-dark hover:bg-teal-light gap-2"
              >
                <Upload className="h-4 w-4" />
                Encrypt, Secure & Store
              </Button>
            </div>
          </Card>
        )}

        {/* Stage: Scanning */}
        {stage === "scanning" && (
          <Card className="border-border bg-card p-8">
            <AILoader stage={scanStage} progress={scanProgress} />
            <p className="text-center text-xs text-muted-foreground mt-4">Please don&apos;t close this window</p>
          </Card>
        )}

        {/* Stage: Success */}
        {stage === "success" && (
          <Card className="border-border bg-card p-8 text-center">
            <div className="mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal/10">
              <CheckCircle className="h-8 w-8 text-teal" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Document Secured!</h2>
            <p className="text-muted-foreground mb-6">Your document has been encrypted and stored on the blockchain.</p>

            {/* Mock blockchain badge */}
            <div className="flex justify-center mb-6">
              <BlockchainBadge txId="TX_DEMO_NEW_001" hash="0xnew123abc456def789ghi012jkl345mno" />
            </div>

            {/* AI Score */}
            <div className="mb-6 p-4 rounded-lg bg-secondary inline-block">
              <p className="text-sm text-muted-foreground mb-1">AI Authenticity Score</p>
              <p className="text-3xl font-bold text-teal">96%</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" className="border-border text-foreground bg-transparent" onClick={resetUpload}>
                Upload Another
              </Button>
              <Button
                className="bg-teal text-navy-dark hover:bg-teal-light"
                onClick={() => router.push("/dashboard/documents")}
              >
                View My Documents
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
