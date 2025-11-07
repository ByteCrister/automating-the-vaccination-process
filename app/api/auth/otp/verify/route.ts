// app/api/otp/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import { verifyOtp } from "@/lib/otp";

interface OtpRequestBody {
    email?: string;
    purpose?: "signup" | "forgot";
    code?: string;
}

export async function POST(req: NextRequest) {
    try {
        // Parse JSON body
        let body: OtpRequestBody;
        try {
            body = (await req.json()) as OtpRequestBody;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        console.log(body);

        const { email, purpose, code } = body ?? {};

        if (!email || !purpose || !code) {
            return NextResponse.json(
                { error: "Missing required fields: email, purpose, or code" },
                { status: 400 }
            );
        }

        if (purpose !== "signup" && purpose !== "forgot") {
            return NextResponse.json({ error: "Invalid purpose value" }, { status: 400 });
        }

        await connectDb();

        const ok = await verifyOtp(email.toLowerCase(), purpose, code);

        if (!ok) {
            return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
        }

        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (err) {
        console.error("Unexpected error in OTP verification:", err);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
