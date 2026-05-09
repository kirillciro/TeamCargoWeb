"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Settings,
  ArrowLeft,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { Dictionary } from "@/lib/getDictionary";

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
  const { user, loading, logout } = useAuth();
  const initialTab = (searchParams.get("tab") as Tab | null) ?? "overview";
  const [active, setActive] = useState<Tab>(
    TABS.includes(initialTab as Tab) ? (initialTab as Tab) : "overview",
  );

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/${lang}`);
    }
  }, [user, loading, lang, router]);

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
    <div data-profile className="min-h-screen bg-slate-950 text-white pt-20 sm:pt-24">
      {/* ── Top bar ── */}
      <div className="sticky top-16 sm:top-20 z-20 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Brand row */}
          <div className="h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#1a7f45] to-[#36B347] flex items-center justify-center text-sm font-bold text-white shrink-0">
                {initial}
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
          <ProfileOverview user={user} lang={lang} dict={dict} />
        )}
        {active === "settings" && <ProfileSettings user={user} />}
      </div>
    </div>
  );
}

// ── Overview Tab ─────────────────────────────────────────────────────────────

function ProfileOverview({
  user,
  lang,
  dict,
}: {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isVerified: boolean;
    provider: string;
    createdAt: string;
  };
  lang: string;
  dict: Dictionary;
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
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#1a7f45] to-[#36B347] flex items-center justify-center text-2xl font-bold text-white shrink-0">
            {(user.firstName?.[0] ?? user.email[0]).toUpperCase()}
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
}: {
  user: { email: string; provider: string };
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
        <h2 className="text-base font-bold text-white mb-1">
          Account settings
        </h2>
        <p className="text-slate-400 text-sm mb-6">
          Manage your account preferences.
        </p>

        {user.provider === "local" ? (
          <ChangePasswordForm email={user.email} />
        ) : (
          <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-4 text-sm text-slate-400">
            You signed in with{" "}
            <span className="text-white font-medium capitalize">
              {user.provider}
            </span>
            . Password management is handled by your sign-in provider.
          </div>
        )}
      </div>
    </div>
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
