import { api } from "@/lib/api";

export default async function LocalBusinessJsonLd() {
  let storeInfo = null;
  try {
    storeInfo = await api.storeInfo();
  } catch {
    storeInfo = null;
  }

  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://musangocakes.com";
  const data = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: storeInfo?.business_name || "Musango Cakes & More",
    url: base,
    telephone: storeInfo?.phone || undefined,
    email: storeInfo?.email || undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Douala",
      addressCountry: "CM",
      streetAddress: storeInfo?.address_text || "Douala, Cameroon",
    },
    sameAs: [storeInfo?.instagram_url, storeInfo?.facebook_url, storeInfo?.x_url].filter(
      Boolean
    ),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
