export interface WhatsAppPayload {
  fullName: string;
  role: "owner" | "technician";
  contactNumber: string;
  whatsappNumber: string;
  location: string;
  vehicleMake?: string | null;
  vehicleModel?: string | null;
  vehicleYear?: number | null;
  businessName?: string | null;
  specializedVehicle?: string | null;
}

export function formatWhatsAppMessage(data: WhatsAppPayload): string {
  const make = data.vehicleMake || "N/A";
  const model = data.vehicleModel || "N/A";
  const year = data.vehicleYear ? String(data.vehicleYear) : "N/A";
  const business = data.businessName || "N/A";
  const specialized = data.specializedVehicle || "N/A";

  const technicianSection =
    data.role === "technician"
      ? `
Technician Details:
- Business: ${business}
- Specialized Vehicle: ${specialized}
`
      : "";

  const base = `Hello AutoMind Ventures,

I just completed my registration.

Name: ${data.fullName}
Role: ${data.role === "owner" ? "Vehicle Owner" : "Technician"}

Phone: ${data.contactNumber}
WhatsApp: ${data.whatsappNumber}

Location: ${data.location}

Vehicle Details:
- Make: ${make}
- Model: ${model}
- Year: ${year}
${technicianSection}

Thank you.`;

  return encodeURIComponent(base);
}

