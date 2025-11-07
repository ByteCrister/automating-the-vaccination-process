import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import { CenterModel } from "@/models/center.model";
import { ICenterProfile } from "@/models/center.model";
import { Types } from "mongoose";

export async function POST(req: NextRequest) {
  try {
    // Connect to database
    await connectDb();

    // Parse request body
    const body = await req.json();
    const {
      centerName,
      licenseNumber,
      address,
      contactPhone,
      capacityPerSlot,
      vaccineTypes,
      geo,
      status,
      userId,
    } = body;

    // Validate required fields
    if (!centerName || !address?.division || !address?.district) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: centerName, address.division, and address.district are required",
        },
        { status: 400 }
      );
    }

    // Validate userId is provided
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "User ID is required",
        },
        { status: 400 }
      );
    }

    // Validate userId is a valid ObjectId format (24 hex characters)
    // if (!Types.ObjectId.isValid(userId)) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       error: "Invalid user ID format. User ID must be a valid 24-character hexadecimal string.",
    //     },
    //     { status: 400 }
    //   );
    // }

    // Check if user already has a center (since userId is unique)
    const existingCenter = await CenterModel.findOne({
      userId: new Types.ObjectId(userId),
      isDeleted: false,
    });

    if (existingCenter) {
      return NextResponse.json(
        {
          success: false,
          error: "You already have a center registered. Each user can only have one center.",
        },
        { status: 409 }
      );
    }

    // Prepare center data
    const centerData: Partial<ICenterProfile> = {
      userId: new Types.ObjectId(userId),
      centerName: centerName.trim(),
      address: {
        division: address.division,
        district: address.district.trim(),
        upazila: address.upazila?.trim(),
        detail: address.detail?.trim(),
      },
      status: status || "ACTIVE",
      isDeleted: false,
      isVerified: false,
    };

    // Add optional fields if provided
    if (licenseNumber) {
      centerData.licenseNumber = licenseNumber.trim();
    }

    if (contactPhone) {
      centerData.contactPhone = contactPhone.trim();
    }

    if (capacityPerSlot) {
      centerData.capacityPerSlot = capacityPerSlot;
    }

    if (vaccineTypes && Array.isArray(vaccineTypes) && vaccineTypes.length > 0) {
      centerData.vaccineTypes = vaccineTypes;
    }

    if (geo && geo.coordinates && Array.isArray(geo.coordinates) && geo.coordinates.length === 2) {
      centerData.geo = {
        type: "Point",
        coordinates: [geo.coordinates[0], geo.coordinates[1]],
      };
    }

    // Create the center
    const newCenter = await CenterModel.create(centerData);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Center created successfully",
        data: {
          centerId: newCenter._id.toString(),
          centerName: newCenter.centerName,
          address: newCenter.address,
          status: newCenter.status,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating center:", error);
    
    const err = error as { code?: number; name?: string; message?: string; keyPattern?: Record<string, unknown>; errors?: Record<string, { message: string }> };

    // Handle duplicate key error (unique constraint violation)
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0];
      return NextResponse.json(
        {
          success: false,
          error: `A center with this ${field} already exists`,
        },
        { status: 409 }
      );
    }

    // Handle validation errors
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors || {}).map((validationErr) => validationErr.message);
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          details: errors,
        },
        { status: 400 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to create center. Please try again.",
      },
      { status: 500 }
    );
  }
}

