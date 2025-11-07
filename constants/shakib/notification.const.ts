// constants/notification.const.ts
export const NOTIFICATION_TYPE = {
  SLOT_BOOKED: 'slot_booked',
  SLOT_CANCELLED: 'slot_cancelled',
  SLOT_MODIFIED: 'slot_modified',
  REMINDER: 'reminder',
  SYSTEM_ALERT: 'system_alert',
} as const;

export type NotificationType = (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];