import { defineConfig } from "vitest/config";
import path from "node:path";

/**
 * Config do Vitest. Sem isto, o alias `@/` não resolve dentro de `tests/` e os
 * testes de lógica (dedupe, query OSM, registry) não rodariam.
 * Ambiente `node`: a camada de provedores é server-only por design.
 */
export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(process.cwd(), "src") }
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"]
  }
});
