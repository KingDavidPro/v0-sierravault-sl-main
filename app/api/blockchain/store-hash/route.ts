import { NextResponse } from "next/server";
import {
    Connection,
    PublicKey,
    Transaction,
    TransactionInstruction,
    Keypair,
    sendAndConfirmTransaction,
} from "@solana/web3.js";

export async function POST(req: Request) {
    try {
        const { hash } = await req.json();

        if (!hash) {
            return NextResponse.json({ error: "Missing hash" }, { status: 400 });
        }

        const rpcUrl = process.env.SOLANA_RPC!;
        const secretKey = Uint8Array.from(JSON.parse(process.env.SOLANA_SECRET_KEY!));

        const payer = Keypair.fromSecretKey(secretKey);
        const connection = new Connection(rpcUrl);

        const memoProgramId = new PublicKey(
            "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
        );

        const instruction = new TransactionInstruction({
            keys: [],
            programId: memoProgramId,
            data: Buffer.from(hash),
        });

        const tx = new Transaction().add(instruction);

        const signature = await sendAndConfirmTransaction(connection, tx, [payer]);

        return NextResponse.json({ ok: true, signature });
    } catch (e: any) {
        return NextResponse.json(
            { error: e.message || "Blockchain error" },
            { status: 500 }
        );
    }
}
