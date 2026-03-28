import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { connectDB } from "../../../lib/db/connect";
import { User } from "../../../lib/db/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const raw = req.query.id;
  const id = Array.isArray(raw) ? raw[0] : raw;
  if (!id || !mongoose.Types.ObjectId.isValid(String(id))) {
    return res.status(404).end();
  }

  try {
    const uri = process.env.MONGODB_URI;
    if (!uri || uri.includes("CHANGE_ME_SECURELY") || uri.trim().length === 0) {
      return res.status(404).end();
    }

    await connectDB();
    const user = await User.findById(id)
      .select("receiptImageBase64 receiptMimeType")
      .lean();

    if (!user?.receiptImageBase64) {
      return res.status(404).end();
    }

    let buf: Buffer;
    try {
      buf = Buffer.from(user.receiptImageBase64, "base64");
    } catch {
      return res.status(500).end();
    }

    const type = user.receiptMimeType || "image/jpeg";
    res.setHeader("Content-Type", type);
    res.setHeader("Cache-Control", "private, max-age=3600");
    return res.status(200).send(buf);
  } catch (e) {
    console.error("Receipt fetch error", e);
    return res.status(500).end();
  }
}
