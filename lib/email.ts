import axios from "axios";
import { config } from "./config";

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  fromName?: string;
}

export async function sendEmail({ to, subject, html, from, fromName }: SendEmailParams) {
  if (!config.email.apiKey) {
    console.warn("Brevo API key not found. Skipping email sending.");
    return { success: false, error: "API key missing" };
  }

  const recipients = Array.isArray(to) ? to : [to];
  const senderEmail = from || config.email.from;
  const senderName = fromName || config.env.appName;

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: senderName, email: senderEmail },
        to: recipients.map((email) => ({ email })),
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": config.email.apiKey,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      }
    );

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Brevo email error:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}
