"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CheckCircle2, Users, MapPin, type LucideIcon } from "lucide-react";
import type { Dictionary } from "@/lib/getDictionary";

const lsAbout = (lang: string) => `tc_about_overrides_${lang}`;

const DEFAULT_IMGS = {
  imgLeft: "/teamCargo-trans-webP/TeamCargoGeletEdited.webp",
  imgTopRight: "/images/amazon_courier_webP.webp",
  imgBottomRight: "/images/cargoTeam_webP.webp",
};

type AboutOverrides = {
  label?: string;
  title?: string;
  description?: string;
  description2?: string;
  valuesTitle?: string;
  value0?: string;
  value1?: string;
  value2?: string;
  value3?: string;
  driversPlaced?: string;
  yearsActive?: string;
  location?: string;
  yearsActiveNum?: string;
  driversIcon?: string;
  locationIcon?: string;
  imgLeft?: string;
  imgTopRight?: string;
  imgBottomRight?: string;
};

export default function AboutSection({
  dict,
  lang = "nl",
}: {
  dict: Dictionary;
  lang?: string;
}) {
  const [overrides, setOverrides] = useState<AboutOverrides>({});

  useEffect(() => {
    const fetchOverrides = async () => {
      // Instant paint from lang-scoped cache (avoids cross-language bleed)
      try {
        const cached = localStorage.getItem(lsAbout(lang));
        if (cached) setOverrides(JSON.parse(cached) as AboutOverrides);
      } catch {
        /* ignore */
      }

      // Then fetch fresh data from API
      try {
        const res = await fetch(`/api/about-overrides/${lang}`);
        if (res.ok) {
          const data = (await res.json()) as AboutOverrides & {
            _hasTranslations?: boolean;
          };
          const { _hasTranslations, ...rest } = data;
          setOverrides((prev) =>
            JSON.stringify(prev) === JSON.stringify(rest) ? prev : rest,
          );
          localStorage.setItem(lsAbout(lang), JSON.stringify(rest));
        }
      } catch {
        /* ignore */
      }
    };
    void fetchOverrides();

    const handler = () => void fetchOverrides();
    window.addEventListener("tc:about-updated", handler);
    return () => {
      window.removeEventListener("tc:about-updated", handler);
    };
  }, [lang]);

  const o = overrides;

  const [badgeIconMap, setBadgeIconMap] = useState<Record<
    string,
    LucideIcon
  > | null>(null);
  useEffect(() => {
    if ((o.driversIcon || o.locationIcon) && !badgeIconMap) {
      void import("@/components/AboutIconMap").then((m) =>
        setBadgeIconMap(m.BADGE_ICON_MAP),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [o.driversIcon, o.locationIcon]);

  const effectiveLabel = o.label || dict.about.label;
  const effectiveTitle = o.title || dict.about.title;
  const effectiveDesc = o.description || dict.about.description;
  const effectiveDesc2 = o.description2 || dict.about.description2;
  const effectiveValuesTitle = o.valuesTitle || dict.about.values_title;
  const effectiveValues = [
    o.value0 || dict.about.values[0],
    o.value1 || dict.about.values[1],
    o.value2 || dict.about.values[2],
    o.value3 || dict.about.values[3],
  ].filter(Boolean) as string[];
  const effectiveDrivers = o.driversPlaced || dict.about.drivers_placed;
  const effectiveYears = o.yearsActive || dict.about.years_active;
  const effectiveYearsNum = o.yearsActiveNum || "7+";
  const effectiveLocation = o.location || dict.about.location;
  const DriversIconComp: LucideIcon =
    o.driversIcon && badgeIconMap?.[o.driversIcon]
      ? badgeIconMap[o.driversIcon]
      : Users;
  const LocationIconComp: LucideIcon =
    o.locationIcon && badgeIconMap?.[o.locationIcon]
      ? badgeIconMap[o.locationIcon]
      : MapPin;
  const imgLeft = o.imgLeft || DEFAULT_IMGS.imgLeft;
  const imgTopRight = o.imgTopRight || DEFAULT_IMGS.imgTopRight;
  const imgBottomRight = o.imgBottomRight || DEFAULT_IMGS.imgBottomRight;

  return (
    <section
      id="about"
      className="bg-white bg-pattern py-14 sm:py-20 lg:py-28 overflow-hidden lg:min-h-screen lg:flex lg:flex-col lg:justify-center"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-(--brand-green-text) text-xs font-bold uppercase tracking-[0.25em]">
            {effectiveLabel}
          </span>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-[#36B347]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Text — left */}
          <div className="mt-8 lg:mt-0">
            <h2
              className="text-gray-900 font-extrabold tracking-tight mb-5"
              style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)" }}
            >
              {effectiveTitle}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4 text-base">
              {effectiveDesc}
            </p>
            <p className="text-gray-600 leading-relaxed mb-7 text-base">
              {effectiveDesc2}
            </p>

            <h3 className="font-bold text-[#1a7f45] mb-3 text-xs uppercase tracking-widest">
              {effectiveValuesTitle}
            </h3>
            <ul className="grid grid-cols-2 gap-2.5 mb-7">
              {effectiveValues.map((val) => (
                <li key={val} className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-(--brand-green-text) shrink-0" />
                  <span className="text-gray-700 text-[0.92rem] font-semibold">
                    {val}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3">
              <div
                className="flex items-center gap-2.5 rounded-xl px-4 py-3 border border-[#36B347]/25"
                style={{
                  background:
                    "linear-gradient(135deg, #e8f8ec 0%, #d0f0d8 100%)",
                }}
              >
                <div
                  className="flex items-center justify-center w-7 h-7 rounded-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, #36B347 0%, #1a7f45 100%)",
                  }}
                >
                  <DriversIconComp className="w-4 h-4 text-white" />
                </div>
                <span className="text-[0.92rem] font-bold text-[#1a7f45]">
                  {effectiveDrivers}
                </span>
              </div>
              <div
                className="flex items-center gap-2.5 rounded-xl px-4 py-3 border border-[#36B347]/25"
                style={{
                  background:
                    "linear-gradient(135deg, #e8f8ec 0%, #d0f0d8 100%)",
                }}
              >
                <div
                  className="flex items-center justify-center w-7 h-7 rounded-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, #36B347 0%, #1a7f45 100%)",
                  }}
                >
                  <LocationIconComp className="w-4 h-4 text-white" />
                </div>
                <span className="text-[0.92rem] font-bold text-[#1a7f45]">
                  {effectiveLocation}
                </span>
              </div>
            </div>
          </div>

          {/* Right — 3-image mosaic */}
          <div className="relative mt-2 lg:mt-0">
            {/* Mobile + tablet: portrait left, two landscape stacked right */}
            <div className="grid grid-cols-[2fr_3fr] gap-2 h-72 sm:h-96 lg:hidden">
              {/* Left — portrait 4:5 */}
              <div className="relative rounded-xl overflow-hidden shadow-xl">
                <Image
                  src={imgLeft}
                  alt="Team Cargo driver in hi-vis vest"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 28vw"
                  loading="lazy"
                  unoptimized={imgLeft.startsWith("http")}
                />
              </div>
              {/* Right — two landscape images stacked */}
              <div className="flex flex-col gap-2">
                <div className="relative flex-1 rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={imgTopRight}
                    alt="Amazon driver with package"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 42vw"
                    loading="lazy"
                    unoptimized={imgTopRight.startsWith("http")}
                  />
                </div>
                <div className="relative flex-1 rounded-xl overflow-hidden shadow-lg ring-2 ring-white">
                  <Image
                    src={imgBottomRight}
                    alt="Team Cargo team"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 42vw"
                    loading="lazy"
                    unoptimized={imgBottomRight.startsWith("http")}
                  />
                </div>
              </div>
            </div>

            {/* Desktop: two-column mosaic */}
            <div className="hidden lg:grid grid-cols-[5fr_7fr] gap-3 h-130">
              {/* Left column — portrait, full height */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={imgLeft}
                  alt="Team Cargo driver in hi-vis vest"
                  fill
                  className="object-cover object-center"
                  sizes="20vw"
                  loading="lazy"
                  unoptimized={imgLeft.startsWith("http")}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
              </div>

              {/* Right column — two images stacked */}
              <div className="flex flex-col gap-3">
                <div className="relative flex-1 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={imgTopRight}
                    alt="Amazon driver with package"
                    fill
                    className="object-cover object-center"
                    sizes="26vw"
                    unoptimized={imgTopRight.startsWith("http")}
                  />
                </div>
                <div className="relative flex-1 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white">
                  <Image
                    src={imgBottomRight}
                    alt="Team Cargo team"
                    fill
                    className="object-cover object-center"
                    sizes="26vw"
                    unoptimized={imgBottomRight.startsWith("http")}
                  />
                </div>
              </div>
            </div>

            {/* Floating badge — desktop only */}
            <div className="hidden lg:block absolute bottom-4 left-5 bg-[#1a7f45] text-white rounded-2xl px-5 py-4 shadow-2xl z-10">
              <p className="font-extrabold text-2xl leading-none">
                {effectiveYearsNum}
              </p>
              <p className="text-white text-xs uppercase tracking-wider font-bold mt-1">
                {effectiveYears}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
