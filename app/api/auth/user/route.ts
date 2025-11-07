import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { UserModel } from "@/models/user.model";
import connectDb from "@/lib/db";
import { getUserIdFromSession } from "@/lib/shakib/get-user-session";

export async function GET(_req: NextRequest) {
  try {
    const userId = await getUserIdFromSession();

    await connectDb();

    const user = await UserModel.findById(userId).lean();
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    if (err instanceof NextResponse) throw err;

    const message = err && typeof err === "object" && "message" in err ? (err as any).message : "Internal Server Error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
