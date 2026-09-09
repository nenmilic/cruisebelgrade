/**
 * Single source of truth for everything about the business that appears in
 * more than one place. Change a phone number here, it changes everywhere.
 *
 * Nothing in components should hardcode a business fact. If you find yourself
 * typing an address or a price into a .astro file, it belongs here instead.
 */

export const site = {
  name: "Cruise Belgrade",
  domain: "cruisebelgrade.rs",
  url: "https://cruisebelgrade.rs",
  tagline: "Boat trips to the riverside places locals keep to themselves",
  description:
    "Small-boat trips on the Sava and Danube to fish restaurants tucked into the forest along the banks. Run by a Belgrade captain, for six guests at a time.",
  locale: "en",
  city: "Belgrade",
  country: "RS",
} as const;

export const captain = {
  name: "Nenad",
  displayName: "Captain Nenad",
  // Shown publicly. Use the number you actually answer.
  phone: "+381 63 80 275 90",
  phoneE164: "+381638027590",
  email: "milicnen@gmail.com",
  whatsapp: "381638027590",
  // Face of the business. Shown in the header the way a host photo works on
  // Airbnb: it is the single strongest trust signal on the page.
  photo: "/img/captain-nenad-belgrade-boat-tour-host.jpg",
  role: "At the tiller since 2019",
  // The handle that appears on the boat, the stickers and the videos.
  handle: "@CaptainNenad",
} as const;

export const social = {
  instagram: "",
  tiktok: "https://www.tiktok.com/@captain.cruise.belgrade",
  // Existing channels stay live — the site is the hub, not a replacement.
  airbnb: "https://airbnb.com/x/bgriverexp",
  getyourguide:
    "https://www.getyourguide.com/belgrade-l1688/belgrade-private-sunset-boat-tour-with-photography-t1352785",
} as const;

/**
 * Images. Paths are relative to /public — a file at public/img/hero.jpg
 * is referenced here as "/img/hero.jpg".
 *
 * Leave a value empty and the site falls back to a plain dark panel rather
 * than a broken image.
 */
export const images = {
  hero: "/img/danube-sunset-forest-bank-belgrade.jpg",
  // Small round window in the header, opposite the host photo. Purely
  // atmospheric - a glimpse of what the trip actually looks like.
  headerGlimpse: "/img/guest-relaxing-bow-danube-summer-cruise.jpg",
  // The brand mark. Used as a faint watermark over the hero and solid in
  // the footer. Same file for both - the CSS does the tinting.
  logo: "/img/logo-belgrade-from-the-rivers.png",
} as const;

export const boat = {
  type: "Pasara",
  hull: "V-hull",
  engine: "Yamaha 8HP four-stroke",
  // Four have room to move and sit properly. A fifth fits when everyone
  // already knows each other - say so rather than promising space that
  // isn't there and having someone spend four hours wedged in.
  comfortableGuests: 4,
  maxGuests: 5,
  guestsLabel: "4 comfortably, 5 for one group",
} as const;

export const meetingPoint = {
  label: "Čukarički rukavac",
  note: "Exact pontoon sent with your confirmation.",
  lat: 44.7866,
  lng: 20.4189,
} as const;

/**
 * Scheduling. Paste the full public booking page URL from Cal (cal.id or
 * cal.com). Leave it empty and the booking section falls back to the
 * enquiry form on its own.
 *
 * Availability comes from Google Calendar, which already receives Airbnb
 * events - so a slot taken on Airbnb cannot be booked here.
 */
export const booking = {
  // Your Cal profile. Each tour appends its own event slug via `calEvent`
  // in the tour's frontmatter, so a booking is always for the trip the
  // visitor is actually reading about.
  calBase: "https://cal.id/captainnenad",
  // Shown under the embed so guests know a slot is not final until you say so.
  note: "Requests are confirmed by me, usually within a few hours.",
} as const;

/**
 * Feature flags. Everything off by default; flip one on when the module behind
 * it exists. Lets you merge half-finished work without it reaching visitors.
 */
export const features = {
  onlinePayment: false,
  liveAvailability: false,
  reviews: false,
  blog: false,
  serbianLocale: false,
} as const;

export type SiteConfig = typeof site;
