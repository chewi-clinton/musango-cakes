"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useCart } from "@/lib/CartContext";

export default function ProductVariantPicker({ product }) {
  const t = useTranslations("product");
  const router = useRouter();
  const { addItem } = useCart();
  const [selectedId, setSelectedId] = useState(product.variants[0]?.id);
  const [quantity, setQuantity] = useState(1);

  const variant = product.variants.find((v) => v.id === selectedId);

  function handleAddToCart() {
    if (!variant) return;
    addItem({
      variantId: variant.id,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      variantLabel: [variant.size, variant.flavor, variant.color].filter(Boolean).join(" / "),
      price: variant.price,
      quantity,
    });
    router.push("/cart");
  }

  return (
    <div className="mt-6">
      {product.variants.length > 0 && (
        <div className="mb-4">
          <label className="text-sm font-medium block mb-2">{t("size")}</label>
          <select
            className="border rounded-lg px-3 py-2 w-full"
            value={selectedId}
            onChange={(e) => setSelectedId(Number(e.target.value))}
          >
            {product.variants.map((v) => (
              <option key={v.id} value={v.id}>
                {[v.size, v.flavor, v.color].filter(Boolean).join(" / ") || "Standard"} —{" "}
                {Number(v.price).toLocaleString()} FCFA
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <label className="text-sm font-medium">Qty</label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          className="border rounded-lg px-3 py-2 w-20"
        />
      </div>

      <button
        onClick={handleAddToCart}
        disabled={product.is_sold_out || !variant}
        className="w-full rounded-full bg-black text-white px-6 py-3 font-medium hover:bg-black/80 disabled:opacity-40"
      >
        {t("addToCart")}
      </button>
    </div>
  );
}
