import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: NextRequest) {
  await dbConnect();

  const { identifier } = await req.json();

  if (!identifier) {
    return NextResponse.json(
      { error: "Identifier is required." },
      { status: 400 }
    );
  }

  const user = await User.findOne({
    $or: [{ email: identifier }, { telephone: identifier }, { nin: identifier }],
  });

  if (!user) {
    // Return success message even if user doesn't exist (security best practice)
    return NextResponse.json({
      message: "If an account exists, a reset link has been sent.",
    });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

  user.resetToken = token;
  user.resetTokenExpiry = expiry;
  await user.save();

  const resetUrl = `${process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}`;

  // TODO: Deliver via SMS / Email:
  // sendResetLink(user.email OR user.telephone, resetUrl);

  return NextResponse.json({
    message: "If an account exists, a reset link has been sent.",
  });
}
