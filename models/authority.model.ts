// models/authority.model.ts
import { BD_DIVISION_SET, BDDivision } from "@/types/shakib/authority.const";
import mongoose, { Schema, Types, model } from "mongoose";

export interface IAuthorityProfile {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  agencyName?: string;
  roleTitle?: string;
  division?: BDDivision;
  contactPhone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const AuthoritySchema = new Schema<IAuthorityProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
      index: true,
    },
    agencyName: { type: String, trim: true, maxlength: 200 },
    roleTitle: { type: String, trim: true, maxlength: 100 },
    division: {
      type: String,
      enum: Array.from(BD_DIVISION_SET),
      required: false,
      index: true,
    },
    contactPhone: { type: String, trim: true, maxlength: 30 },
  },
  { timestamps: true, strict: "throw" }
);

// Compound index to speed up queries by division + district
AuthoritySchema.index({ division: 1, district: 1 });

// Text index for searching agencyName and roleTitle
AuthoritySchema.index(
  { agencyName: "text", roleTitle: "text" },
  { default_language: "english" }
);

// Static helpers
AuthoritySchema.statics.findByDivision = function (division: BDDivision) {
  return this.find({ division }).lean();
};

AuthoritySchema.statics.findByDivisionAndDistrict = function (
  division: BDDivision,
) {
  return this.find({
    division,
  }).lean();
};

AuthoritySchema.statics.upsertForUser = async function (
  userId: Types.ObjectId | string,
  payload: Partial<IAuthorityProfile>
) {
  return this.findOneAndUpdate(
    { userId },
    { $set: payload },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).exec();
};

export interface AuthorityModelType extends mongoose.Model<IAuthorityProfile> {
  findByDivision(division: BDDivision): Promise<IAuthorityProfile[]>;
  findByDivisionAndDistrict(
    division: BDDivision,
  ): Promise<IAuthorityProfile[]>;
  upsertForUser(
    userId: Types.ObjectId | string,
    payload: Partial<IAuthorityProfile>
  ): Promise<IAuthorityProfile>;
}

export const AuthorityModel: AuthorityModelType =
  (mongoose.models.Authority as AuthorityModelType) ||
  model<IAuthorityProfile, AuthorityModelType>("Authority", AuthoritySchema);
