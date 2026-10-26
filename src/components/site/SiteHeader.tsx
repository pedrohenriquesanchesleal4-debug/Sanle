"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight, MessageCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const NAV_LINKS = [
  { label: "Nossa História", href: "/#historia-sanle" },
  { label: "Soluções", href: "/solucoes" },
  { label: "Como funciona", href: "/#como-funciona" },
  { label: "Segmentos", href: "/#para-quem" },
  { label: "Contato", href: "/#contato" },
  { label: "Sobre", href: "/sobre" }
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [inPortal, setInPortal] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // O header se torna visível após ultrapassar a entrada da logo (~750px)
      const portalThreshold = 750;
      const isPastPortal = window.scrollY >= portalThreshold;
      setInPortal(!isPastPortal);
      setScrolled(window.scrollY > portalThreshold + 40);
    };

    const onPortalEntered = () => {
      setInPortal(false);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("sanle:portal-entered", onPortalEntered);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("sanle:portal-entered", onPortalEntered);
    };
  }, []);

  // Trava scroll com menu mobile aberto
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleCtaClick = () => {
    trackEvent("cta_clicado", { cta: "header_mapear_processo" });
    setMobileOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        inPortal
          ? "opacity-0 -translate-y-6 pointer-events-none"
          : "opacity-100 translate-y-0 pointer-events-auto"
      } ${
        scrolled
          ? "bg-[#FAF8F5]/92 backdrop-blur-md border-b border-[rgba(18,17,16,0.08)] py-3.5 shadow-sm text-[#121110]"
          : "bg-transparent border-b border-transparent py-5 text-[#121110]"
      }`}
    >
      <div className="shell flex items-center justify-between">
        {/* Logo sanle em minúsculas com nó cobalto */}
        <Link
          href="/"
          className="font-serif-editorial text-2xl md:text-3xl tracking-[-0.03em] text-[#121110] hover:text-[#2440FF] transition-colors"
        >
          sanle
        </Link>

        {/* Links Desktop */}
        <nav className="hidden md:flex items-center gap-7 font-sans-editorial text-sm text-[#4A453E]">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-[#121110] transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/#contato"
            className="text-xs font-mono uppercase tracking-wider text-[#4A453E] hover:text-[#121110] transition-colors px-3 py-2 flex items-center gap-1.5"
          >
            <MessageCircle className="h-3.5 w-3.5 text-[#10B981]" />
            <span>Falar com especialista</span>
          </Link>
          <Link
            href="/diagnostico"
            onClick={handleCtaClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#121110] text-white font-medium text-xs uppercase tracking-wider hover:bg-[#2440FF] transition-all shadow-sm active:scale-95"
          >
            <span>Mapear meu processo</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Botão Hamburger Mobile */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg text-[#121110] hover:bg-black/5 transition-colors"
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Menu Mobile em Tela Cheia */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[#FAF8F5] text-[#121110] p-8 flex flex-col justify-between animate-fade-up">
          <div className="flex items-center justify-between border-b border-[rgba(18,17,16,0.08)] pb-6">
            <span className="font-serif-editorial text-3xl tracking-[-0.03em] text-[#121110]">
              sanle
            </span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="p-2 text-[#4A453E] hover:text-[#121110]"
              aria-label="Fechar menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="my-auto space-y-5">
            {NAV_LINKS.map((link, idx) => (
              <div key={link.href} className="border-b border-[rgba(18,17,16,0.06)] pb-3.5">
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-serif-editorial text-3xl block text-[#121110] hover:text-[#2440FF] transition-colors"
                >
                  <span className="font-mono text-xs text-[#2440FF] mr-3">0{idx + 1}</span>
                  {link.label}
                </Link>
              </div>
            ))}
          </nav>

          <div className="pt-6 border-t border-[rgba(18,17,16,0.08)] space-y-3">
            <Link
              href="/diagnostico"
              onClick={handleCtaClick}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-[#121110] text-white font-medium text-xs uppercase tracking-wider hover:bg-[#2440FF] transition-colors shadow-sm"
            >
              <span>Mapear meu processo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/#contato"
              onClick={() => setMobileOpen(false)}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 text-[#4A453E] font-mono text-xs uppercase tracking-wider hover:text-[#121110] transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5 text-[#10B981]" />
              <span>Falar diretamente no WhatsApp</span>
            </Link>

            <p className="font-mono text-[0.68rem] text-center uppercase tracking-[0.16em] text-[#8A837A] pt-2">
              AUTOMAÇÃO OPERACIONAL · BRASÍLIA · DF
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
