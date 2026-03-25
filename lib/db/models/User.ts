import mongoose, { Schema, models, Model } from "mongoose";

export interface IUser {
  fullName: string;
  whatsappNumber: string;
  contactNumber: string;
  location: string;
  role: "owner" | "technician";
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  paymentStatus: boolean;
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
  paymentStatus: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const User: Model<IUser> =
  (models.User as Model<IUser>) || mongoose.model<IUser>("User", userSchema);

