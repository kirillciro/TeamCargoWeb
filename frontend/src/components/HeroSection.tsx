"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Phone, Mail, Shield, type LucideIcon } from "lucide-react";
import type { Dictionary } from "@/lib/getDictionary";

function useCountUp(target: number, duration = 5000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

const PARTNERS = [
  { name: "Amazon", logo: "/partners/amazon_logo.svg" },
  { name: "FedEx", logo: "/partners/fedex_logo.svg" },
  { name: "DPD", logo: "/partners/dpd_logo.svg" },
  { name: "GLS", logo: "/partners/gls_logo.svg" },
  { name: "Transmission", logo: "/partners/transmission_logo.svg" },
];

const PARTNERS_LOOP = [...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS];

type HeroOverrides = {
  slogan?: string;
  badge?: string;
  trustLine?: string;
  trustIcon?: string;
  trustBg?: string;
  partnersBg?: string;
  heroImgDesktop?: string;
  heroImgMobile?: string;
  partners?: { name: string; logo: string }[];
  stat1Value?: string;
  stat1Label?: string;
  stat2Value?: string;
  stat2Label?: string;
  stat3Value?: string;
  stat3Label?: string;
  stat4Value?: string;
  stat4Label?: string;
};

export default function HeroSection({
  dict,
  lang = "nl",
}: {
  dict: Dictionary;
  lang?: string;
}) {
  const revealRef = useRef<HTMLDivElement>(null);
  const [counting, setCounting] = useState(false);
  const [overrides, setOverrides] = useState<HeroOverrides>({});
  const [heroHeight, setHeroHeight] = useState<number | null>(null);

  useEffect(() => {
    // Lock to initial innerHeight (address bar visible) — prevents iOS scroll zoom
    setHeroHeight(window.innerHeight);
  }, []);

  // Derive the active partner list — override list when set, else hardcoded defaults
  const activePartners = overrides.partners?.length
    ? overrides.partners
    : PARTNERS;
  const partnersLoop = [
    ...activePartners,
    ...activePartners,
    ...activePartners,
    ...activePartners,
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/hero-overrides/${lang}`);
        if (res.ok) {
          const data = (await res.json()) as HeroOverrides;
          setOverrides((prev) =>
            JSON.stringify(prev) === JSON.stringify(data) ? prev : data,
          );
        }
      } catch {
        /* ignore */
      }
    };
    void load();
    // Re-fetch when admin saves new overrides (same tab/window)
    const onUpdate = () => void load();
    window.addEventListener("tc:hero-updated", onUpdate);
    return () => window.removeEventListener("tc:hero-updated", onUpdate);
  }, [lang]);

  useEffect(() => {
    const el = revealRef.current;
    if (!el) return;
    const timer = setTimeout(() => {
      el.classList.add("visible");
      setCounting(true);
    }, 80);
    return () => clearTimeout(timer);
  }, []);

  const c500 = useCountUp(500, 5000, counting);
  const c12 = useCountUp(7, 5000, counting);
  const c5 = useCountUp(5, 5000, counting);

  const [trustIconMap, setTrustIconMap] = useState<Record<
    string,
    LucideIcon
  > | null>(null);
  useEffect(() => {
    if (overrides.trustIcon && !trustIconMap) {
      void import("@/components/TrustIconMap").then((m) =>
        setTrustIconMap(m.TRUST_ICON_MAP),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overrides.trustIcon]);

  const TrustIcon: LucideIcon =
    (overrides.trustIcon && trustIconMap?.[overrides.trustIcon]) || Shield;

  return (
    <section
      className="relative flex flex-col overflow-hidden lg:h-[calc(100dvh/0.75)]"
      style={heroHeight ? { height: heroHeight } : { height: '100svh' }}
    >
      {/* Background photo */}
      <div className="absolute inset-0">
        {/* Desktop image (md+) */}
        <Image
          src={
            overrides.heroImgDesktop ||
            "/teamCargo-trans-webP/cargo-trans-horizontal-3.webp"
          }
          alt="Team Cargo couriers — hero background"
          fill
          className="hidden md:block object-cover object-center brightness-110"
          priority
          quality={60}
          sizes="(max-width: 767px) 0vw, 100vw"
        />
        {/* Mobile image (< md) */}
        <Image
          src={
            overrides.heroImgMobile ||
            "/teamCargo-trans-webP/cargo-trans-vertical-3.webp"
          }
          alt="Logistics workers uploading parcels"
          fill
          className="block md:hidden object-cover object-center brightness-105"
          priority
          quality={75}
          sizes="(max-width: 767px) 100vw, 0vw"
        />
        {/* Left-to-right gradient: solid left → steps down 40→30→20→10 after 50% */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(8,12,18,0.92) 0%, rgba(8,12,18,0.90) 28%, rgba(8,12,18,0.55) 48%, rgba(8,12,18,0.25) 64%, rgba(8,12,18,0.10) 78%, rgba(8,12,18,0.00) 100%)",
          }}
        />
      </div>

      {/* Spacer — exact height of the fixed header so content never hides behind it */}
      <div className="shrink-0 h-16 sm:h-20" />

      {/* Main content */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-2 sm:py-4 w-full lg:w-[80%]">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-4 sm:mb-6 w-fit">
          <span className="w-2 h-2 rounded-full bg-[#4dc95e] animate-pulse shrink-0" />
          <span className="text-white/90 text-xs font-bold uppercase tracking-[0.2em]">
            {overrides.badge || dict.hero.badge}
          </span>
        </div>

        {/* Headline */}
        <div ref={revealRef} className="reveal">
          <h1
            className="text-white font-extrabold leading-[1.06] tracking-widest uppercase mb-3 sm:mb-5"
            style={{
              fontSize: "clamp(1.75rem, 4.5vw, 4.2rem)",
              letterSpacing: "0.04em",
            }}
          >
            {overrides.slogan || dict.hero.slogan}
          </h1>

          {/* 1 TEAM · 1 MISSION — styled */}
          <p className="flex items-center gap-1.5 mb-4 sm:mb-7 font-extrabold uppercase tracking-[0.22em] text-sm sm:text-base">
            <span className="text-white/60">1</span>
            <span className="text-[#4dc95e]">{dict.hero.mission_words[0]}</span>
            <span className="text-white/40 mx-1">&middot;</span>
            <span className="text-white/60">1</span>
            <span className="text-[#4dc95e]">{dict.hero.mission_words[1]}</span>
          </p>

          {/* CTAs */}
          <div className="flex flex-row gap-3 mb-4 sm:mb-7">
            <a
              href="https://wa.me/31685352412"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={dict.hero.cta_whatsapp}
              className="inline-flex items-center justify-center gap-2 py-3 sm:py-3.5 font-bold rounded-xl shadow-lg shadow-black/30 text-sm sm:text-[0.92rem] tracking-wide flex-1"
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
              {dict.hero.cta_whatsapp}
            </a>
            <a
              href="mailto:info@teamcargo.nl"
              className="inline-flex items-center justify-center gap-2 py-3 sm:py-3.5 border-2 border-white/30 hover:border-white/70 hover:bg-white/10 text-white font-bold rounded-xl transition-all text-sm sm:text-[0.92rem] tracking-wide flex-1"
            >
              <Mail className="w-4 h-4" />
              info@teamcargo.nl
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 sm:mt-8 mb-3 sm:mb-0 flex flex-wrap gap-x-8 gap-y-2 sm:gap-x-10 sm:gap-y-3 border-t border-white/10 pt-4 sm:pt-6">
          {[
            {
              display: overrides.stat1Value || `${c500}+`,
              label: overrides.stat1Label || dict.hero.stats_clients,
            },
            {
              display: overrides.stat2Value || `${c12}+`,
              label: overrides.stat2Label || dict.hero.stats_years,
            },
            {
              display: overrides.stat3Value || "24/7",
              label: overrides.stat3Label || dict.hero.stats_available,
            },
            {
              display: overrides.stat4Value || `${c5}`,
              label: overrides.stat4Label || dict.hero.stats_partners,
            },
          ].map((s) => (
            <div key={s.label} className="flex flex-col">
              <span
                className="text-white font-extrabold leading-none"
                style={{
                  fontSize: "clamp(1.6rem, 2.4vw, 2.4rem)",
                }}
              >
                {s.display}
              </span>
              <span className="text-white/60 text-xs font-bold uppercase tracking-[0.18em] mt-1">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Trust line bar */}
      <div
        className="relative z-10 flex items-center justify-center gap-2.5 px-4 py-3 shrink-0"
        style={{
          backgroundColor: overrides.trustBg ?? "var(--brand-trust-bg)",
        }}
      >
        <TrustIcon className="w-5 h-5 text-[#4dc95e] shrink-0" />
        <p className="text-white/90 text-sm leading-relaxed tracking-wide text-center">
          {overrides.trustLine || dict.hero.trust_line}
        </p>
      </div>

      {/* Partner strip — configurable background */}
      <div
        className="relative z-10 border-t border-gray-100 shrink-0"
        style={{
          backgroundColor: overrides.partnersBg ?? "var(--brand-partner-bg)",
        }}
      >
        <p className="text-center text-gray-600 text-[10px] font-bold uppercase tracking-[0.3em] pt-4 pb-3">
          {dict.hero.partners_label}
        </p>
        <div
          className="relative overflow-hidden pb-4"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          }}
        >
          <div className="marquee-track">
            {partnersLoop.map((partner, i) => (
              <div
                key={i}
                className="flex items-center justify-center mx-5 sm:mx-9 shrink-0 h-8 sm:h-14 w-24 sm:w-40"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={140}
                  height={50}
                  loading="lazy"
                  quality={60}
                  sizes="(max-width: 640px) 96px, 160px"
                  className="h-6 sm:h-10 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
