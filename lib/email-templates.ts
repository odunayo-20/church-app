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
