import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { connectDB } from "../../../lib/db/connect";
import { User } from "../../../lib/db/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    userId,
    role,
    vehicleMake,
    vehicleModel,
    vehicleYear,
    technicianSpecialization,
    receiptUrl
  } = req.body || {};

  if (!userId || !receiptUrl) {
    return res.status(400).json({ message: "Missing userId or receipt" });
  }

  const currentYear = new Date().getFullYear() + 1;

  if (role === "owner") {
    if (!vehicleMake?.trim() || !vehicleModel?.trim()) {
      return res.status(400).json({ message: "Vehicle make and model are required" });
    }
    const yearNum = Number(vehicleYear);
    if (
      vehicleYear === undefined ||
      vehicleYear === null ||
      !Number.isInteger(yearNum) ||
      yearNum < 1900 ||
      yearNum > currentYear
    ) {
      return res.status(400).json({ message: "Enter a valid vehicle year" });
    }
  }

  try {
    const uri = process.env.MONGODB_URI;
    const shouldSkipDb =
      !uri || uri.includes("CHANGE_ME_SECURELY") || uri.trim().length === 0;

    if (shouldSkipDb) {
      return res.status(200).json({ success: true, skippedDb: true });
    }

    if (!mongoose.Types.ObjectId.isValid(String(userId))) {
      return res.status(200).json({ success: true, skippedDb: true });
    }

    await connectDB();

    const yearNum = vehicleYear !== undefined && vehicleYear !== null
      ? Number(vehicleYear)
      : undefined;

    const updated = await User.findByIdAndUpdate(
      userId,
      {
        ...(role === "owner"
          ? {
              vehicleMake: String(vehicleMake).trim(),
              vehicleModel: String(vehicleModel).trim(),
              vehicleYear: yearNum
            }
          : {
              technicianSpecialization: technicianSpecialization?.trim() || undefined
            }),
        receiptUrl,
        paymentStatus: "submitted"
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Form submit error", error);
    return res.status(500).json({ message: "Failed to save form data" });
  }
}
