import type { MetadataRoute } from "next";
import { languages } from "@/lib/i18n";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://teamcargo.be";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return languages.map((lang) => ({
    url: `${SITE_URL}/${lang}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    // Dutch is the primary / highest-priority locale
    priority: lang === "nl" ? 1.0 : 0.8,
  }));
}
