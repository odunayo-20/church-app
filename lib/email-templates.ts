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
    subject: `Happy Birthday, ${name}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4f46e5;">Happy Birthday, ${name}!</h1>
        <p>Wishing you a wonderful day filled with joy and blessings.</p>
        <p>May this year bring you health, happiness, and peace.</p>
        <p style="color: #6b7280; font-size: 14px;">
          With warm regards,<br/>
          ${process.env.NEXT_PUBLIC_APP_NAME || "Church App"} Team
        </p>
      </div>
    `,
  };
}

export function anniversaryEmail(name: string, years: number) {
  const ordinal =
    years === 1 ? "st" : years === 2 ? "nd" : years === 3 ? "rd" : "th";
  return {
    subject: `Happy ${years}${ordinal} Anniversary, ${name}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4f46e5;">Happy ${years}${ordinal} Anniversary, ${name}!</h1>
        <p>Celebrating ${years} years of love and commitment.</p>
        <p>May your bond continue to grow stronger with each passing year.</p>
        <p style="color: #6b7280; font-size: 14px;">
          With warm regards,<br/>
          ${process.env.NEXT_PUBLIC_APP_NAME || "Church App"} Team
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
