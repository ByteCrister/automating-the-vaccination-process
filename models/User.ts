import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
    email: string;
    name?: string;
    password?: string; // hashed
    provider?: "credentials" | "google";
    createdAt: Date;
    comparePassword?: (candidate: string) => Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String },
    password: { type: String },
    provider: { type: String, default: "credentials" },
    createdAt: { type: Date, default: Date.now },
});

UserSchema.pre("save", async function (next) {
    const user = this as IUser;
    if (!user.isModified("password")) return next();
    if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
    next();
});

UserSchema.methods.comparePassword = async function (candidate: string) {
    if (!this.password) return false;
    return bcrypt.compare(candidate, this.password);
};

export const User: Model<IUser> = mongoose.models.User || mongoose.model("User", UserSchema);
