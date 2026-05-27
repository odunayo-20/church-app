const appName = process.env.NEXT_PUBLIC_APP_NAME || "Grace Community Church";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export function welcomeEmail(name: string) {
  return {
    subject: `Welcome to ${appName}, ${name}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #f59e0b, #ef4444); padding: 40px 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #fff;">Welcome to the Family! 🙏</h1>
        </div>
        <div style="padding: 32px 30px;">
          <p style="font-size: 16px; color: #94a3b8;">Dear <strong style="color: #fff;">${name}</strong>,</p>
          <p style="color: #94a3b8; line-height: 1.6;">We are so glad you've joined the <strong style="color: #f59e0b;">${appName}</strong> community! You're now a registered member and can enjoy:</p>
          <ul style="color: #94a3b8; line-height: 2;">
            <li>📖 Access to our full sermon library</li>
            <li>📅 RSVP to upcoming events</li>
            <li>🙏 Submit and view prayer requests</li>
            <li>💌 Receive updates & announcements</li>
            <li>🎂 Birthday & anniversary greetings</li>
          </ul>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${baseUrl}/dashboard" style="background: linear-gradient(135deg, #f59e0b, #ef4444); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 15px;">Visit Your Dashboard</a>
          </div>
          <p style="color: #64748b; font-size: 14px; border-top: 1px solid #1e293b; padding-top: 20px;">
            Blessings,<br/><strong style="color: #94a3b8;">${appName} Team</strong>
          </p>
        </div>
      </div>
    `,
  };
}

export function newSermonEmail(name: string, sermonTitle: string, speaker: string, sermonSlug: string) {
  return {
    subject: `New Sermon: "${sermonTitle}" — ${appName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 40px 30px; text-align: center;">
          <p style="margin: 0 0 8px; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.7);">New Sermon Available</p>
          <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #fff;">${sermonTitle}</h1>
          <p style="margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">by ${speaker}</p>
        </div>
        <div style="padding: 32px 30px;">
          <p style="font-size: 16px; color: #94a3b8;">Hi <strong style="color: #fff;">${name}</strong>,</p>
          <p style="color: #94a3b8; line-height: 1.6;">A new sermon has just been added to the library. Tune in and be blessed by the Word!</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${baseUrl}/sermons/${sermonSlug}" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 15px;">Watch / Listen Now</a>
          </div>
          <p style="color: #64748b; font-size: 14px; border-top: 1px solid #1e293b; padding-top: 20px;">
            Blessings,<br/><strong style="color: #94a3b8;">${appName} Team</strong>
          </p>
        </div>
      </div>
    `,
  };
}

export function newPostEmail(name: string, postTitle: string, excerpt: string, postSlug: string) {
  return {
    subject: `New Article: "${postTitle}" — ${appName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #0ea5e9, #06b6d4); padding: 40px 30px; text-align: center;">
          <p style="margin: 0 0 8px; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.7);">New Blog Post</p>
          <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #fff;">${postTitle}</h1>
        </div>
        <div style="padding: 32px 30px;">
          <p style="font-size: 16px; color: #94a3b8;">Hi <strong style="color: #fff;">${name}</strong>,</p>
          ${excerpt ? `<p style="color: #94a3b8; line-height: 1.6; font-style: italic; border-left: 3px solid #0ea5e9; padding-left: 16px;">${excerpt}</p>` : ""}
          <div style="text-align: center; margin: 32px 0;">
            <a href="${baseUrl}/blog/${postSlug}" style="background: linear-gradient(135deg, #0ea5e9, #06b6d4); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 15px;">Read the Article</a>
          </div>
          <p style="color: #64748b; font-size: 14px; border-top: 1px solid #1e293b; padding-top: 20px;">
            Blessings,<br/><strong style="color: #94a3b8;">${appName} Team</strong>
          </p>
        </div>
      </div>
    `,
  };
}

