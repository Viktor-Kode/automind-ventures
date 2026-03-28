import type { NextApiRequest, NextApiResponse } from "next";
import { randomUUID } from "crypto";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { fullName, whatsappNumber, contactNumber, location, role } = req.body || {};

  if (!fullName || !whatsappNumber || !contactNumber || !location || !role) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const userId = `user-${randomUUID()}`;
  return res.status(200).json({ userId });
}
