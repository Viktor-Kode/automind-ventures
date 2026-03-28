import mongoose, { Schema, models, Model } from "mongoose";

export type PaymentStatus = "pending" | "submitted";

export interface IUser {
  fullName: string;
  whatsappNumber: string;
  contactNumber: string;
  location: string;
  role: "owner" | "technician";
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  technicianSpecialization?: string;
  /** Public URL for WhatsApp (e.g. /api/receipt/[id] on this site). */
  receiptUrl?: string;
  /** Raw image bytes stored as base64 when not using external Blob storage. */
  receiptImageBase64?: string;
  receiptMimeType?: string;
  paymentStatus: PaymentStatus;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  whatsappNumber: { type: String, required: true },
  contactNumber: { type: String, required: true },
  location: { type: String, required: true },
  role: { type: String, enum: ["owner", "technician"], required: true },
  vehicleMake: String,
  vehicleModel: String,
  vehicleYear: Number,
  technicianSpecialization: String,
  receiptUrl: String,
  receiptImageBase64: String,
  receiptMimeType: String,
  paymentStatus: {
    type: String,
    enum: ["pending", "submitted"],
    default: "pending"
  },
  createdAt: { type: Date, default: Date.now }
});

export const User: Model<IUser> =
  (models.User as Model<IUser>) || mongoose.model<IUser>("User", userSchema);
