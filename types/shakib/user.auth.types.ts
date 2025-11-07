// types/user.auth.types.ts

import { ProviderType, Role } from "@/constants/shakib/user.const";

export interface IUser {
    _id: string;
    email: string;
    fullName: string;
    phone?: string;
    role: Role;
    provider?: ProviderType;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
