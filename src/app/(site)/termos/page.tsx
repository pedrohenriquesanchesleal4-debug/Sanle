import type { Metadata } from "next";
import { brand } from "@/content/brand";

export const metadata: Metadata = {
  title: "Termos de Uso — Sanle",
  description: "Condições de uso do site e dos serviços da Sanle.",
  alternates: { canonical: "/termos" }
};

export default function TermosPage() {
  return (
    <article className="shell max-w-3xl py-20 md:py-28">
      <p className="eyebrow">Termos de Uso</p>
      <h1 className="mt-5 font-display text-[clamp(2rem,4.5vw,3rem)] leading-tight text-ink">
        Condições de uso.
      </h1>
      <p className="mt-4 text-sm text-ink-soft/70">Última atualização: julho de 2026.</p>

      <div className="mt-8 rounded-xl border border-[var(--rule)] bg-white p-5 text-sm text-ink-soft">
        Minuta técnica sujeita a revisão jurídica antes da versão definitiva.
      </div>

      <div className="mt-12 space-y-8 leading-relaxed text-ink-soft">
        <section>
          <h2 className="font-display text-xl text-ink">1. Aceitação</h2>
          <p className="mt-3">
            Ao utilizar este site, você concorda com estes termos e com a Política de Privacidade da{" "}
            {brand.name}.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">2. Natureza do conteúdo</h2>
          <p className="mt-3">
            As informações deste site descrevem serviços de automação e IA aplicada de forma geral. Não
            constituem proposta comercial vinculante. Escopos, prazos e valores são definidos em proposta
            específica, após diagnóstico.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">3. Assistente de IA</h2>
          <p className="mt-3">
            O assistente virtual fornece respostas informativas baseadas em uma base de conhecimento. Ele não
            assume compromissos, não define preços e não substitui o contato com a equipe. Quando não há
            informação suficiente, ele deve informar a limitação em vez de inventar.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">4. Propriedade intelectual</h2>
          <p className="mt-3">
            Marca, textos, layout e código deste site pertencem à {brand.name}, salvo indicação em contrário.
            Referências a ferramentas de terceiros pertencem aos seus respectivos titulares.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">5. Limitação de responsabilidade</h2>
          <p className="mt-3">
            O site é fornecido &ldquo;como está&rdquo;. Não nos responsabilizamos por decisões tomadas
            exclusivamente com base no conteúdo informativo aqui apresentado, sem a devida conversa com a
            equipe.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">6. Legislação aplicável</h2>
          <p className="mt-3">
            Estes termos são regidos pela legislação brasileira, com foro na comarca de{" "}
            {brand.founded.city}/{brand.founded.uf}, salvo disposição legal em contrário.
          </p>
        </section>
      </div>
    </article>
  );
}
