"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronRight, Shield, Lock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0A2A43] pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A2A43] via-[#0D1B2A] to-[#061b2e]" />

      {/* Animated network pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="heroNodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2DC5A0" stopOpacity="1" />
            <stop offset="100%" stopColor="#2DC5A0" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Network connections */}
        <g stroke="#2DC5A0" strokeWidth="0.5" strokeOpacity="0.4" filter="url(#glow)">
          <line x1="5%" y1="30%" x2="25%" y2="20%">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3s" repeatCount="indefinite" />
          </line>
          <line x1="25%" y1="20%" x2="15%" y2="50%">
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="4s" repeatCount="indefinite" />
          </line>
          <line x1="15%" y1="50%" x2="35%" y2="70%">
            <animate attributeName="opacity" values="0.2;0.5;0.2" dur="3.5s" repeatCount="indefinite" />
          </line>
          <line x1="60%" y1="10%" x2="80%" y2="25%">
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.5s" repeatCount="indefinite" />
          </line>
          <line x1="80%" y1="25%" x2="70%" y2="50%">
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" />
          </line>
          <line x1="70%" y1="50%" x2="90%" y2="70%">
            <animate attributeName="opacity" values="0.2;0.7;0.2" dur="4s" repeatCount="indefinite" />
          </line>
          <line x1="85%" y1="15%" x2="95%" y2="40%">
            <animate attributeName="opacity" values="0.3;0.5;0.3" dur="3.5s" repeatCount="indefinite" />
          </line>
          <line x1="65%" y1="30%" x2="75%" y2="55%">
            <animate attributeName="opacity" values="0.4;0.7;0.4" dur="2.8s" repeatCount="indefinite" />
          </line>
        </g>
        {/* Nodes */}
        <g>
          <circle cx="5%" cy="30%" r="3" fill="url(#heroNodeGlow)">
            <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="25%" cy="20%" r="4" fill="url(#heroNodeGlow)">
            <animate attributeName="r" values="3;5;3" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="15%" cy="50%" r="3" fill="url(#heroNodeGlow)">
            <animate attributeName="r" values="2;4;2" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="35%" cy="70%" r="4" fill="url(#heroNodeGlow)">
            <animate attributeName="r" values="3;5;3" dur="2.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="60%" cy="10%" r="3" fill="url(#heroNodeGlow)">
            <animate attributeName="r" values="2;4;2" dur="2.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="80%" cy="25%" r="4" fill="url(#heroNodeGlow)">
            <animate attributeName="r" values="3;5;3" dur="2.3s" repeatCount="indefinite" />
          </circle>
          <circle cx="70%" cy="50%" r="5" fill="url(#heroNodeGlow)">
            <animate attributeName="r" values="4;6;4" dur="2.6s" repeatCount="indefinite" />
          </circle>
          <circle cx="90%" cy="70%" r="3" fill="url(#heroNodeGlow)">
            <animate attributeName="r" values="2;4;2" dur="3.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="85%" cy="15%" r="3" fill="url(#heroNodeGlow)">
            <animate attributeName="r" values="2;4;2" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="95%" cy="40%" r="4" fill="url(#heroNodeGlow)">
            <animate attributeName="r" values="3;5;3" dur="2.7s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center min-h-[70vh]">
          {/* Left content */}
          <div className="text-center lg:text-left">
            {/* Headline with accent marks */}
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
              Your Documents.
              <span className="text-teal ml-2">{"<"}</span>
              <br />
              <span className="text-white">Always </span>
              <span className="text-white">Safe.</span>
              <br />
              <span className="text-white">Always Verifiable.</span>
              <span className="text-teal ml-2">{"<"}</span>
            </h1>

            {/* Subheadline */}
            <p className="mt-6 max-w-xl text-lg text-gray-300 leading-relaxed mx-auto lg:mx-0">
              Empower every Sierra Leonean with secure, verifiable digital copy of their most important life documents
            </p>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/register">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-teal text-navy-dark hover:bg-teal-light gap-2 font-semibold px-8 py-6 text-base shadow-lg shadow-teal/30"
                >
                  Get Started Free
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/verify">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-teal text-teal hover:bg-teal/10 bg-transparent font-semibold px-8 py-6 text-base"
                >
                  Verify a Document
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap items-center gap-6 justify-center lg:justify-start text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-teal" />
                <span>100% Free to start</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-teal" />
                <span>No credit card</span>
              </div>
            </div>
          </div>

          {/* Right - Shield with glowing orbit */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-[350px] h-[350px] sm:w-[450px] sm:h-[450px]">
              {/* Blockchain network background */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                <defs>
                  <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#2DC5A0" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#2DC5A0" stopOpacity="0" />
                  </radialGradient>
                </defs>
                {/* Dotted circle orbit */}
                <circle
                  cx="200"
                  cy="200"
                  r="150"
                  fill="none"
                  stroke="#2DC5A0"
                  strokeWidth="2"
                  strokeDasharray="8 8"
                  opacity="0.4"
                  className={mounted ? "animate-[spin_30s_linear_infinite]" : ""}
                  style={{ transformOrigin: "center" }}
                />
                {/* Outer glow ring */}
                <circle cx="200" cy="200" r="160" fill="none" stroke="#2DC5A0" strokeWidth="1" opacity="0.2" />
                {/* Inner solid ring */}
                <circle
                  cx="200"
                  cy="200"
                  r="140"
                  fill="none"
                  stroke="#2DC5A0"
                  strokeWidth="3"
                  opacity="0.8"
                  filter="url(#glow)"
                />
                {/* Center glow */}
                <circle cx="200" cy="200" r="100" fill="url(#centerGlow)" />
              </svg>

              {/* Central shield icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-gray-200 to-gray-100 rounded-2xl flex items-center justify-center shadow-2xl">
                    <Shield className="w-16 h-16 sm:w-20 sm:h-20 text-[#0A2A43]" strokeWidth={1.5} />
                  </div>
                  {/* Inner shield outline */}
                  <div className="absolute inset-4 sm:inset-6 border-2 border-[#0A2A43]/20 rounded-xl flex items-center justify-center">
                    <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-[#0A2A43]/50" strokeWidth={1.5} />
                  </div>
                </div>
              </div>

              {/* 256-bit badge */}
              <div className="absolute top-4 right-4 sm:top-8 sm:right-0 bg-[#0D1B2A]/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
                <p className="text-white text-sm font-semibold">256-bit</p>
                <p className="text-gray-400 text-xs">Encrypted</p>
              </div>

              {/* Solana badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-gray-400 text-sm">
                <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                <span>On Solana Blockchain</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#061b2e] to-transparent" />
    </section>
  )
}
