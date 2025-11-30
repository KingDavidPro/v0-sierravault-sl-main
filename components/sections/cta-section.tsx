import Link from "next/link"
import { Shield, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="relative bg-[#061b2e] py-20 lg:py-28 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Icon with glow */}
        <div className="relative mx-auto mb-8 w-fit">
          <div className="absolute inset-0 bg-teal/30 rounded-2xl blur-xl animate-pulse" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-teal/10 border border-teal/30">
            <Shield className="h-10 w-10 text-teal" />
          </div>
        </div>

        {/* Headline */}
        <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          Secure Your Documents <span className="text-teal">Today</span>
        </h2>

        {/* Subheadline */}
        <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Join thousands of Sierra Leoneans who trust SierraVault to protect their most important life documents. Start
          for free, upgrade anytime.
        </p>

        {/* CTA */}
        <div className="mt-10">
          <Link href="/register">
            <Button
              size="lg"
              className="bg-teal text-[#0A2A43] hover:bg-teal-light gap-2 font-semibold px-8 py-6 text-base shadow-xl shadow-teal/30 transition-all duration-300 hover:shadow-teal/50 hover:scale-105"
            >
              Create Your Free Vault
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Slogan */}
        <p className="mt-10 text-sm text-teal font-semibold tracking-wide">
          SierraVault — Your documents. Always safe. Always verifiable.
        </p>
      </div>
    </section>
  )
}