export function eventReminderEmail(name: string, eventTitle: string, eventDate: string, location: string, eventId: string) {
  return {
    subject: `Reminder: "${eventTitle}" is tomorrow — ${appName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #f59e0b, #f97316); padding: 40px 30px; text-align: center;">
          <p style="margin: 0 0 8px; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.7);">Event Reminder</p>
          <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #fff;">${eventTitle}</h1>
        </div>
        <div style="padding: 32px 30px;">
          <p style="font-size: 16px; color: #94a3b8;">Hi <strong style="color: #fff;">${name}</strong>,</p>
          <p style="color: #94a3b8; line-height: 1.6;">This is a friendly reminder that <strong style="color: #fff;">${eventTitle}</strong> is happening tomorrow!</p>
          <div style="background: #1e293b; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <p style="margin: 0 0 8px; color: #94a3b8;">📅 <strong style="color: #f59e0b;">Date:</strong> ${eventDate}</p>
            <p style="margin: 0; color: #94a3b8;">📍 <strong style="color: #f59e0b;">Location:</strong> ${location}</p>
          </div>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${baseUrl}/events/${eventId}" style="background: linear-gradient(135deg, #f59e0b, #f97316); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 15px;">View Event Details</a>
          </div>
          <p style="color: #64748b; font-size: 14px; border-top: 1px solid #1e293b; padding-top: 20px;">
            See you there!<br/><strong style="color: #94a3b8;">${appName} Team</strong>
          </p>
        </div>
      </div>
    `,
  };
}

export function generalMessageEmail(name: string, subject: string, body: string) {
  return {
    subject: `${subject} — ${appName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 40px 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #fff;">${subject}</h1>
        </div>
        <div style="padding: 32px 30px;">
          <p style="font-size: 16px; color: #94a3b8;">Hi <strong style="color: #fff;">${name}</strong>,</p>
          <div style="color: #94a3b8; line-height: 1.8;">${body.replace(/\n/g, "<br/>")}</div>
          <p style="color: #64748b; font-size: 14px; border-top: 1px solid #1e293b; padding-top: 20px; margin-top: 32px;">
            Blessings,<br/><strong style="color: #94a3b8;">${appName} Team</strong>
          </p>
        </div>
      </div>
    `,
  };
}

export function birthdayEmail(name: string) {
  return {
    subject: `🎂 Happy Birthday, ${name}! — ${appName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #f59e0b, #ef4444); padding: 40px 30px; text-align: center;">
          <p style="margin: 0 0 8px; font-size: 36px;">🎂</p>
          <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #fff;">Happy Birthday, ${name}!</h1>
          <p style="margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">Celebrating YOU today! 🎉</p>
        </div>
        <div style="padding: 32px 30px;">
          <p style="font-size: 16px; color: #94a3b8;">Dear <strong style="color: #fff;">${name}</strong>,</p>
          <p style="color: #94a3b8; line-height: 1.8;">On behalf of everyone at <strong style="color: #f59e0b;">${appName}</strong>, we want to wish you the most joyful birthday! May this special day be filled with love, laughter, and God's abundant blessings.</p>
          <p style="color: #94a3b8; line-height: 1.8;">May the Lord continue to bless and keep you through every season of life.</p>
          <div style="background: #1e293b; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
            <p style="margin: 0; color: #f59e0b; font-style: italic; font-size: 15px;">"For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you." — Jeremiah 29:11</p>
          </div>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${baseUrl}/dashboard" style="background: linear-gradient(135deg, #f59e0b, #ef4444); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 15px;">Visit Your Dashboard</a>
          </div>
          <p style="color: #64748b; font-size: 14px; border-top: 1px solid #1e293b; padding-top: 20px;">
            With love & blessings,<br/><strong style="color: #94a3b8;">${appName} Family</strong>
          </p>
        </div>
      </div>
    `,
  };
}

