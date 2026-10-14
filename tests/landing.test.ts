import { describe, it, expect } from "vitest";
import { buildWhatsAppLink, getWhatsAppNumber } from "@/lib/whatsapp";
import { InboundLeadSchema } from "@/app/api/site/inbound/route";

describe("Landing & Inbound Integration Tests", () => {
  it("buildWhatsAppLink formats safe wa.me URL with phone and message", () => {
    const url = buildWhatsAppLink();
    expect(url).toContain("https://wa.me/");
    expect(url).toContain("text=");
    expect(url).toContain(encodeURIComponent("Olá, vim pelo site da Sanle"));
  });

  it("buildWhatsAppLink formats custom options correctly", () => {
    const urlSegment = buildWhatsAppLink({ segmento: "BPO Financeiro" });
    expect(urlSegment).toContain(encodeURIComponent("BPO Financeiro"));

    const urlEmpresa = buildWhatsAppLink({ empresa: "Acme Corp", segmento: "Escritórios" });
    expect(urlEmpresa).toContain(encodeURIComponent("Acme Corp"));
    expect(urlEmpresa).toContain(encodeURIComponent("Escritórios"));

    const custom = buildWhatsAppLink({ customText: "Quero agendar uma conversa" });
    expect(custom).toContain(encodeURIComponent("Quero agendar uma conversa"));
  });

  it("validates inbound lead schema with strict Zod rules", () => {
    const validData = {
      nome: "Carlos Silva",
      empresa: "Silva & Associados",
      whatsapp: "(11) 98765-4321",
      segmento: "BPO Financeiro",
      consentimentoLgpd: true
    };

    const parsed = InboundLeadSchema.safeParse(validData);
    expect(parsed.success).toBe(true);
  });

  it("rejects inbound lead with missing required fields or LGPD false", () => {
    const invalidData = {
      nome: "A", // too short (min 2)
      empresa: "B", // too short (min 2)
      whatsapp: "123", // too short
      consentimentoLgpd: false
    };

    const parsed = InboundLeadSchema.safeParse(invalidData);
    expect(parsed.success).toBe(false);
  });

  it("detects honeypot bots silently via hp field", () => {
    const botData = {
      nome: "Spam Bot",
      empresa: "Spam Corp",
      whatsapp: "11999999999",
      segmento: "Outros",
      consentimentoLgpd: true,
      hp: "http://spam.com" // honeypot filled
    };

    const parsed = InboundLeadSchema.safeParse(botData);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.hp).toBe("http://spam.com");
    }
  });
});
