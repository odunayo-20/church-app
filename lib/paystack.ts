import Paystack from "paystack";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY!) as any;

export interface InitializePaymentParams {
  email: string;
  amount: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentData {
  reference: string;
  amount: number;
  channel?: string;
  currency?: string;
  gateway_response?: string;
  paid_at?: string;
  createdAt?: string;
  customer?: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface PaymentVerificationResult {
  status: boolean;
  message: string;
  data: PaymentData;
}

export function initializePayment(params: InitializePaymentParams): Promise<{
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}> {
  return new Promise((resolve, reject) => {
    paystack.transaction.initialize(
      {
        email: params.email,
        amount: Math.round(params.amount * 100),
        reference: params.reference,
        callback_url: params.callbackUrl,
        metadata: params.metadata,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error: Error | null, response: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      },
    );
  });
}

export function verifyPayment(
  reference: string,
): Promise<PaymentVerificationResult> {
  return new Promise((resolve, reject) => {
    paystack.transaction.verify(
      reference,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error: Error | null, response: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      },
    );
  });
}
