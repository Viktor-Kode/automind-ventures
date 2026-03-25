import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../lib/db/connect";
import { User } from "../../../lib/db/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userId, vehicleMake, vehicleModel, vehicleYear } = req.body || {};

  if (!userId) {
    return res.status(400).json({ message: "Missing userId" });
  }

  try {
    await connectDB();
    const updated = await User.findByIdAndUpdate(
      userId,
      {
        vehicleMake,
        vehicleModel,
        vehicleYear
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    // Persist vehicle details in session on client via separate mechanism (handled in client).
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Form submit error", error);
    return res.status(500).json({ message: "Failed to save form data" });
  }
}

