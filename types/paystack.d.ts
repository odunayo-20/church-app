declare module "paystack" {
  namespace Paystack {
    interface TransactionInitializeResponse {
      status: boolean;
      message: string;
      data: {
        authorization_url: string;
        access_code: string;
        reference: string;
      };
    }

    interface TransactionVerifyResponse {
      status: boolean;
      message: string;
      data: {
        reference: string;
        amount: number;
        channel: string;
        currency: string;
        gateway_response: string;
        paid_at: string;
        createdAt: string;
        customer: {
          email: string;
          firstName: string;
          lastName: string;
        };
      };
    }

    interface TransactionApi {
      initialize(
        options: {
          email: string;
          amount: number;
          reference?: string;
          callback_url?: string;
          metadata?: Record<string, unknown>;
        },
        callback: (
          error: Error | null,
          response: TransactionInitializeResponse,
        ) => void,
      ): void;

      verify(
        reference: string,
        callback: (
          error: Error | null,
          response: TransactionVerifyResponse,
        ) => void,
      ): void;
    }

    interface PaystackInstance {
      transaction: TransactionApi;
    }
  }

  function Paystack(secretKey: string): Paystack.PaystackInstance;

  export = Paystack;
}
