import { describe, it, expect } from "vitest";
import { getNicheTheme } from "@/lib/themes/prospect-theme";
import { aiProspectProvider } from "@/lib/providers/ai-prospect";

describe("NicheTheme System for Lead Pages", () => {
  it("resolves dental/medical clinic theme with clinic_scheduler prototype", () => {
    const theme = getNicheTheme("Clínica Odontológica", "Alpha Odonto");
    expect(theme.id).toBe("saude_clinica");
    expect(theme.prototype.kind).toBe("clinic_scheduler");
    expect(theme.palette.buttonBg).toBe("#0D9488");
  });

  it("resolves glass/aluminum esquadrias theme with glass_calculator prototype", () => {
    const theme = getNicheTheme("Vidraçaria e Esquadrias", "Cristal Box");
    expect(theme.id).toBe("vidracaria_esquadrias");
    expect(theme.prototype.kind).toBe("glass_calculator");
    expect(theme.palette.accent).toBe("#F59E0B");
  });

  it("resolves accounting/BPO theme with bpo_vault prototype", () => {
    const theme = getNicheTheme("BPO Financeiro e Contabilidade", "Metrópole Contábil");
    expect(theme.id).toBe("contabilidade_bpo");
    expect(theme.prototype.kind).toBe("bpo_vault");
    expect(theme.palette.accent).toBe("#3B82F6");
  });

  it("resolves law/legal office theme with legal_rag prototype", () => {
    const theme = getNicheTheme("Escritório de Advocacia", "Silva & Santos Advogados");
    expect(theme.id).toBe("advocacia_juridico");
    expect(theme.prototype.kind).toBe("legal_rag");
    expect(theme.palette.accent).toBe("#D97706");
  });

  it("resolves auto repair theme with auto_os prototype", () => {
    const theme = getNicheTheme("Oficina Mecânica e Auto Center", "Auto Precision");
    expect(theme.id).toBe("oficina_mecanica");
    expect(theme.prototype.kind).toBe("auto_os");
    expect(theme.palette.accent).toBe("#EA580C");
  });

  it("resolves distributor B2B theme with b2b_orders prototype", () => {
    const theme = getNicheTheme("Distribuidora e Atacado", "Capital Peças");
    expect(theme.id).toBe("distribuidora_logistica");
    expect(theme.prototype.kind).toBe("b2b_orders");
    expect(theme.palette.accent).toBe("#0284C7");
  });

  it("resolves general commerce theme as fallback", () => {
    const theme = getNicheTheme("Consultoria Geral", "Empresa Exemplo");
    expect(theme.id).toBe("servicos_geral");
    expect(theme.prototype.kind).toBe("general_catalog");
  });
});

describe("Sanle AI Prospect Provider Enhancements", () => {
  it("generates candidates with valid phone, regional DDD and facts", async () => {
    const candidates = await aiProspectProvider.search({
      city: "Goiânia",
      uf: "GO",
      category: "Clínica Odontológica",
      limit: 3
    });

    expect(candidates.length).toBeGreaterThan(0);
    const first = candidates[0]!;
    expect(first.phone).toContain("(62)");
    expect(first.city).toBe("Goiânia");
    expect(first.uf).toBe("GO");
    expect(first.facts.length).toBeGreaterThan(0);
    expect(first.hypotheses.length).toBeGreaterThan(0);
  });

  it("rotates candidate names when given different seeds or exclusions", async () => {
    const search1 = await aiProspectProvider.search({
      city: "Brasília",
      uf: "DF",
      category: "Vidraçaria",
      limit: 3,
      seed: 100
    });

    const search2 = await aiProspectProvider.search({
      city: "Brasília",
      uf: "DF",
      category: "Vidraçaria",
      limit: 3,
      seed: 850
    });

    expect(search1.length).toBeGreaterThan(0);
    expect(search2.length).toBeGreaterThan(0);
    // At least one company name should differ between different seeds/rotations
    const names1 = search1.map((c) => c.companyName);
    const names2 = search2.map((c) => c.companyName);
    const hasDifference = names1.some((n) => !names2.includes(n));
    expect(hasDifference).toBe(true);
  });
});
