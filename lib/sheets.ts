
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
  phone?: string;
  fileBase64: string;
  fileName: string;
  mimeType: string;
}

/**
 * Send a POST to Apps Script using application/x-www-form-urlencoded.
 * This avoids the known issue where GAS redirects drop the JSON body.
 * Apps Script reads params via e.parameter (not e.postData.contents).
 */
async function postScript<T>(params: Record<string, string>): Promise<T> {
  const SCRIPT_URL = process.env.SHEET_SCRIPT_URL;
  if (!SCRIPT_URL) throw new Error("SHEET_SCRIPT_URL is not configured.");

  const res = await fetch(SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params).toString(),
    redirect: "follow",
    cache: "no-store"
  });

  const text = await res.text();

  let json: T;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Apps Script returned non-JSON: ${text.slice(0, 200)}`);
  }

  return json;
}

/**
 * Send a GET to Apps Script with action + params as query string.
 */
async function getScript<T>(params: Record<string, string>): Promise<T> {
  const SCRIPT_URL = process.env.SHEET_SCRIPT_URL;
  if (!SCRIPT_URL) throw new Error("SHEET_SCRIPT_URL is not configured.");

  const url = new URL(SCRIPT_URL);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    method: "GET",
    redirect: "follow",
    cache: "no-store",
    next: { revalidate: 0 }
  });

  const text = await res.text();

  let json: T;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Apps Script returned non-JSON: ${text.slice(0, 200)}`);
  }

  return json;
}

export async function submitApplication(
  data: SubmitApplicationPayload
): Promise<{ success: boolean; refCode: string }> {
  return postScript<{ success: boolean; refCode: string }>({
    action: "submit",
    ...data
  });
}

export async function uploadReceipt(
  data: UploadReceiptPayload
): Promise<{ success: boolean; receiptUrl: string }> {
  return postScript<{ success: boolean; receiptUrl: string }>({
    action: "upload",
    ...data
  });
}

export async function getAllApplicants(): Promise<Applicant[]> {
  const result = await getScript<{ rows: Applicant[] }>({ action: "getAll" });
  return result.rows ?? [];
}

export async function updateApplicantStatus(
  ref: string,
  status: string
): Promise<{ success: boolean }> {
  return postScript<{ success: boolean }>({ action: "updateStatus", ref, status });
}

export async function deleteApplicant(
  ref: string
): Promise<{ success: boolean }> {
  return postScript<{ success: boolean }>({ action: "deleteApplicant", ref });
}
