# SALES HUNTER — CREATIVE DIRECTION & TECHNICAL AUDIT
## Conceito Visual, Direção de Arte, Narrativa Scroll-Driven 3D e Planejamento de Assets

---

## 1. AUDITORIA TÉCNICA DO PROJETO EXISTENTE (FASE 1)

### 1.1 Arquitetura, Framework e Dependências (`package.json`)
- **Framework**: Next.js `^15.1.0` (App Router) com React `^19.0.0` e TypeScript `^5.6.3`.
- **Estilização**: Tailwind CSS `^3.4.17` + CSS Variables em `src/app/globals.css`.
- **Animação e 3D**:
  - `gsap` (`^3.12.5`) + `ScrollTrigger` já configurado.
  - `lenis` (`^1.3.26`) ativo via `SmoothScrollProvider`.
  - `three` + `@types/three` integrados para renderização WebGL 3D procedural com instancing e fallback automático.
- **Banco de Dados e Persistência (`src/lib/db/`)**:
  - Dual-adapter em `src/lib/db/adapter.ts`: conecta automaticamente ao **Supabase** (`@supabase/ssr`, `@supabase/supabase-js`) quando `NEXT_PUBLIC_SUPABASE_URL` está configurado, ou opera em **Armazenamento Local em Disco** (`src/lib/db/local.ts`) com zero custo obrigatório (Free-First R$ 0).
  - 8 migrações SQL completas em `supabase/migrations/` (leads, activities, drafts, reminders, conversations, knowledge_chunks pgvector, lead_sources, audit_logs, admin_users, landing_and_prospect_pages).

### 1.2 O Que Já Funciona Realmente (Preservação Obrigatória)
1. **Autenticação (`/api/auth/login`, `/api/auth/logout`, `src/lib/auth.ts`, `src/middleware.ts`)**:
   - Autenticação via Supabase Auth + whitelist `SANLE_ADMIN_EMAILS` ou modo local de desenvolvimento (`SANLE_LOCAL_ADMIN`).
2. **Buscador de Leads Multi-Provider (`/api/prospects/search`, `/api/prospects/import`, `/api/prospects/csv`, `src/lib/providers/*`)**:
   - **OpenStreetMap (Overpass + Nominatim)**: Provedor gratuito padrão (`OSM_ENABLED=true`), com cache em memória, rate-limiting e deduplicação.
   - **Google Places (`src/lib/providers/google-places.ts`)**: Opcional e protegido por flag `GOOGLE_PLACES_ENABLED=false` + controle de orçamento.
   - **Importação CSV (`papaparse`) e Cadastro Manual**.
3. **CRM & Pipeline (`/admin`, `/admin/leads`, `/admin/leads/[id]`, `/admin/pipeline`, `/api/crm/*`)**:
   - Cálculo determinístico de score de priorização (`src/lib/crm/scoring.ts`) com breakdown explicável (`ScoreFactor[]`).
   - Detecção de possíveis duplicatas sem mesclagem destrutiva automática (`/api/crm/duplicates`).
   - Gestão de estágios do funil (`FUNNEL_STAGES`), notas, atividades append-only e lembretes (`/api/crm/reminders`).
4. **Geração de Mensagens / Abordagens e WhatsApp (`/api/crm/drafts`, `/admin/abordagens`, `src/lib/whatsapp.ts`)**:
   - Geração de rascunhos de abordagem por canal (`whatsapp`, `email`, `linkedin`, `ligacao`) com IA ou fallback determinístico gratuito.
   - Abertura direta de conversa no WhatsApp com mensagem pré-formatada.
5. **Templates de Sites / Demonstrações 1-to-1 (`/p/[slug]`, `/api/admin/prospect-pages`)**:
   - Geração de páginas personalizadas para cada prospect com rastreamento de visualização (`ProspectPageTracker`).
