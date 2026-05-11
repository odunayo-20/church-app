"use server"

import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";
import { birthdayEmail, anniversaryEmail } from "@/lib/email-templates";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import { config } from "@/lib/config";

const generateId = () => globalThis.crypto.randomUUID();

export async function processNotificationsAction() {
  if (!config.email.apiKey) {
    logger.warn("Brevo not configured, skipping notification processing");
    return {
      birthday: { processed: 0, success: 0, failed: 0 },
      anniversary: { processed: 0, success: 0, failed: 0 },
    };
  }

  logger.info("Starting notification processing");

  try {
    const birthdayResults = await processBirthdayNotifications();
    const anniversaryResults = await processAnniversaryNotifications();

    logger.info("Notification processing complete", {
      birthday: birthdayResults,
      anniversary: anniversaryResults,
    });

    revalidatePath("/admin/notifications");
    return { birthday: birthdayResults, anniversary: anniversaryResults };
  } catch (error) {
    logger.error("Notification processing failed", error);
    throw error;
  }
}

async function processBirthdayNotifications() {
  const supabase = await createClient();
  const today = new Date();
  const month = today.getMonth();
  const date = today.getDate();

  const { data: members, error } = await supabase
    .from("members")
    .select("*")
    .not("birthday", "is", null);

  if (error) throw error;

  const birthdayMembers = (members || []).filter((member) => {
    if (!member.birthday) return false;
    const bday = new Date(member.birthday);
    return bday.getMonth() === month && bday.getDate() === date;
  });

  if (birthdayMembers.length === 0) {
    return { processed: 0, success: 0, failed: 0 };
  }

  return sendNotificationBatch(birthdayMembers, (member) => ({
    type: "birthday",
    template: birthdayEmail(member.name),
    message: `Happy Birthday ${member.name}!`,
  }));
}

async function processAnniversaryNotifications() {
  const supabase = await createClient();
  const today = new Date();
  const month = today.getMonth();
  const date = today.getDate();

  const { data: members, error } = await supabase
    .from("members")
    .select("*")
    .not("anniversary", "is", null);

  if (error) throw error;

  const anniversaryMembers = (members || []).filter((member) => {
    if (!member.anniversary) return false;
    const anniversary = new Date(member.anniversary);
    return anniversary.getMonth() === month && anniversary.getDate() === date;
  });

  if (anniversaryMembers.length === 0) {
    return { processed: 0, success: 0, failed: 0 };
  }

  return sendNotificationBatch(anniversaryMembers, (member) => ({
    type: "anniversary",
    template: anniversaryEmail(member.name, 1),
    message: `Happy Anniversary ${member.name}!`,
  }));
}

async function sendNotificationBatch(
  members: { id: string; name: string; email: string }[],
  createNotification: (member: { id: string; name: string; email: string }) => {
    type: string;
    template: { subject: string; html: string };
    message: string;
  },
) {
  const supabase = await createClient();
  let successCount = 0;
  let failedCount = 0;

  const notificationPromises = members.map(async (member) => {
    const notification = createNotification(member);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const { data: existingNotification } = await supabase
      .from("notifications")
      .select("id")
      .eq("memberId", member.id)
      .eq("type", notification.type)
      .gte("createdAt", startOfToday.toISOString())
      .maybeSingle();

    if (existingNotification) {
      logger.debug(`Skipping duplicate notification for ${member.id}`);
      return { success: false, skipped: true };
    }

    try {
      const { success, data: emailData, error: emailError } = await sendEmail({
        to: member.email,
        subject: notification.template.subject,
        html: notification.template.html,
      });

      await supabase.from("notifications").insert({
        id: generateId(),
        memberId: member.id,
        type: notification.type,
        message: notification.message,
        status: success ? "sent" : "failed",
        sentAt: success ? new Date().toISOString() : null,
        metadata: { message_id: emailData?.messageId, error: emailError },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      if (!success) {
        failedCount++;
      } else {
        successCount++;
      }

      return { success };
    } catch (error) {
      failedCount++;
      logger.error(`Failed to send notification to ${member.email}`, error);

      await supabase.from("notifications").insert({
        id: generateId(),
        memberId: member.id,
        type: notification.type,
        message: notification.message,
        status: "failed",
        metadata: {
          error: error instanceof Error ? error.message : "Unknown error",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return { success: false };
    }
  });

  await Promise.allSettled(notificationPromises);

  return { processed: members.length, success: successCount, failed: failedCount };
}

export async function getNotificationsAction(filters: { type?: string; status?: string; limit?: number } = {}) {
  try {
    const supabase = await createClient();
    const { type, status, limit = 50 } = filters;

    let query = supabase
      .from("notifications")
      .select("*, member:members(*)")
      .order("createdAt", { ascending: false })
      .limit(limit);

    if (type) query = query.eq("type", type);
    if (status) query = query.eq("status", status);

    const { data, error } = await query;

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw new Error("Failed to fetch notifications");
  }
}

export async function getNotificationStatsAction() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notifications")
      .select("status, type");

    if (error) throw error;

    const stats = (data || []).reduce((acc, n) => {
      acc[n.status] = (acc[n.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return stats;
  } catch (error) {
    console.error("Error fetching notification stats:", error);
    throw new Error("Failed to fetch notification stats");
  }
}
