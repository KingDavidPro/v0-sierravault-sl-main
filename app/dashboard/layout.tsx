import type { ReactNode } from "react";
import { Sidebar } from "@/components/sidebar";
import { ChatWidget } from "@/components/chatbot/chat-widget";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

interface DashboardLayoutProps {
    children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {

    return (
        <div className="min-h-screen bg-background flex">
            <Sidebar />

            <main className="flex-1 lg:pl-64 p-6">
                <div className="min-h-screen">{children}</div>
            </main>

            <ChatWidget />
        </div>
    );
}
