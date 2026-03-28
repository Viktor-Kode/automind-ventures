import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB, getMongoUri } from "../../../lib/db/connect";
import { User } from "../../../lib/db/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { fullName, whatsappNumber, contactNumber, location, role } = req.body || {};

  if (!fullName || !whatsappNumber || !contactNumber || !location || !role) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const uri = getMongoUri();
  const shouldSkipDb =
    !uri || uri.includes("CHANGE_ME_SECURELY");

  if (shouldSkipDb) {
    const demoId = `demo-${Date.now()}`;
    console.warn(
      "[AutoMind] MONGODB_URI not configured or is a placeholder. Skipping DB write and returning demo userId."
    );
    return res.status(200).json({ userId: demoId });
  }

  try {
    await connectDB();
  } catch (connErr) {
    console.error("[AutoMind] MongoDB connection failed", connErr);
    return res.status(503).json({
      message:
        "Cannot connect to the database. In MongoDB Atlas open Network Access and allow 0.0.0.0/0 (all IPs) or your host. Verify MONGODB_URI in Vercel (no extra quotes; password URL-encoded if it contains special characters)."
    });
  }

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
}
