"use client";
import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { ChatWidget } from "@/components/chatbot/chat-widget";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { UserProvider } from "@/context/UserContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <UserProvider>
            <div className="min-h-screen bg-background flex relative">
                {/* Mobile overlay */}
                {mobileOpen && (
                    <div
                        className="fixed inset-0 z-30 bg-black/30 lg:hidden"
                        onClick={() => setMobileOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <Sidebar
                    mobileOpen={mobileOpen}
                    setMobileOpen={setMobileOpen}
                    collapsed={sidebarCollapsed}
                    setCollapsed={setSidebarCollapsed}
                />

                {/* Main content */}
                <main
                    className={`flex-1 overflow-auto transition-all duration-300 ${
                        sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
                    }`}
                >
                    {/* Mobile menu button */}
                    <div className="lg:hidden p-4">
                        <Button variant="ghost" onClick={() => setMobileOpen(true)}>
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Page content */}
                    <div className="min-h-screen p-4 sm:p-6">{children}</div>
                </main>

                {/* Chat Widget */}
                <ChatWidget />
            </div>
        </UserProvider>
    );
}
