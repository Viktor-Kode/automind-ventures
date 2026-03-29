export interface WhatsAppPayload {
  fullName: string;
  role: "owner" | "technician";
  contactNumber: string;
  whatsappNumber: string;
  location: string;
  vehicleMake?: string | null;
  vehicleModel?: string | null;
  vehicleYear?: number | null;
  technicianSpecialization?: string | null;
  receiptUrl?: string | null;
}

function absoluteReceiptUrl(url: string | null | undefined, origin: string): string {
  if (!url || !url.trim()) return "Not provided";
  const u = url.trim();
  // Data URLs cannot be embedded in wa.me; user attaches the image in WhatsApp after opening.
  if (u.startsWith("data:")) {
    return "Saved on AutoMind — I will attach the receipt image in chat";
  }
  if (u.startsWith("http://") || u.startsWith("https://")) {
    return u;
  }
  if (u.startsWith("/") && origin) {
    return `${origin}${u}`;
  }
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

  const spec = (data.technicianSpecialization ?? "").trim();
  const specializationLine =
    data.role === "technician"
      ? `\nSpecialization: ${spec || "—"}`
      : "";

  const vehicleBlock =
    data.role === "owner"
      ? `
Vehicle Details:
- Make: ${make}
- Model: ${model}
- Year: ${year}`
      : "";

  return `Hello AutoMind Ventures,

I just completed my registration and payment.

Name: ${data.fullName}
Role: ${data.role === "owner" ? "Vehicle Owner" : "Technician"}

Phone: ${data.contactNumber}
WhatsApp: ${data.whatsappNumber}

Location: ${data.location}${specializationLine}${vehicleBlock}

Payment Receipt: ${receipt}
Thank you.`;
}

export function formatWhatsAppMessage(
  data: WhatsAppPayload,
  options?: { origin?: string }
): string {
  return encodeURIComponent(getWhatsAppMessageText(data, options));
}
