import type { MetadataRoute } from "next";
import { solutions, siteUrl } from "@/content/brand";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/solucoes", "/sobre", "/diagnostico", "/contato", "/privacidade", "/termos"];
  return [
    ...staticRoutes.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: now,
      changeFrequency: (path === "" ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: path === "" ? 1 : 0.7
    })),
    ...solutions.map((s) => ({
      url: `${siteUrl}/solucoes/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6
    }))
  ];
}
