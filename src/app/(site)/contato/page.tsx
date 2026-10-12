import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail, MessageCircle, Linkedin } from "lucide-react";
import { brand } from "@/content/brand";

export const metadata: Metadata = {
  title: "Contato — Sanle",
  description: "Fale com a Sanle por e-mail, WhatsApp ou descreva seu processo no formulário de diagnóstico.",
  alternates: { canonical: "/contato" }
};

export default function ContatoPage() {
  const channels = [
    brand.contact.email && { icon: Mail, label: "E-mail", value: brand.contact.email, href: `mailto:${brand.contact.email}` },
    brand.contact.whatsapp && {
      icon: MessageCircle,
      label: "WhatsApp",
      value: brand.contact.whatsapp,
      href: `https://wa.me/${brand.contact.whatsapp.replace(/\D/g, "")}`
    },
    brand.social.linkedin && { icon: Linkedin, label: "LinkedIn", value: "Perfil da Sanle", href: brand.social.linkedin }
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href: string }[];

  return (
    <div className="shell max-w-3xl py-20 md:py-28">
      <p className="eyebrow">Contato</p>
      <h1 className="mt-5 font-display text-[clamp(2rem,4.5vw,3rem)] leading-tight text-ink">
        Converse com a Sanle.
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-soft">
        O caminho mais rápido para um retorno útil é descrever o processo no formulário de diagnóstico. Se
        preferir, use um dos canais abaixo.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/diagnostico" className="btn btn-primary">
          Enviar diagnóstico <ArrowRight size={16} />
        </Link>
      </div>

      {channels.length > 0 ? (
        <ul className="mt-12 grid gap-4 sm:grid-cols-2">
          {channels.map((c) => {
            const Icon = c.icon;
            return (
              <li key={c.label}>
                <a
                  href={c.href}
                  className="flex items-center gap-4 rounded-xl border border-[var(--rule)] bg-white p-5 transition hover:border-cobalt"
                >
                  <Icon size={20} className="text-cobalt" aria-hidden />
                  <span>
                    <span className="block font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-soft/70">
                      {c.label}
                    </span>
                    <span className="mt-0.5 block text-ink">{c.value}</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="mt-12 rounded-xl border border-dashed border-[var(--rule)] bg-white p-6 text-sm text-ink-soft">
          Os canais diretos (e-mail, WhatsApp e LinkedIn) ainda não foram configurados neste ambiente. Use o
          formulário de diagnóstico — ele funciona sem nenhuma credencial.
        </div>
      )}
    </div>
  );
}
