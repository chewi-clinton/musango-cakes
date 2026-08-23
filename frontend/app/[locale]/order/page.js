"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";

const SIZES = ["6\"", "8\"", "10\"", "Custom"];
const FLAVORS = ["Chocolate", "Vanilla", "Red Velvet", "Lemon", "Marble"];

export default function OrderPage() {
  const t = useTranslations("order");
  const [step, setStep] = useState(1);
  const [size, setSize] = useState("");
  const [flavor, setFlavor] = useState("");
  const [dateNeeded, setDateNeeded] = useState("");
  const [fulfillmentType, setFulfillmentType] = useState("delivery");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await api.customOrderRequest({
        customer: { name, phone },
        size,
        flavor,
        date_needed: dateNeeded || null,
        fulfillment_type: fulfillmentType,
        special_instructions: specialInstructions,
      });
      setResult(res);
      window.location.href = res.whatsapp_url;
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>

      {step === 1 && (
        <Step label={t("step1")}>
          <ChipGroup options={SIZES} value={size} onChange={setSize} />
          <NextButton onClick={() => setStep(2)} disabled={!size} />
        </Step>
      )}

      {step === 2 && (
        <Step label={t("step2")}>
          <ChipGroup options={FLAVORS} value={flavor} onChange={setFlavor} />
          <NextButton onClick={() => setStep(3)} disabled={!flavor} />
        </Step>
      )}

      {step === 3 && (
        <Step label={t("step3")}>
          <p className="text-sm text-black/60 mb-3">{t("step3Hint")}</p>
          <textarea
            placeholder="Describe your design idea (or mention you'll send a photo on WhatsApp)"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full h-24"
          />
          <NextButton onClick={() => setStep(4)} />
        </Step>
      )}

      {step === 4 && (
        <Step label={t("step4")}>
          <input
            type="date"
            value={dateNeeded}
            onChange={(e) => setDateNeeded(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
          />
          <NextButton onClick={() => setStep(5)} disabled={!dateNeeded} />
        </Step>
      )}

      {step === 5 && (
        <Step label={t("step5")}>
          <ChipGroup
            options={["delivery", "pickup"]}
            value={fulfillmentType}
            onChange={setFulfillmentType}
          />

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
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
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-black text-white px-6 py-3 font-medium hover:bg-black/80 disabled:opacity-40"
            >
              {t("getQuote")}
            </button>
          </form>
        </Step>
      )}
    </div>
  );
}

function Step({ label, children }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">{label}</h2>
      {children}
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

function NextButton({ onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="mt-6 rounded-full bg-black text-white px-6 py-2.5 font-medium hover:bg-black/80 disabled:opacity-40"
    >
      Next
    </button>
  );
}
