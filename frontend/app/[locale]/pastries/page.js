import ProductGrid from "@/components/ProductGrid";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api";

export const metadata = { title: "Pastries | Musango Cakes & More" };

export default async function PastriesPage() {
  const [categories, productsRes] = await Promise.all([
    api.categories(),
    api.products(),
  ]);
  const pastryCategories = categories.results.filter((c) => c.group === "pastries");
  const pastrySlugs = new Set(pastryCategories.map((c) => c.slug));
  const products = productsRes.results.filter((p) => pastrySlugs.has(p.category.slug));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Pastries</h1>
      <div className="flex flex-wrap gap-2 mb-8">
        {pastryCategories.map((c) => (
          <Link
            key={c.slug}
            href={`/shop?category=${c.slug}`}
            className="text-sm px-3 py-1.5 rounded-full border hover:bg-black/5"
          >
            {c.name}
          </Link>
        ))}
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
