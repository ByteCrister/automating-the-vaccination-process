// lib/otp.ts

import OtpModel from "@/models/opt.model";

export async function generateOtp(email: string, purpose: "signup" | "forgot") {
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  const otpDoc = await OtpModel.createOrRefreshOtp(email, code, purpose);
  return { code, otpDoc };
}

export async function verifyOtp(email: string, purpose: "signup" | "forgot", code: string) {
  return OtpModel.verifyAndConsume(email, code, purpose);
}
