import mongoose, { Schema, Model } from "mongoose";
import crypto from "crypto";

export type OtpPurpose = "signup" | "forgot";

export interface IOtp {
    email: string;
    otpHash: string;
    purpose: OtpPurpose;
    expiresAt: Date;
    createdAt?: Date;
}

export interface IOtpModel extends Model<IOtp> {
    createOrRefreshOtp(email: string, otpPlain: string, purpose: OtpPurpose, ttlMinutes?: number): Promise<IOtp>;
    verifyAndConsume(email: string, otpPlain: string, purpose: OtpPurpose): Promise<boolean>;
}

const DEFAULT_TTL_MINUTES = 3; // better UX than 1 min

const OtpSchema = new Schema<IOtp>(
    {
        email: { type: String, required: true, lowercase: true, trim: true },
        otpHash: { type: String, required: true },
        purpose: { type: String, enum: ["signup", "forgot"], required: true },
        expiresAt: { type: Date, required: true },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Helper to hash OTP
function hashOtp(plain: string) {
    return crypto.createHash("sha256").update(plain).digest("hex");
}

// Create or refresh OTP
OtpSchema.statics.createOrRefreshOtp = async function (
    email: string,
    otpPlain: string,
    purpose: OtpPurpose,
    ttlMinutes = DEFAULT_TTL_MINUTES
) {
    const otpHash = hashOtp(otpPlain);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttlMinutes * 60 * 1000);

    const existingOtp = await this.findOne({ email: email.toLowerCase(), purpose });

    if (existingOtp) {
        existingOtp.expiresAt = expiresAt;
        existingOtp.otpHash = otpHash;
        await existingOtp.save();
        return existingOtp;
    }

    const doc = await this.create({ email: email.toLowerCase(), otpHash, purpose, expiresAt });
    return doc;
};

// Verify and consume OTP
OtpSchema.statics.verifyAndConsume = async function (
  email: string,
  otpPlain: string,
  purpose: OtpPurpose
) {
  const otpHash = hashOtp(otpPlain);
  const otpDoc = await this.findOne({ email: email.toLowerCase(), otpHash, purpose });
  if (!otpDoc) return false;
  if (otpDoc.expiresAt < new Date()) return false;

  // remove this line to NOT consume OTP:
  // await otpDoc.deleteOne();

  return true;
};

export const OtpModel: IOtpModel =
    (mongoose.models.Otp as IOtpModel) || mongoose.model<IOtp, IOtpModel>("Otp", OtpSchema);

export default OtpModel;
