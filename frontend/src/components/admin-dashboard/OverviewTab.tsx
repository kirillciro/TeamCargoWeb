"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  MousePointer2,
  UserCheck,
  Monitor,
  Smartphone,
  Tablet,
  Loader2,
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
import { fetchWithAuth } from "@/lib/auth-client";
import type { Dictionary } from "@/lib/getDictionary";
import {
  type Stats,
  type AnalyticsSummary,
  SESSION_COLORS,
  DEVICE_COLORS,
  formatDuration,
} from "./types";
import { Win98Progress, Win98Table } from "./Win98Helpers";

// ── Chart tooltip components ──────────────────────────────────────────────────

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

// ── StatCard ──────────────────────────────────────────────────────────────────

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

// ── AdminOverviewTab ──────────────────────────────────────────────────────────

export default function AdminOverviewTab({
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
      {/* ── Header (modern only) ── */}
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
              .w98a-top { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px; align-items: stretch; }
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

                {/* At a Glance */}
                <div style={{ ...GRP }}>
                  <span style={GRP_LBL}>At a Glance (30 days)</span>
                  {analytics ? (
                    <>
                      {KV("Page Views", analytics.pageViews.toLocaleString())}
                      {KV(
                        "Bounce Rate",
                        `${Math.round(analytics.bounceRate * 100)}%`,
                      )}
                      {KV(
                        "Unique Visitors",
                        analytics.totalUsers.toLocaleString(),
                        true,
                      )}
                    </>
                  ) : (
                    <span style={{ fontSize: 11, color: "#808080" }}>
                      No GA4 data
                    </span>
                  )}
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

              {/* Traffic Sources | Top Countries | Top Pages | Devices — 4-col row */}
              {analytics && (
                <div className="w98a-top">
                  {/* Traffic Sources */}
                  <div style={{ ...GRP }}>
                    <span style={GRP_LBL}>Traffic Sources</span>
                    <Win98Table
                      rows={analytics.trafficSources.map((t) => [
                        t.source,
                        t.sessions.toLocaleString(),
                      ])}
                      headers={["Source", "Sessions"]}
                    />
                  </div>

                  {/* Top Countries */}
                  <div style={{ ...GRP }}>
                    <span style={GRP_LBL}>Top Countries</span>
                    <Win98Table
                      rows={analytics.topCountries.map((c) => [
                        c.country,
                        c.sessions.toLocaleString(),
                      ])}
                      headers={["Country", "Sessions"]}
                    />
                  </div>

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
              {/* ── At a Glance ── */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                      At a Glance
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Key website metrics for the last 30 days
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-600 font-medium shrink-0 mt-0.5">
                    30 days
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Page Views */}
                  <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 px-4 py-3.5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl bg-orange-400" />
                    <p className="text-[11px] text-slate-500 uppercase tracking-wide mb-2">
                      Page Views
                    </p>
                    <p className="text-3xl font-bold tabular-nums tracking-tight text-orange-300">
                      {analytics.pageViews.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-600 mt-1">
                      total page loads
                    </p>
                  </div>
                  {/* Bounce Rate */}
                  <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 px-4 py-3.5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl bg-rose-400" />
                    <p className="text-[11px] text-slate-500 uppercase tracking-wide mb-2">
                      Bounce Rate
                    </p>
                    <p className="text-3xl font-bold tabular-nums tracking-tight text-rose-300">
                      {Math.round(analytics.bounceRate * 100)}%
                    </p>
                    <div className="mt-2 h-1 rounded-full bg-slate-700 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-rose-400/60 transition-all duration-700"
                        style={{
                          width: `${Math.round(analytics.bounceRate * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  {/* GA4 Unique Users */}
                  <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 px-4 py-3.5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl bg-teal-400" />
                    <p className="text-[11px] text-slate-500 uppercase tracking-wide mb-2">
                      Unique Visitors
                    </p>
                    <p className="text-3xl font-bold tabular-nums tracking-tight text-teal-300">
                      {analytics.totalUsers.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-600 mt-1">
                      GA4 unique users
                    </p>
                  </div>
                </div>
              </div>

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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

              {/* ── Top Pages (full width) ── */}
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
                      width={120}
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

              {/* ── Audience: Traffic Sources | Top Countries | Devices (3 col) ── */}
              <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-4">
                {/* Traffic Sources */}
                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                        Traffic Sources
                      </p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Where visitors come from
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-600 font-medium shrink-0 mt-0.5">
                      30 days
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {(() => {
                      const total = analytics.trafficSources.reduce(
                        (s, t) => s + t.sessions,
                        0,
                      );
                      return analytics.trafficSources.map((t, i) => {
                        const pct =
                          total > 0
                            ? Math.round((t.sessions / total) * 100)
                            : 0;
                        return (
                          <div key={i}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm text-slate-300 flex-1 truncate">
                                {t.source}
                              </span>
                              <span className="text-xs font-bold tabular-nums text-violet-300">
                                {pct}%
                              </span>
                              <span className="text-xs text-slate-600 tabular-nums w-6 text-right shrink-0">
                                {t.sessions}
                              </span>
                            </div>
                            <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-violet-400/60 transition-all duration-700"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Top Countries */}
                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                        Top Countries
                      </p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Geographic breakdown
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
                      <div className="space-y-2.5">
                        {analytics.topCountries.map((c, i) => {
                          const pct =
                            total > 0
                              ? Math.round((c.sessions / total) * 100)
                              : 0;
                          const opacity = 1 - i * 0.09;
                          return (
                            <div key={c.country}>
                              <div className="flex items-center gap-2 mb-1">
                                <MapPin className="w-3 h-3 text-slate-600 shrink-0" />
                                <span className="text-sm text-slate-300 flex-1 truncate">
                                  {c.country}
                                </span>
                                <span className="text-sm font-bold tabular-nums text-slate-300">
                                  {pct}%
                                </span>
                                <span className="text-xs text-slate-600 tabular-nums w-6 text-right shrink-0">
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

                {/* Devices */}
                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                        Devices
                      </p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Device type breakdown
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-600 font-medium shrink-0 mt-0.5">
                      30 days
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-5">
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
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <p className="text-2xl font-bold text-white tabular-nums leading-none">
                          {totalDeviceSessions.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
                          sessions
                        </p>
                      </div>
                    </div>
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
