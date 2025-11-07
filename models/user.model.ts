import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { PROVIDER_TYPE, ProviderType, Role, ROLES } from "@/constants/shakib/user.const";

export interface IUser {
  email: string;
  passwordHash: string;
  fullName: string;
  phone?: string;
  role: Role;
  provider?: ProviderType;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserMethods {
  verifyPassword(plain: string): Promise<boolean>;
  setPassword(plain: string): Promise<void>;
}

type UserModelType = mongoose.Model<IUser, object, IUserMethods>;

const SALT_ROUNDS = 12;

const UserSchema = new Schema<IUser, UserModelType, IUserMethods>(
  {
    email: {
      type: String,
      required: true,
      unique: true, // unique already creates an index
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    provider: { type: String, default: PROVIDER_TYPE.CREDENTIALS },
    role: { type: String, enum: Object.values(ROLES), required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Instance methods
UserSchema.methods.verifyPassword = async function (plain: string) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(plain, this.passwordHash);
};

UserSchema.methods.setPassword = async function (
  this: IUser & { passwordHash: string },
  plain: string
) {
  const hash = await bcrypt.hash(plain, SALT_ROUNDS);
  this.passwordHash = hash;
};

// Additional indexes
// Static/index-level improvements
// Note: email index is automatically created by unique: true, so we don't need to define it again
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });

export const UserModel: UserModelType =
  (mongoose.models.User as UserModelType) || model<IUser, UserModelType>("User", UserSchema);

export default UserModel;
