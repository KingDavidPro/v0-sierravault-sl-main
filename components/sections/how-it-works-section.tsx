import { Upload, ScanLine, Lock, Link2, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const steps = [
  {
    icon: Upload,
    title: "Upload",
    description: "Drag and drop your document or take a photo with your phone.",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
  },
  {
    icon: ScanLine,
    title: "AI Scan",
    description: "Our AI analyzes authenticity, extracts text, and checks for forgery.",
    color: "text-teal",
    bgColor: "bg-teal/10",
    borderColor: "border-teal/30",
  },
  {
    icon: Lock,
    title: "Encrypt & Store",
    description: "256-bit AES encryption protects your document in our secure vault.",
    color: "text-white",
    bgColor: "bg-white/5",
    borderColor: "border-white/20",
  },
  {
    icon: Link2,
    title: "Verify on Blockchain",
    description: "A permanent, tamper-proof record is created on Solana blockchain.",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
]

export function HowItWorksSection() {
  return (
    <section className="relative bg-[#0A2A43] py-20 lg:py-28 overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal/30 bg-teal/10 px-4 py-1.5 text-sm text-teal mb-4">
            <span>Simple Process</span>
          </div>
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">How It Works</h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Securing your documents takes less than 2 minutes. Here&apos;s the simple process.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line - desktop only */}
          <div className="absolute top-16 left-0 right-0 hidden lg:block">
            <div className="mx-auto h-1 w-3/4 bg-gradient-to-r from-emerald-500 via-teal to-blue-500 rounded-full opacity-50" />
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title} className="relative flex flex-col items-center text-center group">
                {/* Step number */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#0A2A43] border border-teal/30 px-3 py-1 text-xs font-bold text-teal">
                  Step {index + 1}
                </div>

                {/* Icon */}
                <div
                  className={cn(
                    "relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl border transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl",
                    step.bgColor,
                    step.borderColor,
                  )}
                >
                  <step.icon className={cn("h-10 w-10", step.color)} />
                </div>

                {/* Arrow - mobile/tablet */}
                {index < steps.length - 1 && (
                  <div className="my-4 lg:hidden">
                    <ArrowRight className="h-5 w-5 text-gray-500 rotate-90 sm:rotate-0" />
                  </div>
                )}

                {/* Content */}
                <h3 className="mt-6 text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm text-gray-400 max-w-xs">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
