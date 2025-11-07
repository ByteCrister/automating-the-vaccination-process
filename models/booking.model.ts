// models/booking.model.ts
import { BOOKING_STATUS, type BookingStatus } from '@/constants/shakib/booking.const';
import mongoose, { Schema, Types, model } from 'mongoose';

export interface IBooking {
  slotId: Types.ObjectId;
  centerId: Types.ObjectId;
  citizenId: Types.ObjectId;
  status: BookingStatus;
  bookedAt?: Date;
  expiresAt?: Date;
  checkInAt?: Date | null;
  doseNumber?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    slotId: { type: Schema.Types.ObjectId, ref: 'Slot', required: true, index: true },
    centerId: { type: Schema.Types.ObjectId, ref: 'Center', required: true, index: true },
    citizenId: { type: Schema.Types.ObjectId, ref: 'Citizen', required: true, index: true },
    status: { type: String, enum: Object.values(BOOKING_STATUS), default: BOOKING_STATUS.PENDING },
    bookedAt: { type: Date, default: () => new Date() },
    expiresAt: { type: Date },
    checkInAt: { type: Date, default: null },
    doseNumber: { type: Number, default: 1 },
  },
  { timestamps: true }
);

// prevent double-booking a citizen at the same slot
BookingSchema.index({ slotId: 1, citizenId: 1 }, { unique: true });

export const BookingModel = mongoose.models.Booking || model<IBooking>('Booking', BookingSchema);