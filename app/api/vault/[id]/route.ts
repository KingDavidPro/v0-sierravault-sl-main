import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect";
import Vault from "@/models/Vault"
import { Types } from "mongoose"

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect()

        const docId = params.id
        if (!Types.ObjectId.isValid(docId)) {
            return NextResponse.json({ error: "Invalid document ID" }, { status: 400 })
        }

        // Fetch the document inside the vault
        const vault = await Vault.findOne(
            { "documents._id": docId },
            { "documents.$": 1, userId: 1 }
        )

        if (!vault || !vault.documents || vault.documents.length === 0) {
            return NextResponse.json({ error: "Document not found" }, { status: 404 })
        }

        return NextResponse.json(
            { document: vault.documents[0], owner: vault.userId },
            { status: 200 }
        )
    } catch (err) {
        console.error("getDocumentById error:", err)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
