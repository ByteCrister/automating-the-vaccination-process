// pages/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import UserModel from "@/models/user.model";
import { verifyOtp } from "@/lib/otp";
import { ROLES } from "@/constants/shakib/user.const";

// password policy util (example)
function validatePassword(pw: string) {
    if (pw.length < 6) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(pw)) return "Password must include an uppercase letter";
    if (!/[0-9]/.test(pw)) return "Password must include a number";
    return null;
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const emailRaw = (body?.email || "").toString();
        const password = (body?.password || "").toString();
        const fullName = (body?.name || "").toString();
        const otp = (body?.otp || "").toString();

        if (!emailRaw || !password || !otp || !fullName) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }

        const email = emailRaw.trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }

        const pwError = validatePassword(password);
        if (pwError) return NextResponse.json({ error: pwError }, { status: 400 });

        await connectDb();

        // Verify OTP (model method consumes it on success)
        const otpOk = await verifyOtp(email, "signup", otp);
        if (!otpOk) {
            // generic message to avoid leaking whether OTP existed
            return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
        }

        // Check if user exists
        const existing = await UserModel.findOne({ email });
        if (existing) {
            // Do not say "User exists" in a way that helps attackers — return conflict
            return NextResponse.json({ error: "Account cannot be created" }, { status: 409 });
        }

        // Create user safely using model methods
        const user = new UserModel({
            email,
            fullName,
            provider: "credentials",
            role: ROLES.CITIZEN,
        });
        await user.setPassword(password);
        await user.save();

        // return minimal info
        return NextResponse.json({ ok: true, userId: user._id });
    } catch (err) {
        console.error("Signup error:", err);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
