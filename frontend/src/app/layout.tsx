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
    <html lang="nl" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {/* Apply saved brand colors before first paint — prevents flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var c=JSON.parse(localStorage.getItem('tc_brand_colors')||'null');if(c){var r=document.documentElement.style;if(c.brandGreen)r.setProperty('--brand-green',c.brandGreen);if(c.brandMid)r.setProperty('--brand-mid',c.brandMid);if(c.brandDark)r.setProperty('--brand-dark',c.brandDark);if(c.brandBtnText)r.setProperty('--brand-btn-text',c.brandBtnText);if(c.trustBg)r.setProperty('--brand-trust-bg',c.trustBg);}}catch(e){}try{var h=JSON.parse(localStorage.getItem('tc_hero_overrides')||'null');if(h){var r=document.documentElement.style;if(h.trustBg)r.setProperty('--brand-trust-bg',h.trustBg);if(h.partnersBg)r.setProperty('--brand-partner-bg',h.partnersBg);}}catch(e){}`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
