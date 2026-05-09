import { NextRequest } from "next/server";
import { resend } from "@/lib/email";
import { successResponse, errorResponse } from "@/lib/api-response";
import { config } from "@/lib/config";

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return errorResponse("Missing required fields", 400);
    }

    if (!resend) {
      return errorResponse("Email service not configured", 500);
    }

    const { error } = await resend.emails.send({
      from: config.email.from,
      to: config.email.admin || config.email.from, // Fallback to from if admin not set
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

    if (error) {
      console.error("Email error:", error);
      return errorResponse("Failed to send message", 500);
    }

    return successResponse({ message: "Message sent" });
  } catch (error) {
    console.error("Contact form error:", error);
    return errorResponse("Failed to send message", 500);
  }
}
