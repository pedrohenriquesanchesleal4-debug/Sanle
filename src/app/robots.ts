import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/brand";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api", "/api/"]
      },
      {
        userAgent: ["Googlebot", "Bingbot", "Applebot"],
        allow: "/",
        disallow: ["/admin", "/admin/", "/api", "/api/"]
      },
      // Motores de Resposta & Crawlers de IA (AEO & GEO)
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "anthropic-ai",
          "Google-Extended",
          "cohere-ai",
          "FacebookBot"
        ],
        allow: ["/", "/llms.txt", "/llms-full.txt", "/solucoes", "/sobre", "/diagnostico", "/contato"],
        disallow: ["/admin", "/admin/", "/api", "/api/"]
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl
  };
}
