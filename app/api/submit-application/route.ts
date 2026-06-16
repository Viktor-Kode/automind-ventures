import { NextRequest, NextResponse } from "next/server";
import { submitApplication } from "../../../lib/sheets";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, phone, location, experience, reason, canAttend } = body;

    // Validate required fields
    if (!name?.trim() || !phone?.trim() || !location?.trim() || !experience || !canAttend) {
      return NextResponse.json(
        { success: false, error: "All required fields must be filled." },
        { status: 400 }
      );
    }

    if (!/^\d{7,15}$/.test(phone.replace(/\s/g, ""))) {
      return NextResponse.json(
        { success: false, error: "Invalid phone number." },
        { status: 400 }
      );
    }

    const result = await submitApplication({
      name: name.trim(),
      phone: phone.trim(),
      location: location.trim(),
      experience,
      reason: (reason ?? "").trim().slice(0, 200),
      canAttend
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Failed to save application. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, refCode: result.refCode });
  } catch (err: unknown) {
    console.error("[submit-application]", err);
    return NextResponse.json(
      { success: false, error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
