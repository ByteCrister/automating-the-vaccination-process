// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import UserModel from "@/models/user.model";
import { verifyOtp } from "@/lib/otp";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp, newPassword } = body ?? {};

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    if (!passwordRegex.test(newPassword)) {
      return NextResponse.json(
        { success: false, error: "Password must be 6+ chars, include 1 uppercase, 1 lowercase, 1 digit" },
        { status: 400 }
      );
    }

    await connectDb();

    const otpValid = await verifyOtp(email.toLowerCase(), "forgot", otp);
    if (!otpValid) {
      return NextResponse.json({ success: false, error: "Invalid or expired OTP" }, { status: 400 });
    }

    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    await user.setPassword(newPassword);
    await user.save();

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("Password reset error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}