// models/citizen.model.ts
import { BD_DIVISION_SET, BDDivision } from '@/types/shakib/authority.const';
import mongoose, { Schema, Types, model } from 'mongoose';

export interface ICitizenProfile {
    userId: Types.ObjectId;
    nationalId?: string;
    dateOfBirth?: Date;
    gender?: 'male' | 'female' | 'other';
    address?: { division?: BDDivision; district?: string; upazila?: string; ward?: string; detail?: string; };
    vaccinationHistory?: { vaccineName: string; doseNumber: number; date: Date; centerId?: Types.ObjectId }[];
    createdAt?: Date;
    updatedAt?: Date;
}

const CitizenSchema = new Schema<ICitizenProfile>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        nationalId: { type: String, index: true },
        dateOfBirth: { type: Date },
        gender: { type: String, enum: ['male', 'female', 'other'] },
        address: {
            division: { type: String, enum: Array.from(BD_DIVISION_SET) },
            district: String,
            upazila: String,
            ward: String,
            detail: String,
        },
        vaccinationHistory: [{ vaccineName: String, doseNumber: Number, date: Date, centerId: Schema.Types.ObjectId }],
    },
    { timestamps: true, strict: 'throw' }
);

CitizenSchema.index({ 'address.division': 1, 'address.district': 1 });

export const CitizenModel = (mongoose.models.Citizen as mongoose.Model<ICitizenProfile>) || model<ICitizenProfile>('Citizen', CitizenSchema);
