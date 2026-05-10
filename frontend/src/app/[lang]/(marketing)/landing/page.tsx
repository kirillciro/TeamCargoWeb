import type { Metadata } from "next";
import { getDictionary } from "@/lib/getDictionary";
import { languages } from "@/lib/i18n";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import HousingSection from "@/components/HousingSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://teamcargo.be";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const canonical = `${SITE_URL}/${lang}/landing`;

  return {
    title: `Team Cargo — ${dict.hero.slogan}`,
    description: dict.hero.tagline,
    alternates: {
      canonical,
      languages: Object.fromEntries(
        languages.map((l) => [l, `${SITE_URL}/${l}/landing`]),
      ),
    },
    openGraph: {
      title: `Team Cargo — ${dict.hero.slogan}`,
      description: dict.hero.tagline,
      url: canonical,
      locale: lang,
    },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      {/* Preload the LCP hero image before the client component hydrates */}
      <link
        rel="preload"
        as="image"
        href="/teamCargo-trans-webP/cargo-trans-horizontal-3.webp"
        // @ts-expect-error – fetchpriority is valid but not yet in @types/react
        fetchpriority="high"
        media="(min-width: 768px)"
      />
      <link
        rel="preload"
        as="image"
        href="/teamCargo-trans-webP/cargo-trans-vertical-3.webp"
        // @ts-expect-error – fetchpriority is valid but not yet in @types/react
        fetchpriority="high"
        media="(max-width: 767px)"
      />
      <HeroSection dict={dict} lang={lang} />
      <ServicesSection dict={dict} lang={lang} />
      <AboutSection dict={dict} lang={lang} />
      <HousingSection dict={dict} lang={lang} />
      <ContactSection dict={dict} lang={lang} />
      <Footer lang={lang} dict={dict} />
    </>
  );
}
