import type { Metadata } from "next";
import { getDictionary } from "@/lib/getDictionary";
import { isSupportedLanguage, defaultLang, languages } from "@/lib/i18n";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import AuthModal from "@/components/AuthModal";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import HousingSection from "@/components/HousingSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import VerifiedBanner from "@/components/VerifiedBanner";
import { Suspense } from "react";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://teamcargo.be";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const resolvedLang = isSupportedLanguage(lang) ? lang : defaultLang;
  const dict = await getDictionary(resolvedLang);

  const title = `Team Cargo — ${dict.hero.slogan}`;
  const description = dict.hero.description ?? "Professioneel transport en logistiek.";
  const canonical = `${SITE_URL}/${resolvedLang}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: Object.fromEntries(
        languages.map((l) => [l, `${SITE_URL}/${l}`]),
      ),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      locale: resolvedLang,
    },
  };
}

export default async function LangRootPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const resolvedLang = isSupportedLanguage(lang) ? lang : defaultLang;
  const dict = await getDictionary(resolvedLang);

  return (
    <AuthProvider>
      {/* JSON-LD: LocalBusiness structured data for Google rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Team Cargo",
            description:
              "Professioneel transport en logistiek.",
            url: SITE_URL,
            logo: `${SITE_URL}/logo.svg`,
            "@id": SITE_URL,
          }),
        }}
      />
      <Header lang={resolvedLang} dict={dict} />
      <main className="flex-1">
        <HeroSection dict={dict} lang={resolvedLang} />
        <ServicesSection dict={dict} lang={resolvedLang} />
        <AboutSection dict={dict} lang={resolvedLang} />
        <HousingSection dict={dict} lang={resolvedLang} />
        <ContactSection dict={dict} lang={resolvedLang} />
        <Footer lang={resolvedLang} dict={dict} />
      </main>
      <AuthModal dict={dict} />
      <CookieBanner lang={resolvedLang} dict={dict} />
      <Suspense>
        <VerifiedBanner dict={dict} />
      </Suspense>
    </AuthProvider>
  );
}
