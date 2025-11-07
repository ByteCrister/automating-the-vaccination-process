// types/user.const.ts
export const ROLES = {
  CITIZEN: 'citizen',
  CENTER: 'vaccination_center',
  AUTHORITY: 'authority',
} as const;
export type Role = (typeof ROLES)[keyof typeof ROLES];

export const PROVIDER_TYPE = {
  GOOGLE: "google",
  CREDENTIALS: "credentials"
}
export type ProviderType = (typeof PROVIDER_TYPE)[keyof typeof PROVIDER_TYPE];