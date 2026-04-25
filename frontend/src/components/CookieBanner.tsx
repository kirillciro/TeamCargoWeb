"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Cookie } from "lucide-react";
import type { Dictionary } from "@/lib/getDictionary";

export default function CookieBanner({
  lang,
  dict,
}: {
  lang: string;
  dict: Dictionary;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cookie_consent");
    if (!stored) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  function accept() {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  }

  function reject() {
    localStorage.setItem("cookie_consent", "rejected");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 transition-transform duration-500 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ zIndex: 198 }}
    >
      {/* Backdrop blur strip */}
      <div className="bg-[#040f08]/95 backdrop-blur-md border-t border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Icon + text */}
            <div className="flex items-start gap-3 flex-1">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{
                  background:
                    "linear-gradient(135deg, #36B347 0%, #1a7f45 100%)",
                }}
              >
                <Cookie className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm mb-0.5">
                  {dict.cookie_banner.title}
                </p>
                <p className="text-white/55 text-xs leading-relaxed">
                  {dict.cookie_banner.description}{" "}
                  <Link
                    href={`/${lang}/cookies`}
                    className="text-[#4dc95e] hover:underline"
                  >
                    {dict.cookie_banner.cookie_policy_link}
                  </Link>{" "}
                  &middot;{" "}
                  <Link
                    href={`/${lang}/privacy`}
                    className="text-[#4dc95e] hover:underline"
                  >
                    {dict.cookie_banner.privacy_policy_link}
                  </Link>
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <button
                onClick={reject}
                className="flex-1 sm:flex-none px-4 py-2 rounded-lg border border-white/20 text-white/70 hover:text-white hover:border-white/40 text-xs font-semibold transition-colors"
              >
                {dict.cookie_banner.reject}
              </button>
              <button
                onClick={accept}
                className="flex-1 sm:flex-none px-5 py-2 rounded-lg text-white text-xs font-bold transition-colors shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, #36B347 0%, #1a7f45 100%)",
                }}
              >
                {dict.cookie_banner.accept}
              </button>
              <button
                onClick={reject}
                className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
