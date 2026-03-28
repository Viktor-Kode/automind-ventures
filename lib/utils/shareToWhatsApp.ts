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
 * Sends the user to WhatsApp with your details.
 * If there is a receipt image (data URL), uses the device share sheet so the image can be
 * attached to WhatsApp in one step (wa.me cannot attach files).
 * Otherwise opens wa.me directly with pre-filled text.
 */
export async function openWhatsAppWithRegistration(opts: {
  payload: WhatsAppPayload;
  origin: string;
  whatsappNumber: string;
}): Promise<void> {
  const { payload, origin, whatsappNumber } = opts;
  const receiptUrl = payload.receiptUrl;

  const textWithAttachmentNote = getWhatsAppMessageText(payload, {
    origin,
    receiptLine: "Receipt image is attached with this message."
  });

  if (
    receiptUrl?.startsWith("data:image/") &&
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function"
  ) {
    try {
      const file = await dataUrlToFile(receiptUrl, "automind-payment-receipt.jpg");
      const shareData: ShareData = { text: textWithAttachmentNote, files: [file] };
      if (!navigator.canShare || navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return;
      }
    } catch (e) {
      const err = e as { name?: string };
      if (err?.name === "AbortError") return;
      console.warn("[AutoMind] Share with receipt failed, using WhatsApp link only", e);
    }
  }

  const plain = getWhatsAppMessageText(payload, { origin });
  const hint =
    receiptUrl?.startsWith("data:image/")
      ? "\n\nPlease attach your payment receipt using the image preview on the AutoMind success page."
      : "";
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(plain + hint)}`;
  window.location.href = url;
}
