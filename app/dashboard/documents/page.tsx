"use client"

import { useEffect, useState } from "react"
import { Search, Filter, Grid, List, Plus, FileText } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DocumentCard } from "@/components/document-card"
import { cn } from "@/lib/utils"
import { useUser } from "@/context/UserContext"

const documentTypes = [
  "All Types",
  "Birth Certificate",
  "Diploma",
  "Land Title",
  "NIN Certificate",
  "Marriage Certificate",
]

export default function DocumentsPage() {
  const { user, loading } = useUser()
  const [documents, setDocuments] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("All Types")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Fetch vault documents and normalize
  useEffect(() => {
    if (!user || loading) return

    fetch("/api/vault")
        .then((res) => res.json())
        .then((data) => {
          const normalized: any[] = (data.documents || []).map((doc: any, index: number) => ({
            _id: doc._id || doc.url || index.toString(),
            label: doc.label || "Unknown Document",
            type: doc.type || "Other",
            url: doc.url || "",
            uploadedAt: doc.uploadedAt || new Date(),
            ...doc,
          }))

          setDocuments(normalized)
        })
        .catch((err) => console.error("Failed to fetch vault documents:", err))
  }, [user, loading])

  // Filter documents safely
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = searchQuery
        ? (doc.label || "").toLowerCase().includes(searchQuery.toLowerCase())
        : true
    const matchesType = selectedType === "All Types" || doc.type === selectedType
    return matchesSearch && matchesType
  })

  if (loading) return <p>Loading documents...</p>

  return (
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground lg:text-3xl">My Documents</h1>
            <p className="mt-1 text-muted-foreground">
              {filteredDocuments.length} documents in your vault
            </p>
          </div>
          <Link href="/dashboard/upload">
            <Button className="bg-teal text-navy-dark hover:bg-teal-light gap-2">
              <Plus className="h-4 w-4" />
              Upload New
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search documents..."
                className="pl-10 bg-secondary border-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-border text-foreground gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                {selectedType}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {documentTypes.map((type) => (
                  <DropdownMenuItem
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={cn(selectedType === type && "bg-teal/10 text-teal")}
                  >
                    {type}
                  </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center rounded-lg border border-border p-1">
            <button
                onClick={() => setViewMode("grid")}
                className={cn(
                    "rounded-md p-2 transition-colors",
                    viewMode === "grid"
                        ? "bg-teal/10 text-teal"
                        : "text-muted-foreground hover:text-foreground"
                )}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
                onClick={() => setViewMode("list")}
                className={cn(
                    "rounded-md p-2 transition-colors",
                    viewMode === "list"
                        ? "bg-teal/10 text-teal"
                        : "text-muted-foreground hover:text-foreground"
                )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Render documents */}
        {filteredDocuments.length > 0 ? (
            <div
                className={cn(
                    viewMode === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "space-y-3"
                )}
            >
              {filteredDocuments.map((doc) => (
                  <DocumentCard
                      key={doc._id}
                      document={doc}
                  />
              ))}
            </div>
        ) : (
            <Card className="border-border bg-card p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No documents found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                    ? "Try a different search term"
                    : "Upload your first document to get started"}
              </p>
              {!searchQuery && (
                  <Link href="/dashboard/upload">
                    <Button className="bg-teal text-navy-dark hover:bg-teal-light gap-2">
                      <Plus className="h-4 w-4" />
                      Upload Document
                    </Button>
                  </Link>
              )}
            </Card>
        )}
      </div>
  )
}
