import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ScanLine, Shield, Link2, Lock, Brain, FileCheck, Globe, Smartphone, Clock, Users } from "lucide-react"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: ScanLine,
    title: "AI-Powered Document Scanning",
    description:
      "Our advanced AI analyzes every document for authenticity, detecting potential forgeries and assessing document quality. OCR technology automatically extracts text for easy searching.",
    details: ["Forgery detection", "Quality scoring", "Auto text extraction", "Multi-language support"],
  },
  {
    icon: Lock,
    title: "Military-Grade Encryption",
    description:
      "Your documents are protected with 256-bit AES encryption—the same standard used by banks and governments worldwide. Only you can access your files.",
    details: ["256-bit AES encryption", "Zero-knowledge architecture", "End-to-end security", "Secure key management"],
  },
  {
    icon: Link2,
    title: "Blockchain Verification",
    description:
      "Every document creates an immutable record on the Solana blockchain. Anyone can verify authenticity without accessing the actual document.",
    details: ["Solana blockchain", "Tamper-proof records", "Instant verification", "Permanent timestamps"],
  },
  {
    icon: Brain,
    title: "AI Assistant",
    description:
      "Our intelligent chatbot guides you through uploads, explains verification, searches your documents, and answers questions in plain English.",
    details: ["Natural language", "Document search", "Upload guidance", "24/7 availability"],
  },
  {
    icon: FileCheck,
    title: "One-Click Sharing",
    description:
      "Generate secure verification links that expire after 7 days. Perfect for employers, universities, or government agencies needing to verify your credentials.",
    details: ["Time-limited links", "Access tracking", "Revocable access", "View-only sharing"],
  },
  {
    icon: Globe,
    title: "Government Integration",
    description:
      "Built to integrate with Sierra Leone government systems. Official documents can be issued directly to your vault with verified issuer credentials.",
    details: ["Official issuance", "Verified issuers", "Compliance ready", "Audit trails"],
  },
]

const additionalFeatures = [
  { icon: Smartphone, title: "Mobile First", description: "Works perfectly on any device" },
  { icon: Clock, title: "Instant Access", description: "Your documents, anytime, anywhere" },
  { icon: Users, title: "Family Sharing", description: "Securely share with family members" },
  { icon: Shield, title: "Privacy Controls", description: "You control who sees what" },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-navy py-20 lg:py-28">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl">Powerful Features for Document Security</h1>
            <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
              Everything you need to secure, verify, and share your most important documents.
            </p>
          </div>
        </section>

        {/* Main Features */}
        <section className="bg-navy-dark py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              {features.map((feature, index) => (
                <Card key={feature.title} className="border-border bg-card overflow-hidden">
                  <div className={`grid gap-8 lg:grid-cols-2 ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                    <div className="p-8 lg:p-12">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-teal/10 mb-6">
                        <feature.icon className="h-7 w-7 text-teal" />
                      </div>
                      <h2 className="text-2xl font-bold text-foreground mb-4">{feature.title}</h2>
                      <p className="text-muted-foreground leading-relaxed mb-6">{feature.description}</p>
                      <ul className="grid grid-cols-2 gap-2">
                        {feature.details.map((detail) => (
                          <li key={detail} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="h-1.5 w-1.5 rounded-full bg-teal" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-navy flex items-center justify-center p-8 lg:p-12">
                      <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-teal/10">
                        <feature.icon className="h-16 w-16 text-teal" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Features */}
        <section className="bg-navy py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground text-center mb-12">Plus Much More</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {additionalFeatures.map((feature) => (
                <Card key={feature.title} className="border-border bg-card p-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-teal/10 mb-4">
                    <feature.icon className="h-6 w-6 text-teal" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-navy-dark py-16 lg:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">Ready to Secure Your Documents?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start protecting your most important documents today. It&apos;s free to get started.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-teal text-navy-dark hover:bg-teal-light">
                Create Your Free Vault
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
