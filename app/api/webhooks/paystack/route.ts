import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { updateDonationStatusAction } from "@/app/action/donation-actions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-paystack-signature");
    const secret = process.env.PAYSTACK_WEBHOOK_SECRET;

    if (!secret) {
      console.error("PAYSTACK_WEBHOOK_SECRET is not defined");
      return new NextResponse("Webhook Secret Missing", { status: 500 });
    }

    // 1. Verify Signature
    const hash = crypto
      .createHmac("sha512", secret)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      console.warn("Invalid Paystack signature");
      return new NextResponse("Invalid Signature", { status: 400 });
    }

    // 2. Parse Event
    const event = JSON.parse(body);
    console.log("Paystack Webhook Received:", event.event);

    // 3. Handle successful charge
    if (event.event === "charge.success") {
      const data = event.data;
      const reference = data.reference;

      console.log(`Processing successful donation for reference: ${reference}`);

      await updateDonationStatusAction(reference, "completed", {
        gatewayReference: data.reference,
        paymentMethod: data.channel,
        channel: data.channel,
        paidAt: new Date(data.paid_at),
        metadata: data,
      });
    }

    return new NextResponse("Webhook Handled", { status: 200 });
  } catch (error) {
    console.error("Paystack Webhook Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
