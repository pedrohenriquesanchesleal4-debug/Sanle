import type { MetadataRoute } from "next";
import { solutions, siteUrl } from "@/content/brand";

const SEGMENT_SLUGS = [
  "bpo-financeiro",
  "escritorios",
  "prestadores-de-servico"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] = [
    { path: "", priority: 1.0, changeFrequency: "daily" },
    { path: "/diagnostico", priority: 0.95, changeFrequency: "weekly" },
    { path: "/solucoes", priority: 0.9, changeFrequency: "weekly" },
    { path: "/contato", priority: 0.9, changeFrequency: "weekly" },
    { path: "/sobre", priority: 0.8, changeFrequency: "monthly" },
    { path: "/privacidade", priority: 0.5, changeFrequency: "monthly" },
    { path: "/termos", priority: 0.5, changeFrequency: "monthly" }
  ];

  const staticEntries = staticRoutes.map(({ path, priority, changeFrequency }) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority
  }));

  const solutionEntries = solutions.map((s) => ({
    url: `${siteUrl}/solucoes/${s.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85
  }));

  const segmentEntries = SEGMENT_SLUGS.map((slug) => ({
    url: `${siteUrl}/para/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8
  }));

  return [...staticEntries, ...solutionEntries, ...segmentEntries];
}
