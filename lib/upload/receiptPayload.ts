/** Read an image file as base64 + MIME type for POST /api/form/submit. */
export async function fileToReceiptPayload(file: File): Promise<{
  receiptBase64: string;
  receiptMimeType: string;
}> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });

  const comma = dataUrl.indexOf(",");
  const base64 = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
  const mimeMatch = dataUrl.match(/^data:([^;,]+)/);
  const receiptMimeType =
    mimeMatch?.[1] || file.type || "image/jpeg";

  return { receiptBase64: base64, receiptMimeType };
}
