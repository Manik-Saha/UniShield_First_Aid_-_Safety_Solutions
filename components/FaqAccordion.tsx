"use client";

import { useState } from "react";
import type { FAQ } from "@/lib/types";

interface FaqAccordionProps {
  faqs: FAQ[];
}

export function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [open, setOpen] = useState<number | null>(null);

  if (faqs.length === 0) return null;

  return (
    <div className="divide-y divide-line">
      {faqs.map((faq, i) => (
        <div key={i}>
          <button
            type="button"
            aria-expanded={open === i}
            aria-controls={`faq-${i}`}
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex justify-between items-center py-4 text-left font-sans font-semibold text-ink hover:text-safety-red transition-colors"
          >
            <span>{faq.question}</span>
            <span aria-hidden="true" className="ml-4 text-xl leading-none flex-shrink-0">
              {open === i ? "−" : "+"}
            </span>
          </button>
          <div
            id={`faq-${i}`}
            role="region"
            aria-labelledby={`faq-btn-${i}`}
            hidden={open !== i}
            className="pb-4 text-ink/70 leading-relaxed"
          >
            {faq.answer}
          </div>
        </div>
      ))}
    </div>
  );
}
