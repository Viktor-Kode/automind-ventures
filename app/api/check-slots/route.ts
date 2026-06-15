import { NextResponse } from "next/server";
import { getAllApplicants } from "../../../lib/sheets";

export const dynamic = "force-dynamic";

const TOTAL_SLOTS = parseInt(process.env.NEXT_PUBLIC_TOTAL_SLOTS ?? "12");

export async function GET() {
  try {
    const applicants = await getAllApplicants();
    const filled = applicants.filter((a) => a.status !== "dropped").length;
    const remaining = Math.max(0, TOTAL_SLOTS - filled);

    return NextResponse.json(
      { total: TOTAL_SLOTS, filled, remaining },
      {
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=30"
        }
      }
    );
  } catch (err: unknown) {
    console.error("[check-slots]", err);
    return NextResponse.json(
      { total: TOTAL_SLOTS, filled: 0, remaining: TOTAL_SLOTS },
      { status: 200 }
    );
  }
}