6. **Assistente IA & RAG (`/api/chat/*`, `src/lib/rag/*`, `src/lib/ai/*`)**:
   - Busca híbrida/vetorial sobre base de conhecimento com guardrails e orçamento diário (`SANLE_AI_DAILY_BUDGET_USD=0` default).

---

## 2. CONCEITO VISUAL: THE OPPORTUNITY ENGINE

### 2.1 Ideia Narrativa Central
> **"Do desconhecido à descoberta. Da descoberta à oportunidade. Da oportunidade à conversa."**

O **Sales Hunter** não é retratado como uma planilha ou um extrator bruto de dados. Ele é apresentado como um **instrumento de inteligência espacial e comercial**: um motor capaz de iluminar um território escuro de negócios dispersos, isolar sinais reais de oportunidade, diagnosticar o que falta em cada empresa e converter essa leitura em diálogo humano e relacionamento comercial no CRM.

### 2.2 Paleta de Cores Oficial
| Token Semântico | Hexadecimal | RGB | Papel na Experiência |
|---|---|---|---|
| **Deep Void (Preto Profundo)** | `#08090C` | `8 9 12` | Espaço base da narrativa, silêncio visual e contraste profundo |
| **Graphite Core (Grafite)** | `#111318` | `17 19 24` | Segundo plano arquitetural, seções editoriais e estrutura do dashboard |
| **Surface Panel (Superfícies)** | `#191C22` | `25 28 34` | Cards de leads, painéis de diagnóstico, modais e colunas de pipeline |
| **Signal White (Branco)** | `#F5F6F8` | `245 246 248` | Headlines editoriais, dados primários e pontos de luz |
| **Muted Slate (Cinza Secundário)** | `#969DA8` | `150 157 168` | Textos de apoio, coordenadas técnicas, legendas e metadados |
| **Opportunity Green (Verde Oportunidade)** | `#B7F36B` | `183 243 107` | Sinais de oportunidade identificada, score alto, CTAs primários e avanço comercial |
| **Exploration Blue (Azul Exploração)** | `#78A9FF` | `120 169 255` | Varredura territorial, conexões de rede, filtros de pesquisa e estado de exploração |

**Regra de Uso Cromático**:
- O **Verde de Oportunidade (`#B7F36B`)** é reservado exclusivamente para momentos de descoberta, confirmação de oportunidade, ações disponíveis e conversão.
- O **Azul de Exploração (`#78A9FF`)** representa busca, coordenadas geográficas, conexões entre empresas e análise de dados.
- Nunca saturar uma mesma cena com todas as cores simultaneamente; o espaço escuro (`#08090C` e `#111318`) deve dominar pelo menos 70% da composição.

### 2.3 Tipografia & Hierarquia Editorial
- **Família Principal (Display & UI)**: `Geist` / `Space Grotesk` (`--font-sans`, `--font-space`) com tracking negativo em títulos (`-0.035em` a `-0.045em`) e peso contrastado.
- **Família Editorial de Destaque**: `Instrument Serif` / `Fraunces` (`--font-serif`) apenas em acentos conceituais pontuais quando necessário.
- **Família Técnica (Coordenadas, Telemetria, Scores)**: `Geist Mono` (`--font-mono`), `uppercase`, `letter-spacing: 0.14em`, tamanho compacto (`11px`–`12px`).

### 2.4 Direção Fotográfica e Linguagem de Iluminação
- **Fotografia**: Editorial comercial realista de negócios locais brasileiros (vidraçarias, oficinas mecânicas de precisão, clínicas, restaurantes contemporâneos, barbearias e escritórios), fotografados em **chiaroscuro contemporâneo** (sombras densas `#08090C`, luz lateral quente/neutra valorizando vidro, metal, madeira e arquitetura real).
- **Iluminação 3D e Interface**: Luz volumétrica sutil, feixes direcionais precisos, reflexos especulares discretos nas bordas dos painéis (`1px solid rgba(245, 246, 248, 0.08)` com highlight `rgba(183, 243, 107, 0.28)` quando ativo).
- **Elementos Proibidos**: Proibido usar cérebros digitais, robôs humanoides, circuitos neon clichês, globos terrestres genéricos da NASA, mãos cibernéticas ou estética stock-photo corporativa.

