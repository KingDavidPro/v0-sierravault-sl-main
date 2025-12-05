import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function PATCH(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();
        const { userId, ...updates } = body;

        if (!userId) {
            return NextResponse.json({ error: "Missing userId" }, { status: 400 });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).lean();

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user: updatedUser });
    } catch (err) {
        console.error("PATCH /api/user/update failed:", err);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}
