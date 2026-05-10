import { notFound } from "next/navigation";
import { isSupportedLanguage, languages } from "@/lib/i18n";
import SetLang from "@/components/SetLang";

export function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isSupportedLanguage(lang)) {
    notFound();
  }

  // Patch <html lang> at the earliest possible moment so crawlers and
  // screen-readers always see the correct language code. The root layout
  // hardcodes lang="nl" because Next.js requires <html> there; this inline
  // script overrides it synchronously before first paint — same pattern as
  // the brand-color injection already used in the root layout.
  return (
    <>
      <SetLang lang={lang} />
      {children}
    </>
  );
}
