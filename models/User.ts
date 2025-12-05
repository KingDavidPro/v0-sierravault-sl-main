import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    email: string;
    password: string;
    telephone: string;
    nin?: string;
    vaultId: mongoose.Types.ObjectId;
    resetToken?: string;
    resetTokenExpiry?: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        telephone: { type: String, required: true },
        nin: { type: String, required: false, unique: true, sparse: true },
        vaultId: { type: Schema.Types.ObjectId, ref: "Vault", required: true },
        resetToken: { type: String, required: false },
        resetTokenExpiry: { type: Date, required: false },
    },
    { timestamps: true }
);

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
