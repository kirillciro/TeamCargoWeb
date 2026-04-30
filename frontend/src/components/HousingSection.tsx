import Image from "next/image";
import { Home, Wifi, Utensils, MapPin, Phone } from "lucide-react";
import type { Dictionary } from "@/lib/getDictionary";

const ICONS = [Home, Wifi, Utensils, MapPin];

export default function HousingSection({ dict }: { dict: Dictionary }) {
  return (
    <section
      id="housing"
      className="bg-[#0d2e18] py-20 sm:py-28 overflow-hidden min-h-screen flex flex-col justify-center"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — text */}
          <div>
            <span className="inline-block text-[#4dc95e] text-xs font-bold uppercase tracking-[0.25em] mb-3">
              {dict.housing.label}
            </span>
            <h2
              className="text-white font-extrabold tracking-tight mb-6"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
            >
              {dict.housing.title}
            </h2>
            <p className="text-white/55 leading-relaxed mb-8 text-base">
              {dict.housing.description}
            </p>

            <ul className="space-y-4 mb-10">
              {dict.housing.perks.map((text, i) => {
                const Icon = ICONS[i % ICONS.length];
                return (
                  <li key={i} className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-[var(--brand-green)]/20 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-[#4dc95e]" />
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
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[var(--brand-green)] hover:bg-[var(--brand-mid)] text-[var(--brand-btn-text)] font-bold rounded-xl transition-colors text-[0.92rem] tracking-wide shadow-lg shadow-black/30"
            >
              <Phone className="w-4 h-4" />
              {dict.housing.cta}
            </a>
          </div>

          {/* Right — photo grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{ aspectRatio: "4/5" }}
            >
              <Image
                src="/images/living_1_webP.webp"
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
                src="/images/living_2_webP.webp"
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
