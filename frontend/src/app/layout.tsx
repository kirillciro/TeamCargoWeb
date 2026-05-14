import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import WebVitals from "@/components/WebVitals";

// Allow TypeScript to recognise window.gtag injected by GA4
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://teamcargo.be";

export const metadata: Metadata = {
  title: "Team Cargo — 1 team · 1 missie",
  description:
    "Wij maken onze klanten en die van uw tevreden. Professioneel transport en logistiek.",
  metadataBase: new URL(SITE_URL),
  verification: {
    google: "IhqgWj7hZv7zZOGztKYwiGBAfKhs3Hotk-h6fhuSgPo",
  },
  openGraph: {
    title: "Team Cargo — 1 team · 1 missie",
    description:
      "Wij maken onze klanten en die van uw tevreden. Professioneel transport en logistiek.",
    url: SITE_URL,
    siteName: "Team Cargo",
    images: [
      {
        url: "/teamCargo-trans-webP/cargo-trans-horizontal-1.webp",
        width: 1200,
        height: 630,
        alt: "Team Cargo — transport en logistiek",
      },
    ],
    type: "website",
    locale: "nl_NL",
  },
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
            __html: `try{var c=JSON.parse(localStorage.getItem('tc_brand_colors')||'null');if(c){var r=document.documentElement.style;if(c.brandGreen)r.setProperty('--brand-green',c.brandGreen);if(c.brandMid)r.setProperty('--brand-mid',c.brandMid);if(c.brandDark)r.setProperty('--brand-dark',c.brandDark);if(c.brandBtnText)r.setProperty('--brand-btn-text',c.brandBtnText);if(c.trustBg)r.setProperty('--brand-trust-bg',c.trustBg);if(c.headerBg)r.setProperty('--brand-header-bg',c.headerBg);if(c.footerBg)r.setProperty('--brand-footer-bg',c.footerBg);}}catch(e){}try{var h=JSON.parse(localStorage.getItem('tc_hero_overrides')||'null');if(h){var r=document.documentElement.style;if(h.trustBg)r.setProperty('--brand-trust-bg',h.trustBg);if(h.partnersBg)r.setProperty('--brand-partner-bg',h.partnersBg);}}catch(e){}try{var f=JSON.parse(localStorage.getItem('tc_brand_font')||'null');if(f){if(f.family){document.documentElement.style.setProperty('--brand-font-family',f.family);}if(f.letterSpacing){document.documentElement.style.setProperty('--brand-letter-spacing',f.letterSpacing);}if(f.lineHeight){document.documentElement.style.setProperty('--brand-line-height',f.lineHeight);}if(f.fontWeight){document.documentElement.style.setProperty('--brand-font-weight',f.fontWeight);}if(f.google){var l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family='+f.google+'&display=swap';document.head.appendChild(l);}}}catch(e){}`,
          }}
        />
        {children}
        <WebVitals />
        {/* ── Google Analytics 4 ── load on first user interaction (or 6s idle) to keep TBT minimal */}
        <Script
          id="ga4-defer"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){var loaded=false;function load(){if(loaded)return;loaded=true;cleanup();var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=G-17RWXXE1Y6';document.head.appendChild(s);window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments);};window.gtag('js',new Date());window.gtag('config','G-17RWXXE1Y6');}function cleanup(){window.removeEventListener('scroll',load);window.removeEventListener('pointerdown',load);window.removeEventListener('keydown',load);}window.addEventListener('scroll',load,{passive:true,once:true});window.addEventListener('pointerdown',load,{passive:true,once:true});window.addEventListener('keydown',load,{once:true});setTimeout(load,6000);})();`,
          }}
        />
      </body>
    </html>
  );
}
