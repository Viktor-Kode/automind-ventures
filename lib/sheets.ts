
export interface Applicant {
  refCode: string;
  name: string;
  phone: string;
  location: string;
  experience: string;
  reason: string;
  canAttend: string;
  status: string;
  receiptUrl: string;
  timestamp: string;
}

export interface SubmitApplicationPayload {
  name: string;
  phone: string;
  location: string;
  experience: string;
  reason: string;
  canAttend: string;
}

export interface UploadReceiptPayload {
  ref: string;
  phone: string;
  fileBase64: string;
  fileName: string;
  mimeType: string;
}

async function callScript<T>(
  params: Record<string, string>,
  method: "GET" | "POST" = "GET"
): Promise<T> {
  const SCRIPT_URL = process.env.SHEET_SCRIPT_URL;

  if (!SCRIPT_URL) {
    throw new Error("SHEET_SCRIPT_URL is not configured.");
  }

  if (method === "GET") {
    const url = new URL(SCRIPT_URL);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await fetch(url.toString(), {
      method: "GET",
      cache: "no-store",
      next: { revalidate: 0 }
    });
    if (!res.ok) throw new Error(`Script GET failed: ${res.status}`);
    return res.json();
  } else {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
      cache: "no-store"
    });
    if (!res.ok) throw new Error(`Script POST failed: ${res.status}`);
    return res.json();
  }
}

export async function submitApplication(
  data: SubmitApplicationPayload
): Promise<{ success: boolean; refCode: string }> {
  return callScript<{ success: boolean; refCode: string }>(
    { action: "submit", ...data },
    "POST"
  );
}

export async function uploadReceipt(
  data: UploadReceiptPayload
): Promise<{ success: boolean; receiptUrl: string }> {
  return callScript<{ success: boolean; receiptUrl: string }>(
    { action: "upload", ...data },
    "POST"
  );
}

export async function getAllApplicants(): Promise<Applicant[]> {
  const result = await callScript<{ rows: Applicant[] }>(
    { action: "getAll" },
    "GET"
  );
  return result.rows ?? [];
}

export async function updateApplicantStatus(
  ref: string,
  status: string
): Promise<{ success: boolean }> {
  return callScript<{ success: boolean }>(
    { action: "updateStatus", ref, status },
    "POST"
  );
}
