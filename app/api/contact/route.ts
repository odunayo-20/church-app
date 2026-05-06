import { NextRequest } from "next/server";
import { z } from "zod";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/api-response";
import { resend } from "@/lib/email";
import { config } from "@/lib/config";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = contactSchema.parse(body);

    if (resend) {
      await resend.emails.send({
        from: config.email.from,
        to: config.email.admin,
        subject: `Contact Form: ${validated.subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${validated.name}</p>
          <p><strong>Email:</strong> ${validated.email}</p>
          <p><strong>Subject:</strong> ${validated.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${validated.message}</p>
        `,
        replyTo: validated.email,
      });
    }

    return successResponse({ message: "Message sent successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}
