"use server"

import { createAdminClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";
import {
  birthdayEmail,
  anniversaryEmail,
  adminNotificationDigestEmail,
  type AdminNotificationSummaryRow,
} from "@/lib/email-templates";
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
      eventReminder: { processed: 0, success: 0, failed: 0, skipped: 0 },
    };
  }

  logger.info("Starting notification processing");

  const ranAt = new Date();

  try {
    const birthdayResults = await processBirthdayNotifications();
    const anniversaryResults = await processAnniversaryNotifications();
    const eventReminderResults = await processEventReminderNotifications();

    logger.info("Notification processing complete", {
      birthday: birthdayResults,
      anniversary: anniversaryResults,
      eventReminder: eventReminderResults,
    });

    // --- Send admin digest email ---
    if (config.email.admin) {
      const allRows: AdminNotificationSummaryRow[] = [
        ...(birthdayResults.rows ?? []),
        ...(anniversaryResults.rows ?? []),
        ...(eventReminderResults.rows ?? []),
      ];
      const digest = adminNotificationDigestEmail(allRows, ranAt);
      await sendEmail({
        to: config.email.admin,
        subject: digest.subject,
        html: digest.html,
      });
      logger.info("Admin digest sent to", config.email.admin);
    } else {
      logger.warn("ADMIN_EMAIL not set — skipping admin digest");
    }

    revalidatePath("/admin/notifications");
    return {
      birthday: birthdayResults,
      anniversary: anniversaryResults,
      eventReminder: eventReminderResults,
    };
  } catch (error) {
    logger.error("Notification processing failed", error);
    throw error;
  }
}

async function processBirthdayNotifications() {
  const supabase = await createAdminClient();
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
    return { processed: 0, success: 0, failed: 0, rows: [] };
  }

  return sendNotificationBatch(birthdayMembers, (member) => ({
    type: "birthday",
    template: birthdayEmail(member.name),
    message: `Happy Birthday ${member.name}!`,
  }));
}

async function processAnniversaryNotifications() {
  const supabase = await createAdminClient();
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
    return { processed: 0, success: 0, failed: 0, rows: [] };
  }

  return sendNotificationBatch(anniversaryMembers, (member) => ({
    type: "anniversary",
    template: anniversaryEmail(
      member.name,
      member.anniversary
        ? new Date().getFullYear() - new Date(member.anniversary).getFullYear()
        : 1
    ),
    message: `Happy Anniversary ${member.name}!`,
  }));
}

