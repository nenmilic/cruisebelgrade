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
  phone: "+381 XX XXX XXXX",
  phoneE164: "+381XXXXXXXXX",
  email: "hello@cruisebelgrade.rs",
  whatsapp: "381XXXXXXXXX",
} as const;

export const social = {
  instagram: "https://instagram.com/cruisebelgrade",
  tiktok: "https://tiktok.com/@cruisebelgrade",
  // Existing channels stay live — the site is the hub, not a replacement.
  airbnb: "",
  getyourguide: "",
} as const;

/**
 * Images. Paths are relative to /public — a file at public/img/hero.jpg
 * is referenced here as "/img/hero.jpg".
 *
 * Leave a value empty and the site falls back to a plain dark panel rather
 * than a broken image.
 */
export const images = {
  hero: "/img/hero.jpg",
} as const;

export const boat = {
  type: "Pasara",
  hull: "V-hull",
  engine: "Yamaha 8HP four-stroke",
  maxGuests: 6,
} as const;

export const meetingPoint = {
  label: "Čukarički rukavac",
  note: "Exact pontoon sent with your confirmation.",
  lat: 44.7866,
  lng: 20.4189,
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
