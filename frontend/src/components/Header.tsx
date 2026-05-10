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
  forceOpaque = false,
}: {
  lang: string;
  dict: Dictionary;
  forceOpaque?: boolean;
}) {
  const { user, openAuth, logout } = useAuth();
  const [scrollRatio, setScrollRatio] = useState(forceOpaque ? 1 : 0);
  const [isWin98, setIsWin98] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [headerTransparent, setHeaderTransparent] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkWin98 = () =>
      setIsWin98(!!document.querySelector('[data-win98="1"]'));
    checkWin98();
    const obs = new MutationObserver(checkWin98);
    obs.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ["data-win98"],
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const readHeaderSetting = () => {
      try {
        const saved = localStorage.getItem("tc_header_settings");
        if (saved) {
          const parsed = JSON.parse(saved) as { transparent?: boolean };
          setHeaderTransparent(parsed.transparent !== false);
        }
      } catch {
        /* ignore */
      }
    };
    readHeaderSetting();
    window.addEventListener("tc-header-settings-changed", readHeaderSetting);
    return () =>
      window.removeEventListener(
        "tc-header-settings-changed",
        readHeaderSetting,
      );
  }, []);

  useEffect(() => {
    if (forceOpaque) {
      setScrollRatio(1);
      return;
    }
    const onScroll = () => {
      if (!headerTransparent) {
        setScrollRatio(1);
        return;
      }
      const ratio = Math.min(window.scrollY / (window.innerHeight * 0.1), 1);
      setScrollRatio(ratio);
    };
    // Apply immediately based on current state
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [headerTransparent, forceOpaque]);

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
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backgroundColor: isWin98
            ? "rgba(30, 30, 40, 0.97)"
            : `color-mix(in srgb, var(--brand-header-bg) ${Math.round(scrollRatio * 92)}%, transparent)`,
          borderBottom: isWin98
            ? "1px solid rgba(0,0,0,0.4)"
            : `1px solid rgba(255,255,255,${scrollRatio * 0.08})`,
          backdropFilter: isWin98 ? "none" : `blur(${scrollRatio * 20}px)`,
          WebkitBackdropFilter: isWin98
            ? "none"
            : `blur(${scrollRatio * 20}px)`,
          boxShadow: isWin98
            ? "0 2px 8px rgba(0,0,0,0.5)"
            : scrollRatio > 0.5
              ? `0 8px 32px rgba(0,0,0,${scrollRatio * 0.4})`
              : "none",
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
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-0 group-hover:w-[calc(100%-2rem)] bg-brand-green rounded-full transition-all duration-300" />
                </a>
              ))}
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-3">
              {/* Language */}
              <LanguageSwitcher currentLang={lang} />

              {/* Separator */}
              <div className="hidden md:block w-px h-5 bg-white/15 mx-1" />

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/393497080551"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Team Cargo"
                className="inline-flex items-center gap-2 h-11 px-4 rounded-lg text-sm font-bold transition-colors duration-200"
                style={{
                  background: "var(--brand-dark)",
                  color: "var(--brand-btn-text)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--brand-mid)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "var(--brand-dark)")
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
                  className="hidden md:inline-flex items-center gap-2 h-11 px-4 rounded-lg bg-amber-400 hover:bg-amber-300 text-amber-950 text-sm font-bold transition-colors duration-200"
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
                    className="flex items-center gap-2 h-11 px-3 rounded-lg bg-white/8 border border-white/12 hover:bg-white/15 hover:border-white/25 text-white text-sm font-semibold transition-colors duration-200"
                  >
                    <span className="w-6 h-6 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[11px] font-bold flex items-center justify-center shrink-0">
                      {userInitial}
                    </span>
                    {dict.nav.my_profile}
                  </Link>
                  <button
                    onClick={() => void logout()}
                    title={dict.nav.logout}
                    className="w-11 h-11 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/15 transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => openAuth("login")}
                  className="hidden md:inline-flex items-center gap-2 h-11 px-4 rounded-lg border border-white/25 text-white text-sm font-semibold hover:bg-white/10 hover:border-white/40 transition-colors duration-200"
                >
                  <User className="w-4 h-4" />
                  {dict.nav.login}
                </button>
              )}

              {/* Hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="flex md:hidden items-center justify-center w-11 h-11 rounded-lg text-white hover:bg-white/10 border border-white/10 hover:border-white/25 transition-colors duration-200"
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
        aria-label="Navigation menu"
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
            className="w-11 h-11 flex items-center justify-center rounded-lg text-white hover:bg-white/10 border border-white/10 transition-colors"
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
              <ChevronRight className="w-4 h-4 text-white/50 group-hover:text-white/70 transition-colors shrink-0" />
            </a>
          ))}

          <div className="h-px bg-white/10 my-3 mx-2" />

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
              href="https://wa.me/393497080551"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Team Cargo"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors"
              style={{
                background: "var(--brand-dark)",
                color: "var(--brand-btn-text)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--brand-mid)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--brand-dark)")
              }
              onClick={() => setMobileOpen(false)}
            >
              <Phone className="w-4 h-4 shrink-0" />
              {dict.hero.cta_whatsapp}
            </a>

            <div className="h-px bg-white/10 my-1 mx-2" />

            {/* Language row */}
            <div className="px-4 py-2">
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider mb-2.5">
                {dict.nav.language}
              </p>
              <LanguageSwitcher currentLang={lang} />
            </div>
          </div>
        </nav>

        {/* Logout pinned at bottom */}
        {user && (
          <div className="px-4 pb-4 pt-2 border-t border-white/10">
            <button
              onClick={() => {
                setMobileOpen(false);
                void logout();
              }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors text-left"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {dict.nav.logout}
            </button>
          </div>
        )}

        {/* Panel footer */}
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-white/50 text-xs text-center mb-3">
            Team Cargo &copy; Amsterdam
          </p>

          {/* Social icons */}
          <div className="flex items-center justify-center gap-1 mb-3">
            <a
              href="https://www.facebook.com/TeamcargoBV"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Team Cargo on Facebook"
              className="w-11 h-11 flex items-center justify-center text-white/40 hover:text-white transition-colors duration-200"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/teamcargo_bv/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Team Cargo on Instagram"
              className="w-11 h-11 flex items-center justify-center text-white/40 hover:text-white transition-colors duration-200"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@team_cargo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Team Cargo on TikTok"
              className="w-11 h-11 flex items-center justify-center text-white/40 hover:text-white transition-colors duration-200"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.43a8.16 8.16 0 004.77 1.52V7.5a4.85 4.85 0 01-1-.81z" />
              </svg>
            </a>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Link
              href={`/${lang}/privacy`}
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center min-h-11 px-1 text-white/70 hover:text-white text-[10px] transition-colors"
            >
              Privacy
            </Link>
            <span className="text-white/40 text-[10px]">&middot;</span>
            <Link
              href={`/${lang}/cookies`}
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center min-h-11 px-1 text-white/70 hover:text-white text-[10px] transition-colors"
            >
              Cookies
            </Link>
            <span className="text-white/40 text-[10px]">&middot;</span>
            <Link
              href={`/${lang}/terms`}
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center min-h-11 px-1 text-white/70 hover:text-white text-[10px] transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
