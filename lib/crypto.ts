import crypto from "crypto";

export function generateDonationReference(): string {
  const timestamp = Date.now();
  const random = crypto.randomBytes(4).toString("hex");
  return `don_${timestamp}_${random}`;
}

export function verifyPaystackWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  const hash = crypto
    .createHmac("sha512", secret)
    .update(payload)
    .digest("hex");

  return hash === signature;
}
