import { getWhatsAppMessageText, type WhatsAppPayload } from "./formatWhatsAppMessage";

async function dataUrlToFile(dataUrl: string, baseName: string): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const type = blob.type || "image/jpeg";
  const ext = type.includes("png")
    ? "png"
    : type.includes("webp")
      ? "webp"
      : "jpg";
  const name = baseName.replace(/\.(jpg|jpeg|png|webp)$/i, "") + "." + ext;
  return new File([blob], name, { type });
}

/**
 * Tries Web Share with the receipt image (works with WhatsApp on many phones).
 * Falls back to wa.me with text only; wa.me cannot attach images by URL.
 */
export async function openWhatsAppWithRegistration(opts: {
  payload: WhatsAppPayload;
  origin: string;
  whatsappNumber: string;
}): Promise<void> {
  const { payload, origin, whatsappNumber } = opts;
  const receiptUrl = payload.receiptUrl;

  if (
    receiptUrl?.startsWith("data:image/") &&
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function"
  ) {
    try {
      const file = await dataUrlToFile(receiptUrl, "automind-payment-receipt.jpg");
      const text = getWhatsAppMessageText(payload, {
        origin,
        receiptLine: "Attached as image with this message."
      });
      const shareData: ShareData = { text, files: [file] };
      if (!navigator.canShare || navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return;
      }
    } catch (e) {
      const err = e as { name?: string };
      if (err?.name === "AbortError") return;
      console.warn("[AutoMind] Web Share failed, falling back to WhatsApp link", e);
    }
  }

  const plain = getWhatsAppMessageText(payload, { origin });
  const hint =
    receiptUrl?.startsWith("data:image/")
      ? "\n\nPlease attach your payment receipt using WhatsApp's attachment button. You can return to the AutoMind success page to copy or screenshot your receipt if needed."
      : "";
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(plain + hint)}`;
  window.open(url, "_blank");
}
