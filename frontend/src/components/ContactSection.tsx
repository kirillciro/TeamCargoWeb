"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Send, Phone, Mail, MapPin, Smartphone, MessageCircle, AtSign, Inbox, MailOpen, Navigation, Globe, Building, Home, Handshake, HeartHandshake, Compass, type LucideIcon } from "lucide-react";
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
  phoneIcon?: string;
  emailIcon?: string;
  addressIcon?: string;
  _hasTranslations?: boolean;
};

const CONTACT_ROW_ICON_MAP: Record<string, LucideIcon> = {
  phone: Phone,
  smartphone: Smartphone,
  "message-circle": MessageCircle,
  mail: Mail,
  "at-sign": AtSign,
  inbox: Inbox,
  "mail-open": MailOpen,
  "map-pin": MapPin,
  navigation: Navigation,
  globe: Globe,
  building: Building,
  home: Home,
  handshake: Handshake,
  "heart-handshake": HeartHandshake,
  compass: Compass,
};

const DEFAULT_ROW_ICONS: LucideIcon[] = [Phone, Mail, MapPin];

const LS_CONTACT = (lang: string) => `tc_contact_overrides_${lang}`;

export default function ContactSection({
  dict,
  lang = "nl",
}: {
  dict: Dictionary;
  lang?: string;
}) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [overrides, setOverrides] = useState<ContactOverrides>({});

  useEffect(() => {
    let pollTimer: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;
    const deadline = Date.now() + 120_000;

    const fetchOverrides = async () => {
      try {
        const cached = localStorage.getItem(LS_CONTACT(lang));
        setOverrides(cached ? (JSON.parse(cached) as ContactOverrides) : {});
      } catch { /* ignore */ }

      try {
        const res = await fetch(`/api/contact-overrides/${lang}`);
        if (res.ok) {
          const data = (await res.json()) as ContactOverrides;
          const { _hasTranslations, ...rest } = data;
          setOverrides(rest);
          localStorage.setItem(LS_CONTACT(lang), JSON.stringify(rest));
          if (!_hasTranslations && !cancelled && Date.now() < deadline) {
            pollTimer = setTimeout(() => void fetchOverrides(), 5000);
          }
        }
      } catch { /* ignore */ }
    };
    void fetchOverrides();

    const handler = () => void fetchOverrides();
    window.addEventListener("tc:contact-updated", handler);
    return () => {
      cancelled = true;
      if (pollTimer) clearTimeout(pollTimer);
      window.removeEventListener("tc:contact-updated", handler);
    };
  }, [lang]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setLoading(false);
  }

  const o = overrides;
  const whatsappNumber = o.whatsapp_number || "31685352412";
  const emailAddress = o.email_address || "info@teamcargo.nl";
  const mapAddress = o.map_address || "Poortland 146, 1046 BD Amsterdam";
  const whatsappHref = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`;
  const emailHref = `mailto:${emailAddress}`;
  const mapHref = `https://maps.google.com/?q=${encodeURIComponent(mapAddress)}`;

  return (
    <section
      id="contact"
      className="bg-gray-50 py-20 sm:py-28 min-h-screen flex flex-col justify-center"
    >
      <div className="w-[90%] mx-auto max-w-7xl lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl">
          {/* Left — image background panel */}
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
              <span className="inline-block text-[#4dc95e] text-xs font-bold uppercase tracking-[0.25em] mb-3">
                Contact
              </span>
              <h2
                className="text-white font-extrabold tracking-tight mb-4 drop-shadow-lg"
                style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}
              >
                {o.title || dict.contact.title}
              </h2>
              <p className="text-white/80 mb-10 text-base leading-relaxed drop-shadow">
                {o.subtitle || dict.contact.subtitle}
              </p>

              <div className="space-y-5">
                {[
                  {
                    Icon: (o.phoneIcon ? CONTACT_ROW_ICON_MAP[o.phoneIcon] : undefined) ?? DEFAULT_ROW_ICONS[0],
                    label: o.phone || "WhatsApp",
                    value: `+${whatsappNumber.replace(/[^0-9]/g, "").replace(/^31/, "31 ")}`,
                    href: whatsappHref,
                  },
                  {
                    Icon: (o.emailIcon ? CONTACT_ROW_ICON_MAP[o.emailIcon] : undefined) ?? DEFAULT_ROW_ICONS[1],
                    label: o.email || "E-mail",
                    value: emailAddress,
                    href: emailHref,
                  },
                  {
                    Icon: (o.addressIcon ? CONTACT_ROW_ICON_MAP[o.addressIcon] : undefined) ?? DEFAULT_ROW_ICONS[2],
                    label: o.address || "Address",
                    value: mapAddress,
                    href: mapHref,
                  },
                ].map(({ Icon, label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-[var(--brand-green)]/80 group-hover:bg-[var(--brand-green)] flex items-center justify-center shrink-0 transition-colors mt-0.5">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white/40 uppercase tracking-wider">
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
              <p className="text-white/30 text-xs font-bold uppercase tracking-widest">
                Team Cargo &copy; 2026
              </p>
            </div>
          </div>

          {/* Right — form */}
          <div className="bg-white px-8 py-12 sm:px-12 sm:py-16">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <div className="w-14 h-14 rounded-full bg-[var(--brand-green)]/10 flex items-center justify-center mb-4">
                  <Send className="w-6 h-6 text-[var(--brand-green)]" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  {o.success || dict.contact.success}
                </h3>
                <p className="text-gray-500 text-sm">
                  {o.success_subtitle || dict.contact.success_subtitle}
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => void handleSubmit(e)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    {dict.contact.name}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jan de Vries"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[0.92rem] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    {dict.contact.email}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jan@bedrijf.nl"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[0.92rem] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    {dict.contact.message}
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Uw bericht..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[0.92rem] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)] focus:border-transparent resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-[var(--brand-green)] hover:bg-[var(--brand-mid)] text-[var(--brand-btn-text)] font-bold rounded-xl transition-colors disabled:opacity-60 text-[0.92rem] tracking-widest"
                >
                  {loading ? (
                    "Verzenden..."
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {o.send || dict.contact.send}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
