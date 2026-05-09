"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  BarChart3,
  Mail,
  Search,
  ShieldCheck,
  ShieldOff,
  Trash2,
  Loader2,
  CheckCircle,
  XCircle,
  User,
  LogOut,
  Palette,
  Monitor,
  Smartphone,
  Tablet,
  Clock,
  MapPin,
  MousePointer2,
  UserCheck,
  Truck,
  X,
  Phone,
  Globe,
  Download,
  FileImage,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  LabelList,
  CartesianGrid,
} from "recharts";
import AdminEmailsTab from "@/components/AdminEmailsTab";
import AdminCustomizationTab from "@/components/AdminCustomizationTab";
import { useAuth } from "@/context/AuthContext";
import { fetchWithAuth, type AuthUser } from "@/lib/auth-client";
import type { Dictionary } from "@/lib/getDictionary";

type Tab = "overview" | "users" | "emails" | "customization";
const TABS: Tab[] = ["overview", "users", "emails", "customization"];

type DriverProfile = {
  phone: string | null;
  whatsapp: string | null;
  country: string | null;
  availability: "available" | "open" | "unavailable";
  license_cats: string[];
  years_exp: number | null;
  languages: string[];
  bio: string | null;
};

const TAB_ICONS: Record<Tab, React.ElementType> = {
  overview: BarChart3,
  users: Users,
  emails: Mail,
  customization: Palette,
};

