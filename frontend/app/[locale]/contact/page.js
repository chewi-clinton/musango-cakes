import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { api } from "@/lib/api";

export const metadata = { title: "Contact | Musango Cakes & More" };

export default async function ContactPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations("footer");
  let storeInfo = null;
  try {
    storeInfo = await api.storeInfo();
  } catch {
    storeInfo = null;
  }
  const whatsapp = storeInfo?.whatsapp_number?.replace(/\D/g, "") || "";
  const address = storeInfo?.address_text || "Douala, Cameroon";
  const mapSrc =
    storeInfo?.maps_embed_url ||
    `https://www.google.com/maps?q=${encodeURIComponent(
      `Musango Cakes & More, ${address}`
    )}&output=embed`;

  const rows = [
    storeInfo?.phone && {
      Icon: Phone,
      label: locale === "fr" ? "Appelez-nous" : "Call Us",
      value: storeInfo.phone,
      href: `tel:${storeInfo.phone.replace(/\s/g, "")}`,
    },
    storeInfo?.whatsapp_number && {
      Icon: MessageCircle,
      label: "WhatsApp",
      value: storeInfo.whatsapp_number,
      href: `https://wa.me/${whatsapp}`,
    },
    storeInfo?.email && {
      Icon: Mail,
      label: locale === "fr" ? "Écrivez-nous" : "Email Us",
      value: storeInfo.email,
      href: `mailto:${storeInfo.email}`,
    },
    {
      Icon: MapPin,
      label: locale === "fr" ? "Visitez-nous" : "Visit Us",
      value: address,
      href: storeInfo?.directions_url || undefined,
    },
  ].filter(Boolean);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-10 md:grid-cols-2 items-start">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <h1 className="text-3xl font-bold mb-3">
            {locale === "fr" ? "Contactez-nous" : "Contact Us"}
          </h1>
          <p className="text-black/60 mb-8">
            {locale === "fr"
              ? "Nous sommes ouverts 24h/24 et 7j/7. Le moyen le plus rapide de nous joindre est WhatsApp."
              : "We're open 24/7. The fastest way to reach us is WhatsApp."}
          </p>

          <div className="flex flex-col items-center gap-6 md:items-stretch">
            {rows.map((row) => {
              const content = (
                <div className="flex flex-col items-center gap-2 text-center md:flex-row md:items-center md:gap-4 md:text-left">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-white">
                    <row.Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <div>
                    <p className="text-sm text-black/50">{row.label}</p>
                    <p className="font-medium">{row.value}</p>
                  </div>
                </div>
              );
              return row.href ? (
                <a key={row.label} href={row.href} target={row.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                  {content}
                </a>
              ) : (
                <div key={row.label}>{content}</div>
              );
            })}
          </div>
        </div>

        <div className="relative w-full h-90 md:h-full min-h-90 rounded-2xl overflow-hidden border">
          <iframe
            src={mapSrc}
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Musango Cakes & More location"
          />
        </div>
      </div>
    </div>
  );
}
