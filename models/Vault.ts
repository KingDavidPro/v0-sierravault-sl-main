import mongoose, { Schema, Document } from "mongoose";

export interface IVault extends Document {
  userId?: mongoose.Types.ObjectId;
  documents: {
    label: string;
    url: string;
    type: string;
    uploadedAt: Date;
  }[];
}

const VaultSchema = new Schema<IVault>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false }, // Made optional to resolve circular dependency
    documents: [
      {
        label: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IVault>("Vault", VaultSchema);
