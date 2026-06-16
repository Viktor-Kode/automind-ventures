import { NextRequest, NextResponse } from "next/server";
import { deleteApplicant } from "../../../lib/sheets";

export const dynamic = "force-dynamic";

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
    const { ref } = body;

    if (!ref) {
      return NextResponse.json(
        { success: false, error: "ref is required." },
        { status: 400 }
      );
    }

    const result = await deleteApplicant(ref);

    return NextResponse.json({ success: result.success ?? true });
  } catch (err: unknown) {
    console.error("[delete-applicant]", err);
    return NextResponse.json(
      { success: false, error: "Server error." },
      { status: 500 }
    );
  }
}
