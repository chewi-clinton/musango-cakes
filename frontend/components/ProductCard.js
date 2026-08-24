import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import QuickAddButton from "./QuickAddButton";

export default async function ProductCard({ product }) {
  const t = await getTranslations("product");
  return (
    <div className="group flex flex-col rounded-xl border overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-square bg-black/5">
          {product.cover_image && (
            <Image
              src={product.cover_image.image}
              alt={product.cover_image.alt_text || product.name}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform"
            />
          )}
          {product.is_sold_out && (
            <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-full">
              {t("soldOut")}
            </span>
          )}
        </div>
        <div className="px-3 pt-3">
          <p className="font-medium text-sm">{product.name}</p>
          {product.starting_price && (
            <p className="text-black/60 text-sm mt-1">
              {t("startingAt")} {Number(product.starting_price).toLocaleString()} FCFA
            </p>
          )}
        </div>
      </Link>
      <div className="px-3 pb-3">
        <QuickAddButton product={product} />
      </div>
    </div>
  );
}
