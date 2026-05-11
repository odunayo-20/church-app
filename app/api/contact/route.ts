import { NextRequest } from "next/server";
import { sendEmail } from "@/lib/email";
import { successResponse, errorResponse } from "@/lib/api-response";
import { config } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return errorResponse("Missing required fields", 400);
    }

    // Save to DB
    const supabase = await createAdminClient();
    const { error: dbError } = await supabase.from("contact_messages").insert({
      id: globalThis.crypto.randomUUID(),
      name,
      email,
      subject,
      message,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (dbError) {
      console.error("Failed to save contact message to db:", dbError);
      return errorResponse("Failed to save message", 500);
    }

    // Try to send email, but don't fail the request if it doesn't work
    try {
      const { success, error: emailError } = await sendEmail({
        to: config.email.admin || config.email.from,
        subject: `New Contact Form Submission: ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
      });

      if (!success) {
        console.error("Email sending failed:", emailError);
      }
    } catch (e) {
      console.error("Email sending threw an error:", e);
    }

    return successResponse({ message: "Message sent" });
  } catch (error) {
    console.error("Contact form error:", error);
    return errorResponse("Failed to process request", 500);
  }
}
