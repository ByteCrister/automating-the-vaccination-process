import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import { User } from "@/models/user.model";
import { verifyOtp } from "@/lib/otp";

export async function POST(req: Request) {
    const { email, otp, newPassword } = await req.json();
    await connectDb();
    if (!email || !otp || !newPassword) return NextResponse.json({ error: "Invalid" }, { status: 400 });
    const ok = await verifyOtp(email.toLowerCase(), "forgot", otp);
    if (!ok) return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    user.password = newPassword;
    await user.save();
    return NextResponse.json({ ok: true });
}
