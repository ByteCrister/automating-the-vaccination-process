// models/notification.model.ts
import { NOTIFICATION_TYPE } from '@/constants/shakib/notification.const';
import { NotificationPayload } from '@/types/shakib/notification.payloads.types';
import mongoose, { Schema, Types, model } from 'mongoose';

export interface INotification {
    userId: Types.ObjectId;
    type: (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];
    payload: NotificationPayload;
    read: boolean;
    sentAt?: Date;
    deliverAfter?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}

/* Mongoose Schema (example) */
const NotificationSchema = new Schema<INotification>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        type: { type: String, enum: Object.values(NOTIFICATION_TYPE), required: true },
        payload: { type: Schema.Types.Mixed, required: true },
        read: { type: Boolean, default: false },
        sentAt: { type: Date },
        deliverAfter: { type: Date, default: null },
    },
    { timestamps: true }
);

export const NotificationModel =
    mongoose.models.mongooseNotificationModel || model<INotification>('Notification', NotificationSchema);
