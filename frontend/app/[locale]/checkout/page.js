"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCart } from "@/lib/CartContext";
import { api } from "@/lib/api";

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const { items, clear } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [fulfillmentType, setFulfillmentType] = useState("delivery");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const order = await api.checkout({
        customer: { name, phone },
        fulfillment_type: fulfillmentType,
        items: items.map((i) => ({ variant_id: i.variantId, quantity: i.quantity })),
      });
      clear();
      window.location.href = order.whatsapp_url;
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium block mb-1">{t("name")}</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">{t("phone")}</label>
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">{t("fulfillment")}</label>
          <select
            value={fulfillmentType}
            onChange={(e) => setFulfillmentType(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
          >
            <option value="delivery">{t("delivery")}</option>
            <option value="pickup">{t("pickup")}</option>
          </select>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting || items.length === 0}
          className="rounded-full bg-black text-white px-6 py-3 font-medium hover:bg-black/80 disabled:opacity-40"
        >
          {t("submit")}
        </button>
      </form>
    </div>
  );
}
