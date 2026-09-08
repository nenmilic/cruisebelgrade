import type { BookingEnquiry, ChannelResult, Env, NotificationChannel } from "./types";
import { emailChannel } from "./email";
import { smsChannel, telegramChannel } from "./phone";

/**
 * Keeps a copy of every enquiry in Cloudflare KV. Costs nothing at your
 * volume and means a failed email is an inconvenience rather than a lost
 * customer. Also gives you something to export the day you want a CRM.
 *
 * Optional: without the KV binding it skips itself.
 */
const storageChannel: NotificationChannel = {
  name: "storage",

  isConfigured(env) {
    return Boolean(env.ENQUIRIES);
  },

  async send(enquiry, env) {
    await env.ENQUIRIES!.put(
      `enquiry:${enquiry.receivedAt}:${enquiry.id}`,
      JSON.stringify(enquiry),
    );
  },
};

/**
 * The registry. This array is the complete list of things that happen when
 * someone submits the form.
 *
 * To add a CRM, a Google Sheet, a calendar hold, a Slack message: write a
 * file exporting a NotificationChannel and add it here. To turn one off,
 * remove its environment variables — no code change, no deploy.
 */
export const channels: NotificationChannel[] = [
  storageChannel,
  telegramChannel,
  smsChannel,
  emailChannel,
];

/**
 * Runs every configured channel in parallel and never throws.
 *
 * Deliberate: one channel failing must not fail the request. The visitor
 * gets a confirmation as long as at least one channel delivered, and the
 * results tell you which ones did.
 */
export async function dispatch(
  enquiry: BookingEnquiry,
  env: Env,
): Promise<ChannelResult[]> {
  const results = await Promise.allSettled(
    channels.map(async (channel): Promise<ChannelResult> => {
      if (!channel.isConfigured(env)) {
        return { channel: channel.name, ok: false, skipped: true };
      }
      try {
        await channel.send(enquiry, env);
        return { channel: channel.name, ok: true };
      } catch (error) {
        return {
          channel: channel.name,
          ok: false,
          error: error instanceof Error ? error.message : String(error),
        };
      }
    }),
  );

  return results.map((r) =>
    r.status === "fulfilled"
      ? r.value
      : { channel: "unknown", ok: false, error: String(r.reason) },
  );
}

export type { BookingEnquiry, ChannelResult, Env, NotificationChannel };
