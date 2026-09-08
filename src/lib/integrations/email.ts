import type { BookingEnquiry, Env, NotificationChannel } from "./types";

/**
 * Email via Resend. Free tier covers 3,000 messages a month, which is far
 * more enquiries than you will get.
 *
 * Swapping to Postmark, SES or SMTP means rewriting this one file.
 */
export const emailChannel: NotificationChannel = {
  name: "email",

  isConfigured(env) {
    return Boolean(env.RESEND_API_KEY && env.NOTIFY_EMAIL_TO);
  },

  async send(enquiry, env) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.NOTIFY_EMAIL_FROM ?? "bookings@cruisebelgrade.rs",
        to: [env.NOTIFY_EMAIL_TO],
        reply_to: enquiry.email,
        subject: `${enquiry.guests} guests · ${enquiry.preferredDate} · ${enquiry.tourTitle}`,
        text: formatPlain(enquiry),
      }),
    });

    if (!res.ok) {
      throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
    }
  },
};

function formatPlain(e: BookingEnquiry): string {
  const lines = [
    e.tourTitle,
    "",
    `Date      ${e.preferredDate}`,
    `Guests    ${e.guests}`,
    `Name      ${e.name}`,
    `Email     ${e.email}`,
    e.phone ? `Phone     ${e.phone}` : null,
    "",
    e.message ? `Message\n${e.message}` : null,
    "",
    e.source && Object.keys(e.source).length
      ? `Source    ${Object.entries(e.source)
          .map(([k, v]) => `${k}=${v}`)
          .join(" ")}`
      : null,
    `Ref       ${e.id}`,
  ];
  return lines.filter((l) => l !== null).join("\n");
}
