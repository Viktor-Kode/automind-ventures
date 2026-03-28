export interface WhatsAppPayload {
  fullName: string;
  role: "owner" | "technician";
  contactNumber: string;
  whatsappNumber: string;
  location: string;
  vehicleMake?: string | null;
  vehicleModel?: string | null;
  vehicleYear?: number | null;
  receiptUrl?: string | null;
}

function absoluteReceiptUrl(url: string | null | undefined, origin: string): string {
  if (!url || !url.trim()) return "Not provided";
  const u = url.trim();
  // Data URLs cannot appear in wa.me text; we send the image separately via Web Share when possible.
  if (u.startsWith("data:")) return "Receipt image (sent as attachment when you share to WhatsApp)";
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  if (u.startsWith("/") && origin) return `${origin}${u}`;
  return u;
}

export function getWhatsAppMessageText(
  data: WhatsAppPayload,
  options?: { origin?: string; receiptLine?: string }
): string {
  const origin = options?.origin ?? "";
  const make = data.vehicleMake || "N/A";
  const model = data.vehicleModel || "N/A";
  const year = data.vehicleYear ? String(data.vehicleYear) : "N/A";
  const receipt =
    options?.receiptLine ?? absoluteReceiptUrl(data.receiptUrl ?? null, origin);

  return `Hello AutoMind Ventures,

I just completed my registration and payment.

Name: ${data.fullName}
Role: ${data.role === "owner" ? "Vehicle Owner" : "Technician"}

Phone: ${data.contactNumber}
WhatsApp: ${data.whatsappNumber}

Location: ${data.location}

Vehicle Details:
- Make: ${make}
- Model: ${model}
- Year: ${year}

Payment Receipt: ${receipt}
Thank you.`;
}

export function formatWhatsAppMessage(
  data: WhatsAppPayload,
  options?: { origin?: string }
): string {
  return encodeURIComponent(getWhatsAppMessageText(data, options));
}
