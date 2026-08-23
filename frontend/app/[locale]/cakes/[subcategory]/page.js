import ProductGrid from "@/components/ProductGrid";
import { api } from "@/lib/api";

export default async function CakeSubcategoryPage({ params }) {
  const { subcategory } = await params;
  const productsRes = await api.products(`?category=${subcategory}`);
  const categories = await api.categories();
  const category = categories.results.find((c) => c.slug === subcategory);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">{category?.name || subcategory}</h1>
      <ProductGrid products={productsRes.results} />
    </div>
  );
}
