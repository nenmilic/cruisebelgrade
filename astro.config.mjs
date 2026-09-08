// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";

/**
 * Output is "static" — every page is prerendered to HTML and served from the CDN.
 * Individual routes opt into server rendering with `export const prerender = false`.
 * Right now only /api/booking does that. Adding a live availability calendar,
 * a payment callback or a logged-in area later means adding routes, not
 * changing this file or redeploying differently.
 */
export default defineConfig({
  site: "https://cruisebelgrade.rs",
  output: "static",
  adapter: cloudflare({
    imageService: "compile",
    platformProxy: { enabled: true },
  }),
  integrations: [sitemap()],
  // i18n is configured but single-locale. Adding Serbian later is a config
  // change plus translated content files — no component rewrites.
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
    routing: { prefixDefaultLocale: false },
  },
  build: { inlineStylesheets: "auto" },
});
