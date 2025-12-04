"use client"
import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { ChatWidget } from "@/components/chatbot/chat-widget"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import {UserProvider} from "@/context/UserContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <div className="min-h-screen bg-background flex">
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/30 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

            <main className="flex-1 lg:pl-3 p-4 sm:p-6">
                {/* Mobile menu button */}
                <div className="lg:hidden mb-4">
                    <Button variant="ghost" onClick={() => setMobileOpen(true)}>
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>
                <div className="min-h-screen">
                    <UserProvider>
                        {children}
                    </UserProvider>
                </div>
            </main>

            <ChatWidget />
        </div>
    )
}
