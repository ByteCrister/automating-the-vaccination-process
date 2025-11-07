// app/api/auth/user/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { UserModel } from "@/models/user.model"; // adjust path if your model lives elsewhere
import connectDb from "@/lib/db";
import { getUserIdFromSession } from "@/lib/shakib/get-user-session";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: NextRequest) {
    try {
        // ensure user is authenticated (throws 401 NextResponse if not)
        const userId = await getUserIdFromSession();

        // ensure DB is connected
        await connectDb();

        // fetch user
        const user = await UserModel.findById(userId).lean();
        if (!user) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        return NextResponse.json({ user }, { status: 200 });
    } catch (err) {
        // If getUserIdFromSession threw a NextResponse (401), rethrow it so Next handles it
        if (err instanceof NextResponse) throw err;

        // unexpected error
        const message =
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            err && typeof err === "object" && "message" in err ? (err as any).message : "Internal Server Error";
        return NextResponse.json({ message }, { status: 500 });
    }
}
