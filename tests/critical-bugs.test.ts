import { describe, it, expect } from "vitest";
import os from "node:os";
import { resolveDataDir } from "@/lib/db/local";
import {
  encodeProspectPayload,
  decodeProspectPayload,
  cleanCompanyNameFromSlug
} from "@/lib/db/repo";
import { env } from "@/lib/env";

describe("Critical Production Bug Fixes (Serverless DB, Prospect Token, Admin Auth)", () => {
  it("resolves DATA_DIR to os.tmpdir() when running on Vercel serverless (/var/task)", () => {
    const dir = resolveDataDir({ isServerless: true, cwd: "/var/task" });
    expect(dir.startsWith(os.tmpdir())).toBe(true);
    expect(dir).not.toContain("/var/task");
  });

  it("encodes and decodes stateless prospect demo payloads for serverless cold-start resilience", () => {
    const token = encodeProspectPayload({
      empresa: "Clínica Santa Lúcia",
      cidade: "Brasília",
      nicho: "Clínica médica e odontológica",
      oportunidade: "Triagem inteligente no WhatsApp e confirmação de agenda"
    });
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(10);

    const decoded = decodeProspectPayload(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.empresa).toBe("Clínica Santa Lúcia");
    expect(decoded?.cidade).toBe("Brasília");
    expect(decoded?.nicho).toBe("Clínica médica e odontológica");
    expect(decoded?.oportunidade).toBe("Triagem inteligente no WhatsApp e confirmação de agenda");
  });

  it("strips random 4-character suffix when deriving fallback company name from slug", () => {
    expect(cleanCompanyNameFromSlug("vidracaria-alvorada-k9x2")).toBe("Vidracaria Alvorada");
    expect(cleanCompanyNameFromSlug("escritorio-silva")).toBe("Escritorio Silva");
  });

  it("always includes default founder admin email in env.adminEmails", () => {
    expect(env.adminEmails).toContain("pedrohenriquesanchesleal4@gmail.com");
  });
});
