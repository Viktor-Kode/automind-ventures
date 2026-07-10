export function generateRefCode(rowCount: number): string {
  const padded = String(rowCount).padStart(3, "0");
  return `GBT-${padded}`;
}

export type ApplicantStatus =
  | "pending_payment"
  | "awaiting_verification"
  | "registered"
  | "dropped";

export const STATUS_LABELS: Record<ApplicantStatus, string> = {
  pending_payment: "Applied",
  awaiting_verification: "Awaiting Verification",
  registered: "Registered",
  dropped: "Dropped"
};

export const STATUS_COLORS: Record<ApplicantStatus, string> = {
  pending_payment: "bg-white/10 text-white/60 border-white/20",
  awaiting_verification: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  registered: "bg-green-500/20 text-green-400 border-green-500/30",
  dropped: "bg-red-500/20 text-red-400 border-red-500/30"
};

export function getStatusLabel(status: string): string {
  return STATUS_LABELS[status as ApplicantStatus] ?? status;
}

export function getStatusColor(status: string): string {
  return (
    STATUS_COLORS[status as ApplicantStatus] ??
    "bg-white/10 text-white/60 border-white/20"
  );
}

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export function toCSV(
  rows: Record<string, string>[],
  headers: string[]
): string {
  const headerRow = headers.join(",");
  const dataRows = rows.map((row) =>
    headers.map((h) => `"${(row[h] ?? "").replace(/"/g, '""')}"`).join(",")
  );
  return [headerRow, ...dataRows].join("\n");
}

export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
