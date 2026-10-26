/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  serverExternalPackages: ["@supabase/supabase-js", "@supabase/ssr"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "tile.openstreetmap.org" }
    ]
  },
  async headers() {
    const isProd = process.env.NODE_ENV === "production";
    // `connect-src` precisa do endpoint do Supabase (auth via browser) quando
    // configurado em build; sem chaves, tudo permanece same-origin.
    const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
    const connectSrc = supabaseUrl
      ? `'self' ${supabaseUrl.replace(/^https?:\/\//, "wss://")} ${supabaseUrl}`
      : "'self'";
    // CSP pragmática para Next.js: `next/font` injeta <style> inline e o runtime
    // Next injeta scripts inline — por isso 'unsafe-inline'. Próximo nível de
    // hardening (nonce por requisição) é dívida registrada em docs/CHECKLIST-COMPLIANCE.md.
    const csp = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://images.unsplash.com https://tile.openstreetmap.org",
      "font-src 'self' data:",
      `connect-src ${connectSrc}`,
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join("; ");

    const headers = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
      { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
      { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
      { key: "Content-Security-Policy", value: csp }
    ];

    // HSTS só em produção: em dev (http://localhost) o header quebraria o acesso.
    if (isProd) {
      headers.push({ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" });
    }

    return [{ source: "/(.*)", headers }];
  }
};

export default nextConfig;
