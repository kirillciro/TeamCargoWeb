"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Settings,
  ArrowLeft,
  LogOut,
  ShieldCheck,
  Truck,
  MapPin,
  Phone,
  Globe,
  Loader2,
  Camera,
  FileImage,
  Upload,
  CheckCircle2,
  UserCircle,
  IdCard,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { Dictionary } from "@/lib/getDictionary";

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

const LICENSE_CATS = ["B", "BE", "C1", "C1E", "C", "CE", "D1", "D", "DE"];
const LANGUAGES = [
  "English",
  "Dutch",
  "German",
  "French",
  "Polish",
  "Romanian",
  "Bulgarian",
  "Lithuanian",
  "Latvian",
  "Czech",
  "Slovak",
  "Hungarian",
  "Italian",
  "Spanish",
  "Portuguese",
  "Ukrainian",
  "Russian",
  "Turkish",
];

function computeCompleteness(
  user: {
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    licenseFrontUrl: string | null;
    licenseBackUrl: string | null;
    passportFrontUrl: string | null;
    passportBackUrl: string | null;
  },
  dp: DriverProfile | null,
): number {
  let score = 0;
  if (user.firstName && user.lastName) score += 8;
  if (user.avatarUrl) score += 7;
  if (dp?.phone) score += 7;
  if (dp?.whatsapp) score += 5;
  if (dp?.country) score += 8;
  if (dp?.license_cats?.length) score += 15;
  if (dp?.years_exp !== null && dp?.years_exp !== undefined) score += 8;
  if (dp?.languages?.length) score += 10;
  if (dp?.availability) score += 5;
  if (dp?.bio) score += 7;
  if (user.licenseFrontUrl) score += 5;
  if (user.licenseBackUrl) score += 5;
  if (user.passportFrontUrl) score += 5;
  if (user.passportBackUrl) score += 5;
  return score;
}

type Tab = "overview" | "settings";
const TABS: Tab[] = ["overview", "settings"];

const TAB_ICONS: Record<Tab, React.ElementType> = {
  overview: LayoutDashboard,
  settings: Settings,
};

