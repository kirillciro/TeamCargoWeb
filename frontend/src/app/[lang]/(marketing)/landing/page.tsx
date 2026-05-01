import { getDictionary } from "@/lib/getDictionary";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import HousingSection from "@/components/HousingSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <HeroSection dict={dict} lang={lang} />
      <ServicesSection dict={dict} lang={lang} />
      <AboutSection dict={dict} lang={lang} />
      <HousingSection dict={dict} lang={lang} />
      <ContactSection dict={dict} lang={lang} />
      <Footer lang={lang} dict={dict} />
    </>
  );
}
