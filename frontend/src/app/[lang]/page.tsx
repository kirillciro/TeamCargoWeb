import { getDictionary } from "@/lib/getDictionary";
import { isSupportedLanguage, defaultLang } from "@/lib/i18n";
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
      <Header lang={resolvedLang} dict={dict} />
      <main className="flex-1">
        <HeroSection dict={dict} lang={resolvedLang} />
        <ServicesSection dict={dict} lang={resolvedLang} />
        <AboutSection dict={dict} lang={resolvedLang} />
        <HousingSection dict={dict} lang={resolvedLang} />
        <ContactSection dict={dict} />
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
