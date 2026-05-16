// THIS FILE IS THE THIN ROUTER — all tab content lives in ./admin-dashboard/
"use client";

import React, { Suspense, lazy, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  BarChart3,
  Mail,
  Loader2,
  User,
  LogOut,
  Palette,
} from "lucide-react";
import AdminEmailsTab from "@/components/AdminEmailsTab";
import AdminCustomizationTab from "@/components/AdminCustomizationTab";
import { useAuth } from "@/context/AuthContext";
import { fetchWithAuth } from "@/lib/auth-client";
import type { Dictionary } from "@/lib/getDictionary";
import { type Tab, TABS } from "./admin-dashboard/types";
import {
  Win98Window,
  W98IcUser,
  W98IcMail,
  W98IcGear,
} from "./admin-dashboard/Win98Helpers";

const OverviewTab = lazy(() => import("./admin-dashboard/OverviewTab"));
const UsersTab = lazy(() => import("./admin-dashboard/UsersTab"));

const TAB_ICONS: Record<Tab, React.ElementType> = {
  overview: BarChart3,
  users: Users,
  emails: Mail,
  customization: Palette,
};

const TabSpinner = () => (
  <div className="flex items-center justify-center h-40 text-slate-500">
    <Loader2 className="w-6 h-6 animate-spin" />
  </div>
);

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
      className={`min-h-screen pt-20 sm:pt-24 overflow-x-hidden${win98 ? "" : " bg-slate-950 text-white"}`}
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
          [data-win98] .bg-amber-400\/5,
          [data-win98] .bg-amber-400\/10,
          [data-win98] .bg-amber-400\/20,
          [data-win98] .bg-amber-400\/30 { background-color: #f0f0f0 !important; }
          [data-win98] .border-amber-400,
          [data-win98] .border-amber-400\/20,
          [data-win98] .border-amber-400\/30,
          [data-win98] .border-amber-400\/50 { border-color: #808080 !important; }
          [data-win98] .bg-amber-400,
          [data-win98] .bg-amber-300 {
            background-color: #c0c0c0 !important;
            border: 2px solid !important;
            border-color: #fff #808080 #808080 #fff !important;
            color: #000 !important;
          }
          [data-win98] .hover\:bg-amber-300:hover { background-color: #d4d4d4 !important; }
          [data-win98] .bg-red-900\/20,
          [data-win98] .bg-red-900\/10,
          [data-win98] .bg-red-900\/40,
          [data-win98] .bg-red-800\/20 { background-color: #ffe0e0 !important; }
          [data-win98] .bg-emerald-500\/10,
          [data-win98] .bg-green-500\/10 { background-color: #d4f0d4 !important; }
          [data-win98] .bg-blue-600,
          [data-win98] .bg-blue-700 { background-color: #000080 !important; }
          [data-win98] div.bg-slate-900,
          [data-win98] div.bg-slate-800 {
            border: 2px solid !important;
            border-color: #fff #808080 #808080 #fff !important;
          }
          [data-win98] div.bg-slate-800.border,
          [data-win98] div.bg-slate-800.rounded-xl,
          [data-win98] div.bg-slate-800.rounded-lg {
            border-color: #808080 #fff #fff #808080 !important;
          }
          [data-win98] div.bg-amber-400\/5,
          [data-win98] div.bg-amber-400\/10 {
            border: 2px solid !important;
            border-color: #808080 #fff #fff #808080 !important;
            background-color: #f0f0f0 !important;
          }
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
          [data-win98] .rounded-2xl,
          [data-win98] .rounded-xl,
          [data-win98] .rounded-lg,
          [data-win98] .rounded-md,
          [data-win98] .rounded-full,
          [data-win98] .rounded { border-radius: 0 !important; }
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
          [data-win98] button.bg-amber-400\/10:not([style]),
          [data-win98] button.bg-amber-400\/20:not([style]) {
            background-color: #e0e0e0 !important;
            border-color: #808080 #fff #fff #808080 !important;
          }
          [data-win98] .hover\\:bg-slate-800\\/40:hover {
            background-color: #000080 !important; color: #fff !important;
          }
          [data-win98] .hover\\:bg-slate-800\\/40:hover * { color: #fff !important; }
          [data-win98] svg.lucide { display: none !important; }
          [data-iconpicker] svg.lucide { display: inline-block !important; width: 12px !important; height: 12px !important; }
          [data-win98] a { color: #000080 !important; text-decoration: underline; }
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
          [data-win98] ::-webkit-scrollbar { width: 16px; height: 16px; }
          [data-win98] ::-webkit-scrollbar-track { background: #c0c0c0; border: 1px solid #808080; }
          [data-win98] ::-webkit-scrollbar-thumb {
            background: #c0c0c0;
            border: 2px solid;
            border-color: #fff #808080 #808080 #fff;
          }
        `}</style>
      )}

      {/* ── Sticky header ── */}
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
            className="flex flex-wrap items-center gap-x-3 gap-y-2"
            style={
              win98
                ? { padding: "6px 0" }
                : { minHeight: 56, paddingTop: 8, paddingBottom: 8 }
            }
          >
            {/* Left: identity */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: win98 ? 8 : 12,
                flex: "1 1 auto",
                minWidth: 0,
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
                flexWrap: "wrap",
                gap: win98 ? 6 : 8,
                flex: "0 1 auto",
              }}
            >
              {/* Win98 toggle */}
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

              {/* Profile link */}
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

              {/* Back to site */}
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
            <Suspense fallback={<TabSpinner />}>
              <OverviewTab dict={dict} win98={win98} />
            </Suspense>
          ) : (
            <div className="max-w-[83.6352rem] mx-auto">
              <Suspense fallback={<TabSpinner />}>
                <OverviewTab dict={dict} win98={win98} />
              </Suspense>
            </div>
          ))}
        {active === "users" &&
          (win98 ? (
            <Win98Window title="Users Management" icon={<W98IcUser />}>
              <Suspense fallback={<TabSpinner />}>
                <UsersTab currentUserId={user.id} dict={dict} win98 />
              </Suspense>
            </Win98Window>
          ) : (
            <div className="max-w-[83.6352rem] mx-auto">
              <Suspense fallback={<TabSpinner />}>
                <UsersTab currentUserId={user.id} dict={dict} />
              </Suspense>
            </div>
          ))}
        {active === "emails" &&
          (win98 ? (
            <Win98Window title="Email Inbox" icon={<W98IcMail />}>
              <AdminEmailsTab dict={dict} win98 />
            </Win98Window>
          ) : (
            <div className="max-w-[83.6352rem] mx-auto px-2 pt-25 pb-25">
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
