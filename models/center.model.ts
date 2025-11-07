// models/center.model.ts
import { CENTER_STATUS, CenterStatus } from '@/constants/shakib/center.const';
import { BD_DIVISION_SET, BDDivision } from '@/types/shakib/authority.const';
import mongoose, { Schema, Types, model } from 'mongoose';

export interface ICenterAddress {
    division: BDDivision;
    district: string;
    upazila?: string;
    detail?: string;
}

export interface ICenterProfile {
    userId: Types.ObjectId;
    centerName: string;
    licenseNumber?: string;
    address: ICenterAddress;
    contactPhone?: string;
    operatingHours?: {
        weekday: number[]; // 0-6 allowed: array of hours or open/close
    };
    capacityPerSlot?: number;
    vaccineTypes?: string[]; // e.g., ["Covishield", "Pfizer"]
    geo?: { type: 'Point'; coordinates: [number, number] }; // [lng, lat]
    status?: CenterStatus;
    isDeleted?: boolean;
    deletedAt?: Date | null;
    deletedBy?: Types.ObjectId | null;
    isVerified?: boolean;
}

const CenterSchema = new Schema<ICenterProfile>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
        centerName: { type: String, required: true, index: true },
        licenseNumber: { type: String, index: true },
        address: {
            division: { type: String, enum: Object.values(BD_DIVISION_SET), required: true, index: true },
            district: { type: String, required: true, index: true },
            upazila: { type: String },
            detail: { type: String },
        },
        contactPhone: { type: String },
        capacityPerSlot: { type: Number, default: 50 },
        vaccineTypes: [{ type: String }],
        geo: { type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: { type: [Number], index: '2dsphere' } },
        status: {
            type: String,
            enum: Object.values(CENTER_STATUS),
            default: CENTER_STATUS.ACTIVE,
            index: true,
        },
        isDeleted: { type: Boolean, default: false, index: true },
        deletedAt: { type: Date, default: null },
        deletedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
        isVerified: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const CenterModel = mongoose.models.Center || model<ICenterProfile>('Center', CenterSchema);
