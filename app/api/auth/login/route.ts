import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: NextRequest) {
  await dbConnect();

  const { identifier, password } = await req.json();

  if (!identifier || !password) {
    return NextResponse.json(
      { error: "Identifier and password are required." },
      { status: 400 }
    );
  }

  // ID can be: email OR telephone OR nin
  const user = await User.findOne({
    $or: [{ email: identifier }, { telephone: identifier }, { nin: identifier }],
  });

  if (!user) {
    return NextResponse.json(
      { error: "Invalid login credentials." },
      { status: 400 }
    );
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return NextResponse.json(
      { error: "Invalid login credentials." },
      { status: 400 }
    );
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  return NextResponse.json({
    message: "Login successful.",
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
