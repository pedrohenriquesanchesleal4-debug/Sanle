# DESIGN.md — Sistema de Design, Identidade Visual & Diretrizes Anti-AI-Slop da Sanle

> **Versão:** 2.0.0  
> **Propósito:** Fonte canônica de direção de arte, tokens semânticos, hierarquia tipográfica e princípios de experiência da Sanle.  
> **Aplicação Obrigatória:** Vale para o site institucional, aplicação administrativa/CRM e páginas geradas sob medida para prospects (`/p/[slug]`).

---

## 1. Fundamentos Teóricos e Princípios de Design

Este sistema de design foi estruturado sobre 5 bases acadêmicas e metodológicas essenciais:

1. **NN/g — AI Prototyping in Real Design Contexts:**
   - A prototipagem gerada por IA frequentemente falha por excesso de abstração e carência de contexto de negócio.
   - Proibido "lorem ipsum" funcional: todo elemento deve refletir entidades, regras e fluxos de negócio reais (orçamentos, agendamentos, conciliação fiscal, pedidos).
   - Protótipos devem resolver tarefas reais de usuários reais.

2. **NN/g — Prompt to Design Interfaces:**
   - Evitar a armadilha da interface vaga: interfaces automáticas tendem ao "menor denominador comum" (o kit SaaS: hero com 3 cards idênticos embaixo).
   - Toda composição deve responder a restrições operacionais específicas do nicho do cliente.

3. **Can Dedeoglu — Escaping AI Slop in Web Design:**
   - **Tells clássicos de IA a eliminar:**
     * Gradientes radiais roxos/azuis jogados aleatoriamente atrás de títulos sem função de luz.
     * Repetição compulsiva de seções "título centralizado + subtítulo genérico + grid de 3 cards arredondados".
     * Etiquetas em caixa alta espaçadas (`font-mono text-xs uppercase tracking-widest`) acima de cada título sem necessidade semântica.
     * Frases de marketing vazias ("Revolucione sua empresa com o poder da tecnologia").
     * Cards dentro de cards com bordas redundantes.
     * Aplicação indiscriminada de glassmorphism em superfícies que deveriam ser opacas e legíveis.

4. **NN/g — Visual Design Principles:**
   - **Hierarquia:** Escala tipográfica estrita e deliberada. O elemento primário comanda a atenção; elementos secundários apoiam com disciplina; metadados recuam.
   - **Ritmo de Rolagem:** Alternância dinâmica de densidade — momentos de leitura arejada, consoles interativos táteis, provas concretas de engenharia e dados estruturados.
   - **Contraste:** WCAG 2.2 AA obrigatório (mínimo 4.5:1 para texto normal, 3:1 para títulos).
   - **Espaço Negativo Ativo:** O respiro entre seções (`py-20` a `py-32`) é um elemento composicional ativo que comunica maturidade, nunca um espaço vazio acidental.

5. **Luo — Designing With AI: A Systematic Literature Review:**
   - Co-criação fundamentada em dados: a interface deve ancorar-se em fatos verificados (endereço, telefones, canais, gargalos operacionais) e separar categoricamente Fato de Hipótese.

---

## 2. Personalidade da Marca Sanle

- **Arquétipo:** O Engenheiro Artesanal de Software (*High-Craft Engineering Studio*).
- **Voz:** Precisa, direta, fundamentada, transparente e sofisticada.
- **Tese Central:** *"Boas ideias merecem sair do papel."* — Transformamos problemas operacionais em software real, com arquitetura sólida, sem rodeios e sem promessas vazias.
- **Posicionamento:** Engenharia de software sob medida em 4 frentes integradas:
  1. **Sanle Digital:** Presença web autoral, landing pages e experiências de alta conversão.
  2. **Sanle Systems:** Sistemas web, portais de clientes, CRMs e painéis administrativos.
  3. **Sanle Agents:** Agentes de IA com base de conhecimento própria (RAG) e supervisão humana.
  4. **Sanle Automation:** Integrações via API, conciliação bancária e esteiras documentais.

---

## 3. Tipografia & Escala Editorial

A Sanle abandona fontes genéricas neutras sem personalidade. O pareamento principal combina autoridade editorial literária com precisão de engenharia:

