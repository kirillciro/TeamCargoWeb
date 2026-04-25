import Image from "next/image";
import {
  Truck,
  FileText,
  Home,
  Clock,
  Handshake,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import type { Dictionary } from "@/lib/getDictionary";

const IMGS = [
  "/images/gls_vans_webP.webp",
  "/images/fedex_courier_2_webP.webp",
  "/images/dpd_courier_2_webP.webp",
  "/images/dpd_courier_webP.webp",
  "/images/fedex_courier_webP.webp",
  "/images/gls_courier_webP.webp",
];

// Per-card image position — override specific cards as needed
const IMG_POSITIONS: string[] = [
  "object-center", // Driver Job Placement
  "object-center", // Documents Support
  "object-center", // Accommodation
  "object-center", // Ongoing Support
  "object-center", // Reliable Opportunities
  "object-center", // Amsterdam Region
];

const ICONS: LucideIcon[] = [Truck, FileText, Home, Clock, Handshake, MapPin];

export default function ServicesSection({ dict }: { dict: Dictionary }) {
  return (
    <section
      id="services"
      className="bg-gray-50 bg-pattern py-12 sm:py-16 lg:h-screen lg:flex lg:flex-col lg:overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col flex-1 w-full min-h-0">
        {/* Header */}
        <div className="text-center mb-8 shrink-0">
          <span className="text-[#36B347] text-xs font-bold uppercase tracking-[0.25em]">
            {dict.services.what_we_do}
          </span>
          <h2
            className="text-gray-900 font-extrabold tracking-tight mt-2"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
          >
            {dict.services.title}
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[#36B347]" />
        </div>

        {/* 6-card grid — fixed height cards on mobile, fills viewport on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 lg:flex-1 lg:min-h-0 pb-8 lg:pb-12">
          {dict.services.items.map((svc, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div
                key={svc.title}
                className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-default"
                style={{ minHeight: "220px" }}
              >
                {/* Background photo */}
                <Image
                  src={IMGS[i % IMGS.length]}
                  alt={svc.title}
                  fill
                  className={`object-cover ${IMG_POSITIONS[i % IMG_POSITIONS.length]} group-hover:scale-105 transition-transform duration-700`}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
