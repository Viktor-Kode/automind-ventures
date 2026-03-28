import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { put } from "@vercel/blob";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb"
    }
  }
};

function safeFileName(name: string): string {
  const base = path.basename(name).replace(/[^a-zA-Z0-9._-]/g, "_");
  return base.slice(0, 120) || "receipt.png";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { base64, fileName } = req.body || {};
  if (!base64 || typeof base64 !== "string") {
    return res.status(400).json({ message: "Missing base64 payload" });
  }

  let buffer: Buffer;
  try {
    buffer = Buffer.from(base64, "base64");
  } catch {
    return res.status(400).json({ message: "Invalid file data" });
  }

  if (buffer.length > 5 * 1024 * 1024) {
    return res.status(400).json({ message: "File too large" });
  }

  const safe = safeFileName(typeof fileName === "string" ? fileName : "receipt.png");
  const unique = `${Date.now()}-${safe}`;
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

  if (blobToken) {
    try {
      const blob = await put(`receipts/${unique}`, buffer, {
        access: "public",
        addRandomSuffix: true,
        token: blobToken
      });
      return res.status(200).json({ url: blob.url });
    } catch (e) {
      console.error("Blob upload error", e);
      return res.status(500).json({ message: "Failed to upload receipt" });
    }
  }

  if (process.env.VERCEL === "1") {
    console.error(
      "[AutoMind] BLOB_READ_WRITE_TOKEN is missing. Create a Blob store in Vercel and connect it to this project."
    );
    return res.status(503).json({
      message:
        "Receipt upload is not configured. In Vercel: Storage → Blob → create a store and connect it to this project."
    });
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
  } catch {
    return res.status(500).json({ message: "Could not create upload directory" });
  }

  const filePath = path.join(uploadsDir, unique);

  try {
    fs.writeFileSync(filePath, buffer);
  } catch (e) {
    console.error("Upload write error", e);
    return res.status(500).json({ message: "Failed to save file" });
  }

  const url = `/uploads/${unique}`;
  return res.status(200).json({ url });
}