| Família Tipográfica | Variável CSS | Função / Uso |
|---|---|---|
| **Fraunces / Editorial Serif** | `--font-serif`, `--font-fraunces` | Títulos expressivos, citações, momentos de destaque e autoridade editorial. |
| **Plus Jakarta Sans** | `--font-sans` | Corpo de texto, formulários, botões, navegação e leitura contínua de alta legibilidade. |
| **Space Grotesk** | `--font-space` | Títulos técnicos, números de impacto, subtítulos de soluções e cartões conceituais. |
| **JetBrains Mono** | `--font-mono` | Metadados, logs operacionais, fragmentos de código, tags e telemetria. |

### Escala Tipográfica Padronizada:
- **Hero Display:** `clamp(2.75rem, 6vw, 5.5rem)` — `leading-[0.96]`, `tracking-[-0.035em]`.
- **H2 Seção:** `clamp(2rem, 4.5vw, 3.8rem)` — `leading-[1.02]`, `tracking-[-0.03em]`.
- **H3 Card/Bloco:** `clamp(1.25rem, 2vw, 1.75rem)` — `leading-snug`, `tracking-[-0.02em]`.
- **Body Regular:** `1rem (16px)` a `1.125rem (18px)` — `leading-relaxed`, `max-w-[65ch]`.
- **Caption / Meta:** `0.75rem (12px)` a `0.8125rem (13px)` — legível e discreto.

---

## 4. Paleta de Cores & Superfícies da Marca Sanle

### 4.1. Dark Mode (The Opportunity Engine / Obsidian Precision)
- **Base profunda:** `#08090C` (Preto profundo absoluto, sem desbotar).
- **Superfície 1 (Grafite):** `#111318` (Paineis, cabeçalho e fundos de cards).
- **Superfície 2 (Card Elevado):** `#191C22` (Modais, elementos interativos e hover).
- **Texto Primário:** `#F5F6F8` (Off-white de alto contraste).
- **Texto Secundário:** `#969DA8` (Cinza neutro suave, legibilidade garantida).
- **Azul Sanle (Exploração & Engenharia):** `#2440FF` / `#78A9FF`.
- **Verde Oportunidade (Sinal Comercial):** `#B7F36B` (Usado em 1-2 pontos focais de conversão, nunca como tinta genérica em tudo).
- **Ouro Arquitetural (Sistemas):** `#C8A24A` (Usado na frente de Sistemas).

### 4.2. Light Mode (Alabaster Editorial)
- **Base:** `#F8F9FA` (Off-white calmo, sem brilho agressivo).
- **Superfície:** `#FFFFFF` (Cards limpos, sem bordas pesadas).
- **Texto Primário:** `#0F1219` (Grafite escuro profundo).
- **Texto Secundário:** `#555D6E`.
- **Acento Primário:** `#2440FF` (Azul cobalto institucional).

---

## 5. Diretrizes para Páginas de Leads & Prospects (`/p/[slug]`)

> [!CRITICAL]
> **A PÁGINA DO LEAD NÃO DEVE SER UMA CÓPIA DO SITE DA SANLE.**  
> O lead não quer contratar uma página com a cara da Sanle para si mesmo; ele precisa enxergar a **sua própria empresa** com uma presença digital superior, temática do seu segmento, paleta exclusiva, imagens do seu setor e um protótipo funcional do que o software fará por ele.

### 5.1. Matriz de Temas Setoriais Bespoke

Ao gerar ou renderizar uma página `/p/[slug]`, o sistema identifica o nicho da empresa e aplica o tema visual correspondente:

