import { NextRequest, NextResponse } from "next/server";
import { updateApplicantStatus } from "../../../lib/sheets";

export const dynamic = "force-dynamic";

const VALID_STATUSES = [
  "pending_payment",
  "awaiting_verification",
  "registered",
  "dropped"
];

export async function POST(req: NextRequest) {
  try {
    // Validate admin password
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token || token !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { ref, status } = body;

    if (!ref || !status) {
      return NextResponse.json(
        { success: false, error: "ref and status are required." },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status value." },
        { status: 400 }
      );
    }

    const result = await updateApplicantStatus(ref, status);

    return NextResponse.json({ success: result.success ?? true });
  } catch (err: unknown) {
    console.error("[update-status]", err);
    return NextResponse.json(
      { success: false, error: "Server error." },
      { status: 500 }
    );
  }
}