export default function AdminDashboard({
  lang,
  dict,
}: {
  lang: string;
  dict: Dictionary;
}) {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [active, setActive] = useState<Tab>("overview");
  const [win98, setWin98] = useState(false);
  const [defaultTheme, setDefaultTheme] = useState<"modern" | "win98">(
    "modern",
  );
  const [savingDefault, setSavingDefault] = useState(false);
  const [defaultSaved, setDefaultSaved] = useState(false);

  // Load persisted default theme and apply it on first mount
  useEffect(() => {
    fetchWithAuth("/api/admin/settings/default-theme")
      .then((r) => r.json())
      .then((data: { theme?: string }) => {
        const t = data.theme === "win98" ? "win98" : "modern";
        setDefaultTheme(t);
        setWin98(t === "win98");
      })
      .catch(() => {
        /* keep defaults */
      });
  }, []);

  async function handleSetDefault() {
    setSavingDefault(true);
    try {
      const theme = win98 ? "win98" : "modern";
      const res = await fetchWithAuth("/api/admin/settings/default-theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme }),
      });
      if (res.ok) {
        setDefaultTheme(theme);
        setDefaultSaved(true);
        setTimeout(() => setDefaultSaved(false), 2000);
      }
    } finally {
      setSavingDefault(false);
    }
  }

  // Apply Win98 gray to the page body & html so nothing bleeds through
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (win98) {
      html.style.background = "#c0c0c0";
      body.style.background = "#c0c0c0";
    } else {
      html.style.background = "";
      body.style.background = "";
    }
    return () => {
      html.style.background = "";
      body.style.background = "";
    };
  }, [win98]);

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "admin") {
      router.replace(`/${lang}`);
    }
  }, [user, loading, lang, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 sm:pt-24 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "admin") return null;

  const initial = (user.firstName?.[0] ?? user.email[0]).toUpperCase();

  return (
    <div
      data-admin
      data-win98={win98 ? "1" : undefined}
      className={`min-h-screen pt-20 sm:pt-24${win98 ? "" : " bg-slate-950 text-white"}`}
      style={
        win98
          ? {
              background: "#c0c0c0",
              fontFamily: '"MS Sans Serif", "Segoe UI", Arial, sans-serif',
              fontSize: "13px",
              color: "#000",
            }
          : undefined
      }
    >
      {/* ── Win98 global CSS (blankets every child component) ── */}
      {win98 && (
        <style>{`
          /* ── TAILWIND v4 CSS VARIABLE OVERRIDES ─────────────────── */
          /* Tailwind v4 generates: background-color: var(--color-slate-900)   */
          /* Overriding the vars here cascades to ALL descendants automatically */
          [data-win98] {
            --color-slate-950: #c0c0c0;
            --color-slate-900: #c0c0c0;
            --color-slate-800: #d4d4d4;
            --color-slate-700: #b8b8b8;
            --color-slate-600: #a0a0a0;
            --color-slate-500: #777;
            --color-slate-400: #555;
            --color-slate-300: #333;
            --color-slate-200: #222;
            --color-slate-100: #111;
            --color-zinc-800: #d4d4d4;
            --color-zinc-900: #c0c0c0;
            --color-neutral-800: #d4d4d4;
            --color-neutral-900: #c0c0c0;
            --color-amber-400: #c0c0c0;
            --color-amber-300: #c8c8c8;
            --color-amber-200: #d0d0d0;
            --color-amber-900: #000;
            --color-red-900: #800000;
            --color-red-800: #900000;
            --color-red-400: #cc0000;
            --color-red-300: #cc0000;
            --color-green-400: #008000;
            --color-emerald-400: #008000;
            --color-blue-400: #000080;
            --color-blue-300: #000080;
            --color-blue-600: #000080;
            --color-blue-700: #000080;
          }

          [data-win98], [data-win98] * { box-sizing: border-box; }

          /* ── BACKGROUNDS ───────────────────────────────────────── */
          /* Belt-and-suspenders: also override via class selectors    */
          /* in case any Tailwind class resolves without CSS vars      */
          [data-win98],
          [data-win98] .bg-slate-950,
          [data-win98] .bg-slate-900,
          [data-win98] .bg-slate-900\/80,
          [data-win98] .bg-slate-900\/60 {
            background-color: #c0c0c0 !important;
          }
          [data-win98] .bg-slate-800,
          [data-win98] .bg-slate-800\/40,
          [data-win98] .bg-slate-800\/60,
          [data-win98] .bg-slate-800\/80,
          [data-win98] .bg-zinc-800,
          [data-win98] .bg-neutral-800 {
            background-color: #d4d4d4 !important;
          }
          [data-win98] .bg-slate-700,
          [data-win98] .bg-slate-700\/50 { background-color: #b8b8b8 !important; }
          /* amber/accent → neutral Win98 gray (NOT blue tint) */
          [data-win98] .bg-amber-400\/5,
          [data-win98] .bg-amber-400\/10,
          [data-win98] .bg-amber-400\/20,
          [data-win98] .bg-amber-400\/30 { background-color: #f0f0f0 !important; }
          /* amber borders → normal gray divider */
          [data-win98] .border-amber-400,
          [data-win98] .border-amber-400\/20,
          [data-win98] .border-amber-400\/30,
          [data-win98] .border-amber-400\/50 { border-color: #808080 !important; }
          /* amber fill (save buttons) → raised Win98 button */
          [data-win98] .bg-amber-400,
          [data-win98] .bg-amber-300 {
            background-color: #c0c0c0 !important;
            border: 2px solid !important;
            border-color: #fff #808080 #808080 #fff !important;
            color: #000 !important;
          }
          [data-win98] .hover\:bg-amber-300:hover { background-color: #d4d4d4 !important; }
          /* error boxes */
          [data-win98] .bg-red-900\/20,
          [data-win98] .bg-red-900\/10,
          [data-win98] .bg-red-900\/40,
          [data-win98] .bg-red-800\/20 { background-color: #ffe0e0 !important; }
          /* success */
          [data-win98] .bg-emerald-500\/10,
          [data-win98] .bg-green-500\/10 { background-color: #d4f0d4 !important; }
          /* blue elements */
          [data-win98] .bg-blue-600,
          [data-win98] .bg-blue-700 { background-color: #000080 !important; }

          /* ── PANEL CARDS → WIN98 RAISED BOX ────────────────────── */
          /* Every card panel (div with slate-900 bg + border) gets raised border */
          [data-win98] div.bg-slate-900,
          [data-win98] div.bg-slate-800 {
            border: 2px solid !important;
            border-color: #fff #808080 #808080 #fff !important;
          }
          /* Image preview / sunken content box (slate-800 with inner border) */
          [data-win98] div.bg-slate-800.border,
          [data-win98] div.bg-slate-800.rounded-xl,
          [data-win98] div.bg-slate-800.rounded-lg {
            border-color: #808080 #fff #fff #808080 !important;
          }
          /* Amber action bar → flat Win98 group-box (sunken) */
          [data-win98] div.bg-amber-400\/5,
          [data-win98] div.bg-amber-400\/10 {
            border: 2px solid !important;
            border-color: #808080 #fff #fff #808080 !important;
            background-color: #f0f0f0 !important;
          }

          /* ── BORDERS ────────────────────────────────────────────── */
          [data-win98] .border-slate-900,
          [data-win98] .border-slate-800,
          [data-win98] .border-slate-700,
          [data-win98] .border-slate-700\/50,
          [data-win98] .border-slate-600 { border-color: #808080 !important; }
          [data-win98] .border-red-800,
          [data-win98] .border-red-700,
          [data-win98] .border-red-700\/60 { border-color: #cc0000 !important; }
          [data-win98] .border-emerald-500\/20,
          [data-win98] .border-green-500\/20 { border-color: #008000 !important; }
          [data-win98] .divide-slate-800 > * + * { border-color: #808080 !important; }

          /* ── TEXT COLORS ────────────────────────────────────────── */
          [data-win98] .text-white { color: #000 !important; }
          [data-win98] .hover\:text-white:hover { color: #000 !important; }
          [data-win98] .hover\:text-red-300:hover { color: #cc0000 !important; }
          [data-win98] .text-slate-100,
          [data-win98] .text-slate-200,
          [data-win98] .text-slate-300 { color: #111 !important; }
          [data-win98] .text-slate-400 { color: #333 !important; }
          [data-win98] .text-slate-500 { color: #555 !important; }
          [data-win98] .text-slate-600 { color: #777 !important; }
          [data-win98] .text-amber-400,
          [data-win98] .text-amber-300,
          [data-win98] .text-amber-200 { color: #000 !important; }
          [data-win98] .text-amber-900 { color: #000 !important; }
          [data-win98] .text-red-400,
          [data-win98] .text-red-300 { color: #cc0000 !important; }
          [data-win98] .text-green-400,
          [data-win98] .text-emerald-400 { color: #008000 !important; }
          [data-win98] .text-yellow-400 { color: #808000 !important; }
          [data-win98] .text-blue-400,
          [data-win98] .text-blue-300 { color: #000080 !important; }

          /* ── BORDER RADIUS → SQUARE ─────────────────────────────── */
          [data-win98] .rounded-2xl,
          [data-win98] .rounded-xl,
          [data-win98] .rounded-lg,
          [data-win98] .rounded-md,
          [data-win98] .rounded-full,
          [data-win98] .rounded { border-radius: 0 !important; }

          /* ── INPUTS / TEXTAREA / SELECT → SUNKEN WIN98 ──────────── */
          [data-win98] input[type="text"],
          [data-win98] input[type="email"],
          [data-win98] input[type="number"],
          [data-win98] input[type="url"],
          [data-win98] input[type="password"],
          [data-win98] input[type="search"],
          [data-win98] textarea,
          [data-win98] select {
            background: #fff !important;
            border: 2px solid !important;
            border-color: #808080 #fff #fff #808080 !important;
            border-radius: 0 !important;
            color: #000 !important;
            font-family: "MS Sans Serif", Arial, sans-serif !important;
            font-size: 12px !important;
          }
          [data-win98] input[type="range"] { accent-color: #000080 !important; }
          /* color picker — keep native swatch visible, just Win98 the border */
          [data-win98] input[type="color"] {
            border: 2px solid !important;
            border-color: #808080 #fff #fff #808080 !important;
            border-radius: 0 !important;
            padding: 2px !important;
            cursor: pointer !important;
            background: transparent !important;
          }
          [data-win98] input::placeholder,
          [data-win98] textarea::placeholder { color: #888 !important; opacity: 1 !important; }

          /* ── ALL BUTTONS → WIN98 RAISED ─────────────────────────── */
          [data-win98] button:not([style]) {
            background: #c0c0c0 !important;
            border: 2px solid !important;
            border-color: #fff #808080 #808080 #fff !important;
            border-radius: 0 !important;
            color: #000 !important;
            font-family: "MS Sans Serif", Arial, sans-serif !important;
            font-size: 12px !important;
            cursor: pointer;
          }
          [data-win98] button:not([style]):hover { background: #d0d0d0 !important; }
          [data-win98] button:not([style]):active {
            border-color: #808080 #fff #fff #808080 !important;
          }
          [data-win98] button:not([style]):disabled {
            color: #808080 !important; opacity: 1 !important;
          }
          /* selected picker items → sunken Win98 button (active/selected look) */
          [data-win98] button.bg-amber-400\/10:not([style]),
          [data-win98] button.bg-amber-400\/20:not([style]) {
            background-color: #e0e0e0 !important;
            border-color: #808080 #fff #fff #808080 !important;
          }

          /* ── TABLE ROW HOVER ─────────────────────────────────────── */
          [data-win98] .hover\\:bg-slate-800\\/40:hover {
            background-color: #000080 !important; color: #fff !important;
          }
          [data-win98] .hover\\:bg-slate-800\\/40:hover * { color: #fff !important; }

          /* ── MISC ────────────────────────────────────────────────── */
          [data-win98] svg.lucide { display: none !important; }
          [data-iconpicker] svg.lucide { display: inline-block !important; width: 12px !important; height: 12px !important; }
          [data-win98] a { color: #000080 !important; text-decoration: underline; }
          /* ring utilities → plain gray outline */
          [data-win98] .ring-amber-400,
          [data-win98] .ring-1,
          [data-win98] .ring-2 { --tw-ring-color: #808080 !important; }
          [data-win98] .focus\:ring-2:focus,
          [data-win98] .focus\:ring-amber-400\/40:focus { box-shadow: none !important; }
          [data-win98] .backdrop-blur-md,
          [data-win98] .backdrop-blur-sm { backdrop-filter: none !important; }
          [data-win98] .animate-spin,
          [data-win98] .animate-ping,
          [data-win98] .animate-bounce { animation: none !important; }
          [data-win98] .shadow,
          [data-win98] .shadow-2xl,
          [data-win98] .shadow-lg,
          [data-win98] .shadow-md { box-shadow: 1px 1px 0 #000 !important; }
          [data-win98] *:focus { outline: 1px dotted #000080 !important; box-shadow: none !important; }

          /* ── SCROLLBAR ───────────────────────────────────────────── */
          [data-win98] ::-webkit-scrollbar { width: 16px; height: 16px; }
          [data-win98] ::-webkit-scrollbar-track { background: #c0c0c0; border: 1px solid #808080; }
          [data-win98] ::-webkit-scrollbar-thumb {
            background: #c0c0c0;
            border: 2px solid;
            border-color: #fff #808080 #808080 #fff;
          }
        `}</style>
      )}
      <div
        className={`sticky top-20 sm:top-24 z-20${win98 ? "" : " bg-slate-900/80 backdrop-blur-md border-b border-slate-800"}`}
        style={
          win98
            ? { background: "#c0c0c0", borderBottom: "2px solid #808080" }
            : undefined
        }
      >
        {/* Win98 title bar */}
        {win98 && (
          <div
            style={{
              background: "linear-gradient(to right, #808080, #a0a0a0)",
              color: "#fff",
              padding: "3px 8px",
              fontSize: "12px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              userSelect: "none" as const,
            }}
          >
            <span>Team Cargo — Admin Dashboard</span>
            <div style={{ marginLeft: "auto", display: "flex", gap: 3 }}>
              {(["─", "□", "✕"] as const).map((s) => (
                <span
                  key={s}
                  style={{
                    display: "inline-block",
                    width: 16,
                    height: 14,
                    background: "#c0c0c0",
                    color: "#000",
                    fontSize: 9,
                    textAlign: "center" as const,
                    lineHeight: "14px",
                    border: "1px solid",
                    borderColor: "#fff #808080 #808080 #fff",
                    cursor: "default",
                    fontWeight: "bold",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="w-full px-4 sm:px-6">
          {/* Brand row */}
          <div
            className="flex items-center justify-between gap-4"
            style={win98 ? { padding: "6px 0" } : { height: 56 }}
          >
            {/* Left: identity */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: win98 ? 8 : 12,
              }}
            >
              {win98 ? (
                <div
                  style={{
                    width: 28,
                    height: 28,
                    border: "2px solid",
                    borderColor: "#fff #808080 #808080 #fff",
                    background: "#000080",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: "bold",
                    flexShrink: 0,
                  }}
                >
                  {initial}
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-amber-400 to-amber-500 flex items-center justify-center text-sm font-bold text-amber-900 shrink-0">
                  {initial}
                </div>
              )}
              {win98 ? (
                <span style={{ fontWeight: "bold", fontSize: 12 }}>
                  {dict.nav.admin_dashboard}
                </span>
              ) : (
                <span className="font-semibold text-sm text-white">
                  {dict.nav.admin_dashboard}
                </span>
              )}
              {win98 ? (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: "bold",
                    padding: "1px 6px",
                    border: "1px solid #808080",
                    background: "#000080",
                    color: "#fff",
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.05em",
                  }}
                >
                  Admin
                </span>
              ) : (
                <span className="hidden sm:inline text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/30 uppercase tracking-wide">
                  Admin
                </span>
              )}
            </div>

            {/* Right: actions */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: win98 ? 6 : 12,
              }}
            >
              {/* Toggle */}
              <button
                onClick={() => setWin98((v) => !v)}
                title={
                  win98
                    ? "Switch to modern theme"
                    : "Switch to Windows 98 theme"
                }
                style={
                  win98
                    ? {
                        padding: "2px 10px",
                        background: "#c0c0c0",
                        border: "2px solid",
                        borderColor: "#fff #808080 #808080 #fff",
                        fontFamily: '"MS Sans Serif", Arial, sans-serif',
                        fontSize: "12px",
                        cursor: "pointer",
                        color: "#000",
                        fontWeight: "bold",
                      }
                    : undefined
                }
                className={
                  win98
                    ? ""
                    : "flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
                }
              >
                {win98 ? "Modern" : "🖥️ Win98"}
              </button>

              {/* Set as default */}
              <button
                onClick={handleSetDefault}
                disabled={savingDefault}
                title={
                  defaultSaved
                    ? dict.admin.default_theme_saved
                    : (win98 ? "win98" : "modern") === defaultTheme
                      ? dict.admin.is_default
                      : dict.admin.set_as_default
                }
                style={
                  win98
                    ? {
                        padding: "2px 8px",
                        background: "#c0c0c0",
                        border: "2px solid",
                        borderColor:
                          (win98 ? "win98" : "modern") === defaultTheme
                            ? "#808080 #fff #fff #808080"
                            : "#fff #808080 #808080 #fff",
                        fontFamily: '"MS Sans Serif", Arial, sans-serif',
                        fontSize: "11px",
                        cursor: savingDefault ? "wait" : "pointer",
                        color: "#000",
                        whiteSpace: "nowrap" as const,
                      }
                    : undefined
                }
                className={
                  win98
                    ? ""
                    : `flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5 rounded-lg border transition-colors whitespace-nowrap ${
                        defaultSaved
                          ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                          : (win98 ? "win98" : "modern") === defaultTheme
                            ? "bg-amber-400/10 border-amber-400/30 text-amber-400 cursor-default"
                            : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600"
                      }`
                }
              >
                {defaultSaved
                  ? dict.admin.default_theme_saved
                  : (win98 ? "win98" : "modern") === defaultTheme
                    ? `★ ${dict.admin.is_default}`
                    : dict.admin.set_as_default}
              </button>

              {/* Profile */}
              {win98 ? (
                <Link
                  href={`/${lang}/profile`}
                  className="hidden sm:inline-flex"
                  style={{
                    padding: "2px 8px",
                    background: "#c0c0c0",
                    border: "2px solid",
                    borderColor: "#fff #808080 #808080 #fff",
                    fontSize: "12px",
                    color: "#000",
                    textDecoration: "none",
                    whiteSpace: "nowrap" as const,
                    cursor: "pointer",
                  }}
                >
                  {dict.nav.my_profile}
                </Link>
              ) : (
                <Link
                  href={`/${lang}/profile`}
                  className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  {dict.nav.my_profile}
                </Link>
              )}

              {/* Logout */}
              {win98 ? (
                <button
                  onClick={() =>
                    void logout().then(() => router.replace(`/${lang}`))
                  }
                  style={{
                    padding: "2px 8px",
                    background: "#c0c0c0",
                    border: "2px solid",
                    borderColor: "#fff #808080 #808080 #fff",
                    fontFamily: '"MS Sans Serif", Arial, sans-serif',
                    fontSize: "12px",
                    cursor: "pointer",
                    color: "#000",
                    whiteSpace: "nowrap" as const,
                  }}
                >
                  {dict.nav.logout}
                </button>
              ) : (
                <button
                  onClick={() =>
                    void logout().then(() => router.replace(`/${lang}`))
                  }
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{dict.nav.logout}</span>
                </button>
              )}

              {/* Back */}
              {win98 ? (
                <Link
                  href={`/${lang}`}
                  className="hidden sm:inline-flex"
                  style={{
                    padding: "2px 8px",
                    background: "#c0c0c0",
                    border: "2px solid",
                    borderColor: "#fff #808080 #808080 #fff",
                    fontSize: "12px",
                    color: "#000",
                    textDecoration: "none",
                    whiteSpace: "nowrap" as const,
                    cursor: "pointer",
                  }}
                >
                  ← {dict.admin.back_to_site}
                </Link>
              ) : (
                <Link
                  href={`/${lang}`}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {dict.admin.back_to_site}
                  </span>
                </Link>
              )}
            </div>
          </div>

          {/* Tab row */}
          <div
            className={win98 ? "" : "flex gap-0 -mb-px overflow-x-auto"}
            style={
              win98
                ? {
                    display: "flex",
                    gap: 4,
                    borderTop: "2px solid #808080",
                    paddingTop: 6,
                    paddingBottom: 4,
                    overflowX: "auto" as const,
                  }
                : undefined
            }
          >
            {TABS.map((key) => {
              const Icon = TAB_ICONS[key];
              const tabLabel = {
                overview: "Analytics",
                users: dict.admin.tab_users,
                emails: dict.admin.tab_emails,
                customization: dict.admin.tab_customization,
              }[key];
              return (
                <button
                  key={key}
                  onClick={() => setActive(key)}
                  className={
                    win98
                      ? ""
                      : `relative flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                          active === key
                            ? "border-amber-400 text-amber-400"
                            : "border-transparent text-slate-400 hover:text-white hover:border-slate-600"
                        }`
                  }
                  style={
                    win98
                      ? {
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "3px 14px",
                          background: active === key ? "#fff" : "#c0c0c0",
                          border: "2px solid",
                          borderColor:
                            active === key
                              ? "#808080 #fff #fff #808080"
                              : "#fff #808080 #808080 #fff",
                          fontFamily: '"MS Sans Serif", Arial, sans-serif',
                          fontSize: "12px",
                          cursor: "pointer",
                          color: "#000",
                          fontWeight: active === key ? "bold" : "normal",
                          whiteSpace: "nowrap" as const,
                          boxShadow:
                            active === key ? "inset 1px 1px 0 #000" : undefined,
                        }
                      : undefined
                  }
                >
                  {win98 ? null : <Icon className="w-4 h-4" />}
                  {tabLabel}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="w-full px-4 sm:px-6 py-6">
        {active === "overview" &&
          (win98 ? (
            <AdminOverviewTab dict={dict} win98={win98} />
          ) : (
            <div className="max-w-[83.6352rem] mx-auto">
              <AdminOverviewTab dict={dict} win98={win98} />
            </div>
          ))}
        {active === "users" &&
          (win98 ? (
            <Win98Window title="Users Management" icon={<W98IcUser />}>
              <AdminUsersTab currentUserId={user.id} dict={dict} win98 />
            </Win98Window>
          ) : (
            <div className="max-w-[83.6352rem] mx-auto">
              <AdminUsersTab currentUserId={user.id} dict={dict} />
            </div>
          ))}
        {active === "emails" &&
          (win98 ? (
            <Win98Window title="Email Inbox" icon={<W98IcMail />}>
              <AdminEmailsTab dict={dict} win98 />
            </Win98Window>
          ) : (
            <div className="max-w-[83.6352rem] mx-auto px-2 pt-[100px] pb-[100px]">
              <AdminEmailsTab dict={dict} />
            </div>
          ))}
        {active === "customization" &&
          (win98 ? (
            <Win98Window title="Customization Settings" icon={<W98IcGear />}>
              <AdminCustomizationTab dict={dict} win98={win98} />
            </Win98Window>
          ) : (
            <AdminCustomizationTab dict={dict} win98={win98} />
          ))}
      </div>
    </div>
  );
}

// ── Win98 helper components ───────────────────────────────────────────────

const W98_RAISED: React.CSSProperties = {
  border: "2px solid",
  borderColor: "#fff #808080 #808080 #fff",
  background: "#c0c0c0",
};
const W98_SUNKEN: React.CSSProperties = {
  border: "2px solid",
  borderColor: "#808080 #fff #fff #808080",
  background: "#fff",
};

// Pixel-style SVG icons (currentColor inherits from title bar text)
const W98IcUser = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    style={{ display: "block", flexShrink: 0 }}
  >
    <circle cx="8" cy="5" r="3" fill="currentColor" />
    <path d="M2 15 Q2 10 8 10 Q14 10 14 15" fill="currentColor" />
  </svg>
);
const W98IcUsers = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    style={{ display: "block", flexShrink: 0 }}
  >
    <circle cx="5" cy="5" r="2.5" fill="currentColor" />
    <circle cx="11" cy="5" r="2.5" fill="currentColor" />
    <path
      d="M0 14 Q0 10 5 10 Q7 10 8 11 Q9 10 11 10 Q16 10 16 14"
      fill="currentColor"
    />
  </svg>
);
const W98IcChart = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    style={{ display: "block", flexShrink: 0 }}
  >
    <rect x="1" y="9" width="3" height="6" fill="currentColor" />
    <rect x="5" y="5" width="3" height="10" fill="currentColor" />
    <rect x="9" y="2" width="3" height="13" fill="currentColor" />
    <rect x="13" y="6" width="2" height="9" fill="currentColor" />
    <rect x="0" y="15" width="16" height="1" fill="currentColor" />
  </svg>
);
const W98IcCursor = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    style={{ display: "block", flexShrink: 0 }}
  >
    <polygon
      points="3,1 3,13 6,10 9,15 11,14 8,9 13,9"
      fill="currentColor"
      strokeLinejoin="round"
    />
  </svg>
);
const W98IcGlobe = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    style={{ display: "block", flexShrink: 0 }}
  >
    <circle cx="8" cy="8" r="6" />
    <ellipse cx="8" cy="8" rx="2.5" ry="6" />
    <line x1="2" y1="8" x2="14" y2="8" />
    <line x1="3" y1="5" x2="13" y2="5" />
    <line x1="3" y1="11" x2="13" y2="11" />
  </svg>
);
const W98IcPin = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    style={{ display: "block", flexShrink: 0 }}
  >
    <circle
      cx="8"
      cy="6"
      r="4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <circle cx="8" cy="6" r="1.5" fill="currentColor" />
    <path d="M5.5 9.2 Q8 15 8 15 Q8 15 10.5 9.2" fill="currentColor" />
  </svg>
);
const W98IcDoc = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    style={{ display: "block", flexShrink: 0 }}
  >
    <polygon points="3,1 10,1 13,4 13,15 3,15" />
    <polyline points="10,1 10,4 13,4" />
    <line x1="5" y1="7" x2="11" y2="7" />
    <line x1="5" y1="10" x2="11" y2="10" />
    <line x1="5" y1="13" x2="9" y2="13" />
  </svg>
);
const W98IcMonitor = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    style={{ display: "block", flexShrink: 0 }}
  >
    <rect x="1" y="2" width="14" height="9" />
    <line x1="5" y1="11" x2="5" y2="14" />
    <line x1="11" y1="11" x2="11" y2="14" />
    <line x1="3" y1="14" x2="13" y2="14" />
  </svg>
);
const W98IcMail = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    style={{ display: "block", flexShrink: 0 }}
  >
    <rect x="1" y="3" width="14" height="10" />
    <polyline points="1,3 8,9 15,3" />
  </svg>
);
const W98IcGear = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    style={{ display: "block", flexShrink: 0 }}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M6.5 1 L6 2.8 A5.5 5.5 0 0 0 4.3 3.7 L2.6 3.2 L1 5.5 L2.2 6.7 A5.5 5.5 0 0 0 2.1 8 A5.5 5.5 0 0 0 2.2 9.3 L1 10.5 L2.6 12.8 L4.3 12.3 A5.5 5.5 0 0 0 6 13.2 L6.5 15 L9.5 15 L10 13.2 A5.5 5.5 0 0 0 11.7 12.3 L13.4 12.8 L15 10.5 L13.8 9.3 A5.5 5.5 0 0 0 13.9 8 A5.5 5.5 0 0 0 13.8 6.7 L15 5.5 L13.4 3.2 L11.7 3.7 A5.5 5.5 0 0 0 10 2.8 L9.5 1 Z M8 5.5 A2.5 2.5 0 1 0 8 10.5 A2.5 2.5 0 0 0 8 5.5 Z"
    />
  </svg>
);

