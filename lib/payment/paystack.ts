export interface InitPaymentParams {
  amount: number;
  email: string;
  reference: string;
}

export interface PaymentResult {
  success: boolean;
  reference: string;
}

// Stub for future Paystack / Flutterwave integration.
export async function simulatePayment(params: InitPaymentParams): Promise<PaymentResult> {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return {
    success: true,
    reference: params.reference
  };
}

