import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import { sendMail } from "@/lib/mailer";
import { generateOtp } from "@/lib/otp";
import UserModel from "@/models/user.model";
import { ROLES } from "@/constants/shakib/user.const";

const inMemoryLimits: Map<string, { count: number; resetAt: number }> = new Map();
const MAX_PER_HOUR = 5;

function rateLimitKey(email: string, ip: string) {
    return `${email}:${ip}`;
}

export async function POST(req: Request) {
    try {
        const ip =
            (req.headers.get("x-forwarded-for") || "").split(",")[0] || "unknown";
        const payload = await req.json();
        const emailRaw = (payload?.email || "").toString();
        const purpose = payload?.purpose;

        if (!emailRaw || (purpose !== "signup" && purpose !== "forgot")) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }

        const email = emailRaw.trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ error: "Invalid email" }, { status: 400 });
        }

        await connectDb();

        if (purpose === "forgot") {
            const user = await UserModel.findOne({ email });
            if (!user) {
                return NextResponse.json(
                    { error: "No account found with this email" },
                    { status: 404 }
                );
            }

            if (user.role !== ROLES.CITIZEN) {
                return NextResponse.json(
                    { error: "Only citizens can reset their password" },
                    { status: 403 }
                );
            }
        }

        const key = rateLimitKey(email, ip);
        const entry = inMemoryLimits.get(key) || {
            count: 0,
            resetAt: Date.now() + 60 * 60 * 1000,
        };
        if (Date.now() > entry.resetAt) {
            entry.count = 0;
            entry.resetAt = Date.now() + 60 * 60 * 1000;
        }
        if (entry.count >= MAX_PER_HOUR) {
            return NextResponse.json({ error: "Too many requests" }, { status: 429 });
        }
        entry.count += 1;
        inMemoryLimits.set(key, entry);

        const { code } = await generateOtp(email, purpose);

        (async () => {
            try {
                const html = `<p>Your OTP for ${purpose} is <b>${code}</b>. It expires in ${process.env.OTP_EXPIRE_MINUTES || 3} minutes.</p>`;
                await sendMail(email, `Your OTP for ${purpose}`, html);
            } catch (mailErr) {
                console.error("OTP mail send failed for", email, mailErr);
            }
        })();

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("OTP send error:", err);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
