import ProductGrid from "@/components/ProductGrid";
import { api } from "@/lib/api";

export const metadata = { title: "Shop | Musango Cakes & More" };

export default async function ShopPage({ searchParams }) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  if (params.category) qs.set("category", params.category);
  if (params.occasion) qs.set("occasion", params.occasion);
  if (params.min_price) qs.set("min_price", params.min_price);
  if (params.max_price) qs.set("max_price", params.max_price);

  const [productsRes, categories] = await Promise.all([
    api.products(qs.toString() ? `?${qs.toString()}` : ""),
    api.categories(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Shop</h1>
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.results?.map((c) => (
          <a
            key={c.slug}
            href={`/shop?category=${c.slug}`}
            className={`text-sm px-3 py-1.5 rounded-full border ${
              params.category === c.slug ? "bg-black text-white" : "hover:bg-black/5"
            }`}
          >
            {c.name}
          </a>
        ))}
      </div>
      <ProductGrid products={productsRes.results} />
    </div>
  );
}
