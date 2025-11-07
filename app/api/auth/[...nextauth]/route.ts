// [...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectDb from "@/lib/db";
import { Types } from "mongoose";
import UserModel from "@/models/user.model";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  // debug: true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDb();
        if (!credentials?.email || !credentials?.password) return null;

        const user = await UserModel.findOne({ email: credentials.email.toLowerCase() });
        if (!user) return null;

        const ok = await user.verifyPassword!(credentials.password);
        if (!ok) return null;

        return {
          id: (user._id as Types.ObjectId).toString(),
          email: user.email,
          name: user.fullName,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDb();

        const existingUser = await UserModel.findOne({ email: user.email });

        if (!existingUser) {
          console.warn("❌ Google user not found in DB:", user.email);
          return false;
        }

        console.log("✅ Google user exists in DB:", user.email);
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) token.sub = user.id || token.sub;
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      return url.startsWith("/") ? `${baseUrl}${url}` : url;
    },

  },

  pages: {
    signIn: "/signin",
    error: "/auth/error",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