---

## 3. REGRAS DE CONTINUIDADE DAS 8 CENAS (SCROLL STORYTELLING)

A narrativa da landing page opera sobre um palco contínuo onde cada objeto se metamorfoseia no próximo:

1. **CENA 01 — BEFORE THE SIGNAL**:
   - Espaço escuro monumental (`#08090C`). Um único ponto luminoso central com coordenada discreta (`-15.793889, -47.882778 · BSB`).
   - Headline: *"Todo negócio começa com uma oportunidade."*
   - Com o scroll, o ponto ganha intensidade, emite um pulso óptico e projeta o primeiro eixo espacial.
2. **CENA 02 — A WORLD OF BUSINESSES**:
   - O ponto central expande-se em uma malha 3D instanciada de estabelecimentos e conexões territoriais (`#78A9FF` e `#F5F6F8`).
   - Headline: *"Existem oportunidades por toda parte."*
   - Subtexto: *"O desafio não é encontrar empresas. É identificar quais merecem sua atenção."*
3. **CENA 03 — FIND THE SIGNAL**:
   - A câmera mergulha em um cluster regional da malha 3D. Os pontos alinham-se geometricamente e formam a interface de busca do Sales Hunter.
   - Demonstração controlada (sintética, rotulada como *Simulação Ilustrativa — Zero Consumo de API*): Nicho `Vidraçarias` · Localização `Brasília, DF` · Botão `"Encontrar oportunidades"`.
4. **CENA 04 — SIGNAL TO OPPORTUNITY**:
   - Os resultados emergem da malha. O ruído visual ao fundo recua em opacidade e foco seletivo destaca uma oportunidade prioritária em `#B7F36B`:
   - Card 3D: **VIDRAÇARIA EXEMPLO** · `4,8 estrelas` · `183 avaliações` · `Website não identificado nos dados consultados` · `Oportunidade sugerida: Presença digital própria`.
   - Headline: *"Menos ruído. Mais oportunidades."*
5. **CENA 05 — UNDERSTAND THE OPPORTUNITY**:
   - O card de oportunidade se desdobra espacialmente em 4 camadas conectadas: `EMPRESA → OPORTUNIDADE → SERVIÇO RECOMENDADO → AÇÃO`.
   - Headline: *"Saiba por que vale a pena entrar em contato."*
   - Texto: *"Transforme informações públicas em um próximo passo comercial mais inteligente."*
6. **CENA 06 — FROM DATA TO DIALOGUE**:
   - O diagnóstico desliza para o plano de apoio lateral e alimenta a janela de abordagem personalizada:
   - *"Olá, tudo bem? Conheci a empresa de vocês pelo Google e tive uma ideia para melhorar a forma como clientes encontram seus serviços online."*
   - Controles visíveis: `Editar mensagem`, `Abrir WhatsApp`, `Salvar no CRM`.
   - Headline: *"Cada oportunidade merece uma abordagem melhor."*
7. **CENA 07 — BUILD THE RELATIONSHIP**:
   - A mensagem aprovada condensa-se em um cartão de lead ativo que ingressa no Pipeline Kanban coreografado (`Novo lead → Primeiro contato → Respondeu → Reunião → Proposta → Cliente`).
   - Headline: *"Da primeira busca ao relacionamento comercial."*
8. **CENA 08 — THE OPPORTUNITY ENGINE**:
   - Câmera executa pullback cinematográfico: a malha 3D territorial, o diagnóstico, a abordagem e o pipeline convergem na plataforma completa Sales Hunter.
   - Headline: *"Encontre oportunidades. Inicie conversas. Construa negócios."*
   - CTAs: `"Começar a prospectar"` (`/admin/login`) e `"Explorar a plataforma"` (`#produto-real`).

