import type { Metadata } from "next";
import { brand } from "@/content/brand";

export const metadata: Metadata = {
  title: "Política de Privacidade — Sanle",
  description: "Como a Sanle trata dados pessoais em conformidade com a LGPD.",
  alternates: { canonical: "/privacidade" }
};

const updated = "julho de 2026";

export default function PrivacidadePage() {
  return (
    <article className="shell max-w-3xl py-20 md:py-28">
      <p className="eyebrow">Política de Privacidade</p>
      <h1 className="mt-5 font-display text-[clamp(2rem,4.5vw,3rem)] leading-tight text-ink">
        Como tratamos seus dados.
      </h1>
      <p className="mt-4 text-sm text-ink-soft/70">Última atualização: {updated}.</p>

      <div className="mt-8 rounded-xl border border-[var(--rule)] bg-white p-5 text-sm text-ink-soft">
        Este documento é uma <strong className="text-ink">minuta técnica</strong>. Ele descreve com precisão
        como o sistema trata os dados, mas deve ser revisado pelo responsável jurídico da {brand.name} antes
        de ser considerado o texto definitivo. A razão social e o encarregado (DPO) completos aguardam
        confirmação.
      </div>

      <div className="prose-sm mt-12 space-y-8 leading-relaxed text-ink-soft">
        <section>
          <h2 className="font-display text-xl text-ink">1. Quem é o controlador</h2>
          <p className="mt-3">
            O controlador dos dados é a {brand.name}, com atuação inicial em {brand.serviceRegion}. Contato
            para assuntos de privacidade: {brand.contact.email || "e-mail a ser confirmado"}.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">2. Quais dados coletamos</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong className="text-ink">Formulário de diagnóstico:</strong> nome, empresa, e-mail,
              telefone (opcional), segmento e a descrição do processo. Finalidade: responder ao seu pedido.
            </li>
            <li>
              <strong className="text-ink">Assistente do site:</strong> a conversa só é salva se você marcar o
              consentimento. Sem consentimento, a conversa não é persistida.
            </li>
            <li>
              <strong className="text-ink">Prospecção B2B:</strong> dados públicos de empresas (nome,
              endereço, site, telefone) obtidos por APIs oficiais ou listas fornecidas pelo próprio operador.
              Não coletamos dados sensíveis nem fazemos scraping de redes sociais.
            </li>
          </ul>
        </section>

        <section id="cookies">
          <h2 className="font-display text-xl text-ink">3. Cookies e armazenamento local</h2>
          <p className="mt-3">
            Usamos apenas cookies estritamente necessários à sessão do painel administrativo e ao
            funcionamento do site. Não utilizamos rastreadores de publicidade de terceiros nesta versão.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">4. Bases legais</h2>
          <p className="mt-3">
            Tratamos dados com base em: consentimento (formulários e conversas), execução de contrato
            (clientes), e legítimo interesse (prospecção B2B, sempre equilibrado com seus direitos).
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">5. Compartilhamento</h2>
          <p className="mt-3">
            Podemos usar provedores de infraestrutura (hospedagem e banco de dados) e, quando configurado,
            um provedor de IA para gerar respostas. Nesses casos, apenas o conteúdo estritamente necessário é
            enviado. Não vendemos dados pessoais.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">6. Retenção e exclusão</h2>
          <p className="mt-3">
            Mantemos os dados apenas pelo tempo necessário à finalidade. Você pode solicitar acesso, correção
            ou exclusão dos seus dados pelo contato acima.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink">7. Seus direitos</h2>
          <p className="mt-3">
            Nos termos da LGPD, você pode confirmar a existência de tratamento, acessar, corrigir, anonimizar,
            bloquear ou eliminar dados, além de revogar consentimento e se opor a tratamentos.
          </p>
        </section>
      </div>
    </article>
  );
}
