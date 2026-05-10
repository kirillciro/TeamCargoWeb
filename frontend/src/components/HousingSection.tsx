"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Home,
  Wifi,
  Utensils,
  MapPin,
  Phone,
  type LucideIcon,
} from "lucide-react";
import type { Dictionary } from "@/lib/getDictionary";

const DEFAULT_PERK_ICONS: LucideIcon[] = [Home, Wifi, Utensils, MapPin];

type HousingOverrides = {
  label?: string;
  title?: string;
  description?: string;
  perk0?: string;
  perk1?: string;
  perk2?: string;
  perk3?: string;
  cta?: string;
  perk0Icon?: string;
  perk1Icon?: string;
  perk2Icon?: string;
  perk3Icon?: string;
  img1?: string;
  img2?: string;
  bg?: string;
  _hasTranslations?: boolean;
};

const LS_HOUSING = (lang: string) => `tc_housing_overrides_${lang}`;

export default function HousingSection({
  dict,
  lang = "nl",
}: {
  dict: Dictionary;
  lang?: string;
}) {
  const [overrides, setOverrides] = useState<HousingOverrides>({});
  const [perkIconMap, setPerkIconMap] = useState<Record<
    string,
    LucideIcon
  > | null>(null);

  useEffect(() => {
    const fetchOverrides = async () => {
      try {
        const cached = localStorage.getItem(LS_HOUSING(lang));
        if (cached) setOverrides(JSON.parse(cached) as HousingOverrides);
      } catch {
        /* ignore */
      }

      try {
        const res = await fetch(`/api/housing-overrides/${lang}`);
        if (res.ok) {
          const data = (await res.json()) as HousingOverrides;
          const { _hasTranslations: _, ...rest } = data;
          setOverrides((prev) =>
            JSON.stringify(prev) === JSON.stringify(rest) ? prev : rest,
          );
          localStorage.setItem(LS_HOUSING(lang), JSON.stringify(rest));
        }
      } catch {
        /* ignore */
      }
    };
    void fetchOverrides();

    const handler = () => void fetchOverrides();
    window.addEventListener("tc:housing-updated", handler);
    return () => {
      window.removeEventListener("tc:housing-updated", handler);
    };
  }, [lang]);

  const o = overrides;
  const perksText = [
    o.perk0 || dict.housing.perks[0],
    o.perk1 || dict.housing.perks[1],
    o.perk2 || dict.housing.perks[2],
    o.perk3 || dict.housing.perks[3],
  ];
  const perkIconKeys = [o.perk0Icon, o.perk1Icon, o.perk2Icon, o.perk3Icon];

  useEffect(() => {
    if (perkIconKeys.some(Boolean) && !perkIconMap) {
      void import("@/components/PerkIconMap").then((m) =>
        setPerkIconMap(m.PERK_ICON_MAP),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [o.perk0Icon, o.perk1Icon, o.perk2Icon, o.perk3Icon]);

  return (
    <section
      id="housing"
      className="py-20 sm:py-28 overflow-hidden min-h-screen flex flex-col justify-center"
      style={{ backgroundColor: overrides.bg || "#0d2e18" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — text */}
          <div>
            <span className="inline-block text-[#4dc95e] text-xs font-bold uppercase tracking-[0.25em] mb-3">
              {o.label || dict.housing.label}
            </span>
            <h2
              className="text-white font-extrabold tracking-tight mb-6"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
            >
              {o.title || dict.housing.title}
            </h2>
            <p className="text-white/55 leading-relaxed mb-8 text-base">
              {o.description || dict.housing.description}
            </p>

            <ul className="space-y-4 mb-10">
              {perksText.map((text, i) => {
                const iconKey = perkIconKeys[i];
                const ResolvedIcon: LucideIcon =
                  (iconKey ? perkIconMap?.[iconKey] : undefined) ??
                  DEFAULT_PERK_ICONS[i % DEFAULT_PERK_ICONS.length];
                return (
                  <li key={i} className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-(--brand-green)/20 flex items-center justify-center shrink-0">
                      <ResolvedIcon className="w-4 h-4 text-[#4dc95e]" />
                    </div>
                    <span className="text-white/75 text-[0.92rem] font-semibold">
                      {text}
                    </span>
                  </li>
                );
              })}
            </ul>

            <a
              href="https://wa.me/31685352412"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ask about housing options via WhatsApp"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 font-bold rounded-xl text-[0.92rem] tracking-wide shadow-lg shadow-black/30"
              style={{
                background: "var(--brand-dark)",
                color: "var(--brand-btn-text)",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--brand-mid)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--brand-dark)")
              }
            >
              <Phone className="w-4 h-4" />
              {o.cta || dict.housing.cta}
            </a>
          </div>

          {/* Right — photo grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{ aspectRatio: "4/5" }}
            >
              <Image
                src={o.img1 || "/images/living_1_webP.webp"}
                alt="Driver housing — modern kitchen"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <div
              className="relative rounded-2xl overflow-hidden mt-8"
              style={{ aspectRatio: "4/5" }}
            >
              <Image
                src={o.img2 || "/images/living_2_webP.webp"}
                alt="Driver housing — bedroom"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
