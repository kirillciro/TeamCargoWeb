"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Home,
  Wifi,
  Utensils,
  MapPin,
  Phone,
  BedDouble,
  Coffee,
  Bath,
  DoorOpen,
  Armchair,
  Sofa,
  Sun,
  Key,
  Lamp,
  Lightbulb,
  Refrigerator,
  WashingMachine,
  CookingPot,
  Wind,
  Tv,
  Bed,
  Warehouse,
  Building,
  Building2,
  Truck,
  Car,
  Bus,
  Bike,
  Route,
  Shield,
  ShieldCheck,
  Star,
  Award,
  Sparkles,
  Heart,
  Users,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import type { Dictionary } from "@/lib/getDictionary";

const PERK_ICON_MAP: Record<string, LucideIcon> = {
  home: Home,
  wifi: Wifi,
  utensils: Utensils,
  "map-pin": MapPin,
  "bed-double": BedDouble,
  coffee: Coffee,
  bath: Bath,
  "door-open": DoorOpen,
  armchair: Armchair,
  sofa: Sofa,
  sun: Sun,
  key: Key,
  lamp: Lamp,
  lightbulb: Lightbulb,
  refrigerator: Refrigerator,
  "washing-machine": WashingMachine,
  "cooking-pot": CookingPot,
  wind: Wind,
  tv: Tv,
  bed: Bed,
  warehouse: Warehouse,
  building: Building,
  "building-2": Building2,
  truck: Truck,
  car: Car,
  bus: Bus,
  bike: Bike,
  route: Route,
  shield: Shield,
  "shield-check": ShieldCheck,
  star: Star,
  award: Award,
  sparkles: Sparkles,
  heart: Heart,
  users: Users,
  "check-circle-2": CheckCircle2,
};

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

  useEffect(() => {
    let pollTimer: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;
    const deadline = Date.now() + 120_000;

    const fetchOverrides = async () => {
      try {
        const cached = localStorage.getItem(LS_HOUSING(lang));
        setOverrides(cached ? (JSON.parse(cached) as HousingOverrides) : {});
      } catch {
        /* ignore */
      }

      try {
        const res = await fetch(`/api/housing-overrides/${lang}`);
        if (res.ok) {
          const data = (await res.json()) as HousingOverrides;
          const { _hasTranslations, ...rest } = data;
          setOverrides(rest);
          localStorage.setItem(LS_HOUSING(lang), JSON.stringify(rest));
          if (!_hasTranslations && !cancelled && Date.now() < deadline) {
            pollTimer = setTimeout(() => void fetchOverrides(), 5000);
          }
        }
      } catch {
        /* ignore */
      }
    };
    void fetchOverrides();

    const handler = () => void fetchOverrides();
    window.addEventListener("tc:housing-updated", handler);
    return () => {
      cancelled = true;
      if (pollTimer) clearTimeout(pollTimer);
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
                  (iconKey ? PERK_ICON_MAP[iconKey] : undefined) ??
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
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-brand-green hover:bg-brand-mid text-brand-btn-text font-bold rounded-xl transition-colors text-[0.92rem] tracking-wide shadow-lg shadow-black/30"
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
