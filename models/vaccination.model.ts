// models/vaccination.model.ts
import { SLOT_TYPE } from '@/constants/shakib/vaccine.const';
import mongoose, { Schema, Types, model } from 'mongoose';

// Slot model
export interface IVaccinationSlot {
    centerId: Types.ObjectId;
    slotType: typeof SLOT_TYPE[keyof typeof SLOT_TYPE];
    startTime: Date; // stored in UTC
    endTime: Date;   // stored in UTC
    capacity: number;         // total seats for slot
    remaining: number;        // seats left (redundant but useful)
    vaccineType?: string;
    doseNumber: number;
    recurringRule?: {
        freq: 'DAILY' | 'WEEKLY' | 'MONTHLY';
        interval?: number;
        byWeekDay?: number[]; // 0-6
        until?: Date;
    } | null;
    isActive: boolean;
    createdBy: Types.ObjectId; // userId (center)
    createdAt?: Date;
}

const RecurringSchema = new Schema(
    {
        freq: { type: String, enum: ['DAILY', 'WEEKLY', 'MONTHLY'], required: true },
        interval: { type: Number, default: 1 },
        byWeekDay: [{ type: Number }],
        until: { type: Date },
    },
    { _id: false }
);

const SlotSchema = new Schema<IVaccinationSlot>(
    {
        centerId: { type: Schema.Types.ObjectId, ref: 'Center', required: true, index: true },
        slotType: { type: String, enum: Object.values(SLOT_TYPE), default: SLOT_TYPE.ONE_TIME },
        startTime: { type: Date, required: true, index: true },
        endTime: { type: Date, required: true, index: true },
        capacity: { type: Number, required: true, default: 1 },
        remaining: { type: Number, required: true, default: 1 },
        vaccineType: { type: String },
        doseNumber: { type: Number, default: 1 },
        recurringRule: { type: RecurringSchema, default: null },
        isActive: { type: Boolean, default: true, index: true },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

// compound index to quickly find available slots for a center / time range
SlotSchema.index({ centerId: 1, startTime: 1, isActive: 1 });

export const SlotModel = mongoose.models.Slot || model<IVaccinationSlot>('Slot', SlotSchema);
