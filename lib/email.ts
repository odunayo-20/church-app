import axios from "axios";
import { config } from "./config";

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  textContent?: string; // plain-text fallback — helps avoid Promotions tab
  from?: string;
  fromName?: string;
  replyTo?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  textContent,
  from,
  fromName,
  replyTo,
}: SendEmailParams) {
  if (!config.email.apiKey) {
    console.warn("Brevo API key not found. Skipping email sending.");
    return { success: false, error: "API key missing" };
  }

  const recipients = Array.isArray(to) ? to : [to];
  const senderEmail = from || config.email.from;
  const senderName = fromName || config.env.appName;

  // Auto-generate plain text from HTML if not provided
  const plainText =
    textContent ||
    html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();

  try {
    const payload: Record<string, any> = {
      sender: { name: senderName, email: senderEmail },
      to: recipients.map((email) => ({ email })),
      subject,
      htmlContent: html,
      textContent: plainText,
      // Transactional headers — tells Gmail this is NOT a bulk/promotional email
      headers: {
        "X-Mailer": "GraceChurch-App/1.0",
        "X-Priority": "1",
        "Importance": "high",
        "Precedence": "personal",
      },
    };

    if (replyTo) {
      payload.replyTo = { email: replyTo };
    }

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      payload,
      {
        headers: {
          "api-key": config.email.apiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Brevo email error:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}
