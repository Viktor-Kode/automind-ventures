import { put } from "@vercel/blob";

/** Vercel server uploads are limited to ~4.5MB; stay under that. */
export const RECEIPT_MAX_BYTES = 4 * 1024 * 1024;

/**
 * Uploads receipt bytes to Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set.
 * Returns null if blob is not configured or upload fails (caller may fall back to a data URL).
 */
export async function uploadReceiptToPublicUrl(
  buffer: Buffer,
  mime: string,
  userId: string
): Promise<string | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return null;
  }
  const ext = mime.split("/")[1]?.replace(/[^a-z0-9]/gi, "") || "jpg";
  const pathname = `receipts/${userId}/${Date.now()}.${ext}`;
  try {
    const blob = await put(pathname, buffer, {
      access: "public",
      contentType: mime
    });
    return blob.url;
  } catch (e) {
    console.error("uploadReceiptToPublicUrl failed", e);
    return null;
  }
}
