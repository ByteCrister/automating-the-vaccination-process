import crypto from "crypto";
import { Otp } from "../models/Otp";
import { hash as bcryptHash, compare as bcryptCompare } from "bcrypt";

export async function createAndSendOtp(email: string, purpose: "signup" | "forgot", sendFn: (code:string)=>Promise<void>) {
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit
  const otpHash = await bcryptHash(code, 10);
  const expireMin = Number(process.env.OTP_EXPIRE_MINUTES || 10);
  await Otp.create({ email, otpHash, purpose, expiresAt: new Date(Date.now() + expireMin * 60 * 1000) });
  await sendFn(code);
  return true;
}

export async function verifyOtp(email: string, purpose: "signup" | "forgot", code: string) {
  const record = await Otp.findOne({ email, purpose }).sort({ createdAt: -1 });
  if (!record) return false;
  if (record.expiresAt < new Date()) {
    await record.deleteOne();
    return false;
  }
  const ok = await bcryptCompare(code, record.otpHash);
  if (ok) await record.deleteOne();
  return ok;
}
