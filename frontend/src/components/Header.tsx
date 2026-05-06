"use client";

import { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  ChevronRight,
  Phone,
  User,
  LogOut,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import type { Dictionary } from "@/lib/getDictionary";

const NAV_LINKS = (lang: string, dict: Dictionary) => [
  { label: dict.nav.services, href: `/${lang}#services` },
  { label: dict.nav.about, href: `/${lang}#about` },
  { label: dict.nav.contact, href: `/${lang}#contact` },
];

export default function Header({
  lang,
  dict,
}: {
  lang: string;
  dict: Dictionary;
}) {
  const { user, openAuth, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navLinks = NAV_LINKS(lang, dict);
  const userInitial = user
    ? (user.firstName?.[0] ?? user.email[0]).toUpperCase()
    : "";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-white/8 shadow-2xl shadow-black/40 backdrop-blur-xl"
            : "backdrop-blur-sm"
        }`}
        style={{
          backgroundColor: scrolled
            ? "color-mix(in srgb, var(--brand-header-bg) 92%, transparent)"
            : "var(--brand-header-bg)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20 sm:h-24 gap-4">
            {/* Logo */}
            <Link
              href={`/${lang}`}
              className="flex items-center shrink-0 group ml-2 mr-6 py-1"
            >
              <Image
                src="/logo.svg"
                alt="Team Cargo"
                width={180}
                height={54}
                className="h-14 sm:h-18 w-auto object-contain transition-opacity group-hover:opacity-90"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-semibold text-white/60 hover:text-white rounded-lg transition-colors duration-300 group"
                >
                  {link.label}
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] w-0 group-hover:w-[calc(100%-2rem)] bg-[var(--brand-green)] rounded-full transition-all duration-300" />
                </a>
              ))}
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              {/* Language */}
              <LanguageSwitcher currentLang={lang} />

              {/* Separator */}
              <div className="hidden md:block w-px h-5 bg-white/15 mx-1" />

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/31685352412"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-bold transition-colors duration-200"
                style={{
                  background: "var(--brand-green)",
                  color: "var(--brand-btn-text)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--brand-mid)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "var(--brand-green)")
                }
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">
                  {dict.hero.cta_whatsapp}
                </span>
              </a>

              {/* Admin Dashboard */}
              {user?.role === "admin" && (
                <Link
                  href={`/${lang}/admin`}
                  className="hidden md:inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-amber-400 hover:bg-amber-300 text-amber-950 text-sm font-bold transition-colors duration-200"
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  {dict.nav.admin_dashboard}
                </Link>
              )}

              {/* Profile & Logout */}
              {user ? (
                <div className="hidden md:flex items-center gap-1.5">
                  <Link
                    href={`/${lang}/profile`}
                    className="flex items-center gap-2 h-9 px-3 rounded-lg bg-white/8 border border-white/12 hover:bg-white/15 hover:border-white/25 text-white text-sm font-semibold transition-colors duration-200"
                  >
                    <span className="w-6 h-6 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[11px] font-bold flex items-center justify-center shrink-0">
                      {userInitial}
                    </span>
                    {dict.nav.my_profile}
                  </Link>
                  <button
                    onClick={() => void logout()}
                    title={dict.nav.logout}
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/15 transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => openAuth("login")}
                  className="hidden md:inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-white/25 text-white text-sm font-semibold hover:bg-white/10 hover:border-white/40 transition-colors duration-200"
                >
                  <User className="w-4 h-4" />
                  {dict.nav.login}
                </button>
              )}

              {/* Hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="flex md:hidden items-center justify-center w-9 h-9 rounded-lg text-white hover:bg-white/10 border border-white/10 hover:border-white/25 transition-colors duration-200"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-90 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile slide-in panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 z-100 h-full flex flex-col transition-transform duration-300 ease-in-out md:hidden border-l border-white/10`}
        style={{
          width: "min(300px, 82vw)",
          backgroundColor: "var(--brand-header-bg)",
          transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
        }}
        aria-modal="true"
        role="dialog"
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <Link href={`/${lang}`} onClick={() => setMobileOpen(false)}>
            <Image
              src="/logo.svg"
              alt="Team Cargo"
              width={130}
              height={40}
              className="h-11 w-auto object-contain"
            />
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-white hover:bg-white/10 border border-white/10 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-0.5 px-3 pt-4 flex-1 overflow-y-auto">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-4 py-3.5 rounded-xl text-white/80 hover:text-white hover:bg-white/8 font-semibold text-sm transition-colors group"
            >
              {link.label}
              <ChevronRight className="w-4 h-4 text-white/25 group-hover:text-white/50 transition-colors shrink-0" />
            </a>
          ))}

          <div className="h-px bg-white/10 my-3 mx-2" />

          {/* Language row */}
          <div className="px-4 py-2 mb-2">
            <p className="text-white/35 text-[10px] font-bold uppercase tracking-wider mb-2.5">
              {dict.nav.language}
            </p>
            <LanguageSwitcher currentLang={lang} />
          </div>

          <div className="h-px bg-white/10 my-1 mx-2" />

          {/* Auth section */}
          <div className="flex flex-col gap-2 px-1 pt-3 pb-2">
            {user?.role === "admin" && (
              <Link
                href={`/${lang}/admin`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                {dict.nav.admin_dashboard}
              </Link>
            )}

            {user ? (
              <>
                <Link
                  href={`/${lang}/profile`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-white/8 border border-white/12 hover:bg-white/14 hover:border-white/22 transition-colors"
                >
                  <span className="w-7 h-7 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold flex items-center justify-center shrink-0">
                    {userInitial}
                  </span>
                  {dict.nav.my_profile}
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    void logout();
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/60 border border-white/12 hover:bg-white/8 hover:text-white transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  {dict.nav.logout}
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  openAuth("login");
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-white bg-white/10 border border-white/20 hover:bg-white/15 transition-colors"
              >
                <User className="w-4 h-4 shrink-0" />
                {dict.nav.login}
              </button>
            )}

            {/* WhatsApp in mobile */}
            <a
              href="https://wa.me/31685352412"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors"
              style={{
                background: "var(--brand-green)",
                color: "var(--brand-btn-text)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--brand-mid)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--brand-green)")
              }
              onClick={() => setMobileOpen(false)}
            >
              <Phone className="w-4 h-4 shrink-0" />
              {dict.hero.cta_whatsapp}
            </a>
          </div>
        </nav>

        {/* Panel footer */}
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-white/25 text-xs text-center mb-3">
            Team Cargo &copy; Amsterdam
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href={`/${lang}/privacy`}
              onClick={() => setMobileOpen(false)}
              className="text-white/30 hover:text-white/60 text-[10px] transition-colors"
            >
              Privacy
            </Link>
            <span className="text-white/15 text-[10px]">&middot;</span>
            <Link
              href={`/${lang}/cookies`}
              onClick={() => setMobileOpen(false)}
              className="text-white/30 hover:text-white/60 text-[10px] transition-colors"
            >
              Cookies
            </Link>
            <span className="text-white/15 text-[10px]">&middot;</span>
            <Link
              href={`/${lang}/terms`}
              onClick={() => setMobileOpen(false)}
              className="text-white/30 hover:text-white/60 text-[10px] transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
