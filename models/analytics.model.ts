// models/analytics.model.ts
import mongoose, { Schema, model } from 'mongoose';

// Analytics entry (aggregated or raw)
export interface IAnalyticsEntry {
  centerId?: string;
  metric: string; // e.g., "bookings_per_day"
  key: string;    // e.g., "2025-11-07"
  value: number;
  recordedAt?: Date;
}

const AnalyticsSchema = new Schema<IAnalyticsEntry>(
  {
    centerId: { type: Schema.Types.ObjectId, ref: 'Center', index: true },
    metric: { type: String, required: true, index: true },
    key: { type: String, required: true, index: true },
    value: { type: Number, required: true },
    recordedAt: { type: Date, default: () => new Date() },
  },
  { timestamps: true }
);

// composite for fast aggregation reads
AnalyticsSchema.index({ centerId: 1, metric: 1, key: 1 });

export const AnalyticsModel = mongoose.models.Analytics || model<IAnalyticsEntry>('Analytics', AnalyticsSchema);
