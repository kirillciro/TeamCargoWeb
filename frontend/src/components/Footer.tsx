"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/lib/getDictionary";

type FooterOverrides = {
  tagline_sub?: string;
  address_line1?: string;
  address_line2?: string;
  phone?: string;
  email?: string;
  _hasTranslations?: boolean;
};

const LS_FOOTER = (lang: string) => `tc_footer_overrides_${lang}`;

const SITEMAP = (lang: string, dict: Dictionary) => [
  {
    title: dict.footer.col_company,
    links: [
      { label: dict.nav.services, href: `/${lang}#services` },
      { label: dict.nav.about, href: `/${lang}#about` },
      { label: dict.nav.contact, href: `/${lang}#contact` },
    ],
  },
  {
    title: dict.footer.col_legal,
    links: [
      { label: dict.footer.privacy, href: `/${lang}/privacy` },
      { label: dict.footer.cookies, href: `/${lang}/cookies` },
      { label: dict.footer.terms, href: `/${lang}/terms` },
    ],
  },
];

export default function Footer({
  lang,
  dict,
}: {
  lang: string;
  dict: Dictionary;
}) {
  const [overrides, setOverrides] = useState<FooterOverrides>({});

  useEffect(() => {
    const fetchOverrides = async () => {
      try {
        const cached = localStorage.getItem(LS_FOOTER(lang));
        if (cached) setOverrides(JSON.parse(cached) as FooterOverrides);
      } catch {
        /* ignore */
      }

      try {
        const res = await fetch(`/api/footer-overrides/${lang}`);
        if (res.ok) {
          const data = (await res.json()) as FooterOverrides;
          const { _hasTranslations: _, ...rest } = data;
          setOverrides((prev) =>
            JSON.stringify(prev) === JSON.stringify(rest) ? prev : rest,
          );
          localStorage.setItem(LS_FOOTER(lang), JSON.stringify(rest));
        }
      } catch {
        /* ignore */
      }
    };
    void fetchOverrides();

    const handler = () => void fetchOverrides();
    window.addEventListener("tc:footer-updated", handler);
    return () => {
      window.removeEventListener("tc:footer-updated", handler);
    };
  }, [lang]);

  const o = overrides;
  const year = new Date().getFullYear();
  const sitemap = SITEMAP(lang, dict);

  const taglineSub = o.tagline_sub || dict.footer.tagline_sub;
  const addressLine1 = o.address_line1 || "Poortland 146, 1046 BD Amsterdam";
  const addressLine2 = o.address_line2 || "Netherlands";
  const phone = o.phone || "+31 6 85352412";
  const email = o.email || "info@teamcargo.nl";
  const whatsappHref = `https://wa.me/${phone.replace(/[^0-9]/g, "")}`;

  return (
    <footer
      className="border-t border-white/5"
      style={{ backgroundColor: "var(--brand-footer-bg)" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
        {/* Top section: brand left, nav columns right */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-20 gap-12 mb-14">
          {/* Brand block */}
          <div className="lg:w-72 shrink-0 flex flex-col order-2 lg:order-1">
            <p className="text-white/80 text-sm leading-relaxed mb-6 tracking-wide">
              {taglineSub}
            </p>

            {/* Contact details */}
            <div className="flex flex-col gap-2.5 mb-6">
              {/* Address */}
              <div className="flex items-center gap-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 h-3.5 shrink-0 text-white/50"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
                <span className="text-white/65 text-xs">
                  {addressLine1}, {addressLine2}
                </span>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 h-3.5 shrink-0 text-white/50"
                >
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.7 9.81 19.79 19.79 0 01.67 1.18 2 2 0 012.65.01h3a2 2 0 012 1.72c.13 1 .37 1.97.72 2.91a2 2 0 01-.45 2.11L6.91 7.75a16 16 0 006.29 6.29l1-1a2 2 0 012.11-.45c.94.35 1.91.59 2.91.72a2 2 0 011.78 2.01z" />
                </svg>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/65 hover:text-white text-xs transition-colors"
                >
                  {phone}
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 h-3.5 shrink-0 text-white/50"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M2 7l10 7 10-7" />
                </svg>
                <a
                  href={`mailto:${email}`}
                  className="text-white/65 hover:text-white text-xs transition-colors"
                >
                  {email}
                </a>
              </div>

              {/* Divider */}
              <div className="border-t border-white/8 my-1" />

              {/* Company registration */}
              <div className="flex items-center gap-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 h-3.5 shrink-0 text-white/50"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                  <line x1="12" y1="12" x2="12" y2="16" />
                  <line x1="10" y1="14" x2="14" y2="14" />
                </svg>
                <span className="text-white/65 text-xs">
                  Team Cargo Nederland B.V.
                </span>
              </div>

              <div className="flex items-center gap-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 h-3.5 shrink-0 text-white/50"
                >
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <path d="M9 9h6M9 12h6M9 15h4" />
                </svg>
                <span className="text-white/65 text-xs">
                  <span className="text-white/40">KVK</span> 84820667 &nbsp;
                  <span className="text-white/40">Safe</span> NL05973986
                </span>
              </div>
            </div>
            <Image
              src="/logo.svg"
              alt="Team Cargo"
              width={180}
              height={60}
              className="h-14 w-auto object-contain object-left mt-auto self-start"
            />
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-2 gap-x-16 gap-y-10 lg:flex lg:gap-24 lg:items-start lg:pt-0 order-1 lg:order-2">
            {sitemap.map((col) => (
              <div key={col.title}>
                <h3 className="text-white/50 font-bold text-[10px] uppercase tracking-[0.22em] mb-4">
                  {col.title}
                </h3>
                <ul className="space-y-1">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="inline-flex items-center min-h-11 text-white/70 hover:text-white text-sm font-medium transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Left: copyright + registration */}
            <div className="flex flex-col items-center gap-1 text-center sm:items-start sm:text-left order-2 sm:order-1">
              <p className="text-white/50 text-xs">
                © {year} Team Cargo. {dict.footer.rights}
              </p>
              <p className="text-white/35 text-xs">
                Geregistreerd in Nederland
              </p>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-1 order-1 sm:order-2">
              <a
                href="https://www.facebook.com/TeamcargoBV"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Team Cargo on Facebook"
                className="w-9 h-9 flex items-center justify-center text-white/40 hover:text-white transition-colors duration-200"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/teamcargo_bv/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Team Cargo on Instagram"
                className="w-9 h-9 flex items-center justify-center text-white/40 hover:text-white transition-colors duration-200"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@team_cargo"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Team Cargo on TikTok"
                className="w-9 h-9 flex items-center justify-center text-white/40 hover:text-white transition-colors duration-200"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.43a8.16 8.16 0 004.77 1.52V7.5a4.85 4.85 0 01-1-.81z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