| Nicho do Lead | Paleta Exclusiva | Tipografia & Estilo | Imagens e Recursos | Protótipo Interativo Embutido |
|---|---|---|---|---|
| **Clínicas Médicas & Odontologia** | Teal clínico `#0D9488`, Verde profundo `#065F46`, Fundo Alabastro `#F8FAFC`, Texto Grafite `#0F172A` | Clean, higiênico, alta confiança, humanizado | Fotos de consultórios modernos, equipamentos, estética e bem-estar | **Simulador de Agendamento Online & Triagem WhatsApp:** paciente escolhe especialidade, data e recebe confirmação. |
| **Contabilidade, BPO & Finanças** | Azul Marinho Nobre `#0A192F`, Cobalto `#1E3A8A`, Dourado Sutil `#D97706`, Superfície `#F1F5F9` | Editorial corporativo, sóbrio, precisão matemática | Documentos fiscais organizados, dashboards, reuniões executivas | **Simulador de Conciliação e Recepção de Extratos:** demonstra upload de OFX/notas e conciliação com ERP. |
| **Vidraçaria, Esquadrias & Obra** | Grafite Industrial `#18181B`, Âmbar Técnico `#F59E0B`, Aço Azulado `#38BDF8`, Superfície `#27272A` | Arquitetural, robusto, linhas precisas, técnico | Projetos de fachadas em pele de vidro, esquadrias pretas, janelas acústicas | **Calculadora de Orçamento por m²:** o cliente escolhe o vidro/esquadria, dimensões e gera orçamento no WhatsApp. |
| **Advocacia & Serviços Jurídicos** | Carvão Escuro `#1C1917`, Vinho Imperial `#991B1B`, Champanhe Dourado `#D4AF37`, Fundo `#FAF9F6` | Clássico editorial, refinado, serifado autoritário | Bibliotecas jurídicas, salas de reunião sóbrias, contratos executivos | **Simulador de Consulta de Acervo & Triagem RAG:** triagem inicial de causas e consulta a precedentes internos. |
| **Distribuidoras, Atacado & Logística** | Azul Carga `#1E3A8A`, Laranja Logístico `#F97316`, Grafite Urbano `#0F172A` | Dinâmico, funcional, focado em agilidade comercial | Frotas, galpões organizados, estoque e despacho rápido | **Portal de Pedidos B2B Rápido:** catálogo em grade para cotações por atacado com sincronização em tempo real. |
| **Oficinas Mecânicas & Manutenção** | Grafite Carvão `#111827`, Amarelo Octanagem `#EAB308`, Laranja Motor `#EA580C` | Alta energia, contraste forte, precisão mecânica | Motores limpos, diagnósticos computadorizados, elevadores automotivos | **Rastreador de Ordem de Serviço (OS):** cliente digita placa/código e visualiza status do serviço com envio WhatsApp. |
| **Comércio, Varejo & Serviços Gerais** | Índigo Moderno `#4338CA`, Esmeralda `#059669`, Superfície Limpa `#F8FAFC` | Contemporâneo, caloroso, voltado para conversão | Produtos destacados, clientes satisfeitos, ambientes acolhedores | **Catálogo Digital de Ofertas & Botão Direto:** vitrine interativa integrada ao WhatsApp comercial. |

### 5.2. Estrutura Obrigatória da Página do Lead (`/p/[slug]`):
1. **Brand Bar Superior do Cliente:** Logo/iniciais estilizadas da empresa dele, identificação da cidade/bairro, selo de autenticidade *"Proposta Digital & Protótipo Interativo preparado pela Sanle"*.
2. **Hero com Identidade Própria da Empresa:** Título personalizado destacando a autoridade da empresa na sua cidade, proposta de valor do nicho dele e chamada direta para WhatsApp.
3. **Protótipo Interativo em Tempo Real:** Uma aplicação funcional na tela (calculadora m², agendamento de clínica, portal de pedidos B2B, triagem contábil) permitindo que o decisor experimente o produto.
4. **Catálogo de Serviços da Empresa do Cliente:** Apresenta os serviços reais que a empresa dele vende, com fotos contextuais de alta resolução.
5. **Transformação Operacional (Antes vs. Depois):**
   - *Como sua empresa opera hoje:* perda de orçamentos por demora no WhatsApp, redigitação manual, planilhas dispersas.
   - *Com a solução desenvolvida pela Sanle:* atendimento imediato 24/7, catálogo digital responsivo, integração direta ao sistema de gestão.
6. **Credenciais Locais & Informações Reais:** Endereço, cidade, horário e canais de contato verificados.
7. **Cronograma de Implementação Claro:** 3 etapas simples (7 a 14 dias para entrar em produção).
8. **CTA Direto sem Fricção:** Botão de WhatsApp direcionado ao Pedro Leal com mensagem pré-formatada citando o projeto da empresa.

---

## 6. Regras de Engenharia Visual e Acessibilidade

- **Zero Layouts Genéricos:** Nunca criar seções com cartões idênticos sem hierarquia visual clara. O card principal de maior impacto deve ser visualmente distinto dos cards secundários.
- **Micro-interações:** Toda ação do usuário (hover, clique, alternância de aba, envio) deve ter feedback imediato (`duration-200` a `duration-300`, escala suave `scale-[0.98]`, foco visível `focus-visible:ring-2`).
- **Respeito a `prefers-reduced-motion`:** Animações decorativas são sumariamente desativadas para usuários que configuraram redução de movimento no sistema operacional.
- **Sem Lock-in:** O design deve funcionar perfeitamente com JavaScript desabilitado ou antes da hidratação completa.
- **Auditoria de Responsividade:** Testado e aprovado em 320px (telas móveis compactas), 375px (iPhone standard), 768px (tablets), 1024px (laptops) e 1440px+ (monitores amplos).
