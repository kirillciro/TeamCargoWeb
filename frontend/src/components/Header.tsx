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

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navLinks = NAV_LINKS(lang, dict);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#040f08]/98 shadow-lg shadow-black/30 backdrop-blur-sm"
            : "bg-[#040f08]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href={`/${lang}`} className="flex items-center shrink-0">
              <Image
                src="/logo.svg"
                alt="Team Cargo"
                width={180}
                height={54}
                className="h-14 sm:h-18 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-semibold text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <LanguageSwitcher currentLang={lang} />

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/31685352412"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#36B347] hover:bg-[#079441] text-white text-sm font-bold rounded-lg transition-colors shadow-md shadow-black/20"
              >
                <Phone className="w-4 h-4" />
                {dict.hero.cta_whatsapp}
              </a>

              {user?.role === "admin" && (
                <Link
                  href={`/${lang}/admin`}
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-400 text-amber-900 text-sm font-bold hover:bg-amber-300 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {dict.nav.admin_dashboard}
                </Link>
              )}

              {user ? (
                <>
                  <Link
                    href={`/${lang}/profile`}
                    className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-semibold hover:bg-white/20 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    {dict.nav.my_profile}
                  </Link>
                  <button
                    onClick={() => void logout()}
                    className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg border border-white/30 text-white/70 text-sm font-semibold hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    {dict.nav.logout}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => openAuth("login")}
                  className="hidden md:flex px-4 py-2 rounded-lg border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
                >
                  {dict.nav.login}
                </button>
              )}

              {/* Hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="flex md:hidden items-center justify-center w-10 h-10 rounded-lg text-white hover:bg-white/10 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile slide-in panel */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-90 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Panel — slides in from right */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 z-100 h-full bg-[#040f08] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: "min(300px, 82vw)" }}
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
            className="w-9 h-9 flex items-center justify-center rounded-lg text-white hover:bg-white/10 transition-colors"
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
              className="flex items-center justify-between px-4 py-3.5 rounded-xl text-white/90 hover:text-white hover:bg-white/10 font-semibold text-sm transition-colors group"
            >
              {link.label}
              <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
            </a>
          ))}

          {/* Divider */}
          <div className="h-px bg-white/10 my-3 mx-2" />

          {/* Language switcher row */}
          <div className="px-4 py-2 mb-4">
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-2">
              {dict.nav.language}
            </p>
            <LanguageSwitcher currentLang={lang} />
          </div>

          {/* Auth */}
          {user?.role === "admin" && (
            <Link
              href={`/${lang}/admin`}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-amber-900 bg-amber-400 hover:bg-amber-300 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              {dict.nav.admin_dashboard}
            </Link>
          )}

          {user ? (
            <>
              <Link
                href={`/${lang}/profile`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
              >
                <User className="w-4 h-4" />
                {dict.nav.my_profile}
              </Link>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  void logout();
                }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white/70 border border-white/20 hover:bg-white/10 hover:text-white transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                {dict.nav.logout}
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setMobileOpen(false);
                openAuth("login");
              }}
              className="px-4 py-3 rounded-xl text-sm font-bold text-[#2d9e5a] bg-white hover:bg-white/90 transition-colors"
            >
              {dict.nav.login}
            </button>
          )}
        </nav>

        {/* Panel footer */}
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-white/30 text-xs text-center mb-3">
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
