import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"
import Vault from "@/models/Vault"

export async function GET() {
    await dbConnect()

    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    let payload: any
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET!)
    } catch {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const user = await User.findById(payload.id).populate("vaultId").lean()
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })
    const vault = user.vaultId

    const normalizedDocs = vault?.documents?.map((doc: any) => ({
        docId: doc._id.toString(),
        docType: doc.label || "Document",
        uploadDate: doc.uploadedAt,
        status: "verified",               // You can adjust later
        visibility: "private",            // Default for now
        aiScore: 0.85,                    // Mock until you generate scores
        txId: null,                       // Fill when blockchain is added
        onChainHash: null,
        url: doc.url,
        mimeType: doc.type
    })) || []

    return NextResponse.json({ documents: normalizedDocs })
}

