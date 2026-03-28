import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../lib/db/connect";
import { User } from "../../../lib/db/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { fullName, whatsappNumber, contactNumber, location, role } = req.body || {};

  if (!fullName || !whatsappNumber || !contactNumber || !location || !role) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const uri = process.env.MONGODB_URI;
    const shouldSkipDb =
      !uri || uri.includes("CHANGE_ME_SECURELY") || uri.trim().length === 0;

    if (shouldSkipDb) {
      const demoId = `demo-${Date.now()}`;
      console.warn(
        "[AutoMind] MONGODB_URI not configured or is a placeholder. Skipping DB write and returning demo userId."
      );
      return res.status(200).json({ userId: demoId });
    }

    await connectDB();
    try {
      const user = await User.create({
        fullName,
        whatsappNumber,
        contactNumber,
        location,
        role,
        paymentStatus: "pending"
      });
      return res.status(200).json({ userId: user._id.toString() });
    } catch (createError) {
      console.error("[AutoMind] User.create failed, falling back to demo userId.", createError);
      const demoId = `demo-${Date.now()}`;
      return res.status(200).json({ userId: demoId });
    }
  } catch (error) {
    console.error("Register error", error);
    return res.status(500).json({ message: "Failed to save user" });
  }
}
