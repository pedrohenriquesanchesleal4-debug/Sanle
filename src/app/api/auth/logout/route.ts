import { cookies } from "next/headers";
import { getSupabaseServer } from "@/lib/supabase/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth";
import { handleError, ok } from "@/lib/api";

export const runtime = "nodejs";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_SESSION_COOKIE);
    const supabase = await getSupabaseServer();
    if (supabase) await supabase.auth.signOut();
    return ok({ signedOut: true });
  } catch (err) {
    return handleError(err);
  }
}
