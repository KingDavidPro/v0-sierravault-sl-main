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
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        redirect("/login");
    }

    let payload: { userId: string; name: string; email: string };
    try {
        payload = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET!) as typeof payload;
    } catch (err) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-background flex">
            <Sidebar userName={payload.name} userEmail={payload.email} />

            <main className="flex-1 lg:pl-64 p-6">
                <div className="min-h-screen">{children}</div>
            </main>

            <ChatWidget />
        </div>
    );
}
