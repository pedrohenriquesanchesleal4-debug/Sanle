# Sanle Bug Fixes & Complete Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans and superpowers:test-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the 3 critical production bugs (Admin Login input lock & fallback auth, Serverless `ENOENT: mkdir '/var/task/.data'` on prospect demo creation, and Floating Island Navbar disappearing/overlapping) and execute an authorial, contemporary editorial redesign of `https://sanle.vercel.app/` centered on *"Boas ideias merecem sair do papel"* and the 4 core fronts (Digital, Sistemas, Agentes, Automação).

**Architecture:**
1. **Resilient Storage & Auth Layer (`src/lib/db/local.ts`, `src/lib/env.ts`, `src/lib/auth.ts`, `src/app/api/auth/login/route.ts`, `src/components/admin/LoginForm.tsx`, `src/app/api/admin/prospect-pages/route.ts`, `src/app/(site)/p/[slug]/page.tsx`):** Resolve writable storage directory to `os.tmpdir()` when running on Vercel/read-only filesystems (`process.env.VERCEL` or `mkdir` error), encode stateless fallback parameters in `/p/[slug]` URLs so demo links survive serverless cold starts without a `prospect_pages` Postgres table, and remove `disabled={!supabaseReady}` from `LoginForm.tsx` while providing a signed/cookie-backed admin login fallback for authorized admin emails.
2. **Floating Island Navigation (`src/components/site/SiteHeader.tsx`):** Replace the hidden-below-500px full-bleed header with an always-accessible floating island pill (`fixed top-4 inset-x-0 z-50` centered container) that adapts cleanly to light and dark modes, never disappears at scroll 0, and never overwrites sticky content.
3. **Contemporary Editorial Redesign (`src/app/(site)/page.tsx`, `src/content/brand.ts`, `src/content/hero.ts`, `src/lib/i18n/dictionaries/*`, `src/components/site/*`):**
   - **Hero (`HeroPortal.tsx`):** Centralize *"Boas ideias merecem sair do papel."* with an asymmetric editorial composition, direct interactive preview of the 4 fronts (Digital, Sistemas, Agentes, Automação), immediate interactivity (`pointer-events-auto` from load — no scroll-locked invisible hero!), and full `prefers-reduced-motion` support.
   - **Four Service Fronts (`CapabilitiesShowcase.tsx`):** Mount prominently on `page.tsx` (`#capacidades`) with 4 distinct visual compositions and real interactive demonstrations (Digital viewport & conversion anatomy switcher, Systems interactive Kanban/CRM state machine, Agents interactive RAG + tool-call console with source citations, Automation interactive event-to-ERP payload validator), honestly labeled as interactive simulations.
   - **Editorial Narrative & Scrollytelling (`SanleScrollytelling.tsx`):** Condense the 5 redundant manual-document sections into one rhythmic 4-chapter editorial narrative covering all 4 fronts without unverified statistics.
   - **Fact-Checked Proof & Simulator (`Cases.tsx`, `CostCalculator.tsx`, `TrustSection.tsx`, `CommercialModels.tsx`, `Method.tsx`, `Faq.tsx`, `FinalCta.tsx`, `ChatWidget.tsx`):** Remove all unverified latency/percentage claims (`0.18s`, `32%`, `99.9%`, `Zero alucinação`), qualify simulator calculations as illustrative estimates, mount `CommercialModels` (`#contratacao`), fix duplicate `#contato` IDs, and fix the white-on-white `ChatWidget` contrast bug.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Vitest, Playwright.

**Spec:** User prompt (`SANLE — REDESIGN VISUAL COMPLETO COM SKILLS OBRIGATÓRIAS` + 3 bug reports).

## Global Constraints
- Never disable login inputs in `LoginForm.tsx` based on `supabaseReady`.
- Never call `fs.mkdir('/var/task/.data')` without falling back to `os.tmpdir()` in serverless environments.
- Central hero concept must be *"Boas ideias merecem sair do papel."*
- Present the 4 service fronts (*Digital*, *Sistemas*, *Agentes*, *Automação*) with distinct visual languages and real interactive demos, not 4 identical cards.
- Strictly avoid AI clichés (purple/blue gradients, particle spheres, robots, fake statistics, uniform card grids).
- Qualify all simulator numbers as estimates and remove unverified benchmarks (`0.18s`, `32%`, `98.2%`, `99.9%`).