export function anniversaryEmail(name: string, years: number) {
  const ordinal =
    years === 1 ? "st" : years === 2 ? "nd" : years === 3 ? "rd" : "th";
  const yearsLabel = years > 0 ? `${years}${ordinal} ` : "";
  return {
    subject: `💍 Happy ${yearsLabel}Anniversary, ${name}! — ${appName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #ec4899, #8b5cf6); padding: 40px 30px; text-align: center;">
          <p style="margin: 0 0 8px; font-size: 36px;">💍</p>
          <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #fff;">Happy ${yearsLabel}Anniversary!</h1>
          <p style="margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">${name}, you are so loved! ❤️</p>
        </div>
        <div style="padding: 32px 30px;">
          <p style="font-size: 16px; color: #94a3b8;">Dear <strong style="color: #fff;">${name}</strong>,</p>
          <p style="color: #94a3b8; line-height: 1.8;">Today we celebrate a beautiful milestone with you! On behalf of the entire <strong style="color: #ec4899;">${appName}</strong> family, we wish you a blessed and joyful anniversary.</p>
          <p style="color: #94a3b8; line-height: 1.8;">May God's grace continue to fill your home with love, laughter, and peace.</p>
          <div style="background: #1e293b; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
            <p style="margin: 0; color: #ec4899; font-style: italic; font-size: 15px;">"Love is patient, love is kind... it always protects, always trusts, always hopes, always perseveres." — 1 Cor. 13:4,7</p>
          </div>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${baseUrl}/dashboard" style="background: linear-gradient(135deg, #ec4899, #8b5cf6); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 15px;">Visit Your Dashboard</a>
          </div>
          <p style="color: #64748b; font-size: 14px; border-top: 1px solid #1e293b; padding-top: 20px;">
            With love & blessings,<br/><strong style="color: #94a3b8;">${appName} Family</strong>
          </p>
        </div>
      </div>
    `,
  };
}
export interface AdminNotificationSummaryRow {
  recipientName: string;
  recipientEmail: string;
  type: string;
  status: "sent" | "failed" | "skipped";
  error?: string;
}

