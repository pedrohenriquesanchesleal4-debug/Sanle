"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Calculator,
  FileText,
  Package,
  MessageCircle
} from "lucide-react";
import type { NicheThemeConfig } from "@/lib/themes/prospect-theme";
import { buildWhatsAppLink } from "@/lib/whatsapp";

interface ProspectInteractivePrototypeProps {
  theme: NicheThemeConfig;
  empresa: string;
  cidade: string;
}

export function ProspectInteractivePrototype({
  theme,
  empresa,
  cidade
}: ProspectInteractivePrototypeProps) {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // 1. Estado para Agendamento Clínico
  const [clinicSpecialty, setClinicSpecialty] = useState("Avaliação Inicial & Diagnóstico Completo");
  const [clinicDate, setClinicDate] = useState("Amanhã");
  const [clinicTime, setClinicTime] = useState("14:30");

  // 2. Estado para Vidraçaria / m²
  const [glassType, setGlassType] = useState("Box para Banheiro Frontal (Vidro Temperado 8mm)");
  const [glassWidth, setGlassWidth] = useState("1.40");
  const [glassHeight, setGlassHeight] = useState("1.90");

  const wNum = parseFloat(glassWidth.replace(",", ".")) || 1.4;
  const hNum = parseFloat(glassHeight.replace(",", ".")) || 1.9;
  const m2 = Math.max(0.1, Number((wNum * hNum).toFixed(2)));
  const estimatedVal = Math.round(m2 * 420 + 250);

  // 3. Estado para BPO / Contabilidade
  const [bpoDocType, setBpoDocType] = useState("Extratos Bancários (OFX / PDF)");
  const [bpoBank, setBpoBank] = useState("Banco Itaú / Bradesco");

  // 4. Estado para Advocacia / Triagem
  const [legalArea, setLegalArea] = useState("Direito Empresarial & Contratos");
  const [legalUrgency, setLegalUrgency] = useState("Normal (até 48h)");

  // 5. Estado para Oficina Mecânica / OS
  const [autoPlate, setAutoPlate] = useState("BRA-2E19");

  // 6. Estado para Distribuidora B2B
  const [b2bItem, setB2bItem] = useState("Lote de Peças / Itens Corporativos");
  const [b2bQty, setB2bQty] = useState("50");

  const handleSimulateWhatsApp = (customText: string) => {
    setSuccessMsg("Demonstração validada! Abrindo WhatsApp de demonstração...");
    const url = buildWhatsAppLink({
      empresa,
      segmento: theme.categoryName,
      customText: `Olá Pedro! Vi a demonstração interativa personalizada que você preparou para a ${empresa} (${theme.categoryName}) em ${cidade}:\n\n"${customText}"\n\nGostaria de entender como colocar esse sistema no ar para a nossa empresa.`
    });
    setTimeout(() => {
      window.open(url, "_blank", "noopener,noreferrer");
      setSuccessMsg(null);
    }, 800);
  };

  return (
    <div
      className="rounded-3xl border p-6 md:p-8 shadow-2xl transition-all relative overflow-hidden"
      style={{
        backgroundColor: theme.palette.surface,
        borderColor: theme.palette.borderStrong
      }}
    >
      {/* Luz ambiente temática no topo */}
      <div
        className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full blur-3xl opacity-30"
        style={{ backgroundColor: theme.palette.accent }}
        aria-hidden="true"
      />

      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 mb-6" style={{ borderColor: theme.palette.border }}>
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-3 w-3 rounded-full animate-pulse"
            style={{ backgroundColor: theme.palette.accent }}
          />
          <span
            className="font-mono text-xs font-semibold tracking-wider uppercase"
            style={{ color: theme.palette.badgeText }}
          >
            {theme.prototype.badge}
          </span>
        </div>
        <span
          className="rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wider"
          style={{
            backgroundColor: theme.palette.badgeBg,
            border: `1px solid ${theme.palette.badgeBorder}`,
            color: theme.palette.textSecondary
          }}
        >
          Protótipo Funcional em Tempo Real
        </span>
      </div>

      <div className="mb-6">
        <h3
          className="text-2xl md:text-3xl font-semibold tracking-tight"
          style={{ color: theme.palette.textPrimary }}
        >
          {theme.prototype.title}
        </h3>
        <p className="mt-2 text-sm md:text-base leading-relaxed" style={{ color: theme.palette.textSecondary }}>
          {theme.prototype.description}
        </p>
      </div>

      {/* 1. INTERAÇÃO CLÍNICA / AGENDAMENTO */}
      {theme.prototype.kind === "clinic_scheduler" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: theme.palette.textSecondary }}>
                Especialidade Desejada
              </label>
              <select
                value={clinicSpecialty}
                onChange={(e) => setClinicSpecialty(e.target.value)}
                className="w-full rounded-xl border p-3 text-sm font-medium transition focus:outline-none"
                style={{
                  backgroundColor: theme.palette.bgSubtle,
                  borderColor: theme.palette.border,
                  color: theme.palette.textPrimary
                }}
              >
                <option value="Avaliação Inicial & Diagnóstico Completo">Avaliação Inicial & Diagnóstico Completo</option>
                <option value="Ortodontia & Alinhadores Invisíveis">Ortodontia & Alinhadores Invisíveis</option>
                <option value="Implantes & Reabilitação Oral">Implantes & Reabilitação Oral</option>
                <option value="Estética Dental (Facetas & Clareamento)">Estética Dental (Facetas & Clareamento)</option>
                <option value="Consulta Médica de Rotina">Consulta Médica de Rotina</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: theme.palette.textSecondary }}>
                Data de Preferência
              </label>
              <select
                value={clinicDate}
                onChange={(e) => setClinicDate(e.target.value)}
                className="w-full rounded-xl border p-3 text-sm font-medium transition focus:outline-none"
                style={{
                  backgroundColor: theme.palette.bgSubtle,
                  borderColor: theme.palette.border,
                  color: theme.palette.textPrimary
                }}
              >
                <option value="Hoje (Encaixe de Urgência)">Hoje (Encaixe de Urgência)</option>
                <option value="Amanhã">Amanhã</option>
                <option value="Quinta-feira">Quinta-feira</option>
                <option value="Próxima Segunda-feira">Próxima Segunda-feira</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: theme.palette.textSecondary }}>
                Horário Sugerido
              </label>
              <select
                value={clinicTime}
                onChange={(e) => setClinicTime(e.target.value)}
                className="w-full rounded-xl border p-3 text-sm font-medium transition focus:outline-none"
                style={{
                  backgroundColor: theme.palette.bgSubtle,
                  borderColor: theme.palette.border,
                  color: theme.palette.textPrimary
                }}
              >
                <option value="09:00">09:00 (Manhã)</option>
                <option value="11:30">11:30 (Manhã)</option>
                <option value="14:30">14:30 (Tarde)</option>
                <option value="17:00">17:00 (Fim de tarde)</option>
              </select>
            </div>
          </div>

          <div
            className="rounded-2xl border p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{
              backgroundColor: theme.palette.bgSubtle,
              borderColor: theme.palette.borderStrong
            }}
          >
            <div>
              <span className="font-mono text-xs uppercase tracking-wider block" style={{ color: theme.palette.accentLight }}>
                Triagem Automatizada Gerada:
              </span>
              <p className="text-sm font-medium mt-1" style={{ color: theme.palette.textPrimary }}>
                {clinicSpecialty} marcada para {clinicDate} às {clinicTime}.
              </p>
              <span className="text-xs block mt-0.5" style={{ color: theme.palette.textSecondary }}>
                O paciente recebe confirmação imediata e a recepção da {empresa} não perde tempo em ligações.
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                handleSimulateWhatsApp(
                  `Agendamento Simulado: ${clinicSpecialty} para ${clinicDate} às ${clinicTime}`
                )
              }
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-200 shrink-0 shadow-lg active:scale-95 cursor-pointer"
              style={{
                backgroundColor: theme.palette.buttonBg,
                color: theme.palette.buttonText
              }}
            >
              <MessageCircle className="h-4 w-4" />
              <span>Simular no WhatsApp →</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. INTERAÇÃO VIDRAÇARIA / ESQUADRIAS */}
      {theme.prototype.kind === "glass_calculator" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: theme.palette.textSecondary }}>
                Tipologia / Peça Desejada
              </label>
              <select
                value={glassType}
                onChange={(e) => setGlassType(e.target.value)}
                className="w-full rounded-xl border p-3 text-sm font-medium transition focus:outline-none"
                style={{
                  backgroundColor: theme.palette.bgSubtle,
                  borderColor: theme.palette.border,
                  color: theme.palette.textPrimary
                }}
              >
                <option value="Box Frontal Temperado 8mm">Box para Banheiro Frontal (Vidro Temperado 8mm)</option>
                <option value="Janela Esquadria de Alumínio 2 Folhas">Janela Linha Suprema 2 Folhas (Alumínio Preto)</option>
                <option value="Porta de Correr 4 Folhas Integrada">Porta de Correr 4 Folhas Integrada</option>
                <option value="Guarda-Corpo em Vidro Laminado 10mm">Guarda-Corpo em Vidro Laminado 10mm</option>
                <option value="Espelho Bisotado Lapidado para Sala">Espelho Bisotado Lapidado para Sala/Lavabo</option>
                <option value="Fachada em Pele de Vidro Glazing">Fachada em Pele de Vidro (Structural Glazing)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: theme.palette.textSecondary }}>
                Largura (metros)
              </label>
              <input
                type="text"
                value={glassWidth}
                onChange={(e) => setGlassWidth(e.target.value)}
                placeholder="1.40"
                className="w-full rounded-xl border p-3 text-sm font-medium transition focus:outline-none"
                style={{
                  backgroundColor: theme.palette.bgSubtle,
                  borderColor: theme.palette.border,
                  color: theme.palette.textPrimary
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: theme.palette.textSecondary }}>
                Altura (metros)
              </label>
              <input
                type="text"
                value={glassHeight}
                onChange={(e) => setGlassHeight(e.target.value)}
                placeholder="1.90"
                className="w-full rounded-xl border p-3 text-sm font-medium transition focus:outline-none"
                style={{
                  backgroundColor: theme.palette.bgSubtle,
                  borderColor: theme.palette.border,
                  color: theme.palette.textPrimary
                }}
              />
            </div>
          </div>

          <div
            className="rounded-2xl border p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{
              backgroundColor: theme.palette.bgSubtle,
              borderColor: theme.palette.borderStrong
            }}
          >
            <div>
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4" style={{ color: theme.palette.accent }} />
                <span className="font-mono text-xs uppercase tracking-wider" style={{ color: theme.palette.accentLight }}>
                  Metragem Calculada: {m2} m²
                </span>
              </div>
              <p className="text-base font-semibold mt-1" style={{ color: theme.palette.textPrimary }}>
                Estimativa Referencial: ~R$ {estimatedVal.toLocaleString("pt-BR")},00
              </p>
              <span className="text-xs block" style={{ color: theme.palette.textSecondary }}>
                {glassType} ({glassWidth}m × {glassHeight}m) pronta para validação de corte e instalação.
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                handleSimulateWhatsApp(
                  `Cotação de Vidro: ${glassType} com ${glassWidth}m x ${glassHeight}m (${m2}m²). Estimativa de R$ ${estimatedVal.toLocaleString("pt-BR")},00`
                )
              }
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-200 shrink-0 shadow-lg active:scale-95 cursor-pointer"
              style={{
                backgroundColor: theme.palette.buttonBg,
                color: theme.palette.buttonText
              }}
            >
              <MessageCircle className="h-4 w-4" />
              <span>Enviar Medidas no WhatsApp →</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. INTERAÇÃO BPO / CONTABILIDADE */}
      {theme.prototype.kind === "bpo_vault" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: theme.palette.textSecondary }}>
                Tipo de Arquivo a Conciliar
              </label>
              <select
                value={bpoDocType}
                onChange={(e) => setBpoDocType(e.target.value)}
                className="w-full rounded-xl border p-3 text-sm font-medium transition focus:outline-none"
                style={{
                  backgroundColor: theme.palette.bgSubtle,
                  borderColor: theme.palette.border,
                  color: theme.palette.textPrimary
                }}
              >
                <option value="Extratos Bancários (OFX / PDF)">Extratos Bancários (OFX / PDF)</option>
                <option value="Lote de Notas Fiscais Eletrônicas (XML / Danfe)">Lote de Notas Fiscais Eletrônicas (XML / Danfe)</option>
                <option value="Comprovantes de Pagamento Pix / Boletos">Comprovantes de Pagamento Pix / Boletos</option>
                <option value="Folha de Pagamento & Encargos">Folha de Pagamento & Encargos</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: theme.palette.textSecondary }}>
                Instituição Bancária / Sistema
              </label>
              <select
                value={bpoBank}
                onChange={(e) => setBpoBank(e.target.value)}
                className="w-full rounded-xl border p-3 text-sm font-medium transition focus:outline-none"
                style={{
                  backgroundColor: theme.palette.bgSubtle,
                  borderColor: theme.palette.border,
                  color: theme.palette.textPrimary
                }}
              >
                <option value="Banco Itaú / Bradesco">Banco Itaú / Bradesco</option>
                <option value="Banco do Brasil / Caixa">Banco do Brasil / Caixa</option>
                <option value="Santander / Inter / Nubank">Santander / Inter / Nubank</option>
                <option value="Sistema Omie / ContaAzul">Sistema Omie / ContaAzul</option>
              </select>
            </div>
          </div>

          <div
            className="rounded-2xl border p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{
              backgroundColor: theme.palette.bgSubtle,
              borderColor: theme.palette.borderStrong
            }}
          >
            <div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" style={{ color: theme.palette.accent }} />
                <span className="font-mono text-xs uppercase tracking-wider" style={{ color: theme.palette.accentLight }}>
                  Recepção Fiscal Estruturada
                </span>
              </div>
              <p className="text-sm font-medium mt-1" style={{ color: theme.palette.textPrimary }}>
                {bpoDocType} de {bpoBank} pronto para leitura e conciliação automática.
              </p>
              <span className="text-xs block" style={{ color: theme.palette.textSecondary }}>
                O cliente da {empresa} faz upload em segundos e a equipe contábil não perde horas digitando.
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                handleSimulateWhatsApp(
                  `Conciliação Fiscal: Quero integrar o recebimento de ${bpoDocType} de ${bpoBank} diretamente com nosso sistema contábil.`
                )
              }
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-200 shrink-0 shadow-lg active:scale-95 cursor-pointer"
              style={{
                backgroundColor: theme.palette.buttonBg,
                color: theme.palette.buttonText
              }}
            >
              <MessageCircle className="h-4 w-4" />
              <span>Simular Fluxo Contábil →</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. INTERAÇÃO ADVOCACIA / JURÍDICO */}
      {theme.prototype.kind === "legal_rag" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: theme.palette.textSecondary }}>
                Ramo do Direito / Natureza da Causa
              </label>
              <select
                value={legalArea}
                onChange={(e) => setLegalArea(e.target.value)}
                className="w-full rounded-xl border p-3 text-sm font-medium transition focus:outline-none"
                style={{
                  backgroundColor: theme.palette.bgSubtle,
                  borderColor: theme.palette.border,
                  color: theme.palette.textPrimary
                }}
              >
                <option value="Direito Empresarial & Contratos">Direito Empresarial & Contratos</option>
                <option value="Direito Tributário & Planejamento">Direito Tributário & Planejamento</option>
                <option value="Trabalhista Corporativo (Defesa)">Trabalhista Corporativo (Defesa)</option>
                <option value="Direito Imobiliário & Regularização">Direito Imobiliário & Regularização</option>
                <option value="Família, Sucessões & Holding">Família, Sucessões & Holding</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: theme.palette.textSecondary }}>
                Prioridade da Triagem
              </label>
              <select
                value={legalUrgency}
                onChange={(e) => setLegalUrgency(e.target.value)}
                className="w-full rounded-xl border p-3 text-sm font-medium transition focus:outline-none"
                style={{
                  backgroundColor: theme.palette.bgSubtle,
                  borderColor: theme.palette.border,
                  color: theme.palette.textPrimary
                }}
              >
                <option value="Normal (até 48h)">Consulta Consultiva (até 48h)</option>
                <option value="Urgência (Prazo Fatal em 24h)">Urgência (Prazo Processual em 24h)</option>
                <option value="Parecer Estratégico">Parecer Estratégico para Diretoria</option>
              </select>
            </div>
          </div>

          <div
            className="rounded-2xl border p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{
              backgroundColor: theme.palette.bgSubtle,
              borderColor: theme.palette.borderStrong
            }}
          >
            <div>
              <span className="font-mono text-xs uppercase tracking-wider block" style={{ color: theme.palette.accentLight }}>
                Triagem Ética e Sigilosa em Conformidade OAB:
              </span>
              <p className="text-sm font-medium mt-1" style={{ color: theme.palette.textPrimary }}>
                {legalArea} encaminhada com contexto para os advogados da {empresa}.
              </p>
              <span className="text-xs block" style={{ color: theme.palette.textSecondary }}>
                Filtra casos sem aderência e entrega dados preliminares antes da primeira reunião.
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                handleSimulateWhatsApp(
                  `Triagem Jurídica: ${legalArea} (${legalUrgency}) - Consulta prévia com o escritório.`
                )
              }
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-200 shrink-0 shadow-lg active:scale-95 cursor-pointer"
              style={{
                backgroundColor: theme.palette.buttonBg,
                color: theme.palette.buttonText
              }}
            >
              <MessageCircle className="h-4 w-4" />
              <span>Simular Triagem Jurídica →</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. INTERAÇÃO OFICINA MECÂNICA / OS */}
      {theme.prototype.kind === "auto_os" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: theme.palette.textSecondary }}>
                Placa do Veículo para Consulta do Cliente
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={autoPlate}
                  onChange={(e) => setAutoPlate(e.target.value.toUpperCase())}
                  placeholder="BRA-2E19"
                  className="w-full rounded-xl border p-3 font-mono text-sm uppercase font-bold tracking-wider transition focus:outline-none"
                  style={{
                    backgroundColor: theme.palette.bgSubtle,
                    borderColor: theme.palette.border,
                    color: theme.palette.textPrimary
                  }}
                />
                <button
                  type="button"
                  className="px-4 rounded-xl font-mono text-xs font-semibold uppercase tracking-wider cursor-pointer"
                  style={{
                    backgroundColor: theme.palette.buttonBg,
                    color: theme.palette.buttonText
                  }}
                >
                  Consultar
                </button>
              </div>
            </div>

            <div className="flex flex-col justify-end">
              <span className="font-mono text-xs uppercase" style={{ color: theme.palette.textSecondary }}>
                Status na Bancada:
              </span>
              <span className="font-semibold text-sm flex items-center gap-1.5 mt-1" style={{ color: theme.palette.accentLight }}>
                <CheckCircle2 className="h-4 w-4" />
                <span>Revisão de Freios & Injeção</span>
              </span>
            </div>
          </div>

          <div
            className="rounded-2xl border p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{
              backgroundColor: theme.palette.bgSubtle,
              borderColor: theme.palette.borderStrong
            }}
          >
            <div>
              <span className="font-mono text-xs uppercase tracking-wider block" style={{ color: theme.palette.accentLight }}>
                Ordem de Serviço Online: {autoPlate}
              </span>
              <p className="text-sm font-medium mt-1" style={{ color: theme.palette.textPrimary }}>
                Troca de pastilhas concluída · Teste de injeção eletrônica em andamento (Liberação hoje às 17h30).
              </p>
              <span className="text-xs block" style={{ color: theme.palette.textSecondary }}>
                O cliente acompanha no celular sem ligar para a oficina da {empresa}.
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                handleSimulateWhatsApp(
                  `Consulta OS Mecânica: Veículo placa ${autoPlate} - status acompanhado online.`
                )
              }
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-200 shrink-0 shadow-lg active:scale-95 cursor-pointer"
              style={{
                backgroundColor: theme.palette.buttonBg,
                color: theme.palette.buttonText
              }}
            >
              <MessageCircle className="h-4 w-4" />
              <span>Simular Atualização de OS →</span>
            </button>
          </div>
        </div>
      )}

      {/* 6. INTERAÇÃO DISTRIBUIDORA / ATACADO B2B */}
      {theme.prototype.kind === "b2b_orders" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: theme.palette.textSecondary }}>
                Item do Catálogo Corporativo
              </label>
              <select
                value={b2bItem}
                onChange={(e) => setB2bItem(e.target.value)}
                className="w-full rounded-xl border p-3 text-sm font-medium transition focus:outline-none"
                style={{
                  backgroundColor: theme.palette.bgSubtle,
                  borderColor: theme.palette.border,
                  color: theme.palette.textPrimary
                }}
              >
                <option value="Kit Atacado c/ 50 unidades">Kit Atacado c/ 50 unidades (Desconto Volume 15%)</option>
                <option value="Lote Master c/ 100 unidades">Lote Master c/ 100 unidades (Condição Faturada 28 DDL)</option>
                <option value="Pedido Especial Linha Industrial">Pedido Especial Linha Industrial (Sob Encomenda)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: theme.palette.textSecondary }}>
                Quantidade de Lotes
              </label>
              <input
                type="number"
                value={b2bQty}
                onChange={(e) => setB2bQty(e.target.value)}
                className="w-full rounded-xl border p-3 text-sm font-medium transition focus:outline-none"
                style={{
                  backgroundColor: theme.palette.bgSubtle,
                  borderColor: theme.palette.border,
                  color: theme.palette.textPrimary
                }}
              />
            </div>
          </div>

          <div
            className="rounded-2xl border p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{
              backgroundColor: theme.palette.bgSubtle,
              borderColor: theme.palette.borderStrong
            }}
          >
            <div>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4" style={{ color: theme.palette.accent }} />
                <span className="font-mono text-xs uppercase tracking-wider" style={{ color: theme.palette.accentLight }}>
                  Pedido B2B Formatado
                </span>
              </div>
              <p className="text-sm font-medium mt-1" style={{ color: theme.palette.textPrimary }}>
                {b2bQty} × {b2bItem} pronto para faturamento e expedição.
              </p>
              <span className="text-xs block" style={{ color: theme.palette.textSecondary }}>
                Reduz a redigitação do televendas da {empresa} para segundos.
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                handleSimulateWhatsApp(
                  `Pedido B2B Atacado: ${b2bQty} lotes de "${b2bItem}" gerado pelo portal da ${empresa}.`
                )
              }
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-200 shrink-0 shadow-lg active:scale-95 cursor-pointer"
              style={{
                backgroundColor: theme.palette.buttonBg,
                color: theme.palette.buttonText
              }}
            >
              <MessageCircle className="h-4 w-4" />
              <span>Simular Envio de Pedido B2B →</span>
            </button>
          </div>
        </div>
      )}

      {/* 7. INTERAÇÃO GERAL / SERVIÇOS & CATÁLOGO */}
      {theme.prototype.kind === "general_catalog" && (
        <div className="space-y-4">
          <div
            className="rounded-2xl border p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{
              backgroundColor: theme.palette.bgSubtle,
              borderColor: theme.palette.borderStrong
            }}
          >
            <div>
              <span className="font-mono text-xs uppercase tracking-wider block" style={{ color: theme.palette.accentLight }}>
                Atendimento Comercial Conectado:
              </span>
              <p className="text-sm font-medium mt-1" style={{ color: theme.palette.textPrimary }}>
                O visitante escolhe a solução desejada e inicia uma conversa estruturada no WhatsApp da {empresa}.
              </p>
              <span className="text-xs block" style={{ color: theme.palette.textSecondary }}>
                Zero leads perdidos por demora no retorno.
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                handleSimulateWhatsApp(
                  `Solicitação Comercial: Tenho interesse nas soluções e produtos da ${empresa}.`
                )
              }
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-200 shrink-0 shadow-lg active:scale-95 cursor-pointer"
              style={{
                backgroundColor: theme.palette.buttonBg,
                color: theme.palette.buttonText
              }}
            >
              <MessageCircle className="h-4 w-4" />
              <span>Experimentar Atendimento no WhatsApp →</span>
            </button>
          </div>
        </div>
      )}

      {successMsg && (
        <div
          className="mt-4 rounded-xl border p-3 text-center text-xs font-medium animate-fade-up"
          style={{
            backgroundColor: theme.palette.badgeBg,
            borderColor: theme.palette.accent,
            color: theme.palette.textPrimary
          }}
        >
          {successMsg}
        </div>
      )}
    </div>
  );
}