function Win98Window({
  title,
  icon,
  secondary,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  secondary?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ ...W98_RAISED, marginBottom: 0 }}>
      <div
        style={{
          background: secondary
            ? "linear-gradient(to right, #808080, #a0a0a0)"
            : "linear-gradient(to right, #000080, #1084d0)",
          color: "#fff",
          padding: "3px 6px",
          fontSize: 11,
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: 5,
          userSelect: "none",
        }}
      >
        {icon && (
          <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>
        )}
        {title}
      </div>
      <div style={{ padding: "8px 10px" }}>{children}</div>
    </div>
  );
}

function Win98Progress({
  value,
  color = "#000080",
}: {
  value: number;
  color?: string;
}) {
  return (
    <div>
      <div
        style={{
          ...W98_SUNKEN,
          height: 16,
          padding: 1,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${value}%`,
            height: "100%",
            background: color,
            transition: "width 0.5s",
            display: "flex",
            alignItems: "center",
            paddingLeft: 4,
          }}
        >
          {value > 10 && (
            <span
              style={{ color: "#fff", fontSize: 10, fontFamily: "monospace" }}
            >
              {value}%
            </span>
          )}
        </div>
      </div>
      {value <= 10 && (
        <span style={{ fontSize: 10, fontFamily: "monospace" }}>{value}%</span>
      )}
    </div>
  );
}

function Win98Table({
  rows,
  headers,
}: {
  rows: string[][];
  headers: string[];
}) {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse" as const,
        fontSize: 12,
      }}
    >
      <thead>
        <tr style={{ background: "#000080", color: "#fff" }}>
          {headers.map((h) => (
            <th
              key={h}
              style={{
                padding: "2px 6px",
                textAlign: "left" as const,
                fontWeight: "bold",
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f0f0f0" }}>
            {row.map((cell, j) => (
              <td
                key={j}
                style={{
                  padding: "2px 6px",
                  borderBottom: "1px solid #d0d0d0",
                  fontFamily: j === row.length - 1 ? "monospace" : "inherit",
                  textAlign:
                    j === row.length - 1
                      ? ("right" as const)
                      : ("left" as const),
                  maxWidth: j === 0 ? 160 : undefined,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap" as const,
                }}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ── Overview Tab ─────────────────────────────────────────────────────────────

type Stats = {
  totalUsers: number;
  totalVerified: number;
  totalUnverified: number;
};
type AnalyticsSummary = {
  sessions: { today: number; week: number; month: number };
  activeUsers: number;
  topPages: { path: string; sessions: number }[];
  deviceCategory: { category: string; sessions: number }[];
  trafficSources: { source: string; sessions: number }[];
  topCountries: { country: string; sessions: number }[];
  engagement: {
    avgSessionDuration: number;
    engagementRate: number;
    newUsersRate: number;
  };
};

function formatDuration(seconds: number): string {
  if (seconds < 1) return "0s";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  if (m === 0) return `${s}s`;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

const SESSION_COLORS = ["#f59e0b", "#8b5cf6", "#38bdf8"];
const DEVICE_COLORS = ["#f59e0b", "#8b5cf6", "#38bdf8", "#10b981"];

function ChartTooltip({
  active,
  payload,
  label,
  colorIndex = 0,
}: {
  active?: boolean;
  payload?: Array<{ value: number; color?: string }>;
  label?: string;
  colorIndex?: number;
}) {
  if (!active || !payload?.length) return null;
  const color = payload[0].color ?? SESSION_COLORS[colorIndex] ?? "#f59e0b";
  return (
    <div className="rounded-xl bg-[#0f172a] border border-slate-700/80 px-3.5 py-2.5 shadow-2xl text-sm">
      <div className="flex items-center gap-1.5 mb-1">
        <div
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: color }}
        />
        <p className="text-slate-400 text-xs">{label}</p>
      </div>
      <p className="font-bold text-white tabular-nums">
        {payload[0].value.toLocaleString()}
        <span className="text-slate-500 font-normal text-xs ml-1">
          sessions
        </span>
      </p>
    </div>
  );
}

function DeviceTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload?: { fill?: string } }>;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-[#0f172a] border border-slate-700/80 px-3.5 py-2.5 shadow-2xl text-sm">
      <p className="text-slate-400 text-xs capitalize mb-1">
        {payload[0].name}
      </p>
      <p className="font-bold text-white tabular-nums">
        {payload[0].value.toLocaleString()}
        <span className="text-slate-500 font-normal text-xs ml-1">
          sessions
        </span>
      </p>
    </div>
  );
}

function AdminOverviewTab({
  dict,
  win98,
}: {
  dict: Dictionary;
  win98: boolean;
}) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const [statsRes, analyticsRes] = await Promise.all([
          fetchWithAuth("/api/admin/stats"),
          fetchWithAuth("/api/admin/analytics/summary"),
        ]);
        if (!statsRes.ok) throw new Error("Failed to load stats");
        const data = (await statsRes.json()) as Stats;
        setStats(data);
        if (analyticsRes.ok) {
          setAnalytics((await analyticsRes.json()) as AnalyticsSummary);
        }
      } catch {
        setError(dict.admin.error_load_stats);
      } finally {
        setLoading(false);
      }
    })();
  }, [dict]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 text-slate-500">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <p className="text-red-400 text-sm">
        {error ?? dict.admin.error_unknown}
      </p>
    );
  }

  const totalDeviceSessions =
    analytics?.deviceCategory.reduce((s, d) => s + d.sessions, 0) ?? 0;

  const sessionBarData = analytics
    ? [
        { period: "Today", sessions: analytics.sessions.today },
        { period: "7 days", sessions: analytics.sessions.week },
        { period: "30 days", sessions: analytics.sessions.month },
      ]
    : [];

  const devicePieData = analytics?.deviceCategory.map((d) => ({
    name: d.category,
    value: d.sessions,
  }));

  return (
    <div className={win98 ? "" : "space-y-8"}>
      {/* ── Header (modern only — win98 header lives in dashboard title bar) ── */}
      {!win98 && (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Analytics</h2>
          <div className="flex items-center gap-3 shrink-0">
            {analytics && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-xs font-medium text-emerald-400">
                  {analytics.activeUsers} active now
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════ WIN98 THEME ════════════════════ */}
      {win98 &&
        stats &&
        (() => {
          const F = '"MS Sans Serif", Arial, sans-serif';
          const GRP: React.CSSProperties = {
            border: "2px solid",
            borderColor: "#808080 #fff #fff #808080",
            background: "#c0c0c0",
            padding: "20px 16px 14px",
            position: "relative",
          };
          const GRP_LBL: React.CSSProperties = {
            position: "absolute",
            top: -9,
            left: 10,
            background: "#c0c0c0",
            padding: "0 4px",
            fontSize: 11,
            fontWeight: "bold",
            color: "#000",
            fontFamily: F,
            whiteSpace: "nowrap",
          };
          const KV = (
            label: string,
            value: string | number,
            isLast = false,
          ) => (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                padding: "6px 0",
                borderBottom: isLast ? "none" : "1px solid #808080",
              }}
            >
              <span style={{ fontFamily: F, fontSize: 11, color: "#555" }}>
                {label}
              </span>
              <span
                style={{
                  fontFamily: "monospace",
                  fontWeight: "bold",
                  fontSize: 12,
                }}
              >
                {typeof value === "number" ? value.toLocaleString() : value}
              </span>
            </div>
          );
          return (
            <div
              style={{
                padding: "4px 2px 14px",
                fontFamily: F,
                fontSize: 11,
                color: "#000",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <style>{`
              .w98a-top { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; align-items: stretch; }
              .w98a-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
              @media (max-width: 600px) {
                .w98a-top { grid-template-columns: 1fr; }
                .w98a-2col { grid-template-columns: 1fr; }
              }
            `}</style>

              {/* Status bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "3px 8px",
                  border: "2px solid",
                  borderColor: "#808080 #fff #fff #808080",
                  fontSize: 11,
                }}
              >
                <span
                  style={{
                    color: analytics ? "#006600" : "#808080",
                    fontWeight: "bold",
                  }}
                >
                  {analytics ? "● GA4 Connected" : "○ GA4 Unavailable"}
                </span>
                {analytics && (
                  <>
                    <span style={{ color: "#808080" }}>|</span>
                    <span>
                      Active users: <strong>{analytics.activeUsers}</strong>
                    </span>
                  </>
                )}
                <span style={{ marginLeft: "auto", color: "#555" }}>
                  {new Date().toLocaleDateString()}
                </span>
              </div>

              {/* Top row: Users | Sessions | Engagement */}
              <div className="w98a-top">
                {/* Users & Accounts */}
                <div style={{ ...GRP }}>
                  <span style={GRP_LBL}>Users &amp; Accounts</span>
                  {KV(dict.admin.stat_total_users, stats.totalUsers)}
                  {KV(dict.admin.stat_verified, stats.totalVerified)}
                  {KV(dict.admin.stat_unverified, stats.totalUnverified, true)}
                </div>

                {/* Sessions */}
                <div style={{ ...GRP }}>
                  <span style={GRP_LBL}>Sessions</span>
                  {analytics ? (
                    [
                      { label: "Today", value: analytics.sessions.today },
                      { label: "7 days", value: analytics.sessions.week },
                      { label: "30 days", value: analytics.sessions.month },
                    ].map(({ label, value }, i, arr) => {
                      const max = Math.max(
                        analytics.sessions.today,
                        analytics.sessions.week,
                        analytics.sessions.month,
                        1,
                      );
                      const bars = Math.round((value / max) * 12);
                      return (
                        <div
                          key={label}
                          style={{
                            padding: "6px 0",
                            borderBottom:
                              i < arr.length - 1 ? "1px solid #808080" : "none",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: 11,
                              marginBottom: 2,
                            }}
                          >
                            <span style={{ color: "#555" }}>{label}</span>
                            <span
                              style={{
                                fontFamily: "monospace",
                                fontWeight: "bold",
                              }}
                            >
                              {value.toLocaleString()}
                            </span>
                          </div>
                          <div
                            style={{
                              fontFamily: "monospace",
                              fontSize: 9,
                              color: "#000080",
                              lineHeight: 1,
                            }}
                          >
                            {"█".repeat(bars)}
                            {"░".repeat(12 - bars)}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <span style={{ fontSize: 11, color: "#808080" }}>
                      No GA4 data
                    </span>
                  )}
                </div>

                {/* Engagement */}
                <div style={{ ...GRP }}>
                  <span style={GRP_LBL}>Engagement</span>
                  {analytics ? (
                    <>
                      {KV(
                        "Avg. Duration",
                        formatDuration(analytics.engagement.avgSessionDuration),
                      )}
                      <div
                        style={{
                          padding: "6px 0",
                          borderBottom: "1px solid #808080",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: 11,
                            marginBottom: 3,
                          }}
                        >
                          <span style={{ color: "#555" }}>Engaged</span>
                          <span style={{ fontFamily: "monospace" }}>
                            {Math.round(
                              analytics.engagement.engagementRate * 100,
                            )}
                            %
                          </span>
                        </div>
                        <Win98Progress
                          value={Math.round(
                            analytics.engagement.engagementRate * 100,
                          )}
                          color="#000080"
                        />
                      </div>
                      <div style={{ padding: "6px 0" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: 11,
                            marginBottom: 3,
                          }}
                        >
                          <span style={{ color: "#555" }}>New Users</span>
                          <span style={{ fontFamily: "monospace" }}>
                            {Math.round(
                              analytics.engagement.newUsersRate * 100,
                            )}
                            %
                          </span>
                        </div>
                        <Win98Progress
                          value={Math.round(
                            analytics.engagement.newUsersRate * 100,
                          )}
                          color="#008000"
                        />
                      </div>
                    </>
                  ) : (
                    <span style={{ fontSize: 11, color: "#808080" }}>
                      No GA4 data
                    </span>
                  )}
                </div>
              </div>

              {/* Audience: Traffic Sources + Top Countries */}
              {analytics && (
                <div style={{ ...GRP }}>
                  <span style={GRP_LBL}>Audience</span>
                  <div className="w98a-2col">
                    <div>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: "bold",
                          color: "#000080",
                          marginBottom: 5,
                        }}
                      >
                        Traffic Sources
                      </div>
                      <Win98Table
                        rows={analytics.trafficSources.map((t) => [
                          t.source,
                          t.sessions.toLocaleString(),
                        ])}
                        headers={["Source", "Sessions"]}
                      />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: "bold",
                          color: "#000080",
                          marginBottom: 5,
                        }}
                      >
                        Top Countries
                      </div>
                      <Win98Table
                        rows={analytics.topCountries.map((c) => [
                          c.country,
                          c.sessions.toLocaleString(),
                        ])}
                        headers={["Country", "Sessions"]}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Top Pages | Devices — two separate GRP boxes side by side */}
              {analytics && (
                <div className="w98a-2col">
                  {/* Top Pages */}
                  <div style={{ ...GRP }}>
                    <span style={GRP_LBL}>Top Pages</span>
                    <Win98Table
                      rows={analytics.topPages.map((p, i) => [
                        `${i + 1}. ${p.path}`,
                        p.sessions.toLocaleString(),
                      ])}
                      headers={["Page", "Sessions"]}
                    />
                  </div>

                  {/* Devices */}
                  <div style={{ ...GRP }}>
                    <span style={GRP_LBL}>Devices</span>
                    {(() => {
                      const total = analytics.deviceCategory.reduce(
                        (s, x) => s + x.sessions,
                        0,
                      );
                      return analytics.deviceCategory.map((d, i, arr) => {
                        const pct =
                          total > 0
                            ? Math.round((d.sessions / total) * 100)
                            : 0;
                        return (
                          <div
                            key={d.category}
                            style={{
                              paddingBottom: i < arr.length - 1 ? 10 : 0,
                              marginBottom: i < arr.length - 1 ? 10 : 0,
                              borderBottom:
                                i < arr.length - 1
                                  ? "1px solid #808080"
                                  : "none",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: 11,
                                marginBottom: 4,
                              }}
                            >
                              <span
                                style={{
                                  textTransform: "capitalize" as const,
                                  fontWeight: "bold",
                                }}
                              >
                                {d.category}
                              </span>
                              <span
                                style={{
                                  fontFamily: "monospace",
                                  color: "#000080",
                                }}
                              >
                                {pct}% &nbsp;
                                <span
                                  style={{
                                    color: "#555",
                                    fontWeight: "normal",
                                  }}
                                >
                                  ({d.sessions.toLocaleString()} sessions)
                                </span>
                              </span>
                            </div>
                            <Win98Progress value={pct} color="#000080" />
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

      {/* ════════════════════ MODERN THEME ════════════════════ */}
      {!win98 && (
        <div className="space-y-8">
          {/* ── User stats ── */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Users
            </p>
            <p className="text-[11px] text-slate-600 mt-0.5 mb-3">
              Registered accounts in your database
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              <StatCard
                icon={Users}
                label={dict.admin.stat_total_users}
                value={stats.totalUsers}
                color="text-blue-400"
                accentColor="#60a5fa"
              />
              <StatCard
                icon={CheckCircle}
                label={dict.admin.stat_verified}
                value={stats.totalVerified}
                color="text-green-400"
                accentColor="#4ade80"
              />
              <StatCard
                icon={XCircle}
                label={dict.admin.stat_unverified}
                value={stats.totalUnverified}
                color="text-yellow-400"
                accentColor="#facc15"
              />
            </div>
          </div>

          {/* ── GA4 Analytics ── */}
          {analytics && (
            <>
              {/* Sessions bar chart + KPIs */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                      Sessions
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Each visit to your site, regardless of the user
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-600 font-medium shrink-0 mt-0.5">
                    Last 30 days
                  </span>
                </div>
                {/* KPI row */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    {
                      label: "Today",
                      value: analytics.sessions.today,
                      color: SESSION_COLORS[0],
                      id: "0",
                    },
                    {
                      label: "7 days",
                      value: analytics.sessions.week,
                      color: SESSION_COLORS[1],
                      id: "1",
                    },
                    {
                      label: "30 days",
                      value: analytics.sessions.month,
                      color: SESSION_COLORS[2],
                      id: "2",
                    },
                  ].map(({ label, value, color, id }) => (
                    <div
                      key={id}
                      className="rounded-xl bg-slate-800/40 border border-slate-700/50 px-4 py-3.5 relative overflow-hidden"
                    >
                      <div
                        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl"
                        style={{ background: color }}
                      />
                      <p className="text-[11px] text-slate-500 mb-2 uppercase tracking-wide">
                        {label}
                      </p>
                      <p
                        className="text-3xl font-bold tabular-nums tracking-tight"
                        style={{ color }}
                      >
                        {value.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
                {/* Bar chart */}
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={sessionBarData}
                    barCategoryGap="40%"
                    margin={{ top: 20, right: 8, bottom: 0, left: -16 }}
                  >
                    <defs>
                      {SESSION_COLORS.map((c, i) => (
                        <linearGradient
                          key={i}
                          id={`sg-${i}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor={c} stopOpacity={0.95} />
                          <stop
                            offset="100%"
                            stopColor={c}
                            stopOpacity={0.25}
                          />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid
                      vertical={false}
                      stroke="#1e293b"
                      strokeDasharray="4 4"
                    />
                    <XAxis
                      dataKey="period"
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#334155", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      content={<ChartTooltip />}
                      cursor={{ fill: "rgba(255,255,255,0.03)", radius: 6 }}
                    />
                    <Bar dataKey="sessions" radius={[6, 6, 0, 0]}>
                      {sessionBarData.map((_, i) => (
                        <Cell key={i} fill={`url(#sg-${i})`} />
                      ))}
                      <LabelList
                        dataKey="sessions"
                        position="top"
                        style={{
                          fill: "#94a3b8",
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                        formatter={(v: unknown) =>
                          Number(v) > 0 ? Number(v).toLocaleString() : ""
                        }
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* ── Engagement KPIs ── */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                      Engagement
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      How visitors interact with your content once they arrive
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-600 font-medium shrink-0 mt-0.5">
                    30 days
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {/* Avg session duration */}
                  <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 px-4 py-3.5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl bg-violet-400" />
                    <div className="flex items-center gap-1.5 mb-2">
                      <Clock className="w-3 h-3 text-violet-400" />
                      <p className="text-[11px] text-slate-500 uppercase tracking-wide">
                        Avg. Duration
                      </p>
                    </div>
                    <p className="text-2xl font-bold tabular-nums tracking-tight text-violet-300">
                      {formatDuration(analytics.engagement.avgSessionDuration)}
                    </p>
                    <p className="text-[10px] text-slate-600 mt-1">
                      per session
                    </p>
                  </div>
                  {/* Engagement rate */}
                  <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 px-4 py-3.5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl bg-emerald-400" />
                    <div className="flex items-center gap-1.5 mb-2">
                      <MousePointer2 className="w-3 h-3 text-emerald-400" />
                      <p className="text-[11px] text-slate-500 uppercase tracking-wide">
                        Engaged
                      </p>
                    </div>
                    <p className="text-2xl font-bold tabular-nums tracking-tight text-emerald-300">
                      {Math.round(analytics.engagement.engagementRate * 100)}%
                    </p>
                    <div className="mt-2 h-1 rounded-full bg-slate-700 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-400/60 transition-all duration-700"
                        style={{
                          width: `${Math.round(analytics.engagement.engagementRate * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  {/* New vs returning */}
                  <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 px-4 py-3.5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl bg-sky-400" />
                    <div className="flex items-center gap-1.5 mb-2">
                      <UserCheck className="w-3 h-3 text-sky-400" />
                      <p className="text-[11px] text-slate-500 uppercase tracking-wide">
                        New Users
                      </p>
                    </div>
                    <p className="text-2xl font-bold tabular-nums tracking-tight text-sky-300">
                      {Math.round(analytics.engagement.newUsersRate * 100)}%
                    </p>
                    <div className="mt-2 h-1 rounded-full bg-slate-700 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-sky-400/60 transition-all duration-700"
                        style={{
                          width: `${Math.round(analytics.engagement.newUsersRate * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Traffic Sources + Countries row ── */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Traffic Sources — horizontal bar */}
                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                        Traffic Sources
                      </p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Where visitors come from — search, direct, referral, or
                        ads
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-600 font-medium shrink-0 mt-0.5">
                      30 days
                    </span>
                  </div>
                  <ResponsiveContainer
                    width="100%"
                    height={Math.max(180, analytics.trafficSources.length * 34)}
                  >
                    <BarChart
                      layout="vertical"
                      data={analytics.trafficSources}
                      margin={{ top: 0, right: 44, bottom: 0, left: 0 }}
                      barCategoryGap="30%"
                    >
                      <defs>
                        <linearGradient id="tg" x1="0" y1="0" x2="1" y2="0">
                          <stop
                            offset="0%"
                            stopColor="#8b5cf6"
                            stopOpacity={0.9}
                          />
                          <stop
                            offset="100%"
                            stopColor="#8b5cf6"
                            stopOpacity={0.3}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        horizontal={false}
                        stroke="#1e293b"
                        strokeDasharray="4 4"
                      />
                      <XAxis
                        type="number"
                        tick={{ fill: "#334155", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                      />
                      <YAxis
                        dataKey="source"
                        type="category"
                        width={110}
                        tick={{ fill: "#94a3b8", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        content={<ChartTooltip />}
                        cursor={{ fill: "rgba(255,255,255,0.03)" }}
                      />
                      <Bar
                        dataKey="sessions"
                        radius={[0, 6, 6, 0]}
                        fill="url(#tg)"
                      >
                        <LabelList
                          dataKey="sessions"
                          position="right"
                          style={{
                            fill: "#64748b",
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                          formatter={(v: unknown) =>
                            Number(v) > 0 ? Number(v).toLocaleString() : ""
                          }
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Top Countries — list with inline progress */}
                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                        Top Countries
                      </p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Geographic breakdown of your visitors by session count
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-600 font-medium shrink-0 mt-0.5">
                      30 days
                    </span>
                  </div>
                  {(() => {
                    const total = analytics.topCountries.reduce(
                      (s, c) => s + c.sessions,
                      0,
                    );
                    return (
                      <div className="space-y-3">
                        {analytics.topCountries.map((c, i) => {
                          const pct =
                            total > 0
                              ? Math.round((c.sessions / total) * 100)
                              : 0;
                          const opacity = 1 - i * 0.09;
                          return (
                            <div key={c.country}>
                              <div className="flex items-center gap-2 mb-1.5">
                                <MapPin className="w-3 h-3 text-slate-600 shrink-0" />
                                <span className="text-sm text-slate-300 flex-1 truncate">
                                  {c.country}
                                </span>
                                <span className="text-sm font-bold tabular-nums text-slate-300">
                                  {pct}%
                                </span>
                                <span className="text-xs text-slate-600 tabular-nums w-7 text-right shrink-0">
                                  {c.sessions}
                                </span>
                              </div>
                              <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-700"
                                  style={{
                                    width: `${pct}%`,
                                    background: `rgba(251,191,36,${opacity})`,
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Top Pages + Devices row */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Top Pages — horizontal bar chart */}
                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                        Top Pages
                      </p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Most visited URLs — shows where users spend their time
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-600 font-medium shrink-0 mt-0.5">
                      30 days
                    </span>
                  </div>
                  <ResponsiveContainer
                    width="100%"
                    height={Math.max(200, analytics.topPages.length * 34)}
                  >
                    <BarChart
                      layout="vertical"
                      data={analytics.topPages}
                      margin={{ top: 0, right: 44, bottom: 0, left: 0 }}
                      barCategoryGap="30%"
                    >
                      <defs>
                        <linearGradient id="pg" x1="0" y1="0" x2="1" y2="0">
                          <stop
                            offset="0%"
                            stopColor="#f59e0b"
                            stopOpacity={0.9}
                          />
                          <stop
                            offset="100%"
                            stopColor="#f59e0b"
                            stopOpacity={0.35}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        horizontal={false}
                        stroke="#1e293b"
                        strokeDasharray="4 4"
                      />
                      <XAxis
                        type="number"
                        tick={{ fill: "#334155", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                      />
                      <YAxis
                        dataKey="path"
                        type="category"
                        width={90}
                        tick={{
                          fill: "#94a3b8",
                          fontSize: 11,
                          fontFamily: "ui-monospace, monospace",
                        }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        content={<ChartTooltip />}
                        cursor={{ fill: "rgba(255,255,255,0.03)" }}
                      />
                      <Bar
                        dataKey="sessions"
                        radius={[0, 6, 6, 0]}
                        fill="url(#pg)"
                      >
                        <LabelList
                          dataKey="sessions"
                          position="right"
                          style={{
                            fill: "#64748b",
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                          formatter={(v: unknown) =>
                            Number(v) > 0 ? Number(v).toLocaleString() : ""
                          }
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Devices — donut chart */}
                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                        Devices
                      </p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        What type of device visitors use to access your site
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-600 font-medium shrink-0 mt-0.5">
                      30 days
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-5">
                    {/* Donut with center label */}
                    <div className="relative w-full">
                      <ResponsiveContainer width="100%" height={170}>
                        <PieChart>
                          <Pie
                            data={devicePieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={52}
                            outerRadius={78}
                            paddingAngle={3}
                            strokeWidth={0}
                            startAngle={90}
                            endAngle={-270}
                          >
                            {devicePieData?.map((_, i) => (
                              <Cell
                                key={i}
                                fill={DEVICE_COLORS[i % DEVICE_COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip content={<DeviceTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                      {/* Center label */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <p className="text-2xl font-bold text-white tabular-nums leading-none">
                          {totalDeviceSessions.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
                          sessions
                        </p>
                      </div>
                    </div>
                    {/* Legend */}
                    <div className="w-full space-y-2.5">
                      {analytics.deviceCategory.map((d, i) => {
                        const DevIcon =
                          d.category === "mobile"
                            ? Smartphone
                            : d.category === "tablet"
                              ? Tablet
                              : Monitor;
                        const pct = totalDeviceSessions
                          ? Math.round((d.sessions / totalDeviceSessions) * 100)
                          : 0;
                        const color = DEVICE_COLORS[i % DEVICE_COLORS.length];
                        return (
                          <div key={d.category}>
                            <div className="flex items-center gap-2 mb-1.5">
                              <div
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ background: color }}
                              />
                              <DevIcon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              <span className="text-sm text-slate-300 capitalize flex-1">
                                {d.category}
                              </span>
                              <span
                                className="text-sm font-bold tabular-nums"
                                style={{ color }}
                              >
                                {pct}%
                              </span>
                              <span className="text-xs text-slate-600 tabular-nums">
                                {d.sessions.toLocaleString()}
                              </span>
                            </div>
                            <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{
                                  width: `${pct}%`,
                                  background: color,
                                  opacity: 0.6,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
      {/* end modern theme */}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  accentColor,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  accentColor: string;
  /** @deprecated kept for call-site compat */
  bg?: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 relative overflow-hidden hover:border-slate-700 transition-colors group">
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
        style={{ background: accentColor }}
      />
      <Icon className={`w-4 h-4 mb-3 ${color}`} />
      <p className="text-3xl font-bold text-white tabular-nums tracking-tight leading-none">
        {value.toLocaleString()}
      </p>
      <p className="text-xs text-slate-500 font-medium mt-2">{label}</p>
    </div>
  );
}

// ── Users Tab ────────────────────────────────────────────────────────────────

function AdminUsersTab({
  currentUserId,
  dict,
  win98,
}: {
  currentUserId: number;
  dict: Dictionary;
  win98?: boolean;
}) {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true); // start as loading — avoids setState in effect
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [verifyingId, setVerifyingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [viewUser, setViewUser] = useState<{
    user: AuthUser;
    driverProfile: DriverProfile | null;
  } | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const load = useCallback(async (q = "") => {
    try {
      const res = await fetchWithAuth(
        `/api/admin/users?search=${encodeURIComponent(q)}`,
      );
      const data = (await res.json()) as { users?: AuthUser[] };
      setUsers(data.users ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function toggleRole(u: AuthUser) {
    const newRole = u.role === "admin" ? "user" : "admin";
    setUpdatingId(u.id);
    try {
      await fetchWithAuth(`/api/admin/users/${u.id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: newRole }),
      });
      setUsers((prev) =>
        prev.map((x) => (x.id === u.id ? { ...x, role: newRole } : x)),
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function toggleVerify(u: AuthUser) {
    const newVerified = !u.isVerified;
    setVerifyingId(u.id);
    try {
      await fetchWithAuth(`/api/admin/users/${u.id}/verify`, {
        method: "PATCH",
        body: JSON.stringify({ isVerified: newVerified }),
      });
      setUsers((prev) =>
        prev.map((x) =>
          x.id === u.id ? { ...x, isVerified: newVerified } : x,
        ),
      );
    } finally {
      setVerifyingId(null);
    }
  }

  async function deleteUser(id: number) {
    setDeletingId(id);
    setConfirmDeleteId(null);
    try {
      await fetchWithAuth(`/api/admin/users/${id}`, { method: "DELETE" });
      setUsers((prev) => prev.filter((x) => x.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  async function openView(u: AuthUser) {
    setViewUser({ user: u, driverProfile: null });
    setViewLoading(true);
    try {
      const res = await fetchWithAuth(
        `/api/admin/users/${u.id}/driver-profile`,
      );
      const data = (await res.json()) as {
        user: AuthUser;
        driverProfile: DriverProfile | null;
      };
      setViewUser({ user: data.user, driverProfile: data.driverProfile });
    } finally {
      setViewLoading(false);
    }
  }

  if (win98) {
    /* ── Win98 render ── */
    const w98Btn: React.CSSProperties = {
      fontFamily: "inherit",
      fontSize: 11,
      background: "#c0c0c0",
      color: "#000",
      border: "2px solid",
      borderColor: "#fff #808080 #808080 #fff",
      padding: "1px 6px",
      cursor: "pointer",
    };
    const w98BtnSunken: React.CSSProperties = {
      ...w98Btn,
      borderColor: "#808080 #fff #fff #808080",
    };
    const w98Input: React.CSSProperties = {
      fontFamily: "inherit",
      fontSize: 11,
      background: "#fff",
      color: "#000",
      border: "2px solid",
      borderColor: "#808080 #fff #fff #808080",
      padding: "2px 6px",
      outline: "none",
      width: "100%",
      boxSizing: "border-box",
    };
    return (
      <>
        <div
          style={{
            fontFamily: "MS Sans Serif, Arial, sans-serif",
            fontSize: 12,
            color: "#000",
            background: "#c0c0c0",
          }}
        >
          {/* toolbar row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 6,
            }}
          >
            <span style={{ fontWeight: "bold", fontSize: 11 }}>
              {dict.admin.users_title}
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                marginLeft: "auto",
              }}
            >
              <span style={{ fontSize: 11 }}>Search:</span>
              <input
                value={search}
                style={w98Input}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setLoading(true);
                    void load(search);
                  }
                }}
                placeholder={dict.admin.search_placeholder}
              />
              <button
                style={w98Btn}
                onClick={() => {
                  setLoading(true);
                  void load(search);
                }}
              >
                Find
              </button>
            </div>
          </div>

          {/* table */}
          {loading ? (
            <div
              style={{ padding: "20px 0", textAlign: "center", color: "#000" }}
            >
              Loading...
            </div>
          ) : (
            <div
              style={{
                border: "2px solid",
                borderColor: "#808080 #fff #fff #808080",
                background: "#fff",
                overflow: "auto",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 11,
                }}
              >
                <thead>
                  <tr style={{ background: "#000080", color: "#fff" }}>
                    <th
                      style={{
                        padding: "3px 8px",
                        textAlign: "left",
                        fontWeight: "bold",
                        fontSize: 11,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {dict.admin.col_user}
                    </th>
                    <th
                      style={{
                        padding: "3px 8px",
                        textAlign: "left",
                        fontWeight: "bold",
                        fontSize: 11,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {dict.admin.col_provider}
                    </th>
                    <th
                      style={{
                        padding: "3px 8px",
                        textAlign: "left",
                        fontWeight: "bold",
                        fontSize: 11,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {dict.admin.col_joined}
                    </th>
                    <th
                      style={{
                        padding: "3px 8px",
                        textAlign: "left",
                        fontWeight: "bold",
                        fontSize: 11,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {dict.admin.col_status}
                    </th>
                    <th
                      style={{
                        padding: "3px 8px",
                        textAlign: "left",
                        fontWeight: "bold",
                        fontSize: 11,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {dict.admin.col_role}
                    </th>
                    <th
                      style={{
                        padding: "3px 8px",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 11,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {dict.admin.col_actions}
                    </th>
                    <th
                      style={{
                        padding: "3px 8px",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 11,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Profile
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        style={{
                          padding: "16px 8px",
                          textAlign: "center",
                          color: "#808080",
                        }}
                      >
                        {dict.admin.no_users_found}
                      </td>
                    </tr>
                  )}
                  {users.map((u, i) => (
                    <tr
                      key={u.id}
                      style={{ background: i % 2 === 0 ? "#fff" : "#f0f0f0" }}
                    >
                      {/* User */}
                      <td
                        style={{
                          padding: "3px 8px",
                          borderBottom: "1px solid #d4d4d4",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <div
                            style={{
                              width: 20,
                              height: 20,
                              background: "#000080",
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 10,
                              fontWeight: "bold",
                              flexShrink: 0,
                              border: "1px solid #808080",
                            }}
                          >
                            {(u.firstName?.[0] ?? u.email[0]).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: "bold", fontSize: 11 }}>
                              {`${u.firstName} ${u.lastName}`.trim() || "—"}
                              {u.id === currentUserId && (
                                <span
                                  style={{
                                    marginLeft: 4,
                                    color: "#808080",
                                    fontSize: 10,
                                  }}
                                >
                                  {dict.admin.you}
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: 10, color: "#444" }}>
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      {/* Provider */}
                      <td
                        style={{
                          padding: "3px 8px",
                          fontSize: 11,
                          borderBottom: "1px solid #d4d4d4",
                          textTransform: "capitalize",
                        }}
                      >
                        {u.provider}
                      </td>
                      {/* Joined */}
                      <td
                        style={{
                          padding: "3px 8px",
                          fontSize: 11,
                          borderBottom: "1px solid #d4d4d4",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      {/* Status toggle – Win98 */}
                      <td
                        style={{
                          padding: "3px 8px",
                          textAlign: "left",
                          borderBottom: "1px solid #d4d4d4",
                        }}
                      >
                        <button
                          disabled={verifyingId === u.id}
                          onClick={() => void toggleVerify(u)}
                          title={
                            u.isVerified
                              ? "Click to unverify"
                              : "Click to verify manually"
                          }
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                            opacity: verifyingId === u.id ? 0.5 : 1,
                          }}
                        >
                          <span
                            style={{
                              display: "inline-block",
                              position: "relative",
                              flexShrink: 0,
                              width: 28,
                              height: 14,
                              background: u.isVerified ? "#008000" : "#c0c0c0",
                              border: "2px solid",
                              borderColor: "#808080 #fff #fff #808080",
                            }}
                          >
                            <span
                              style={{
                                position: "absolute",
                                top: 1,
                                left: u.isVerified ? 13 : 1,
                                width: 10,
                                height: 8,
                                background: "#c0c0c0",
                                border: "1px solid",
                                borderColor: "#fff #808080 #808080 #fff",
                                transition: "left 0.1s",
                              }}
                            />
                          </span>
                          <span
                            style={{
                              fontSize: 10,
                              color: u.isVerified ? "#006400" : "#804000",
                              fontWeight: "bold",
                              minWidth: 38,
                              display: "inline-block",
                            }}
                          >
                            {verifyingId === u.id
                              ? "..."
                              : u.isVerified
                                ? dict.admin.badge_verified
                                : dict.admin.badge_pending}
                          </span>
                        </button>
                      </td>
                      {/* Role toggle – Win98 */}
                      <td
                        style={{
                          padding: "3px 8px",
                          textAlign: "left",
                          borderBottom: "1px solid #d4d4d4",
                        }}
                      >
                        <button
                          disabled={
                            updatingId === u.id || u.id === currentUserId
                          }
                          onClick={() => void toggleRole(u)}
                          title={
                            u.id === currentUserId
                              ? dict.admin.cannot_change_own_role
                              : dict.admin.toggle_role
                          }
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            background: "none",
                            border: "none",
                            cursor:
                              u.id === currentUserId
                                ? "not-allowed"
                                : "pointer",
                            padding: 0,
                            opacity:
                              updatingId === u.id || u.id === currentUserId
                                ? 0.5
                                : 1,
                          }}
                        >
                          <span
                            style={{
                              display: "inline-block",
                              position: "relative",
                              flexShrink: 0,
                              width: 28,
                              height: 14,
                              background:
                                u.role === "admin" ? "#000080" : "#c0c0c0",
                              border: "2px solid",
                              borderColor: "#808080 #fff #fff #808080",
                            }}
                          >
                            <span
                              style={{
                                position: "absolute",
                                top: 1,
                                left: u.role === "admin" ? 13 : 1,
                                width: 10,
                                height: 8,
                                background: "#c0c0c0",
                                border: "1px solid",
                                borderColor: "#fff #808080 #808080 #fff",
                                transition: "left 0.1s",
                              }}
                            />
                          </span>
                          <span
                            style={{
                              fontSize: 10,
                              color: u.role === "admin" ? "#000080" : "#444",
                              fontWeight:
                                u.role === "admin" ? "bold" : "normal",
                              minWidth: 34,
                              display: "inline-block",
                            }}
                          >
                            {updatingId === u.id
                              ? "..."
                              : u.role === "admin"
                                ? dict.admin.role_admin
                                : dict.admin.role_user}
                          </span>
                        </button>
                      </td>
                      {/* Actions */}
                      <td
                        style={{
                          padding: "3px 8px",
                          textAlign: "center",
                          borderBottom: "1px solid #d4d4d4",
                        }}
                      >
                        {u.id !== currentUserId &&
                          (confirmDeleteId === u.id ? (
                            <span
                              style={{
                                display: "inline-flex",
                                gap: 4,
                                alignItems: "center",
                              }}
                            >
                              <button
                                onClick={() => void deleteUser(u.id)}
                                disabled={deletingId === u.id}
                                style={{
                                  ...w98BtnSunken,
                                  color: "#800000",
                                  opacity: deletingId === u.id ? 0.5 : 1,
                                }}
                              >
                                {deletingId === u.id
                                  ? "..."
                                  : dict.admin.confirm}
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                style={w98Btn}
                              >
                                {dict.admin.cancel}
                              </button>
                            </span>
                          ) : (
                            <button
                              onClick={() => setConfirmDeleteId(u.id)}
                              style={w98Btn}
                              title={dict.admin.delete_user}
                            >
                              Del
                            </button>
                          ))}
                      </td>
                      {/* Profile */}
                      <td
                        style={{
                          padding: "3px 8px",
                          textAlign: "center",
                          borderBottom: "1px solid #d4d4d4",
                        }}
                      >
                        <button
                          style={w98Btn}
                          onClick={() => void openView(u)}
                          title="View profile"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Win98 modal ── */}
        {viewUser &&
          (() => {
            const vu = viewUser;
            const dp = viewUser.driverProfile;
            const w98TitleBar: React.CSSProperties = {
              background: "linear-gradient(to right, #000080, #1084d0)",
              color: "#fff",
              padding: "3px 6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 11,
              fontWeight: "bold",
              userSelect: "none",
            };
            const w98TitleBtn: React.CSSProperties = {
              background: "#c0c0c0",
              border: "2px solid",
              borderColor: "#fff #808080 #808080 #fff",
              color: "#000",
              fontFamily: "inherit",
              fontSize: 11,
              fontWeight: "bold",
              width: 18,
              height: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              lineHeight: 1,
              padding: 0,
              flexShrink: 0,
            };
            const w98LabelStyle: React.CSSProperties = {
              fontSize: 10,
              color: "#808080",
              marginBottom: 2,
            };
            const w98ValStyle: React.CSSProperties = {
              fontSize: 11,
              color: "#000",
              fontWeight: "bold",
            };
            return (
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 50,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 8,
                  background: "rgba(0,0,0,0.45)",
                  overflowY: "auto",
                }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) setViewUser(null);
                }}
              >
                <div
                  style={{
                    width: "100%",
                    maxWidth: 680,
                    background: "#c0c0c0",
                    border: "2px solid",
                    borderColor: "#fff #808080 #808080 #fff",
                    fontFamily: "MS Sans Serif, Arial, sans-serif",
                    fontSize: 11,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Title bar */}
                  <div style={w98TitleBar}>
                    <span>👤 User &amp; Driver Profile</span>
                    <button
                      style={w98TitleBtn}
                      onClick={() => setViewUser(null)}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Two-panel body */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 0 }}>
                    {/* ── Left panel: identity + driver profile ── */}
                    <div
                      style={{
                        flex: "1 1 300px",
                        padding: 10,
                        borderRight: "1px solid #808080",
                        maxHeight: "75vh",
                        overflowY: "auto",
                      }}
                    >
                      {/* Identity card */}
                      <div
                        style={{
                          border: "2px solid",
                          borderColor: "#808080 #fff #fff #808080",
                          background: "#fff",
                          padding: 10,
                          marginBottom: 10,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 60,
                              height: 60,
                              background: "#000080",
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 24,
                              fontWeight: "bold",
                              border: "2px solid #808080",
                              flexShrink: 0,
                              overflow: "hidden",
                            }}
                          >
                            {vu.user.avatarUrl ? (
                              <img
                                src={vu.user.avatarUrl}
                                alt="avatar"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              (
                                vu.user.firstName?.[0] ?? vu.user.email[0]
                              ).toUpperCase()
                            )}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div
                              style={{
                                fontWeight: "bold",
                                fontSize: 12,
                                marginBottom: 2,
                              }}
                            >
                              {`${vu.user.firstName} ${vu.user.lastName}`.trim() ||
                                "—"}
                            </div>
                            <div
                              style={{
                                fontSize: 10,
                                color: "#444",
                                marginBottom: 4,
                                wordBreak: "break-all",
                              }}
                            >
                              {vu.user.email}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                gap: 3,
                                flexWrap: "wrap" as const,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 10,
                                  border: "1px solid #808080",
                                  padding: "0 3px",
                                  background:
                                    vu.user.role === "admin"
                                      ? "#000080"
                                      : "#c0c0c0",
                                  color:
                                    vu.user.role === "admin" ? "#fff" : "#000",
                                }}
                              >
                                {vu.user.role}
                              </span>
                              {vu.user.isVerified ? (
                                <span
                                  style={{
                                    fontSize: 10,
                                    border: "1px solid #008000",
                                    padding: "0 3px",
                                    color: "#006400",
                                    background: "#e0ffe0",
                                  }}
                                >
                                  ✓ Verified
                                </span>
                              ) : (
                                <span
                                  style={{
                                    fontSize: 10,
                                    border: "1px solid #808000",
                                    padding: "0 3px",
                                    color: "#804000",
                                    background: "#ffffd0",
                                  }}
                                >
                                  Unverified
                                </span>
                              )}
                              <span
                                style={{
                                  fontSize: 10,
                                  border: "1px solid #808080",
                                  padding: "0 3px",
                                  textTransform: "capitalize" as const,
                                }}
                              >
                                {vu.user.provider}
                              </span>
                            </div>
                            <div
                              style={{
                                fontSize: 10,
                                color: "#808080",
                                marginTop: 3,
                              }}
                            >
                              Joined{" "}
                              {new Date(vu.user.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Driver profile */}
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: 11,
                          marginBottom: 6,
                          borderBottom: "2px solid #808080",
                          paddingBottom: 2,
                        }}
                      >
                        Driver Profile
                      </div>
                      {viewLoading ? (
                        <div
                          style={{
                            textAlign: "center",
                            padding: "12px 0",
                            color: "#808080",
                          }}
                        >
                          Loading...
                        </div>
                      ) : !dp ? (
                        <div
                          style={{
                            border: "2px solid",
                            borderColor: "#808080 #fff #fff #808080",
                            background: "#fff",
                            padding: 8,
                            color: "#808080",
                            textAlign: "center",
                          }}
                        >
                          No driver profile filled in yet.
                        </div>
                      ) : (
                        <div>
                          <div style={{ marginBottom: 8 }}>
                            <span
                              style={{
                                fontSize: 10,
                                border: "1px solid",
                                padding: "1px 6px",
                                fontWeight: "bold",
                                ...{
                                  available: {
                                    borderColor: "#008000",
                                    color: "#006400",
                                    background: "#e0ffe0",
                                  },
                                  open: {
                                    borderColor: "#808000",
                                    color: "#804000",
                                    background: "#ffffd0",
                                  },
                                  unavailable: {
                                    borderColor: "#808080",
                                    color: "#444",
                                    background: "#f0f0f0",
                                  },
                                }[dp.availability],
                              }}
                            >
                              {
                                {
                                  available: "● Available",
                                  open: "◐ Open to offers",
                                  unavailable: "○ Not available",
                                }[dp.availability]
                              }
                            </span>
                          </div>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: 4,
                              marginBottom: 8,
                            }}
                          >
                            {(
                              [
                                { label: "Phone", val: dp.phone },
                                { label: "WhatsApp", val: dp.whatsapp },
                                { label: "Country", val: dp.country },
                                {
                                  label: "Years exp.",
                                  val:
                                    dp.years_exp != null
                                      ? `${dp.years_exp} yr`
                                      : null,
                                },
                              ] as const
                            ).map(({ label, val }) => (
                              <div
                                key={label}
                                style={{
                                  border: "2px solid",
                                  borderColor: "#808080 #fff #fff #808080",
                                  background: "#fff",
                                  padding: "4px 6px",
                                }}
                              >
                                <div style={w98LabelStyle}>{label}</div>
                                <div style={w98ValStyle}>{val ?? "—"}</div>
                              </div>
                            ))}
                          </div>
                          {dp.license_cats.length > 0 && (
                            <div style={{ marginBottom: 8 }}>
                              <div style={w98LabelStyle}>
                                License categories
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 3,
                                }}
                              >
                                {dp.license_cats.map((c) => (
                                  <span
                                    key={c}
                                    style={{
                                      fontSize: 10,
                                      border: "1px solid #000080",
                                      padding: "1px 5px",
                                      background: "#e0e8ff",
                                      color: "#000080",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {c}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {dp.languages.length > 0 && (
                            <div style={{ marginBottom: 8 }}>
                              <div style={w98LabelStyle}>Languages</div>
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 3,
                                }}
                              >
                                {dp.languages.map((l) => (
                                  <span
                                    key={l}
                                    style={{
                                      fontSize: 10,
                                      border: "1px solid #808080",
                                      padding: "1px 5px",
                                      background: "#f0f0f0",
                                    }}
                                  >
                                    {l}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {dp.bio && (
                            <div>
                              <div style={w98LabelStyle}>Bio</div>
                              <div
                                style={{
                                  border: "2px solid",
                                  borderColor: "#808080 #fff #fff #808080",
                                  background: "#fff",
                                  padding: 6,
                                  fontSize: 11,
                                  lineHeight: 1.5,
                                }}
                              >
                                {dp.bio}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* ── Right panel: documents ── */}
                    <div
                      style={{
                        flex: "1 1 220px",
                        padding: 10,
                        maxHeight: "75vh",
                        overflowY: "auto",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: 11,
                          marginBottom: 6,
                          borderBottom: "2px solid #808080",
                          paddingBottom: 2,
                        }}
                      >
                        Documents
                      </div>
                      {(() => {
                        const docs = [
                          {
                            url: vu.user.licenseFrontUrl,
                            label: "License Front",
                          },
                          {
                            url: vu.user.licenseBackUrl,
                            label: "License Back",
                          },
                          {
                            url: vu.user.passportFrontUrl,
                            label: "Passport Front",
                          },
                          {
                            url: vu.user.passportBackUrl,
                            label: "Passport Back",
                          },
                        ];
                        const hasAny = docs.some((d) => d.url);
                        if (!hasAny)
                          return (
                            <div
                              style={{
                                border: "2px solid",
                                borderColor: "#808080 #fff #fff #808080",
                                background: "#fff",
                                padding: 8,
                                color: "#808080",
                                textAlign: "center",
                                fontSize: 11,
                              }}
                            >
                              No documents uploaded yet.
                            </div>
                          );
                        return (
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: 5,
                            }}
                          >
                            {docs.map(({ url, label }) =>
                              url ? (
                                <div
                                  key={label}
                                  style={{
                                    border: "2px solid",
                                    borderColor: "#808080 #fff #fff #808080",
                                    background: "#fff",
                                    overflow: "hidden",
                                  }}
                                >
                                  {/* Clickable image — opens shared lightbox */}
                                  <div
                                    style={{
                                      position: "relative",
                                      cursor: "zoom-in",
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPreviewUrl(url);
                                    }}
                                    title="Click to enlarge"
                                  >
                                    <img
                                      src={url}
                                      alt={label}
                                      style={{
                                        width: "100%",
                                        aspectRatio: "3/2",
                                        objectFit: "cover",
                                        display: "block",
                                      }}
                                    />
                                    <div
                                      style={{
                                        position: "absolute",
                                        bottom: 2,
                                        right: 2,
                                        background: "rgba(0,0,0,0.5)",
                                        color: "#fff",
                                        fontSize: 9,
                                        padding: "1px 3px",
                                        lineHeight: 1,
                                      }}
                                    >
                                      🔍
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      padding: "3px 4px",
                                      borderTop: "1px solid #c0c0c0",
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontSize: 10,
                                        color: "#444",
                                        marginBottom: 2,
                                      }}
                                    >
                                      {label}
                                    </div>
                                    <a
                                      href={url.replace(
                                        "/upload/",
                                        "/upload/fl_attachment/",
                                      )}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        fontSize: 10,
                                        color: "#000080",
                                        textDecoration: "underline",
                                        cursor: "pointer",
                                        display: "inline-block",
                                      }}
                                    >
                                      ⬇ Download
                                    </a>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  key={label}
                                  style={{
                                    border: "2px solid",
                                    borderColor: "#808080 #fff #fff #808080",
                                    background: "#f0f0f0",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: 8,
                                    gap: 2,
                                    aspectRatio: "3/2",
                                  }}
                                >
                                  <span
                                    style={{ fontSize: 16, color: "#808080" }}
                                  >
                                    🖼
                                  </span>
                                  <span
                                    style={{
                                      fontSize: 10,
                                      color: "#808080",
                                      textAlign: "center",
                                    }}
                                  >
                                    {label}
                                  </span>
                                </div>
                              ),
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Footer */}
                  <div
                    style={{
                      padding: "5px 10px",
                      textAlign: "right",
                      borderTop: "1px solid #808080",
                    }}
                  >
                    <button style={w98Btn} onClick={() => setViewUser(null)}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

        {/* ── Win98 image preview lightbox ── */}
        {previewUrl && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "rgba(0,0,0,0.92)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
            }}
            onClick={() => setPreviewUrl(null)}
          >
            <div
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                background: "#c0c0c0",
                border: "2px solid",
                borderColor: "#fff #808080 #808080 #fff",
                cursor: "pointer",
                padding: "2px 8px",
                fontFamily: "MS Sans Serif, Arial",
                fontSize: 12,
                fontWeight: "bold",
              }}
              onClick={() => setPreviewUrl(null)}
            >
              ✕ Close
            </div>
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                border: "2px solid",
                borderColor: "#fff #808080 #808080 #fff",
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {/* ── Image preview lightbox ── */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <button
            onClick={() => setPreviewUrl(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={previewUrl}
            alt="Preview"
            className="max-w-full max-h-full rounded-xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <h2 className="text-lg font-bold text-white">
            {dict.admin.users_title}
          </h2>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setLoading(true);
                  void load(search);
                }
              }}
              placeholder={dict.admin.search_placeholder}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12 text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">{dict.admin.col_user}</th>
                  <th className="px-4 py-3 text-left hidden sm:table-cell">
                    {dict.admin.col_provider}
                  </th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">
                    {dict.admin.col_joined}
                  </th>
                  <th className="px-4 py-3 text-left">
                    {dict.admin.col_status}
                  </th>
                  <th className="px-4 py-3 text-left">{dict.admin.col_role}</th>
                  <th className="px-4 py-3 text-center">
                    {dict.admin.col_actions}
                  </th>
                  <th className="px-4 py-3 text-center">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-10 text-center text-slate-500"
                    >
                      {dict.admin.no_users_found}
                    </td>
                  </tr>
                )}
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                          {(u.firstName?.[0] ?? u.email[0]).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-white text-xs">
                            {`${u.firstName} ${u.lastName}`.trim() || "—"}
                            {u.id === currentUserId && (
                              <span className="ml-1.5 text-[10px] text-slate-500">
                                {dict.admin.you}
                              </span>
                            )}
                          </p>
                          <p className="text-slate-500 text-xs">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-slate-400 text-xs capitalize">
                        {u.provider}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-slate-400 text-xs">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    {/* Status toggle */}
                    <td className="px-4 py-3">
                      <button
                        disabled={verifyingId === u.id}
                        onClick={() => void toggleVerify(u)}
                        title={
                          u.isVerified
                            ? "Click to unverify"
                            : "Click to verify manually"
                        }
                        className="inline-flex items-center gap-2 disabled:opacity-50 cursor-pointer group"
                      >
                        <span
                          className={`relative inline-flex shrink-0 w-9 h-5 rounded-full transition-colors duration-200 ${
                            u.isVerified
                              ? "bg-green-500"
                              : "bg-slate-600 group-hover:bg-slate-500"
                          }`}
                        >
                          {verifyingId === u.id ? (
                            <Loader2 className="w-3 h-3 text-white animate-spin absolute inset-0 m-auto" />
                          ) : (
                            <span
                              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                                u.isVerified ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          )}
                        </span>
                        <span
                          className={`text-[11px] font-medium min-w-[42px] text-left ${
                            u.isVerified ? "text-green-400" : "text-slate-400"
                          }`}
                        >
                          {u.isVerified
                            ? dict.admin.badge_verified
                            : dict.admin.badge_pending}
                        </span>
                      </button>
                    </td>
                    {/* Role toggle */}
                    <td className="px-4 py-3">
                      <button
                        disabled={updatingId === u.id || u.id === currentUserId}
                        onClick={() => void toggleRole(u)}
                        title={
                          u.id === currentUserId
                            ? dict.admin.cannot_change_own_role
                            : dict.admin.toggle_role
                        }
                        className="inline-flex items-center gap-2 disabled:opacity-50 cursor-pointer group"
                      >
                        <span
                          className={`relative inline-flex shrink-0 w-9 h-5 rounded-full transition-colors duration-200 ${
                            u.role === "admin"
                              ? "bg-amber-500"
                              : "bg-slate-600 group-hover:bg-slate-500"
                          }`}
                        >
                          {updatingId === u.id ? (
                            <Loader2 className="w-3 h-3 text-white animate-spin absolute inset-0 m-auto" />
                          ) : (
                            <span
                              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                                u.role === "admin"
                                  ? "translate-x-4"
                                  : "translate-x-0"
                              }`}
                            />
                          )}
                        </span>
                        <span
                          className={`text-[11px] font-medium min-w-[36px] text-left ${
                            u.role === "admin"
                              ? "text-amber-400"
                              : "text-slate-400"
                          }`}
                        >
                          {u.role === "admin"
                            ? dict.admin.role_admin
                            : dict.admin.role_user}
                        </span>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {u.id !== currentUserId &&
                        (confirmDeleteId === u.id ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => void deleteUser(u.id)}
                              disabled={deletingId === u.id}
                              className="text-[11px] font-bold text-red-400 hover:text-red-300 transition-colors disabled:opacity-40"
                            >
                              {deletingId === u.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                dict.admin.confirm
                              )}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
                            >
                              {dict.admin.cancel}
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(u.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                            title={dict.admin.delete_user}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ))}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => void openView(u)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#36B347] hover:bg-[#36B347]/10 transition-colors"
                        title="View driver profile"
                      >
                        <Truck className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── User profile modal ── */}
      {viewUser &&
        (() => {
          const vu = viewUser;
          const dp = viewUser.driverProfile;
          const docs = [
            { url: vu.user.licenseFrontUrl, label: "License Front" },
            { url: vu.user.licenseBackUrl, label: "License Back" },
            { url: vu.user.passportFrontUrl, label: "Passport Front" },
            { url: vu.user.passportBackUrl, label: "Passport Back" },
          ];
          const hasAnyDoc = docs.some((d) => d.url);
          return (
            <div
              className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm"
              onClick={() => setViewUser(null)}
            >
              {/* Centering wrapper — min-h-full keeps card centered when short, scrolls when tall */}
              <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
                <div
                  className="w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* ── Header ── */}
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 shrink-0">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#36B347]" />
                      <span className="font-bold text-white text-sm">
                        User &amp; Driver Profile
                      </span>
                    </div>
                    <button
                      onClick={() => setViewUser(null)}
                      className="text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* ── Two-column body — left sizes naturally, right stretches to match ── */}
                  <div className="flex flex-col sm:flex-row">
                    {/* Left: identity + driver profile — no overflow, natural height */}
                    <div className="flex-1 min-w-0">
                      {/* Identity card */}
                      <div className="p-5 border-b border-slate-800">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#1a7f45] to-[#36B347] flex items-center justify-center text-2xl font-bold text-white shrink-0 overflow-hidden">
                            {vu.user.avatarUrl ? (
                              <img
                                src={vu.user.avatarUrl}
                                alt="avatar"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              (
                                vu.user.firstName?.[0] ?? vu.user.email[0]
                              ).toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-white text-base truncate">
                              {`${vu.user.firstName} ${vu.user.lastName}`.trim() ||
                                "—"}
                            </p>
                            <p className="text-slate-400 text-xs mt-0.5 truncate">
                              {vu.user.email}
                            </p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              <span
                                className={`text-[10px] font-semibold rounded-full px-2 py-0.5 border ${
                                  vu.user.role === "admin"
                                    ? "text-amber-400 bg-amber-400/10 border-amber-400/30"
                                    : "text-slate-400 bg-slate-800 border-slate-700"
                                }`}
                              >
                                {vu.user.role}
                              </span>
                              {vu.user.isVerified ? (
                                <span className="text-[10px] font-semibold text-green-400 bg-green-400/10 border border-green-400/20 rounded-full px-2 py-0.5">
                                  ✓ Verified
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-2 py-0.5">
                                  Unverified
                                </span>
                              )}
                              <span className="text-[10px] text-slate-500 capitalize bg-slate-800 border border-slate-700 rounded-full px-2 py-0.5">
                                {vu.user.provider}
                              </span>
                            </div>
                            <p className="text-slate-500 text-[11px] mt-1.5">
                              Joined{" "}
                              {new Date(vu.user.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Driver profile */}
                      <div className="p-5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                          Driver Profile
                        </p>
                        {viewLoading ? (
                          <div className="flex justify-center py-8">
                            <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
                          </div>
                        ) : !dp ? (
                          <div className="rounded-xl bg-slate-800/50 border border-slate-700 p-4 text-sm text-slate-400 text-center">
                            No driver profile filled in yet.
                          </div>
                        ) : (
                          <div className="space-y-5">
                            {/* Status badge */}
                            <div>
                              {
                                {
                                  available: (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-400 bg-green-400/10 border border-green-400/30 rounded-full px-3 py-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                                      Available
                                    </span>
                                  ),
                                  open: (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/30 rounded-full px-3 py-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                                      Open to offers
                                    </span>
                                  ),
                                  unavailable: (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 bg-slate-800 border border-slate-700 rounded-full px-3 py-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 inline-block" />
                                      Not available
                                    </span>
                                  ),
                                }[dp.availability]
                              }
                            </div>

                            {/* Contact grid */}
                            <div className="grid grid-cols-2 gap-2">
                              <AdminInfoField
                                label="Phone"
                                value={dp.phone}
                                icon={<Phone className="w-3 h-3" />}
                              />
                              <AdminInfoField
                                label="WhatsApp"
                                value={dp.whatsapp}
                                icon={<Phone className="w-3 h-3" />}
                              />
                              <AdminInfoField
                                label="Country"
                                value={dp.country}
                                icon={<MapPin className="w-3 h-3" />}
                              />
                              <AdminInfoField
                                label="Years exp."
                                value={
                                  dp.years_exp != null
                                    ? `${dp.years_exp} yr`
                                    : null
                                }
                              />
                            </div>

                            {dp.license_cats.length > 0 && (
                              <div>
                                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                  License categories
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {dp.license_cats.map((c) => (
                                    <span
                                      key={c}
                                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#1a7f45]/20 border border-[#36B347]/40 text-[#36B347]"
                                    >
                                      {c}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {dp.languages.length > 0 && (
                              <div>
                                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                  Languages
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {dp.languages.map((l) => (
                                    <span
                                      key={l}
                                      className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 border border-slate-700 text-slate-300"
                                    >
                                      {l}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {dp.bio && (
                              <div>
                                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                  Bio
                                </p>
                                <p className="text-sm text-slate-300 bg-slate-800/50 rounded-xl border border-slate-700 p-3 leading-relaxed">
                                  {dp.bio}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: documents — scrollable, ID-card ratio images */}
                    <div className="w-full sm:w-96 shrink-0 border-t sm:border-t-0 sm:border-l border-slate-800 p-5 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 shrink-0">
                        Documents
                      </p>
                      {!hasAnyDoc ? (
                        <div className="rounded-xl bg-slate-800/50 border border-slate-700 p-6 text-sm text-slate-400 text-center">
                          No documents uploaded yet.
                        </div>
                      ) : (
                        /* 2-per-row, ID-card ratio, click to preview */
                        <div className="grid grid-cols-2 gap-3">
                          {docs.map(({ url, label }) =>
                            url ? (
                              <div
                                key={label}
                                className="rounded-xl overflow-hidden border border-slate-700 bg-slate-800/60 flex flex-col"
                              >
                                {/* Clickable image — opens lightbox */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewUrl(url);
                                  }}
                                  className="relative aspect-[8/5] w-full block cursor-zoom-in group"
                                >
                                  <img
                                    src={url}
                                    alt={label}
                                    className="absolute inset-0 w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-6 h-6 text-white drop-shadow"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth={2}
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0zm0 0l2 2"
                                      />
                                    </svg>
                                  </div>
                                </button>
                                {/* Label + download — always visible */}
                                <div className="flex items-center justify-between px-2 py-1.5 border-t border-slate-700 shrink-0">
                                  <p className="text-[10px] font-medium text-slate-400 truncate">
                                    {label}
                                  </p>
                                  <a
                                    href={url.replace(
                                      "/upload/",
                                      "/upload/fl_attachment/",
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-1 text-[10px] font-semibold text-[#36B347] hover:text-white transition-colors shrink-0 ml-2"
                                  >
                                    <Download className="w-3 h-3" /> DL
                                  </a>
                                </div>
                              </div>
                            ) : (
                              <div
                                key={label}
                                className="rounded-xl border border-dashed border-slate-700/50 bg-slate-800/30 aspect-[8/5] flex flex-col items-center justify-center gap-1.5"
                              >
                                <FileImage className="w-5 h-5 text-slate-600" />
                                <p className="text-[10px] text-slate-600 text-center px-2">
                                  {label}
                                </p>
                              </div>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
    </>
  );
}

function AdminInfoField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | null;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-slate-800/50 border border-slate-700 p-3">
      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5 flex items-center gap-1">
        {icon}
        {label}
      </p>
      <p className="text-sm text-white">{value ?? "—"}</p>
    </div>
  );
}
