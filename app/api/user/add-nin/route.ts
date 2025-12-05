import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import NIN from "@/models/NIN";

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();
        const { userId, nin, surname, name, dob, dateOfExpiry, personalIdNumber } = body;

        if (!userId || !nin || !surname || !name || !dob || !dateOfExpiry || !personalIdNumber) {
            return NextResponse.json(
                { error: "All NIN verification fields are required." },
                { status: 400 }
            );
        }

        // Check if NIN exists in national registry
        const ninRecord = await NIN.findOne({ nin });
        if (!ninRecord) {
            return NextResponse.json(
                { error: "NIN not found in national registry." },
                { status: 400 }
            );
        }

        // Validate identity fields
        if (
            ninRecord.surname.toLowerCase() !== surname.toLowerCase() ||
            ninRecord.name.toLowerCase() !== name.toLowerCase() ||
            new Date(ninRecord.dob).toISOString() !== new Date(dob).toISOString() ||
            new Date(ninRecord.dateOfExpiry).toISOString() !== new Date(dateOfExpiry).toISOString() ||
            ninRecord.personalIdNumber !== personalIdNumber
        ) {
            return NextResponse.json(
                { error: "NIN verification details do not match the registry." },
                { status: 400 }
            );
        }

        // Check if NIN is already assigned to another user
        const existingUser = await User.findOne({ nin });
        if (existingUser) {
            return NextResponse.json(
                { error: "This NIN is already associated with another user." },
                { status: 400 }
            );
        }

        // Update the user's NIN
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }

        if (user.nin) {
            return NextResponse.json(
                { error: "User already has a NIN assigned." },
                { status: 400 }
            );
        }

        user.nin = nin;
        await user.save();

        return NextResponse.json({
            message: "NIN added successfully.",
            user: {
                _id: user._id,
                email: user.email,
                telephone: user.telephone,
                nin: user.nin,
                vaultId: user.vaultId,
            },
        });
    } catch (err: any) {
        console.error("Add NIN error:", err);
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
}
