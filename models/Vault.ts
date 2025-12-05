import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IVault extends Document {
  userId?: mongoose.Types.ObjectId;
  documents: {
    label: string;
    url: string;
    type: string;
    uploadedAt: Date;
    blockchainHash?: string;
  }[];
}

const VaultSchema = new Schema<IVault>(
    {
      userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
      documents: [
        {
          label: { type: String, required: true },
          url: { type: String, required: true },
          type: { type: String, required: true },
          uploadedAt: { type: Date, default: Date.now },
          blockchainHash: { type: String }, // include blockchain hash
        },
      ],
    },
    { timestamps: true }
);

export default models.Vault || model<IVault>("Vault", VaultSchema);
