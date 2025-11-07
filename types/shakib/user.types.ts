// types/user.types.ts
import { Role } from '@/constants/shakib/user.const';
import { Types } from 'mongoose';

/* Role-specific lightweight references used in notification payloads */
export interface IUserRef {
    id: Types.ObjectId | string;
    fullName: string;
    email?: string;
    role?: Role;
}
