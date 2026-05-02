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
  Monitor,
  Smartphone,
  Tablet,
  Clock,
  MapPin,
  MousePointer2,
  UserCheck,
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
                overview: "Analytics",
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

function AdminOverviewTab({ dict }: { dict: Dictionary }) {
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
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Analytics</h2>
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
                      <stop offset="100%" stopColor={c} stopOpacity={0.25} />
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
                    style={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
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
                <p className="text-[10px] text-slate-600 mt-1">per session</p>
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
                    Where visitors come from — search, direct, referral, or ads
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
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} />
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
                  <Bar dataKey="sessions" radius={[0, 6, 6, 0]} fill="url(#tg)">
                    <LabelList
                      dataKey="sessions"
                      position="right"
                      style={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }}
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
                        total > 0 ? Math.round((c.sessions / total) * 100) : 0;
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
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9} />
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
                  <Bar dataKey="sessions" radius={[0, 6, 6, 0]} fill="url(#pg)">
                    <LabelList
                      dataKey="sessions"
                      position="right"
                      style={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }}
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
