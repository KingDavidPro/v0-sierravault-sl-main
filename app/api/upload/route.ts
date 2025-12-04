// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import Vault from "@/models/Vault";

// Connect to MongoDB helper
async function connectDB() {
    if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGODB_URI!);
    }
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const userId = formData.get("userId") as string;
        const documentType = formData.get("documentType") as string;

        if (!file || !userId || !documentType) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        // Save file to public/uploads
        const uploadsDir = path.join(process.cwd(), "public/uploads");
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(uploadsDir, fileName);
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(filePath, buffer);

        // Connect to MongoDB
        await connectDB();

        // Update Vault
        let vault = await Vault.findOne({ userId });
        const docEntry = {
            label: documentType,
            url: `/uploads/${fileName}`,
            type: file.type,
            uploadedAt: new Date(),
        };

        if (vault) {
            vault.documents.push(docEntry);
            await vault.save();
        } else {
            vault = await Vault.create({ userId, documents: [docEntry] });
        }

        // Mock blockchain hash
        const blockchainHash = "0x" + fileName.split(".")[0];

        return NextResponse.json({
            message: "Uploaded successfully",
            doc: docEntry,
            blockchainHash,
        });
    } catch (err: any) {
        console.error("Upload error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
