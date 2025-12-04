import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: NextRequest) {
  await dbConnect();

  const { token, newPassword } = await req.json();

  if (!token || !newPassword) {
    return NextResponse.json(
      { error: "Token and new password are required." },
      { status: 400 }
    );
  }

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: new Date() },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Invalid or expired token." },
      { status: 400 }
    );
  }

  const hashed = await bcrypt.hash(newPassword, 12);

  user.password = hashed;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  return NextResponse.json({
    message: "Password updated successfully.",
  });
}
