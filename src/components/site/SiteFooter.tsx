import Link from "next/link";
import { brand } from "@/content/brand";

/**
 * Rodapé compacto, elegante e funcional na paleta Sales Hunter (#08090C / #111318).
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#F5F6F8]/10 bg-[#08090C] py-14 text-[#F5F6F8]">
      <div className="shell">
        <div className="grid grid-cols-1 gap-10 border-b border-[#F5F6F8]/8 pb-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="inline-flex items-center gap-2.5 font-display text-lg font-semibold text-[#F5F6F8]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#B7F36B]" />
              <span>Sales Hunter</span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#969DA8]">
              {brand.positioning}
            </p>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[#969DA8]/70">
              Brasília · DF · Arquitetura Free-First
            </p>
          </div>

          <div className="md:col-span-4">
            <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[#78A9FF]">
              Plataforma
            </span>
            <ul className="mt-3 space-y-2 text-sm text-[#969DA8]">
              <li>
                <Link href="/#historia-sanle" className="transition-colors hover:text-[#F5F6F8]">
                  Narrativa & Como funciona
                </Link>
              </li>
              <li>
                <Link href="/#recursos" className="transition-colors hover:text-[#F5F6F8]">
                  Recursos de inteligência comercial
                </Link>
              </li>
              <li>
                <Link href="/#produto-real" className="transition-colors hover:text-[#F5F6F8]">
                  Simulador interativo
                </Link>
              </li>
              <li>
                <Link href="/solucoes" className="transition-colors hover:text-[#F5F6F8]">
                  Soluções & Arquitetura
                </Link>
              </li>
              <li>
                <Link href="/diagnostico" className="transition-colors hover:text-[#B7F36B]">
                  Solicitar diagnóstico
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[#78A9FF]">
              Acesso & Conformidade
            </span>
            <ul className="mt-3 space-y-2 text-sm text-[#969DA8]">
              <li>
                <Link href="/admin/login" className="font-medium text-[#B7F36B] transition-colors hover:underline">
                  Acessar conta (CRM)
                </Link>
              </li>
              <li>
                <Link href="/admin/prospects" className="transition-colors hover:text-[#F5F6F8]">
                  Buscador de empresas
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="transition-colors hover:text-[#F5F6F8]">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/termos" className="transition-colors hover:text-[#F5F6F8]">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-4 font-mono text-[11px] text-[#969DA8]/70 sm:flex-row">
          <span>© {year} Sales Hunter · Sanle. Todos os direitos reservados.</span>
          <span>THE OPPORTUNITY ENGINE · PROSPECÇÃO B2B</span>
        </div>
      </div>
    </footer>
  );
}
