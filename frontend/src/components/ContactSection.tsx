"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Phone, Mail, MapPin, type LucideIcon } from "lucide-react";
import type { Dictionary } from "@/lib/getDictionary";

type ContactOverrides = {
  title?: string;
  subtitle?: string;
  phone?: string;
  email?: string;
  address?: string;
  send?: string;
  success?: string;
  success_subtitle?: string;
  img?: string;
  whatsapp_number?: string;
  email_address?: string;
  map_address?: string;
  map_pin?: string;
  phoneIcon?: string;
  emailIcon?: string;
  addressIcon?: string;
  _hasTranslations?: boolean;
};

const LS_CONTACT = (lang: string) => `tc_contact_overrides_${lang}`;

export default function ContactSection({
  dict,
  lang = "nl",
}: {
  dict: Dictionary;
  lang?: string;
}) {
  const [overrides, setOverrides] = useState<ContactOverrides>({});
  // mapSrc is locked in after the first successful load so the iframe never
  // reloads mid-animation due to overrides arriving late.
  const [mapSrc, setMapSrc] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverrides = async () => {
      try {
        const cached = localStorage.getItem(LS_CONTACT(lang));
        if (cached) setOverrides(JSON.parse(cached) as ContactOverrides);
      } catch {
        /* ignore */
      }

      try {
        const res = await fetch(`/api/contact-overrides/${lang}`);
        if (res.ok) {
          const data = (await res.json()) as ContactOverrides;
          const { _hasTranslations: _, ...rest } = data;
          setOverrides((prev) =>
            JSON.stringify(prev) === JSON.stringify(rest) ? prev : rest,
          );
          const q =
            rest.map_pin ||
            rest.map_address ||
            "Poortland 146, 1046 BD Amsterdam";
          setMapSrc(
            `https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed&z=15`,
          );
          localStorage.setItem(LS_CONTACT(lang), JSON.stringify(rest));
        }
      } catch {
        /* ignore */
      }
    };
    void fetchOverrides();

    const handler = () => void fetchOverrides();
    window.addEventListener("tc:contact-updated", handler);
    return () => {
      window.removeEventListener("tc:contact-updated", handler);
    };
  }, [lang]);

  const o = overrides;

  const [contactIconMap, setContactIconMap] = useState<Record<
    string,
    LucideIcon
  > | null>(null);
  useEffect(() => {
    if ((o.phoneIcon || o.emailIcon || o.addressIcon) && !contactIconMap) {
      void import("@/components/ContactIconMap").then((m) =>
        setContactIconMap(m.CONTACT_ROW_ICON_MAP),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [o.phoneIcon, o.emailIcon, o.addressIcon]);

  const whatsappNumber = o.whatsapp_number || "393497080551";
  const emailAddress = o.email_address || "info@teamcargo.nl";
  const mapAddress = o.map_address || "Poortland 146, 1046 BD Amsterdam";
  const whatsappHref = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`;
  const emailHref = `mailto:${emailAddress}`;
  const mapHref = `https://maps.google.com/?q=${encodeURIComponent(mapAddress)}`;

  const contactRows = [
    {
      Icon: (o.phoneIcon ? contactIconMap?.[o.phoneIcon] : undefined) ?? Phone,
      label: o.phone || "WhatsApp",
      value: `+${whatsappNumber.replace(/[^0-9]/g, "").replace(/^31/, "31 ")}`,
      href: whatsappHref,
    },
    {
      Icon: (o.emailIcon ? contactIconMap?.[o.emailIcon] : undefined) ?? Mail,
      label: o.email || "E-mail",
      value: emailAddress,
      href: emailHref,
    },
    {
      Icon:
        (o.addressIcon ? contactIconMap?.[o.addressIcon] : undefined) ?? MapPin,
      label: o.address || "Adres",
      value: mapAddress,
      href: mapHref,
    },
  ];

  return (
    <section
      id="contact"
      className="bg-gray-50 py-20 sm:py-28 min-h-screen flex flex-col justify-center"
    >
      <div className="w-[90%] mx-auto max-w-7xl lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl">
          {/* ── Left — image panel, scroll-animated ── */}
          <div className="relative px-8 py-12 sm:px-12 sm:py-16 flex flex-col justify-between overflow-hidden">
            <Image
              src={o.img || "/images/office_webP.webp"}
              alt="Team Cargo office"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, rgba(2,20,10,0.95) 0%, rgba(2,20,10,0.90) 17%, rgba(2,20,10,0.80) 33%, rgba(2,20,10,0.70) 50%, rgba(2,20,10,0.10) 100%)",
              }}
            />

            <div className="relative z-10">
              <div>
                <span className="inline-block text-[#4dc95e] text-xs font-bold uppercase tracking-[0.25em] mb-3">
                  Contact
                </span>
                <h2
                  className="text-white font-extrabold tracking-tight mb-4 drop-shadow-lg"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}
                >
                  {o.title || dict.contact.title}
                </h2>
              </div>

              <p className="text-white/80 mb-10 text-base leading-relaxed drop-shadow">
                {o.subtitle || dict.contact.subtitle}
              </p>

              <div className="space-y-5">
                {contactRows.map(({ Icon, label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 group"
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        background: "var(--brand-dark)",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "var(--brand-mid)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "var(--brand-dark)")
                      }
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white/55 uppercase tracking-wider">
                        {label}
                      </p>
                      <p className="text-white group-hover:text-[#4dc95e] font-semibold text-[0.92rem] transition-colors">
                        {value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="relative z-10 mt-12 pt-8 border-t border-white/10">
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest">
                Team Cargo &copy; 2026
              </p>
            </div>
          </div>

          {/* ── Right — Google Maps embed ── */}
          <div className="relative min-h-100 lg:min-h-0">
            {mapSrc ? (
              <iframe
                key={mapSrc}
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0, display: "block", minHeight: "400px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Team Cargo locatie"
                className="absolute inset-0 w-full h-full"
              />
            ) : (
              /* Skeleton shown while the API resolves — no iframe until we know the real address */
              <div className="absolute inset-0 w-full h-full bg-gray-100 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-gray-300 animate-pulse" />
              </div>
            )}
            {/* "Open in Maps" overlay button */}
            <a
              href={mapHref}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/90 hover:bg-white text-gray-800 text-xs font-bold px-3 py-2 rounded-xl shadow-md backdrop-blur-sm transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-[#EA4335]" />
              Open in Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
