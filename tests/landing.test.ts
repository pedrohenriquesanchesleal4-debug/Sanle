import { describe, it, expect } from "vitest";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { InboundLeadSchema } from "@/lib/schemas";
import { computeStoryTimelineState } from "@/lib/motion/scroll-timelines";
import { STORY_SCENES, MOTION_EASING, MOTION_DURATION } from "@/lib/motion/motion-config";
import { brand, hero } from "@/content/brand";

describe("Landing, Storytelling & Inbound Integration Tests", () => {
  it("exposes Sales Hunter brand identity and The Opportunity Engine concept", () => {
    expect(brand.name).toBe("Sales Hunter");
    expect(hero.eyebrow).toContain("THE OPPORTUNITY ENGINE");
  });

  it("enforces precision motion tokens and 8 camera keyframes for 3D WebGL engine", () => {
    expect(MOTION_EASING.gsapOut).toBe("power3.out");
    expect(MOTION_DURATION.normal).toBeGreaterThan(0);
    expect(STORY_SCENES).toHaveLength(8);
  });

  it("defines all 8 continuous storytelling scenes covering [0..1] without gaps", () => {
    expect(STORY_SCENES).toHaveLength(8);
    expect(STORY_SCENES[0]!.range[0]).toBe(0);
    expect(STORY_SCENES[STORY_SCENES.length - 1]!.range[1]).toBe(1);

    for (let i = 1; i < STORY_SCENES.length; i++) {
      expect(STORY_SCENES[i]!.range[0]).toBeCloseTo(STORY_SCENES[i - 1]!.range[1], 5);
    }
  });

  it("computes continuous camera, network, and opportunity parameters across scroll progress", () => {
    const startState = computeStoryTimelineState(0);
    expect(startState.activeSceneIndex).toBe(0);
    expect(startState.activeScene.id).toBe("scene-01-signal");
    expect(startState.networkIntensity).toBeLessThan(0.2);

    const midState = computeStoryTimelineState(0.42);
    expect(midState.activeScene.id).toBe("scene-04-opportunity");
    expect(midState.opportunityFocus).toBeGreaterThan(0.7);

    const endState = computeStoryTimelineState(1);
    expect(endState.activeSceneIndex).toBe(7);
    expect(endState.activeScene.id).toBe("scene-08-engine");
    expect(endState.opportunityFocus).toBeGreaterThan(0.9);
  });

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
      nome: "A",
      empresa: "B",
      whatsapp: "123",
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
      hp: "http://spam.com"
    };

    const parsed = InboundLeadSchema.safeParse(botData);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.hp).toBe("http://spam.com");
    }
  });

  it("creates and retrieves prospect pages (/p/[slug]) with robust resilience", async () => {
    const { createProspectPage, getProspectPageBySlug } = await import("@/lib/db/repo");
    const testSlug = `teste-prospect-${Date.now()}`;
    const page = await createProspectPage({
      slug: testSlug,
      empresa: "Vidraçaria Alvorada",
      cidade: "Brasília",
      nicho: "Vidraçaria",
      oportunidade: "Automação de orçamentos e agendamentos pelo WhatsApp"
    });

    expect(page).toBeDefined();
    expect(page.slug).toBe(testSlug);
    expect(page.empresa).toBe("Vidraçaria Alvorada");

    const retrieved = await getProspectPageBySlug(testSlug);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.slug).toBe(testSlug);
    expect(retrieved?.nicho).toBe("Vidraçaria");
  });
});
