/** Values exposed to the client via NEXT_PUBLIC_* (inlined at build time). */

const FALLBACK_SITE = "https://automind-ventures.vercel.app";

/**
 * Ensures NEXT_PUBLIC_SITE_URL is always a valid absolute URL so layout metadata
 * `new URL(...)` never throws (e.g. "localhost:3000" without protocol breaks the app).
 */
function resolveSiteUrl(raw: string | undefined): string {
  if (!raw?.trim()) return FALLBACK_SITE;
  const t = raw.trim();
  try {
    const u = new URL(t);
    return u.href.replace(/\/$/, "") || FALLBACK_SITE;
  } catch {
    try {
      const hostPart = t.split("/")[0] ?? t;
      const local =
        /^localhost$/i.test(hostPart) ||
        /^127\.\d+\.\d+\.\d+/.test(hostPart) ||
        /^\[::1\]/.test(hostPart);
      const withProto = local ? `http://${t}` : `https://${t}`;
      return new URL(withProto).href.replace(/\/$/, "");
    } catch {
      return FALLBACK_SITE;
    }
  }
}

export const siteUrl = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

export function getMetadataBase(): URL {
  try {
    return new URL(siteUrl);
  } catch {
    return new URL(FALLBACK_SITE);
  }
}

export const whatsappBusinessNumber =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2348055906616";

export function getWhatsAppHref(): string {
  return `https://wa.me/${whatsappBusinessNumber}`;
}
