import Link from "next/link";
import { brand } from "@/content/brand";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#F4F0E8] text-[#121110] border-t border-[rgba(18,17,16,0.08)] pt-20 pb-12 overflow-hidden">
      <div className="shell max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-16 border-b border-[rgba(18,17,16,0.08)]">
          {/* Coluna 1: Missão */}
          <div className="md:col-span-2">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#2440FF] font-semibold">
              SANLE OPERAÇÕES INTELIGENTES
            </span>
            <p className="mt-4 font-sans-editorial text-base text-[#4A453E] max-w-md leading-relaxed">
              {brand.positioning}
            </p>
            <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-[#8A837A]">
              Brasília · DF · Atendimento em todo o território nacional.
            </p>
          </div>

          {/* Coluna 2: Navegação */}
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#121110] font-bold block mb-4">
              Navegação
            </span>
            <ul className="space-y-2.5 font-sans-editorial text-sm text-[#4A453E]">
              <li>
                <Link href="/#historia-sanle" className="hover:text-[#2440FF] transition-colors">
                  Nossa História
                </Link>
              </li>
              <li>
                <Link href="/solucoes" className="hover:text-[#2440FF] transition-colors">
                  Soluções
                </Link>
              </li>
              <li>
                <Link href="/#como-funciona" className="hover:text-[#2440FF] transition-colors">
                  Como funciona
                </Link>
              </li>
              <li>
                <Link href="/#para-quem" className="hover:text-[#2440FF] transition-colors">
                  Segmentos
                </Link>
              </li>
              <li>
                <Link href="/#calculadora" className="hover:text-[#2440FF] transition-colors">
                  Calculadora de custo
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="hover:text-[#2440FF] transition-colors">
                  Sobre a Sanle
                </Link>
              </li>
              <li>
                <Link href="/diagnostico" className="hover:text-[#2440FF] transition-colors font-medium text-[#121110]">
                  Mapear processo
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Institucional e Legal */}
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#121110] font-bold block mb-4">
              Conformidade
            </span>
            <ul className="space-y-2.5 font-sans-editorial text-sm text-[#4A453E]">
              <li>
                <Link href="/privacidade" className="hover:text-[#2440FF] transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/termos" className="hover:text-[#2440FF] transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <span className="text-[#8A837A]">LGPD Compliance · TLS 1.3</span>
              </li>
              <li>
                <Link href="/admin/login" className="text-[#8A837A] hover:text-[#121110] transition-colors">
                  Painel Interno
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Wordmark Gigante estilo Solare */}
        <div className="pt-12 text-center select-none pointer-events-none">
          <div className="font-serif-editorial text-[clamp(5rem,21vw,19rem)] leading-[0.8] tracking-[-0.05em] text-[#E7E1D4] font-normal transition-colors">
            sanle
          </div>
        </div>

        {/* Linha final de direitos */}
        <div className="mt-8 pt-6 border-t border-[rgba(18,17,16,0.06)] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#8A837A]">
          <span>© {year} Sanle. Todos os direitos reservados.</span>
          <span>AUTOMAÇÃO OPERACIONAL · BRASÍLIA · DF</span>
        </div>
      </div>
    </footer>
  );
}
