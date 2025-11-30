"use client"

import { useState } from "react"
import { Search, Filter, Grid, List, Plus, FileText } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DocumentCard } from "@/components/document-card"
import { currentUser, getUserDocuments, searchDocuments } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const documentTypes = [
  "All Types",
  "Birth Certificate",
  "Diploma",
  "Land Title",
  "NIN Certificate",
  "Marriage Certificate",
]

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("All Types")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const allDocuments = getUserDocuments(currentUser.id)

  // Filter documents
  const filteredDocuments = searchQuery
    ? searchDocuments(currentUser.id, searchQuery)
    : allDocuments.filter((doc) => selectedType === "All Types" || doc.docType === selectedType)

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">My Documents</h1>
          <p className="mt-1 text-muted-foreground">{filteredDocuments.length} documents in your vault</p>
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
        {/* Search */}
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

        {/* Type filter */}
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

        {/* View toggle */}
        <div className="flex items-center rounded-lg border border-border p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "rounded-md p-2 transition-colors",
              viewMode === "grid" ? "bg-teal/10 text-teal" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Grid className="h-4 w-4" />
            <span className="sr-only">Grid view</span>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "rounded-md p-2 transition-colors",
              viewMode === "list" ? "bg-teal/10 text-teal" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <List className="h-4 w-4" />
            <span className="sr-only">List view</span>
          </button>
        </div>
      </div>

      {/* Documents Grid/List */}
      {filteredDocuments.length > 0 ? (
        <div className={cn(viewMode === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "space-y-3")}>
          {filteredDocuments.map((doc) => (
            <DocumentCard key={doc.docId} document={doc} variant={viewMode === "list" ? "compact" : "default"} />
          ))}
        </div>
      ) : (
        <Card className="border-border bg-card p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No documents found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery ? "Try a different search term" : "Upload your first document to get started"}
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
