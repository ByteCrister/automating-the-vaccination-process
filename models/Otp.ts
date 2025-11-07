import mongoose, { Schema, Document, Model } from "mongoose";
import crypto from "crypto";

export interface IOtp extends Document {
    email: string;
    otpHash: string;
    purpose: "signup" | "forgot";
    expiresAt: Date;
    createdAt: Date;
}

const OtpSchema = new Schema<IOtp>({
    email: { type: String, required: true, lowercase: true },
    otpHash: { type: String, required: true },
    purpose: { type: String, enum: ["signup", "forgot"], required: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
});

export const Otp: Model<IOtp> = mongoose.models.Otp || mongoose.model("Otp", OtpSchema);
