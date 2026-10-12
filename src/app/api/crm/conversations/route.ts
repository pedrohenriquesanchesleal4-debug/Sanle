import { listConversations, listMessages } from "@/lib/db/repo";
import { handleError, ok, requireAdmin } from "@/lib/api";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  try {
    const url = new URL(req.url);
    const channel = url.searchParams.get("channel") as "site" | "interno" | "whatsapp" | "email" | "linkedin" | null;
    const withCounts = url.searchParams.get("counts") === "1";
    const conversations = await listConversations(channel ?? undefined);
    if (!withCounts) return ok(conversations);
    const enriched = await Promise.all(
      conversations.map(async (c) => ({ ...c, messageCount: (await listMessages(c.id)).length }))
    );
    return ok(enriched);
  } catch (err) {
    return handleError(err);
  }
}
