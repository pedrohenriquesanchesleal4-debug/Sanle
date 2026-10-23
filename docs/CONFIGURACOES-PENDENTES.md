# Guia de Configurações Pendentes — Sanle

Este documento detalha **exatamente o que falta você configurar** no seu ambiente local e no Supabase para que todas as funcionalidades (site público cinematográfico, prospecção, CRM, assistente RAG e autenticação) funcionem com 100% de capacidade.

---

## 1. Variáveis de Ambiente (`.env.local`)

Hoje o arquivo `.env.local` ainda **não existe** na raiz do projeto (o app está operando em modo local padrão com dados em disco).

Crie o arquivo `.env.local` a partir do modelo:

```bash
cp .env.example .env.local
```

### Campos prioritários para preenchimento:

| Variável | Para que serve | Onde obter / Exemplo |
|---|---|---|
| `NEXT_PUBLIC_SANLE_WHATSAPP` | **Essencial para o botão flutuante de WhatsApp**. Se vazio, o botão rola para o diagnóstico. | `5561999999999` (DDD + número) |
| `NEXT_PUBLIC_SANLE_EMAIL` | Exibido no rodapé e canal oficial de contato da empresa. | `contato@sanle.com.br` |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do seu projeto no Supabase. | Dashboard do Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave pública do Supabase para o cliente. | Dashboard do Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | **Chave restrita do servidor** para operações de banco e RLS bypass. Nunca expor no front. | Dashboard do Supabase → Project Settings → API (service_role) |
| `SANLE_ADMIN_EMAILS` | Lista de e-mails permitidos (separados por vírgula). Serve como bootstrap e fallback da tabela `admin_users`. | `seu.email@empresa.com.br` |
| `SANLE_AI_PROVIDER` | Provedor de IA para respostas do chat e geração de abordagens. | `openai`, `anthropic`, ou `openai_compatible` |
| `SANLE_AI_API_KEY` | Chave de API do provedor escolhido. Sem chave, o app usa modo determinístico gratuito. | `sk-...` |
| `OSM_USER_AGENT` | Obrigatório para conformidade de prospecção gratuita no OpenStreetMap. | `SanleProspecting/1.0 (contato@suaempresa.com.br)` |

> **Nota:** Em desenvolvimento sem chaves, você pode manter `SANLE_LOCAL_ADMIN=true` no `.env.local` para acessar o painel `/admin` sem precisar do Supabase.

---

## 2. Supabase: Execução das Migrations

No painel do seu projeto no [supabase.com](https://supabase.com), acesse o menu **SQL Editor** e execute os arquivos presentes na pasta `supabase/migrations/` **na ordem numérica abaixo**:

1. `supabase/migrations/20261012000000_sanle_baseline.sql`
   - Cria as 11 tabelas centrais: `leads`, `lead_activities`, `outreach_drafts`, `reminders`, `conversations`, `conversation_messages`, `knowledge_documents`, `knowledge_chunks`, `ai_runs`, `audit_logs`, `saved_searches`.
2. `supabase/migrations/20261012000100_knowledge_chunks_pgvector.sql`
   - Habilita a extensão `vector` (pgvector) e a RPC `match_knowledge_chunks`.
3. `supabase/migrations/20261012000200_integrations_forward.sql`
   - Cria as tabelas `integrations` e `integration_logs`.
4. `supabase/migrations/20261012000300_lead_sources.sql`
   - Cria a tabela `lead_sources` com rastreamento append-only de procedência e parâmetros UTM.
5. `supabase/migrations/20261012000400_rag_search.sql`
   - Habilita a extensão `pg_trgm` e a busca híbrida vetorial + trigrama.
6. `supabase/migrations/20261012000500_audit_logs_append_only.sql`
   - Cria os triggers imutáveis de trilha de auditoria anti-adulteração.
7. `supabase/migrations/20261012000600_admin_users.sql` **(NOVA)**
   - Cria a tabela `admin_users` para gerenciar administradores no banco sem exigir novo deploy.

---

## 3. Criação do Primeiro Usuário Administrador

Com as migrations aplicadas e o Supabase conectado:

1. Acesse **Authentication → Users** no painel do Supabase e clique em **Add user** (Create user).
2. Defina o e-mail (ex: `admin@sanle.com.br`) e uma senha forte.
3. No **SQL Editor** do Supabase, insira o usuário na tabela `admin_users` para liberar acesso permanente:
   ```sql
   insert into public.admin_users (email, name, role, active)
   values ('admin@sanle.com.br', 'Pedro Leal', 'admin', true)
   on conflict (lower(trim(email))) do nothing;
   ```
4. Alternativamente (ou em conjunto), você pode adicionar o e-mail na variável `SANLE_ADMIN_EMAILS` no `.env.local`:
   ```bash
   SANLE_ADMIN_EMAILS=admin@sanle.com.br
   ```

---

## 4. População de Dados Iniciais (Seed)

Após configurar o `.env.local` e o servidor estiver rodando com `npm run dev`:

Execute o comando para popular o banco com dados de exemplo (leads, fluxos, base de conhecimento e prompts):

```bash
npm run seed
```

---

## 5. Resumo do que foi implementado no projeto

- [x] **Visual Cinematográfico Noite Operacional**: Fundo profundo `#0B0B0C`, tipografia Fraunces + IBM Plex Mono, acentos Cobalto Elétrico e Verde Signal Neon.
- [x] **Hero com Scrollytelling Gravitacional**: Canvas 60fps de partículas que representam tarefas/documentos dispersos e se organizam no glifo da Sanle conforme o scroll.
- [x] **Calculadora Interativa de Custo Invisível**: Sliders de equipe, horas e salário com cálculo em tempo real e encaminhamento com 1 clique para o diagnóstico.
- [x] **Diagnóstico Rápido em 3 Passos na Home**: Wizard ágil com seleção de segmento, gargalos operacionais e geração de protocolo rastreável.
- [x] **Captura Automática de UTMs**: Módulo silencioso que registra parâmetros de anúncios e referrers para cada lead gerado no CRM.
- [x] **Lead Magnet**: Box executivo para download do Checklist de Automação de Processos 2026.
- [x] **Botão Flutuante de WhatsApp & Sticky Bar**: Ações de contato e simulação sempre acessíveis na rolagem da página.
- [x] **Tabela `admin_users`**: Migration criada, tipos atualizados, suporte híbrido com fallback para `SANLE_ADMIN_EMAILS` e API de gestão pronta em `/api/crm/admin-users`.
