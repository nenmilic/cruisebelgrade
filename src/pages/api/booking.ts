import type { APIRoute } from "astro";
import { z } from "zod";
import { dispatch } from "../../lib/integrations";
import type { BookingEnquiry, Env } from "../../lib/integrations/types";

/** Server-rendered. Everything else on the site stays static. */
export const prerender = false;

const EnquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  tourSlug: z.string().trim().min(1).max(80),
  tourTitle: z.string().trim().min(1).max(200),
  preferredDate: z.string().trim().min(1).max(40),
  guests: z.coerce.number().int().min(1).max(12),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  source: z.record(z.string()).optional(),
  /** Honeypot. Real people leave it empty; most bots fill it in. */
  website: z.string().max(0).optional(),
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as { runtime?: { env: Env } }).runtime?.env ?? ({} as Env);

  let payload: unknown;
  try {
    const contentType = request.headers.get("content-type") ?? "";
    payload = contentType.includes("application/json")
      ? await request.json()
      : Object.fromEntries(await request.formData());
  } catch {
    return json({ ok: false, error: "Could not read the submitted form." }, 400);
  }

  const parsed = EnquirySchema.safeParse(payload);
  if (!parsed.success) {
    return json(
      {
        ok: false,
        error: "Some details are missing or look wrong.",
        fields: parsed.error.flatten().fieldErrors,
      },
      422,
    );
  }

  // Honeypot filled means a bot. Return success so it doesn't retry.
  if (parsed.data.website) {
    return json({ ok: true });
  }

  const enquiry: BookingEnquiry = {
    id: crypto.randomUUID().slice(0, 8),
    receivedAt: new Date().toISOString(),
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone || undefined,
    tourSlug: parsed.data.tourSlug,
    tourTitle: parsed.data.tourTitle,
    preferredDate: parsed.data.preferredDate,
    guests: parsed.data.guests,
    message: parsed.data.message || undefined,
    source: parsed.data.source,
  };

  const results = await dispatch(enquiry, env);
  const delivered = results.filter((r) => r.ok);

  if (delivered.length === 0) {
    const attempted = results.filter((r) => !r.skipped);
    console.error("No channel delivered enquiry", enquiry.id, attempted);

    // Be honest with the visitor and give them a way through anyway.
    return json(
      {
        ok: false,
        error:
          "The message did not go through. Please write to hello@cruisebelgrade.rs and it will reach me directly.",
        reference: enquiry.id,
      },
      502,
    );
  }

  if (delivered.length < results.filter((r) => !r.skipped).length) {
    console.warn("Partial delivery for enquiry", enquiry.id, results);
  }

  return json({ ok: true, reference: enquiry.id });
};

/** Anything other than POST gets a clear answer rather than a 404. */
export const ALL: APIRoute = async ({ request }) =>
  request.method === "POST"
    ? new Response(null, { status: 405 })
    : json({ ok: false, error: "Send booking enquiries as POST." }, 405);
