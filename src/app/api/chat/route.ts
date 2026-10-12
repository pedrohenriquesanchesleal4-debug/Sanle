import { postPublicChat } from "@/lib/ai/handlers/chat-public";

export const runtime = "nodejs";

/**
 * Rota histórica do assistente público. Mantida como ALIAS estável de
 * `/api/chat/public` — o consumidor (`ChatWidget`) aponta para `/api/chat` e
 * continua funcionando sem mudança. O corpo da rota é o handler compartilhado.
 */
export async function POST(req: Request): Promise<Response> {
  return postPublicChat(req);
}
