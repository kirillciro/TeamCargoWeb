"use client";

/**
 * Fires a GA4 `page_view` event on every client-side route change.
 *
 * Next.js App Router performs SPA navigation via React transitions, which
 * does NOT trigger a full page reload. GA4's auto-page-tracking only covers
 * the initial hard load; this component fills the gap for all subsequent
 * navigations so every page visit is recorded.
 */

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function GaPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;

    const url = pathname + (searchParams.toString() ? "?" + searchParams.toString() : "");

    window.gtag("event", "page_view", {
      page_path: url,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}