async function sendNotificationBatch(
  members: { id: string; name: string; email: string,  anniversary: string}[],
  createNotification: (member: { id: string; name: string; email: string, anniversary: string }) => {
    type: string;
    template: { subject: string; html: string };
    message: string;
  },
) {
  const supabase = await createAdminClient();
  let successCount = 0;
  let failedCount = 0;
  const rows: AdminNotificationSummaryRow[] = [];

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
      rows.push({ recipientName: member.name, recipientEmail: member.email, type: notification.type, status: "skipped" });
      return { success: false, skipped: true };
    }

    try {
      const { success, data: emailData, error: emailError } = await sendEmail({
        to: member.email,
        subject: notification.template.subject,
        html: notification.template.html,
      });

      const errMsg = typeof emailError === "string" ? emailError : (emailError as any)?.message;

      const { error: dbError } = await supabase.from("notifications").insert({
        id: generateId(),
        memberId: member.id,
        type: notification.type,
        message: notification.message,
        status: success ? "sent" : "failed",
        ...(success ? { sentAt: new Date().toISOString() } : {}),
        metadata: { message_id: (emailData as any)?.messageId, error: emailError },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      if (dbError) logger.error("[DB] Failed to insert notification:", dbError);

      rows.push({
        recipientName: member.name,
        recipientEmail: member.email,
        type: notification.type,
        status: success ? "sent" : "failed",
        error: success ? undefined : errMsg,
      });

      if (!success) failedCount++;
      else successCount++;

      return { success };
    } catch (error) {
      failedCount++;
      const errMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error(`Failed to send notification to ${member.email}`, error);

      const { error: dbError2 } = await supabase.from("notifications").insert({
        id: generateId(),
        memberId: member.id,
        type: notification.type,
        message: notification.message,
        status: "failed",
        metadata: { error: errMsg },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      if (dbError2) logger.error("[DB] Failed to insert failed notification:", dbError2);

      rows.push({
        recipientName: member.name,
        recipientEmail: member.email,
        type: notification.type,
        status: "failed",
        error: errMsg,
      });

      return { success: false };
    }
  });

  await Promise.allSettled(notificationPromises);

  return { processed: members.length, success: successCount, failed: failedCount, rows };
}

export async function getNotificationsAction(filters: { type?: string; status?: string; limit?: number } = {}) {
  try {
    const supabase = await createAdminClient();
    const { type, status, limit = 50 } = filters;

    // Step 1: fetch notifications (no join — avoids PostgREST FK hint issues)
    let query = supabase
      .from("notifications")
      .select("*")
      .order("createdAt", { ascending: false })
      .limit(limit);

    if (type) query = query.eq("type", type);
    if (status) query = query.eq("status", status);

    const { data: notifications, error } = await query;

    if (error) {
      console.error("[getNotificationsAction] Supabase error:", JSON.stringify(error));
      // If columns are missing (migration not run), return empty list instead of crashing
      if (
        error.message?.includes("column") ||
        error.code === "42703" // undefined_column
      ) {
        console.warn("[getNotificationsAction] Missing columns — run supabase-notifications-migration.sql");
        return [];
      }
      throw error;
    }

    if (!notifications || notifications.length === 0) return [];

    // Step 2: batch-fetch member names for the returned notifications
    const memberIds = [...new Set(notifications.map((n) => n.memberId).filter(Boolean))];

    const { data: members, error: membersError } = await supabase
      .from("members")
      .select("id, name, email")
      .in("id", memberIds);

    if (membersError) {
      console.warn("[getNotificationsAction] Could not fetch member names:", membersError.message);
    }

    const memberMap = new Map((members || []).map((m) => [m.id, m]));

    // Attach member info to each notification
    return notifications.map((n) => ({
      ...n,
      members: memberMap.get(n.memberId) ?? null,
    }));
  } catch (error) {
    console.error("[getNotificationsAction] Error:", error);
    throw new Error("Failed to fetch notifications");
  }
}

export async function getNotificationStatsAction() {
  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("notifications")
      .select("status, type");

    if (error) {
      // If columns don't exist yet (migration not run), return zeros gracefully
      console.warn("[getNotificationStatsAction] Error (migration may be pending):", error.message);
      return { sent: 0, pending: 0, failed: 0 };
    }

    const stats = (data || []).reduce((acc, n) => {
      if (n.status) acc[n.status] = (acc[n.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { sent: 0, pending: 0, failed: 0, ...stats };
  } catch (error) {
    console.error("[getNotificationStatsAction] Error:", error);
    return { sent: 0, pending: 0, failed: 0 };
  }
}

async function processEventReminderNotifications() {
  const supabase = await createAdminClient();
  
  // Find events happening tomorrow
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const startOfTomorrow = new Date(tomorrow);
  startOfTomorrow.setHours(0, 0, 0, 0);

  const endOfTomorrow = new Date(tomorrow);
  endOfTomorrow.setHours(23, 59, 59, 999);

  // Fetch all events happening tomorrow
  const { data: events, error: eventsError } = await supabase
    .from("events")
    .select("*")
    .gte("date", startOfTomorrow.toISOString())
    .lte("date", endOfTomorrow.toISOString());

  if (eventsError) throw eventsError;
  if (!events || events.length === 0) {
    return { processed: 0, success: 0, failed: 0, skipped: 0 };
  }

  // Fetch all members
  const { data: members, error: membersError } = await supabase
    .from("members")
    .select("id, name, email");

  if (membersError) throw membersError;
  if (!members || members.length === 0) {
    return { processed: 0, success: 0, failed: 0, skipped: 0 };
  }

  const { eventReminderEmail } = await import("@/lib/email-templates");

  let successCount = 0;
  let failedCount = 0;
  let skippedCount = 0;
  const rows: AdminNotificationSummaryRow[] = [];

  // Process reminders for each event tomorrow
  for (const event of events) {
    const eventDateFormatted = new Date(event.date).toLocaleDateString("en-US", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const reminderPromises = members.map(async (member) => {
      // Check if we've already sent a reminder for this specific event to this member
      const { data: existingNotification } = await supabase
        .from("notifications")
        .select("id")
        .eq("memberId", member.id)
        .eq("type", "event_reminder")
        .eq("metadata->>eventId", event.id)
        .maybeSingle();

      if (existingNotification) {
        skippedCount++;
        rows.push({ recipientName: member.name, recipientEmail: member.email, type: "event_reminder", status: "skipped" });
        return;
      }

      try {
        const tmpl = eventReminderEmail(member.name, event.title, eventDateFormatted, event.location, event.id);
        const { success, data: emailData, error: emailError } = await sendEmail({
          to: member.email,
          subject: tmpl.subject,
          html: tmpl.html,
        });

        const errMsg = typeof emailError === "string" ? emailError : (emailError as any)?.message;

        await supabase.from("notifications").insert({
          id: generateId(),
          memberId: member.id,
          type: "event_reminder",
          message: `Reminder: "${event.title}" is tomorrow!`,
          status: success ? "sent" : "failed",
          ...(success ? { sentAt: new Date().toISOString() } : {}),
          metadata: { eventId: event.id, message_id: (emailData as any)?.messageId, error: emailError },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        rows.push({
          recipientName: member.name,
          recipientEmail: member.email,
          type: "event_reminder",
          status: success ? "sent" : "failed",
          error: success ? undefined : errMsg,
        });

        if (success) successCount++;
        else failedCount++;
      } catch (err) {
        failedCount++;
        const errMsg = err instanceof Error ? err.message : "Unknown error";
        logger.error(`Failed to send event reminder to ${member.email}`, err);

        await supabase.from("notifications").insert({
          id: generateId(),
          memberId: member.id,
          type: "event_reminder",
          message: `Reminder: "${event.title}" is tomorrow!`,
          status: "failed",
          metadata: { eventId: event.id, error: errMsg },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        rows.push({
          recipientName: member.name,
          recipientEmail: member.email,
          type: "event_reminder",
          status: "failed",
          error: errMsg,
        });
      }
    });

    await Promise.allSettled(reminderPromises);
  }

  return { processed: events.length * members.length, success: successCount, failed: failedCount, skipped: skippedCount, rows };
}
