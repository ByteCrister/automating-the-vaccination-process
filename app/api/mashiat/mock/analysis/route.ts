import { NextRequest, NextResponse } from "next/server";
import { generateFakeAnalytics } from "../../fakeAnalytics";

export async function GET(req: NextRequest) {
  try {
    console.log("GET request received");

    // Extract `metric` from query params (e.g. ?metric=daily-bookings)
    const metric = req.nextUrl.searchParams.get("metric");

    if (!metric) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required query parameter: metric",
        },
        { status: 400 }
      );
    }

    // Generate fake data - this returns { success: true, data: [...] }
    const response = generateFakeAnalytics(metric);

    // Return the response directly since it already has the correct structure
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error generating analytics:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate analytics data.",
        error: (error as Error).message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
