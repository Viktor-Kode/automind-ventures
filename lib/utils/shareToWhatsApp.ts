import { getWhatsAppMessageText, type WhatsAppPayload } from "./formatWhatsAppMessage";

function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, "");
}

/**
 * Opens WhatsApp (app or web) with pre-filled text — not the system share sheet.
 * `wa.me` cannot attach files; HTTPS receipt URLs appear in the message for link preview.
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
      ? "\n\n(I will attach my payment receipt image in this chat right after sending this message.)"
      : "";
  const to = digitsOnly(whatsappNumber);
  const url = `https://wa.me/${to}?text=${encodeURIComponent(plain + hint)}`;

  const opened = window.open(url, "_blank", "noopener,noreferrer");
  if (!opened) {
    window.location.assign(url);
  }
}
