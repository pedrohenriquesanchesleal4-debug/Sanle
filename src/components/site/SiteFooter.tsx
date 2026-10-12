import Link from "next/link";
import { Logo } from "./Logo";
import { brand } from "@/content/brand";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const hasEmail = Boolean(brand.contact.email);
  const hasWhats = Boolean(brand.contact.whatsapp);
  const hasLinkedin = Boolean(brand.social.linkedin);

  return (
    <footer className="mt-24 border-t border-[var(--rule)] bg-ink text-paper">
      <div className="shell grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo tone="paper" className="text-xl" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-paper/70">
            {brand.positioning}
          </p>
          <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-paper/50">
            {brand.serviceRegion}
          </p>
        </div>

        <nav aria-label="Navegação do rodapé">
          <h2 className="eyebrow !text-paper/50">Navegação</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {[
              { l: "Soluções", h: "/solucoes" },
              { l: "Como funciona", h: "/#como-funciona" },
              { l: "Aplicações", h: "/#aplicacoes" },
              { l: "Sobre", h: "/sobre" },
              { l: "Diagnóstico", h: "/diagnostico" }
            ].map((i) => (
              <li key={i.h}>
                <Link href={i.h} className="link-underline text-paper/80 hover:text-paper">
                  {i.l}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow !text-paper/50">Contato</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {hasEmail && (
              <li>
                <a href={`mailto:${brand.contact.email}`} className="link-underline text-paper/80 hover:text-paper">
                  {brand.contact.email}
                </a>
              </li>
            )}
            {hasWhats && (
              <li>
                <a
                  href={`https://wa.me/${brand.contact.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-paper/80 hover:text-paper"
                >
                  WhatsApp comercial
                </a>
              </li>
            )}
            {hasLinkedin && (
              <li>
                <a
                  href={brand.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-paper/80 hover:text-paper"
                >
                  LinkedIn
                </a>
              </li>
            )}
            {!hasEmail && !hasWhats && (
              <li>
                <Link href="/diagnostico" className="link-underline text-paper/80 hover:text-paper">
                  Enviar um diagnóstico
                </Link>
              </li>
            )}
            <li className="text-paper/60">{brand.contact.city}</li>
          </ul>
        </div>
      </div>

      <div className="shell flex flex-col justify-between gap-4 border-t border-white/10 py-7 text-[0.72rem] text-paper/50 sm:flex-row sm:items-center">
        <p>
          © {year} {brand.name}. Todos os direitos reservados.
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/privacidade" className="link-underline hover:text-paper/80">Política de Privacidade</Link>
          <Link href="/termos" className="link-underline hover:text-paper/80">Termos de Uso</Link>
          <Link href="/privacidade#cookies" className="link-underline hover:text-paper/80">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}
