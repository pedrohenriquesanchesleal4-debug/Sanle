"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight, MessageCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageSelector } from "@/components/i18n/LanguageSelector";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [inPortal, setInPortal] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { dict } = useI18n();

  const navLinks = [
    { label: dict.header.capabilities, href: "/#capacidades" },
    { label: dict.header.engineering, href: "/#historia-sanle" },
    { label: dict.header.projects, href: "/#prova" },
    { label: dict.header.contracting, href: "/#contratacao" },
    { label: dict.header.solutions, href: "/solucoes" },
    { label: dict.header.contact, href: "/#contato" }
  ];

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
          ? "bg-[#08090C]/85 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl text-[#F5F6F8]"
          : "bg-transparent border-b border-transparent py-4 text-[#F5F6F8]"
      }`}
    >
      <div className="shell flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Logo sanle em minúsculas com nó cobalto */}
        <Link
          href="/"
          className="font-serif-editorial text-2xl md:text-3xl tracking-[-0.03em] text-[#F5F6F8] hover:text-[#78A9FF] transition-colors shrink-0"
        >
          sanle
        </Link>

        {/* Links Desktop */}
        <nav className="hidden xl:flex items-center gap-6 font-sans-editorial text-sm text-[#969DA8]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-[#F5F6F8] transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Controles Desktop & CTA */}
        <div className="hidden md:flex items-center gap-2.5">
          <LanguageSelector />
          <ThemeToggle />

          <Link
            href="/#contato"
            className="text-xs font-mono uppercase tracking-wider text-[#969DA8] hover:text-white transition-colors px-2.5 py-1.5 flex items-center gap-1.5"
          >
            <MessageCircle className="h-3.5 w-3.5 text-[#B7F36B]" />
            <span className="hidden lg:inline">{dict.header.talkToSpecialist}</span>
          </Link>

          <Link
            href="/diagnostico"
            onClick={handleCtaClick}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2440FF] text-white font-medium text-xs uppercase tracking-wider hover:bg-[#3856ff] transition-all shadow-md shadow-[#2440FF]/25 active:scale-95 shrink-0"
          >
            <span>{dict.header.buildSolution}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Controles Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-[#F5F6F8] hover:bg-white/[0.05] transition-colors"
            aria-label={mobileOpen ? dict.header.menuClose : dict.header.menuOpen}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile em Tela Cheia */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[#08090C] text-[#F5F6F8] p-6 flex flex-col justify-between animate-fade-up overflow-y-auto">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="font-serif-editorial text-3xl tracking-[-0.03em] text-[#F5F6F8]">
              sanle
            </span>
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-2 text-[#969DA8] hover:text-white"
                aria-label={dict.header.menuClose}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <nav className="my-6 space-y-4">
            {navLinks.map((link, idx) => (
              <div key={link.href} className="border-b border-white/10 pb-3">
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-serif-editorial text-2xl block text-[#F5F6F8] hover:text-[#78A9FF] transition-colors"
                >
                  <span className="font-mono text-xs text-[#78A9FF] mr-3">0{idx + 1}</span>
                  {link.label}
                </Link>
              </div>
            ))}
          </nav>

          <div className="pt-4 border-t border-white/10 space-y-3">
            <Link
              href="/diagnostico"
              onClick={handleCtaClick}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#2440FF] text-white font-medium text-xs uppercase tracking-wider hover:bg-[#3856ff] transition-colors shadow-sm"
            >
              <span>{dict.header.buildSolution}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/#contato"
              onClick={() => setMobileOpen(false)}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-[#969DA8] font-mono text-xs uppercase tracking-wider hover:text-white transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5 text-[#B7F36B]" />
              <span>{dict.header.talkToSpecialist}</span>
            </Link>

            <div className="flex items-center justify-center gap-4 pt-2">
              <span className="text-xs text-[#969DA8] font-mono">{dict.common.theme}:</span>
              <ThemeToggle />
            </div>

            <p className="font-mono text-[0.68rem] text-center uppercase tracking-[0.16em] text-[#969DA8]/70 pt-2">
              AUTOMAÇÃO OPERACIONAL · BRASÍLIA · DF
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
