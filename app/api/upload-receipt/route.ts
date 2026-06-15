import { NextRequest, NextResponse } from "next/server";
import { uploadReceipt, updateApplicantStatus } from "../../../lib/sheets";

export const dynamic = "force-dynamic";

const MAX_BASE64_SIZE = 5 * 1024 * 1024 * 1.4; // ~5MB in base64

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ref, phone, fileBase64, fileName, mimeType } = body;

    if (!ref || !phone?.trim() || !fileBase64 || !fileName || !mimeType) {
      return NextResponse.json(
        { success: false, error: "All fields are required." },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf"
    ];
    if (!allowedTypes.includes(mimeType)) {
      return NextResponse.json(
        { success: false, error: "File type not allowed." },
        { status: 400 }
      );
    }

    if (fileBase64.length > MAX_BASE64_SIZE) {
      return NextResponse.json(
        { success: false, error: "File too large. Maximum 5MB." },
        { status: 400 }
      );
    }

    // Upload to Google Drive via Apps Script
    const uploadResult = await uploadReceipt({
      ref,
      phone: phone.trim(),
      fileBase64,
      fileName,
      mimeType
    });

    if (!uploadResult.success) {
      return NextResponse.json(
        { success: false, error: "Failed to upload receipt. Please try again." },
        { status: 500 }
      );
    }

    // Update status to awaiting_verification
    await updateApplicantStatus(ref, "awaiting_verification");

    return NextResponse.json({
      success: true,
      receiptUrl: uploadResult.receiptUrl
    });
  } catch (err: unknown) {
    console.error("[upload-receipt]", err);
    return NextResponse.json(
      { success: false, error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
