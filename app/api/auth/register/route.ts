import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import NIN from "@/models/NIN";
import Vault from "@/models/Vault";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: NextRequest) {
  await dbConnect();

  const body = await req.json();
  const {
    email,
    password,
    telephone,
    nin,
    surname,
    dob,
    dateOfExpiry,
    personalIdNumber,
  } = body;

  // Basic required fields
  if (!email || !password || !telephone) {
    return NextResponse.json(
      { error: "Email, password and telephone are required." },
      { status: 400 }
    );
  }

  // Check for duplicate user
  const existing = await User.findOne({
    $or: [{ email }, { telephone }, ...(nin ? [{ nin }] : [])],
  });

  if (existing) {
    return NextResponse.json(
      { error: "User already exists with this email/telephone/NIN." },
      { status: 400 }
    );
  }

  // If NIN was provided, must validate with extra fields
  if (nin) {
    if (!surname || !dob || !dateOfExpiry || !personalIdNumber) {
      return NextResponse.json(
        { error: "Complete NIN verification details required." },
        { status: 400 }
      );
    }

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
      ninRecord.dob.toISOString() !== new Date(dob).toISOString() ||
      ninRecord.dateOfExpiry.toISOString() !== new Date(dateOfExpiry).toISOString() ||
      ninRecord.personalIdNumber !== personalIdNumber
    ) {
      return NextResponse.json(
        { error: "NIN verification details do not match the registry." },
        { status: 400 }
      );
    }
  }

  // Hash password
  const hashed = await bcrypt.hash(password, 12);

  // Create vault first (without userId initially)
  const vault = await Vault.create({ documents: [] });

  // Create user
  const user = await User.create({
    email,
    password: hashed,
    telephone,
    nin: nin || undefined,
    vaultId: vault._id,
  });

  // Update vault with userId after user is created
  vault.userId = user._id;
  await vault.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  return NextResponse.json({
    message: "Registration successful.",
    token,
    user: {
      _id: user._id,
      email: user.email,
      telephone: user.telephone,
      nin: user.nin,
      vaultId: user.vaultId,
    },
  });
}