---

## 4. LISTA DE ASSETS E PROMPTS DETALHADOS DE GERAÇÃO

### ASSET 01 — HERO VISUAL (`public/media/hero/opportunity-origin.jpg`)
- **Dimensões/Formato**: 16:9 (`1376x768`, JPEG otimizado).
- **Uso na Narrativa**: Base visual atmosférica da Cena 01 (*Before the Signal*) e fallback estático de alta precisão para dispositivos sem WebGL.
- **Prompt de Geração (12 critérios)**:
  > "Create an original cinematic visual environment for a premium B2B commercial intelligence platform called Sales Hunter. 1. Narrative purpose: represent the silent moment right before a business opportunity signal is detected in a vast urban territory. 2. Composition: extreme minimalist wide composition with 80% negative space and a single luminous micro-coordinate point in the exact center casting a delicate horizontal horizon line. 3. Point of view: elevated architectural aerial perspective looking slightly down into an abstract dark spatial plane. 4. Depth: deep atmospheric perspective with subtle volumetric falloff. 5. Lighting: physically plausible low-key studio lighting, tiny crisp #B7F36B lime-green focal spark and faint #78A9FF cool-blue optical refraction. 6. Palette: deep obsidian black #08090C, graphite #111318, subtle slate #969DA8. 7. Texture: fine anodized matte metal and subtle 35mm film grain. 8. Motion feel: still tension before expansion. 9. Aspect ratio: 16:9 widescreen. 10. Forbidden elements: no text, no letters, no numbers, no logos, no robots, no digital brains, no earth globes, no neon cyberpunk grids. 11. Continuity: matches the dark spatial coordinate language of the entire Opportunity Engine series. 12. Final use: Hero background and WebGL fallback for Scene 01."

### ASSET 02 — NETWORK ENVIRONMENT (`public/media/storytelling/network-territory.jpg`)
- **Dimensões/Formato**: 16:9 (`1376x768`, JPEG otimizado).
- **Uso na Narrativa**: Atmosfera espacial da Cena 02 (*A World of Businesses*) e textura de profundidade do território de negócios.
- **Prompt de Geração**:
  > "Create an original dark architectural data-topography visualization representing a metropolitan network of real businesses seen at night. 1. Narrative purpose: illustrate thousands of dispersed commercial establishments across a territory waiting to be analyzed. 2. Composition: sweeping wide-angle spatial field with elevated clusters of delicate light nodes connected by hairline geometric threads stretching toward a dark horizon. 3. Point of view: cinematic low-altitude flyover camera at a 25-degree tilt. 4. Depth: three distinct planes of depth with shallow depth-of-field bokeh in the foreground and crisp mid-ground spatial markers. 5. Lighting: controlled bi-color illumination with #78A9FF exploration-blue network filaments and rare #B7F36B opportunity-green priority nodes. 6. Palette: #08090C deep black, #111318 graphite, #78A9FF blue, #B7F36B green, #F5F6F8 white pinpoints. 7. Texture: matte architectural relief map with micro-grid etching. 8. Motion feel: slow camera traversal across the territory. 9. Aspect ratio: 16:9. 10. Forbidden elements: no text, no UI labels, no world map continents, no sci-fi holograms, no generic stock wallpaper look. 11. Continuity: direct evolution of the single point from Asset 01 into a spatial network. 12. Final use: Scene 02 background layer and editorial feature backdrop."

