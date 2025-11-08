//center-staff.const.ts
export const CENTER_STAFF_ROLE = {
    MANAGER: 'manager',
    NURSE: 'nurse',
    PHARMACIST: 'pharmacist',
    DATA_ENTRY: 'data_entry',
    ASSISTANT: 'assistant',
} as const;
export type CenterStaffRole = (typeof CENTER_STAFF_ROLE)[keyof typeof CENTER_STAFF_ROLE];