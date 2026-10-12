import { postAdminChat } from "@/lib/ai/handlers/chat-admin";

export const runtime = "nodejs";

/** Assistente interno fundamentado. Exige sessão de administrador. */
export async function POST(req: Request): Promise<Response> {
  return postAdminChat(req);
}
