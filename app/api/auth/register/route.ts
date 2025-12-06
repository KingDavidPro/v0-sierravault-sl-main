import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import NIN from "@/models/NIN";
import Vault from "@/models/Vault";
import dbConnect from "@/lib/dbConnect";

import nacl from "tweetnacl";
import bs58 from "bs58"; // ✅ Added for Base58 encoding
import { encryptPrivateKey } from "@/utils/encryption";

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

  if (!email || !password || !telephone) {
    return NextResponse.json(
        { error: "Email, password and telephone are required." },
        { status: 400 }
    );
  }

  // Prevent duplicates
  const existing = await User.findOne({
    $or: [{ email }, { telephone }, ...(nin ? [{ nin }] : [])],
  });

  if (existing) {
    return NextResponse.json(
        { error: "User already exists with this email/telephone/NIN." },
        { status: 400 }
    );
  }

  // NIN validation
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

  // Create vault
  const vault = await Vault.create({ documents: [] });

  // -------------------------------------------------------
  // 🔥 Generate Wallet (ED25519)
  // -------------------------------------------------------
  const keypair = nacl.sign.keyPair();
  const publicKeyBase58 = bs58.encode(Buffer.from(keypair.publicKey)); // ✅ Fixed

  // Encrypt private key
  const { encrypted, iv } = await encryptPrivateKey(
      Buffer.from(keypair.secretKey).toString("base64")
  );

  // -------------------------------------------------------
  // Create user with wallet attached
  // -------------------------------------------------------
  const user = await User.create({
    email,
    password: hashed,
    telephone,
    nin: nin || undefined,
    vaultId: vault._id,

    wallet: {
      publicKey: publicKeyBase58,
      encryptedPrivateKey: encrypted,
      iv,
      createdAt: new Date(),
    },
  });

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
      walletPublicKey: user.wallet.publicKey,
    },
  });
}
