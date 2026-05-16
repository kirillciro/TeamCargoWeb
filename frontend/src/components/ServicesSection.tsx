"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Truck,
  FileText,
  Clock,
  Handshake,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import type { Dictionary } from "@/lib/getDictionary";

const lsServices = (lang: string) => `tc_services_overrides_${lang}`;

const DEFAULT_IMGS = [
  "/images/gls_vans_webP.webp",
  "/images/fedex_courier_2_webP.webp",
  "/images/dpd_courier_2_webP.webp",
  "/images/dpd_courier_webP.webp",
  "/images/fedex_courier_webP.webp",
  "/images/gls_courier_webP.webp",
];

const ICONS: LucideIcon[] = [Truck, FileText, Clock, Handshake, MapPin];

type ServicesOverrides = {
  title?: string;
  label?: string;
  item0Title?: string;
  item0Desc?: string;
  item1Title?: string;
  item1Desc?: string;
  item2Title?: string;
  item2Desc?: string;
  item3Title?: string;
  item3Desc?: string;
  item4Title?: string;
  item4Desc?: string;
  img0?: string;
  img1?: string;
  img2?: string;
  img3?: string;
  img4?: string;
};

export default function ServicesSection({
  dict,
  lang = "nl",
}: {
  dict: Dictionary;
  lang?: string;
}) {
  const [overrides, setOverrides] = useState<ServicesOverrides>({});

  useEffect(() => {
    const fetchOverrides = async () => {
      // Instant paint from lang-scoped cache (avoids cross-language bleed)
      try {
        const cached = localStorage.getItem(lsServices(lang));
        if (cached) setOverrides(JSON.parse(cached) as ServicesOverrides);
      } catch {
        /* ignore */
      }

      try {
        const res = await fetch(`/api/services-overrides/${lang}`);
        if (res.ok) {
          const data = (await res.json()) as ServicesOverrides & {
            _hasTranslations?: boolean;
          };
          const { _hasTranslations: _, ...rest } = data;
          setOverrides((prev) =>
            JSON.stringify(prev) === JSON.stringify(rest as ServicesOverrides)
              ? prev
              : (rest as ServicesOverrides),
          );
          localStorage.setItem(lsServices(lang), JSON.stringify(rest));
        }
      } catch {
        /* ignore */
      }
    };
    void fetchOverrides();

    const handler = () => void fetchOverrides();
    window.addEventListener("tc:services-updated", handler);
    return () => {
      window.removeEventListener("tc:services-updated", handler);
    };
  }, [lang]);

  const o = overrides as Record<string, string>;

  const effectiveTitle = overrides.title || dict.services.title;
  const effectiveLabel = overrides.label || dict.services.what_we_do;
  const effectiveItems = dict.services.items.map((item, i) => ({
    title: o[`item${i}Title`] || item.title,
    desc: o[`item${i}Desc`] || item.desc,
    img: o[`img${i}`] || DEFAULT_IMGS[i % DEFAULT_IMGS.length],
  }));

  return (
    <section
      id="services"
      className="bg-gray-50 bg-pattern py-12 sm:py-16 lg:h-screen lg:flex lg:flex-col lg:overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col flex-1 w-full min-h-0">
        {/* Header */}
        <div className="text-center mb-8 shrink-0">
          <span className="text-(--brand-green-text) text-xs font-bold uppercase tracking-[0.25em]">
            {effectiveLabel}
          </span>
          <h2
            className="text-gray-900 font-extrabold tracking-tight mt-2"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
          >
            {effectiveTitle}
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[#36B347]" />
        </div>

        {/* 5-card grid: 3 top + 2 bottom centered */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-5 lg:flex-1 lg:min-h-0 pb-8 lg:pb-12">
          {effectiveItems.map((svc, i) => {
            const Icon = ICONS[i % ICONS.length];
            const isBottom = i >= 3;
            const isLastMobile = i === 4;
            return (
              <div
                key={i}
                className={`group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-default${
                  isBottom ? " lg:col-span-3" : " lg:col-span-2"
                }${isLastMobile ? " sm:col-span-2" : ""}`}
                style={{ minHeight: "220px" }}
              >
                {/* Background photo */}
                <Image
                  src={svc.img}
                  alt={svc.title}
                  fill
                  loading="lazy"
                  quality={60}
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  unoptimized={svc.img.startsWith("http")}
                />
                {/* Dark gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(8,12,18,0.92) 0%, rgba(8,12,18,0.60) 50%, rgba(8,12,18,0.25) 100%)",
                  }}
                />
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
                  <div className="w-11 h-11 rounded-xl bg-[#36B347]/80 group-hover:bg-[#36B347] flex items-center justify-center mb-3 shadow-lg transition-colors duration-300">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-white font-extrabold text-lg mb-1.5 leading-tight drop-shadow">
                    {svc.title}
                  </h3>
                  <p className="text-white/70 text-[0.9rem] leading-relaxed tracking-wide">
                    {svc.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
