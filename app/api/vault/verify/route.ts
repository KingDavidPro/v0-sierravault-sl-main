// app/api/documents/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Vault from "@/models/Vault"; // modify path if different
import { hashBuffer, decryptPrivateKey, signAndSendMemo } from "@/lib/solana";

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();
        const { userId, documentBase64, filename, docId } = body;
        if (!userId || !documentBase64) {
            return NextResponse.json({ error: "userId and documentBase64 required" }, { status: 400 });
        }

        // load user + encrypted key
        const user = await User.findById(userId).lean();
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
        if (!user.encryptedPrivateKey) return NextResponse.json({ error: "User has no managed wallet" }, { status: 400 });

        // compute hash (documentBase64 -> Buffer)
        const buffer = Buffer.from(documentBase64, "base64");
        const docHash = hashBuffer(buffer); // hex string

        // decrypt private key
        const secret = process.env.PRIVATE_KEY_SECRET!;
        if (!secret) throw new Error("Missing PRIVATE_KEY_SECRET");
        const privateKeyBase64 = decryptPrivateKey(user.encryptedPrivateKey, secret);

        // sign & send memo (write hash on-chain)
        const { txId } = await signAndSendMemo(docHash, privateKeyBase64);

        // persist proof in your Vault collection (adapt fields to your schema)
        // If you store documents in Vault.documents array, add or update document record with proof:
        const vault = await Vault.findById(user.vaultId);
        if (!vault) {
            // create or respond error depending on your data model
            console.warn("Vault not found for user", userId);
        } else {
            // Find document if docId passed, else insert new entry
            const entry = vault.documents?.find((d: any) => d._id?.toString() === docId) || null;
            const proof = {
                hash: docHash,
                txId,
                verifiedAt: new Date(),
            };

            if (entry) {
                entry.proof = proof;
            } else {
                vault.documents.push({
                    label: filename || "uploaded",
                    url: "", // set if you push to storage and have a url
                    type: "", // set mime
                    uploadedAt: new Date(),
                    proof,
                });
            }
            await vault.save();
        }

        return NextResponse.json({ message: "Document recorded on-chain", docHash, txId }, { status: 201 });
    } catch (err: any) {
        console.error("verify error:", err);
        return NextResponse.json({ error: err.message || "Failed to verify document" }, { status: 500 });
    }
}
