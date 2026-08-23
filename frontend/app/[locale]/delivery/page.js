import StaticPageBody from "@/components/StaticPageBody";
import StoreLocationBlock from "@/components/StoreLocationBlock";
import { api } from "@/lib/api";

export const metadata = { title: "Delivery | Musango Cakes & More" };

export default async function DeliveryPage({ params }) {
  const { locale } = await params;
  const zonesRes = await api.deliveryZones();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <StaticPageBody slug="delivery" locale={locale} />

      <h2 className="text-lg font-semibold mt-8 mb-4">We Deliver Across Douala</h2>
      <div className="flex flex-wrap gap-2">
        {zonesRes.results?.map((z) => (
          <span key={z.id} className="text-sm px-3 py-1.5 rounded-full border">
            {z.name}
          </span>
        ))}
      </div>

      <StoreLocationBlock />
    </div>
  );
}
