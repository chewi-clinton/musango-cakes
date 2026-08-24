"use client";

import { useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api";

const SIZES = ["6\"", "8\"", "10\"", "Custom"];
const FLAVORS = ["Chocolate", "Vanilla", "Red Velvet", "Lemon", "Marble"];

export default function OrderPage() {
  const t = useTranslations("order");
  const searchParams = useSearchParams();
  const refTitle = searchParams.get("title");
  const refImage = searchParams.get("image");

  const [size, setSize] = useState("");
  const [flavor, setFlavor] = useState("");
  const [dateNeeded, setDateNeeded] = useState("");
  const [fulfillmentType, setFulfillmentType] = useState("delivery");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const notes = refTitle
        ? `Referencing gallery design: "${refTitle}".${specialInstructions ? " " + specialInstructions : ""}`
        : specialInstructions;
      const res = await api.customOrderRequest({
        customer: { name, phone },
        size,
        flavor,
        date_needed: dateNeeded || null,
        fulfillment_type: fulfillmentType,
        special_instructions: notes,
      });
      window.location.href = res.whatsapp_url;
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">{t("title")}</h1>
      <p className="text-black/60 mb-8">
        Fill in what you'd like below and we'll confirm the details with you
        on WhatsApp.
      </p>

      {refTitle ? (
        <div className="flex items-center gap-4 rounded-xl border p-3 mb-8">
          {refImage && (
            <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
              <Image src={refImage} alt={refTitle} fill className="object-cover" />
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm text-black/60">Referencing design</p>
            <p className="font-medium">{refTitle}</p>
          </div>
          <Link href="/gallery" className="text-sm underline shrink-0">
            Change
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border p-4 mb-8 text-sm text-black/70">
          <p className="mb-2">Have a design in mind?</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/gallery" className="underline font-medium">
              Pick one from our Gallery
            </Link>
            <Link href="/shop" className="underline font-medium">
              Pick one from the Shop
            </Link>
          </div>
          <p className="mt-2 text-black/50">
            Or skip this — you can send us a reference photo directly once we're
            chatting on WhatsApp.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className="text-sm font-medium block mb-2">{t("step1")}</label>
          <ChipGroup options={SIZES} value={size} onChange={setSize} />
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">{t("step2")}</label>
          <ChipGroup options={FLAVORS} value={flavor} onChange={setFlavor} />
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">{t("step4")}</label>
          <input
            type="date"
            value={dateNeeded}
            onChange={(e) => setDateNeeded(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">{t("step5")}</label>
          <ChipGroup
            options={["delivery", "pickup"]}
            value={fulfillmentType}
            onChange={setFulfillmentType}
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">Notes (optional)</label>
          <textarea
            placeholder="Anything else we should know?"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full h-24"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            required
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
          />
          <input
            required
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting || !size || !flavor || !name || !phone}
          className="rounded-full bg-black text-white px-6 py-3 font-medium hover:bg-black/80 disabled:opacity-40"
        >
          {t("getQuote")}
        </button>
      </form>
    </div>
  );
}

function ChipGroup({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`px-4 py-2 rounded-full border text-sm font-medium capitalize ${
            value === opt ? "bg-black text-white" : "hover:bg-black/5"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
