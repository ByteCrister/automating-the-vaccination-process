// models/otp.model.ts
import mongoose, { Schema, Model } from 'mongoose';
import crypto from 'crypto';

export type OtpPurpose = 'signup' | 'forgot';

export interface IOtp {
    email: string;
    otpHash: string;
    purpose: OtpPurpose;
    expiresAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IOtpModel extends Model<IOtp> {
    createOtp(email: string, otpPlain: string, purpose: OtpPurpose, ttlSeconds?: number): Promise<IOtp>;
    verifyAndConsume(email: string, otpPlain: string, purpose: OtpPurpose): Promise<boolean>;
}

const DEFAULT_TTL_SECONDS = 5 * 60; // 5 minutes

const OtpSchema = new Schema<IOtp>(
    {
        email: { type: String, required: true, lowercase: true, trim: true, index: true },
        otpHash: { type: String, required: true },
        purpose: { type: String, enum: ['signup', 'forgot'], required: true },
        expiresAt: { type: Date, required: true, index: true },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

// TTL index: MongoDB will automatically remove the document when expiresAt is reached
// expireAfterSeconds: 0 tells MongoDB to expire exactly at the expiresAt value
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Secure hash helper (deterministic)
function hashOtp(plain: string) {
    return crypto.createHash('sha256').update(plain).digest('hex');
}

// Static: create a new OTP document (store hash only)
OtpSchema.statics.createOtp = async function (email: string, otpPlain: string, purpose: OtpPurpose, ttlSeconds = DEFAULT_TTL_SECONDS) {
    const otpHash = hashOtp(otpPlain);
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
    const doc = await this.create({ email: email.toLowerCase(), otpHash, purpose, expiresAt });
    return doc;
};

// Static: verify then delete (consume) if valid
OtpSchema.statics.verifyAndConsume = async function (email: string, otpPlain: string, purpose: OtpPurpose) {
    const otpHash = hashOtp(otpPlain);
    const now = new Date();

    const doc = await this.findOneAndDelete({
        email: email.toLowerCase(),
        otpHash,
        purpose,
        expiresAt: { $gt: now },
    });

    return !!doc;
};

export const OtpModel: IOtpModel = (mongoose.models.Otp as IOtpModel) || mongoose.model<IOtp, IOtpModel>('Otp', OtpSchema);

export default OtpModel;
