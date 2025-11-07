import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function proxy(req) {
        const { pathname } = req.nextUrl;
        const token = req.nextauth.token; // this holds the JWT/session info
        const isAuth = !!token;

        // Public routes (accessible without login)
        const publicRoutes = ["/signin", "/signup", "/forgot"];

        // Authenticated users should NOT access auth pages again
        if (isAuth && publicRoutes.includes(pathname)) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        // Unauthenticated users trying to access protected routes
        if (!isAuth && !publicRoutes.includes(pathname)) {
            return NextResponse.redirect(new URL("/signin", req.url));
        }

        // Everything else → continue
        return NextResponse.next();
    },
    {
        callbacks: {
            // Always run proxy() and manually handle redirects
            authorized: () => true,
        },
    }
);

// Match all routes except static assets
export const config = {
    matcher: [
        "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
    ],
};
