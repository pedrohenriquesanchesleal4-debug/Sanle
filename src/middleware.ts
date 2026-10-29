import { NextResponse, type NextRequest } from "next/server";

/**
 * Guarda de borda do painel. Aceita tanto o cookie de sessão administrativa
 * (`sanle_admin_session`) quanto cookies do Supabase SSR (`sb-...-auth-token` ou
 * fragmentos `.0`, `.1`). A verificação estrita de e-mail autorizado acontece
 * no servidor (`getSession()` no layout do `/admin`).
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSupabase = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const localAdmin = process.env.SANLE_LOCAL_ADMIN === "true" && process.env.NODE_ENV !== "production";

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const allCookies = req.cookies.getAll();
    const hasAdminCookie = allCookies.some((c) => c.name === "sanle_admin_session" && Boolean(c.value));
    const hasSupabaseCookie = allCookies.some(
      (c) => c.name.startsWith("sb-") && c.name.includes("-auth-token")
    );

    if (hasAdminCookie || hasSupabaseCookie || localAdmin) {
      return NextResponse.next();
    }

    if (hasSupabase || !localAdmin) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("proximo", pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
