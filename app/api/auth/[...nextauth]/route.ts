// [...nextauth]/route.ts
import { authOptions } from "@/lib/shakib/auth-option";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
