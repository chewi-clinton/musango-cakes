import StaticPageBody from "@/components/StaticPageBody";
import StoreLocationBlock from "@/components/StoreLocationBlock";
import { api } from "@/lib/api";

export const metadata = { title: "Contact | Musango Cakes & More" };

export default async function ContactPage({ params }) {
  const { locale } = await params;
  let storeInfo = null;
  try {
    storeInfo = await api.storeInfo();
  } catch {
    storeInfo = null;
  }
  const whatsapp = storeInfo?.whatsapp_number?.replace(/\D/g, "") || "";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <StaticPageBody slug="contact" locale={locale} />
      <div className="flex flex-wrap gap-4 my-6 text-sm">
        {storeInfo?.phone && <span>📞 {storeInfo.phone}</span>}
        {storeInfo?.email && <span>✉️ {storeInfo.email}</span>}
        {storeInfo?.opening_hours && <span>🕒 {storeInfo.opening_hours}</span>}
      </div>
      <a
        href={`https://wa.me/${whatsapp}`}
        className="inline-block rounded-full bg-black text-white px-6 py-3 font-medium hover:bg-black/80"
      >
        Order on WhatsApp
      </a>
      <StoreLocationBlock />
    </div>
  );
}
