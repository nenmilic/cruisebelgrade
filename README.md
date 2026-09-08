# cruisebelgrade.rs

Static site, server endpoints where they earn their place. Built so the
things you might add later — payments, a live calendar, a CRM, Serbian
translation — are additions rather than rewrites.

## Running it

```bash
npm install
cp .env.example .env      # fill in whichever channels you want
npm run dev               # localhost:4321
npm run build
```

## Why this stack

**Astro, `output: "static"`.** Every page is HTML on the CDN. A visitor
arriving from a TikTok video on a phone in Munich gets the page from a
node near Munich, not from a box in Belgrade. Individual routes opt into
server rendering with one line (`export const prerender = false`), so you
are not choosing between static and dynamic — you get both, per route.

**Cloudflare Pages.** Free at any traffic you will see, including the week
a video does well. No server to patch, no PHP, no database to be breached.

**Content collections with Zod schemas.** Tours are `.md` files validated
against a schema. Adding a third trip is adding a file. If you later move
tours into a CMS or an external API, keep the schema shape and every
component keeps working — that is what the schema is for.

## The layout

```
src/
  lib/
    config.ts              Business facts. Nothing is hardcoded in components.
    integrations/
      types.ts             NotificationChannel interface — the contract
      email.ts             Resend
      phone.ts             Twilio SMS + Telegram
      index.ts             Registry + dispatcher
  content/
    config.ts              Tour schema
    tours/*.md             One file per trip
  pages/
    index.astro
    tours/[slug].astro     Generated from the collection
    api/booking.ts         Server-rendered endpoint
  components/
  layouts/
```

## How the form works

Submit → `POST /api/booking` → validate with Zod → fan out to every
configured channel in parallel → respond.

The dispatcher never throws. A channel with missing credentials skips
itself; a channel that errors is logged and the others still deliver. The
visitor sees success if at least one channel got through. A missing Twilio
key must never cost you a booking that email would have delivered.

Three defences against spam, none of which annoy a real visitor: a
honeypot field, Zod length limits, and the fact that the endpoint does
nothing expensive. If bots ever become a real problem, add Cloudflare
Turnstile — the secret is already reserved in `types.ts`.

## Adding things later

**A notification channel** (Slack, Google Sheets, a CRM, a calendar hold):
write a file in `src/lib/integrations/` exporting a `NotificationChannel`,
add it to the `channels` array in `index.ts`. Nothing else changes — not
the form, not the endpoint, not the page.

**A new tour:** add a `.md` file in `src/content/tours/`. It appears on the
homepage, gets its own page, and shows up in the form's dropdown.

**Online payment:** add `src/pages/api/checkout.ts` with
`prerender = false`. Stripe or a local PSP. Flip `features.onlinePayment`
in `config.ts` when the UI is ready — the flag exists so you can merge
half-finished work without it reaching visitors.

**Live availability:** the endpoint pattern is already there. A KV
namespace or a small D1 database holds booked dates; the form fetches
them and greys out what's taken.

**Serbian:** `i18n` is configured in `astro.config.mjs` with one locale.
Add `"sr"` to the array, add translated content files. No component
rewrites, because no component has a hardcoded English string that isn't
also content.

**A blog, for search traffic:** a second content collection, same pattern
as tours. Worth doing eventually — "best fish restaurant near Belgrade by
boat" is a search someone makes.

## Storing enquiries

Optional but cheap insurance. Create the namespace and uncomment the
binding in `wrangler.toml`:

```bash
npx wrangler kv namespace create ENQUIRIES
```

Every enquiry is written there before notifications go out, so you have a
record even if every channel fails. It is also what you export the day you
want a real CRM.

## Deploying

Push to GitHub, connect the repo in Cloudflare Pages. Build command
`npm run build`, output directory `dist`. Add environment variables under
Settings → Environment variables, and mark the keys as encrypted.

For the domain: Cloudflare Registrar does not sell `.rs`, but Cloudflare
DNS handles it fine. Point the nameservers at Cloudflare from your
registrar, then add the custom domain in the Pages project — the DNS
records are created for you.

## Before it goes live

- Real phone, email and social handles in `src/lib/config.ts`
- Prices in the two tour files (currently `0`)
- Photos in `public/img/` — the hero image carries most of the persuasion
- `public/img/og.jpg` at 1200×630, which is what shows when someone shares the link
- Decide what happens with liability insurance before taking money for trips
