import { getSupabaseServer } from "@/lib/supabase/server";
import { handleError, ok } from "@/lib/api";

export const runtime = "nodejs";

export async function POST() {
  try {
    const supabase = await getSupabaseServer();
    if (supabase) await supabase.auth.signOut();
    return ok({ signedOut: true });
  } catch (err) {
    return handleError(err);
  }
}
