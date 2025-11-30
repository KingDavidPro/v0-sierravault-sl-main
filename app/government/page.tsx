import Link from "next/link"
import { Shield, Building2, FileCheck, Users, BarChart3, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const features = [
  {
    icon: FileCheck,
    title: "Bulk Document Issuance",
    description: "Issue certified documents to citizens directly into their secure vaults.",
  },
  {
    icon: Users,
    title: "Citizen Verification",
    description: "Verify citizen identities and documents in real-time.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track document issuance, verification rates, and system usage.",
  },
]

export default function GovernmentPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-navy-dark">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal">
                <Shield className="h-5 w-5 text-navy-dark" />
              </div>
              <span className="text-lg font-bold text-foreground">
                Sierra<span className="text-teal">Vault</span>
              </span>
            </Link>
            <span className="rounded-full bg-flag-green/10 px-3 py-1 text-xs font-medium text-flag-green">
              Government Portal
            </span>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="bg-navy py-16 lg:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-flag-green/10">
              <Building2 className="h-8 w-8 text-flag-green" />
            </div>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">Government Portal</h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Secure document management for Sierra Leone government agencies. Issue, verify, and manage official
              documents on the blockchain.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/admin">
                <Button className="bg-flag-green text-white hover:bg-flag-green/90 gap-2">
                  Access Admin Portal
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" className="border-border text-foreground bg-transparent">
                Contact Support
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-navy-dark py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground text-center mb-12">Government Features</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="border-border bg-card p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-flag-green/10 mb-4">
                    <feature.icon className="h-6 w-6 text-flag-green" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Integration Notice */}
        <section className="bg-navy py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Card className="border-flag-green/30 bg-flag-green/5 p-8 text-center">
              <h2 className="text-xl font-bold text-foreground mb-4">Government Integration</h2>
              <p className="text-muted-foreground mb-6">
                This portal is designed for integration with Sierra Leone government systems. For access credentials and
                API documentation, please contact the SierraVault team.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>TODO:</strong> Government API integration endpoints and authentication
              </p>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
