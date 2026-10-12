import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="shell flex min-h-dvh flex-col items-start justify-center py-24">
      <p className="eyebrow">Erro 404</p>
      <h1 className="mt-5 font-display text-[clamp(2.2rem,6vw,4rem)] leading-[1.02] text-ink">
        Esta página não existe.
      </h1>
      <p className="mt-5 max-w-md text-ink-soft">
        O endereço pode ter mudado ou nunca existiu. Você pode voltar ao início ou descrever seu processo
        para conversarmos.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">
          <ArrowLeft size={16} /> Voltar ao início
        </Link>
        <Link href="/diagnostico" className="btn btn-ghost">
          Enviar diagnóstico
        </Link>
      </div>
    </div>
  );
}
