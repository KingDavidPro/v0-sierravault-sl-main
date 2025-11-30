"use client"

import Link from "next/link"
import { Shield, Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center p-4">
      <div className="text-center">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal">
            <Shield className="h-6 w-6 text-navy-dark" />
          </div>
          <span className="text-2xl font-bold text-foreground">
            Sierra<span className="text-teal">Vault</span>
          </span>
        </Link>

        {/* 404 */}
        <h1 className="text-8xl font-bold text-teal mb-4">404</h1>
        <h2 className="text-2xl font-bold text-foreground mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="bg-teal text-navy-dark hover:bg-teal-light gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Button
            variant="outline"
            className="border-border text-foreground gap-2 bg-transparent"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}
