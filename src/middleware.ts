import { NextResponse, type NextRequest } from "next/server";

/**
 * Guarda de borda do painel. A verificação de sessão "de verdade" acontece no
 * servidor (layout do /admin); aqui apenas evitamos renderizar o painel sem cookie
 * de sessão quando o Supabase está configurado.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSupabase = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const localAdmin = process.env.SANLE_LOCAL_ADMIN === "true" && process.env.NODE_ENV !== "production";

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (hasSupabase) {
      const hasSessionCookie = req.cookies
        .getAll()
        .some((c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token"));
      if (!hasSessionCookie) {
        const url = req.nextUrl.clone();
        url.pathname = "/admin/login";
        url.searchParams.set("proximo", pathname);
        return NextResponse.redirect(url);
      }
    } else if (!localAdmin) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
