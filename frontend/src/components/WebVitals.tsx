"use client";

import { useReportWebVitals } from "next/dist/client/web-vitals";

/**
 * Measures Core Web Vitals automatically via Next.js.
 * Logs every metric to the console and forwards it to GA4
 * (which is already loaded in the root layout).
 *
 * Metrics reported:
 *  - FCP  — First Contentful Paint
 *  - LCP  — Largest Contentful Paint
 *  - CLS  — Cumulative Layout Shift
 *  - INP  — Interaction to Next Paint
 *  - TTFB — Time to First Byte
 */
const thresholds: Record<string, [number, number]> = {
  FCP: [1800, 3000],
  LCP: [2500, 4000],
  CLS: [0.1, 0.25],
  FID: [100, 300],
  INP: [200, 500],
  TTFB: [800, 1800],
};

function rating(name: string, value: number): string {
  const t = thresholds[name];
  if (!t) return "—";
  if (value <= t[0]) return "✅ good";
  if (value <= t[1]) return "⚠️  needs improvement";
  return "❌ poor";
}

export default function WebVitals() {
  useReportWebVitals((metric) => {
    const unit = metric.name === "CLS" ? "" : " ms";
    const val =
      metric.name === "CLS"
        ? metric.value.toFixed(4)
        : Math.round(metric.value).toString();

    console.log(
      `%c[Web Vitals] ${metric.name}%c  ${val}${unit}  ${rating(metric.name, metric.value)}`,
      "color: #6366f1; font-weight: bold",
      "color: inherit",
    );

    // Forward to GA4 when gtag is available (production)
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", metric.name, {
        value: Math.round(
          metric.name === "CLS" ? metric.value * 1000 : metric.value,
        ),
        event_category: "Web Vitals",
        event_label: metric.id,
        non_interaction: true,
      });
    }
  });

  return null;
}