export function adminNotificationDigestEmail(
  rows: AdminNotificationSummaryRow[],
  ranAt: Date = new Date()
) {
  const sentRows = rows.filter((r) => r.status === "sent");
  const failedRows = rows.filter((r) => r.status === "failed");
  const skippedRows = rows.filter((r) => r.status === "skipped");

  const typeLabel = (t: string) =>
    ({ birthday: "🎂 Birthday", anniversary: "💍 Anniversary", event_reminder: "📅 Event Reminder", general: "📢 General" }[t] ?? t);

  const rowHtml = (r: AdminNotificationSummaryRow, i: number) => `
    <tr style="background: ${i % 2 === 0 ? "#1e293b" : "#0f172a"};">
      <td style="padding:10px 14px; color:#f8fafc; font-size:13px;">${r.recipientName}</td>
      <td style="padding:10px 14px; color:#94a3b8; font-size:13px;">${r.recipientEmail}</td>
      <td style="padding:10px 14px; color:#94a3b8; font-size:13px;">${typeLabel(r.type)}</td>
      <td style="padding:10px 14px;">
        ${r.status === "sent"
          ? '<span style="background:#10b981;color:#fff;padding:2px 10px;border-radius:99px;font-size:11px;font-weight:700;">SENT</span>'
          : r.status === "failed"
          ? `<span style="background:#ef4444;color:#fff;padding:2px 10px;border-radius:99px;font-size:11px;font-weight:700;">FAILED</span>${r.error ? `<br/><span style="color:#f87171;font-size:11px;">${r.error}</span>` : ""}`
          : '<span style="background:#64748b;color:#fff;padding:2px 10px;border-radius:99px;font-size:11px;font-weight:700;">SKIPPED</span>'}
      </td>
    </tr>`;

  return {
    subject: `[${appName}] Notification Digest — ${ranAt.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;background:#0f172a;color:#f8fafc;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px 30px;text-align:center;">
          <p style="margin:0 0 6px;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,.7);">Admin Report</p>
          <h1 style="margin:0;font-size:24px;font-weight:800;color:#fff;">Notification Digest</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,.7);font-size:13px;">${ranAt.toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}</p>
        </div>

        <!-- Summary cards -->
        <div style="display:flex;gap:16px;padding:24px 30px 0;">
          <div style="flex:1;background:#1e293b;border-radius:10px;padding:16px;text-align:center;">
            <p style="margin:0;font-size:28px;font-weight:800;color:#10b981;">${sentRows.length}</p>
            <p style="margin:4px 0 0;font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Sent</p>
          </div>
          <div style="flex:1;background:#1e293b;border-radius:10px;padding:16px;text-align:center;">
            <p style="margin:0;font-size:28px;font-weight:800;color:#ef4444;">${failedRows.length}</p>
            <p style="margin:4px 0 0;font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Failed</p>
          </div>
          <div style="flex:1;background:#1e293b;border-radius:10px;padding:16px;text-align:center;">
            <p style="margin:0;font-size:28px;font-weight:800;color:#64748b;">${skippedRows.length}</p>
            <p style="margin:4px 0 0;font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Skipped</p>
          </div>
        </div>

        <!-- Detail table -->
        <div style="padding:24px 30px;">
          ${rows.length === 0
            ? `<p style="text-align:center;color:#64748b;padding:32px 0;">No notifications were processed in this run.</p>`
            : `<table style="width:100%;border-collapse:collapse;border-radius:10px;overflow:hidden;">
                <thead>
                  <tr style="background:#6366f1;">
                    <th style="padding:10px 14px;text-align:left;font-size:12px;color:#fff;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Name</th>
                    <th style="padding:10px 14px;text-align:left;font-size:12px;color:#fff;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Email</th>
                    <th style="padding:10px 14px;text-align:left;font-size:12px;color:#fff;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Type</th>
                    <th style="padding:10px 14px;text-align:left;font-size:12px;color:#fff;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows.map(rowHtml).join("")}
                </tbody>
              </table>`}
        </div>

        <p style="color:#475569;font-size:12px;text-align:center;padding:0 30px 24px;">
          This is an automated digest from <strong style="color:#94a3b8;">${appName}</strong>. 
          <a href="${baseUrl}/admin/notifications" style="color:#6366f1;">View full notification log →</a>
        </p>
      </div>
    `,
  };
}

export function donationReceiptEmail(name: string, amount: number, reference: string) {
  return {
    subject: `Thank You for Your Donation - ${process.env.NEXT_PUBLIC_APP_NAME || "Church App"}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.6;">
        <h1 style="color: #f59e0b; margin-bottom: 20px;">Thank You, ${name}!</h1>
        <p>We have successfully received your donation of <strong>₦${amount.toLocaleString()}</strong>.</p>
        <p>Your generosity helps us continue our mission and make a difference in our community.</p>
        
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 25px 0; border: 1px solid #e5e7eb;">
          <h2 style="font-size: 16px; margin-top: 0;">Transaction Details:</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="color: #6b7280; padding: 5px 0;">Reference:</td>
              <td style="font-weight: bold; text-align: right;">${reference}</td>
            </tr>
            <tr>
              <td style="color: #6b7280; padding: 5px 0;">Amount:</td>
              <td style="font-weight: bold; text-align: right;">₦${amount.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="color: #6b7280; padding: 5px 0;">Date:</td>
              <td style="font-weight: bold; text-align: right;">${new Date().toLocaleDateString()}</td>
            </tr>
          </table>
        </div>

        <p>If you have any questions regarding your donation, please feel free to contact us.</p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Blessings,<br/>
          ${process.env.NEXT_PUBLIC_APP_NAME || "Church App"} Team
        </p>
      </div>
    `,
  };
}
