"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";
import { generalMessageEmail } from "@/lib/email-templates";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";

const generateId = () => globalThis.crypto.randomUUID();

// ── Types ──────────────────────────────────────────────────────────────────
export interface MessageInput {
  subject: string;
  body: string;
  type?: "general" | "announcement" | "sermon" | "event" | "welcome";
  recipientType?: "all" | "member";
  recipientMemberId?: string;
  sentBy?: string;
}

// ── Send a message to all members or a specific member ─────────────────────
export async function sendMessageAction(input: MessageInput) {
  const supabase = await createAdminClient();
  const {
    subject,
    body,
    type = "general",
    recipientType = "all",
    recipientMemberId,
    sentBy,
  } = input;

  // Fetch recipients
  let membersQuery = supabase.from("members").select("id, name, email");
  if (recipientType === "member" && recipientMemberId) {
    membersQuery = membersQuery.eq("id", recipientMemberId) as typeof membersQuery;
  }

  const { data: members, error } = await membersQuery;
  if (error) {
    logger.error("Failed to fetch recipients for message", error);
    throw new Error("Failed to fetch recipients");
  }
  if (!members || members.length === 0) {
    return { sent: 0, failed: 0 };
  }

  // Persist message record
  const messageId = generateId();
  await supabase.from("messages").insert({
    id: messageId,
    subject,
    body,
    type,
    recipient_type: recipientType,
    recipient_member_id: recipientMemberId || null,
    sent_by: sentBy || null,
    sent_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  // Send email to each recipient
  let sent = 0;
  let failed = 0;

  await Promise.allSettled(
    members.map(async (member) => {
      const tmpl = generalMessageEmail(member.name, subject, body);
      const result = await sendEmail({
        to: member.email,
        subject: tmpl.subject,
        html: tmpl.html,
      });
      if (result.success) {
        sent++;
      } else {
        failed++;
        logger.warn(`Failed to send message to ${member.email}`, result.error);
      }
    })
  );

  revalidatePath("/admin/messages");
  return { sent, failed, messageId };
}

// ── Broadcast to all members automatically (called from server actions) ────
export async function broadcastToAllMembers(
  subject: string,
  body: string,
  type: MessageInput["type"] = "announcement"
) {
  return sendMessageAction({ subject, body, type, recipientType: "all" });
}

// ── Get all messages (admin) ───────────────────────────────────────────────
export async function getMessagesAction(
  filters: { type?: string; limit?: number } = {}
) {
  const supabase = await createAdminClient();
  const { type, limit = 50 } = filters;

  let query = supabase
    .from("messages")
    .select("*")
    .order("sent_at", { ascending: false })
    .limit(limit);

  if (type) query = query.eq("type", type);

  const { data, error } = await query;
  if (error) throw new Error("Failed to fetch messages");
  return data || [];
}

// ── Get messages for a logged-in member ────────────────────────────────────
export async function getMemberMessagesAction(memberId: string) {
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(`recipient_type.eq.all,recipient_member_id.eq.${memberId}`)
    .order("sent_at", { ascending: false })
    .limit(50);

  if (error) throw new Error("Failed to fetch member messages");
  return data || [];
}

// ── Broadcast new sermon to all members ─────────────────────────────────────
export async function broadcastNewSermonNotification(sermon: {
  title: string;
  speaker: string;
  slug: string;
  description: string | null;
}) {
  try {
    const supabase = await createAdminClient();
    const { data: members, error } = await supabase
      .from("members")
      .select("id, name, email");

    if (error) {
      logger.error("Failed to fetch recipients for sermon notification", error);
      return;
    }
    if (!members || members.length === 0) return;

    // Persist message record
    const messageId = generateId();
    await supabase.from("messages").insert({
      id: messageId,
      subject: `New Sermon: "${sermon.title}"`,
      body: sermon.description || `A new sermon by ${sermon.speaker} is now available: "${sermon.title}"`,
      type: "sermon",
      recipient_type: "all",
      sent_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    const { newSermonEmail } = await import("@/lib/email-templates");

    await Promise.allSettled(
      members.map(async (member) => {
        const tmpl = newSermonEmail(member.name, sermon.title, sermon.speaker, sermon.slug);
        await sendEmail({
          to: member.email,
          subject: tmpl.subject,
          html: tmpl.html,
        });
      })
    );
    
    revalidatePath("/admin/messages");
  } catch (err) {
    logger.error("Error broadcasting new sermon notification", err);
  }
}

// ── Broadcast new blog post to all members ──────────────────────────────────
export async function broadcastNewPostNotification(post: {
  title: string;
  excerpt: string | null;
  slug: string;
  content: string;
}) {
  try {
    const supabase = await createAdminClient();
    const { data: members, error } = await supabase
      .from("members")
      .select("id, name, email");

    if (error) {
      logger.error("Failed to fetch recipients for post notification", error);
      return;
    }
    if (!members || members.length === 0) return;

    // Persist message record
    const messageId = generateId();
    await supabase.from("messages").insert({
      id: messageId,
      subject: `New Article: "${post.title}"`,
      body: post.excerpt || `A new blog post has been published: "${post.title}"`,
      type: "announcement",
      recipient_type: "all",
      sent_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    const { newPostEmail } = await import("@/lib/email-templates");

    await Promise.allSettled(
      members.map(async (member) => {
        const tmpl = newPostEmail(member.name, post.title, post.excerpt || "", post.slug);
        await sendEmail({
          to: member.email,
          subject: tmpl.subject,
          html: tmpl.html,
        });
      })
    );
    
    revalidatePath("/admin/messages");
  } catch (err) {
    logger.error("Error broadcasting new post notification", err);
  }
}

