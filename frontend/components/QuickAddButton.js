"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCart } from "@/lib/CartContext";

export default function QuickAddButton({ product }) {
  const t = useTranslations("product");
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (!product.default_variant_id) return null;

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      variantId: product.default_variant_id,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      variantLabel: product.default_variant_label,
      price: product.starting_price,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={product.is_sold_out}
      className="mt-2 w-full rounded-full border text-xs font-medium py-1.5 hover:bg-black hover:text-white transition-colors disabled:opacity-40"
    >
      {added ? "Added" : t("addToCart")}
    </button>
  );
}
