"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const NAV_ITEMS = [
  { label: "Produto", href: "/#produto-real" },
  { label: "Como funciona", href: "/#historia-sanle" },
  { label: "Recursos", href: "/#recursos" }
] as const;

/**
 * SALES HUNTER — LandingNavigation (Seção 12)
 * Navegação minimalista com:
 * - Logotipo Sales Hunter
 * - Produto
 * - Como funciona
 * - Recursos
 * - Acessar conta
 * - CTA principal ("Começar a prospectar")
 * Transparente no início e ganha contraste conforme a rolagem avança.
 */
export function LandingNavigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 48);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[#F5F6F8]/10 bg-[#08090C]/88 py-3 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent py-4"
      }`}
    >
      <div className="shell flex items-center justify-between gap-4">
        {/* Logotipo Sales Hunter */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight text-[#F5F6F8]"
        >
          <span className="relative flex h-2.5 w-2.5 items-center justify-center">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#B7F36B] opacity-60 transition-transform duration-300 group-hover:scale-150" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#B7F36B]" />
          </span>
          <span>Sales Hunter</span>
          <span className="hidden rounded border border-[#F5F6F8]/12 bg-[#111318] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[#969DA8] sm:inline-block">
            BY SANLE
          </span>
        </Link>

        {/* Links centrais minimalistas */}
        <nav aria-label="Navegação principal" className="hidden items-center gap-7 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[#969DA8] transition-colors hover:text-[#F5F6F8]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Ações direitas: Acessar conta + CTA principal */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/admin/login"
            onClick={() => trackEvent("cta_clicado", { cta: "nav_acessar_conta" })}
            className="px-3.5 py-2 text-sm font-medium text-[#969DA8] transition-colors hover:text-[#F5F6F8]"
          >
            Acessar conta
          </Link>

          <Link
            href="/admin/login"
            onClick={() => trackEvent("cta_clicado", { cta: "nav_comecar_prospectar" })}
            className="btn btn-primary !py-2.5 !px-4 text-xs"
          >
            <span>Começar a prospectar</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Botão Mobile */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          className="rounded-lg border border-[#F5F6F8]/12 bg-[#111318] p-2 text-[#F5F6F8] md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Menu Mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 top-[57px] z-50 flex flex-col justify-between bg-[#08090C]/98 p-6 backdrop-blur-xl md:hidden">
          <nav className="space-y-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block border-b border-[#F5F6F8]/10 pb-3 font-display text-2xl text-[#F5F6F8]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              onClick={() => setMobileOpen(false)}
              className="block border-b border-[#F5F6F8]/10 pb-3 font-display text-2xl text-[#78A9FF]"
            >
              Acessar conta
            </Link>
          </nav>

          <div className="space-y-3 border-t border-[#F5F6F8]/10 pt-5">
            <Link
              href="/admin/login"
              onClick={() => setMobileOpen(false)}
              className="btn btn-primary w-full justify-center py-3.5 text-sm"
            >
              <span>Começar a prospectar</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