## Review Focus
1. Serverless read-only `process.cwd()` (`/var/task`) during `createProspectPage` or `readDB()` must not throw `ENOENT` or `EROFS`.
2. Prospect demo URLs (`/p/[slug]`) opened on a cold serverless instance must still display the exact company name, city, niche, and opportunity.
3. `/admin/login` inputs must be focusable and typeable regardless of `supabaseReady` or theme (`light`/`dark`).
4. `SiteHeader` must be visible at `scrollY === 0` on all pages (`/`, `/solucoes`, `/diagnostico`, `/p/[slug]`) and structured as a floating island.
5. `ChatWidget` and all redesigned sections must maintain ≥ 4.5:1 text contrast in both `.dark` and `.light` themes.

---

### Task 1: Serverless-Resilient LocalDB & Stateless Prospect Page Fallback (Bug A3)
- [ ] Write failing tests in `tests/critical-bugs.test.ts` testing `resolveDataDir` under `VERCEL="1"` / read-only cwd and `encodeProspectToken` / `decodeProspectToken` fallback.
- [ ] Run `npx vitest run tests/critical-bugs.test.ts` to confirm failure.
- [ ] Update `src/lib/db/local.ts`, `src/app/api/admin/prospect-pages/route.ts`, and `src/app/(site)/p/[slug]/page.tsx`.
- [ ] Re-run `npx vitest run tests/critical-bugs.test.ts` to confirm pass.

### Task 2: Admin Login Input Unlock & Resilient Admin Authentication (Bug A1)
- [ ] Add tests in `tests/critical-bugs.test.ts` verifying default admin email resolution and login fallback.
- [ ] Update `src/lib/env.ts`, `src/lib/auth.ts`, `src/middleware.ts`, `src/app/api/auth/login/route.ts`, and `src/components/admin/LoginForm.tsx`.
- [ ] Verify with `npx vitest run`.

### Task 3: Floating Island Navbar (`SiteHeader.tsx`) & Contrast Fix in `ChatWidget.tsx` (Bug A2)
- [ ] Redesign `src/components/site/SiteHeader.tsx` as an always-visible floating island navbar (`top-3 sm:top-4`) with links to `#capacidades`, `#historia-sanle`, `#prova`, `#calculadora`, `#contratacao`, `#contato`, theme/locale controls, and mobile sheet.
- [ ] Fix `src/components/site/ChatWidget.tsx` dark/light surface and text contrast.

### Task 4: Editorial Design System, Fact-Checked Content & Complete Homepage Redesign
- [ ] Update `src/content/brand.ts`, `src/content/hero.ts`, `src/content/segments.ts`, and `src/lib/i18n/dictionaries/{pt,en,es}.ts` with *"Boas ideias merecem sair do papel."* and fact-checked copy.
- [ ] Redesign `src/components/site/HeroPortal.tsx` and `src/components/site/TactileFlowConsole.tsx` into an authorial editorial Hero + interactive 4-fronts workbench (immediately interactive at scroll 0, with smooth scroll-linked depth and full `prefers-reduced-motion` support).
- [ ] Upgrade `src/components/site/CapabilitiesShowcase.tsx` so the 4 fronts (*Digital*, *Sistemas*, *Agentes*, *Automação*) have distinct editorial layouts and rich interactive demos without fabricated latencies.
- [ ] Refine `src/components/site/SanleScrollytelling.tsx` & `OperationalBlueprintStage.tsx`, `CostCalculator.tsx`, `Cases.tsx`, `TrustSection.tsx`, `Method.tsx`, `CommercialModels.tsx`, `Faq.tsx`, and `FinalCta.tsx`.
- [ ] Compose the streamlined, high-impact narrative in `src/app/(site)/page.tsx` and remove overlapping HUD clutter.

### Task 5: Comprehensive Verification (Tests, Typecheck, Lint, Build, Playwright Desktop/Tablet/Mobile)
- [ ] Run `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build`.
- [ ] Verify in headless Chromium via Playwright across Desktop (`1440x900`), Tablet (`768x1024`), and Mobile (`390x844`) for `/`, `/admin/login`, and `/p/[slug]`.
