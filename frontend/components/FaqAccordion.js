"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function FaqAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="flex flex-col divide-y border-t border-b">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-medium">{item.q}</span>
              {isOpen ? (
                <Minus className="h-5 w-5 shrink-0 text-black/60" />
              ) : (
                <Plus className="h-5 w-5 shrink-0 text-black/60" />
              )}
            </button>
            {isOpen && <p className="text-sm text-black/60 pb-4 pr-8">{item.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
