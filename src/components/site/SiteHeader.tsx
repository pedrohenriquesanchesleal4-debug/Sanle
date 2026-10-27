"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight, MessageCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const NAV_LINKS = [
  { label: "Capacidades", href: "/#capacidades" },
  { label: "Engenharia", href: "/#historia-sanle" },
  { label: "Projetos", href: "/#prova" },
  { label: "Contratação", href: "/#contratacao" },
  { label: "Soluções", href: "/solucoes" },
  { label: "Contato", href: "/#contato" }
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [inPortal, setInPortal] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // O header se torna visível após ultrapassar a entrada da logo (~500px)
      const portalThreshold = 500;
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
          ? "bg-[#08090C]/85 backdrop-blur-xl border-b border-white/10 py-3.5 shadow-2xl text-[#F5F6F8]"
          : "bg-transparent border-b border-transparent py-5 text-[#F5F6F8]"
      }`}
    >
      <div className="shell flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Logo sanle em minúsculas com nó cobalto */}
        <Link
          href="/"
          className="font-serif-editorial text-2xl md:text-3xl tracking-[-0.03em] text-[#F5F6F8] hover:text-[#78A9FF] transition-colors"
        >
          sanle
        </Link>

        {/* Links Desktop */}
        <nav className="hidden md:flex items-center gap-7 font-sans-editorial text-sm text-[#969DA8]">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-[#F5F6F8] transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/#contato"
            className="text-xs font-mono uppercase tracking-wider text-[#969DA8] hover:text-white transition-colors px-3 py-2 flex items-center gap-1.5"
          >
            <MessageCircle className="h-3.5 w-3.5 text-[#B7F36B]" />
            <span>Falar com especialista</span>
          </Link>
          <Link
            href="/diagnostico"
            onClick={handleCtaClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2440FF] text-white font-medium text-xs uppercase tracking-wider hover:bg-[#3856ff] transition-all shadow-md shadow-[#2440FF]/25 active:scale-95"
          >
            <span>Construir Solução</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Botão Hamburger Mobile */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg text-[#F5F6F8] hover:bg-white/[0.05] transition-colors"
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Menu Mobile em Tela Cheia */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[#08090C] text-[#F5F6F8] p-8 flex flex-col justify-between animate-fade-up">
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <span className="font-serif-editorial text-3xl tracking-[-0.03em] text-[#F5F6F8]">
              sanle
            </span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="p-2 text-[#969DA8] hover:text-white"
              aria-label="Fechar menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="my-auto space-y-5">
            {NAV_LINKS.map((link, idx) => (
              <div key={link.href} className="border-b border-white/10 pb-3.5">
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-serif-editorial text-3xl block text-[#F5F6F8] hover:text-[#78A9FF] transition-colors"
                >
                  <span className="font-mono text-xs text-[#78A9FF] mr-3">0{idx + 1}</span>
                  {link.label}
                </Link>
              </div>
            ))}
          </nav>

          <div className="pt-6 border-t border-white/10 space-y-3">
            <Link
              href="/diagnostico"
              onClick={handleCtaClick}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-[#2440FF] text-white font-medium text-xs uppercase tracking-wider hover:bg-[#3856ff] transition-colors shadow-sm"
            >
              <span>Mapear meu processo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/#contato"
              onClick={() => setMobileOpen(false)}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 text-[#969DA8] font-mono text-xs uppercase tracking-wider hover:text-white transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5 text-[#B7F36B]" />
              <span>Falar diretamente no WhatsApp</span>
            </Link>

            <p className="font-mono text-[0.68rem] text-center uppercase tracking-[0.16em] text-[#969DA8]/70 pt-2">
              AUTOMAÇÃO OPERACIONAL · BRASÍLIA · DF
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