### ASSET 03 — OPPORTUNITY FOCUS (`public/media/storytelling/opportunity-focus.jpg`)
- **Dimensões/Formato**: 16:9 (`1376x768`, JPEG otimizado).
- **Uso na Narrativa**: Transição das Cenas 03 e 04 (*Signal to Opportunity*) e seção editorial de diagnóstico.
- **Prompt de Geração**:
  > "Create a cinematic macro-architectural composition showing a single high-value business opportunity isolated from background noise. 1. Narrative purpose: visualize the exact moment an intelligence engine filters out dozens of ordinary nodes and locks onto one priority commercial opportunity. 2. Composition: asymmetric rule-of-thirds layout where a sharp, luminous monolithic glass prism on the right is connected by a single glowing #B7F36B filament to a dimmed field of out-of-focus graphite nodes on the left. 3. Point of view: eye-level macro telephoto lens (85mm f/1.4 aesthetic). 4. Depth: strong selective focus with creamy dark background bokeh and razor-sharp foreground glass edge. 5. Lighting: rim lighting in #B7F36B opportunity green and soft #78A9FF ambient fill on dark brushed aluminum. 6. Palette: #08090C, #111318, #191C22, #B7F36B, #78A9FF. 7. Texture: optical crystal, dark anodized aluminum, subtle surface micro-texture. 8. Motion feel: precision focus pull. 9. Aspect ratio: 16:9. 10. Forbidden elements: no text, no numbers, no charts with letters, no human figures, no AI clichés. 11. Continuity: isolates one node from Asset 02's network. 12. Final use: Scene 04 transition visual and Opportunity Diagnosis editorial card."

### ASSET 04 — COMMERCIAL PHOTOGRAPHY (`public/media/businesses/`)
1. `glazier-workshop.jpg` — **Vidraçaria & Arquitetura em Vidro**:
   - **Prompt**: *"Editorial commercial photography of a modern Brazilian architectural glass and glazing workshop (vidraçaria). Craftsman inspecting large tempered glass panels in a moody, clean industrial studio with dramatic natural side-lighting coming through tall windows, deep shadows (#08090C), warm tungsten accent, reflections on glass edges, Leica SL2 35mm documentary style, realistic textures, no readable signs, no logos, no text, 16:9."*
2. `precision-service.jpg` — **Oficina & Serviço Técnico Especializado**:
   - **Prompt**: *"High-end editorial commercial photography of a clean contemporary automotive and technical service workshop in Brazil. Organized dark graphite tool walls, warm overhead task lighting illuminating a clean service bay, architectural symmetry, deep contrast, realistic industrial craftsmanship, shot on medium format camera, no readable brand logos, no text, 16:9."*

### ASSET 05 — FINAL COMPOSITION (`public/media/storytelling/engine-convergence.jpg`)
- **Dimensões/Formato**: 16:9 (`1920x1080`, PNG/WebP).
- **Uso na Narrativa**: Cena 08 (*The Opportunity Engine*) e referência visual de convergência.
- **Prompt de Geração**:
  > "Create an ultra-refined dark spatial composition representing the convergence of territory discovery, opportunity diagnosis, and commercial pipeline into a unified system.Layered floating dark glass architectural planes arranged in deep 3D perspective inside a #08090C void, connected by luminous #B7F36B and #78A9FF optical threads, Apple product-film lighting quality, precision industrial design aesthetic, no readable text or fake UI letters, 16:9."

### ASSET 06 — TEXTURAS E VÍDEOS PROCEDURAIS (`public/media/textures/` & `public/media/video/`)
- Como a regra de orçamento exige **R$ 0 (Free-First)** e proíbe arquivos `.mp4` inválidos ou serviços pagos de vídeo, os 3 filmes narrativos (**VÍDEO 01 — OPENING FILM**, **VÍDEO 02 — OPPORTUNITY DISCOVERY**, **VÍDEO 03 — COMMERCIAL TRANSFORMATION**) são implementados como **motores visuais procedurais em tempo real (WebGL + Canvas 2D HiDPI + SVG em loop contínuo de 6–10s)** em `src/components/storytelling/FilmsProcedural.tsx`, com poster frames reais gerados em `public/media/` e suporte completo a `prefers-reduced-motion`.
