import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import { createAndSendOtp } from "@/lib/otp";
import { sendMail } from "@/lib/mailer";

export async function POST(req: Request) {
    const { email, purpose } = await req.json();
    await connectDb();
    if (!email || !purpose) return NextResponse.json({ error: "Invalid" }, { status: 400 });
    await createAndSendOtp(email.toLowerCase(), purpose, async (code) => {
        const html = `<p>Your OTP for ${purpose} is <b>${code}</b>. It expires in ${process.env.OTP_EXPIRE_MINUTES || 10} minutes.</p>`;
        await sendMail(email, `Your OTP for ${purpose}`, html);
    });
    return NextResponse.json({ ok: true });
}
