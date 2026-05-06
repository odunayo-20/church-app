import prisma from "@/lib/prisma";
import { resend } from "@/lib/email";
import { birthdayEmail, anniversaryEmail } from "@/lib/email-templates";
import { logger } from "@/lib/logger";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

export async function processNotifications() {
  if (!resend) {
    logger.warn("Resend not configured, skipping notification processing");
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

    return { birthday: birthdayResults, anniversary: anniversaryResults };
  } catch (error) {
    logger.error("Notification processing failed", error);
    throw error;
  }
}

async function processBirthdayNotifications() {
  const today = new Date();
  const month = today.getMonth();
  const date = today.getDate();

  const members = await prisma.member.findMany({
    where: { birthday: { not: null } },
  });

  const birthdayMembers = members.filter((member) => {
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
  const today = new Date();
  const month = today.getMonth();
  const date = today.getDate();

  const members = await prisma.member.findMany({
    where: { anniversary: { not: null } },
  });

  const anniversaryMembers = members.filter((member) => {
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
  let success = 0;
  let failed = 0;

  const notificationPromises = members.map(async (member) => {
    const notification = createNotification(member);

    const existingNotification = await prisma.notification.findFirst({
      where: {
        memberId: member.id,
        type: notification.type,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    if (existingNotification) {
      logger.debug(`Skipping duplicate notification for ${member.id}`);
      return { success: false, skipped: true };
    }

    if (!resend) {
      return { success: false, skipped: true };
    }

    try {
      const emailResult = await resend.emails.send({
        from: FROM_EMAIL,
        to: member.email,
        subject: notification.template.subject,
        html: notification.template.html,
      });

      await prisma.notification.create({
        data: {
          memberId: member.id,
          type: notification.type,
          message: notification.message,
          status: emailResult.error ? "failed" : "sent",
          sentAt: emailResult.error ? null : new Date(),
          metadata: { messageId: emailResult.data?.id },
        },
      });

      if (emailResult.error) {
        failed++;
      } else {
        success++;
      }

      return { success: !emailResult.error };
    } catch (error) {
      failed++;
      logger.error(`Failed to send notification to ${member.email}`, error);

      await prisma.notification.create({
        data: {
          memberId: member.id,
          type: notification.type,
          message: notification.message,
          status: "failed",
          metadata: {
            error: error instanceof Error ? error.message : "Unknown error",
          },
        },
      });

      return { success: false };
    }
  });

  await Promise.allSettled(notificationPromises);

  return { processed: members.length, success, failed };
}
