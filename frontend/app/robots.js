export default function robots() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://musangocakes.com";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
