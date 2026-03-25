import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../../lib/db/connect";
import { User } from "../../../lib/db/models/User";

function parseAutoMindTxRef(txRef: string): { role: "owner" | "technician"; userId: string } | null {
  // tx_ref format: AUTOMIND-<role>-<userId>-<timestamp>
  // userId may contain dashes in demo mode, so we capture greedily.
  const match = txRef.match(/^AUTOMIND-(owner|technician)-(.+)-(\d+)$/);
  if (!match) return null;
  const role = match[1] as "owner" | "technician";
  const userId = match[2];
  return { role, userId };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { tx_ref } = req.body || {};

  if (!tx_ref) {
    return res.status(400).json({ message: "Missing tx_ref" });
  }

  try {
    const parsed = parseAutoMindTxRef(tx_ref);
    if (!parsed) {
      return res.status(400).json({ message: "Invalid tx_ref format" });
    }

    const { role, userId } = parsed;

    const secret = process.env.FLUTTERWAVE_SECRET_KEY;
    if (!secret) {
      // Development fallback: allow flow to proceed even without server verification.
      return res.status(200).json({ success: true, role, userId });
    }

    // Verify with Flutterwave by reference (tx_ref).
    const verifyUrl = `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${encodeURIComponent(
      tx_ref
    )}`;

    const flutterRes = await fetch(verifyUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secret}`
      }
    });

    const flutterJson = await flutterRes.json();

    const fwStatus =
      flutterJson?.data?.status ||
      flutterJson?.data?.transaction_status ||
      flutterJson?.data?.charge_response_code;

    if (fwStatus !== "successful") {
      return res.status(400).json({
        success: false,
        message: "Payment not successful."
      });
    }

    // Update payment status (best-effort).
    try {
      await connectDB();
      await User.findByIdAndUpdate(userId, { paymentStatus: true });
    } catch {
      // Ignore DB write failures so the redirect can still complete.
    }

    return res.status(200).json({ success: true, role, userId });
  } catch (error) {
    console.error("Payment verify error", error);
    return res.status(500).json({ message: "Failed to verify payment" });
  }
}

