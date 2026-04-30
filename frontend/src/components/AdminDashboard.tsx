"use client";

import { useCallback, useEffect, useState } from "react";
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
} from "lucide-react";
import AdminEmailsTab from "@/components/AdminEmailsTab";
import AdminCustomizationTab from "@/components/AdminCustomizationTab";
import { useAuth } from "@/context/AuthContext";
import { fetchWithAuth, type AuthUser } from "@/lib/auth-client";
import type { Dictionary } from "@/lib/getDictionary";

type Tab = "overview" | "users" | "emails" | "customization";
const TABS: Tab[] = ["overview", "users", "emails", "customization"];

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

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "admin") {
      router.replace(`/${lang}`);
    }
  }, [user, loading, lang, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-16 sm:pt-20 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "admin") return null;

  const initial = (user.firstName?.[0] ?? user.email[0]).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-16 sm:pt-20">
      {/* ── Top bar ── */}
      <div className="sticky top-16 sm:top-20 z-20 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Brand row */}
          <div className="h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-amber-400 to-amber-500 flex items-center justify-center text-sm font-bold text-amber-900 shrink-0">
                {initial}
              </div>
              <span className="font-semibold text-sm text-white">
                {dict.nav.admin_dashboard}
              </span>
              <span className="hidden sm:inline text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/30 uppercase tracking-wide">
                Admin
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/${lang}/profile`}
                className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                {dict.nav.my_profile}
              </Link>
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
                  {dict.admin.back_to_site}
                </span>
              </Link>
            </div>
          </div>

          {/* Tab row */}
          <div className="flex gap-0 -mb-px overflow-x-auto">
            {TABS.map((key) => {
              const Icon = TAB_ICONS[key];
              const tabLabel = {
                overview: dict.admin.tab_overview,
                users: dict.admin.tab_users,
                emails: dict.admin.tab_emails,
                customization: dict.admin.tab_customization,
              }[key];
              return (
                <button
                  key={key}
                  onClick={() => setActive(key)}
                  className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    active === key
                      ? "border-amber-400 text-amber-400"
                      : "border-transparent text-slate-400 hover:text-white hover:border-slate-600"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tabLabel}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {active === "overview" && <AdminOverviewTab dict={dict} />}
        {active === "users" && (
          <AdminUsersTab currentUserId={user.id} dict={dict} />
        )}
        {active === "emails" && <AdminEmailsTab dict={dict} />}
        {active === "customization" && <AdminCustomizationTab dict={dict} />}
      </div>
    </div>
  );
}

// ── Overview Tab ─────────────────────────────────────────────────────────────

type Stats = {
  totalUsers: number;
  totalVerified: number;
  totalUnverified: number;
};

function AdminOverviewTab({ dict }: { dict: Dictionary }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetchWithAuth("/api/admin/stats");
        if (!res.ok) throw new Error("Failed to load stats");
        const data = (await res.json()) as Stats;
        setStats(data);
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

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white">
        {dict.admin.overview_title}
      </h2>
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard
          icon={Users}
          label={dict.admin.stat_total_users}
          value={stats.totalUsers}
          color="text-blue-400"
          bg="bg-blue-400/10 border-blue-400/20"
        />
        <StatCard
          icon={CheckCircle}
          label={dict.admin.stat_verified}
          value={stats.totalVerified}
          color="text-green-400"
          bg="bg-green-400/10 border-green-400/20"
        />
        <StatCard
          icon={XCircle}
          label={dict.admin.stat_unverified}
          value={stats.totalUnverified}
          color="text-yellow-400"
          bg="bg-yellow-400/10 border-yellow-400/20"
        />
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <div
      className={`rounded-2xl bg-slate-900 border border-slate-800 p-5 flex items-center gap-4`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center border ${bg}`}
      >
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

// ── Users Tab ────────────────────────────────────────────────────────────────

function AdminUsersTab({
  currentUserId,
  dict,
}: {
  currentUserId: number;
  dict: Dictionary;
}) {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true); // start as loading — avoids setState in effect
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

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

  return (
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
                <th className="px-4 py-3 text-center">
                  {dict.admin.col_status}
                </th>
                <th className="px-4 py-3 text-center">{dict.admin.col_role}</th>
                <th className="px-4 py-3 text-center">
                  {dict.admin.col_actions}
                </th>
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
                  <td className="px-4 py-3 text-center">
                    {u.isVerified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-400 bg-green-400/10 border border-green-400/20 rounded-full px-2 py-0.5">
                        <CheckCircle className="w-3 h-3" />{" "}
                        {dict.admin.badge_verified}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-2 py-0.5">
                        <XCircle className="w-3 h-3" />{" "}
                        {dict.admin.badge_pending}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      disabled={updatingId === u.id || u.id === currentUserId}
                      onClick={() => void toggleRole(u)}
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold rounded-full px-2.5 py-0.5 border transition-all disabled:opacity-40 ${
                        u.role === "admin"
                          ? "text-amber-400 bg-amber-400/10 border-amber-400/30 hover:bg-amber-400/20"
                          : "text-slate-400 bg-slate-700/50 border-slate-600 hover:text-white"
                      }`}
                      title={
                        u.id === currentUserId
                          ? dict.admin.cannot_change_own_role
                          : dict.admin.toggle_role
                      }
                    >
                      {updatingId === u.id ? (
                        <Loader2 className="w-2.5 h-2.5 animate-spin" />
                      ) : u.role === "admin" ? (
                        <ShieldCheck className="w-2.5 h-2.5" />
                      ) : (
                        <ShieldOff className="w-2.5 h-2.5" />
                      )}
                      {u.role === "admin"
                        ? dict.admin.role_admin
                        : dict.admin.role_user}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
