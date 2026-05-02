/**
 * GA4 Analytics helper — uses the Google Analytics Data API v1beta
 * via the `googleapis` package (already in dependencies).
 *
 * Auth: OAuth 2.0 with a stored refresh token (no service-account key needed).
 * Run `node get-ga4-token.mjs` once to get your refresh token.
 *
 * Required env vars:
 *   GA4_PROPERTY_ID     – numeric property ID (GA4 Admin → Property Settings)
 *   GA4_CLIENT_ID       – OAuth 2.0 client ID  (GCP → Credentials)
 *   GA4_CLIENT_SECRET   – OAuth 2.0 client secret
 *   GA4_REFRESH_TOKEN   – from running get-ga4-token.mjs
 */

import { google } from "googleapis";

// ── Types ─────────────────────────────────────────────────────────────────

export type AnalyticsSummary = {
  sessions: {
    today: number;
    week: number;
    month: number;
  };
  activeUsers: number; // realtime: active users in last 30 minutes
  topPages: { path: string; sessions: number }[];
  deviceCategory: { category: string; sessions: number }[];
  trafficSources: { source: string; sessions: number }[];
  topCountries: { country: string; sessions: number }[];
  engagement: {
    avgSessionDuration: number; // seconds (float)
    engagementRate: number; // 0–1
    newUsersRate: number; // 0–1
  };
};

// ── Auth ──────────────────────────────────────────────────────────────────

function getAuth() {
  const clientId = process.env.GA4_CLIENT_ID;
  const clientSecret = process.env.GA4_CLIENT_SECRET;
  const refreshToken = process.env.GA4_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "GA4 env vars not set. Required: GA4_CLIENT_ID, GA4_CLIENT_SECRET, GA4_REFRESH_TOKEN",
    );
  }

  const oauth2 = new google.auth.OAuth2(clientId, clientSecret);
  oauth2.setCredentials({ refresh_token: refreshToken });
  return oauth2;
}

function propertyId() {
  const id = process.env.GA4_PROPERTY_ID;
  if (!id) throw new Error("GA4_PROPERTY_ID env var not set");
  return `properties/${id}`;
}

function metricVal(
  rows: { metricValues?: { value?: string }[] }[] | null | undefined,
  rowIndex = 0,
  metricIndex = 0,
): number {
  return parseInt(
    rows?.[rowIndex]?.metricValues?.[metricIndex]?.value ?? "0",
    10,
  );
}

// ── Main export ───────────────────────────────────────────────────────────

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const auth = getAuth();
  const data = google.analyticsdata({ version: "v1beta", auth });
  const property = propertyId();

  // Run all queries in parallel
  const [
    todayRes,
    weekRes,
    monthRes,
    pagesRes,
    devicesRes,
    realtimeRes,
    sourcesRes,
    countriesRes,
    engagementRes,
    newVsRetRes,
  ] = await Promise.all([
    // Sessions today
    data.properties.runReport({
      property,
      requestBody: {
        dateRanges: [{ startDate: "today", endDate: "today" }],
        metrics: [{ name: "sessions" }],
      },
    }),
    // Sessions this week (last 7 days)
    data.properties.runReport({
      property,
      requestBody: {
        dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
        metrics: [{ name: "sessions" }],
      },
    }),
    // Sessions this month (last 30 days)
    data.properties.runReport({
      property,
      requestBody: {
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        metrics: [{ name: "sessions" }],
      },
    }),
    // Top 8 pages by sessions (last 30 days)
    data.properties.runReport({
      property,
      requestBody: {
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 8,
      },
    }),
    // Device category breakdown (last 30 days)
    data.properties.runReport({
      property,
      requestBody: {
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "deviceCategory" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      },
    }),
    // Realtime active users
    data.properties.runRealtimeReport({
      property,
      requestBody: {
        metrics: [{ name: "activeUsers" }],
      },
    }),
    // Traffic sources — sessionSourceMedium (last 30 days, top 8)
    data.properties.runReport({
      property,
      requestBody: {
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "sessionSourceMedium" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 8,
      },
    }),
    // Top countries (last 30 days, top 8)
    data.properties.runReport({
      property,
      requestBody: {
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "country" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 8,
      },
    }),
    // Engagement metrics (last 30 days)
    data.properties.runReport({
      property,
      requestBody: {
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        metrics: [
          { name: "averageSessionDuration" },
          { name: "engagementRate" },
        ],
      },
    }),
    // New vs returning (last 30 days)
    data.properties.runReport({
      property,
      requestBody: {
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "newVsReturning" }],
        metrics: [{ name: "sessions" }],
      },
    }),
  ]);

  const topPages = (pagesRes.data.rows ?? []).map((r) => ({
    path: r.dimensionValues?.[0]?.value ?? "/",
    sessions: parseInt(r.metricValues?.[0]?.value ?? "0", 10),
  }));

  const deviceCategory = (devicesRes.data.rows ?? []).map((r) => ({
    category: r.dimensionValues?.[0]?.value ?? "unknown",
    sessions: parseInt(r.metricValues?.[0]?.value ?? "0", 10),
  }));

  // Normalise "source / medium" labels
  const trafficSources = (sourcesRes.data.rows ?? []).map((r) => {
    const raw = r.dimensionValues?.[0]?.value ?? "unknown / none";
    const label = raw
      .replace("(direct) / (none)", "Direct")
      .replace("google / organic", "Google Organic")
      .replace("google / cpc", "Google Ads")
      .replace("bing / organic", "Bing Organic")
      .replace(" / (none)", "")
      .replace(" / referral", " (referral)");
    return {
      source: label,
      sessions: parseInt(r.metricValues?.[0]?.value ?? "0", 10),
    };
  });

  const topCountries = (countriesRes.data.rows ?? []).map((r) => ({
    country: r.dimensionValues?.[0]?.value ?? "Unknown",
    sessions: parseInt(r.metricValues?.[0]?.value ?? "0", 10),
  }));

  const avgSessionDuration = parseFloat(
    engagementRes.data.rows?.[0]?.metricValues?.[0]?.value ?? "0",
  );
  const engagementRate = parseFloat(
    engagementRes.data.rows?.[0]?.metricValues?.[1]?.value ?? "0",
  );

  const newVsRetRows = newVsRetRes.data.rows ?? [];
  const newSessions = newVsRetRows
    .filter((r) => r.dimensionValues?.[0]?.value === "new")
    .reduce((s, r) => s + parseInt(r.metricValues?.[0]?.value ?? "0", 10), 0);
  const totalNvR = newVsRetRows.reduce(
    (s, r) => s + parseInt(r.metricValues?.[0]?.value ?? "0", 10),
    0,
  );
  const newUsersRate = totalNvR > 0 ? newSessions / totalNvR : 0;

  return {
    sessions: {
      today: metricVal(todayRes.data.rows),
      week: metricVal(weekRes.data.rows),
      month: metricVal(monthRes.data.rows),
    },
    activeUsers: metricVal(realtimeRes.data.rows),
    topPages,
    deviceCategory,
    trafficSources,
    topCountries,
    engagement: { avgSessionDuration, engagementRate, newUsersRate },
  };
}
