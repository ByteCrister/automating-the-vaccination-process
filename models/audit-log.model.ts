// models/audit-log.model.ts
import mongoose, { Schema, model } from "mongoose";

// Audit log
export interface IAuditLog {
  actorId?: string | null;
  action: string;
  targetType?: string;
  targetId?: string;
  ip?: string;
  userAgent?: string;
  detail?: string;
  createdAt?: Date;
}

const AuditSchema = new Schema<IAuditLog>(
  {
    actorId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    action: { type: String, required: true, index: true },
    targetType: String,
    targetId: Schema.Types.ObjectId,
    ip: String,
    userAgent: String,
    detail: String,
  },
  { timestamps: true }
);

export const AuditModel =
  mongoose.models.Audit || model<IAuditLog>("Audit", AuditSchema);
