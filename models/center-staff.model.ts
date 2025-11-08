// models/centerStaff.model.ts

import { CENTER_STAFF_ROLE, CenterStaffRole } from '@/constants/shakib/center-staff.const';
import mongoose, { Schema, Types, model } from 'mongoose';

export interface IStaffShift {
    dayOfWeek: number; // 0-6
    startHour: string; // "08:30"
    endHour: string; // "16:30"
    capacityOverride?: number; // optional override of default capacity for the shift
}

export interface IStaffPermission {
    manageStaff?: boolean;
    manageAppointments?: boolean;
    manageStock?: boolean;
    sendReminders?: boolean;
    viewReports?: boolean;
    adjustCapacity?: boolean;
    [key: string]: boolean | undefined;
}

export interface ICenterStaffProfile {
    userId?: Types.ObjectId; // optional link to auth user
    centerId: Types.ObjectId;
    employeeId?: string; // internal employee code
    fullName: string;
    preferredName?: string;
    email?: string;
    phone?: string;
    role: CenterStaffRole;
    qualifications?: string[]; // e.g., ["BSc Nursing", "ColdChainCert"]
    certifications?: string[]; // e.g., ["CPR", "VaccineAdmin"]
    emergencyContact?: {
        name: string;
        phone: string;
        relation?: string;
    } | null;
    isActive?: boolean;
    hireDate?: Date | null;
    endDate?: Date | null;
    shifts?: IStaffShift[];
    permissions?: IStaffPermission;
    assignedDailyCapacity?: number; // how many bookings this staff can handle per day
    notes?: string;
    createdBy?: Types.ObjectId;
    updatedBy?: Types.ObjectId;
    isDeleted?: boolean;
    deletedAt?: Date | null;
    deletedBy?: Types.ObjectId | null;
    // lightweight audit for last assignment / stock actions
    lastStockTransactionAt?: Date | null;
    lastAppointmentHandledAt?: Date | null;
}

const StaffShiftSchema = new Schema<IStaffShift>(
    {
        dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
        startHour: { type: String, required: true }, // "HH:mm"
        endHour: { type: String, required: true }, // "HH:mm"
        capacityOverride: { type: Number, default: null },
    },
    { _id: false }
);

const StaffPermissionSchema = new Schema<IStaffPermission>(
    {
        manageStaff: { type: Boolean, default: false },
        manageAppointments: { type: Boolean, default: false },
        manageStock: { type: Boolean, default: false },
        sendReminders: { type: Boolean, default: false },
        viewReports: { type: Boolean, default: false },
        adjustCapacity: { type: Boolean, default: false },
    },
    { _id: false }
);

const CenterStaffSchema = new Schema<ICenterStaffProfile>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: false, index: true },
        centerId: { type: Schema.Types.ObjectId, ref: 'Center', required: true, index: true },
        employeeId: { type: String, index: true },
        fullName: { type: String, required: true, index: true },
        preferredName: { type: String },
        email: { type: String, index: true },
        phone: { type: String, index: true },
        role: { type: String, enum: Object.values(CENTER_STAFF_ROLE), required: true, index: true },
        qualifications: [{ type: String }],
        certifications: [{ type: String }],
        emergencyContact: {
            name: { type: String },
            phone: { type: String },
            relation: { type: String },
        },
        isActive: { type: Boolean, default: true, index: true },
        hireDate: { type: Date, default: null },
        endDate: { type: Date, default: null },
        shifts: { type: [StaffShiftSchema], default: [] },
        permissions: { type: StaffPermissionSchema, default: {} },
        assignedDailyCapacity: { type: Number, default: null },
        notes: { type: String },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
        updatedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
        isDeleted: { type: Boolean, default: false, index: true },
        deletedAt: { type: Date, default: null },
        deletedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
        lastStockTransactionAt: { type: Date, default: null },
        lastAppointmentHandledAt: { type: Date, default: null },
    },
    { timestamps: true }
);

// compound index to ensure employeeId uniqueness per center (if provided)
CenterStaffSchema.index({ centerId: 1, employeeId: 1 }, { unique: true, partialFilterExpression: { employeeId: { $exists: true } } });

// quick lookup by contact within a center
CenterStaffSchema.index({ centerId: 1, phone: 1 }, { unique: false, sparse: true });
CenterStaffSchema.index({ centerId: 1, email: 1 }, { unique: false, sparse: true });

export const CenterStaffModel =
    mongoose.models.CenterStaff || model<ICenterStaffProfile>('CenterStaff', CenterStaffSchema);
export default CenterStaffModel;
