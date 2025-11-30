import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
})

export const metadata: Metadata = {
  title: "SierraVault — Your Documents. Always Safe. Always Verifiable.",
  description:
    "Empower every Sierra Leonean with a secure, verifiable digital copy of their most important life documents. AI-powered scanning, military-grade encryption, and blockchain verification.",
  keywords: ["Sierra Leone", "digital vault", "document verification", "blockchain", "AI scanning", "secure storage"],
  authors: [{ name: "SierraVault" }],
  creator: "SierraVault",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sierravault.sl",
    title: "SierraVault — Your Documents. Always Safe. Always Verifiable.",
    description:
      "Empower every Sierra Leonean with a secure, verifiable digital copy of their most important life documents.",
    siteName: "SierraVault",
  },
  twitter: {
    card: "summary_large_image",
    title: "SierraVault — Your Documents. Always Safe. Always Verifiable.",
    description:
      "Empower every Sierra Leonean with a secure, verifiable digital copy of their most important life documents.",
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#0A2A43",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
