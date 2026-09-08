import { defineCollection, z } from "astro:content";

/**
 * Tours are data, not markup. A new tour is a new .md file — no component
 * changes, no layout work.
 *
 * The schema is the contract. If you later move tours into a CMS, an
 * external API or a database, keep this shape and every component
 * downstream keeps working. That is the whole point of defining it here.
 */
const tours = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    shortTitle: z.string(),
    summary: z.string(),
    order: z.number(),
    draft: z.boolean().default(false),

    duration: z.string(),
    durationMinutes: z.number(),
    groupSize: z.object({ min: z.number(), max: z.number() }),

    price: z.object({
      amount: z.number(),
      currency: z.enum(["EUR", "RSD"]).default("EUR"),
      per: z.enum(["person", "group"]).default("person"),
      includes: z.array(z.string()).default([]),
      excludes: z.array(z.string()).default([]),
    }),

    // Ordered stops. Doubles as the itinerary on the page and as the
    // structured data for search engines.
    itinerary: z
      .array(
        z.object({
          title: z.string(),
          detail: z.string(),
          minutes: z.number().optional(),
        }),
      )
      .default([]),

    season: z.object({
      from: z.string(),
      to: z.string(),
    }),

    hero: z.string().optional(),
    gallery: z.array(z.string()).default([]),

    // Booking channels this tour is available through. The form always works;
    // these are additional routes for people who prefer a platform.
    externalBooking: z
      .object({
        airbnb: z.string().url().optional(),
        getyourguide: z.string().url().optional(),
      })
      .default({}),
  }),
});

export const collections = { tours };
