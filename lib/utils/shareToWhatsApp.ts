import { getWhatsAppMessageText, type WhatsAppPayload } from "./formatWhatsAppMessage";

/**
 * Opens WhatsApp (app or web) with the registration message pre-filled.
 * Uses wa.me only — no system share sheet.
 */
export function openWhatsAppWithRegistration(opts: {
  payload: WhatsAppPayload;
  origin: string;
  whatsappNumber: string;
}): void {
  const { payload, origin, whatsappNumber } = opts;
  const receiptUrl = payload.receiptUrl;

  const plain = getWhatsAppMessageText(payload, { origin });
  const hint =
    receiptUrl?.startsWith("data:image/")
      ? "\n\nPlease attach your payment receipt using WhatsApp's attachment button. You can return to the AutoMind success page to copy or screenshot your receipt if needed."
      : "";
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(plain + hint)}`;

  window.location.href = url;
}
