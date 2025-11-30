import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Shield, Target, Eye, Users, Globe, Award } from "lucide-react"
import { Card } from "@/components/ui/card"

const values = [
  {
    icon: Shield,
    title: "Security First",
    description:
      "We use military-grade encryption and blockchain technology to ensure your documents are always protected.",
  },
  {
    icon: Users,
    title: "Accessible to All",
    description:
      "Everyone deserves access to secure document storage, regardless of technical expertise or income level.",
  },
  {
    icon: Globe,
    title: "National Impact",
    description: "We're building infrastructure that will transform how Sierra Leone handles official documents.",
  },
  {
    icon: Award,
    title: "Trust & Transparency",
    description: "Blockchain verification means you can always prove your documents are authentic and unaltered.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-navy py-20 lg:py-28">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl">About SierraVault</h1>
            <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
              Empowering every Sierra Leonean with a secure, verifiable digital copy of their most important life
              documents.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="bg-navy-dark py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Mission */}
              <Card className="border-border bg-card p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal/10 mb-6">
                  <Target className="h-6 w-6 text-teal" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To empower every Sierra Leonean with a secure, verifiable digital copy of their most important life
                  documents. We believe that document security should be a right, not a privilege—accessible to everyone
                  from Freetown to the most remote village.
                </p>
              </Card>

              {/* Vision */}
              <Card className="border-border bg-card p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-flag-blue/10 mb-6">
                  <Eye className="h-6 w-6 text-flag-blue" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  A Sierra Leone where no one ever loses access to their birth certificate, diploma, land title, or any
                  important document. Where verification is instant, fraud is impossible, and every citizen has control
                  over their digital identity.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Slogan Banner */}
        <section className="bg-teal py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-2xl font-bold text-navy-dark sm:text-3xl">
              SierraVault — Your documents. Always safe. Always verifiable.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="bg-navy py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Values</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <Card key={value.title} className="border-border bg-card p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal/10 mb-4">
                    <value.icon className="h-6 w-6 text-teal" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why SierraVault */}
        <section className="bg-navy-dark py-16 lg:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Why SierraVault?</h2>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-teal text-navy-dark font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Disaster-Proof Storage</h3>
                  <p className="mt-2 text-muted-foreground">
                    Fire, flood, or theft can destroy paper documents in seconds. Your digital vault is replicated
                    across secure servers worldwide—your documents survive anything.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-teal text-navy-dark font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Instant Verification</h3>
                  <p className="mt-2 text-muted-foreground">
                    No more weeks waiting for document verification. Generate a secure link that employers,
                    institutions, or government agencies can verify instantly.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-teal text-navy-dark font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Fraud Prevention</h3>
                  <p className="mt-2 text-muted-foreground">
                    Blockchain verification creates an immutable record. Once your document is on-chain, it cannot be
                    altered or forged—ever.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-teal text-navy-dark font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Built for Sierra Leone</h3>
                  <p className="mt-2 text-muted-foreground">
                    Designed specifically for Sierra Leonean documents, government integration, and local needs. This is
                    our national digital infrastructure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
