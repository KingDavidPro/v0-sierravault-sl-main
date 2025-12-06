import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { generateWallet, encryptPrivateKey } from "@/lib/solana";

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const body = await req.json();
        const { userId } = body;
        if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

        const user = await User.findById(userId);
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        if (user.walletPubKey) {
            return NextResponse.json({ message: "Wallet already exists", publicKey: user.walletPubKey }, { status: 200 });
        }

        // generate
        const { publicKey, privateKeyBase64 } = generateWallet();

        // encrypt the private key using server secret
        const secret = process.env.PRIVATE_KEY_SECRET!;
        if (!secret) throw new Error("Missing PRIVATE_KEY_SECRET in env");
        const encrypted = encryptPrivateKey(privateKeyBase64, secret);

        // store
        user.walletPubKey = publicKey;
        user.encryptedPrivateKey = encrypted; // ensure your User schema allows this field
        await user.save();

        return NextResponse.json({ message: "Wallet generated", publicKey }, { status: 201 });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message || "Failed" }, { status: 500 });
    }
}
