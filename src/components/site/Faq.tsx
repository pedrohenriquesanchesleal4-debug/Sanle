"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs as initialFaqs } from "@/content/brand";

interface FaqItem {
  q: string;
  a: string;
}

const ALL_FAQS: FaqItem[] = [...initialFaqs];

export function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx((current) => (current === idx ? null : idx));
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ALL_FAQS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a
      }
    }))
  };

  return (
    <section
      id="faq"
      className="relative scroll-mt-20 border-t border-[#F5F6F8]/8 bg-[#08090C] py-24 text-[#F5F6F8] md:py-32"
      aria-labelledby="faq-title"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c")
        }}
      />

      <div className="shell max-w-4xl">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#78A9FF]">
          <span>PERGUNTAS FREQUENTES</span>
        </div>

        <h2
          id="faq-title"
          className="mt-4 font-display text-clamp-title font-semibold leading-[1.03] tracking-tightest text-[#F5F6F8]"
        >
          Clareza sobre operação, dados e infraestrutura.
        </h2>

        <p className="mt-3 max-w-xl text-base text-[#969DA8]">
          Transparência sobre a arquitetura Free-First, uso de dados públicos e fluxo comercial do Sales Hunter.
        </p>

        <div className="mt-12 divide-y divide-[#F5F6F8]/10 border-y border-[#F5F6F8]/10">
          {ALL_FAQS.map((item, idx) => {
            const isOpen = openIdx === idx;
            const contentId = `faq-answer-${idx}`;
            const headerId = `faq-header-${idx}`;

            return (
              <div key={item.q} className="py-5">
                <h3>
                  <button
                    id={headerId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                    onClick={() => toggle(idx)}
                    className="group flex w-full items-center justify-between gap-6 text-left focus:outline-none"
                  >
                    <span className="font-display text-lg font-medium text-[#F5F6F8] transition-colors group-hover:text-[#B7F36B] md:text-xl">
                      {item.q}
                    </span>
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-transform ${
                        isOpen
                          ? "rotate-180 border-[#B7F36B]/50 bg-[#B7F36B]/15 text-[#B7F36B]"
                          : "border-[#F5F6F8]/15 text-[#969DA8]"
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>
                </h3>

                {isOpen && (
                  <div
                    id={contentId}
                    role="region"
                    aria-labelledby={headerId}
                    className="mt-3 pr-10 text-sm leading-relaxed text-[#969DA8] md:text-base"
                  >
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
