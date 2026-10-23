import { listAudits, listAiRuns, countInboundLeads, countLandingEvents, listProspectPages } from "@/lib/db/repo";
import { handleError, ok, requireAdmin } from "@/lib/api";
import { capabilityReport, env } from "@/lib/env";
import { listProviders } from "@/lib/providers";
import { llmDescriptors } from "@/lib/ai/registry";
import { budgetSnapshot } from "@/lib/ai/budget";

export const runtime = "nodejs";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  try {
    const [runs, audits, inboundCount, eventsCount, pages] = await Promise.all([
      listAiRuns(25),
      listAudits(25),
      countInboundLeads(),
      countLandingEvents(),
      listProspectPages()
    ]);
    return ok({
      landing: {
        inboundLeads: inboundCount,
        events: eventsCount,
        prospectPages: pages.length,
        operationalCost: "R$ 0,00 (Free-First)"
      },
      capabilities: capabilityReport(),
      providers: listProviders(),
      ai: {
        configured: env.ai.configured,
        provider: env.ai.configured ? env.ai.provider : null,
        model: env.ai.configured ? env.ai.model : null,
        embedModel: env.ai.embedModel,
        hasKey: Boolean(env.ai.apiKey)
      },
      // Provedores de LLM plugáveis (server-only) + governança de custo/RAG.
      llm: {
        providers: llmDescriptors(),
        routing: { public: env.ai.publicModel, admin: env.ai.adminModel },
        maxOutputTokens: env.ai.maxOutputTokens,
        timeoutMs: env.ai.timeoutMs,
        maxRetries: env.ai.maxRetries,
        dailyBudgetUsd: env.ai.dailyBudgetUsd,
        budget: budgetSnapshot()
      },
      rag: {
        vector: env.rag.vectorEnabled && env.supabase.admin ? "pgvector" : "memória",
        topK: env.rag.topK,
        minScore: env.rag.minScore,
        contextMaxChars: env.rag.contextMaxChars,
        publicAssistant: env.rag.publicAssistantEnabled,
        adminAssistant: env.rag.adminAssistantEnabled
      },
      googlePlaces: {
        enabled: env.googlePlaces.enabled,
        configured: env.googlePlaces.configured,
        monthlyBudgetUsd: env.googlePlaces.monthlyBudgetUsd,
        maxResultsPerSearch: env.googlePlaces.maxResultsPerSearch
      },
      linkedin: { configured: env.linkedin.configured },
      recentRuns: runs,
      recentAudits: audits
    });
  } catch (err) {
    return handleError(err);
  }
}
