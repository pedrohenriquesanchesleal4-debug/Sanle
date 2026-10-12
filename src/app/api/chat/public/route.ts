import { postPublicChat } from "@/lib/ai/handlers/chat-public";

export const runtime = "nodejs";

/** Assistente público — endpoint canônico (`/api/chat` permanece como alias). */
export async function POST(req: Request): Promise<Response> {
  return postPublicChat(req);
}
