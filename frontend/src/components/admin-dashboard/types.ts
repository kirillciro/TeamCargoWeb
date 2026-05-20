// Shared types and constants for AdminDashboard and its sub-components

export type Tab =
  | "overview"
  | "users"
  | "emails"
  | "customization"
  | "whatsapp";
export const TABS: Tab[] = [
  "overview",
  "users",
  "emails",
  "customization",
  "whatsapp",
];

export type DriverProfile = {
  phone: string | null;
  whatsapp: string | null;
  country: string | null;
  availability: "available" | "open" | "unavailable";
  license_cats: string[];
  years_exp: number | null;
  languages: string[];
  bio: string | null;
};

export type Stats = {
  totalUsers: number;
  totalVerified: number;
  totalUnverified: number;
};

export type AnalyticsSummary = {
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
  pageViews: number;
  bounceRate: number;
  totalUsers: number;
};

export const SESSION_COLORS = ["#f59e0b", "#8b5cf6", "#38bdf8"];
export const DEVICE_COLORS = ["#f59e0b", "#8b5cf6", "#38bdf8", "#10b981"];

export function formatDuration(seconds: number): string {
  if (seconds < 1) return "0s";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  if (m === 0) return `${s}s`;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}
