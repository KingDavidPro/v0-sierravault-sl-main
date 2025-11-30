import { ScanLine, ShieldCheck, Link2, Lock, Brain, FileCheck } from "lucide-react"
import { FeatureCard } from "@/components/feature-card"

const features = [
  {
    icon: ScanLine,
    title: "AI Scanning",
    description: "Advanced AI verifies authenticity and extracts text from your documents automatically.",
  },
  {
    icon: Lock,
    title: "Encrypted Storage",
    description: "Military-grade 256-bit AES encryption keeps your documents safe and private.",
  },
  {
    icon: Link2,
    title: "Blockchain Verified",
    description: "Immutable proof on Solana blockchain. Your documents are tamper-proof forever.",
  },
  {
    icon: Brain,
    title: "Smart Assistant",
    description: "AI chatbot helps you upload, verify, and manage your documents with ease.",
  },
  {
    icon: FileCheck,
    title: "One-Click Verify",
    description: "Generate shareable verification links for employers, institutions, or government.",
  },
  {
    icon: ShieldCheck,
    title: "Government Grade",
    description: "Trusted by Sierra Leone government agencies for official document verification.",
  },
]

export function FeaturesSection() {
  return (
    <section className="relative bg-[#0A2A43] py-20 lg:py-28 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="featureGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1" fill="#2DC5A0" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#featureGrid)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal/30 bg-teal/10 px-4 py-1.5 text-sm text-teal mb-4">
            <span>Powerful Features</span>
          </div>
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Everything You Need to <span className="text-teal">Secure</span> Your Documents
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            From AI-powered scanning to blockchain verification, SierraVault provides enterprise-grade security for
            every Sierra Leonean.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
