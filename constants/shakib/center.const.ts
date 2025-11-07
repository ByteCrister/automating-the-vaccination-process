// constants/center.const.ts
export const CENTER_STATUS = {
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  SUSPENDED: 'SUSPENDED',
  CLOSED: 'CLOSED',
} as const;

export type CenterStatus = (typeof CENTER_STATUS)[keyof typeof CENTER_STATUS];
