"use client";

import { useState, useEffect } from "react";
import { MessageCircle, ArrowRight } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

export function FloatingConversionBar() {
  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolledPastHero(window.scrollY > 550);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleWhatsApp = () => {
    trackEvent("whatsapp_aberto", { local: "floating_button" });
    const url = buildWhatsAppLink();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* Botão Flutuante de WhatsApp no Canto Inferior Direito */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={handleWhatsApp}
          className="group relative flex items-center gap-3 rounded-full border border-[rgba(242,238,230,0.18)] bg-[#141412]/95 px-4 py-3 shadow-2xl backdrop-blur-md transition-all hover:border-[#10B981] hover:scale-105 active:scale-95 text-[#F2EEE6]"
          aria-label="Chamar no WhatsApp"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#10B981]" />
          </span>

          <span className="hidden sm:inline font-mono text-xs uppercase tracking-wider text-[#F2EEE6]">
            WhatsApp
          </span>

          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#10B981] text-[#0A0A09] shadow-sm">
            <MessageCircle className="h-4 w-4 fill-current" />
          </div>
        </button>
      </div>

      {/* Barra de CTA Fixa no Mobile após passar do hero */}
      {scrolledPastHero && (
        <div className="md:hidden fixed bottom-0 inset-x-0 z-30 p-3 bg-[#0A0A09]/95 backdrop-blur-lg border-t border-[rgba(242,238,230,0.12)]">
          <div className="flex items-center gap-2">
            <a
              href="#diagnostico-inbound"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-[2px] bg-[#FF5B1F] text-white font-medium text-xs uppercase tracking-wider"
            >
              <span>Mapear meu processo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>

            <button
              type="button"
              onClick={handleWhatsApp}
              className="px-3.5 py-3 rounded-[2px] bg-[#161614] border border-[rgba(242,238,230,0.14)] text-[#10B981]"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
