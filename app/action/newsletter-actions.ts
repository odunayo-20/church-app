"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { paginate, type PaginationParams, type PaginatedResult } from "@/lib/db-service";
import { 
  newsletterSchema, 
  newsletterUpdateSchema, 
  newsletterSubscriberSchema 
} from "@/lib/validations";
import type { Newsletter, NewsletterSubscriber } from "@/types/models";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/email";
import { config } from "@/lib/config";

// --- Helpers ---

const mapSubscriber = (sub: any): NewsletterSubscriber => ({
  ...sub,
  createdAt: sub.created_at,
  updatedAt: sub.updated_at,
});

const mapNewsletter = (nl: any): Newsletter => ({
  ...nl,
  createdAt: nl.created_at,
  updatedAt: nl.updated_at,
  sentAt: nl.sent_at,
});

// --- Subscriber Actions ---

export async function getNewsletterSubscribersAction(params: PaginationParams): Promise<PaginatedResult<NewsletterSubscriber>> {
  try {
    const supabase = await createAdminClient();
    const result = await paginate<any>("newsletter_subscribers", params, {
      supabase,
      orderBy: { column: "created_at", ascending: false },
    });

    return {
      ...result,
      data: result.data.map(mapSubscriber),
    };
  } catch (error) {
    console.error("Error fetching newsletter subscribers:", error);
    throw new Error("Failed to fetch subscribers");
  }
}

export async function subscribeAction(email: string): Promise<{ success: true }> {
  try {
    const validatedData = newsletterSubscriberSchema.parse({ email });
    const supabase = await createAdminClient();

    const { error } = await supabase
      .from("newsletter_subscribers")
      .upsert(
        { email: validatedData.email, status: "active" },
        { onConflict: "email" }
      );

    if (error) throw error;
    
    revalidatePath("/admin/newsletters/subscribers");
    return { success: true };
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    throw new Error("Failed to subscribe");
  }
}

export async function unsubscribeAction(email: string): Promise<{ success: true }> {
  try {
    const supabase = await createAdminClient();
    const { error } = await supabase
      .from("newsletter_subscribers")
      .update({ status: "unsubscribed" })
      .eq("email", email);

    if (error) throw error;
    
    revalidatePath("/admin/newsletters/subscribers");
    return { success: true };
  } catch (error) {
    console.error("Error unsubscribing from newsletter:", error);
    throw new Error("Failed to unsubscribe");
  }
}

export async function deleteSubscriberAction(id: string): Promise<{ success: true }> {
  try {
    const supabase = await createAdminClient();
    const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/newsletters/subscribers");
    return { success: true };
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    throw new Error("Failed to delete subscriber");
  }
}

// --- Newsletter Actions ---

export async function getNewslettersAction(params: PaginationParams): Promise<PaginatedResult<Newsletter>> {
  try {
    const supabase = await createAdminClient();
    const result = await paginate<any>("newsletters", params, {
      supabase,
      orderBy: { column: "created_at", ascending: false },
    });

    return {
      ...result,
      data: result.data.map(mapNewsletter),
    };
  } catch (error) {
    console.error("Error fetching newsletters:", error);
    throw new Error("Failed to fetch newsletters");
  }
}

export async function getNewsletterByIdAction(id: string): Promise<Newsletter> {
  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("newsletters")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return mapNewsletter(data);
  } catch (error) {
    console.error(`Error fetching newsletter ${id}:`, error);
    throw new Error("Failed to fetch newsletter");
  }
}

export async function createNewsletterAction(data: { subject: string; content: string }): Promise<Newsletter> {
  try {
    const validatedData = newsletterSchema.parse({ ...data, status: "draft" });
    const supabase = await createAdminClient();
    
    const { data: newsletter, error } = await supabase
      .from("newsletters")
      .insert({
        subject: validatedData.subject,
        content: validatedData.content,
        status: "draft",
      })
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath("/admin/newsletters");
    return mapNewsletter(newsletter);
  } catch (error) {
    console.error("Error creating newsletter:", error);
    throw error;
  }
}

export async function updateNewsletterAction(id: string, data: Partial<{ subject: string; content: string; status: "draft" | "sent" }>): Promise<Newsletter> {
  try {
    const validatedData = newsletterUpdateSchema.parse(data);
    const supabase = await createAdminClient();
    
    const { data: newsletter, error } = await supabase
      .from("newsletters")
      .update(validatedData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath("/admin/newsletters");
    return mapNewsletter(newsletter);
  } catch (error) {
    console.error("Error updating newsletter:", error);
    throw error;
  }
}

export async function deleteNewsletterAction(id: string): Promise<{ success: true }> {
  try {
    const supabase = await createAdminClient();
    const { error } = await supabase.from("newsletters").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/newsletters");
    return { success: true };
  } catch (error) {
    console.error("Error deleting newsletter:", error);
    throw new Error("Failed to delete newsletter");
  }
}

export async function sendNewsletterAction(id: string): Promise<{ success: true }> {
  try {
    const supabase = await createAdminClient();
    
    // 1. Get newsletter and subscribers
    const [{ data: newsletter }, { data: subscribers }] = await Promise.all([
      supabase.from("newsletters").select("*").eq("id", id).single(),
      supabase.from("newsletter_subscribers").select("email").eq("status", "active")
    ]);
      
    if (!newsletter || newsletter.status === "sent") throw new Error("Newsletter not found or already sent");
    if (!subscribers || subscribers.length === 0) throw new Error("No active subscribers");
    
    // 2. Mark as sent
    await supabase.from("newsletters").update({
      status: "sent",
      sent_at: new Date().toISOString()
    }).eq("id", id);
    
    // 3. Send emails
    const { from } = config.email;
    const { appName, baseUrl } = config.env;

    for (const sub of subscribers) {
      await sendEmail({
        to: sub.email,
        subject: newsletter.subject,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #f59e0b;">${newsletter.subject}</h1>
            <div>${newsletter.content}</div>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
            <p style="font-size: 12px; color: #999; text-align: center;">
              Sent by ${appName}. <a href="${baseUrl}/unsubscribe?email=${encodeURIComponent(sub.email)}">Unsubscribe</a>
            </p>
          </div>
        `,
      });
    }
    
    revalidatePath("/admin/newsletters");
    return { success: true };
  } catch (error) {
    console.error("Error sending newsletter:", error);
    throw error;
  }
}
