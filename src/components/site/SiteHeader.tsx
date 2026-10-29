"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight, MessageCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageSelector } from "@/components/i18n/LanguageSelector";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { dict } = useI18n();

  const navLinks = [
    { label: dict.header.capabilities, href: "/#capacidades" },
    { label: dict.header.engineering, href: "/#metodo" },
    { label: dict.header.projects, href: "/#prova" },
    { label: dict.header.contracting, href: "/#contratacao" },
    { label: dict.header.contact, href: "/#contato" }
  ];

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleCtaClick = () => {
    trackEvent("cta_clicado", { cta: "header_island_cta" });
    setMobileOpen(false);
  };

  return (
    <header
      className="fixed inset-x-0 top-3 sm:top-4 z-50 px-3 sm:px-6 pointer-events-none"
      aria-label="Navegação principal Sanle"
    >
      <div
        className={`pointer-events-auto mx-auto flex max-w-6xl items-center justify-between gap-2 sm:gap-4 rounded-full border transition-all duration-300 ${
          scrolled
            ? "border-white/15 bg-[#0B0D13]/92 px-3.5 sm:px-5 py-2 shadow-[0_18px_50px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
            : "border-white/12 bg-[#0B0D13]/82 px-4 sm:px-5 py-2.5 shadow-[0_12px_36px_rgba(0,0,0,0.38)] backdrop-blur-xl"
        }`}
      >
        {/* Identidade Sanle: Emblema de 3 nós + Wordmark */}
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="group inline-flex items-center gap-2.5 pl-1 pr-2 py-0.5 shrink-0"
        >
          <span
            className="relative flex h-6 w-6 items-center justify-center rounded-full border border-[#C8A24A]/70 bg-[#2440FF]/15 transition-transform duration-300 group-hover:scale-105"
            aria-hidden="true"
          >
            <span className="h-2 w-2 rounded-full bg-[#2440FF] shadow-[0_0_8px_#2440FF]" />
            <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-[#C8A24A]" />
          </span>
          <span className="font-serif-editorial text-xl sm:text-2xl tracking-[-0.03em] text-[#F5F6F8] group-hover:text-[#78A9FF] transition-colors">
            sanle
          </span>
        </Link>

        {/* Links Desktop e Tablet dentro da Ilha */}
        <nav
          className="hidden md:flex items-center gap-1 rounded-full bg-white/[0.03] border border-white/[0.06] px-2 py-1"
          aria-label="Seções do site"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1 text-xs font-medium text-[#969DA8] hover:text-[#F5F6F8] hover:bg-white/[0.06] transition-all"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Controles Desktop & CTA */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <LanguageSelector />
          <ThemeToggle />

          <Link
            href="/#contato"
            onClick={handleCtaClick}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#2440FF] px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-[#3856ff] shadow-[0_4px_20px_rgba(36,64,255,0.35)] active:scale-95"
          >
            <span>{dict.header.buildSolution}</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Controles Mobile */}
        <div className="flex md:hidden items-center gap-1.5">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[#F5F6F8] hover:bg-white/[0.08] transition-colors"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? dict.header.menuClose : dict.header.menuOpen}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Gaveta Flutuante Mobile (Estilo Ilha Expandida) */}
      {mobileOpen && (
        <div className="pointer-events-auto md:hidden mx-auto mt-2 max-w-md rounded-3xl border border-white/15 bg-[#0B0D13]/96 p-5 text-[#F5F6F8] shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#78A9FF]">
              NAVEGAÇÃO · SANLE
            </span>
            <LanguageSelector />
          </div>

          <nav className="my-4 grid grid-cols-1 gap-1.5">
            {navLinks.map((link, idx) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-[#F5F6F8] hover:bg-white/[0.06] transition-colors"
              >
                <span>{link.label}</span>
                <span className="font-mono text-[10px] text-[#78A9FF]">0{idx + 1}</span>
              </Link>
            ))}
          </nav>

          <div className="border-t border-white/10 pt-3 flex flex-col gap-2">
            <Link
              href="/#contato"
              onClick={handleCtaClick}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#2440FF] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#3856ff] transition-colors"
            >
              <span>{dict.header.buildSolution}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/diagnostico"
              onClick={() => setMobileOpen(false)}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 font-mono text-[11px] uppercase tracking-wider text-[#969DA8] hover:text-[#F5F6F8] transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5 text-[#B7F36B]" />
              <span>{dict.header.talkToSpecialist}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
