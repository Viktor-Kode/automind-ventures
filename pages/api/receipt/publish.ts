import type { NextApiRequest, NextApiResponse } from "next";
import {
  RECEIPT_MAX_BYTES,
  uploadReceiptToPublicUrl
} from "../../../lib/server/uploadReceiptBlob";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "6mb"
    }
  }
};

/**
 * Publishes a receipt image to a public HTTPS URL (Vercel Blob) when configured.
 * Used from the success page when the stored receipt is still a data URL.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userId, receiptBase64, receiptMimeType } = req.body || {};

  if (!userId || typeof userId !== "string" || !receiptBase64 || typeof receiptBase64 !== "string") {
    return res.status(400).json({ message: "Missing userId or receipt image" });
  }

  let buffer: Buffer;
  try {
    buffer = Buffer.from(receiptBase64, "base64");
  } catch {
    return res.status(400).json({ message: "Invalid receipt image data" });
  }

  if (buffer.length === 0 || buffer.length > RECEIPT_MAX_BYTES) {
    return res.status(400).json({
      message: "Receipt image must be under 4MB (server upload limit)"
    });
  }

  const mime =
    typeof receiptMimeType === "string" && receiptMimeType.startsWith("image/")
      ? receiptMimeType
      : "image/jpeg";

  const url = await uploadReceiptToPublicUrl(buffer, mime, userId);
  if (!url) {
    return res.status(503).json({
      message:
        "Receipt hosting is not configured. Add your receipt image manually in WhatsApp, or set BLOB_READ_WRITE_TOKEN for your deployment."
    });
  }

  return res.status(200).json({ url });
}
