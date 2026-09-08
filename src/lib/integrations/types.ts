/**
 * The extension point.
 *
 * A booking enquiry arrives once and needs to reach several places: your
 * phone, your inbox, later maybe a CRM, a spreadsheet, a calendar, an
 * accounting tool. Each of those is a channel implementing this interface.
 *
 * Adding one means writing a file in this directory and adding a line to
 * index.ts. Nothing else in the codebase changes — not the form, not the
 * endpoint, not the page.
 *
 * Removing one means deleting its environment variables. Channels that
 * aren't configured skip themselves.
 */

export interface BookingEnquiry {
  id: string;
  receivedAt: string;

  name: string;
  email: string;
  phone?: string;

  tourSlug: string;
  tourTitle: string;
  preferredDate: string;
  guests: number;
  message?: string;

  /** Where the visitor came from — utm params, referrer, which video. */
  source?: Record<string, string>;
}

export interface ChannelResult {
  channel: string;
  ok: boolean;
  skipped?: boolean;
  error?: string;
}

export interface NotificationChannel {
  /** Stable identifier, used in logs and results. */
  name: string;

  /**
   * Return false when the channel's credentials are missing. The dispatcher
   * skips it rather than failing the whole request — a missing SMS key must
   * never cost you a booking that email could have delivered.
   */
  isConfigured(env: Env): boolean;

  send(enquiry: BookingEnquiry, env: Env): Promise<void>;
}

/** Cloudflare Pages environment bindings and secrets. */
export interface Env {
  RESEND_API_KEY?: string;
  NOTIFY_EMAIL_TO?: string;
  NOTIFY_EMAIL_FROM?: string;

  TWILIO_ACCOUNT_SID?: string;
  TWILIO_AUTH_TOKEN?: string;
  TWILIO_FROM?: string;
  NOTIFY_SMS_TO?: string;

  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;

  /** Optional KV namespace for storing enquiries. Bind it when you want one. */
  ENQUIRIES?: KVNamespace;

  TURNSTILE_SECRET_KEY?: string;

  [key: string]: unknown;
}

// Minimal shape so this file compiles without Cloudflare's full types.
export interface KVNamespace {
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  get(key: string): Promise<string | null>;
  list(options?: { prefix?: string }): Promise<{ keys: { name: string }[] }>;
}
