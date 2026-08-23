import { api } from "@/lib/api";

export default async function StoreLocationBlock() {
  let storeInfo = null;
  try {
    storeInfo = await api.storeInfo();
  } catch {
    storeInfo = null;
  }

  return (
    <div className="rounded-xl border p-6 my-8">
      <p className="font-semibold">{storeInfo?.business_name || "Musango Cakes & More"}</p>
      <p className="text-black/60 mt-1">📍 {storeInfo?.address_text || "Douala, Cameroon"}</p>
      {storeInfo?.directions_url && (
        <a href={storeInfo.directions_url} className="text-sm underline mt-2 inline-block">
          Get Directions
        </a>
      )}
      {storeInfo?.maps_embed_url && (
        <iframe
          src={storeInfo.maps_embed_url}
          className="w-full h-64 mt-4 rounded-lg border-0"
          loading="lazy"
          title="Musango Cakes & More location"
        />
      )}
    </div>
  );
}
