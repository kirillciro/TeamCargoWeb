import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Team Cargo — 1 team · 1 missie",
  description:
    "Wij maken onze klanten en die van uw tevreden. Professioneel transport en logistiek.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
