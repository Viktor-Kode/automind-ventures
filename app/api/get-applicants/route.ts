import { NextRequest, NextResponse } from "next/server";
import { getAllApplicants } from "../../../lib/sheets";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Validate admin password from Authorization header
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token || token !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const rows = await getAllApplicants();

    return NextResponse.json({ rows });
  } catch (err: unknown) {
    console.error("[get-applicants]", err);
    return NextResponse.json(
      { error: "Failed to fetch applicants." },
      { status: 500 }
    );
  }
}
