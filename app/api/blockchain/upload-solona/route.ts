import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { Connection, Keypair, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import crypto from "crypto";

// Supabase client
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

// Solana setup
const connection = new Connection("https://api.devnet.solana.com");
const fromWallet = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.DEVNET_PRIVATE_KEY!)));
const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

        const formData = req.body; // if using FormData, you may need multer or next-connect
        const file = (req as any).files?.file; // depends on your parsing setup
        const userId = formData.userId;
        const label = formData.label;

        if (!file || !userId || !label) throw new Error("Missing required fields");

        // 1️⃣ Compute SHA-256 hash of file
        const fileBuffer = Buffer.from(file.data);
        const hash = crypto.createHash("sha256").update(fileBuffer).digest("hex");

        // 2️⃣ Upload to Supabase
        const fileName = `${Date.now()}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from("documents")
            .upload(fileName, fileBuffer, { contentType: file.mimetype });

        if (uploadError) throw uploadError;

        const fileUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/documents/${fileName}`;

        // 3️⃣ Send Solana transaction with memo
        const memoInstruction = new TransactionInstruction({
            keys: [],
            programId: MEMO_PROGRAM_ID,
            data: Buffer.from(hash),
        });

        const tx = new Transaction().add(memoInstruction);
        const signature = await connection.sendTransaction(tx, [fromWallet]);
        await connection.confirmTransaction(signature);

        res.status(200).json({
            doc: { solanaHash: hash, fileUrl, label },
            txId: signature,
        });
    } catch (err: any) {
        console.error("Upload error:", err);
        res.status(500).json({ error: err.message });
    }
}
