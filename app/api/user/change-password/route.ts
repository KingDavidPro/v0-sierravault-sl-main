import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const { password } = await req.json();
        if (!password || password.length < 8) {
            return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
        }

        const token = req.cookies.get("token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.findByIdAndUpdate(decoded.id, { password: hashedPassword }, { new: true });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        return NextResponse.json({ message: "Password updated successfully" });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
    }
}
