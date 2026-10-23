"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs as initialFaqs } from "@/content/brand";

interface FaqItem {
  q: string;
  a: string;
}

const ALL_FAQS: FaqItem[] = [
  ...initialFaqs,
  {
    q: "Como é feito o primeiro contato?",
    a: "Pelo formulário de diagnóstico nesta página ou direto pelo WhatsApp. Conversamos de forma objetiva sobre um processo específico da sua empresa e, se houver alinhamento, agendamos um mapeamento detalhado sem compromisso de contratação."
  },
  {
    q: "Posso começar com um processo só?",
    a: "Sim, e é exatamente assim que recomendamos. Começamos por uma dor delimitada com impacto mensurável (ex: conferência de extratos ou renomeação de notas), validamos o resultado e só depois expandimos para outros gargalos."
  }
];

export function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

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
      className="relative scroll-mt-20 py-24 md:py-32 bg-[#FAF8F5] text-[#121110] border-b border-[rgba(18,17,16,0.08)]"
      aria-labelledby="faq-title"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c")
        }}
      />

      <div className="shell max-w-4xl">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[#2440FF] font-semibold">
          <span>PERGUNTAS FREQUENTES</span>
        </div>

        <h2
          id="faq-title"
          className="mt-4 font-serif-editorial text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[0.98] text-[#121110]"
        >
          Dúvidas antes de conversar.
        </h2>

        <p className="mt-4 max-w-xl text-lg text-[#4A453E] font-sans-editorial">
          Transparência sobre método, escopo, segurança de dados e modelo de contratação.
        </p>

        {/* Acordeão Acessível */}
        <div className="mt-14 divide-y divide-[rgba(18,17,16,0.08)] border-y border-[rgba(18,17,16,0.08)]">
          {ALL_FAQS.map((item, idx) => {
            const isOpen = openIdx === idx;
            const contentId = `faq-answer-${idx}`;
            const headerId = `faq-header-${idx}`;

            return (
              <div key={idx} className="py-5">
                <h3>
                  <button
                    id={headerId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                    onClick={() => toggle(idx)}
                    className="w-full flex items-center justify-between text-left gap-6 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2440FF]"
                  >
                    <span className="font-serif-editorial text-xl md:text-2xl text-[#121110] group-hover:text-[#2440FF] transition-colors">
                      {item.q}
                    </span>
                    <span
                      className={`h-7 w-7 rounded-full border border-[rgba(18,17,16,0.12)] flex items-center justify-center shrink-0 transition-transform ${
                        isOpen ? "rotate-180 border-[#2440FF] text-[#2440FF] bg-[#2440FF]/5" : "text-[#8A837A]"
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
                    className="mt-4 text-[#4A453E] text-base leading-relaxed font-sans-editorial pr-12 animate-fade-up"
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