export default function ProfileDashboard({
  lang,
  dict,
}: {
  lang: string;
  dict: Dictionary;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading, logout, refreshUser } = useAuth();
  const initialTab = (searchParams.get("tab") as Tab | null) ?? "overview";
  const [active, setActive] = useState<Tab>(
    TABS.includes(initialTab as Tab) ? (initialTab as Tab) : "overview",
  );
  const [driverProfile, setDriverProfile] = useState<DriverProfile | null>(
    null,
  );
  const [dpLoading, setDpLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/${lang}`);
    }
  }, [user, loading, lang, router]);

  useEffect(() => {
    if (!user) return;
    import("@/lib/auth-client")
      .then(({ fetchWithAuth }) =>
        fetchWithAuth("/api/profile/driver").then(async (r) => {
          if (r.ok) setDriverProfile((await r.json()) as DriverProfile | null);
        }),
      )
      .catch(() => {})
      .finally(() => setDpLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 sm:pt-24 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#36B347] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const initial = (user.firstName?.[0] ?? user.email[0]).toUpperCase();
  const fullName = `${user.firstName} ${user.lastName}`.trim();

  return (
    <div
      data-profile
      className="min-h-screen bg-slate-950 text-white pt-20 sm:pt-24"
    >
      {/* ── Top bar ── */}
      <div className="sticky top-16 sm:top-20 z-20 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Brand row */}
          <div className="h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#1a7f45] to-[#36B347] flex items-center justify-center text-sm font-bold text-white shrink-0 overflow-hidden">
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt="avatar"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initial
                )}
              </div>
              <span className="font-semibold text-base text-white">
                {fullName || user.email}
              </span>
              {user.role === "admin" && (
                <span className="hidden sm:inline text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/30">
                  ADMIN
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {user.role === "admin" && (
                <Link
                  href={`/${lang}/admin`}
                  className="hidden sm:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-400 text-amber-900 hover:bg-amber-300 transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  {dict.nav.admin_dashboard}
                </Link>
              )}
              <button
                onClick={() =>
                  void logout().then(() => router.replace(`/${lang}`))
                }
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{dict.nav.logout}</span>
              </button>
              <Link
                href={`/${lang}`}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {dict.profile.back_to_site}
                </span>
              </Link>
            </div>
          </div>

          {/* Tab row */}
          <div className="flex gap-0 -mb-px overflow-x-auto">
            {TABS.map((key) => {
              const Icon = TAB_ICONS[key];
              return (
                <button
                  key={key}
                  onClick={() => setActive(key)}
                  className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    active === key
                      ? "border-[#36B347] text-[#36B347]"
                      : "border-transparent text-slate-400 hover:text-white hover:border-slate-600"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {key === "overview"
                    ? dict.profile.tab_overview
                    : dict.profile.tab_settings}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {active === "overview" && (
          <ProfileOverview
            user={user}
            lang={lang}
            dict={dict}
            completeness={computeCompleteness(user, driverProfile)}
            setActive={setActive}
          />
        )}
        {active === "settings" && (
          <ProfileSettings
            key={dpLoading ? "loading" : "loaded"}
            user={user}
            driverProfile={driverProfile}
            dpLoading={dpLoading}
            onDriverProfileSaved={setDriverProfile}
            onAvatarSaved={refreshUser}
            setActive={setActive}
            dict={dict}
          />
        )}
      </div>
    </div>
  );
}

// ── Overview Tab ─────────────────────────────────────────────────────────────

function ProfileOverview({
  user,
  lang,
  dict,
  completeness,
  setActive,
}: {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isVerified: boolean;
    provider: string;
    createdAt: string;
    avatarUrl: string | null;
  };
  lang: string;
  dict: Dictionary;
  completeness: number;
  setActive: (tab: Tab) => void;
}) {
  const joined = new Date(user.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Welcome card */}
      <div className="rounded-2xl bg-linear-to-br from-[#0d2e1a] to-[#0a1f12] border border-[#1a7f45]/30 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#1a7f45] to-[#36B347] flex items-center justify-center text-2xl font-bold text-white shrink-0 overflow-hidden">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt="avatar"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              (user.firstName?.[0] ?? user.email[0]).toUpperCase()
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              {dict.profile.welcome_back}, {user.firstName || "there"}!
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">{user.email}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {user.isVerified ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-400 bg-green-400/10 border border-green-400/20 rounded-full px-2.5 py-0.5">
                  <ShieldCheck className="w-3 h-3" /> {dict.profile.verified}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-2.5 py-0.5">
                  {dict.profile.not_verified}
                </span>
              )}
              {user.role === "admin" && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full px-2.5 py-0.5">
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile completeness */}
      {completeness < 100 && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-bold text-white">
                {dict.profile.completeness_title}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {dict.profile.completeness_sub}
              </p>
            </div>
            <span className="text-lg font-bold text-[#36B347]">
              {completeness}%
            </span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#36B347] rounded-full transition-all duration-500"
              style={{ width: `${completeness}%` }}
            />
          </div>
          <button
            onClick={() => setActive("settings")}
            className="mt-3 text-xs text-[#36B347] hover:text-[#4ade80] font-semibold transition-colors"
          >
            {dict.profile.complete_cta}
          </button>
        </div>
      )}

      {/* Info grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        <InfoCard
          label={dict.profile.label_full_name}
          value={`${user.firstName} ${user.lastName}`.trim() || "—"}
        />
        <InfoCard label={dict.profile.label_email} value={user.email} />
        <InfoCard
          label={dict.profile.label_signin_method}
          value={
            user.provider === "local"
              ? dict.profile.signin_email
              : user.provider
          }
        />
        <InfoCard label={dict.profile.label_member_since} value={joined} />
      </div>

      {/* Quick links */}
      {user.role === "admin" && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
          <h2 className="text-sm font-bold text-slate-300 mb-3">
            {dict.profile.admin_tools}
          </h2>
          <Link
            href={`/${lang}/admin`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 text-amber-900 text-sm font-bold hover:bg-amber-300 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            {dict.nav.admin_dashboard}
          </Link>
        </div>
      )}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-sm text-white font-medium">{value}</p>
    </div>
  );
}

// ── Settings Tab ─────────────────────────────────────────────────────────────

function ProfileSettings({
  user,
  driverProfile,
  dpLoading,
  onDriverProfileSaved,
  onAvatarSaved,
  dict,
}: {
  user: {
    email: string;
    provider: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    dateOfBirth: string | null;
    licenseFrontUrl: string | null;
    licenseBackUrl: string | null;
    passportFrontUrl: string | null;
    passportBackUrl: string | null;
  };
  driverProfile: DriverProfile | null;
  dpLoading: boolean;
  onDriverProfileSaved: (dp: DriverProfile) => void;
  onAvatarSaved: () => Promise<void>;
  setActive: (tab: Tab) => void;
  dict: Dictionary;
}) {
  // ── DOB ──
  const [dob, setDob] = useState(user.dateOfBirth ?? "");

  // ── Driver profile fields (single object to avoid effect batching warnings) ──
  type DpFields = {
    phone: string;
    whatsapp: string;
    country: string;
    availability: DriverProfile["availability"];
    licenseCats: string[];
    yearsExp: string;
    languages: string[];
    bio: string;
  };
  function fieldsFromProfile(dp: DriverProfile | null): DpFields {
    return {
      phone: dp?.phone ?? "",
      whatsapp: dp?.whatsapp ?? "",
      country: dp?.country ?? "",
      availability: dp?.availability ?? "available",
      licenseCats: dp?.license_cats ?? [],
      yearsExp: dp?.years_exp != null ? String(dp.years_exp) : "",
      languages: dp?.languages ?? [],
      bio: dp?.bio ?? "",
    };
  }
  const [dp, setDp] = useState<DpFields>(() =>
    fieldsFromProfile(driverProfile),
  );

  // ── Save state ──
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  function calcAge(dobStr: string): number | null {
    if (!dobStr) return null;
    const birth = new Date(dobStr);
    if (isNaN(birth.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    if (
      today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() &&
        today.getDate() < birth.getDate())
    )
      age--;
    return age >= 0 && age < 120 ? age : null;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveError(null);
    setSaving(true);
    const dpPayload: DriverProfile = {
      phone: dp.phone || null,
      whatsapp: dp.whatsapp || null,
      country: dp.country || null,
      availability: dp.availability,
      license_cats: dp.licenseCats,
      years_exp: dp.yearsExp !== "" ? Number(dp.yearsExp) : null,
      languages: dp.languages,
      bio: dp.bio || null,
    };
    try {
      const { fetchWithAuth } = await import("@/lib/auth-client");
      const [dobRes, dpRes] = await Promise.all([
        fetchWithAuth("/api/profile/dob", {
          method: "PUT",
          body: JSON.stringify({ dateOfBirth: dob || null }),
        }),
        fetchWithAuth("/api/profile/driver", {
          method: "PUT",
          body: JSON.stringify(dpPayload),
        }),
      ]);
      if (!dobRes.ok || !dpRes.ok) {
        setSaveError(dict.profile.save_error);
        return;
      }
      onDriverProfileSaved(dpPayload);
      await onAvatarSaved();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setSaveError(dict.profile.save_error_generic);
    } finally {
      setSaving(false);
    }
  }

  const inputCls =
    "w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#36B347]/50 focus:border-[#36B347]";
  const labelCls = "block text-xs text-slate-400 mb-1.5";
  const age = calcAge(dob);

  return (
    <form onSubmit={(e) => void handleSave(e)}>
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden divide-y divide-slate-800">
        {/* ── Profile image ── */}
        <div className="p-6">
          <div className="flex items-center gap-2.5 mb-1">
            <UserCircle className="w-4 h-4 text-[#36B347]" />
            <h2 className="text-sm font-bold text-white">
              {dict.profile.section_photo}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mb-5">
            {dict.profile.photo_hint}
          </p>
          <AvatarUpload
            currentUrl={user.avatarUrl}
            initial={(user.firstName?.[0] ?? user.email[0]).toUpperCase()}
            onSaved={onAvatarSaved}
            dict={dict}
          />
        </div>

        {/* ── Personal details ── */}
        <div className="p-6 space-y-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <IdCard className="w-4 h-4 text-[#36B347]" />
              <h2 className="text-sm font-bold text-white">
                {dict.profile.section_personal}
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              {dict.profile.personal_hint}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 max-w-sm">
            <div>
              <p className={labelCls}>{dict.profile.label_first_name}</p>
              <div className="w-full bg-slate-800/40 border border-slate-700/60 rounded-lg px-3 py-2.5 text-sm text-slate-300 select-none">
                {user.firstName || "—"}
              </div>
            </div>
            <div>
              <p className={labelCls}>{dict.profile.label_last_name}</p>
              <div className="w-full bg-slate-800/40 border border-slate-700/60 rounded-lg px-3 py-2.5 text-sm text-slate-300 select-none">
                {user.lastName || "—"}
              </div>
            </div>
          </div>
          <div className="max-w-sm">
            <label className={labelCls}>{dict.profile.label_dob}</label>
            <div className="flex items-center gap-3">
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                max={new Date().toISOString().slice(0, 10)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-base text-white focus:outline-none focus:ring-2 focus:ring-[#36B347]/50 focus:border-[#36B347] [color-scheme:dark]"
              />
              {age !== null && (
                <span className="text-sm font-semibold text-[#36B347]">
                  {age} {dict.profile.years_old}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Driver profile ── */}
        <div className="p-6 space-y-5">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <Truck className="w-4 h-4 text-[#36B347]" />
              <h2 className="text-sm font-bold text-white">
                {dict.profile.section_driver}
              </h2>
            </div>
            <p className="text-xs text-slate-400">{dict.profile.driver_hint}</p>
          </div>
          {dpLoading ? (
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />{" "}
              {dict.profile.loading}
            </div>
          ) : (
            <div className="space-y-5">
              {/* Contact */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>
                    <Phone className="inline w-3 h-3 mr-1 opacity-60" />
                    {dict.profile.label_phone}
                  </label>
                  <input
                    type="tel"
                    value={dp.phone}
                    onChange={(e) =>
                      setDp((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    className={inputCls}
                    placeholder="+31 6 12345678"
                  />
                </div>
                <div>
                  <label className={labelCls}>
                    <Phone className="inline w-3 h-3 mr-1 opacity-60" />
                    {dict.profile.label_whatsapp}
                  </label>
                  <input
                    type="tel"
                    value={dp.whatsapp}
                    onChange={(e) =>
                      setDp((prev) => ({ ...prev, whatsapp: e.target.value }))
                    }
                    className={inputCls}
                    placeholder="+31 6 12345678"
                  />
                </div>
              </div>

              {/* Location & availability */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>
                    <MapPin className="inline w-3 h-3 mr-1 opacity-60" />
                    {dict.profile.label_country}
                  </label>
                  <input
                    type="text"
                    value={dp.country}
                    onChange={(e) =>
                      setDp((prev) => ({ ...prev, country: e.target.value }))
                    }
                    className={inputCls}
                    placeholder="Netherlands"
                  />
                </div>
                <div>
                  <label className={labelCls}>
                    {dict.profile.label_availability}
                  </label>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {(
                      [
                        [
                          "available",
                          dict.profile.avail_available,
                          "text-green-400 bg-green-400/10 border-green-400/30",
                        ],
                        [
                          "open",
                          dict.profile.avail_open,
                          "text-amber-400 bg-amber-400/10 border-amber-400/30",
                        ],
                        [
                          "unavailable",
                          dict.profile.avail_unavailable,
                          "text-slate-400 bg-slate-800 border-slate-700",
                        ],
                      ] as [DriverProfile["availability"], string, string][]
                    ).map(([val, lbl, cls]) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() =>
                          setDp((prev) => ({ ...prev, availability: val }))
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                          dp.availability === val
                            ? cls
                            : "text-slate-500 bg-slate-800/50 border-slate-700/50 hover:border-slate-600"
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* License categories */}
              <div>
                <label className={labelCls}>
                  {dict.profile.label_license_cats}
                </label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {LICENSE_CATS.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() =>
                        setDp((prev) => ({
                          ...prev,
                          licenseCats: prev.licenseCats.includes(cat)
                            ? prev.licenseCats.filter((x) => x !== cat)
                            : [...prev.licenseCats, cat],
                        }))
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        dp.licenseCats.includes(cat)
                          ? "bg-[#1a7f45] border-[#36B347] text-white"
                          : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="max-w-40">
                <label className={labelCls}>
                  {dict.profile.label_years_exp}
                </label>
                <input
                  type="number"
                  min={0}
                  max={60}
                  value={dp.yearsExp}
                  onChange={(e) =>
                    setDp((prev) => ({ ...prev, yearsExp: e.target.value }))
                  }
                  className={inputCls}
                  placeholder="e.g. 5"
                />
              </div>

              {/* Languages */}
              <div>
                <label className={labelCls}>
                  <Globe className="inline w-3 h-3 mr-1 opacity-60" />
                  {dict.profile.label_languages}
                </label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() =>
                        setDp((prev) => ({
                          ...prev,
                          languages: prev.languages.includes(lang)
                            ? prev.languages.filter((x) => x !== lang)
                            : [...prev.languages, lang],
                        }))
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        dp.languages.includes(lang)
                          ? "bg-[#1a7f45] border-[#36B347] text-white"
                          : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className={labelCls}>{dict.profile.label_bio}</label>
                <textarea
                  value={dp.bio}
                  onChange={(e) =>
                    setDp((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  rows={3}
                  maxLength={500}
                  className={`${inputCls} resize-none`}
                  placeholder="Experienced CE driver with 8 years of international freight…"
                />
                <p className="text-xs text-slate-500 mt-1">
                  {dp.bio.length}/500
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Documents ── */}
        <div className="p-6 space-y-5">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <FileImage className="w-4 h-4 text-[#36B347]" />
              <h2 className="text-sm font-bold text-white">
                {dict.profile.section_documents}
              </h2>
            </div>
            <p className="text-xs text-slate-400">{dict.profile.docs_hint}</p>
          </div>
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                {dict.profile.doc_license}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <DocUpload
                  label={dict.profile.doc_front}
                  docType="license_front"
                  currentUrl={user.licenseFrontUrl}
                  onSaved={onAvatarSaved}
                />
                <DocUpload
                  label={dict.profile.doc_back}
                  docType="license_back"
                  currentUrl={user.licenseBackUrl}
                  onSaved={onAvatarSaved}
                />
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                {dict.profile.doc_passport}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <DocUpload
                  label={dict.profile.doc_front}
                  docType="passport_front"
                  currentUrl={user.passportFrontUrl}
                  onSaved={onAvatarSaved}
                />
                <DocUpload
                  label={dict.profile.doc_back}
                  docType="passport_back"
                  currentUrl={user.passportBackUrl}
                  onSaved={onAvatarSaved}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Save button ── */}
      {saveError && <p className="text-sm text-red-400 mt-4">{saveError}</p>}
      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          disabled={saving || dpLoading}
          className="px-6 py-3 rounded-xl bg-[#1a7f45] hover:bg-[#36B347] text-white text-sm font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> {dict.profile.saving}
            </>
          ) : saved ? (
            dict.profile.saved
          ) : (
            dict.profile.save
          )}
        </button>
      </div>
    </form>
  );
}

// ── Avatar Upload ─────────────────────────────────────────────────────────────

function AvatarUpload({
  currentUrl,
  initial,
  onSaved,
  dict,
}: {
  currentUrl: string | null;
  initial: string;
  onSaved: () => Promise<void>;
  dict: Dictionary;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5 MB.");
      return;
    }
    setError(null);
    setUploading(true);
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    try {
      const { fetchWithAuth } = await import("@/lib/auth-client");
      const form = new FormData();
      form.append("avatar", file);
      const res = await fetchWithAuth("/api/profile/avatar", {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const d = (await res.json()) as { error?: string };
        setError(d.error ?? "Upload failed.");
        setPreview(currentUrl);
        return;
      }
      await onSaved();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("An unexpected error occurred.");
      setPreview(currentUrl);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex items-center gap-5">
      {/* Avatar circle */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="relative w-20 h-20 rounded-2xl bg-linear-to-br from-[#1a7f45] to-[#36B347] flex items-center justify-center text-2xl font-bold text-white shrink-0 overflow-hidden group"
      >
        {preview ? (
          <Image src={preview} alt="avatar" fill className="object-cover" />
        ) : (
          initial
        )}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          {uploading ? (
            <Loader2 className="w-5 h-5 animate-spin text-white" />
          ) : (
            <Camera className="w-5 h-5 text-white" />
          )}
        </div>
      </button>

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-base text-white font-semibold transition-colors disabled:opacity-50"
        >
          {uploading
            ? dict.profile.uploading
            : saved
              ? dict.profile.saved
              : dict.profile.change_photo}
        </button>
        <p className="text-xs text-slate-500">JPG, PNG or WebP · max 5 MB</p>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

// ── Document Upload ───────────────────────────────────────────────────────────

function DocUpload({
  label,
  docType,
  currentUrl,
  onSaved,
}: {
  label: string;
  docType: string;
  currentUrl: string | null;
  onSaved: () => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Image files only.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Max 10 MB.");
      return;
    }
    setError(null);
    setUploading(true);
    setPreview(URL.createObjectURL(file));
    try {
      const { fetchWithAuth } = await import("@/lib/auth-client");
      const form = new FormData();
      form.append("document", file);
      const res = await fetchWithAuth(`/api/profile/documents/${docType}`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const d = (await res.json()) as { error?: string };
        setError(d.error ?? "Upload failed.");
        setPreview(currentUrl);
        return;
      }
      await onSaved();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Unexpected error.");
      setPreview(currentUrl);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="relative w-full aspect-[3/2] rounded-xl border-2 border-dashed border-slate-700 hover:border-[#36B347]/60 bg-slate-800/50 hover:bg-slate-800 transition-colors overflow-hidden group flex items-center justify-center"
      >
        {preview ? (
          <Image src={preview} alt={label} fill className="object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-slate-500 group-hover:text-slate-400 transition-colors">
            <Upload className="w-5 h-5" />
            <span className="text-xs font-medium">{label}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {uploading ? (
            <Loader2 className="w-5 h-5 animate-spin text-white" />
          ) : saved ? (
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          ) : (
            <Camera className="w-5 h-5 text-white" />
          )}
        </div>
      </button>
      <p className="text-[11px] text-center font-medium text-slate-400">
        {label}
      </p>
      {error && <p className="text-[11px] text-red-400 text-center">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
