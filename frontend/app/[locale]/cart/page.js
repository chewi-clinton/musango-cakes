"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/lib/CartContext";

export default function CartPage() {
  const t = useTranslations("cart");
  const { items, removeItem, updateQuantity } = useCart();
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>

      {items.length === 0 ? (
        <p className="text-black/60">{t("empty")}</p>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.variantId} className="flex items-center justify-between border rounded-xl p-4">
              <div>
                <p className="font-medium">{item.productName}</p>
                <p className="text-sm text-black/60">{item.variantLabel}</p>
                <p className="text-sm text-black/60">
                  {Number(item.price).toLocaleString()} FCFA
                </p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.variantId, Math.max(1, Number(e.target.value)))}
                  className="border rounded-lg px-2 py-1 w-16"
                />
                <button
                  onClick={() => removeItem(item.variantId)}
                  className="text-sm text-red-600 underline"
                >
                  {t("remove")}
                </button>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-4 border-t">
            <span className="font-semibold">{t("total")}</span>
            <span className="font-semibold">{total.toLocaleString()} FCFA</span>
          </div>

          <Link
            href="/checkout"
            className="mt-4 text-center rounded-full bg-black text-white px-6 py-3 font-medium hover:bg-black/80"
          >
            {t("checkout")}
          </Link>
        </div>
      )}
    </div>
  );
}
