import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function proxy() {
        // Simply allow all requests
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: () => true, // allow everyone
        },
    }
);

// Match all routes
export const config = {
    matcher: ["/"], // match everything, or omit for global middleware
};