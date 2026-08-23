import { api } from "@/lib/api";
import { routing } from "@/i18n/routing";

const STATIC_PATHS = [
  "",
  "cakes",
  "cakes/birthday-cakes",
  "cakes/wedding-cakes",
  "cakes/custom-cakes",
  "pastries",
  "shop",
  "gallery",
  "delivery",
  "locations/douala",
  "about",
  "contact",
  "order",
  "privacy-policy",
  "terms",
  "refund-policy",
];

function localizedEntry(base, path) {
  return {
    url: `${base}/${routing.defaultLocale}${path ? `/${path}` : ""}`,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, `${base}/${locale}${path ? `/${path}` : ""}`])
      ),
    },
  };
}

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://musangocakes.com";
  const entries = STATIC_PATHS.map((p) => localizedEntry(base, p));

  try {
    const productsRes = await api.products();
    for (const product of productsRes.results || []) {
      entries.push(localizedEntry(base, `product/${product.slug}`));
    }
  } catch {
    // API unavailable at build time — static paths still get emitted
  }

  return entries;
}
