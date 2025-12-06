"use client";

import Link from "next/link";

export default function ComingSoonPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A2A43]/90 text-gray-900 px-4">
            <div className="text-center max-w-lg">
                <h1 className="text-5xl sm:text-6xl font-extrabold text-teal-600 mb-4 animate-pulse">
                    🚀 Coming Soon
                </h1>
                <p className="text-lg sm:text-xl text-gray-700 mb-6">
                    During the <span className="font-semibold text-teal-600">Big 5 AI & Blockchain Hackathon – Phase 2</span>, this feature will be launched. Stay tuned!
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                    <Link
                        href="/dashboard/me"
                        className="px-6 py-3 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition"
                    >
                        Go Back to Dashboard
                    </Link>
                    <a
                        href="mailto:aaronaallieu@example.com"
                        className="px-6 py-3 rounded-lg border border-teal-600 text-teal-600 font-medium hover:bg-teal-50 transition"
                    >
                        Contact Support
                    </a>
                </div>
            </div>

            <div className="mt-12 text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} SierraVault. All rights reserved.
            </div>
        </div>
    );
}
