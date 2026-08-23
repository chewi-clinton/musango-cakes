import Image from "next/image";
import { api } from "@/lib/api";
import { getTranslations } from "next-intl/server";
import ProductVariantPicker from "@/components/ProductVariantPicker";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const product = await api.product(slug);
    return {
      title: product.meta_title || `${product.name} | Musango Cakes & More`,
      description: product.meta_description || product.description,
    };
  } catch {
    return {};
  }
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await api.product(slug);
  const t = await getTranslations("product");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 grid gap-10 md:grid-cols-2">
      <div className="grid gap-3">
        {product.images.map((img) => (
          <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden bg-black/5">
            <Image
              src={img.image}
              alt={img.alt_text || product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        {product.is_sold_out && (
          <span className="inline-block mt-2 bg-black text-white text-xs px-2 py-1 rounded-full">
            {t("soldOut")}
          </span>
        )}
        <p className="mt-4 text-black/70 whitespace-pre-line">{product.description}</p>

        <ProductVariantPicker product={product} />
      </div>
    </div>
  );
}
