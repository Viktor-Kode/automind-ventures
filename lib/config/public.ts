/** Values exposed to the client via NEXT_PUBLIC_* (inlined at build time). */

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://automind-ventures.vercel.app";

export const whatsappBusinessNumber =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2348055906616";

export function getWhatsAppHref(): string {
  return `https://wa.me/${whatsappBusinessNumber}`;
}
