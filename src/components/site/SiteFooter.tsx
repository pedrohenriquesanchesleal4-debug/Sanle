"use client";

import Link from "next/link";
import { MessageCircle, Mail, Linkedin, ArrowUpRight } from "lucide-react";
import { brand } from "@/content/brand";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageSelector } from "@/components/i18n/LanguageSelector";

/**
 * Rodapé institucional e comercial da Sanle com suporte a i18n e Tema Claro/Escuro.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();
  const { dict } = useI18n();

  return (
    <footer className="border-t border-[#F5F6F8]/10 bg-[#08090C] py-14 text-[#F5F6F8] overflow-hidden w-full max-w-full">
      <div className="shell">
        <div className="grid grid-cols-1 gap-10 border-b border-[#F5F6F8]/8 pb-10 md:grid-cols-12">
          {/* Coluna 1: Marca & Posicionamento */}
          <div className="md:col-span-4 space-y-4">
            <div className="inline-flex items-center gap-2.5 font-display text-lg font-semibold text-[#F5F6F8]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#2440FF]" />
              <span>Sanle</span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-[#969DA8]">
              {brand.positioning}
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#969DA8]/70">
              Brasília · DF · Software, Sistemas, IA & Automação
            </p>

            <div className="flex items-center gap-3 pt-2">
              <LanguageSelector />
              <ThemeToggle />
            </div>
          </div>

          {/* Coluna 2: As 4 Frentes */}
          <div className="md:col-span-3">
            <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[#78A9FF]">
              {dict.header.solutions}
            </span>
            <ul className="mt-3 space-y-2 text-sm text-[#969DA8]">
              <li>
                <Link href="/#capacidades" className="transition-colors hover:text-[#F5F6F8]">
                  {dict.header.capabilities}
                </Link>
              </li>
              <li>
                <Link href="/#historia-sanle" className="transition-colors hover:text-[#F5F6F8]">
                  {dict.header.engineering}
                </Link>
              </li>
              <li>
                <Link href="/#prova" className="transition-colors hover:text-[#F5F6F8]">
                  {dict.header.projects}
                </Link>
              </li>
              <li>
                <Link href="/#contratacao" className="transition-colors hover:text-[#F5F6F8]">
                  {dict.header.contracting}
                </Link>
              </li>
              <li>
                <Link href="/solucoes" className="transition-colors hover:text-[#F5F6F8]">
                  Catálogo de Soluções
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Governança & Legal */}
          <div className="md:col-span-2">
            <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[#78A9FF]">
              Governança & Legal
            </span>
            <ul className="mt-3 space-y-2 text-sm text-[#969DA8]">
              <li>
                <Link href="/privacidade" className="transition-colors hover:text-[#F5F6F8]">
                  {dict.footer.privacy}
                </Link>
              </li>
              <li>
                <Link href="/termos" className="transition-colors hover:text-[#F5F6F8]">
                  {dict.footer.terms}
                </Link>
              </li>
              <li>
                <Link href="/#seguranca-governanca" className="transition-colors hover:text-[#F5F6F8]">
                  Segurança & LGPD
                </Link>
              </li>
              <li>
                <Link href="/diagnostico" className="transition-colors hover:text-[#F5F6F8]">
                  Diagnóstico Guiado
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Contato Direto & Liderança Técnica */}
          <div className="md:col-span-3">
            <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[#10B981]">
              Canais Diretos
            </span>
            <ul className="mt-3 space-y-2.5 text-sm text-[#969DA8]">
              <li>
                <a
                  href={`https://wa.me/${brand.contact.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-[#F5F6F8] transition-colors"
                >
                  <MessageCircle size={15} className="text-[#10B981] shrink-0" />
                  <span>{brand.contact.whatsappDisplay || "(61) 98139-9051"}</span>
                  <ArrowUpRight size={12} className="opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${brand.contact.email}`}
                  className="inline-flex items-center gap-2 hover:text-[#F5F6F8] transition-colors truncate max-w-[240px]"
                >
                  <Mail size={15} className="text-[#78A9FF] shrink-0" />
                  <span className="truncate">{brand.contact.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={brand.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-[#F5F6F8] transition-colors"
                >
                  <Linkedin size={15} className="text-[#0A66C2] shrink-0" />
                  <span>Pedro Henrique S. Leal</span>
                  <ArrowUpRight size={12} className="opacity-60" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-4 font-mono text-[11px] text-[#969DA8]/70 sm:flex-row">
          <span>© {year} Sanle. {dict.footer.rights}</span>
          <span>BOAS IDEIAS MERECEM SAIR DO PAPEL · BRASÍLIA · DF</span>
        </div>
      </div>
    </footer>
  );
}
