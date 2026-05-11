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
