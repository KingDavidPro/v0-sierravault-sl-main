"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowRight, Flame, Droplets, Bug } from "lucide-react"
import { cn } from "@/lib/utils"

const problems = [
  {
    id: "fire",
    icon: Flame,
    title: "Fire Destroys",
    description: "House fires destroy thousands of important documents every year in Sierra Leone.",
    imageSrc: "/burning-house-fire-disaster-documents-destroyed.jpg",
  },
  {
    id: "flood",
    icon: Droplets,
    title: "Floods Damage",
    description: "Flooding and water damage make paper documents unreadable and unusable.",
    imageSrc: "/flooded-archive-water-damaged-documents.jpg",
  },
  {
    id: "decay",
    icon: Bug,
    title: "Time Decays",
    description: "Paper deteriorates, fades, and is susceptible to pests and humidity.",
    imageSrc: "/old-deteriorated-damaged-paper-documents.jpg",
  },
]

export function ProblemSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="relative bg-[#061b2e] py-20 lg:py-28">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A2A43]/50 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Paper Documents Are <span className="text-red-400">Vulnerable</span>
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Every year, Sierra Leoneans lose irreplaceable documents to disasters. SierraVault ensures your documents
            survive anything.
          </p>
        </div>

        {/* Problem cards */}
        <div className="grid gap-6 lg:grid-cols-3">
          {problems.map((problem, index) => (
            <button
              key={problem.id}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "group relative overflow-hidden rounded-2xl border p-6 text-left transition-all duration-300",
                activeIndex === index
                  ? "border-teal/50 bg-teal/10 shadow-xl shadow-teal/10"
                  : "border-white/10 bg-[#0D1B2A]/60 hover:border-teal/30 hover:bg-[#0D1B2A]/80",
              )}
            >
              {/* Background image with overlay */}
              <div className="absolute inset-0 opacity-20">
                <Image src={problem.imageSrc || "/placeholder.svg"} alt={problem.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061b2e] via-[#061b2e]/80 to-[#061b2e]/60" />
              </div>

              {/* Content */}
              <div className="relative">
                <div
                  className={cn(
                    "mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-300",
                    activeIndex === index
                      ? "bg-teal/20 border border-teal/30"
                      : "bg-red-500/10 border border-red-500/20 group-hover:bg-red-500/20",
                  )}
                >
                  <problem.icon
                    className={cn("h-7 w-7 transition-colors", activeIndex === index ? "text-teal" : "text-red-400")}
                  />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{problem.title}</h3>
                <p className="text-gray-400">{problem.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Solution teaser */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal/10 border border-teal/30 px-6 py-3 text-teal hover:bg-teal/20 transition-colors cursor-pointer">
            <span className="font-semibold">SierraVault is the solution</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </section>
  )
}
