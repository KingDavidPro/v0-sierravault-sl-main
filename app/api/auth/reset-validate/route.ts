import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: NextRequest) {
  await dbConnect();

  const { token } = await req.json();

  if (!token) {
    return NextResponse.json(
      { error: "Token is required." },
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

  return NextResponse.json({ valid: true });
}
