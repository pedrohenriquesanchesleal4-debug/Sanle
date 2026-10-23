# Sales Hunter — The Opportunity Engine (Sanle)

Plataforma de inteligência comercial B2B e experiência digital cinematográfica construída sobre **Next.js 15.1**, **React 19**, **TypeScript**, **Three.js (WebGL)** e **GSAP ScrollTrigger**.

Transforma sinais dispersos do mercado em oportunidades priorizadas, diagnósticos comerciais, mensagens personalizadas com abertura direta no WhatsApp e acompanhamento em pipeline CRM auditável.

> **Postura Free-First (R$ 0):** a aplicação inteira funciona **100% sem chaves pagas** (armazenamento local em `.data/sanle.json` ou Supabase Free Tier, busca real via OpenStreetMap Overpass/Nominatim gratuito, IA determinística local + provedores opcionais por feature flag, WebGL 3D e filmes procedurais renderizados no próprio navegador).

---

## Arquitetura da Experiência

### Ambiente A — Landing Page Cinematográfica (`/`)
- **Conceito Criativo:** *The Opportunity Engine* — *"Do desconhecido à descoberta. Da descoberta à oportunidade. Da oportunidade à conversa."*
- **8 Cenas Conectadas por Scroll (`src/components/storytelling/`):**
  1. `01 · BEFORE THE SIGNAL` — O ponto de origem e coordenada espacial.
  2. `02 · A WORLD OF BUSINESSES` — Formação da malha territorial de empresas.
  3. `03 · THE SEARCH` — Filtragem em tempo real por segmento e região (`Vidraçarias — Brasília`).
  4. `04 · OPPORTUNITY DETECTED` — Sinais comerciais (`#B7F36B`) e score auditável (`88/100`).
  5. `05 · COMMERCIAL INTELLIGENCE` — Diagnóstico de presença digital, canais e oferta recomendada.
  6. `06 · PERSONALIZED OUTREACH` — Mensagem sob medida e acionamento direto no WhatsApp + preview de site.
  7. `07 · LIVING PIPELINE` — Funil comercial ativo em 8 estágios.
  8. `08 · THE OPPORTUNITY ENGINE` — Convergência do ecossistema completo e chamada para ação.
- **Motor 3D WebGL (`src/components/three/`):**
  - `OpportunityField`, `CameraRig`, `SpatialMarkers` (`InstancedMesh`) e `ConnectionNetwork` (`LineSegments`), com `DPR <= 1.5`, pausa automática fora de viewport, fallback gracioso sem WebGL e suporte integral a `prefers-reduced-motion`.
- **Ativos Visuais & Filmes Procedurais (`public/media/` & `ProceduralFilms.tsx`):**
  - 6 ativos fotográficos/editoriais 16:9 originais gerados sob medida + texturas SVG e 3 filmes procedurais em canvas 60fps (`Opening`, `Discovery`, `Transformation`).

### Ambiente B — Plataforma Operacional & CRM (`/admin`)
- **Dashboard Dark Precision (`#08090C` / `#111318` / `#191C22`):**
  - **Visão Geral (`/admin`):** KPIs executivos, sinais de oportunidade, fila prioritária de ação e funil.
  - **Buscador de Empresas (`/admin/prospects`):** Prospecção real via OpenStreetMap (gratuito), Google Places (opcional via flag) ou importação CSV com deduplicação e transparência de fontes.
  - **Leads (`/admin/leads`) & Ficha 360° (`/admin/leads/[id]`):** Score auditável com breakdown de fatores, diagnóstico comercial, gerador de abordagem por IA, botão de WhatsApp com mensagem pré-preenchida, histórico e tarefas.
  - **Pipeline Kanban (`/admin/pipeline`):** Movimentação entre etapas com persistência real confirmada antes da conclusão visual.

---

## Stack Técnica

- **Next.js 15.1** (App Router, React 19, TypeScript estrito)
- **Three.js + GSAP 3.12 (ScrollTrigger)** — Scrollytelling 3D e motion system
- **Tailwind CSS** — Tokens do sistema *The Opportunity Engine* (`Inter`, `Syne`, `JetBrains Mono`)
- **Zod** — Validação estrita em 100% das rotas de API
- **Supabase** (`@supabase/ssr` + `supabase-js`) ou **Local Adapter** (`.data/sanle.json`)
- **Vitest** — Suíte automatizada de testes unitários e de integração

---

## Instalação e Execução

```bash
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000
```

### Scripts de Verificação

```bash
npm run typecheck  # tsc --noEmit
npm test           # vitest run
npm run build      # next build de produção
```

---

## Documentação Complementar

| Documento | Conteúdo |
|---|---|
| `docs/creative-direction.md` | Direção criativa, mapa das 8 cenas, sistema de câmeras 3D, paleta e fotografia |
| `docs/CUSTOS-E-LIMITES.md` | Custos por serviço, limites gratuitos e operação Free-First |
| `docs/CONFIGURACAO-APIS.md` | Variáveis de ambiente opcionais e flags de ativação |
| `docs/CHECKLIST-COMPLIANCE.md` | Segurança, LGPD, rate limit, RBAC e headers HTTP |
