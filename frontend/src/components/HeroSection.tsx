"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Phone, Mail, Shield } from "lucide-react";
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

export default function HeroSection({
  dict,
}: {
  dict: Dictionary;
  lang?: string;
}) {
  const revealRef = useRef<HTMLDivElement>(null);
  const [counting, setCounting] = useState(false);

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

  return (
    <section className="relative h-dvh flex flex-col overflow-hidden">
      {/* Background photo */}
      <div className="absolute inset-0">
        {/* Desktop image (md+) */}
        <Image
          src="/teamCargo-trans-webP/cargo-trans-horizontal-3.webp"
          alt="Team Cargo couriers — hero background"
          fill
          className="hidden md:block object-cover object-center brightness-110"
          priority
          sizes="100vw"
        />
        {/* Mobile image (< md) */}
        <Image
          src="/teamCargo-trans-webP/cargo-trans-vertical-3.webp"
          alt="Logistics workers uploading parcels"
          fill
          className="block md:hidden object-cover object-center brightness-105"
          priority
          sizes="100vw"
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
      <div className="relative z-10 flex-1 min-h-0 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-3 sm:py-4 w-full lg:w-[80%]">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-10 w-fit -mt-6">
          <span className="w-2 h-2 rounded-full bg-[#4dc95e] animate-pulse shrink-0" />
          <span className="text-white/90 text-xs font-bold uppercase tracking-[0.2em]">
            {dict.hero.badge}
          </span>
        </div>

        {/* Headline */}
        <div ref={revealRef} className="reveal">
          <h1
            className="text-white font-extrabold leading-[1.06] tracking-widest uppercase mb-5"
            style={{
              fontSize: "clamp(2.2rem, 4.5vw, 4.2rem)",
              letterSpacing: "0.04em",
            }}
          >
            {dict.hero.slogan}
          </h1>

          {/* 1 TEAM · 1 MISSION — styled */}
          <p className="flex items-center gap-1.5 mb-7 font-extrabold uppercase tracking-[0.22em] text-sm sm:text-base">
            <span className="text-white/40">1</span>
            <span className="text-[#4dc95e]">{dict.hero.mission_words[0]}</span>
            <span className="text-white/25 mx-1">&middot;</span>
            <span className="text-white/40">1</span>
            <span className="text-[#4dc95e]">{dict.hero.mission_words[1]}</span>
          </p>

          {/* CTAs */}
          <div className="flex flex-row gap-3 mb-7">
            <a
              href="https://wa.me/31685352412"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-2.5 sm:py-3.5 bg-[#36B347] hover:bg-[#079441] text-white font-bold rounded-xl transition-all shadow-lg shadow-black/30 text-sm sm:text-[0.92rem] tracking-wide"
              style={{ width: "40%" }}
            >
              <Phone className="w-4 h-4" />
              {dict.hero.cta_whatsapp}
            </a>
            <a
              href="mailto:info@teamcargo.nl"
              className="inline-flex items-center justify-center gap-2 py-2.5 sm:py-3.5 border-2 border-white/30 hover:border-white/70 hover:bg-white/10 text-white font-bold rounded-xl transition-all text-sm sm:text-[0.92rem] tracking-wide"
              style={{ width: "40%" }}
            >
              <Mail className="w-4 h-4" />
              info@teamcargo.nl
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 flex flex-wrap gap-x-10 gap-y-3 border-t border-white/10 pt-6">
          {[
            { display: `${c500}+`, label: dict.hero.stats_clients },
            { display: `${c12}+`, label: dict.hero.stats_years },
            { display: "24/7", label: dict.hero.stats_available },
            { display: `${c5}`, label: dict.hero.stats_partners },
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
              <span className="text-white/40 text-xs font-bold uppercase tracking-[0.18em] mt-1">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Trust line bar */}
      <div className="relative z-10 flex items-center justify-center gap-2.5 bg-[#0d3d1e] px-4 py-3 shrink-0">
        <Shield className="w-5 h-5 text-[#4dc95e] shrink-0" />
        <p className="text-white/90 text-sm leading-relaxed tracking-wide text-center">
          {dict.hero.trust_line}
        </p>
      </div>

      {/* Partner strip — pure white background, logos fully visible and big */}
      <div className="relative z-10 bg-white border-t border-gray-100 shrink-0">
        <p className="text-center text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] pt-4 pb-3">
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
            {PARTNERS_LOOP.map((partner, i) => (
              <div
                key={i}
                className="flex items-center justify-center mx-5 sm:mx-9 shrink-0 h-8 sm:h-14 w-24 sm:w-40"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={140}
                  height={50}
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
