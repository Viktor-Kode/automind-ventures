export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");
  // Basic Nigerian-style check: 10–14 digits
  return cleaned.length >= 10 && cleaned.length <= 14;
}

