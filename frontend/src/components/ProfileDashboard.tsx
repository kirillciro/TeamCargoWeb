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
  "English", "Dutch", "German", "French", "Polish", "Romanian",
  "Bulgarian", "Lithuanian", "Latvian", "Czech", "Slovak", "Hungarian",
  "Italian", "Spanish", "Portuguese", "Ukrainian", "Russian", "Turkish",
];

function computeCompleteness(
  user: { firstName: string; lastName: string },
  dp: DriverProfile | null,
): number {
  let score = 0;
  if (user.firstName && user.lastName) score += 10;
  if (dp?.phone) score += 10;
  if (dp?.whatsapp) score += 10;
  if (dp?.country) score += 10;
  if (dp?.license_cats?.length) score += 20;
  if (dp?.years_exp !== null && dp?.years_exp !== undefined) score += 10;
  if (dp?.languages?.length) score += 15;
  if (dp?.availability) score += 5;
  if (dp?.bio) score += 10;
  return score;
}

type Tab = "overview" | "settings";
const TABS: Tab[] = ["overview", "settings"];

const TAB_ICONS: Record<Tab, React.ElementType> = {
  overview: LayoutDashboard,
  settings: Settings,
};

const TAB_LABELS: Record<Tab, string> = {
  overview: "Overview",
  settings: "Settings",
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
  const [driverProfile, setDriverProfile] = useState<DriverProfile | null>(null);
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
                  <Image src={user.avatarUrl} alt="avatar" width={32} height={32} className="w-full h-full object-cover" />
                ) : (
                  initial
                )}
              </div>
              <span className="font-semibold text-sm text-white">
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
                <span className="hidden sm:inline">Back to site</span>
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
                  {TAB_LABELS[key]}
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
            user={user}
            driverProfile={driverProfile}
            dpLoading={dpLoading}
            onDriverProfileSaved={setDriverProfile}
            onNameSaved={refreshUser}
            onAvatarSaved={refreshUser}
            setActive={setActive}
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
              <Image src={user.avatarUrl} alt="avatar" width={64} height={64} className="w-full h-full object-cover" />
            ) : (
              (user.firstName?.[0] ?? user.email[0]).toUpperCase()
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              Welcome back, {user.firstName || "there"}!
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">{user.email}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {user.isVerified ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-400 bg-green-400/10 border border-green-400/20 rounded-full px-2.5 py-0.5">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-2.5 py-0.5">
                  Not verified
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
              <p className="text-sm font-bold text-white">Profile completeness</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Complete your driver profile to be visible to employers
              </p>
            </div>
            <span className="text-lg font-bold text-[#36B347]">{completeness}%</span>
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
            Complete profile →
          </button>
        </div>
      )}

      {/* Info grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        <InfoCard
          label="Full name"
          value={`${user.firstName} ${user.lastName}`.trim() || "—"}
        />
        <InfoCard label="Email" value={user.email} />
        <InfoCard
          label="Sign-in method"
          value={user.provider === "local" ? "Email & Password" : user.provider}
        />
        <InfoCard label="Member since" value={joined} />
      </div>

      {/* Quick links */}
      {user.role === "admin" && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
          <h2 className="text-sm font-bold text-slate-300 mb-3">Admin tools</h2>
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
  onNameSaved,
  onAvatarSaved,
}: {
  user: { email: string; provider: string; firstName: string; lastName: string; avatarUrl: string | null };
  driverProfile: DriverProfile | null;
  dpLoading: boolean;
  onDriverProfileSaved: (dp: DriverProfile) => void;
  onNameSaved: () => Promise<void>;
  onAvatarSaved: () => Promise<void>;
  setActive: (tab: Tab) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Profile image */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
        <h2 className="text-base font-bold text-white mb-1">Profile image</h2>
        <p className="text-slate-400 text-sm mb-5">Upload a photo that employers will see.</p>
        <AvatarUpload
          currentUrl={user.avatarUrl}
          initial={(user.firstName?.[0] ?? user.email[0]).toUpperCase()}
          onSaved={onAvatarSaved}
        />
      </div>

      {/* Edit name */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
        <h2 className="text-base font-bold text-white mb-1">Personal details</h2>
        <p className="text-slate-400 text-sm mb-5">Update your display name.</p>
        <EditNameForm
          firstName={user.firstName}
          lastName={user.lastName}
          onSaved={onNameSaved}
        />
      </div>

      {/* Driver profile */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
        <div className="flex items-center gap-2.5 mb-1">
          <Truck className="w-4 h-4 text-[#36B347]" />
          <h2 className="text-base font-bold text-white">Driver profile</h2>
        </div>
        <p className="text-slate-400 text-sm mb-5">
          Fill in your driver details so employers can find and contact you.
        </p>
        {dpLoading ? (
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading…
          </div>
        ) : (
          <DriverProfileForm
            initial={driverProfile}
            onSaved={onDriverProfileSaved}
          />
        )}
      </div>

      {/* Account settings */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
        <h2 className="text-base font-bold text-white mb-1">Account settings</h2>
        <p className="text-slate-400 text-sm mb-6">Manage your account preferences.</p>
        {user.provider === "local" ? (
          <ChangePasswordForm email={user.email} />
        ) : (
          <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-4 text-sm text-slate-400">
            You signed in with{" "}
            <span className="text-white font-medium capitalize">{user.provider}</span>.
            Password management is handled by your sign-in provider.
          </div>
        )}
      </div>
    </div>
  );
}

// ── Avatar Upload ─────────────────────────────────────────────────────────────

function AvatarUpload({
  currentUrl,
  initial,
  onSaved,
}: {
  currentUrl: string | null;
  initial: string;
  onSaved: () => Promise<void>;
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
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm text-white font-semibold transition-colors disabled:opacity-50"
        >
          {uploading ? "Uploading…" : saved ? "Saved ✓" : "Change photo"}
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

// ── Edit Name Form ────────────────────────────────────────────────────────────

function EditNameForm({
  firstName: initFirst,
  lastName: initLast,
  onSaved,
}: {
  firstName: string;
  lastName: string;
  onSaved: () => Promise<void>;
}) {
  const [first, setFirst] = useState(initFirst);
  const [last, setLast] = useState(initLast);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { fetchWithAuth } = await import("@/lib/auth-client");
      const res = await fetchWithAuth("/api/profile/name", {
        method: "PUT",
        body: JSON.stringify({ firstName: first, lastName: last }),
      });
      if (!res.ok) {
        const d = (await res.json()) as { message?: string };
        setError(d.message ?? "Failed to update name.");
        return;
      }
      await onSaved();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#36B347]/50 focus:border-[#36B347]";

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4 max-w-sm">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">First name</label>
          <input
            type="text"
            value={first}
            onChange={(e) => setFirst(e.target.value)}
            required
            className={inputCls}
            placeholder="John"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Last name</label>
          <input
            type="text"
            value={last}
            onChange={(e) => setLast(e.target.value)}
            className={inputCls}
            placeholder="Doe"
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2.5 rounded-xl bg-[#1a7f45] hover:bg-[#36B347] text-white text-sm font-bold transition-colors disabled:opacity-50"
      >
        {loading ? "Saving…" : saved ? "Saved ✓" : "Save name"}
      </button>
    </form>
  );
}

// ── Driver Profile Form ───────────────────────────────────────────────────────

function DriverProfileForm({
  initial,
  onSaved,
}: {
  initial: DriverProfile | null;
  onSaved: (dp: DriverProfile) => void;
}) {
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [whatsapp, setWhatsapp] = useState(initial?.whatsapp ?? "");
  const [country, setCountry] = useState(initial?.country ?? "");
  const [availability, setAvailability] = useState<DriverProfile["availability"]>(
    initial?.availability ?? "available",
  );
  const [licenseCats, setLicenseCats] = useState<string[]>(initial?.license_cats ?? []);
  const [yearsExp, setYearsExp] = useState<string>(
    initial?.years_exp != null ? String(initial.years_exp) : "",
  );
  const [languages, setLanguages] = useState<string[]>(initial?.languages ?? []);
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleItem(arr: string[], set: (v: string[]) => void, val: string) {
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const payload: DriverProfile = {
      phone: phone || null,
      whatsapp: whatsapp || null,
      country: country || null,
      availability,
      license_cats: licenseCats,
      years_exp: yearsExp !== "" ? Number(yearsExp) : null,
      languages,
      bio: bio || null,
    };
    try {
      const { fetchWithAuth } = await import("@/lib/auth-client");
      const res = await fetchWithAuth("/api/profile/driver", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = (await res.json()) as { error?: string; message?: string };
        setError(d.error ?? d.message ?? "Failed to save.");
        return;
      }
      onSaved(payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#36B347]/50 focus:border-[#36B347]";
  const labelCls = "block text-xs text-slate-400 mb-1.5";
  const sectionCls = "pt-5 border-t border-slate-800 space-y-4";

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
      {/* Contact */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>
            <Phone className="inline w-3 h-3 mr-1 opacity-60" />Phone number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputCls}
            placeholder="+31 6 12345678"
          />
        </div>
        <div>
          <label className={labelCls}>
            <Phone className="inline w-3 h-3 mr-1 opacity-60" />WhatsApp number
          </label>
          <input
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className={inputCls}
            placeholder="+31 6 12345678"
          />
        </div>
      </div>

      {/* Location & availability */}
      <div className={sectionCls}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>
              <MapPin className="inline w-3 h-3 mr-1 opacity-60" />Country of residence
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={inputCls}
              placeholder="Netherlands"
            />
          </div>
          <div>
            <label className={labelCls}>Availability</label>
            <div className="flex gap-2 mt-1 flex-wrap">
              {([
                ["available", "Available", "text-green-400 bg-green-400/10 border-green-400/30"],
                ["open", "Open to offers", "text-amber-400 bg-amber-400/10 border-amber-400/30"],
                ["unavailable", "Not available", "text-slate-400 bg-slate-800 border-slate-700"],
              ] as [DriverProfile["availability"], string, string][]).map(([val, lbl, cls]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAvailability(val)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    availability === val ? cls : "text-slate-500 bg-slate-800/50 border-slate-700/50 hover:border-slate-600"
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* License categories */}
      <div className={sectionCls}>
        <div>
          <label className={labelCls}>License categories</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {LICENSE_CATS.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => toggleItem(licenseCats, setLicenseCats, cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                  licenseCats.includes(cat)
                    ? "bg-[#1a7f45] border-[#36B347] text-white"
                    : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Experience */}
      <div className={sectionCls}>
        <div className="max-w-[160px]">
          <label className={labelCls}>Years of experience</label>
          <input
            type="number"
            min={0}
            max={60}
            value={yearsExp}
            onChange={(e) => setYearsExp(e.target.value)}
            className={inputCls}
            placeholder="e.g. 5"
          />
        </div>
      </div>

      {/* Languages */}
      <div className={sectionCls}>
        <div>
          <label className={labelCls}>
            <Globe className="inline w-3 h-3 mr-1 opacity-60" />Languages spoken
          </label>
          <div className="flex flex-wrap gap-2 mt-1">
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => toggleItem(languages, setLanguages, lang)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  languages.includes(lang)
                    ? "bg-[#1a7f45] border-[#36B347] text-white"
                    : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className={sectionCls}>
        <div>
          <label className={labelCls}>Short bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            maxLength={500}
            className={`${inputCls} resize-none`}
            placeholder="Experienced CE driver with 8 years of international freight…"
          />
          <p className="text-xs text-slate-500 mt-1">{bio.length}/500</p>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="px-5 py-2.5 rounded-xl bg-[#1a7f45] hover:bg-[#36B347] text-white text-sm font-bold transition-colors disabled:opacity-50"
      >
        {loading ? "Saving…" : saved ? "Saved ✓" : "Save driver profile"}
      </button>
    </form>
  );
}

function ChangePasswordForm({ email }: { email: string }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const { fetchWithAuth } = await import("@/lib/auth-client");
      const res = await fetchWithAuth("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ email, currentPassword, newPassword }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { message?: string };
        setError(data.message ?? "Failed to change password.");
        return;
      }
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4 max-w-sm">
      <h3 className="text-sm font-bold text-white">Change password</h3>
      <div>
        <label className="block text-xs text-slate-400 mb-1.5">
          Current password
        </label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#36B347]/50 focus:border-[#36B347]"
          placeholder="••••••••"
        />
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-1.5">
          New password
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#36B347]/50 focus:border-[#36B347]"
          placeholder="Min. 8 characters"
        />
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-1.5">
          Confirm new password
        </label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#36B347]/50 focus:border-[#36B347]"
          placeholder="••••••••"
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {success && (
        <p className="text-sm text-green-400">Password updated successfully!</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2.5 rounded-xl bg-[#1a7f45] hover:bg-[#36B347] text-white text-sm font-bold transition-colors disabled:opacity-50"
      >
        {loading ? "Saving…" : "Update password"}
      </button>
    </form>
  );
}
