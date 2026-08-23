import StaticPageBody from "@/components/StaticPageBody";
import StoreLocationBlock from "@/components/StoreLocationBlock";
import { Link } from "@/i18n/navigation";

export const metadata = { title: "Cakes & Pastries in Douala | Musango Cakes & More" };

export default async function LocationsDoualaPage({ params }) {
  const { locale } = await params;
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <StaticPageBody slug="locations-douala" locale={locale} />
      <div className="flex gap-4 mt-6">
        <Link href="/cakes" className="underline">Cakes</Link>
        <Link href="/pastries" className="underline">Pastries</Link>
      </div>
      <StoreLocationBlock />
    </div>
  );
}
