import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { ChatWidget } from "@/components/chatbot/chat-widget"
import { currentUser } from "@/lib/mock-data"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar userName={currentUser.name} userEmail={currentUser.email} />
      <main className="lg:pl-64">
        <div className="min-h-screen">{children}</div>
      </main>
      <ChatWidget />
    </div>
  )
}
