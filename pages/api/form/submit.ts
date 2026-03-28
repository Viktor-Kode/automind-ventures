import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "6mb"
    }
  }
};

const MAX_BYTES = 5 * 1024 * 1024;

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
    receiptBase64,
    receiptMimeType
  } = req.body || {};

  if (!userId || !receiptBase64 || typeof receiptBase64 !== "string") {
    return res.status(400).json({ message: "Missing userId or receipt image" });
  }

  let buffer: Buffer;
  try {
    buffer = Buffer.from(receiptBase64, "base64");
  } catch {
    return res.status(400).json({ message: "Invalid receipt image data" });
  }

  if (buffer.length === 0 || buffer.length > MAX_BYTES) {
    return res.status(400).json({ message: "Receipt image must be under 5MB" });
  }

  const mime = typeof receiptMimeType === "string" && receiptMimeType.startsWith("image/")
    ? receiptMimeType
    : "image/jpeg";

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

  const dataUrl = `data:${mime};base64,${buffer.toString("base64")}`;
  return res.status(200).json({
    success: true,
    receiptUrl: dataUrl
  });
}
