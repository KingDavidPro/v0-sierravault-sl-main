"use server"

import dbConnect from "@/lib/dbConnect"
import Vault from "@/models/Vault"
import mongoose from "mongoose"

export async function getDocumentById(id: string) {
    try {
        await dbConnect()

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null
        }

        // Find document inside any vault's documents[] array
        const vault = await Vault.findOne(
            { "documents._id": id },
            { "documents.$": 1, userId: 1 } // Return only matching document
        ).lean()

        if (!vault || !vault.documents || vault.documents.length === 0) {
            return null
        }

        const doc = vault.documents[0]

        return {
            _id: doc._id.toString(),
            label: doc.label,
            url: doc.url,
            type: doc.type,
            uploadedAt: doc.uploadedAt,
            blockchainHash: doc.blockchainHash || null,
            userId: vault.userId?.toString() ?? null,
        }
    } catch (err) {
        console.error("getDocumentById error:", err)
        return null
    }
}
