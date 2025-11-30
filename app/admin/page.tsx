"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Shield,
  Users,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Search,
  Filter,
  MoreVertical,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { StatsCard } from "@/components/stats-card"
import { StatusBadge } from "@/components/status-badge"
import { verificationRequests, formatDate } from "@/lib/mock-data"

export default function AdminPage() {
  const [showIssueForm, setShowIssueForm] = useState(false)
  const [requests, setRequests] = useState(verificationRequests)

  const handleApprove = (id: string) => {
    setRequests(requests.map((req) => (req.id === id ? { ...req, status: "approved" as const } : req)))
  }

  const handleReject = (id: string) => {
    setRequests(requests.map((req) => (req.id === id ? { ...req, status: "rejected" as const } : req)))
  }

  const stats = {
    totalUsers: 1247,
    totalDocuments: 5832,
    pendingVerifications: requests.filter((r) => r.status === "pending").length,
    verifiedToday: 23,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-navy-dark">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal">
                  <Shield className="h-5 w-5 text-navy-dark" />
                </div>
                <span className="text-lg font-bold text-foreground">
                  Sierra<span className="text-teal">Vault</span>
                </span>
              </Link>
              <span className="hidden sm:inline-block rounded-full bg-flag-blue/10 px-3 py-1 text-xs font-medium text-flag-blue">
                Admin Portal
              </span>
            </div>
            <Link href="/">
              <Button variant="ghost" className="text-muted-foreground gap-2">
                <ArrowLeft className="h-4 w-4" />
                Exit Admin
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            icon={Users}
            label="Total Users"
            value={stats.totalUsers.toLocaleString()}
            change="+12%"
            trend="up"
          />
          <StatsCard
            icon={FileText}
            label="Total Documents"
            value={stats.totalDocuments.toLocaleString()}
            change="+8%"
            trend="up"
          />
          <StatsCard
            icon={Clock}
            label="Pending Verifications"
            value={stats.pendingVerifications}
            change="Needs attention"
            trend="neutral"
          />
          <StatsCard icon={CheckCircle} label="Verified Today" value={stats.verifiedToday} change="+5" trend="up" />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Pending Verifications */}
          <div className="lg:col-span-2">
            <Card className="border-border bg-card">
              <div className="flex items-center justify-between border-b border-border p-4">
                <h2 className="text-lg font-semibold text-foreground">Pending Verifications</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input type="search" placeholder="Search..." className="w-48 pl-9 bg-secondary border-border" />
                  </div>
                  <Button variant="outline" size="icon" className="border-border bg-transparent">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="divide-y divide-border">
                {requests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{request.docType}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.ownerName} · {formatDate(request.requestDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={request.status} />
                      {request.status === "pending" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleApprove(request.id)} className="text-teal">
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleReject(request.id)} className="text-destructive">
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Issue New Document */}
          <div>
            <Card className="border-border bg-card p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Issue Certified Document</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowIssueForm(!showIssueForm)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {showIssueForm ? (
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipientNIN">Recipient NIN</Label>
                    <Input id="recipientNIN" placeholder="SL-XXXXXXXX-XXX" className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="docType">Document Type</Label>
                    <Select>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="birth">Birth Certificate</SelectItem>
                        <SelectItem value="marriage">Marriage Certificate</SelectItem>
                        <SelectItem value="nin">NIN Certificate</SelectItem>
                        <SelectItem value="license">Professional License</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="issuerName">Issuer Name</Label>
                    <Input
                      id="issuerName"
                      placeholder="e.g., Ministry of Health"
                      className="bg-secondary border-border"
                    />
                  </div>
                  <Button className="w-full bg-teal text-navy-dark hover:bg-teal-light">Issue Document</Button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Click + to issue a new certified document</p>
                </div>
              )}
            </Card>

            {/* Quick Stats */}
            <Card className="border-border bg-card p-4 mt-4">
              <h3 className="text-sm font-semibold text-foreground mb-4">Today&apos;s Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Documents Issued</span>
                  <span className="text-sm font-medium text-foreground">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Verifications Approved</span>
                  <span className="text-sm font-medium text-teal">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Verifications Rejected</span>
                  <span className="text-sm font-medium text-destructive">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">New Users</span>
                  <span className="text-sm font-medium text-foreground">15</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
