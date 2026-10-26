import Link from "next/link";
import { MessageCircle, Mail, Linkedin, ArrowUpRight } from "lucide-react";
import { brand } from "@/content/brand";

/**
 * Rodapé institucional e comercial da Sanle (#08090C / #111318).
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#F5F6F8]/10 bg-[#08090C] py-14 text-[#F5F6F8]">
      <div className="shell">
        <div className="grid grid-cols-1 gap-10 border-b border-[#F5F6F8]/8 pb-10 md:grid-cols-12">
          {/* Coluna 1: Marca & Posicionamento */}
          <div className="md:col-span-4">
            <div className="inline-flex items-center gap-2.5 font-display text-lg font-semibold text-[#F5F6F8]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#2440FF]" />
              <span>Sanle</span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#969DA8]">
              {brand.positioning}
            </p>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[#969DA8]/70">
              Brasília · DF · Engenharia Operacional
            </p>
          </div>

          {/* Coluna 2: Soluções */}
          <div className="md:col-span-3">
            <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[#78A9FF]">
              Soluções
            </span>
            <ul className="mt-3 space-y-2 text-sm text-[#969DA8]">
              <li>
                <Link href="/#historia-sanle" className="transition-colors hover:text-[#F5F6F8]">
                  A Construção do Fluxo
                </Link>
              </li>
              <li>
                <Link href="/solucoes" className="transition-colors hover:text-[#F5F6F8]">
                  Arquitetura de Processos
                </Link>
              </li>
              <li>
                <Link href="/#como-funciona" className="transition-colors hover:text-[#F5F6F8]">
                  Demonstração em 6 etapas
                </Link>
              </li>
              <li>
                <Link href="/#para-quem" className="transition-colors hover:text-[#F5F6F8]">
                  Segmentos atendidos
                </Link>
              </li>
              <li>
                <Link href="/diagnostico" className="transition-colors hover:text-[#2440FF] font-medium">
                  Solicitar diagnóstico
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
                  Privacidade
                </Link>
              </li>
              <li>
                <Link href="/termos" className="transition-colors hover:text-[#F5F6F8]">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/#seguranca" className="transition-colors hover:text-[#F5F6F8]">
                  Segurança & LGPD
                </Link>
              </li>
              <li>
                <Link href="/diagnostico" className="transition-colors hover:text-[#F5F6F8]">
                  Mapear Processo
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
          <span>© {year} Sanle. Todos os direitos reservados.</span>
          <span>ENGENHARIA DE PROCESSOS & CONEXÃO DE SISTEMAS · BRASÍLIA · DF</span>
        </div>
      </div>
    </footer>
  );
}
