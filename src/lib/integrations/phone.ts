import type { BookingEnquiry, Env, NotificationChannel } from "./types";

/** Short enough for one SMS, complete enough to act on without opening email. */
function shortSummary(e: BookingEnquiry): string {
  return [
    `${e.tourTitle}`,
    `${e.preferredDate} · ${e.guests} guests`,
    `${e.name} · ${e.phone ?? e.email}`,
  ].join("\n");
}

/**
 * SMS via Twilio. Reliable, arrives on any phone, costs a few cents a message.
 */
export const smsChannel: NotificationChannel = {
  name: "sms",

  isConfigured(env) {
    return Boolean(
      env.TWILIO_ACCOUNT_SID &&
        env.TWILIO_AUTH_TOKEN &&
        env.TWILIO_FROM &&
        env.NOTIFY_SMS_TO,
    );
  },

  async send(enquiry, env) {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`;
    const body = new URLSearchParams({
      To: env.NOTIFY_SMS_TO!,
      From: env.TWILIO_FROM!,
      Body: shortSummary(enquiry),
    });

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    if (!res.ok) {
      throw new Error(`Twilio responded ${res.status}: ${await res.text()}`);
    }
  },
};

/**
 * Telegram. Free, instant, and it arrives on your phone as a push
 * notification — in practice the fastest of the three. Worth running
 * alongside SMS rather than instead of it: if Twilio has a bad day, this
 * still reaches you.
 *
 * Setup: message @BotFather, create a bot, take the token. Send your bot a
 * message, then open api.telegram.org/bot<TOKEN>/getUpdates to find your
 * chat id.
 */
export const telegramChannel: NotificationChannel = {
  name: "telegram",

  isConfigured(env) {
    return Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID);
  },

  async send(enquiry, env) {
    const res = await fetch(
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text: shortSummary(enquiry) + (enquiry.message ? `\n\n${enquiry.message}` : ""),
          disable_web_page_preview: true,
        }),
      },
    );

    if (!res.ok) {
      throw new Error(`Telegram responded ${res.status}: ${await res.text()}`);
    }
  },
};
