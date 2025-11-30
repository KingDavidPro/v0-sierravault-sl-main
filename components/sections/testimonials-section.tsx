import Image from "next/image"
import { Quote } from "lucide-react"
import { Card } from "@/components/ui/card"

const testimonials = [
  {
    quote:
      "After a fire destroyed my home, I lost everything including my children's birth certificates. With SierraVault, I'll never worry about losing documents again.",
    author: "Mariama Sesay",
    role: "Mother of 3, Freetown",
    avatar: "/smiling-african-woman-portrait.png",
  },
  {
    quote:
      "As a land registrar, document fraud was a major problem. SierraVault's blockchain verification has transformed how we authenticate property titles.",
    author: "Mohamed Kamara",
    role: "Land Registry Officer",
    avatar: "/african-man-professional-portrait.png",
  },
  {
    quote:
      "My diploma verification used to take weeks. Now employers can verify my credentials instantly with a simple link. This is the future.",
    author: "Isatu Koroma",
    role: "University Graduate",
    avatar: "/young-african-woman-graduate-portrait.jpg",
  },
]

export function TestimonialsSection() {
  return (
    <section className="relative bg-navy py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Trusted by Sierra Leoneans</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands who have secured their most important documents with SierraVault.
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.author}
              className="relative border-border bg-card p-6 hover:border-teal/30 transition-colors"
            >
              <Quote className="h-8 w-8 text-teal/30 mb-4" />
              <blockquote className="text-foreground leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</blockquote>
              <div className="mt-6 flex items-center gap-3">
                <Image
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.author}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
