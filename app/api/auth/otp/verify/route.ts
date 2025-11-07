import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import { verifyOtp } from "@/lib/otp";

export async function POST(req: Request) {
    const { email, purpose, code } = await req.json();
    await connectDb();
    if (!email || !purpose || !code) return NextResponse.json({ error: "Invalid" }, { status: 400 });
    const ok = await verifyOtp(email.toLowerCase(), purpose, code);
    if (!ok) return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    return NextResponse.json({ ok: true });
}
