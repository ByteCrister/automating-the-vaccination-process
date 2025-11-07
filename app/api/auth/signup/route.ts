import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import { User } from "@/models/user.model";
import { verifyOtp } from "@/lib/otp";

export async function POST(req: Request) {
    const { email, password, name, otp } = await req.json();
    await connectDb();
    if (!email || !password || !otp) return NextResponse.json({ error: "Invalid" }, { status: 400 });
    const ok = await verifyOtp(email.toLowerCase(), "signup", otp);
    if (!ok) return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return NextResponse.json({ error: "User exists" }, { status: 409 });
    const user = await User.create({ email: email.toLowerCase(), password, name, provider: "credentials" });
    return NextResponse.json({ ok: true, userId: user._id });
}
