// authority.const.ts

export const BD_DIVISIONS = [
    'Dhaka',
    'Chattogram',
    'Rajshahi',
    'Khulna',
    'Barishal',
    'Sylhet',
    'Rangpur',
    'Mymensingh',
] as const;

export type BDDivision = (typeof BD_DIVISIONS)[number];

export const BD_DIVISION_SET = new Set<string>(BD_DIVISIONS);