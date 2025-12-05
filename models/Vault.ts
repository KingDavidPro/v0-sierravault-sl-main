import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IVaultDocument {
    _id: mongoose.Types.ObjectId;
    label: string;
    url: string;
    type: string;
    uploadedAt: Date;
    blockchainHash?: string;
}

export interface IVault extends Document {
    userId?: mongoose.Types.ObjectId;
    documents: IVaultDocument[];
}

const DocumentSchema = new Schema<IVaultDocument>(
    {
        label: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
        blockchainHash: { type: String },
    },
    { _id: true }
);

const VaultSchema = new Schema<IVault>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: false, index: true },
        documents: [DocumentSchema],
    },
    { timestamps: true }
);

export default models.Vault || model<IVault>("Vault", VaultSchema);
