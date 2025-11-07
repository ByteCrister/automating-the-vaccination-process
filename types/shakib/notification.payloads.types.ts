// types/notification.payloads.ts
import { Types } from "mongoose";
import { IUserRef } from "./user.types";

/* Shared slot reference */
export interface ISlotRef {
    id: Types.ObjectId | string;
    centerId: Types.ObjectId | string;
    centerName?: string;
    startTime: string; // ISO string in UTC
    endTime: string; // ISO string in UTC
    timezone?: string; // creator/center timezone
    vaccineType?: string;
    capacity?: number;
}

/* SLOT_BOOKED: sent to citizen (confirmation) and center (new booking) */
export interface SlotBookedPayload {
    bookingId: Types.ObjectId | string;
    slot: ISlotRef;
    citizen: IUserRef; // who booked
    seatNumber?: number | null;
    doseNumber?: number; // 1,2,... (if tracked)
    bookedAt: string; // ISO
}

/* SLOT_CANCELLED: sent to citizen, center, authority as appropriate */
export interface SlotCancelledPayload {
    bookingId: Types.ObjectId | string;
    slot: ISlotRef;
    cancelledBy: IUserRef; // citizen | center | system
    cancelledAt: string; // ISO
    reason?: string | null;
    refundEligible?: boolean | null;
}

/* SLOT_MODIFIED: sent to all affected parties (citizens booked into that slot + center staff) */
export interface SlotModifiedPayload {
    slotId: Types.ObjectId | string;
    centerId: Types.ObjectId | string;
    centerName?: string;
    changes: {
        before?: Partial<ISlotRef>;
        after?: Partial<ISlotRef>;
        changedBy: IUserRef;
        changedAt: string; // ISO
    };
    impactedBookingsCount?: number;
    suggestion?: {
        alternativeSlots?: ISlotRef[]; // suggested alternatives if conflict created
    };
}

/* REMINDER: scheduled reminder for a booking */
export interface ReminderPayload {
    bookingId: Types.ObjectId | string;
    slot: ISlotRef;
    targetUser: IUserRef; // recipient (usually citizen)
    remindAt: string; // ISO when reminder triggers
    reminderType?: "pre" | "checkin" | "followup";
    minutesBefore?: number; // e.g., 30
}

/* SYSTEM_ALERT: optional admin/authority message */
export interface SystemAlertPayload {
    title: string;
    message: string;
    severity?: "info" | "warning" | "critical";
    affectedCenterIds?: (Types.ObjectId | string)[];
    createdAt: string; // ISO
}

/* Union of all payloads */
export type NotificationPayload =
    | SlotBookedPayload
    | SlotCancelledPayload
    | SlotModifiedPayload
    | ReminderPayload
    | SystemAlertPayload;
