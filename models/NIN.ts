import mongoose, { Schema, Document } from "mongoose";

export interface INinRecord extends Document {
  surname: string;
  name: string;
  middlename?: string;
  sex: "M" | "F";
  height: string;
  dob: Date;
  dateOfExpiry: Date;
  personalIdNumber: string;
  nin: string;
}

const NinSchema = new Schema<INinRecord>(
  {
    surname: { type: String, required: true },
    name: { type: String, required: true },
    middlename: { type: String },
    sex: { type: String, enum: ["M", "F"], required: true },
    height: { type: String, required: true },
    dob: { type: Date, required: true },
    dateOfExpiry: { type: Date, required: true },
    personalIdNumber: { type: String, required: true, unique: true },
    nin: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model<INinRecord>("NIN", NinSchema);
